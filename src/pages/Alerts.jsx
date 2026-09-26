import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  ExternalLink,
  RotateCcw,
  Mail,
  Send,
  Check,
  X,
  Sparkles,
  Building2,
  MapPin,
  Flame,
  Loader2
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { useDashboard } from '../context/DashboardContext';
import { RiskBadge } from '../components/common/RiskBadge';
import StatusBadge from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { api } from '../services/api';

export const Alerts = () => {
  const navigate = useNavigate();
  const { alerts, updateAlertStatus, stats, projects } = useDashboard();

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Email Dispatch Modal State
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedProjectForEmail, setSelectedProjectForEmail] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('hardgamer7000@gmail.com');
  const [emailNote, setEmailNote] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState(null);

  // Counts
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;
  const underReviewCount = alerts.filter((a) => a.status === 'Under Review').length;
  const resolvedCount = alerts.filter((a) => a.status === 'Resolved').length;

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.alertId.toLowerCase().includes(q) ||
          a.projectName.toLowerCase().includes(q) ||
          a.riskType.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [alerts, severityFilter, statusFilter, searchQuery]);

  const handleOpenEmailModal = (alert) => {
    const matchedProject = projects.find(p => p.projectId === alert.projectId) || {
      projectId: alert.projectId,
      projectName: alert.projectName,
      ministry: alert.ministry,
      state: alert.state,
      overallRisk: alert.probability || 88.0,
      costRisk: 90.0,
      timeRisk: 85.0,
      physicalProgress: 42.0,
      cumulativeExpenditure: 1890,
      originalCost: 1976
    };
    setSelectedProjectForEmail(matchedProject);
    setEmailStatusMsg(null);
    setIsEmailModalOpen(true);
  };

  const handleSendEmailDispatch = async () => {
    setIsSendingEmail(true);
    setEmailStatusMsg(null);
    try {
      const pid = selectedProjectForEmail?.projectId || '701410';
      const res = await api.dispatchCriticalAlert(pid, recipientEmail, emailNote);
      setEmailStatusMsg({
        type: 'success',
        text: `Critical alert successfully dispatched to ${recipientEmail} with PM & Central/State CC.`
      });
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setEmailStatusMsg(null);
      }, 2500);
    } catch (err) {
      setEmailStatusMsg({
        type: 'error',
        text: err.message || 'Failed to dispatch alert email.'
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendStateDigest = async () => {
    setIsSendingEmail(true);
    try {
      await api.dispatchStateDigest('Gujarat', recipientEmail);
      alert(`🏛️ State Authority Critical Digest for Gujarat dispatched directly to ${recipientEmail}!`);
    } catch (err) {
      alert(`Error sending digest: ${err.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: 'Early Warnings' }]}
      title="Early Warning & Anomaly Detection Radar"
      subtitle="Automated predictive incident detection and direct Gmail escalation dispatch."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenEmailModal(alerts[0] || { projectId: '701410', projectName: 'Rajasthan Feeder Project' })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Dispatch Alert to {recipientEmail}</span>
          </button>

          <button
            onClick={handleSendStateDigest}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition"
          >
            <Building2 className="w-3.5 h-3.5 text-gov-700" />
            <span>Send State Critical Digest</span>
          </button>
        </div>
      }
    >
      {/* Top 5 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-card">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Alerts
          </span>
          <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">
            {stats.totalActiveAlerts}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Monitored pipeline</span>
        </div>

        <div className="p-4 bg-red-50/70 rounded-xl border border-red-200 shadow-card">
          <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
            Critical Severity
          </span>
          <span className="text-2xl font-extrabold font-mono text-red-700 mt-1 block">
            {criticalCount}
          </span>
          <span className="text-[10px] text-red-600/80 mt-0.5 block">Requires immediate action</span>
        </div>

        <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200 shadow-card">
          <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">
            High Severity
          </span>
          <span className="text-2xl font-extrabold font-mono text-orange-700 mt-1 block">
            {highCount}
          </span>
          <span className="text-[10px] text-orange-600/80 mt-0.5 block">Elevated risk trajectory</span>
        </div>

        <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 shadow-card">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Under Review
          </span>
          <span className="text-2xl font-extrabold font-mono text-amber-700 mt-1 block">
            {underReviewCount}
          </span>
          <span className="text-[10px] text-amber-600/80 mt-0.5 block">Assigned to field auditors</span>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 shadow-card">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
            Resolved This Month
          </span>
          <span className="text-2xl font-extrabold font-mono text-emerald-700 mt-1 block">
            {stats.resolvedAlertsMonth}
          </span>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">Mitigation applied</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search alert by ID, project name or issue type..."
          className="flex-1 max-w-md"
        />

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Severity</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-gov-700/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Action Initiated">Action Initiated</option>
            <option value="Resolved">Resolved</option>
          </select>

          {(severityFilter !== 'ALL' || statusFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSeverityFilter('ALL');
                setStatusFilter('ALL');
                setSearchQuery('');
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition"
              title="Reset Alert Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/90 text-slate-700 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5">Alert ID</th>
                <th className="py-3 px-3 min-w-[200px]">Project</th>
                <th className="py-3 px-3">Risk Type</th>
                <th className="py-3 px-3 text-right">Probability</th>
                <th className="py-3 px-3 text-center">Severity</th>
                <th className="py-3 px-3 min-w-[220px]">Reason & AI Recommendation</th>
                <th className="py-3 px-3 hidden lg:table-cell">Created</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3.5 text-center min-w-[160px]">Direct Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAlerts.map((alert) => (
                <tr key={alert.alertId} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3.5 font-mono font-bold text-gov-800">
                    {alert.alertId}
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => navigate(`/projects/${alert.projectId}`)}
                      className="font-bold text-slate-900 hover:text-gov-700 text-left line-clamp-1 block"
                    >
                      {alert.projectName}
                    </button>
                    <span className="text-[10px] text-slate-400">
                      {alert.ministry} • {alert.state}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {alert.riskType}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-red-600">
                    {alert.probability}%
                  </td>

                  <td className="py-3 px-3 text-center">
                    <RiskBadge level={alert.severity} size="xs" />
                  </td>

                  <td className="py-3 px-3">
                    <p className="text-slate-700 line-clamp-2 text-[11px]">{alert.reason}</p>
                    {alert.recommendation && (
                      <span className="text-[10px] text-gov-800 font-semibold block mt-0.5">
                        Rec: {alert.recommendation}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 hidden lg:table-cell text-[11px] text-slate-500 whitespace-nowrap">
                    {alert.created}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <StatusBadge status={alert.status} />
                  </td>

                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Direct Gmail Dispatch Trigger */}
                      <button
                        onClick={() => handleOpenEmailModal(alert)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition"
                        title="Send Critical Email Alert"
                      >
                        <Mail className="w-3 h-3 text-red-600" />
                        <span>Email PM</span>
                      </button>

                      {alert.status === 'New' && (
                        <button
                          onClick={() => updateAlertStatus(alert.alertId, 'Under Review')}
                          className="px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded transition"
                        >
                          Review
                        </button>
                      )}
                      {alert.status === 'Under Review' && (
                        <button
                          onClick={() => updateAlertStatus(alert.alertId, 'Action Initiated')}
                          className="px-2 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded transition"
                        >
                          Action
                        </button>
                      )}
                      {alert.status === 'Action Initiated' && (
                        <button
                          onClick={() => updateAlertStatus(alert.alertId, 'Resolved')}
                          className="px-2 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/projects/${alert.projectId}`)}
                        className="p-1 text-slate-400 hover:text-gov-700 hover:bg-slate-100 rounded transition"
                        title="View Project Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Alert Email Dispatch Modal */}
      {isEmailModalOpen && selectedProjectForEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Dispatch Critical Alert via Gmail</h3>
                  <span className="text-[10px] text-slate-400">Option C Hierarchy &bull; Project Head &amp; State/Central CC</span>
                </div>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              {/* Project Brief Card with Official Emblem */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🇮🇳</span>
                    <span className="text-[11px] font-bold text-slate-700 uppercase">DRISHTI AI Alert Brief</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                    CRITICAL ({(selectedProjectForEmail.overallRisk || 88.0).toFixed(1)}%)
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                  {selectedProjectForEmail.projectName}
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-600">
                  <div><strong>ID:</strong> #{selectedProjectForEmail.projectId}</div>
                  <div><strong>State:</strong> {selectedProjectForEmail.state}</div>
                  <div><strong>Ministry:</strong> {selectedProjectForEmail.ministry}</div>
                  <div><strong>Progress:</strong> {selectedProjectForEmail.physicalProgress || 42}%</div>
                </div>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Email (Project Head / Manager):
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="hardgamer7000@gmail.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* 48-72h Escalation Clause Warning */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>72h Escalation SLA:</strong> If the Project Manager does not log mitigation within 3 days, the system will fire an automated Tier-2 Escalation to Central Ministry leadership.
                </div>
              </div>

              {/* Status Message */}
              {emailStatusMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  emailStatusMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {emailStatusMsg.text}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isSendingEmail}
                onClick={handleSendEmailDispatch}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow transition disabled:opacity-50"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching via Gmail...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Critical Email Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Alerts;
