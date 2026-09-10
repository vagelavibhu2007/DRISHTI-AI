import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
  Sparkles,
  Layers,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both your username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(username.trim(), password);
      if (result.success) {
        navigate(redirectPath, { replace: true });
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network or server error during sign-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = (userVal, passVal) => {
    setUsername(userVal);
    setPassword(passVal);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 text-slate-100">
      {/* Official Government Header Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gov-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            <Shield className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-wider text-white font-mono">DRISHTI AI</span>
            <p className="text-[11px] text-slate-400">
              Infrastructure Project Intelligence Platform
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span>🇮🇳</span>
          <span className="font-semibold text-slate-200">Government of India</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">MoSPI / PM-GatiShakti Node</span>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-7 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Authorized Officer Sign-In
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Sign In to DRISHTI AI
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              National Infrastructure Project Monitoring & Predictive Risk System
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (() => {
            const lowerErr = errorMessage.toLowerCase();
            const isNetwork = lowerErr.includes('unreachable') || lowerErr.includes('network error') || lowerErr.includes('connection') || lowerErr.includes('failed to fetch') || lowerErr.includes('cors');
            const isServer = lowerErr.includes('internal server') || lowerErr.includes('server error');
            const title = isNetwork ? 'Backend Service Unavailable' : isServer ? 'Server Error' : 'Authentication Failed';

            return (
              <div className={`mb-5 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                isNetwork ? 'bg-amber-950/60 border-amber-800/80 text-amber-200' : 'bg-red-950/60 border-red-800/80 text-red-200'
              }`}>
                <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isNetwork ? 'text-amber-400' : 'text-red-400'}`} />
                <div className="flex-1">
                  <p className="font-bold">{title}</p>
                  <p className="text-slate-300 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            );
          })()}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / Officer ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. vibhu or priya_patel"
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-gov-500 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gov-500 transition font-sans"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-sky-400 hover:text-sky-300 hover:underline transition"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-gov-500 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gov-500 transition font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm text-white bg-gov-700 hover:bg-gov-600 active:bg-gov-800 disabled:opacity-60 transition flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-amber-400" />
                Quick Test Credentials
              </span>
              <span className="text-[10px] text-slate-500">1-Click Autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('vibhu', 'Vibhu@127')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition"
              >
                <div className="font-bold text-sky-400 text-xs truncate">Central Authority</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">vibhu</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('priya_patel', 'Password@123')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition"
              >
                <div className="font-bold text-amber-400 text-xs truncate">State Authority</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">priya_patel</div>
              </button>
            </div>
          </div>

          {/* New User Register Link */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-400">
              New Officer on Platform?{' '}
              <Link
                to="/register"
                className="font-semibold text-sky-400 hover:text-sky-300 hover:underline transition"
              >
                Register Official Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Encrypted JWT Session • MoSPI Data Standard</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mx-auto text-center text-xs text-slate-500 border-t border-slate-800/80 pt-3">
        © 2026 DRISHTI AI • Ministry of Statistics and Programme Implementation (MoSPI) • Government of India
      </div>
    </div>
  );
};

export default Login;
