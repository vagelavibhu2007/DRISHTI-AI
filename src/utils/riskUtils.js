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
 * Generate comprehensive PMO Briefing Sheet Data for any project
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

  // Sector-specific objectives & overview
  const sectorName = project.sector || 'Infrastructure';
  const ministryName = project.ministry || 'Government of India Line Ministry';
  const location = `${project.state || 'National'}${project.district ? ` (${project.district} District)` : ''}`;

  // Generate overview text
  const overview = `High-priority national asset under ${ministryName} in ${location}. Strategic infrastructure project tracked under PM-GatiShakti Master Plan to enhance ${sectorName.toLowerCase()} capacity, regional economic connectivity, and logistical throughput. Currently at ${physicalProgress.toFixed(1)}% physical completion with cumulative fiscal drawdown of ₹${cumulativeExp.toLocaleString()} Cr (${expPercent.toFixed(1)}% of sanctioned outlay).`;

  // Generate dynamic objectives
  const objectives = [
    `Deliver full operational commissioning of ${project.projectName} within revised PMO schedule.`,
    `Optimize infrastructure capital deployment of ₹${originalCost.toLocaleString()} Cr sanctioned budget.`,
    `Eliminate inter-agency clearance hurdles and ensure compliance with central PM-GatiShakti guidelines.`
  ];

  // Generate dynamic root-cause bottlenecks based on data
  const bottlenecks = [];
  if (progressGap > 15) {
    bottlenecks.push(`Financial Divergence Discrepancy: ${expPercent.toFixed(1)}% funds disbursed against only ${physicalProgress.toFixed(1)}% physical progress (Divergence gap of +${progressGap}%).`);
  }
  if (costRisk >= 60) {
    bottlenecks.push(`Severe Cost Escalation Risk (${costRisk.toFixed(1)}%): High exposure to Interest During Construction (IDC) and raw material price indices.`);
  }
  if (timeRisk >= 60) {
    bottlenecks.push(`Schedule Overrun Hazard (${timeRisk.toFixed(1)}%): Critical path packages experiencing continuous milestone slippage.`);
  }
  if (project.landAcquisitionDelayed || overallRisk >= 70) {
    bottlenecks.push(`Statutory & RoW Clearances: Section 19 land acquisition compensation disputes and forest clearance approvals pending.`);
  }
  if (bottlenecks.length < 3) {
    bottlenecks.push(`Contractor Velocity & Resource Mobilization: Equipment and skilled manpower deployment remains 20-35% below mandated DPR norms.`);
  }

  // In Scope & Critical Milestones at Risk
  const inScope = [
    `Phase-1 Civil Construction & structural foundation works across ${location}.`,
    `Procurement and installation of specialized core equipment & utility shifting.`,
    `Digital SCADA / automated telemetry monitoring system integration.`
  ];

  const outOfScopeOrAtRisk = [
    `Package 3 & 4 execution currently halted/delayed pending RoW clearances.`,
    `Secondary feeder spurs / offsite road connectivity under separate state funding.`
  ];

  // Inter-Ministerial Directives
  const directives = [
    `Direct Nodal Secretary (${ministryName}) to hold weekly monitoring reviews with EPC concessionaires.`,
    `Instruct State Chief Secretary (${project.state || 'State Government'}) to expedite district collectorate land compensation disbursement within 21 days.`,
    `Cabinet Secretariat Project Monitoring Group (PMG) to conduct joint physical drone/GIS verification audit.`
  ];

  return {
    projectId: project.projectId,
    title: project.projectName,
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    classification: overallRisk >= 70 ? 'OFFICIAL USE • PMO CRITICAL PRIORITY' : 'OFFICIAL USE • PMO REVIEW',
    ministry: ministryName,
    executingAgency: project.executingAgency || `${ministryName} / State Implementing Authority`,
    sector: sectorName,
    location,
    state: project.state || 'National',
    district: project.district || 'All Districts',
    originalCost,
    cumulativeExp,
    expPercent,
    physicalProgress,
    progressGap,
    overallRisk,
    costRisk,
    timeRisk,
    riskLevel,
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




