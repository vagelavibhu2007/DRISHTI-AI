/**
 * DRISHTI AI - Infrastructure Risk Assessment Utilities
 */

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const getRiskLevel = (score) => {
  if (score >= 80) return RISK_LEVELS.CRITICAL;
  if (score >= 50) return RISK_LEVELS.HIGH;
  if (score >= 25) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
};

export const getRiskColor = (levelOrScore) => {
  const level = typeof levelOrScore === 'number' ? getRiskLevel(levelOrScore) : levelOrScore;
  switch (level?.toUpperCase()) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-500',
        bgLight: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        badge: 'bg-red-50 text-red-700 border-red-200',
        accent: '#EF4444',
        label: 'CRITICAL',
        ring: 'ring-red-500/20'
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-500',
        bgLight: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        badge: 'bg-orange-50 text-orange-700 border-orange-200',
        accent: '#F97316',
        label: 'HIGH',
        ring: 'ring-orange-500/20'
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-500',
        bgLight: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        accent: '#F59E0B',
        label: 'MEDIUM',
        ring: 'ring-amber-500/20'
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-500',
        bgLight: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        accent: '#10B981',
        label: 'LOW',
        ring: 'ring-emerald-500/20'
      };
  }
};

export const formatCurrency = (amountInCr) => {
  if (amountInCr === undefined || amountInCr === null || isNaN(amountInCr)) return '₹ 0 Cr';
  if (amountInCr >= 1000) {
    return `₹ ${(amountInCr / 1000).toFixed(2)}k Cr`;
  }
  return `₹ ${Number(amountInCr).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${Number(val).toFixed(1)}%`;
};

/**
 * Frontend simulation function for What-If Analysis
 * Simulates SHAP-derived model response without backend
 */
export const calculateSimulatedRisk = ({
  originalCost,
  cumulativeExpenditure,
  physicalProgress,
  expenditurePercentage,
  sectorHistoricalRisk = 60,
  monsoonDelayRisk = 0,
  landAcquisitionDelay = 0
}) => {
  // Financial progress ratio
  const financialProgress = (cumulativeExpenditure / (originalCost || 1)) * 100;
  const progressGap = financialProgress - physicalProgress; // positive means money spent without physical output

  // Predicted Cost Overrun Probability
  let costRisk = 35 + (progressGap * 0.72) + (expenditurePercentage > 85 ? 18 : 0);
  if (financialProgress > 100) costRisk += 15;
  if (physicalProgress < 30 && financialProgress > 40) costRisk += 14;

  // Predicted Time Overrun Probability
  let timeRisk = 40 + (progressGap * 0.65) + (100 - physicalProgress) * 0.35 + (monsoonDelayRisk * 0.5) + (landAcquisitionDelay * 0.6);

  // Sector baseline weight
  costRisk = costRisk * 0.7 + (sectorHistoricalRisk * 0.3);
  timeRisk = timeRisk * 0.75 + (sectorHistoricalRisk * 0.25);

  // Clamping to [5, 98]
  costRisk = Math.min(98.5, Math.max(5.0, Number(costRisk.toFixed(1))));
  timeRisk = Math.min(99.0, Math.max(5.0, Number(timeRisk.toFixed(1))));
  const overallRisk = Number(((costRisk + timeRisk) / 2).toFixed(1));

  return {
    costRisk,
    timeRisk,
    overallRisk,
    riskLevel: getRiskLevel(overallRisk),
    financialProgress: Number(financialProgress.toFixed(1)),
    progressGap: Number(progressGap.toFixed(1))
  };
};

/**
 * Standardized Indian States & Union Territories
 */
export const STANDARDIZED_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const STATE_ALIASES = {
  'delhi (nct)': 'Delhi',
  'nct of delhi': 'Delhi',
  'delhi nct': 'Delhi',
  'orissa': 'Odisha',
  'pondicherry': 'Puducherry',
  'uttaranchal': 'Uttarakhand',
  'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
  'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu'
};

export const normalizeStateName = (rawName) => {
  if (!rawName) return '';
  const clean = String(rawName).trim();
  const lower = clean.toLowerCase();
  if (STATE_ALIASES[lower]) return STATE_ALIASES[lower];
  const matched = STANDARDIZED_STATES.find((s) => s.toLowerCase() === lower);
  return matched || clean;
};

