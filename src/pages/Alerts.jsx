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
  Check,
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
  const { alerts, updateAlertStatus, stats } = useDashboard();

  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Email sending state per alert ID
  const [sendingAlertId, setSendingAlertId] = useState(null);
  const [sentAlertIds, setSentAlertIds] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

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

  // Fast direct 1-2 second email dispatch handler
  const handleQuickEmailDispatch = async (alert) => {
    setSendingAlertId(alert.alertId);
    try {
      await api.dispatchCriticalAlert(
        alert.projectId || '701410',
        'hardgamer7000@gmail.com',
        alert.reason || 'Critical risk milestone deviation.'
      );
      setSentAlertIds((prev) => ({ ...prev, [alert.alertId]: true }));
      setToastMessage({
        type: 'success',
        text: `🚨 Critical Alert for #${alert.projectId} dispatched to hardgamer7000@gmail.com!`
      });
      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: `Failed to dispatch alert: ${err.message}`
      });
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setSendingAlertId(null);
    }
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: 'Early Warnings' }]}
      title="Early Warning & Anomaly Detection Radar"
      subtitle="Automated predictive incident detection and inter-ministerial resolution dispatch."
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-3 duration-200">
          <div className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold border ${
            toastMessage.type === 'success'
              ? 'bg-slate-900 text-white border-emerald-500'
              : 'bg-red-600 text-white border-red-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

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
                <th className="py-3 px-3.5 text-center min-w-[170px]">Direct Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAlerts.map((alert) => {
                const isSending = sendingAlertId === alert.alertId;
                const isSent = sentAlertIds[alert.alertId];

                return (
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
                        {/* Direct Email PM Action Button */}
                        <button
                          disabled={isSending}
                          onClick={() => handleQuickEmailDispatch(alert)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded transition shadow-sm ${
                            isSent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                              : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                          }`}
                          title="Direct Dispatch Critical Brief to hardgamer7000@gmail.com"
                        >
                          {isSending ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                              <span>Sending...</span>
                            </>
                          ) : isSent ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Email Sent</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3 text-red-600" />
                              <span>Email PM</span>
                            </>
                          )}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default Alerts;
