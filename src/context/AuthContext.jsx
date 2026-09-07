import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'drishti_auth_token';
const USER_KEY = 'drishti_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Validate stored session token on mount
  useEffect(() => {
    const verifyStoredSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const userData = await api.auth.getMe();
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyStoredSession();
  }, []);

  // Login handler
  const login = async (username, password) => {
    setAuthError(null);
    try {
      const response = await api.auth.login({ username, password });
      const { access_token, user: userData } = response;

      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setToken(access_token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorDetail = err.response?.data?.detail || err.message || 'Authentication failed. Please check your credentials.';
      setAuthError(errorDetail);
      return { success: false, error: errorDetail };
    }
  };

  // Multi-step Registration handler
  const register = async (formData) => {
    setAuthError(null);
    try {
      const response = await api.auth.register(formData);
      return { success: true, data: response };
    } catch (err) {
      const errorDetail = err.response?.data?.detail || 'Registration failed. Please review your input.';
      setAuthError(errorDetail);
      return { success: false, error: errorDetail };
    }
  };

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const updated = await api.auth.updateProfile(profileData);
      setUser(updated);
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return { success: true, user: updated };
    } catch (err) {
      const errorDetail = err.response?.data?.detail || 'Failed to update profile.';
      return { success: false, error: errorDetail };
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.auth.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      return { success: true, message: response.message };
    } catch (err) {
      const errorDetail = err.response?.data?.detail || 'Failed to change password.';
      return { success: false, error: errorDetail };
    }
  };

  const isCentralAuthority = user?.authority_type === 'CENTRAL_AUTHORITY';
  const isStateAuthority = user?.authority_type === 'STATE_AUTHORITY';
  const assignedState = user?.state || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isCentralAuthority,
        isStateAuthority,
        assignedState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,
      isCentralAuthority: false,
      isStateAuthority: false,
      assignedState: null,
      login: async () => ({ success: false, error: 'Auth context not mounted' }),
      register: async () => ({ success: false, error: 'Auth context not mounted' }),
      logout: async () => {},
      updateProfile: async () => ({ success: false, error: 'Auth context not mounted' }),
      changePassword: async () => ({ success: false, error: 'Auth context not mounted' }),
    };
  }
  return context;
};

export default AuthContext;
