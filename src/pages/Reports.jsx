import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { REPORTS_LIST } from '../data/mockData';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import { exportProjectsToCSV } from '../utils/riskUtils';

export const Reports = () => {
  const { projects, stats } = useDashboard();
  const { isStateAuthority, assignedState } = useAuth();
  const [toastMessage, setToastMessage] = useState(null);
  const [previewReport, setPreviewReport] = useState(null);

  const handleExportCSV = (rep) => {
    const filename = `${rep.id.toLowerCase()}_${isStateAuthority && assignedState ? assignedState.toLowerCase().replace(/\s+/g, '_') : 'national'}_data.csv`;
    exportProjectsToCSV(projects, filename);
    setToastMessage(`Exported ${projects.length} authorized records to ${filename}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadPDF = (rep) => {
    // Generate official printable PDF view
    window.print();
    setToastMessage(`Generated printable dossier for "${rep.title}" (${projects.length} authorized records).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: 'Intelligence Reports' }]}
      title="Intelligence Reports & Executive Briefs"
      subtitle="Export formal PDF dossiers, PMO briefing sheets, and raw CSV feeds for inter-ministerial review."
    >
      {/* Toast Notification for demo actions */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-3 duration-200 max-w-md">
          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <AlertCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
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

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORTS_LIST.map((rep) => (
          <div
            key={rep.id}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {rep.id}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gov-100 text-gov-800 uppercase">
                  {rep.category}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Date: {rep.generatedDate}</span>
                <span>Size: {rep.fileSize} ({rep.format})</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewReport(rep)}
                  className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition inline-flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Report</span>
                </button>

                <button
                  onClick={() => handleExportCSV(rep)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition"
                  title="Export Authorized CSV Data"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                </button>

                <button
                  onClick={() => handleDownloadPDF(rep)}
                  className="p-2 bg-gov-700 hover:bg-gov-800 text-white rounded-lg transition shadow-sm"
                  title="Generate Official PDF Dossier"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold truncate max-w-md">{previewReport.title}</h3>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Report Metadata
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>ID:</strong> {previewReport.id}</div>
                  <div><strong>Date:</strong> {previewReport.generatedDate}</div>
                  <div><strong>Coverage:</strong> {projects.length} Authorized Projects ({isStateAuthority && assignedState ? assignedState : 'National'})</div>
                  <div><strong>Confidence:</strong> 94.6% GBDT-SHAP</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Executive Summary Excerpt:</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {previewReport.description} Predictive hazard indices indicate an aggregate fiscal exposure of ₹{(stats.atRiskCapitalValueCr || 0).toLocaleString()} Cr across {stats.criticalProjects || 0} critical infrastructure assets in {isStateAuthority && assignedState ? `${assignedState} jurisdiction` : 'National portfolio'}.
                </p>
              </div>

              <div className="p-3 bg-gov-50 text-gov-800 rounded-lg text-xs font-semibold">
                Official Government of India Intelligence Dossier — PM-GatiShakti Decision Support.
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const rep = previewReport;
                  setPreviewReport(null);
                  handleDownloadPDF(rep);
                }}
                className="px-4 py-2 bg-gov-700 hover:bg-gov-800 text-white text-xs font-bold rounded-lg transition"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Reports;

