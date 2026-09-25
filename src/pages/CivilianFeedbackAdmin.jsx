import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  RefreshCw,
  ShieldAlert,
  ChevronRight,
  User,
  MapPin,
  Calendar,
  ExternalLink,
  ThumbsUp,
  FileText,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Building2,
  Tag,
  Info,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { civilianFeedback } from '../services/api';

export const CivilianFeedbackAdmin = () => {
  const { isHighestRankCentralAuthority, user } = useAuth();
  const { refreshCivilianStats } = useDashboard();

  // State Management
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unreviewed: 0,
    in_progress: 0,
    resolved: 0,
    feedback_count: 0,
    issues_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState('ALL');

  // Load Data
  const loadData = useCallback(async () => {
    if (!isHighestRankCentralAuthority) return;
    try {
      setLoading(true);
      setError(null);
      const [itemsRes, statsRes] = await Promise.all([
        civilianFeedback.getAll(),
        civilianFeedback.getStats()
      ]);

      if (itemsRes?.success) {
        setItems(itemsRes.data || []);
      }
      if (statsRes?.success) {
        setStats(statsRes.data || {});
      }
    } catch (err) {
      console.error('Failed to load civilian feedback:', err);
      setError(err?.message || 'Failed to fetch civilian feedback and issues.');
    } finally {
      setLoading(false);
    }
  }, [isHighestRankCentralAuthority]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived filter options
  const filterOptions = useMemo(() => {
    const states = new Set();
    const districts = new Set();
    const projects = new Set();

    items.forEach(item => {
      if (item.state) states.add(item.state);
      if (item.district) districts.add(item.district);
      if (item.project_name) projects.add(item.project_name);
    });

    return {
      states: Array.from(states).sort(),
      districts: Array.from(districts).sort(),
      projects: Array.from(projects).sort()
    };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedType !== 'ALL') {
        const itemType = (item.item_type || item.type || '').toUpperCase();
        if (selectedType === 'FEEDBACK' && itemType !== 'FEEDBACK') return false;
        if (selectedType === 'ISSUE' && itemType !== 'ISSUE') return false;
      }

      if (selectedStatus !== 'ALL') {
        const itemStatus = (item.status || 'PENDING').toUpperCase();
        if (itemStatus !== selectedStatus) return false;
      }

      if (selectedState !== 'ALL' && item.state !== selectedState) return false;
      if (selectedDistrict !== 'ALL' && item.district !== selectedDistrict) return false;
      if (selectedProject !== 'ALL' && item.project_name !== selectedProject) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const civilian = (item.civilian_name || item.name || '').toLowerCase();
        const project = (item.project_name || '').toLowerCase();
        const projectId = (item.project_id || '').toLowerCase();
        const desc = (item.description || item.message || '').toLowerCase();
        const category = (item.category || item.issue_type || '').toLowerCase();
        const loc = `${item.district || ''} ${item.state || ''}`.toLowerCase();

        return (
          civilian.includes(q) ||
          project.includes(q) ||
          projectId.includes(q) ||
          desc.includes(q) ||
          category.includes(q) ||
          loc.includes(q)
        );
      }

      return true;
    });
  }, [items, selectedType, selectedStatus, selectedState, selectedDistrict, selectedProject, searchQuery]);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedItem) return;
    setIsUpdating(true);
    setActionSuccess('');
    try {
      const itemType = selectedItem.item_type || 'feedback';
      const itemId = selectedItem.id;
      const res = await civilianFeedback.updateStatus(itemType, itemId, newStatus, adminNotes);

      if (res?.success) {
        setActionSuccess(`Status successfully updated to ${newStatus.replace('_', ' ')}!`);
        setItems(prev =>
          prev.map(it =>
            it.id === itemId && (it.item_type || 'feedback') === itemType
              ? { ...it, status: newStatus, admin_notes: adminNotes || it.admin_notes, updated_at: new Date().toISOString() }
              : it
          )
        );
        setSelectedItem(prev => (prev ? { ...prev, status: newStatus, admin_notes: adminNotes || prev.admin_notes } : null));
        setAdminNotes('');
        
        const statsRes = await civilianFeedback.getStats();
        if (statsRes?.success) setStats(statsRes.data);
        if (refreshCivilianStats) refreshCivilianStats();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err?.message || 'Failed to update item status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isHighestRankCentralAuthority) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-red-700 max-w-md mx-auto mb-4">
            Civilian Feedback and Ground Issues triage is restricted exclusively to the Highest-Rank Central Authority (Chief Project Officer).
          </p>
          <div className="inline-block px-3 py-1 bg-white border border-red-300 rounded text-xs font-mono text-slate-600">
            Current User: {user?.full_name || user?.username || 'Guest'} ({user?.role || 'Unknown'})
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Civilian Feedback & Ground Issues
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Central Apex Authority Only
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Real-time citizen ground intelligence & grievance triage directly from the JanNirikshan Civilian Portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Feed
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Submissions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{stats.total || items.length}</div>
          <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-2">
            <span>{stats.feedback_count || 0} Feedback</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{stats.issues_count || 0} Ground Issues</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-xs hover:border-amber-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Awaiting Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-900">{stats.unreviewed || 0}</div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">
            Requires Central Officer Attention
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-200/80 bg-blue-50/20 shadow-xs hover:border-blue-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Under Action</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-blue-900">{stats.in_progress || 0}</div>
          <div className="mt-1 text-[11px] text-blue-700 font-medium">
            Assigned & In Field Investigation
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Resolved / Closed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-900">{stats.resolved || 0}</div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">
            Remediated & Verified
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search civilian name, project name, ID, category or description..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-gov-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {['ALL', 'FEEDBACK', 'ISSUE'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  selectedType === type
                    ? 'bg-white text-gov-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'ALL' ? 'All Types' : type === 'FEEDBACK' ? 'Feedback' : 'Ground Issues'}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-gov-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('ALL');
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-gov-600"
            >
              <option value="ALL">All States</option>
              {filterOptions.states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-gov-600"
            >
              <option value="ALL">All Districts</option>
              {filterOptions.districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-gov-600 truncate"
            >
              <option value="ALL">All Projects</option>
              {filterOptions.projects.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Table/List + Detail Modal */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-gov-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading citizen intelligence stream...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={loadData}
              className="mt-4 px-4 py-2 bg-gov-900 text-white text-xs font-semibold rounded-lg hover:bg-gov-800"
            >
              Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Citizen Submissions Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No feedback or issues match the selected search criteria and filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Citizen & Location</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Subject / Description</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredItems.map((item) => {
                  const isIssue = (item.item_type || item.type || '').toUpperCase() === 'ISSUE';
                  const status = (item.status || 'PENDING').toUpperCase();

                  return (
                    <tr
                      key={`${item.item_type || 'feedback'}-${item.id}`}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => {
                        setSelectedItem(item);
                        setAdminNotes(item.admin_notes || '');
                        setActionSuccess('');
                      }}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isIssue ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Ground Issue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <MessageSquare className="w-3 h-3 text-blue-600" />
                            Feedback
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{item.civilian_name || item.name || 'Anonymous Citizen'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{item.district || 'District N/A'}, {item.state || 'State N/A'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-semibold text-slate-800 truncate" title={item.project_name}>
                          {item.project_name || 'General Public Infrastructure'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {item.project_id || 'PROJ-GEN'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[320px]">
                        <div className="font-medium text-slate-900 truncate">
                          {item.category || item.issue_type || 'Civic Observation'}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.description || item.message || 'No description provided'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-500 font-mono">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Recent'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {status === 'RESOLVED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Resolved
                          </span>
                        ) : status === 'IN_PROGRESS' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <RefreshCw className="w-3 h-3 text-blue-600" />
                            In Progress
                          </span>
                        ) : status === 'REVIEWED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            <Eye className="w-3 h-3 text-purple-600" />
                            Reviewed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setAdminNotes(item.admin_notes || '');
                            setActionSuccess('');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold text-gov-700 bg-gov-50 border border-gov-200 rounded-md hover:bg-gov-100 transition"
                        >
                          Review & Action
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Action Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                {(selectedItem.item_type || selectedItem.type || '').toUpperCase() === 'ISSUE' ? (
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {(selectedItem.item_type || selectedItem.type || '').toUpperCase() === 'ISSUE' ? 'Ground Issue Details' : 'Civilian Feedback Details'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Reference ID: #{selectedItem.id} • Portal: JanNirikshan
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {actionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Citizen Name</span>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedItem.civilian_name || selectedItem.name || 'Anonymous'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Location</span>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedItem.district || 'District N/A'}, {selectedItem.state || 'State N/A'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Associated Project</span>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{selectedItem.project_name || 'General Project'}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{selectedItem.project_id}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Submission Date</span>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {selectedItem.created_at
                        ? new Date(selectedItem.created_at).toLocaleString('en-IN')
                        : 'Recent'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Citizen Statement / Issue Report
                </span>
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap shadow-xs">
                  {selectedItem.description || selectedItem.message || 'No description provided.'}
                </div>
              </div>

              {selectedItem.rating && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-600">Citizen Satisfaction:</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {'★'.repeat(selectedItem.rating)}
                    <span className="text-slate-500 text-xs ml-1 font-mono">({selectedItem.rating}/5)</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Apex Authority Remediation Notes / Directives
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter review notes, instructions to project engineers, or justification for status change..."
                  rows={3}
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-gov-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Current Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 uppercase">
                  {selectedItem.status || 'PENDING'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus('REVIEWED')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition shadow-xs"
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition shadow-xs"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus('RESOLVED')}
                  disabled={isUpdating}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-xs"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CivilianFeedbackAdmin;
