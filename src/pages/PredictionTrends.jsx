import React, { useState, useEffect } from 'react';
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
import { TrendingUp, Filter, Sparkles, Calendar, Layers, Building2, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { useDashboard } from '../context/DashboardContext';
import { RISK_TREND_12M, SECTOR_RISK_DATA } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const PredictionTrends = () => {
  const { stats } = useDashboard();
  const { assignedState } = useAuth();
  const [timePeriod, setTimePeriod] = useState('12M');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');

  const [trendData, setTrendData] = useState([]);
  const [metrics, setMetrics] = useState({
    averageCostRisk: null,
    averageTimeRisk: null,
    averageRiskScore: null,
    criticalProjects: 0,
    totalProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchTrends = async () => {
      try {
        const res = await api.getRiskTrends({
          horizon: timePeriod,
          sector: selectedSector,
          ministry: selectedMinistry
        });

        if (!isMounted) return;

        if (res.success && res.data) {
          setTrendData(res.data.trends || []);
          setMetrics({
            averageCostRisk: res.data.averageCostRisk,
            averageTimeRisk: res.data.averageTimeRisk,
            averageRiskScore: res.data.averageRiskScore,
            criticalProjects: res.data.criticalProjects ?? 0,
            totalProjects: res.data.totalProjects ?? 0
          });
        } else {
          setTrendData([]);
          setMetrics({
            averageCostRisk: null,
            averageTimeRisk: null,
            averageRiskScore: null,
            criticalProjects: 0,
            totalProjects: 0
          });
          setError(res.error || 'Failed to load trend analytics.');
        }
      } catch (err) {
        if (!isMounted) return;
        setTrendData([]);
        setMetrics({
          averageCostRisk: null,
          averageTimeRisk: null,
          averageRiskScore: null,
          criticalProjects: 0,
          totalProjects: 0
        });
        setError(err.message || 'Error fetching prediction trends.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTrends();

    return () => {
      isMounted = false;
    };
  }, [timePeriod, selectedSector, selectedMinistry, assignedState]);

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

  const renderEmptyState = () => (
    <div className="h-64 w-full flex flex-col items-center justify-center text-slate-400 p-4 border border-dashed border-slate-200 rounded-lg">
      <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
      <p className="text-xs font-semibold text-slate-600">No projects match the selected filters.</p>
      <p className="text-[11px] text-slate-400 mt-0.5">Try selecting "All Sectors" or "All Ministries".</p>
    </div>
  );

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
            <option value="Power & Renewable">Power & Renewable</option>
            <option value="Urban Development">Urban Development</option>
            <option value="Shipping & Ports">Shipping & Ports</option>
            <option value="Civil Aviation">Civil Aviation</option>
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
            <option value="Ministry of Petroleum & Natural Gas">Ministry of Petroleum & Natural Gas</option>
            <option value="Ministry of Power">Ministry of Power</option>
            <option value="Ministry of Housing & Urban Affairs">Ministry of Housing & Urban Affairs</option>
            <option value="Ministry of Ports, Shipping & Waterways">Ministry of Ports, Shipping & Waterways</option>
            <option value="Ministry of Civil Aviation">Ministry of Civil Aviation</option>
          </select>

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-sky-600 font-medium pl-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Calculating...</span>
            </div>
          )}
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
              Avg {metrics.averageCostRisk !== null ? `${metrics.averageCostRisk}%` : '--'}
            </span>
          </div>
          <div className="h-64 w-full">
            {trendData.length === 0 && !isLoading ? (
              renderEmptyState()
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip content={<CustomTrendTooltip />} />
                  <Line type="monotone" dataKey="costRisk" name="Cost Overrun Prob (%)" stroke="#EF4444" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
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
              Avg {metrics.averageTimeRisk !== null ? `${metrics.averageTimeRisk}%` : '--'}
            </span>
          </div>
          <div className="h-64 w-full">
            {trendData.length === 0 && !isLoading ? (
              renderEmptyState()
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip content={<CustomTrendTooltip />} />
                  <Line type="monotone" dataKey="timeRisk" name="Time Overrun Prob (%)" stroke="#F97316" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
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
              Baseline {metrics.averageRiskScore !== null ? Number(metrics.averageRiskScore).toFixed(1) : '--'}
            </span>
          </div>
          <div className="h-64 w-full">
            {trendData.length === 0 && !isLoading ? (
              renderEmptyState()
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip content={<CustomTrendTooltip />} />
                  <Area type="monotone" dataKey="overallRisk" name="Overall Risk Index" stroke="#1E3A5F" strokeWidth={3} fill="url(#overallGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
              Current: {metrics.totalProjects > 0 ? (metrics.criticalProjects ?? 0).toLocaleString() : 0} Assets
            </span>
          </div>
          <div className="h-64 w-full">
            {trendData.length === 0 && !isLoading ? (
              renderEmptyState()
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 10, fill: '#64748B' }} />
                  <Tooltip content={<CustomTrendTooltip />} />
                  <Bar dataKey="criticalCount" name="Critical Projects" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PredictionTrends;

