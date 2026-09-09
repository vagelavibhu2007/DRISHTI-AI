import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Search,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Building2,
  MapPin,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { RiskBadge } from '../common/RiskBadge';

export const Navbar = () => {
  const {
    stats,
    alerts,
    searchQuery,
    setSearchQuery,
    setIsSettingsOpen,
    sidebarCollapsed,
    toggleSidebar
  } = useDashboard();
  const { user, logout, isCentralAuthority, isStateAuthority } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/projects');
    }
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
    navigate('/login');
  };

  const unreadAlerts = alerts.filter((a) => a.status === 'New' || a.status === 'Under Review');

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 shadow-sm flex items-center justify-between px-4 sm:px-6">
      {/* Left Area: Sidebar Toggle, Govt Badge & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-5 h-5 text-gov-700" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* National Emblem stylized tag */}
        <div className="hidden lg:flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
          <div className="w-5 h-5 rounded bg-gov-700 text-white flex items-center justify-center font-bold text-[10px]">
            🇮🇳
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gov-900 leading-none">Government of India</span>
            <span className="text-[9px] text-slate-500 font-normal">PM-GatiShakti / PRAGATI Node</span>
          </div>
        </div>

        {/* Global Quick Search (Visible ONLY on Dashboard) */}
        {isDashboard && (
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by ID, name, state or sector..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700 transition"
            />
          </form>
        )}
      </div>

      {/* Right Area: System Status, Date & Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Early Warning Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-ping" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Early Warning Radar</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    {unreadAlerts.length} Active
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {unreadAlerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.alertId}
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/alerts');
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <RiskBadge level={alert.severity} size="xs" />
                        <span className="text-[10px] text-slate-400 font-mono">{alert.created}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight line-clamp-1">{alert.projectName}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{alert.reason}</p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <NavLink
                    to="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-gov-700 hover:text-gov-800 inline-flex items-center gap-1"
                  >
                    <span>View all early warning alerts</span>
                    <ExternalLink className="w-3 h-3" />
                  </NavLink>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Avatar Pill & Dropdown */}
        {user && (
          <div className="relative pl-1">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gov-700 text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden shrink-0">
                {user.profile_photo_url ? (
                  <img src={user.profile_photo_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.first_name?.[0] || 'O'}{user.last_name?.[0] || 'I'}</span>
                )}
              </div>

              <div className="hidden md:flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 leading-tight">{user.full_name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isCentralAuthority
                      ? 'bg-sky-100 text-sky-800 border border-sky-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {isCentralAuthority ? 'Central' : user.state || 'State'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 leading-tight truncate max-w-[140px]">
                  {user.position}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Dropdown Header */}
                  <div className="p-4 bg-slate-900 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gov-700 text-white flex items-center justify-center font-bold text-sm shadow">
                        {user.profile_photo_url ? (
                          <img src={user.profile_photo_url} alt={user.full_name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span>{user.first_name?.[0]}{user.last_name?.[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{user.full_name}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">@{user.username}</p>
                        <span className={`inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                          isCentralAuthority
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {isCentralAuthority ? '🇮🇳 Central Authority' : `🏛️ State: ${user.state}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-2 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium transition text-left"
                    >
                      <User className="w-4 h-4 text-gov-700" />
                      <span>My Profile & Credentials</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium transition text-left"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>System Settings</span>
                    </button>
                  </div>

                  {/* Sign Out Action */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold transition text-left text-xs"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;


