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
      setErrorMessage('Network or server error during sign-in.');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-gov-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gov-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-700/80 border border-sky-400/30 flex items-center justify-center shadow-lg shadow-gov-900/50">
            <Shield className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-white">DRISHTI AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                v4.2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-medium">
              Infrastructure Project Intelligence Platform
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-slate-300">
          <span className="text-base">🇮🇳</span>
          <span className="font-semibold text-slate-200">Government of India</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">PM-GatiShakti / PRAGATI Node</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto my-auto py-6 z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative">
          
          {/* Top Tag */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gov-500/10 border border-gov-500/20 text-sky-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authorized Officer Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Sign In to DRISHTI AI
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              "Don't Just Monitor Projects — Predict Their Risks."
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-200">Authentication Failed</p>
                <p className="text-red-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / Officer ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. aarav_sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 hover:border-slate-600 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
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
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950/70 border border-slate-700 hover:border-slate-600 focus:border-sky-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
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
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-gov-700 to-sky-600 hover:from-gov-600 hover:to-sky-500 active:scale-[0.99] disabled:opacity-60 transition duration-150 shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          <div className="mt-6 pt-5 border-t border-slate-800">
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
                className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition text-xs"
              >
                <div className="font-semibold text-sky-400 truncate">Central Authority</div>
                <div className="text-[10px] text-slate-400 font-mono">vibhu</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('priya_patel', 'Password@123')}
                className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition text-xs"
              >
                <div className="font-semibold text-amber-400 truncate">State Authority</div>
                <div className="text-[10px] text-slate-400 font-mono">priya_patel</div>
              </button>
            </div>
          </div>

          {/* New User Register Link */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-400">
              New Infrastructure Officer?{' '}
              <Link
                to="/register"
                className="font-bold text-sky-400 hover:text-sky-300 hover:underline transition"
              >
                Register Official Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center space-y-1">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit Encrypted JWT & Government ID Verified Access</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mx-auto text-center text-xs text-slate-500 border-t border-slate-800/60 pt-4 z-10">
        © 2026 DRISHTI AI • Ministry of Statistics and Programme Implementation (MoSPI) • Govt of India
      </div>
    </div>
  );
};

export default Login;
