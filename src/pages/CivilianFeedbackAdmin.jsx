import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { api } from '../services/api';
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
  Building,
  ShieldCheck,
  User,
  Phone,
  Mail,
  FileCheck2,
  Sparkles,
  ArrowUpDown,
  X,
  RefreshCw,
  Check
} from 'lucide-react';

export const CivilianFeedbackAdmin = () => {
  const { user, isHighestRankCentralAuthority, isStateAuthority } = useAuth();
  const { refreshCivilianStats } = useDashboard();
  const navigate = useNavigate();

  // State
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    totalSubmissions: 0,
    waitingReviewCount: 0,
    reviewedCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
    feedbackTotal: 0,
    issueTotal: 0
  });
  const [filtersMetadata, setFiltersMetadata] = useState({
    availableStates: [],
    availableDistricts: [],
    availableProjects: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL'); // ALL, FEEDBACK, ISSUE
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('ALL');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');

  // Modal / Detail Drawer
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Fetch Data from Backend
  const loadFeedbackData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const params = {};
      if (selectedTypeFilter !== 'ALL') params.item_type = selectedTypeFilter;
      if (selectedStateFilter !== 'ALL') params.state = selectedStateFilter;
      if (selectedDistrictFilter !== 'ALL') params.district = selectedDistrictFilter;
      if (selectedProjectFilter !== 'ALL') params.project_id = selectedProjectFilter;
      if (selectedStatusFilter !== 'ALL') params.status = selectedStatusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortOrder) params.sort_by = sortOrder;

      const res = await api.civilianFeedback.getAll(params);
      if (res.success && res.data) {
        setItems(res.data.items || []);
        if (res.data.summary) setSummary(res.data.summary);
        if (res.data.filters) setFiltersMetadata(res.data.filters);
      } else {
        if (res.status === 403) {
          setErrorMsg('Access Restricted: Only the highest-rank Central Authority officer (Chief Project Officer) is authorized to access Civilian Feedback.');
        } else {
          setErrorMsg(res.error || 'Failed to load civilian feedback intelligence.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isHighestRankCentralAuthority) {
      loadFeedbackData();
    }
  }, [
    isHighestRankCentralAuthority,
    selectedTypeFilter,
    selectedStateFilter,
    selectedDistrictFilter,
    selectedProjectFilter,
    selectedStatusFilter,
    sortOrder
  ]);

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    if (!selectedItem) return;
    setIsUpdatingStatus(true);
    setActionSuccessMsg('');
    try {
      const res = await api.civilianFeedback.updateStatus(
        selectedItem.itemType,
        selectedItem.id,
        newStatus,
        `Status updated to ${newStatus} by ${user?.full_name || 'Chief Project Officer'}`
      );

      if (res.success) {
        setActionSuccessMsg(`Item successfully marked as "${newStatus}"!`);
        setItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id && item.itemType === selectedItem.itemType
              ? { ...item, status: newStatus }
              : item
          )
        );
        setSelectedItem((prev) => ({ ...prev, status: newStatus }));
        refreshCivilianStats();
      } else {
        alert(res.error || 'Failed to update status.');
      }
    } catch (e) {
      alert(e.message || 'Error executing status update.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s === 'resolved' || s === 'closed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Resolved
        </span>
      );
    }
    if (s === 'in progress' || s === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          In Progress
        </span>
      );
    }
    if (s === 'reviewed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
          <FileCheck2 className="w-3.5 h-3.5" />
          Reviewed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
        <AlertTriangle className="w-3.5 h-3.5" />
        Waiting Review
      </span>
    );
  };

  if (!isHighestRankCentralAuthority) {
    return (
      <div className="p-8 max-w-4xl mx-auto my-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl">
        <div className="w-16 h-16 bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Access Restricted</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-6 text-sm">
          The <strong>Civilian Feedback & Ground Intelligence</strong> portal is reserved strictly for the
          <strong> Highest-Rank Central Authority</strong> (Chief Project Officer). State Authorities and regional officers are not authorized to view this intelligence feed.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 bg-gov-700 hover:bg-gov-800 text-white font-bold text-xs rounded-xl shadow transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-gov-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              JanNirikshan Civilian Stream
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Central Authority Executive Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-emerald-400" />
            Civilian Feedback & Ground Issues
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
            Live public monitoring, ground complaints, and community ratings submitted via the JanNirikshan Citizen Portal for national infrastructure projects.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => loadFeedbackData()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Intelligence
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Total Submissions</span>
            <Sparkles className="w-4 h-4 text-gov-600 dark:text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {summary.totalSubmissions}
            </span>
            <span className="text-[11px] text-slate-500">
              ({summary.feedbackTotal} fb / {summary.issueTotal} issues)
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-sm flex flex-col justify-between bg-rose-50/20 dark:bg-rose-950/10">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span className="text-xs font-bold uppercase">Waiting Review</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-700 dark:text-rose-400">
              {summary.waitingReviewCount}
            </span>
            <span className="text-[11px] text-rose-600/80 dark:text-rose-400/70 font-semibold">Action Required</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-sky-200 dark:border-sky-900/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-600 dark:text-sky-400">
            <span className="text-xs font-bold uppercase">Reviewed</span>
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-sky-700 dark:text-sky-400">
              {summary.reviewedCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-bold uppercase">In Progress</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-400">
              {summary.inProgressCount}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-bold uppercase">Resolved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {summary.resolvedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadFeedbackData()}
              placeholder="Search by civilian name, project name, ID, category, or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-600"
            />
          </div>

          <button
            onClick={() => loadFeedbackData()}
            className="px-4 py-2 bg-gov-700 hover:bg-gov-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
          >
            <Filter className="w-3.5 h-3.5" />
            Apply Filters
          </button>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Submission Type
            </label>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Types ({summary.totalSubmissions})</option>
              <option value="FEEDBACK">Civilian Feedback ({summary.feedbackTotal})</option>
              <option value="ISSUE">Ground Issues ({summary.issueTotal})</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Status
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="waiting">Waiting Review</option>
              <option value="Reviewed">Reviewed</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              State
            </label>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All States</option>
              {filtersMetadata.availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              District
            </label>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Districts</option>
              {filtersMetadata.availableDistricts.map((dst) => (
                <option key={dst} value={dst}>
                  {dst}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Project
            </label>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 truncate"
            >
              <option value="ALL">All Projects</option>
              {filtersMetadata.availableProjects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} - {p.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span>Submissions Feed</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {items.length} items
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gov-600" />
            <p className="text-xs font-semibold">Loading civilian submissions...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-8 text-center text-rose-600 dark:text-rose-400 space-y-2">
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <p className="text-xs font-bold">{errorMsg}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No submissions matching criteria</p>
            <p className="text-xs">Adjust your search keyword or filters above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => {
              const isFeedback = item.itemType === 'FEEDBACK';
              return (
                <div
                  key={`${item.itemType}-${item.id}`}
                  onClick={() => setSelectedItem(item)}
                  className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider border ${
                          isFeedback
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        {item.typeLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {item.category}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gov-600 dark:group-hover:text-sky-400 transition-colors">
                        {item.projectName}
                        {item.projectId && item.projectId !== 'N/A' && (
                          <span className="ml-2 text-xs font-mono font-normal text-slate-400">
                            (ID: {item.projectId})
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                        "{item.message || item.description || item.feedbackText}"
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.civilianName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.district}, {item.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-gov-700 hover:text-white dark:bg-slate-800 dark:hover:bg-gov-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <span>Review Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Inspection & Triage Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    selectedItem.itemType === 'FEEDBACK'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {selectedItem.typeLabel}
                    </span>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                    {selectedItem.projectName}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedItem(null);
                  setActionSuccessMsg('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-700 dark:text-slate-300 text-xs">
              {actionSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {actionSuccessMsg}
                </div>
              )}

              {/* Message / Description Block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Citizen Statement / Description
                </label>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-sm font-medium leading-relaxed text-slate-900 dark:text-slate-100">
                  {selectedItem.message || selectedItem.description || selectedItem.feedbackText}
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Citizen Reporter</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                    {selectedItem.civilianName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Category</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                    {selectedItem.category}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Location</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                    {selectedItem.district}, {selectedItem.state}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Submitted On</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                    {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : 'N/A'}
                  </span>
                </div>
                {selectedItem.projectId && selectedItem.projectId !== 'N/A' && (
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Project ID</span>
                    <span className="font-mono text-gov-600 dark:text-sky-400 font-bold text-xs">
                      {selectedItem.projectId}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Triage Toolbar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Executive Triage Actions (Chief Project Officer)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    disabled={isUpdatingStatus || selectedItem.status === 'Reviewed'}
                    onClick={() => handleStatusChange('Reviewed')}
                    className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Mark as Reviewed
                  </button>

                  <button
                    disabled={isUpdatingStatus || selectedItem.status === 'In Progress'}
                    onClick={() => handleStatusChange('In Progress')}
                    className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Mark as In Progress
                  </button>

                  <button
                    disabled={isUpdatingStatus || selectedItem.status === 'Resolved'}
                    onClick={() => handleStatusChange('Resolved')}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark as Resolved
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-800/50">
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setActionSuccessMsg('');
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CivilianFeedbackAdmin;
