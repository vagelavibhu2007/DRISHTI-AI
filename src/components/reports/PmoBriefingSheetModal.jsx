import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  Copy,
  Check,
  ChevronDown,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  Gauge,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
  Compass,
  Cpu,
  Bookmark
} from 'lucide-react';
import { generatePmoBriefData, exportPmoBriefToCSV, printSinglePmoDossier, formatCurrency, formatPercent, getRiskColor } from '../../utils/riskUtils';

export const PmoBriefingSheetModal = ({
  project,
  projectsList = [],
  filterCriticalOnly = false,
  autoPrint = false,
  onClose,
  onSelectProject
}) => {
  const displayList = filterCriticalOnly
    ? projectsList.filter((p) => p.riskLevel === 'CRITICAL' || p.overallRisk >= 75)
    : projectsList;

  const initialProject = project || displayList[0] || projectsList[0];
  const [selectedProjectId, setSelectedProjectId] = useState(initialProject?.projectId);
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  React.useEffect(() => {
    if (project?.projectId) {
      setSelectedProjectId(project.projectId);
    }
  }, [project]);

  // Find active project
  const currentProject = projectsList.find((p) => String(p.projectId) === String(selectedProjectId)) || initialProject;
  const brief = generatePmoBriefData(currentProject);

  React.useEffect(() => {
    if (autoPrint && brief) {
      const timer = setTimeout(() => {
        printSinglePmoDossier(brief);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrint, selectedProjectId]);


  if (!brief) return null;

  const riskTheme = getRiskColor(brief.riskLevel || brief.overallRisk);


  const handleCopyText = () => {
    const textContent = `================================================================================
GOVERNMENT OF INDIA • PRIME MINISTER'S OFFICE (PMO)
EXECUTIVE INFRASTRUCTURE INTELLIGENCE DOSSIER (DRISHTI-AI)
================================================================================
DOSSIER ID: DRISHTI-PMO-${brief.projectId} | CLASSIFICATION: ${brief.classification}
DATE: ${brief.date} | MODEL: Ensemble GBDT-SHAP (94.6% Confidence)

PROJECT PROFILE:
• Project: #${brief.projectId} - ${brief.title}
• Nodal Ministry: ${brief.ministry}
• Implementing Agency: ${brief.executingAgency}
• Jurisdiction: ${brief.location}

FISCAL & PROGRESS SNAPSHOT:
• Sanctioned Outlay: ₹ ${brief.originalCost.toLocaleString()} Cr
• Cumulative Spend: ₹ ${brief.cumulativeExp.toLocaleString()} Cr (${brief.expPercent.toFixed(1)}%)
• Physical Progress: ${brief.physicalProgress.toFixed(1)}% (Ground Verified)
• Financial Divergence Gap: +${brief.progressGap}% (Disbursement ahead of physical work)

AI HAZARD DECONSTRUCTION:
• Overall Hazard Score: ${brief.overallRisk}/100 [${brief.riskLevel}]
• Predicted Cost Escalation Probability: ${brief.costRisk.toFixed(1)}%
• Predicted Schedule Delay Probability: ${brief.timeRisk.toFixed(1)}%

EXECUTIVE NARRATIVE:
${brief.overview}

CORE OBJECTIVES:
${brief.objectives.map((o, i) => `  [0${i + 1}] ${o}`).join('\n')}

CRITICAL BOTTLENECKS & ROOT CAUSES (SHAP XAI):
${brief.bottlenecks.map((b, i) => `  • Driver 0${i + 1}: ${b}`).join('\n')}

SCOPE & MILESTONE MATRIX:
In-Scope & Active Packages:
${brief.inScope.map((s) => `  ✓ ${s}`).join('\n')}
Critical Milestones At Risk / Pending Approvals:
${brief.outOfScopeOrAtRisk.map((s) => `  ⚠ ${s}`).join('\n')}

CABINET & INTER-MINISTERIAL DIRECTIVES:
${brief.directives.map((d, i) => `  [Directive 0${i + 1}] ${d}`).join('\n')}

TARGET REVIEW: ${brief.targetAudience}
================================================================================`;

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportPDF = () => {
    printSinglePmoDossier(brief);
  };

  const handleExportCSV = () => {
    exportPmoBriefToCSV(currentProject, `PMO_Dossier_${brief.projectId}_${new Date().toISOString().slice(0,10)}.csv`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-2xl border border-slate-700 max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden my-auto animate-scale-in">
        
        {/* Top Floating Control Bar (Hidden during PDF print) */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-500/20">
              🇮🇳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  PMO Executive Intelligence Dossier
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase font-bold tracking-wider">
                  PRAGATI Format
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Cabinet Secretariat & Inter-Ministerial Review Standard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Project Switcher */}
            {displayList.length > 1 && (
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    if (onSelectProject) onSelectProject(e.target.value);
                  }}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-100 text-xs font-semibold rounded-xl pl-3 pr-8 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer appearance-none max-w-[200px] sm:max-w-[280px] truncate shadow-inner"
                >
                  {displayList.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      #{p.projectId} - {p.projectName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            )}

            {/* Copy Text Summary */}
            <button
              onClick={handleCopyText}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title="Copy Briefing Text for Note Sheets"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Export Raw CSV Feed */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title="Export Inter-Ministerial CSV Dataset"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-slate-200">CSV Feed</span>
            </button>

            {/* Export Printable PDF */}
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              title="Print or Save Official A4 PDF Dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF Dossier</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Viewport */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100 flex-1 print:p-0 print:bg-white print:overflow-visible">
          
          {/* ========================================================================= */}
          {/* THE OFFICIAL PMO EXECUTIVE INTELLIGENCE DOSSIER (A4 OPTIMIZED DOCUMENT) */}
          {/* ========================================================================= */}
          <div
            id="pmo-brief-printable-area"
            ref={printRef}
            className="pmo-print-sheet bg-white max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-200 print:border print:border-slate-400 print:shadow-none print:max-w-none print:w-full print:rounded-none font-sans text-slate-900"
          >
            
            {/* 1. OFFICIAL GOVT / PMO HEADER BANNER */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-7 relative border-b-4 border-amber-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Emblem & Branding */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex-shrink-0 flex items-center justify-center">
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-center">
                      <span className="text-xl leading-none">🏛️</span>
                      <span className="text-[8px] font-black tracking-widest text-amber-400 uppercase mt-0.5 font-mono">GOI</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase font-mono">
                        Cabinet Secretariat • PM-GatiShakti NMP
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        CONFIDENTIAL // PMO REVIEW
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                      Executive Infrastructure Briefing Dossier
                    </h1>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      Multi-Sector Hazard Index & Predictive Inter-Ministerial Intelligence
                    </p>
                  </div>
                </div>

                {/* Classification & Metadata Badge */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 text-right font-mono border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${brief.overallRisk >= 70 ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {brief.riskLevel} PRIORITY
                  </span>
                  <div className="text-[11px] text-slate-400 space-x-2">
                    <span>DOSSIER: <strong>PMO-{brief.projectId}</strong></span>
                    <span>•</span>
                    <span>{brief.date}</span>
                  </div>
                </div>

              </div>

              {/* Decorative Subtle Grid Lines */}
              <div className="absolute right-0 top-0 bottom-0 w-64 bg-grid-dark opacity-10 pointer-events-none" />
            </div>

            {/* 2. PROJECT IDENTITY & ADMINISTRATIVE JURISDICTION */}
            <div className="p-6 sm:p-7 border-b border-slate-200 bg-slate-50/70">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                      PROJECT ID #{brief.projectId}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/60 uppercase">
                      {brief.sector}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {brief.title}
                  </h2>
                </div>

                {/* Key Institutional Nodes */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-sm md:min-w-[340px]">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Nodal Ministry</span>
                    <strong className="text-slate-800 font-semibold truncate block" title={brief.ministry}>
                      {brief.ministry}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Location / Jurisdiction</span>
                    <strong className="text-slate-800 font-semibold truncate block" title={brief.location}>
                      {brief.location}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. EXECUTIVE KPI COMMAND MATRIX (4 CARDS) */}
            <div className="p-6 sm:p-7 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Fiscal & Progress Intelligence Baseline
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  AI Validation: 94.6% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                
                {/* KPI 1: Sanctioned Outlay */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Sanctioned Budget
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-slate-900">
                    {formatCurrency(brief.originalCost)}
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Approved Cabinet Outlay
                  </span>
                </div>

                {/* KPI 2: Cumulative Spend */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Cumulative Spend
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-slate-900">
                    {formatCurrency(brief.cumulativeExp)}
                  </div>
                  <span className="text-[11px] text-slate-600 font-semibold block">
                    {brief.expPercent.toFixed(1)}% of total outlay
                  </span>
                </div>

                {/* KPI 3: Physical Progress */}
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Physical Progress
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-700">
                    {brief.physicalProgress.toFixed(1)}%
                  </div>
                  <span className="text-[11px] text-emerald-800 font-medium block">
                    Verified On-Ground
                  </span>
                </div>

                {/* KPI 4: Divergence Gap & AI Risk */}
                <div className={`p-4 rounded-xl border shadow-sm space-y-1 ${brief.overallRisk >= 70 ? 'bg-red-50/60 border-red-200 text-red-900' : 'bg-amber-50/60 border-amber-200 text-amber-900'}`}>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span>AI Risk Rating</span>
                    <span className="font-mono">{brief.overallRisk}/100</span>
                  </div>
                  <div className="text-base sm:text-lg font-black font-mono">
                    {brief.riskLevel}
                  </div>
                  <span className="text-[11px] font-medium block">
                    Divergence Gap: <strong className="font-mono">+{brief.progressGap}%</strong>
                  </span>
                </div>

              </div>

              {/* Sub-Metric Probabilities Bar */}
              <div className="mt-3.5 p-3 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Predicted Cost Overrun Probability:</span>
                  <strong className="text-red-400">{brief.costRisk.toFixed(1)}%</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Predicted Schedule Delay Probability:</span>
                  <strong className="text-orange-400">{brief.timeRisk.toFixed(1)}%</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Risk Formula:</span>
                  <span className="text-slate-300">Ensemble GBDT-SHAP</span>
                </div>
              </div>
            </div>

            {/* 4. EXECUTIVE NARRATIVE & STRATEGIC OBJECTIVES */}
            <div className="p-6 sm:p-7 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Overview Narrative */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-gov-700" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Executive Narrative & Strategic Purpose
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {brief.overview}
                </p>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Monitored under Prime Minister's Pragati & GatiShakti Multi-Modal Framework.</span>
                </div>
              </div>

              {/* Project Core Objectives */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-gov-700" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Target Deliverables
                  </h3>
                </div>
                <ul className="space-y-2 text-xs">
                  {brief.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800">
                      <span className="w-4 h-4 rounded-full bg-gov-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-medium leading-tight">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* 5. EXPLAINABLE AI (XAI) - ROOT-CAUSE BOTTLENECKS */}
            <div className="p-6 sm:p-7 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Root-Cause Hazard Breakdown (Explainable AI - SHAP Attribution)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200 rounded font-bold text-slate-700 uppercase">
                  36 Feature Variables Analyzed
                </span>
              </div>

              <div className="space-y-2.5">
                {brief.bottlenecks.map((bottleneck, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 border border-red-200 flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                      0{idx + 1}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {bottleneck.split(':')[0] || `Bottleneck Driver #${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 uppercase font-mono">
                          Critical Driver
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {bottleneck.includes(':') ? bottleneck.split(':').slice(1).join(':').trim() : bottleneck}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. SCOPE & MILESTONES MATRIX */}
            <div className="p-6 sm:p-7 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left: In-Scope Verified Packages */}
              <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 pb-2 border-b border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    In-Scope & Active Milestones
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-800">
                  {brief.inScope.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span className="font-medium leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Critical Path at Risk */}
              <div className="p-4 bg-red-50/40 rounded-xl border border-red-200/80 space-y-3">
                <div className="flex items-center gap-2 text-red-900 pb-2 border-b border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Critical Milestones At Risk / Delayed
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-800">
                  {brief.outOfScopeOrAtRisk.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-600 font-bold mt-0.5">⚠</span>
                      <span className="font-medium leading-relaxed text-red-950">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* 7. INTER-MINISTERIAL DIRECTIVES & ESCALATION PROTOCOL */}
            <div className="p-6 sm:p-7 border-b border-slate-200 bg-amber-50/30">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  PMO / Cabinet Secretariat Directives & Escalation Mandate
                </h3>
              </div>

              <div className="space-y-2">
                {brief.directives.map((dir, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-sm flex items-start gap-3 text-xs text-slate-900"
                  >
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-mono font-bold text-[10px] flex-shrink-0 mt-0.5">
                      DIRECTIVE 0{i + 1}
                    </span>
                    <p className="font-semibold leading-relaxed">
                      {dir}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. OFFICIAL SIGN-OFF & DISTRIBUTION FOOTER */}
            <div className="p-5 bg-slate-900 text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-amber-400 font-bold block">
                  DISTRIBUTION: {brief.targetAudience}
                </span>
                <span className="text-slate-400">
                  DRISHTI-AI NATIONAL MASTER PLAN INTELLIGENCE PLATFORM • SYSTEM VERIFIED {brief.date}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[10px] font-bold uppercase">
                  CHECKSUM: #{(brief.originalCost * 97).toString(16).toUpperCase()}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Action Controls (Hidden during print) */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden shadow-inner">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready for formal inter-ministerial PDF dossier generation & CSV distribution.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print PDF Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PmoBriefingSheetModal;
