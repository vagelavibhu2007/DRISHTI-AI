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
    'Cost Risk (%)',
    'Time Risk (%)',
    'Overall Risk Score',
    'Risk Level',
    'Status'
  ];

  const rows = projectsList.map((p) => [
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
    p.costRisk ?? '',
    p.timeRisk ?? '',
    p.overallRisk ?? '',
    `"${p.riskLevel || ''}"`,
    `"${p.status || ''}"`
  ]);

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



