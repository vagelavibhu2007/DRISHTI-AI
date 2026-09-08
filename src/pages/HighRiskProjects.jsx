import React, { useState, useMemo } from 'react';
import { Flame, ShieldAlert, AlertTriangle, Download, ArrowUpRight } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import ProjectTable from '../components/projects/ProjectTable';
import { useDashboard } from '../context/DashboardContext';
import { SearchBar } from '../components/common/SearchBar';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { useNavigate } from 'react-router-dom';

export const HighRiskProjects = () => {
  const { projects } = useDashboard();
  const navigate = useNavigate();

  const [filterMode, setFilterMode] = useState('CRITICAL_ONLY'); // 'CRITICAL_ONLY' | 'CRITICAL_HIGH'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');

  const filteredHighRisk = useMemo(() => {
    return projects
      .filter((p) => {
        if (filterMode === 'CRITICAL_ONLY') {
          if (p.riskLevel !== 'CRITICAL') return false;
        } else {
          if (p.riskLevel !== 'CRITICAL' && p.riskLevel !== 'HIGH') return false;
        }

        if (selectedMinistry !== 'ALL' && p.ministry !== selectedMinistry) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.projectId.toLowerCase().includes(q) ||
            p.projectName.toLowerCase().includes(q) ||
            p.state.toLowerCase().includes(q) ||
            p.sector.toLowerCase().includes(q)
          );
        }

        return true;
      })
      .sort((a, b) => b.overallRisk - a.overallRisk);
  }, [projects, filterMode, selectedMinistry, searchQuery]);

  const ministryOptions = [
    { value: 'ALL', label: 'All Ministries' },
    { value: 'Ministry of Jal Shakti', label: 'Ministry of Jal Shakti' },
    { value: 'Ministry of Road Transport & Highways', label: 'Ministry of Road Transport & Highways' },
    { value: 'Ministry of Railways', label: 'Ministry of Railways' },
    { value: 'Ministry of Petroleum & Natural Gas', label: 'Ministry of Petroleum & Natural Gas' },
    { value: 'Ministry of Power', label: 'Ministry of Power' },
  ];

  return (
    <PageContainer
      breadcrumbs={[{ label: 'High-Risk Projects Ranking' }]}
      title="High-Risk Project Ranking"
      subtitle="Projects requiring priority attention based on AI-assisted risk assessment."
      action={
        <button
          onClick={() => navigate('/reports')}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Priority Dossier</span>
        </button>
      }
    >
      {/* Top Banner Alert */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-950/80 text-red-400 border border-red-800/60">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight text-white">
              Critical Escalation Tier (410 National Assets)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identified by DRISHTI AI algorithm with &gt;80.0 combined cost and schedule hazard probability.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-red-950 text-red-300 border border-red-800/80">
            ₹ 11.42 Lakh Cr At-Risk
          </span>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Toggle Mode */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setFilterMode('CRITICAL_ONLY')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              filterMode === 'CRITICAL_ONLY'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical Only (Score ≥ 80)
          </button>
          <button
            onClick={() => setFilterMode('CRITICAL_HIGH')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
              filterMode === 'CRITICAL_HIGH'
                ? 'bg-gov-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Critical + High Risk (Score ≥ 50)
          </button>
        </div>

        {/* Search and Ministry Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search high-risk project name or ID..."
            className="flex-1 w-full"
          />

          <FilterDropdown
            value={selectedMinistry}
            onChange={setSelectedMinistry}
            options={ministryOptions}
            className="w-full sm:w-56"
          />
        </div>
      </div>

      {/* High-Risk Ranked Table */}
      <ProjectTable
        projectsList={filteredHighRisk}
        pageSize={15}
        enablePagination={true}
        title={`Ranked High-Risk Projects (${filteredHighRisk.length} Assets)`}
        subtitle="Ranked strictly in descending order of predicted overall risk score"
      />
    </PageContainer>
  );
};

export default HighRiskProjects;

