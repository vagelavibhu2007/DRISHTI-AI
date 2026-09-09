import React from 'react';
import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const PageContainer = ({
  children,
  breadcrumbs = [],
  title,
  subtitle,
  action,
  className = ''
}) => {
  return (
    <main className={`p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6 animate-fade-in ${className}`}>
      {/* Header section with optional breadcrumb & title */}
      {(title || breadcrumbs.length > 0) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                <NavLink to="/dashboard" className="hover:text-gov-700 transition">
                  Home
                </NavLink>
                {breadcrumbs.map((b, i) => (
                  <React.Fragment key={i}>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    {b.to ? (
                      <NavLink to={b.to} className="hover:text-gov-700 transition font-medium text-slate-600">
                        {b.label}
                      </NavLink>
                    ) : (
                      <span className="font-semibold text-slate-800">{b.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}

            {title && (
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>

          {action && <div className="flex-shrink-0 flex items-center gap-2.5">{action}</div>}
        </div>
      )}

      {/* Page Content */}
      <div className="space-y-6">{children}</div>
    </main>
  );
};

export default PageContainer;

