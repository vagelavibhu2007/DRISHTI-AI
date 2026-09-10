import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, TrendingUp, IndianRupee, Clock, MapPin, Building, AlertTriangle } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { RiskBadge } from './RiskBadge';
import { RiskGauge } from './RiskGauge';
import { formatCurrency, formatPercent } from '../../utils/riskUtils';
import StatusBadge from './StatusBadge';

export const QuickProjectDrawer = () => {
  const { activeDrawerProject, setDrawerProjectId } = useDashboard();
  const navigate = useNavigate();

  if (!activeDrawerProject) return null;

  const p = activeDrawerProject;

  const handleNavigateFull = () => {
    setDrawerProjectId(null);
    navigate(`/projects/${p.projectId}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setDrawerProjectId(null)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slide-in-right">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gov-300 font-bold tracking-wider">
                PROJECT ID: #{p.projectId}
              </span>
              <RiskBadge level={p.riskLevel} score={p.overallRisk} size="xs" />
            </div>
            <button
              onClick={() => setDrawerProjectId(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Metadata */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">{p.projectName}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {p.ministry}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {p.state} ({p.district})
                </span>
                <span>•</span>
                <StatusBadge status={p.status} />
              </div>
            </div>

            {/* Risk Gauge & Probabilities */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-around gap-4">
              <RiskGauge score={p.overallRisk} size={150} />
              <div className="space-y-3 w-full sm:w-auto">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5 text-red-600">
                      <IndianRupee className="w-3.5 h-3.5" />
                      Cost Overrun Risk
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900">{formatPercent(p.costRisk)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${p.costRisk}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5 text-orange-600">
                      <Clock className="w-3.5 h-3.5" />
                      Time Overrun Risk
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900">{formatPercent(p.timeRisk)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: `${p.timeRisk}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial vs Physical Progress Comparison */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Execution Progress Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] font-medium text-slate-500 block">Sanctioned Cost</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{formatCurrency(p.originalCost)}</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] font-medium text-slate-500 block">Cumulative Spend</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">{formatCurrency(p.cumulativeExpenditure)}</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">Physical Progress</span>
                    <span className="font-mono font-bold text-slate-900">{formatPercent(p.physicalProgress)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gov-600 h-full rounded-full" style={{ width: `${p.physicalProgress}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">Financial Expenditure</span>
                    <span className="font-mono font-bold text-slate-900">{formatPercent(p.expenditurePercentage)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.expenditurePercentage > p.physicalProgress + 20 ? 'bg-red-500' : 'bg-gov-500'}`}
                      style={{ width: `${Math.min(100, p.expenditurePercentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Explainable AI / SHAP Factors Preview */}
            {p.shapFactors && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-gov-700" />
                    Top Risk Drivers (SHAP Attribution)
                  </h3>
                  <span className="text-[10px] text-slate-400">ML Demo</span>
                </div>
                <div className="space-y-2">
                  {p.shapFactors.slice(0, 3).map((f, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="text-slate-800">{f.name}</span>
                        <span className={`font-mono ${f.type === 'increase' ? 'text-red-600' : 'text-emerald-600'}`}>
                          {f.type === 'increase' ? `+${f.contribution}%` : `${f.contribution}%`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{f.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={() => setDrawerProjectId(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={handleNavigateFull}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gov-700 hover:bg-gov-800 rounded-lg shadow transition"
            >
              <span>View Full Project Intelligence</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickProjectDrawer;

