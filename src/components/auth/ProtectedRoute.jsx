import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Sparkles } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white select-none">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gov-700/40 border border-sky-500/30 flex items-center justify-center animate-pulse">
            <Shield className="w-8 h-8 text-sky-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[11px] font-bold text-slate-900 shadow">
            🇮🇳
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">
            DRISHTI AI
          </h2>
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">
            Infrastructure Project Intelligence Platform
          </p>
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span className="text-xs text-slate-400">Verifying authorized security credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
