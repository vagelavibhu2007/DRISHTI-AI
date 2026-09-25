import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

  // Read user's role directly from authenticated user object session
  const rawRole = String(user?.role || user?.authority_type || user?.authorityType || 'CENTRAL').toUpperCase();
  const isStateAuthority = rawRole === 'STATE' || rawRole === 'STATE_AUTHORITY' || Boolean(user?.state && String(user?.authority_type || '').includes('STATE'));
  const isCentralAuthority = !isStateAuthority && (rawRole === 'CENTRAL' || rawRole === 'CENTRAL_AUTHORITY' || String(user?.authority_type || '').toUpperCase().includes('CENTRAL'));
  const role = isStateAuthority ? 'STATE' : 'CENTRAL';
  const assignedState = isStateAuthority ? (user?.assignedState || user?.state || null) : null;

  // Highest-Rank Central Authority verification (Chief Project Officer / Apex Central Authority)
  const isHighestRankCentralAuthority = useMemo(() => {
    if (!user || isStateAuthority) {
      return false;
    }

    if (user.is_highest_rank === true || user.isHighestRank === true) {
      return true;
    }

    const pos = String(user.position || user.designation || user.rank || user.role_title || user.title || '').toLowerCase().trim();
    const username = String(user.username || '').toLowerCase().trim();
    const email = String(user.email || '').toLowerCase().trim();

    const highestRankKeywords = [
      'chief project officer',
      'cpo',
      'highest-rank',
      'highest rank',
      'apex',
      'director general',
      'secretary',
      'chief',
      'central apex'
    ];

    const matchesKeyword = highestRankKeywords.some(kw => pos.includes(kw));
    const matchesKnownAdmin = ['vibhu', 'aarav_sharma', 'cpo'].includes(username) || email.startsWith('vibhu');

    return matchesKeyword || matchesKnownAdmin;
  }, [user, isCentralAuthority, isStateAuthority]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!token || !!user,
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
        isHighestRankCentralAuthority,
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
      role: 'CENTRAL',
      token: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,
      isCentralAuthority: true,
      isStateAuthority: false,
      assignedState: null,
      isHighestRankCentralAuthority: false,
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
