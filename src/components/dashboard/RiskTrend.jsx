import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RISK_TREND_6M, RISK_TREND_12M } from '../../data/mockData';

export const RiskTrend = () => {
  const [period, setPeriod] = useState('6M'); // '6M' or '12M'
  const { isStateAuthority, assignedState } = useAuth();
  const data = period === '6M' ? RISK_TREND_6M : RISK_TREND_12M;

  const CustomTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-1.5 min-w-[170px]">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-sky-400 font-mono">Monthly Aggregate</span>
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
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gov-700" />
            Project Risk Trend
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStateAuthority && assignedState
              ? `Temporal progression of predictive risk indices across ${assignedState} projects`
              : 'Temporal progression of predictive risk indices across central pipeline'}
          </p>
        </div>

        {/* 6M / 12M Period Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setPeriod('6M')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              period === '6M'
                ? 'bg-white text-gov-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Last 6 Months
          </button>
          <button
            onClick={() => setPeriod('12M')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              period === '12M'
                ? 'bg-white text-gov-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Last 12 Months
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="overallRiskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="costRiskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="timeRiskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              domain={[30, 90]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTrendTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="overallRisk"
              name="Overall Risk Score"
              stroke="#1E3A5F"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#overallRiskGrad)"
            />
            <Area
              type="monotone"
              dataKey="costRisk"
              name="Cost Risk (%)"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#costRiskGrad)"
            />
            <Area
              type="monotone"
              dataKey="timeRisk"
              name="Time Risk (%)"
              stroke="#F97316"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#timeRiskGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskTrend;

