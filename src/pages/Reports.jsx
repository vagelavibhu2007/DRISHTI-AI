import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Building2,
  Calendar,
  X,
  Layers,
  ShieldCheck,
  Search,
  Filter,
  ShieldAlert,
  ArrowUpRight,
  MapPin,
  IndianRupee,
  Clock,
  Gauge,
  Activity,
  RefreshCw
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { exportProjectsToCSV, exportPmoBriefToCSV, formatCurrency, formatPercent } from '../utils/riskUtils';
import { RiskBadge } from '../components/common/RiskBadge';
import PmoBriefingSheetModal from '../components/reports/PmoBriefingSheetModal';

export const Reports = () => {
  const { projects, stats, isLoading } = useDashboard();
  const { isStateAuthority, assignedState } = useAuth();
  const [toastMessage, setToastMessage] = useState(null);
  const [pmoModalOpen, setPmoModalOpen] = useState(false);
  const [selectedPmoProject, setSelectedPmoProject] = useState(null);
  const [autoPrintModal, setAutoPrintModal] = useState(false);

  // Search and filter state for Live Projects Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [displayCount, setDisplayCount] = useState(15);

  // Dynamic counts computed from live projects array
  const counts = useMemo(() => {
    return {
      all: projects.length,
      critical: projects.filter((p) => p.riskLevel === 'CRITICAL' || p.overallRisk >= 80).length,
      high: projects.filter((p) => p.riskLevel === 'HIGH' || (p.overallRisk >= 50 && p.overallRisk < 80)).length,
      medium: projects.filter((p) => p.riskLevel === 'MEDIUM' || (p.overallRisk >= 25 && p.overallRisk < 50)).length,
      low: projects.filter((p) => p.riskLevel === 'LOW' || p.overallRisk < 25).length,
    };
  }, [projects]);

  // Unique sectors for filtering
  const availableSectors = useMemo(() => {
    const set = new Set(projects.map((p) => p.sector).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  // Filtered live projects list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Risk filter
      if (riskFilter !== 'ALL') {
        if (riskFilter === 'CRITICAL' && p.riskLevel !== 'CRITICAL' && p.overallRisk < 80) return false;
        if (riskFilter === 'HIGH' && p.riskLevel !== 'HIGH' && (p.overallRisk < 50 || p.overallRisk >= 80)) return false;
        if (riskFilter === 'MEDIUM' && p.riskLevel !== 'MEDIUM' && (p.overallRisk < 25 || p.overallRisk >= 50)) return false;
        if (riskFilter === 'LOW' && p.riskLevel !== 'LOW' && p.overallRisk >= 25) return false;
      }

      // Sector filter
      if (sectorFilter !== 'ALL' && p.sector !== sectorFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchId = String(p.projectId || '').toLowerCase().includes(query);
        const matchName = String(p.projectName || '').toLowerCase().includes(query);
        const matchMinistry = String(p.ministry || '').toLowerCase().includes(query);
        const matchState = String(p.state || '').toLowerCase().includes(query);
        const matchDistrict = String(p.district || '').toLowerCase().includes(query);
        const matchContractor = String(p.contractor || '').toLowerCase().includes(query);
        return matchId || matchName || matchMinistry || matchState || matchDistrict || matchContractor;
      }

      return true;
    });
  }, [projects, searchQuery, riskFilter, sectorFilter]);

  // Action handlers
  const handleOpenProjectPmo = (proj, autoPrint = false) => {
    setSelectedPmoProject(proj);
    setAutoPrintModal(autoPrint);
    setPmoModalOpen(true);
  };

  const handleExportSingleCSV = (proj) => {
    exportPmoBriefToCSV(proj);
    setToastMessage(`Exported Live PMO Briefing CSV for Project #${proj.projectId}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportFilteredCSV = () => {
    const filename = `drishti_live_projects_pmo_feed_${new Date().toISOString().slice(0, 10)}.csv`;
    exportProjectsToCSV(filteredProjects, filename);
    setToastMessage(`Exported ${filteredProjects.length} live project records to ${filename}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: 'Executive Reports' }]}
      title="Live Infrastructure Intelligence Reports"
      subtitle="Analyze live project data, explainable AI hazard drivers, and generate instant official PDF dossiers and CSV feeds."
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-3 duration-200 max-w-md">
          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* LIVE SYNCHRONIZATION HEADER BANNER */}
      <div className="mb-6 p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Synchronization Active
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Cabinet Secretariat • PM-GatiShakti NMP
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Real-Time Project Intelligence & PMO Briefing Engine
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every report dynamically pulls live physical milestones, cumulative disbursements, contractor velocities, and SHAP Explainable AI hazard metrics directly from active project records.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800 lg:min-w-[420px]">
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-sans font-bold">Monitored</span>
              <strong className="text-white text-sm sm:text-base">{projects.length}</strong>
              <span className="text-[10px] text-slate-500 block">Projects</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-red-400 uppercase block font-sans font-bold">Critical</span>
              <strong className="text-red-400 text-sm sm:text-base">{counts.critical}</strong>
              <span className="text-[10px] text-slate-500 block">Priority Assets</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-amber-400 uppercase block font-sans font-bold">At-Risk Capital</span>
              <strong className="text-amber-400 text-xs sm:text-sm">₹{(stats.atRiskCapitalValueCr || 1142800).toLocaleString()} Cr</strong>
              <span className="text-[10px] text-slate-500 block">Exposure</span>
            </div>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-emerald-400 uppercase block font-sans font-bold">AI Precision</span>
              <strong className="text-emerald-400 text-sm sm:text-base">{stats.aiConfidenceIndex || 94.6}%</strong>
              <span className="text-[10px] text-slate-500 block">Confidence</span>
            </div>
          </div>
        </div>

        {/* Subtle grid background */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-grid-dark opacity-10 pointer-events-none" />
      </div>

      {/* LIVE PROJECTS DIRECTORY & PMO DOSSIER EXPLORER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6 space-y-5">
        
        {/* Search & Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-gov-700" />
              <span>Project-by-Project PMO Intelligence Dossiers</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any project to inspect its live PMO briefing sheet, or export its isolated A4 PDF dossier and CSV feed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFilteredCSV}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Export Current Filtered Dataset to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export {filteredProjects.length} Records to CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls (Search + Risk Filter Tabs + Sector Dropdown) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID (e.g. 701410), Project Name, Contractor, State, or Ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Risk Level Filter Pills with Live Count Badges */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { label: 'ALL', count: counts.all, color: 'bg-slate-900 text-white' },
              { label: 'CRITICAL', count: counts.critical, color: 'bg-red-600 text-white' },
              { label: 'HIGH', count: counts.high, color: 'bg-orange-600 text-white' },
              { label: 'MEDIUM', count: counts.medium, color: 'bg-amber-600 text-white' },
              { label: 'LOW', count: counts.low, color: 'bg-emerald-600 text-white' },
            ].map((f) => (
              <button
                key={f.label}
                onClick={() => setRiskFilter(f.label)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${riskFilter === f.label ? `${f.color} shadow-sm` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${riskFilter === f.label ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sector Filter Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              {availableSectors.map((s) => (
                <option key={s} value={s}>
                  {s === 'ALL' ? 'All Infrastructure Sectors' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter & Search Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{Math.min(displayCount, filteredProjects.length)}</strong> of <strong>{filteredProjects.length}</strong> matching live projects
          </span>
          {filteredProjects.length === 0 && (
            <span className="text-red-600 font-semibold">No active projects match the specified search or filter criteria.</span>
          )}
        </div>

        {/* Live Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.slice(0, displayCount).map((proj) => {
            const expPercent = Number(proj.expenditurePercentage || (proj.originalCost > 0 ? (proj.cumulativeExpenditure / proj.originalCost) * 100 : 0));
            const diffGap = Number((expPercent - (proj.physicalProgress || 0)).toFixed(1));

            return (
              <div
                key={proj.projectId}
                className="p-4 bg-slate-50/70 hover:bg-white rounded-xl border border-slate-200/90 hover:border-amber-400/90 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      #{proj.projectId}
                    </span>
                    <RiskBadge level={proj.riskLevel} score={proj.overallRisk} size="xs" />
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-950 line-clamp-2 leading-snug">
                    {proj.projectName}
                  </h3>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="truncate font-semibold text-slate-800">
                      {proj.ministry} • <span className="text-slate-500 font-normal">{proj.sector}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{proj.state} {proj.district ? `(${proj.district})` : ''}</span>
                    </div>
                    {proj.contractor && (
                      <div className="truncate text-[10px] text-slate-400">
                        Agency: <strong className="text-slate-600">{proj.contractor}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-3">
                  {/* Live Metrics Grid */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Sanctioned</span>
                      <strong className="text-slate-800 text-xs">{formatCurrency(proj.originalCost)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Physical %</span>
                      <strong className="text-emerald-700 text-xs">{formatPercent(proj.physicalProgress)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Spend Gap</span>
                      <strong className={`text-xs ${diffGap > 10 ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                        +{diffGap}%
                      </strong>
                    </div>
                  </div>

                  {/* Actions for this specific project */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenProjectPmo(proj, false)}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-950 border border-slate-200 hover:border-amber-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>View Live PMO Dossier</span>
                    </button>

                    <button
                      onClick={() => handleExportSingleCSV(proj)}
                      className="p-1.5 bg-white hover:bg-slate-100 text-emerald-600 border border-slate-200 rounded-lg transition"
                      title={`Export CSV for Project #${proj.projectId}`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenProjectPmo(proj, true)}
                      className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition shadow-2xs"
                      title={`Export & Print Single A4 PDF for Project #${proj.projectId}`}
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {filteredProjects.length > displayCount && (
          <div className="pt-4 text-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 15)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Load More Projects ({filteredProjects.length - displayCount} remaining)
            </button>
          </div>
        )}

      </div>

      {/* Dynamic PMO Executive Briefing Sheet Modal */}
      {pmoModalOpen && (
        <PmoBriefingSheetModal
          project={selectedPmoProject}
          projectsList={projects}
          autoPrint={autoPrintModal}
          onClose={() => setPmoModalOpen(false)}
          onSelectProject={(projId) => {
            const found = projects.find((p) => String(p.projectId) === String(projId));
            if (found) setSelectedPmoProject(found);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Reports;
