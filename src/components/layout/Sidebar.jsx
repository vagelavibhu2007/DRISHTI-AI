import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  PieChart,
  Flame,
  TrendingUp,
  Map,
  BellRing,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { stats, alerts, setIsSettingsOpen, setIsHelpOpen } = useDashboard();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderGit2, badge: (stats?.totalProjects ?? 0).toLocaleString() },
    { to: '/risk-analytics', label: 'Risk Analytics', icon: PieChart },
    { to: '/high-risk', label: 'High-Risk Projects', icon: Flame, badge: stats.criticalProjects, badgeColor: 'bg-red-500 text-white' },
    { to: '/trends', label: 'Prediction Trends', icon: TrendingUp },
    { to: '/map', label: 'Geographic Risk', icon: Map },
    { to: '/alerts', label: 'Early Warnings', icon: BellRing, badge: stats.totalActiveAlerts, badgeColor: 'bg-orange-500 text-white' },
    { to: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-gov-950 text-slate-300 flex flex-col border-r border-gov-900 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800 bg-slate-950 justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-9 h-9 rounded-lg bg-gov-700 text-white flex-shrink-0 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-sky-300 group-hover:scale-105 transition-transform" />
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-wider font-mono">DRISHTI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                Govt. Project Intelligence
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Tagline Bar (When expanded) */}
      {!collapsed && (
        <div className="px-4 py-2 bg-gov-900/40 border-b border-gov-900/50">
          <p className="text-[10px] text-slate-400 font-medium italic leading-tight">
            "Don't Just Monitor Projects — Predict Their Risks."
          </p>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            Intelligence Suite
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gov-700 text-white shadow-md shadow-gov-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-gov-900/60'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0 group-hover:text-sky-300 transition-colors" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-gov-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      NEW
                    </span>
                  )}
                  {item.isAi && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      ML
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gov-900/80 space-y-1 bg-gov-950/50">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-gov-900/60 transition"
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>System Settings</span>}
        </button>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-gov-900/60 transition"
          title={collapsed ? 'Help & Documentation' : undefined}
        >
          <HelpCircle className="w-4 h-4 flex-shrink-0 text-slate-400" />
          {!collapsed && <span>Help & Methodology</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 mt-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-gov-900 rounded-lg transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

