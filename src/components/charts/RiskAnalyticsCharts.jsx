import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import {
  isProjectInState,
  calculateSectorRiskData,
  calculateMinistryRiskData,
  calculateStateRiskData
} from '../../utils/riskUtils';
import { SECTOR_RISK_DATA, STATE_RISK_DATA, MINISTRY_RISK_DATA, MOCK_PROJECTS } from '../../data/mockData';

export const SectorRiskChart = () => {
  const navigate = useNavigate();
  const {
    projects: contextProjects,
    setSelectedSectorFilter,
    setSelectedMinistryFilter,
    setSelectedStateFilter,
    setSelectedRiskFilter,
    setSearchQuery
  } = useDashboard();
  const { isStateAuthority, assignedState } = useAuth();

  const scopedProjects = useMemo(() => {
    const list = Array.isArray(contextProjects) && contextProjects.length > 0 ? contextProjects : MOCK_PROJECTS;
    if (isStateAuthority && assignedState) {
      return list.filter((p) => isProjectInState(p, assignedState));
    }
    return list;
  }, [contextProjects, isStateAuthority, assignedState]);

  const data = useMemo(() => {
    if (!isStateAuthority) return SECTOR_RISK_DATA;
    const dynamic = calculateSectorRiskData(scopedProjects);
    return dynamic || [];
  }, [scopedProjects, isStateAuthority]);

  const handleSectorClick = (entry) => {
    const sectorName = entry?.sector || entry?.payload?.sector || (typeof entry === 'string' ? entry : null);
    if (!sectorName) return;
    setSelectedMinistryFilter('ALL');
    setSelectedRiskFilter('ALL');
    setSearchQuery('');
    if (isStateAuthority && assignedState) {
      setSelectedStateFilter(assignedState);
    }
    setSelectedSectorFilter(sectorName);
    navigate('/projects');
  };

  const CustomSectorTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="font-bold text-sky-300 text-sm">{label}</div>
          <div className="text-slate-300">Total Projects: <span className="font-mono font-bold text-white">{item.totalProjects}</span></div>
          <div className="text-slate-300">Average Risk Index: <span className="font-mono font-bold text-red-400">{item.avgRisk}</span></div>
          <div className="text-slate-300">Cost Overrun Risk: <span className="font-mono font-bold text-amber-400">{item.costRisk}%</span></div>
          <div className="text-slate-300">Time Overrun Risk: <span className="font-mono font-bold text-orange-400">{item.timeRisk}%</span></div>
          <div className="pt-1 text-[10px] text-red-400 font-bold border-t border-slate-800">
            Critical Assets: {item.critical} ({item.totalProjects > 0 ? ((item.critical / item.totalProjects) * 100).toFixed(1) : 0}%)
          </div>
          <div className="pt-1 text-[10px] text-sky-300 font-medium italic">
            Click to view {label} projects →
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">Sector-wise Risk Exposure</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {isStateAuthority && assignedState
            ? `Comparison of average predicted risk score and critical projects in ${assignedState} by sector`
            : 'Comparison of average predicted risk score and critical projects by sector'}
        </p>
      </div>

      <div className="h-[460px] w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No projects available for sector analysis in {assignedState}.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload.length) {
                  handleSectorClick(e.activePayload[0].payload);
                }
              }}
              className="cursor-pointer"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis
                dataKey="sector"
                type="category"
                interval={0}
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
                width={160}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip content={<CustomSectorTooltip />} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />
              <Bar dataKey="avgRisk" name="Avg Risk Score" fill="#1E3A5F" radius={[0, 4, 4, 0]} cursor="pointer" onClick={handleSectorClick} />
              <Bar dataKey="costRisk" name="Cost Risk (%)" fill="#EF4444" radius={[0, 4, 4, 0]} cursor="pointer" onClick={handleSectorClick} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export const StateRiskChart = () => {
  const navigate = useNavigate();
  const {
    projects: contextProjects,
    setSelectedSectorFilter,
    setSelectedMinistryFilter,
    setSelectedStateFilter,
    setSelectedRiskFilter,
    setSearchQuery
  } = useDashboard();
  const { isStateAuthority, assignedState } = useAuth();

  const scopedProjects = useMemo(() => {
    const list = Array.isArray(contextProjects) && contextProjects.length > 0 ? contextProjects : MOCK_PROJECTS;
    if (isStateAuthority && assignedState) {
      return list.filter((p) => isProjectInState(p, assignedState));
    }
    return list;
  }, [contextProjects, isStateAuthority, assignedState]);

  const data = useMemo(() => {
    if (!isStateAuthority) return STATE_RISK_DATA;
    const dynamic = calculateStateRiskData(scopedProjects, isStateAuthority, assignedState);
    return dynamic || [];
  }, [scopedProjects, isStateAuthority, assignedState]);

  const handleStateClick = (entry) => {
    const stateName = entry?.state || entry?.payload?.state || (typeof entry === 'string' ? entry : null);
    if (!stateName) return;
    if (!isStateAuthority) {
      setSelectedStateFilter(stateName);
    }
    setSelectedSectorFilter('ALL');
    setSelectedMinistryFilter('ALL');
    setSelectedRiskFilter('ALL');
    setSearchQuery('');
    navigate('/projects');
  };

  const handleRiskTierClick = (riskTierName) => {
    if (riskTierName.includes('Critical')) setSelectedRiskFilter('CRITICAL');
    else if (riskTierName.includes('High')) setSelectedRiskFilter('HIGH');
    else if (riskTierName.includes('Medium')) setSelectedRiskFilter('MEDIUM');
    else if (riskTierName.includes('Low')) setSelectedRiskFilter('LOW');
    if (isStateAuthority && assignedState) {
      setSelectedStateFilter(assignedState);
    }
    setSelectedSectorFilter('ALL');
    setSelectedMinistryFilter('ALL');
    setSearchQuery('');
    navigate('/projects');
  };

  const singleStateTierData = useMemo(() => {
    if (isStateAuthority && data.length === 1) {
      const item = data[0];
      const total = (item.critical || 0) + (item.high || 0) + (item.med || 0) + (item.low || 0) || item.projects || 1;
      return [
        {
          name: 'Critical Risk',
          count: item.critical || 0,
          percent: Number((((item.critical || 0) / total) * 100).toFixed(1)),
          fill: '#EF4444',
        },
        {
          name: 'High Risk',
          count: item.high || 0,
          percent: Number((((item.high || 0) / total) * 100).toFixed(1)),
          fill: '#F97316',
        },
        {
          name: 'Medium Risk',
          count: item.med || 0,
          percent: Number((((item.med || 0) / total) * 100).toFixed(1)),
          fill: '#F59E0B',
        },
        {
          name: 'Low Risk',
          count: item.low || 0,
          percent: Number((((item.low || 0) / total) * 100).toFixed(1)),
          fill: '#10B981',
        },
      ];
    }
    return null;
  }, [data, isStateAuthority]);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">
          {isStateAuthority && assignedState ? `${assignedState} Risk Distribution` : 'State-wise Risk Distribution'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {isStateAuthority && assignedState
            ? `Volume and proportion of Critical, High, Medium & Low risk infrastructure projects in ${assignedState}`
            : 'Volume of Critical & High risk infrastructure projects across key states'}
        </p>
      </div>

      <div className="w-full">
        {data.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No projects found in {assignedState} jurisdiction.
          </div>
        ) : isStateAuthority && singleStateTierData ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {singleStateTierData.map((tier) => (
                <div
                  key={tier.name}
                  onClick={() => handleRiskTierClick(tier.name)}
                  title={`Click to view ${tier.name} projects in ${assignedState}`}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300 hover:shadow-sm cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{tier.name}</span>
                    <span className="text-lg font-extrabold text-slate-800 font-mono">{tier.count}</span>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${tier.fill}18`, color: tier.fill }}
                  >
                    {tier.percent}%
                  </span>
                </div>
              ))}
            </div>

            <div className="h-72 max-w-[340px] mx-auto w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                  barGap={4}
                  className="cursor-pointer"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="state"
                    axisLine={{ stroke: '#CBD5E1', strokeWidth: 1.5 }}
                    tickLine={false}
                    tick={{ fontSize: 13, fill: '#1E293B', fontWeight: 700 }}
                    dy={6}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748B' }}
                  />
                  <Tooltip
                    formatter={(value, name) => [`${value} Projects`, name]}
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '14px', fontSize: '11px' }} />
                  <Bar dataKey="critical" name="Critical Risk" fill="#EF4444" barSize={40} radius={[6, 6, 0, 0]} cursor="pointer" onClick={() => handleRiskTierClick('Critical Risk')} />
                  <Bar dataKey="high" name="High Risk" fill="#F97316" barSize={40} radius={[6, 6, 0, 0]} cursor="pointer" onClick={() => handleRiskTierClick('High Risk')} />
                  <Bar dataKey="med" name="Medium Risk" fill="#F59E0B" barSize={40} radius={[6, 6, 0, 0]} cursor="pointer" onClick={() => handleRiskTierClick('Medium Risk')} />
                  <Bar dataKey="low" name="Low Risk" fill="#10B981" barSize={40} radius={[6, 6, 0, 0]} cursor="pointer" onClick={() => handleRiskTierClick('Low Risk')} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          /* Central Authority / Multi-state Original Stacked Bar Chart */
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={STATE_RISK_DATA}
                margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    handleStateClick(e.activePayload[0].payload);
                  }
                }}
                className="cursor-pointer"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="state"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10, fill: '#475569' }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip
                  formatter={(value, name, item) => [`${value} Projects (${item?.payload?.state || ''})`, name]}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />
                <Bar dataKey="critical" name="Critical Risk" stackId="a" fill="#EF4444" cursor="pointer" onClick={handleStateClick} />
                <Bar dataKey="high" name="High Risk" stackId="a" fill="#F97316" cursor="pointer" onClick={handleStateClick} />
                <Bar dataKey="med" name="Medium Risk" stackId="a" fill="#F59E0B" cursor="pointer" onClick={handleStateClick} />
                <Bar dataKey="low" name="Low Risk" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} cursor="pointer" onClick={handleStateClick} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export const MinistryRiskChart = () => {
  const navigate = useNavigate();
  const {
    projects: contextProjects,
    setSelectedSectorFilter,
    setSelectedMinistryFilter,
    setSelectedStateFilter,
    setSelectedRiskFilter,
    setSearchQuery
  } = useDashboard();
  const { isStateAuthority, assignedState } = useAuth();

  const scopedProjects = useMemo(() => {
    const list = Array.isArray(contextProjects) && contextProjects.length > 0 ? contextProjects : MOCK_PROJECTS;
    if (isStateAuthority && assignedState) {
      return list.filter((p) => isProjectInState(p, assignedState));
    }
    return list;
  }, [contextProjects, isStateAuthority, assignedState]);

  const data = useMemo(() => {
    if (!isStateAuthority) return MINISTRY_RISK_DATA;
    const dynamic = calculateMinistryRiskData(scopedProjects);
    return dynamic || [];
  }, [scopedProjects, isStateAuthority]);

  const handleMinistryClick = (entry) => {
    const ministryName = entry?.ministry || entry?.payload?.ministry || (typeof entry === 'string' ? entry : null);
    if (!ministryName) return;
    setSelectedSectorFilter('ALL');
    setSelectedRiskFilter('ALL');
    setSearchQuery('');
    if (isStateAuthority && assignedState) {
      setSelectedStateFilter(assignedState);
    }
    setSelectedMinistryFilter(ministryName);
    navigate('/projects');
  };

  const CustomMinistryTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      const name = payload[0].name;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-700">
          <div className="font-bold text-sky-300 text-sm">{label}</div>
          <div className="text-slate-300">{name}: <span className="font-mono font-bold text-white">{val}</span></div>
          <div className="pt-1 text-[10px] text-sky-300 font-medium italic">
            Click to view {label} projects →
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">Ministry-wise Risk Index</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {isStateAuthority && assignedState
            ? `Proportion of critical infrastructure exposure under central administrative ministries in ${assignedState}`
            : 'Proportion of critical infrastructure exposure under central administrative ministries'}
        </p>
      </div>

      <div className="h-[460px] w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No projects available for ministry analysis in {assignedState}.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
              onClick={(e) => {
                if (e && e.activePayload && e.activePayload.length) {
                  handleMinistryClick(e.activePayload[0].payload);
                }
              }}
              className="cursor-pointer"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis
                dataKey="ministry"
                type="category"
                interval={0}
                tick={{ fontSize: 10, fill: '#334155' }}
                width={180}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip content={<CustomMinistryTooltip />} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }} />
              <Bar dataKey="avgRisk" name="Avg Risk Index" fill="#2563EB" radius={[0, 4, 4, 0]} cursor="pointer" onClick={handleMinistryClick} />
              <Bar dataKey="criticalPercent" name="Critical % Ratio" fill="#DC2626" radius={[0, 4, 4, 0]} cursor="pointer" onClick={handleMinistryClick} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