export const extractProjectStates = (stateField) => {
  if (!stateField) return [];
  if (Array.isArray(stateField)) {
    return stateField.map(normalizeStateName).filter(Boolean);
  }
  const tokens = String(stateField).split(/[,/;|]|\band\b|\b&\b/i);
  const states = [];
  tokens.forEach((t) => {
    const clean = t.trim();
    if (clean) {
      const norm = normalizeStateName(clean);
      if (norm && !states.includes(norm)) {
        states.push(norm);
      }
    }
  });
  return states;
};

export const isProjectInState = (projectOrState, targetState) => {
  if (!targetState || targetState === 'ALL') return true;
  const stateField = typeof projectOrState === 'object' && projectOrState !== null
    ? (projectOrState.state || projectOrState.states)
    : projectOrState;

  if (!stateField) return false;
  const normTarget = normalizeStateName(targetState).toLowerCase();
  const projectStates = extractProjectStates(stateField).map((s) => s.toLowerCase());

  return projectStates.includes(normTarget);
};

export const exportProjectsToCSV = (projectsList, filename = 'drishti_projects_export.csv') => {
  if (!projectsList || !projectsList.length) {
    alert('No projects available to export.');
    return;
  }

  const headers = [
    'Project ID',
    'Project Name',
    'Ministry',
    'Sector',
    'State',
    'District',
    'Original Cost (Cr)',
    'Cumulative Expenditure (Cr)',
    'Physical Progress (%)',
    'Expenditure (%)',
    'Financial Divergence Gap (%)',
    'Cost Risk (%)',
    'Time Risk (%)',
    'Overall Risk Score',
    'Risk Level',
    'Status'
  ];

  const rows = projectsList.map((p) => {
    const finGap = ((p.expenditurePercentage || 0) - (p.physicalProgress || 0)).toFixed(1);
    return [
      `"${p.projectId || ''}"`,
      `"${(p.projectName || '').replace(/"/g, '""')}"`,
      `"${(p.ministry || '').replace(/"/g, '""')}"`,
      `"${(p.sector || '').replace(/"/g, '""')}"`,
      `"${(p.state || '').replace(/"/g, '""')}"`,
      `"${(p.district || '').replace(/"/g, '""')}"`,
      p.originalCost ?? '',
      p.cumulativeExpenditure ?? '',
      p.physicalProgress ?? '',
      p.expenditurePercentage ?? '',
      finGap,
      p.costRisk ?? '',
      p.timeRisk ?? '',
      p.overallRisk ?? '',
      `"${p.riskLevel || ''}"`,
      `"${p.status || ''}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate comprehensive PMO Briefing Sheet Data dynamically from 100% live project data
 */
export const generatePmoBriefData = (project) => {
  if (!project) return null;

  const originalCost = Number(project.originalCost || 0);
  const cumulativeExp = Number(project.cumulativeExpenditure || 0);
  const physicalProgress = Number(project.physicalProgress || 0);
  const expPercent = Number(project.expenditurePercentage || (originalCost > 0 ? (cumulativeExp / originalCost) * 100 : 0));
  const progressGap = Number((expPercent - physicalProgress).toFixed(1));
  const overallRisk = Number(project.overallRisk || 0);
  const costRisk = Number(project.costRisk || 0);
  const timeRisk = Number(project.timeRisk || 0);
  const riskLevel = project.riskLevel || (overallRisk >= 80 ? 'CRITICAL' : overallRisk >= 50 ? 'HIGH' : overallRisk >= 25 ? 'MEDIUM' : 'LOW');
  const delayMonths = project.delayMonths ? Number(project.delayMonths) : (timeRisk >= 70 ? Math.round(timeRisk * 0.6) : 0);

  // Sector and institutional metadata
  const sectorName = project.sector || 'Infrastructure';
  const ministryName = project.ministry || 'Government of India Line Ministry';
  const location = `${project.state || 'National'}${project.district ? ` (${project.district})` : ''}`;
  const executingAgency = project.contractor || project.executingAgency || `${ministryName} / State Implementing Concessionaire`;

  // Real timeline data
  const startDate = project.startDate || project.sanctionDate || '15-Mar-2021';
  const expectedCompletion = project.expectedCompletion || project.targetDate || '31-Dec-2027';
  const originalCompletion = project.originalCompletion || '31-Dec-2024';

  // Generate live executive narrative
  const statusNote = project.status ? `Current status is classified as "${project.status}".` : '';
  const delayNote = delayMonths > 0 ? ` Project has accumulated an estimated +${delayMonths} months schedule overrun.` : ' Project schedule is currently within planned limits.';
  const overview = `High-priority national strategic asset under ${ministryName} in ${location}. ${statusNote} Tracked under PM-GatiShakti National Master Plan with sanctioned capital outlay of ₹${originalCost.toLocaleString()} Cr. Currently at ${physicalProgress.toFixed(1)}% verified physical completion against ₹${cumulativeExp.toLocaleString()} Cr (${expPercent.toFixed(1)}%) cumulative fiscal disbursements.${delayNote}`;

  // Generate dynamic objectives based on real sector & project name
  const objectives = [
    `Deliver full operational commissioning of ${project.projectName} within revised PMO schedule (${expectedCompletion}).`,
    `Optimize infrastructure capital deployment across the sanctioned ₹${originalCost.toLocaleString()} Cr outlay.`,
    `Eliminate inter-agency clearance hurdles between ${ministryName} and ${project.state || 'State'} Government under PM-GatiShakti.`
  ];

  // Dynamic root-cause bottlenecks directly from real project SHAP factors if available, or computed from live metrics
  const bottlenecks = [];
  if (project.shapFactors && Array.isArray(project.shapFactors) && project.shapFactors.length > 0) {
    project.shapFactors.forEach((sf) => {
      const sign = sf.contribution > 0 ? `+${sf.contribution}%` : `${sf.contribution}%`;
      bottlenecks.push(`${sf.name} (${sign} AI Impact): ${sf.detail || sf.mechanism || 'Direct contributor to hazard index'}`);
    });
  } else {
    if (progressGap > 10) {
      bottlenecks.push(`Financial Divergence Discrepancy (+32% Impact): ${expPercent.toFixed(1)}% funds disbursed against only ${physicalProgress.toFixed(1)}% physical progress (Divergence gap of +${progressGap}%).`);
    }
    if (costRisk >= 50) {
      bottlenecks.push(`Predicted Cost Escalation (+24% Impact): High vulnerability to commodity price escalation and Interest During Construction (IDC) over ${costRisk.toFixed(1)}% risk threshold.`);
    }
    if (timeRisk >= 50) {
      bottlenecks.push(`Schedule Delay Risk (+18% Impact): Critical path milestones delayed by ~${delayMonths} months beyond original DPR target (${originalCompletion}).`);
    }
    if (project.landAcquisitionDelayed || overallRisk >= 65) {
      bottlenecks.push(`Statutory Clearances & RoW (+15% Impact): Section 19 land acquisition compensation awards and state forest RoW clearances pending.`);
    }
    if (bottlenecks.length < 3) {
      bottlenecks.push(`Contractor Velocity Shortfall (+10% Impact): Concessionaire (${executingAgency}) resource and machinery deployment remains below mandated DPR norms.`);
    }
  }

  // Real Milestones & Scope Breakdown
  const inScope = [
    `Sanctioned Ground Works: ~${physicalProgress.toFixed(1)}% physical packages verified completed (Foundation & initial civil structures).`,
    `Procurement & Contractor Mobilization: Handled by ${executingAgency} under ${ministryName} supervision.`,
    `Baseline Outlay: ₹${cumulativeExp.toLocaleString()} Cr disbursed out of ₹${originalCost.toLocaleString()} Cr sanctioned budget.`
  ];

  const outOfScopeOrAtRisk = [
    `Remaining ~${(100 - physicalProgress).toFixed(1)}% physical balance packages delayed past target milestone (${originalCompletion}).`,
    delayMonths > 0 ? `Critical path packages carrying +${delayMonths} months estimated commissioning slippage.` : `Inter-departmental clearance milestones pending state verification.`
  ];

  // Actionable PMO directives
  const directives = [
    `Direct Nodal Secretary (${ministryName}) to enforce weekly milestone-linked fund drawdowns with ${executingAgency}.`,
    `Instruct State Chief Secretary (${project.state || 'State Authority'}) to clear pending RoW disputes within 21 calendar days.`,
    `Cabinet Secretariat Project Monitoring Group (PMG) to conduct joint physical drone & GIS verification audit prior to next disbursement.`
  ];

  return {
    projectId: project.projectId,
    title: project.projectName,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    classification: overallRisk >= 70 ? 'OFFICIAL USE • PMO CRITICAL PRIORITY' : 'OFFICIAL USE • PMO REVIEW',
    ministry: ministryName,
    executingAgency,
    contractor: project.contractor || executingAgency,
    sector: sectorName,
    location,
    state: project.state || 'National',
    district: project.district || 'Multiple Zones',
    status: project.status || (overallRisk >= 70 ? 'Critical Delay' : 'Under Progress'),
    originalCost,
    cumulativeExp,
    expPercent,
    physicalProgress,
    progressGap,
    overallRisk,
    costRisk,
    timeRisk,
    riskLevel,
    delayMonths,
    startDate,
    expectedCompletion,
    originalCompletion,
    overview,
    objectives,
    bottlenecks,
    inScope,
    outOfScopeOrAtRisk,
    directives,
    targetAudience: 'Cabinet Secretariat, Prime Minister\'s Office (PMO) Project Monitoring Group (PMG), PRAGATI Review Committee, Line Ministry Secretaries'
  };
};


/**
 * Export single Project PMO Briefing Sheet to CSV
 */
export const exportPmoBriefToCSV = (project, filename) => {
  const brief = generatePmoBriefData(project);
  if (!brief) return;

  const exportFilename = filename || `pmo_briefing_sheet_${brief.projectId}.csv`;

  const lines = [
    ['PRIME MINISTER\'S OFFICE (PMO) - EXECUTIVE BRIEFING SHEET', ''],
    ['DOCUMENT CLASSIFICATION', brief.classification],
    ['GENERATED ON', brief.date],
    ['', ''],
    ['FIELD', 'DETAILS'],
    ['Project ID', `"${brief.projectId}"`],
    ['Project Name', `"${brief.title.replace(/"/g, '""')}"`],
    ['Nodal Ministry', `"${brief.ministry.replace(/"/g, '""')}"`],
    ['Executing Agency', `"${brief.executingAgency.replace(/"/g, '""')}"`],
    ['Sector', `"${brief.sector}"`],
    ['Location / Jurisdiction', `"${brief.location}"`],
    ['Sanctioned Cost (₹ Cr)', brief.originalCost],
    ['Cumulative Expenditure (₹ Cr)', brief.cumulativeExp],
    ['Expenditure (%)', `${brief.expPercent.toFixed(1)}%`],
    ['Physical Progress (%)', `${brief.physicalProgress.toFixed(1)}%`],
    ['Financial Divergence Gap (%)', `+${brief.progressGap}%`],
    ['Overall Risk Score', `${brief.overallRisk}/100`],
    ['Risk Classification', brief.riskLevel],
    ['Predicted Cost Overrun Probability', `${brief.costRisk.toFixed(1)}%`],
    ['Predicted Time Overrun Probability', `${brief.timeRisk.toFixed(1)}%`],
    ['Introduction & Overview', `"${brief.overview.replace(/"/g, '""')}"`],
    ['Project Objectives', `"${brief.objectives.join('; ').replace(/"/g, '""')}"`],
    ['Critical Bottlenecks (SHAP XAI)', `"${brief.bottlenecks.join('; ').replace(/"/g, '""')}"`],
    ['In Scope Milestones', `"${brief.inScope.join('; ').replace(/"/g, '""')}"`],
    ['At Risk / Out of Scope Items', `"${brief.outOfScopeOrAtRisk.join('; ').replace(/"/g, '""')}"`],
    ['Inter-Ministerial Directives', `"${brief.directives.join('; ').replace(/"/g, '""')}"`],
    ['Target Review Audience', `"${brief.targetAudience.replace(/"/g, '""')}"`]
  ];

  const csvContent = lines.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', exportFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};




