import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { DollarSign, Clock, Sparkles } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const CostTimeRiskCards = () => {
  const { stats, projects } = useDashboard();

  const { costBins, timeBins, costSevere, timeSevere, avgCostRisk, avgTimeRisk } = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    const total = list.length;

    const cBins = [
      { range: '0-20%', count: 0, label: 'Minimal Risk' },
      { range: '21-40%', count: 0, label: 'Low Risk' },
      { range: '41-60%', count: 0, label: 'Moderate Risk' },
      { range: '61-80%', count: 0, label: 'High Risk' },
      { range: '81-100%', count: 0, label: 'Severe (81-100%)' },
    ];

    const tBins = [
      { range: '0-20%', count: 0, label: 'On Schedule' },
      { range: '21-40%', count: 0, label: 'Minor Delay' },
      { range: '41-60%', count: 0, label: 'Moderate Delay' },
      { range: '61-80%', count: 0, label: 'High Delay' },
      { range: '81-100%', count: 0, label: 'Severe Delay' },
    ];

    let cSev = 0;
    let tSev = 0;

    list.forEach((p) => {
      const cr = Number(p.costRisk ?? p.cost_risk ?? 0);
      const tr = Number(p.timeRisk ?? p.time_risk ?? 0);

      if (cr <= 20) cBins[0].count++;
      else if (cr <= 40) cBins[1].count++;
      else if (cr <= 60) cBins[2].count++;
      else if (cr <= 80) cBins[3].count++;
      else cBins[4].count++;

      if (cr > 80) cSev++;

      if (tr <= 20) tBins[0].count++;
      else if (tr <= 40) tBins[1].count++;
      else if (tr <= 60) tBins[2].count++;
      else if (tr <= 80) tBins[3].count++;
      else tBins[4].count++;

      if (tr > 80) tSev++;
    });

    const cAvg = stats?.averageCostRisk ?? (total > 0 ? (list.reduce((acc, p) => acc + Number(p.costRisk || 0), 0) / total).toFixed(1) : 0);
    const tAvg = stats?.averageTimeRisk ?? (total > 0 ? (list.reduce((acc, p) => acc + Number(p.timeRisk || 0), 0) / total).toFixed(1) : 0);

    return {
      costBins: cBins,
      timeBins: tBins,
      costSevere: cSev,
      timeSevere: tSev,
      avgCostRisk: cAvg,
      avgTimeRisk: tAvg,
    };
  }, [projects, stats]);

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs border border-slate-700">
          <span className="font-semibold text-slate-300 block">{label}</span>
          <span className="font-mono font-bold text-sm text-sky-400">
            {payload[0].value} Projects
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* CARD 1: Cost Overrun Risk */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50 text-red-700">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                  Cost Overrun Risk
                </h3>
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1 mt-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Predicted Probability
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">{costSevere} in severe zone</span>
          </div>

          {/* Value Display */}
          <div className="flex items-baseline gap-3 my-2">
            <span className="text-3xl font-extrabold font-mono text-red-600 tracking-tight">
              {avgCostRisk}%
            </span>
            <span className="text-xs text-slate-500">Portfolio Average Probability</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Forecasted fiscal exposure driven by commodity price volatility & prolonged execution cycles.
          </p>
        </div>

        {/* Distribution Chart */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Probability Distribution (Number of Projects)
          </span>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBins} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {costBins.map((entry, index) => (
                    <Cell
                      key={`cost-cell-${index}`}
                      fill={index >= 3 ? '#EF4444' : index === 2 ? '#F59E0B' : '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CARD 2: Time Overrun Risk */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                  Time Overrun Risk
                </h3>
                <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1 mt-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Predicted Probability
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">{timeSevere} in severe zone</span>
          </div>

          {/* Value Display */}
          <div className="flex items-baseline gap-3 my-2">
            <span className="text-3xl font-extrabold font-mono text-orange-600 tracking-tight">
              {avgTimeRisk}%
            </span>
            <span className="text-xs text-slate-500">Portfolio Average Probability</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Forecasted schedule slippage influenced by RoW disputes, utility shifting & monsoonal stops.
          </p>
        </div>

        {/* Distribution Chart */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Probability Distribution (Number of Projects)
          </span>
          <div className="h-28 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeBins} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {timeBins.map((entry, index) => (
                    <Cell
                      key={`time-cell-${index}`}
                      fill={index >= 3 ? '#F97316' : index === 2 ? '#F59E0B' : '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostTimeRiskCards;

