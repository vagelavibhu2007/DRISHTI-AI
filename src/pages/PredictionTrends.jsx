import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, Filter, Sparkles, Calendar, Layers, Building2, MapPin } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { useDashboard } from '../context/DashboardContext';
import { RISK_TREND_12M, SECTOR_RISK_DATA } from '../data/mockData';

export const PredictionTrends = () => {
  const { stats } = useDashboard();
  const [timePeriod, setTimePeriod] = useState('12M');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');

  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-1.5 min-w-[180px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-sky-400 font-mono">Prediction Node</span>
          </div>
          {payload.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}:
              </span>
              <span className="font-mono font-bold text-white">{p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: 'Prediction Trends' }]}
      title="Longitudinal Risk & Predictive Trends"
      subtitle="Dynamic multi-horizon risk trajectory forecasts and critical portfolio volume projections."
    >
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
            {['6M', '12M', '24M Forecast'].map((p) => (
              <button
                key={p}
                onClick={() => setTimePeriod(p)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  timePeriod === p
                    ? 'bg-gov-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
          >
            <option value="ALL">All Sectors</option>
            <option value="Water Resources">Water Resources</option>
            <option value="Road Transport">Road Transport</option>
            <option value="Railways">Railways</option>
            <option value="Petroleum & Gas">Petroleum & Gas</option>
          </select>

          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
          >
            <option value="ALL">All Ministries</option>
            <option value="MoRTH">MoRTH</option>
            <option value="Railways">Ministry of Railways</option>
            <option value="Jal Shakti">Ministry of Jal Shakti</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-mono">Model: Bi-LSTM + GBDT Horizon Estimator</span>
      </div>

      {/* Grid of 4 Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Cost Overrun Probability Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cost Overrun Probability Trend</h3>
              <p className="text-xs text-slate-500">Historical & projected probability of budget escalation</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-800 font-mono">
              Avg {stats?.averageCostRisk ?? '64.2'}%
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RISK_TREND_12M} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[40, 80]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Line type="monotone" dataKey="costRisk" name="Cost Overrun Prob (%)" stroke="#EF4444" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Time Overrun Probability Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Time Overrun Probability Trend</h3>
              <p className="text-xs text-slate-500">Predicted schedule drift trajectory across quarters</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-100 text-orange-800 font-mono">
              Avg {stats?.averageTimeRisk ?? '59.4'}%
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RISK_TREND_12M} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[40, 80]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Line type="monotone" dataKey="timeRisk" name="Time Overrun Prob (%)" stroke="#F97316" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Overall Risk Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Composite Risk Score Trend</h3>
              <p className="text-xs text-slate-500">Macro hazard index progression (0 - 100)</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gov-100 text-gov-800 font-mono">
              Baseline {stats?.averageRiskScore ? Number(stats.averageRiskScore).toFixed(1) : '61.8'}
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RISK_TREND_12M} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[40, 80]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Area type="monotone" dataKey="overallRisk" name="Overall Risk Index" stroke="#1E3A5F" strokeWidth={3} fill="url(#overallGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Critical Project Count Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Critical Project Count Evolution</h3>
              <p className="text-xs text-slate-500">Number of assets crossing the critical ≥80 threshold</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-800 font-mono">
              Current: {(stats?.criticalProjects ?? 0).toLocaleString()} Assets
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RISK_TREND_12M} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis domain={[300, 450]} tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Bar dataKey="criticalCount" name="Critical Projects" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PredictionTrends;

