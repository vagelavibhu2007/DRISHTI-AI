import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  Gauge,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  Cpu,
  Info,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { api } from '../services/api';
import PageContainer from '../components/layout/PageContainer';
import { RiskBadge } from '../components/common/RiskBadge';
import { RiskGauge } from '../components/common/RiskGauge';
import StatusBadge from '../components/common/StatusBadge';
import ShapContributionBars from '../components/projects/ShapContributionBars';
import { formatCurrency, formatPercent } from '../utils/riskUtils';
import AlertCard from '../components/alerts/AlertCard';
import PmoBriefingSheetModal from '../components/reports/PmoBriefingSheetModal';

export const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, alerts, updateAlertStatus } = useDashboard();

  // Initialize state
  const [projectData, setProjectData] = useState(() => {
    return projects.find((p) => String(p.projectId) === String(id)) || null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isForbidden, setIsForbidden] = useState(false);
  const [pmoModalOpen, setPmoModalOpen] = useState(false);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    let isMounted = true;
    const fetchDetail = async () => {
      setIsLoading(true);
      setLoadError(null);
      setIsForbidden(false);

      try {
        const res = await api.getProjectById(id);
        if (isMounted) {
          if (res.success && res.data) {
            setProjectData(res.data);
            setLoadError(null);
            setIsForbidden(false);
          } else {
            setProjectData(null);
            if (res.status === 403) {
              setIsForbidden(true);
              setLoadError(res.error || 'Access Forbidden: You are not authorized to view projects outside your assigned jurisdiction.');
            } else {
              setLoadError(res.error || `Project #${id} not found.`);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setProjectData(null);
          setLoadError(err.message || 'Unable to load project details.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading && !projectData && !loadError) {
    return (
      <PageContainer title="Loading Project Intelligence...">
        <div className="p-12 text-center text-slate-500 font-medium">
          <Cpu className="w-8 h-8 animate-spin mx-auto text-gov-700 mb-2" />
          <p>Loading project details...</p>
        </div>
      </PageContainer>
    );
  }

  if (loadError || !projectData) {
    return (
      <PageContainer title={isForbidden ? "Access Restricted" : "Project Not Found"}>
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto mt-6">
          <AlertTriangle className={`w-10 h-10 mx-auto ${isForbidden ? 'text-red-500' : 'text-amber-500'}`} />
          <h3 className="text-base font-bold text-slate-900">
            {isForbidden ? "Unauthorized Project Access" : (loadError || "Project Not Found")}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isForbidden
              ? `You do not have administrative authority to access Project #${id}. State Authorities may only access projects within their assigned state jurisdiction.`
              : `The requested project ID #${id} could not be retrieved or does not exist.`}
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-gov-700 text-white rounded-lg text-xs font-bold hover:bg-gov-800 transition"
          >
            Back to Projects Directory
          </button>
        </div>
      </PageContainer>
    );
  }

  const project = projectData;
  const relatedAlerts = alerts.filter(
    (a) => String(a.projectId) === String(project.projectId) || a.projectName.toLowerCase().includes(project.projectName.toLowerCase().slice(0, 10))
  );

  return (
    <PageContainer
      breadcrumbs={[
        { label: 'Projects Directory', to: '/projects' },
        { label: `Project #${project.projectId}` }
      ]}
      title={project.projectName}
      subtitle={`Project ID: #${project.projectId} • ${project.ministry} • ${project.sector} • ${project.state} (${project.district || 'Zone'})`}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPmoModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg shadow-sm transition"
            title="Generate PMO Executive Briefing Sheet"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>PMO Briefing Sheet</span>
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Back to Projects</span>
          </button>
        </div>
      }
    >
      {/* SECTION 1: AI-ASSISTED RISK ASSESSMENT HERO (Gauge + 3 Cards) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-card space-y-6 animate-fade-in-up">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gov-700" />
              AI-Assisted Risk Assessment
            </span>
            <span className="text-xs text-slate-400">•</span>
            <StatusBadge status={project.status} />
          </div>
          <RiskBadge level={project.riskLevel} score={project.overallRisk} size="md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Circular Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <RiskGauge score={project.overallRisk} size={180} strokeWidth={15} />
            <div className="text-center mt-3">
              <span className="text-xs font-bold text-slate-700 block">Overall Risk Score</span>
              <span className="text-[11px] text-slate-500">Hazard Index (0 - 100 Scale)</span>
            </div>
          </div>

          {/* Three Risk Probability Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Cost Overrun Risk */}
            <div className="p-5 rounded-xl border border-red-200 bg-red-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                  <span>Cost Overrun Risk</span>
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-red-600">
                  {formatPercent(project.costRisk)}
                </div>
                <span className="text-[11px] text-red-800 font-medium block mt-1">
                  Predicted Probability
                </span>
                <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                  Classification: {project.predictedCostOverrun || project.costRisk >= 40 ? 'Overrun Likely (≥40%)' : 'Contained'}
                </span>
              </div>
              <div className="w-full bg-red-200/60 h-2 rounded-full overflow-hidden mt-4">
                <div className="bg-red-600 h-full rounded-full" style={{ width: `${project.costRisk}%` }} />
              </div>
            </div>

            {/* Card 2: Time Overrun Risk */}
            <div className="p-5 rounded-xl border border-orange-200 bg-orange-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">
                  <span>Time Overrun Risk</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-orange-600">
                  {formatPercent(project.timeRisk)}
                </div>
                <span className="text-[11px] text-orange-800 font-medium block mt-1">
                  Predicted Probability
                </span>
                <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                  Estimated Delay: {project.predictedDelayDays ? `+${project.predictedDelayDays} days` : 'On schedule'}
                </span>
              </div>
              <div className="w-full bg-orange-200/60 h-2 rounded-full overflow-hidden mt-4">
                <div className="bg-orange-600 h-full rounded-full" style={{ width: `${project.timeRisk}%` }} />
              </div>
            </div>

            {/* Card 3: Physical vs Expenditure Divergence */}
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                  <span>Progress Gap</span>
                  <Gauge className="w-4 h-4 text-amber-700" />
                </div>
                <div className="font-mono text-3xl font-extrabold text-amber-700">
                  {formatPercent(Math.abs((project.expenditurePercentage || 0) - (project.physicalProgress || 0)))}
                </div>
                <span className="text-[11px] text-amber-800 font-medium block mt-1">
                  Spend vs Physical Delta
                </span>
                <span className="text-[10px] text-slate-500 block font-mono mt-0.5">
                  Expenditure: {formatPercent(project.expenditurePercentage)} | Physical: {formatPercent(project.physicalProgress)}
                </span>
              </div>
              <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden mt-4">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, (project.expenditurePercentage || 0) - (project.physicalProgress || 0)))}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Regression & Cost Forecast Block */}
        {project.predictedCostOverrunCr && (
          <div className="p-4 bg-slate-900 text-white rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Predicted Cost Overrun (ML Regressor)
              </span>
              <span className="font-mono text-xl font-bold text-red-400 mt-0.5 block">
                {formatCurrency(project.predictedCostOverrunCr)}
              </span>
              <span className="text-[10px] text-slate-400">log1p inverted with expm1()</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Estimated Revised Project Cost
              </span>
              <span className="font-mono text-xl font-bold text-white mt-0.5 block">
                {formatCurrency(project.estimatedRevisedCostCr || (project.originalCost + project.predictedCostOverrunCr))}
              </span>
              <span className="text-[10px] text-slate-400">Original + Overrun</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Predicted Schedule Slippage
              </span>
              <span className="font-mono text-xl font-bold text-orange-400 mt-0.5 block">
                {project.predictedDelayDays ? `+${project.predictedDelayDays} Days` : '+18 Months'}
              </span>
              <span className="text-[10px] text-slate-400">Estimated delay</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: PROJECT PERFORMANCE */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-card space-y-6 animate-fade-in-up delay-75">
        <div>
          <h3 className="text-base font-bold text-slate-900">Project Performance & Milestones</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Financial allocation vs actual ground physical milestone achievement
          </p>
        </div>

        {/* 6 Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Original Cost</span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
              {formatCurrency(project.originalCost)}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Cumulative Expenditure</span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
              {formatCurrency(project.cumulativeExpenditure)}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Physical Progress</span>
            <span className="text-lg font-bold font-mono text-gov-700 mt-1 block">
              {formatPercent(project.physicalProgress)}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Expenditure %</span>
            <span
              className={`text-lg font-bold font-mono mt-1 block ${
                project.expenditurePercentage > project.physicalProgress + 20
                  ? 'text-red-600'
                  : 'text-slate-900'
              }`}
            >
              {formatPercent(project.expenditurePercentage)}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Expected Completion</span>
            <span className="text-sm font-bold font-mono text-slate-800 mt-1 block truncate">
              {project.expectedCompletion}
            </span>
            <span className="text-[10px] text-red-600 font-semibold">
              +{project.delayMonths || 18} mos delay
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Project Status</span>
            <div className="mt-1">
              <StatusBadge status={project.status} />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1 truncate">
              {project.contractor}
            </span>
          </div>
        </div>

        {/* Progress Comparison Bars */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Physical Progress (Field Verified)</span>
              <span className="font-mono text-gov-800">{formatPercent(project.physicalProgress)}</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gov-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${project.physicalProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Financial Expenditure (Fund Drawdowns)</span>
              <span className="font-mono text-slate-900">{formatPercent(project.expenditurePercentage)}</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  project.expenditurePercentage > project.physicalProgress + 20
                    ? 'bg-red-500'
                    : 'bg-gov-500'
                }`}
                style={{ width: `${Math.min(100, project.expenditurePercentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: "WHY IS THIS PROJECT RISKY?" (SHAP Explainable AI) */}
      <div className="animate-fade-in-up delay-150">
        <ShapContributionBars
          factors={project.shapFactors}
          projectName={project.projectName}
        />
      </div>

      {/* SECTION 4: ASSOCIATED EARLY WARNING ALERTS */}
      {relatedAlerts.length > 0 && (
        <div className="space-y-3 animate-fade-in-up delay-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Active Early Warnings for this Project ({relatedAlerts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedAlerts.map((alert) => (
              <AlertCard
                key={alert.alertId}
                alert={alert}
                onStatusChange={updateAlertStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Official Disclaimer */}
      <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
        <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span>
          <strong>AI Disclaimer:</strong> AI predictions are model-based estimates intended to support proactive project monitoring and decision-making.
        </span>
      </div>

      {/* PMO Executive Briefing Sheet Modal */}
      {pmoModalOpen && (
        <PmoBriefingSheetModal
          project={project}
          projectsList={projects}
          onClose={() => setPmoModalOpen(false)}
        />
      )}
    </PageContainer>
  );
};

export default ProjectDetails;
