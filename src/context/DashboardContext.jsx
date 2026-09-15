import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import {
  DASHBOARD_STATS,
  MOCK_PROJECTS,
  EARLY_WARNING_ALERTS,
  getStateDashboardMetrics,
  DASHBOARD_STATE_METRICS
} from '../data/mockData';
import { isProjectInState } from '../utils/riskUtils';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { user, isCentralAuthority, isStateAuthority, assignedState } = useAuth();

  // Global Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [selectedMinistryFilter, setSelectedMinistryFilter] = useState('ALL');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState(() => {
    return isStateAuthority && assignedState ? assignedState : 'ALL';
  });

  // Active State Metrics for Dashboard
  const activeStateMetrics = useMemo(() => {
    const effectiveState = isStateAuthority && assignedState ? assignedState : selectedStateFilter;
    return getStateDashboardMetrics(effectiveState);
  }, [isStateAuthority, assignedState, selectedStateFilter]);

  // Application Data State
  const [stats, setStats] = useState(() => activeStateMetrics);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [alerts, setAlerts] = useState(EARLY_WARNING_ALERTS);
  const [modelInfo, setModelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state filter when user authority changes
  useEffect(() => {
    if (isStateAuthority && assignedState) {
      setSelectedStateFilter(assignedState);
    } else if (!isStateAuthority) {
      setSelectedStateFilter((prev) => (prev === assignedState ? 'ALL' : prev));
    }
  }, [isStateAuthority, assignedState]);

  // Sync stats whenever activeStateMetrics changes
  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      ...activeStateMetrics
    }));
  }, [activeStateMetrics]);

  // Modals & Drawers & Layout
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('drishti_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('drishti_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const [drawerProjectId, setDrawerProjectId] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);

  // Initial Data Fetching from FastAPI Backend
  useEffect(() => {
    const fetchBackendData = async () => {
      setIsLoading(true);
      try {
        const queryParams = {};
        if (isStateAuthority && assignedState) {
          queryParams.state = assignedState;
        }

        const [summaryRes, projectsRes, alertsRes, modelRes] = await Promise.all([
          api.getDashboardSummary(queryParams),
          api.getProjects(queryParams),
          api.getAlerts(queryParams),
          api.getModelInfo()
        ]);

        if (summaryRes.success && summaryRes.data) {
          setStats(summaryRes.data);
        }
        if (projectsRes.success && projectsRes.data) {
          setProjects(projectsRes.data);
        }
        if (alertsRes.success && alertsRes.data) {
          setAlerts(alertsRes.data);
        }
        if (modelRes.success && modelRes.data) {
          setModelInfo(modelRes.data);
        }
      } catch (err) {
        console.warn('Backend data load warning, using local state fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackendData();
  }, [isStateAuthority, assignedState]);

  // Filtered projects supporting multi-state projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedRiskFilter !== 'ALL' && p.riskLevel !== selectedRiskFilter) {
        return false;
      }
      if (selectedMinistryFilter !== 'ALL' && p.ministry !== selectedMinistryFilter) {
        return false;
      }
      if (selectedSectorFilter !== 'ALL' && p.sector !== selectedSectorFilter) {
        return false;
      }
      if (selectedStateFilter !== 'ALL' && !isProjectInState(p, selectedStateFilter)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = String(p.projectId).toLowerCase().includes(q);
        const matchesName = String(p.projectName).toLowerCase().includes(q);
        const matchesMinistry = String(p.ministry).toLowerCase().includes(q);
        const matchesState = String(p.state).toLowerCase().includes(q);
        const matchesSector = String(p.sector).toLowerCase().includes(q);
        return matchesId || matchesName || matchesMinistry || matchesState || matchesSector;
      }
      return true;
    });
  }, [projects, searchQuery, selectedRiskFilter, selectedMinistryFilter, selectedSectorFilter, selectedStateFilter]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRiskFilter('ALL');
    setSelectedMinistryFilter('ALL');
    setSelectedSectorFilter('ALL');
    setSelectedStateFilter(isStateAuthority && assignedState ? assignedState : 'ALL');
  };

  const updateAlertStatus = (alertId, newStatus) => {
    setAlerts((prev) =>
      prev.map((a) => (a.alertId === alertId ? { ...a, status: newStatus } : a))
    );
  };

  const activeDrawerProject = useMemo(() => {
    if (!drawerProjectId) return null;
    return projects.find((p) => String(p.projectId) === String(drawerProjectId)) || null;
  }, [projects, drawerProjectId]);

  const effectiveStats = useMemo(() => {
    if (isStateAuthority && assignedState) {
      if (stats && stats.state === assignedState && stats.totalProjects !== 1966) {
        return stats;
      }
      const stateProjs = (Array.isArray(projects) ? projects : MOCK_PROJECTS).filter((p) => isProjectInState(p, assignedState));
      const total = stateProjs.length;
      const crit = stateProjs.filter((p) => p.riskLevel === 'CRITICAL').length;
      const high = stateProjs.filter((p) => p.riskLevel === 'HIGH').length;
      const med = stateProjs.filter((p) => p.riskLevel === 'MEDIUM').length;
      const low = stateProjs.filter((p) => p.riskLevel === 'LOW').length;
      const avgR = total > 0 ? Number((stateProjs.reduce((a, b) => a + Number(b.overallRisk || 50), 0) / total).toFixed(1)) : 50;
      const avgC = total > 0 ? Number((stateProjs.reduce((a, b) => a + Number(b.costRisk || 50), 0) / total).toFixed(1)) : 50;
      const avgT = total > 0 ? Number((stateProjs.reduce((a, b) => a + Number(b.timeRisk || 50), 0) / total).toFixed(1)) : 50;
      return {
        ...stats,
        totalProjects: total,
        criticalProjects: crit,
        highRisk: high,
        mediumRisk: med,
        lowRisk: low,
        averageRiskScore: avgR,
        averageCostRisk: avgC,
        averageTimeRisk: avgT,
        state: assignedState
      };
    }
    return stats;
  }, [stats, projects, isStateAuthority, assignedState]);

  return (
    <DashboardContext.Provider
      value={{
        stats: effectiveStats,
        activeStateMetrics,
        projects,
        filteredProjects,
        alerts,
        modelInfo,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedRiskFilter,
        setSelectedRiskFilter,
        selectedMinistryFilter,
        setSelectedMinistryFilter,
        selectedSectorFilter,
        setSelectedSectorFilter,
        selectedStateFilter,
        setSelectedStateFilter,
        clearAllFilters,
        drawerProjectId,
        setDrawerProjectId,
        activeDrawerProject,
        isSettingsOpen,
        setIsSettingsOpen,
        isHelpOpen,
        setIsHelpOpen,
        isPredictionModalOpen,
        setIsPredictionModalOpen,
        updateAlertStatus,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
