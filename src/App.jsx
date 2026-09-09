import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import { QuickProjectDrawer } from './components/common/QuickProjectDrawer';
import { SettingsModal, HelpModal } from './components/layout/SystemModals';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';

// Dashboard & Core Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import RiskAnalytics from './pages/RiskAnalytics';
import HighRiskProjects from './pages/HighRiskProjects';
import PredictionTrends from './pages/PredictionTrends';
import GeographicRisk from './pages/GeographicRisk';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';

// Authenticated Layout Wrapper
const AuthenticatedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Fixed Left Sidebar */}
        <Sidebar />

        {/* Main Application Content Body */}
        <div className="flex-1 flex flex-col min-w-0 pl-20 sm:pl-64 transition-all duration-300">
          <Navbar />

          <div className="flex-1">
            {children}
          </div>

          {/* Global Slide-Over Project Drawer */}
          <QuickProjectDrawer />

          {/* System Settings & Help Documentation Modals */}
          <SettingsModal />
          <HelpModal />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Infrastructure Intelligence Routes */}
        <Route
          path="/"
          element={
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthenticatedLayout>
              <Dashboard />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <AuthenticatedLayout>
              <Projects />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <AuthenticatedLayout>
              <ProjectDetails />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/risk-analytics"
          element={
            <AuthenticatedLayout>
              <RiskAnalytics />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/high-risk"
          element={
            <AuthenticatedLayout>
              <HighRiskProjects />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/trends"
          element={
            <AuthenticatedLayout>
              <PredictionTrends />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/map"
          element={
            <AuthenticatedLayout>
              <GeographicRisk />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/alerts"
          element={
            <AuthenticatedLayout>
              <Alerts />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AuthenticatedLayout>
              <Reports />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthenticatedLayout>
              <Profile />
            </AuthenticatedLayout>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;
