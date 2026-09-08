import axios from 'axios';
import { MOCK_PROJECTS, DASHBOARD_STATS, EARLY_WARNING_ALERTS } from '../data/mockData';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    const clean = envUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000/api';
    }
    // In browser on deployed host (e.g. Vercel), use relative '/api' so Vercel rewrites proxy all requests seamlessly
    return '/api';
  }
  return 'https://drishti-ai-r9gq.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach JWT token from localStorage to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drishti_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const isAuthPath = window.location.pathname.includes('/login') || 
                         window.location.pathname.includes('/register') || 
                         window.location.pathname.includes('/forgot-password');
      if (!isAuthPath && localStorage.getItem('drishti_auth_token')) {
        localStorage.removeItem('drishti_auth_token');
        localStorage.removeItem('drishti_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Centralized API Service for DRISHTI AI
export const api = {
  // 1. Prediction API
  predictRisk: async (projectData) => {
    try {
      const response = await apiClient.post('/predict/risk', projectData);
      return { success: true, data: response.data, source: 'ML_API' };
    } catch (error) {
      console.warn('API predict/risk unreachable, using local fallback:', error.message);
      // Fallback local ML computation
      const orig = Number(projectData.Original_Cost_Cr) || 1000;
      const cum = Number(projectData.Cumulative_Expenditure_Cr) || 800;
      const phys = Number(projectData.Physical_Progress_Pct) || 50;
      const expPct = Number(projectData.Expenditure_Pct_of_Original_Cost) || (cum / orig) * 100;
      
      const diff = expPct - phys;
      const costProb = Math.min(99.9, Math.max(5.0, 35.0 + diff * 0.72 + (expPct > 85 ? 18.0 : 0.0)));
      const timeProb = Math.min(99.0, Math.max(5.0, 40.0 + diff * 0.65 + (100 - phys) * 0.35));
      const overall = Number(((costProb + timeProb) / 2).toFixed(2));
      const isCostOverrun = costProb >= 40.0 ? 1 : 0;
      
      let level = 'LOW';
      if (overall >= 80) level = 'CRITICAL';
      else if (overall >= 50) level = 'HIGH';
      else if (overall >= 25) level = 'MEDIUM';

      const overrunCr = isCostOverrun ? Number(Math.max(0, cum - orig + (orig * 0.15)).toFixed(2)) : null;

      return {
        success: true,
        data: {
          project_id: projectData.project_id || '701410',
          project_name: projectData.project_name || 'Infrastructure Asset',
          cost_overrun_probability: Number(costProb.toFixed(2)),
          predicted_cost_overrun: isCostOverrun,
          time_overrun_probability: Number(timeProb.toFixed(2)),
          predicted_time_overrun: timeProb >= 50.0 ? 1 : 0,
          overall_risk_score: overall,
          risk_level: level,
          predicted_cost_overrun_cr: overrunCr,
          estimated_revised_cost_cr: overrunCr ? Number((orig + overrunCr).toFixed(2)) : null,
          predicted_delay_days: Math.round((100 - phys) * 8.5),
          warnings: overall >= 80 ? ['Project requires immediate priority review based on elevated AI-assessed risk.'] : [],
          model_version: '4.2.0',
          execution_mode: 'LOCAL_CALIBRATED'
        },
        source: 'LOCAL_FALLBACK'
      };
    }
  },

  // 2. Batch Prediction API
  predictBatch: async (projectsList) => {
    try {
      const response = await apiClient.post('/predict/batch', { projects: projectsList });
      return { success: true, data: response.data };
    } catch (error) {
      console.warn('API predict/batch unreachable:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 3. Dashboard KPI Summary
  getDashboardSummary: async (params = {}) => {
    try {
      const response = await apiClient.get('/dashboard/summary', { params });
      return { success: true, data: response.data, source: 'API' };
    } catch (error) {
      console.warn('API dashboard/summary unreachable, using local store:', error.message);
      return { success: true, data: DASHBOARD_STATS, source: 'LOCAL' };
    }
  },

  // 4. Projects Listing with Filters
  getProjects: async (params = {}) => {
    try {
      const response = await apiClient.get('/projects', { params });
      return { success: true, data: response.data.projects, total: response.data.total, source: 'API' };
    } catch (error) {
      console.warn('API /projects unreachable, using local repository:', error.message);
      return { success: true, data: MOCK_PROJECTS, total: MOCK_PROJECTS.length, source: 'LOCAL' };
    }
  },

  // 5. Project Details & Live SHAP
  getProjectById: async (projectId) => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`);
      return { success: true, data: response.data, source: 'API' };
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 404)) {
        return {
          success: false,
          status: error.response.status,
          error: error.response.data?.detail || (error.response.status === 403 ? 'Access forbidden.' : 'Project not found.')
        };
      }
      console.warn(`API /projects/${projectId} unreachable:`, error.message);
      return { success: false, status: 500, error: error.message || 'Service unavailable' };
    }
  },

  // 6. High-Risk Ranked Assets
  getHighRiskProjects: async (params = {}) => {
    try {
      const response = await apiClient.get('/risk/high-risk', { params });
      return { success: true, data: response.data.highRiskProjects, total: response.data.total, source: 'API' };
    } catch (error) {
      console.warn('API /risk/high-risk unreachable:', error.message);
      return { success: false, data: [], total: 0, error: error.message };
    }
  },

  // 7. Explainability / SHAP API
  getExplanation: async (projectId) => {
    try {
      const response = await apiClient.get(`/explain/${projectId}`);
      return { success: true, data: response.data, source: 'API' };
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 404)) {
        return {
          success: false,
          status: error.response.status,
          error: error.response.data?.detail || 'Explanation unauthorized.'
        };
      }
      console.warn(`API /explain/${projectId} unreachable:`, error.message);
      return { success: false, error: error.message };
    }
  },

  // 8. Model Information & Metrics
  getModelInfo: async () => {
    try {
      const response = await apiClient.get('/model/info');
      return { success: true, data: response.data, source: 'API' };
    } catch (error) {
      return {
        success: true,
        data: {
          cost_model: {
            model_type: 'XGBClassifier (Extreme Gradient Boosting)',
            version: '4.2.0',
            threshold: 0.40,
            features: ['Original_Cost_Cr', 'Cumulative_Expenditure_Cr', 'Physical_Progress_Pct', 'Expenditure_Pct_of_Original_Cost', 'Ministry', 'Sector', 'State'],
            roc_auc: 0.8524,
            accuracy_at_threshold_0_4: '82.91%',
            precision: '70.00%',
            recall: '65.42%',
            f1_score: '67.63%',
            status: 'Production Calibrated'
          },
          time_model: {
            model_type: 'RandomForestClassifier Pipeline',
            version: '4.2.0',
            features: ['Original_Cost_Cr', 'Cumulative_Expenditure_Cr', 'Physical_Progress_Pct', 'Expenditure_Pct_of_Original_Cost', 'Ministry', 'Sector', 'State'],
            roc_auc: 0.8410,
            accuracy: '81.45%',
            status: 'Production Calibrated'
          },
          system_status: 'Operational',
          active_features: ['Original_Cost_Cr', 'Cumulative_Expenditure_Cr', 'Physical_Progress_Pct', 'Expenditure_Pct_of_Original_Cost', 'Ministry', 'Sector', 'State']
        },
        source: 'LOCAL'
      };
    }
  },

  // 9. Alerts Listing
  getAlerts: async (params = {}) => {
    try {
      const response = await apiClient.get('/alerts', { params });
      return { success: true, data: response.data.alerts, source: 'API' };
    } catch (error) {
      return { success: true, data: EARLY_WARNING_ALERTS, source: 'LOCAL' };
    }
  },

  // 10. Authentication & User Services
  auth: {
    login: async (credentials) => {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
      } catch (error) {
        if (error.response) {
          const message = error.response.data?.detail || error.response.data?.message || 'Invalid username or password.';
          throw new Error(message);
        }
        throw new Error(error.message || 'Unable to connect to backend server. Please try again.');
      }
    },
    register: async (formData) => {
      try {
        const response = await apiClient.post('/auth/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data?.detail || 'Registration failed.');
        }
        throw new Error(error.message || 'Unable to connect to registration server. Please try again.');
      }
    },
    getMe: async () => {
      try {
        const response = await apiClient.get('/auth/me');
        return response.data;
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data?.detail || 'Failed to retrieve session.');
        }
        throw error;
      }
    },
    updateProfile: async (profileData) => {
      try {
        const response = await apiClient.put('/auth/profile', profileData);
        return response.data;
      } catch (error) {
        if (error.response) throw new Error(error.response.data?.detail || 'Failed to update profile.');
        throw error;
      }
    },
    changePassword: async (passwordData) => {
      try {
        const response = await apiClient.post('/auth/change-password', passwordData);
        return response.data;
      } catch (error) {
        if (error.response) throw new Error(error.response.data?.detail || 'Failed to change password.');
        throw error;
      }
    },
    forgotPassword: async (email) => {
      try {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
      } catch (error) {
        if (error.response) throw new Error(error.response.data?.detail || 'Failed to request reset.');
        throw error;
      }
    },
    resetPassword: async (resetData) => {
      try {
        const response = await apiClient.post('/auth/reset-password', resetData);
        return response.data;
      } catch (error) {
        if (error.response) throw new Error(error.response.data?.detail || 'Failed to reset password.');
        throw error;
      }
    },
    getStates: async () => {
      try {
        const response = await apiClient.get('/auth/states');
        return response.data;
      } catch (error) {
        return [
          'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
          'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
          'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
          'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
          'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
          'Delhi', 'Jammu and Kashmir', 'Ladakh'
        ];
      }
    },
    logout: async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch (e) {
        // ignore
      }
    }
  }
};

export default api;


