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
  ChevronRight,
  ArrowUpRight,
  MapPin,
  DollarSign,
  Clock,
  Gauge
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { REPORTS_LIST } from '../data/mockData';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { exportProjectsToCSV, exportPmoBriefToCSV, formatCurrency, formatPercent } from '../utils/riskUtils';
import { RiskBadge } from '../components/common/RiskBadge';
import PmoBriefingSheetModal from '../components/reports/PmoBriefingSheetModal';

export const Reports = () => {
  const { projects, stats } = useDashboard();
  const { isStateAuthority, assignedState } = useAuth();
  const [toastMessage, setToastMessage] = useState(null);
  const [pmoModalOpen, setPmoModalOpen] = useState(false);
  const [selectedPmoProject, setSelectedPmoProject] = useState(null);
  const [filterCriticalOnly, setFilterCriticalOnly] = useState(false);
  const [autoPrintModal, setAutoPrintModal] = useState(false);

  // Search and filter state for All Projects Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [displayCount, setDisplayCount] = useState(12);

  // Unique sectors for filtering
  const availableSectors = useMemo(() => {
    const set = new Set(projects.map((p) => p.sector).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [projects]);

  // Filtered projects list for individual project briefs
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
        return matchId || matchName || matchMinistry || matchState || matchDistrict;
      }

      return true;
    });
  }, [projects, searchQuery, riskFilter, sectorFilter]);

  // Action handlers
  const handleOpenMasterPmo = (isCritOnly = false) => {
    setFilterCriticalOnly(isCritOnly);
    setAutoPrintModal(false);
    const targetProj = isCritOnly
      ? projects.find((p) => p.riskLevel === 'CRITICAL' || p.overallRisk >= 80) || projects[0]
      : projects[0];
    setSelectedPmoProject(targetProj);
    setPmoModalOpen(true);
  };

  const handleOpenProjectPmo = (proj, autoPrint = false) => {
    setFilterCriticalOnly(false);
    setSelectedPmoProject(proj);
    setAutoPrintModal(autoPrint);
    setPmoModalOpen(true);
  };

  const handleExportSingleCSV = (proj) => {
    exportPmoBriefToCSV(proj);
    setToastMessage(`Exported PMO Briefing CSV for Project #${proj.projectId}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportPortfolioCSV = (isCritOnly = false) => {
    const listToExport = isCritOnly
      ? projects.filter((p) => p.riskLevel === 'CRITICAL' || p.overallRisk >= 80)
      : projects;
    const filename = isCritOnly ? 'pmo_critical_410_projects_feed.csv' : 'pmo_all_infrastructure_projects_feed.csv';
    exportProjectsToCSV(listToExport, filename);
    setToastMessage(`Exported ${listToExport.length} PMO records to ${filename}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: 'PMO Intelligence Reports' }]}
      title="PMO Executive Reports & Infrastructure Briefs"
      subtitle="Export formal single-project PDF dossiers, master PMO briefing sheets, and raw CSV feeds for inter-ministerial review."
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

      {/* TOP SECTION: 2 PRIMARY PMO EXECUTIVE DOSSIERS */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Primary Executive Briefs (Cabinet Secretariat Review)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Coverage: {projects.length} Monitored Projects ({isStateAuthority && assignedState ? assignedState : 'National Master Plan'})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REPORTS_LIST.map((rep) => {
            const isCrit = rep.isCriticalOnly;
            return (
              <div
                key={rep.id}
                className={`p-6 rounded-2xl border ${isCrit ? 'bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 border-red-500/40 text-white' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-amber-500/40 text-white'} shadow-xl relative overflow-hidden flex flex-col justify-between space-y-5`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-white/10 text-white border border-white/20">
                      {rep.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase font-mono tracking-wider ${isCrit ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'}`}>
                      {rep.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {rep.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {rep.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Generated: {rep.generatedDate}</span>
                    <span>Format: {rep.format}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleOpenMasterPmo(isCrit)}
                      className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>View PMO Dossier</span>
                    </button>

                    <button
                      onClick={() => handleExportPortfolioCSV(isCrit)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl transition"
                      title="Export CSV Feed"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        handleOpenMasterPmo(isCrit);
                        // Trigger printable view
                      }}
                      className={`p-2 rounded-xl text-white font-bold transition shadow-sm ${isCrit ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'}`}
                      title="Print / Save PDF Dossier"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ALL PROJECTS INDIVIDUAL PMO BRIEFS DIRECTORY */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gov-700" />
              <h2 className="text-base font-black text-slate-900">
                All Infrastructure Projects — Individual PMO Briefs Directory
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any specific project to inspect its dedicated briefing sheet, or export its single-project A4 PDF dossier directly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportPortfolioCSV(false)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export All to CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Bar (Search + Risk + Sector) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Project ID, Name, Ministry, or State..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
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

          {/* Risk Level Filter Pills */}
          <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${riskFilter === lvl ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {lvl}
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
                  {s === 'ALL' ? 'All Sectors' : s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong>{Math.min(displayCount, filteredProjects.length)}</strong> of <strong>{filteredProjects.length}</strong> matching projects
          </span>
          {filteredProjects.length === 0 && (
            <span className="text-red-500 font-semibold">No projects match the current search filters.</span>
          )}
        </div>

        {/* Projects List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.slice(0, displayCount).map((proj) => {
            return (
              <div
                key={proj.projectId}
                className="p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-amber-400/80 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      #{proj.projectId}
                    </span>
                    <RiskBadge level={proj.riskLevel} score={proj.overallRisk} size="xs" />
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-900 line-clamp-2 leading-snug">
                    {proj.projectName}
                  </h3>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="truncate font-medium text-slate-700">
                      {proj.ministry}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{proj.state} {proj.district ? `(${proj.district})` : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 space-y-3">
                  {/* Mini metrics bar */}
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60 font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Cost</span>
                      <strong className="text-slate-800">{formatCurrency(proj.originalCost)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Physical</span>
                      <strong className="text-emerald-700">{formatPercent(proj.physicalProgress)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Risk</span>
                      <strong className="text-slate-900">{proj.overallRisk}/100</strong>
                    </div>
                  </div>

                  {/* Action Buttons for Specific Project */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenProjectPmo(proj, false)}
                      className="flex-1 py-1.5 px-2 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-950 border border-slate-200 hover:border-amber-300 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>View PMO Brief</span>
                    </button>

                    <button
                      onClick={() => handleExportSingleCSV(proj)}
                      className="p-1.5 bg-white hover:bg-slate-100 text-emerald-600 border border-slate-200 rounded-lg transition"
                      title={`Export CSV Feed for Project #${proj.projectId}`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleOpenProjectPmo(proj, true)}
                      className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition shadow-2xs"
                      title={`Export & Print Single A4 PDF Dossier for Project #${proj.projectId}`}
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
              onClick={() => setDisplayCount((prev) => prev + 12)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Load More Projects ({filteredProjects.length - displayCount} remaining)
            </button>
          </div>
        )}

      </div>

      {/* PMO Executive Briefing Sheet Modal */}
      {pmoModalOpen && (
        <PmoBriefingSheetModal
          project={selectedPmoProject}
          projectsList={projects}
          filterCriticalOnly={filterCriticalOnly}
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
