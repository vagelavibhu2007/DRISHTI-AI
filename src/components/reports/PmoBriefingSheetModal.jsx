import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  FileSpreadsheet,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import { generatePmoBriefData, exportPmoBriefToCSV, formatCurrency } from '../../utils/riskUtils';

export const PmoBriefingSheetModal = ({
  project,
  projectsList = [],
  onClose,
  onSelectProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(project?.projectId || projectsList[0]?.projectId);
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  // Find active project
  const currentProject = projectsList.find((p) => String(p.projectId) === String(selectedProjectId)) || project || projectsList[0];
  const brief = generatePmoBriefData(currentProject);

  if (!brief) return null;

  const handleCopyText = () => {
    const textContent = `================================================================================
PRIME MINISTER'S OFFICE (PMO) - EXECUTIVE BRIEFING SHEET
Infrastructure Intelligence Dossier (DRISHTI-AI)
================================================================================
Project: ${brief.projectId} - ${brief.title}
Date: ${brief.date} | Classification: ${brief.classification}
Nodal Ministry: ${brief.ministry}
Executing Agency: ${brief.executingAgency}
Location: ${brief.location}

FISCAL & PROGRESS SNAPSHOT:
• Sanctioned Cost: ₹ ${brief.originalCost.toLocaleString()} Cr
• Cumulative Expenditure: ₹ ${brief.cumulativeExp.toLocaleString()} Cr (${brief.expPercent.toFixed(1)}%)
• Physical Progress: ${brief.physicalProgress.toFixed(1)}%
• Financial Divergence Gap: +${brief.progressGap}% (Disbursement ahead of ground progress)

AI RISK ASSESSMENT:
• Overall Risk Score: ${brief.overallRisk}/100 [${brief.riskLevel}]
• Predicted Cost Overrun: ${brief.costRisk.toFixed(1)}%
• Predicted Time Overrun: ${brief.timeRisk.toFixed(1)}%

INTRODUCTION / OVERVIEW:
${brief.overview}

PROJECT OBJECTIVES:
${brief.objectives.map((o) => `• ${o}`).join('\n')}

CRITICAL BOTTLENECKS (SHAP XAI):
${brief.bottlenecks.map((b) => `• ${b}`).join('\n')}

PROJECT SCOPE & MILESTONES:
In Scope:
${brief.inScope.map((s) => `  - ${s}`).join('\n')}
Critical Milestones at Risk / Out of Scope:
${brief.outOfScopeOrAtRisk.map((s) => `  - ${s}`).join('\n')}

INTER-MINISTERIAL DIRECTIVES:
${brief.directives.map((d) => `• ${d}`).join('\n')}

Target Review: ${brief.targetAudience}
================================================================================`;

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportPmoBriefToCSV(currentProject, `PMO_Briefing_Sheet_${brief.projectId}.csv`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Top Action Header (Hidden during actual print) */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
              PMO
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                PMO Executive Briefing Sheet
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase font-mono font-bold">
                  Inter-Ministerial Format
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Official standard dossier format for Cabinet Secretariat & PRAGATI Reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Project Switcher */}
            {projectsList.length > 1 && (
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    if (onSelectProject) onSelectProject(e.target.value);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg pl-2.5 pr-7 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer appearance-none max-w-[200px] sm:max-w-[280px] truncate"
                >
                  {projectsList.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      #{p.projectId} - {p.projectName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            )}

            {/* Copy Markdown Text */}
            <button
              onClick={handleCopyText}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition flex items-center gap-1 text-xs"
              title="Copy text summary for briefing notes"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Export Raw CSV */}
            <button
              onClick={handleExportCSV}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg border border-slate-700 transition flex items-center gap-1 text-xs"
              title="Export Raw CSV Feed for Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline text-slate-200">CSV Feed</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Export Printable PDF Dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF / Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100 flex-1 print:p-0 print:bg-white print:overflow-visible">
          
          {/* Official PMO Brief Table Document */}
          <div
            id="pmo-brief-printable-area"
            ref={printRef}
            className="pmo-print-sheet bg-white max-w-4xl mx-auto shadow-md border-2 border-black print:border-2 print:border-black print:shadow-none print:max-w-none print:w-full font-sans text-black"
          >
            
            {/* 1. TOP HEADER BANNER (Deep Orange/Saffron matching reference image) */}
            <div className="bg-[#E65100] text-white py-2.5 px-4 text-center border-b-2 border-black flex flex-col items-center justify-center">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase font-sans">
                Project Brief
              </h1>
              <div className="text-[10px] sm:text-xs font-semibold tracking-wider opacity-95 text-amber-100 uppercase mt-0.5">
                Prime Minister’s Office (PMO) • Infrastructure Project Intelligence Dossier
              </div>
            </div>

            {/* 2. MAIN TABLE STRUCTURE (Exact two-tone matching reference image) */}
            <div className="w-full text-xs sm:text-sm">

              {/* Row 1: Title & Date */}
              <div className="grid grid-cols-12 border-b-2 border-black">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black flex items-center">
                  Title
                </div>
                <div className="col-span-12 sm:col-span-5 bg-[#EFF6FF] p-2.5 font-bold text-slate-900 sm:border-r-2 border-black flex items-center">
                  #{brief.projectId} - {brief.title}
                </div>
                <div className="col-span-4 sm:col-span-1 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-r-2 border-black flex items-center justify-center">
                  Date
                </div>
                <div className="col-span-8 sm:col-span-3 bg-[#EFF6FF] p-2.5 text-slate-900 font-semibold flex items-center">
                  {brief.date}
                </div>
              </div>

              {/* Row 2: Client / Organization Details */}
              <div className="grid grid-cols-12 border-b-2 border-black">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black">
                  Client/Organization Details
                </div>
                <div className="col-span-12 sm:col-span-9 bg-[#EFF6FF] p-2.5 text-slate-900 font-medium space-y-1">
                  <div className="font-bold text-slate-900">
                    {brief.ministry}
                  </div>
                  <div className="text-xs text-slate-700">
                    <strong>Implementing Authority:</strong> {brief.executingAgency} &nbsp;|&nbsp; <strong>Jurisdiction:</strong> {brief.location}
                  </div>
                </div>
              </div>

              {/* Row 3: Fiscal & AI Risk Snapshot */}
              <div className="grid grid-cols-12 border-b-2 border-black">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black">
                  Fiscal & AI Risk Metrics
                </div>
                <div className="col-span-12 sm:col-span-9 bg-[#EFF6FF] p-2.5 text-slate-900">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Sanctioned Outlay</span>
                      <strong className="text-slate-900 font-mono text-xs sm:text-sm">{formatCurrency(brief.originalCost)}</strong>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Cumulative Spend</span>
                      <strong className="text-slate-900 font-mono text-xs sm:text-sm">{formatCurrency(brief.cumulativeExp)} ({brief.expPercent.toFixed(1)}%)</strong>
                    </div>
                    <div className="p-1.5 bg-white border border-slate-300 rounded">
                      <span className="text-[10px] text-slate-500 font-bold block uppercase">Physical Progress</span>
                      <strong className="text-emerald-700 font-mono text-xs sm:text-sm">{brief.physicalProgress.toFixed(1)}%</strong>
                    </div>
                    <div className={`p-1.5 border rounded ${brief.overallRisk >= 70 ? 'bg-red-50 border-red-300 text-red-700' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
                      <span className="text-[10px] font-bold block uppercase">Overall AI Risk</span>
                      <strong className="font-mono text-xs sm:text-sm">{brief.overallRisk}/100 [{brief.riskLevel}]</strong>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span><strong>Cost Overrun Probability:</strong> {brief.costRisk.toFixed(1)}%</span>
                    <span><strong>Time Overrun Probability:</strong> {brief.timeRisk.toFixed(1)}%</span>
                    <span><strong>Financial Divergence Gap:</strong> <span className={brief.progressGap > 10 ? 'text-red-700 font-bold' : 'text-slate-700'}>+{brief.progressGap}%</span></span>
                  </div>
                </div>
              </div>

              {/* Row 4: Introduction / Overview */}
              <div className="grid grid-cols-12 border-b-2 border-black">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black">
                  Introduction/Overview
                </div>
                <div className="col-span-12 sm:col-span-9 bg-[#EFF6FF] p-2.5 text-slate-900 leading-relaxed">
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm">
                    <li>{brief.overview}</li>
                    <li>Integrated into the PM-GatiShakti National Master Plan portal for multimodal logistical optimization and central milestone oversight.</li>
                  </ul>
                </div>
              </div>

              {/* Row 5: Project Objectives */}
              <div className="grid grid-cols-12 border-b-2 border-black">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black">
                  Project Objectives
                </div>
                <div className="col-span-12 sm:col-span-9 bg-[#EFF6FF] p-2.5 text-slate-900 leading-relaxed">
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm">
                    {brief.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Row 6: Critical Bottlenecks & SHAP XAI Analysis */}
              <div className="grid grid-cols-12 border-b-2 border-black">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black">
                  Critical Bottlenecks & Root Causes (SHAP AI)
                </div>
                <div className="col-span-12 sm:col-span-9 bg-[#EFF6FF] p-2.5 text-slate-900 leading-relaxed">
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm">
                    {brief.bottlenecks.map((bot, i) => (
                      <li key={i} className="text-slate-900">
                        {bot}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Row 7: Project Scope */}
              <div className="grid grid-cols-12 border-b-2 border-black">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black">
                  Project Scope
                </div>
                <div className="col-span-12 sm:col-span-9 bg-[#EFF6FF] p-2.5 text-slate-900 space-y-2">
                  <div>
                    <strong className="block text-slate-900 text-xs font-bold uppercase tracking-wider mb-1">
                      In Scope:
                    </strong>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs sm:text-sm">
                      {brief.inScope.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <strong className="block text-red-800 text-xs font-bold uppercase tracking-wider mb-1">
                      Critical Milestones At Risk / Out of Scope:
                    </strong>
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs sm:text-sm">
                      {brief.outOfScopeOrAtRisk.map((item, i) => (
                        <li key={i} className="text-red-950 font-medium">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Row 8: Inter-Ministerial Directives & Action Plan */}
              <div className="grid grid-cols-12 border-b-2 border-black">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black">
                  Inter-Ministerial Directives
                </div>
                <div className="col-span-12 sm:col-span-9 bg-[#EFF6FF] p-2.5 text-slate-900 leading-relaxed">
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm">
                    {brief.directives.map((dir, i) => (
                      <li key={i}>{dir}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Row 9: Target Audience */}
              <div className="grid grid-cols-12">
                <div className="col-span-12 sm:col-span-3 bg-[#FED7AA] p-2.5 font-bold text-slate-900 border-b sm:border-b-0 sm:border-r-2 border-black">
                  Target Audience
                </div>
                <div className="col-span-12 sm:col-span-9 bg-[#EFF6FF] p-2.5 text-slate-900">
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs sm:text-sm">
                    <li>{brief.targetAudience}</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Official Footer Classification */}
            <div className="bg-slate-900 text-slate-200 px-4 py-2 border-t-2 border-black flex flex-wrap items-center justify-between text-[10px] font-mono">
              <span>{brief.classification}</span>
              <span>DRISHTI-AI INFRASTRUCTURE INTELLIGENCE SYSTEM</span>
              <span>VERIFIED: {brief.date}</span>
            </div>

          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 font-medium">
            Standard PMO 2-tone brief format ready for A4 PDF export or direct print review.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              Close
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-[#E65100] hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export PDF Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PmoBriefingSheetModal;
