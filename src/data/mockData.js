/**
 * DRISHTI AI - Comprehensive Mock Data Store
 * Infrastructure Project Intelligence Platform
 */

export const DASHBOARD_STATS = {
  totalProjects: 1966,
  criticalProjects: 410,
  highRisk: 640,
  mediumRisk: 595,
  lowRisk: 320,
  averageRiskScore: 61.8,
  averageCostRisk: 64.2,
  averageTimeRisk: 59.4,
  lastUpdated: '04 September 2026',
  totalMonitoredValueCr: 2486750,
  atRiskCapitalValueCr: 1142800,
  totalActiveAlerts: 84,
  resolvedAlertsMonth: 28,
  aiConfidenceIndex: 94.6
};

export const RISK_DISTRIBUTION_DATA = [
  { name: 'Critical', value: 410, color: '#EF4444', level: 'CRITICAL', percentage: '20.9%' },
  { name: 'High', value: 640, color: '#F97316', level: 'HIGH', percentage: '32.6%' },
  { name: 'Medium', value: 595, color: '#F59E0B', level: 'MEDIUM', percentage: '30.3%' },
  { name: 'Low', value: 320, color: '#10B981', level: 'LOW', percentage: '16.3%' },
];

export const COST_RISK_DISTRIBUTION = [
  { range: '0-20%', count: 240, label: 'Minimal (0-20%)' },
  { range: '21-40%', count: 380, label: 'Low (21-40%)' },
  { range: '41-60%', count: 520, label: 'Moderate (41-60%)' },
  { range: '61-80%', count: 516, label: 'High (61-80%)' },
  { range: '81-100%', count: 310, label: 'Severe (81-100%)' },
];

export const TIME_RISK_DISTRIBUTION = [
  { range: '0-20%', count: 210, label: 'On Schedule' },
  { range: '21-40%', count: 415, label: 'Minor Delay' },
  { range: '41-60%', count: 495, label: 'Moderate Delay' },
  { range: '61-80%', count: 546, label: 'High Delay' },
  { range: '81-100%', count: 300, label: 'Severe Delay' },
];

export const RISK_TREND_6M = [
  { month: 'Mar 2026', overallRisk: 58.2, costRisk: 60.1, timeRisk: 56.3, criticalCount: 372, highCount: 610 },
  { month: 'Apr 2026', overallRisk: 59.4, costRisk: 61.5, timeRisk: 57.3, criticalCount: 385, highCount: 622 },
  { month: 'May 2026', overallRisk: 60.8, costRisk: 62.8, timeRisk: 58.8, criticalCount: 396, highCount: 630 },
  { month: 'Jun 2026', overallRisk: 62.4, costRisk: 65.2, timeRisk: 59.6, criticalCount: 418, highCount: 648 },
  { month: 'Jul 2026', overallRisk: 61.9, costRisk: 64.6, timeRisk: 59.2, criticalCount: 412, highCount: 642 },
  { month: 'Aug 2026', overallRisk: 61.8, costRisk: 64.2, timeRisk: 59.4, criticalCount: 410, highCount: 640 },
];

export const RISK_TREND_12M = [
  { month: 'Sep 2025', overallRisk: 54.1, costRisk: 56.0, timeRisk: 52.2, criticalCount: 340, highCount: 570 },
  { month: 'Oct 2025', overallRisk: 54.9, costRisk: 57.1, timeRisk: 52.7, criticalCount: 348, highCount: 578 },
  { month: 'Nov 2025', overallRisk: 55.6, costRisk: 58.0, timeRisk: 53.2, criticalCount: 355, highCount: 585 },
  { month: 'Dec 2025', overallRisk: 56.8, costRisk: 59.2, timeRisk: 54.4, criticalCount: 362, highCount: 595 },
  { month: 'Jan 2026', overallRisk: 57.3, costRisk: 59.7, timeRisk: 54.9, criticalCount: 365, highCount: 602 },
  { month: 'Feb 2026', overallRisk: 57.9, costRisk: 60.2, timeRisk: 55.6, criticalCount: 369, highCount: 608 },
  ...RISK_TREND_6M
];

export const SECTOR_RISK_DATA = [
  { sector: 'Water Resources', totalProjects: 342, avgRisk: 74.6, critical: 118, high: 142, med: 58, low: 24, costRisk: 78.4, timeRisk: 70.8 },
  { sector: 'Road Transport', totalProjects: 520, avgRisk: 68.2, critical: 124, high: 198, med: 140, low: 58, costRisk: 71.0, timeRisk: 65.4 },
  { sector: 'Railways', totalProjects: 388, avgRisk: 63.5, critical: 72, high: 146, med: 118, low: 52, costRisk: 66.8, timeRisk: 60.2 },
  { sector: 'Petroleum & Gas', totalProjects: 215, avgRisk: 59.1, critical: 38, high: 62, med: 74, low: 41, costRisk: 61.2, timeRisk: 57.0 },
  { sector: 'Power & Renewable', totalProjects: 198, avgRisk: 53.8, critical: 26, high: 44, med: 78, low: 50, costRisk: 54.5, timeRisk: 53.1 },
  { sector: 'Urban Development', totalProjects: 145, avgRisk: 51.2, critical: 16, high: 28, med: 62, low: 39, costRisk: 52.0, timeRisk: 50.4 },
  { sector: 'Shipping & Ports', totalProjects: 86, avgRisk: 46.4, critical: 9, high: 12, med: 38, low: 27, costRisk: 48.0, timeRisk: 44.8 },
  { sector: 'Civil Aviation', totalProjects: 72, avgRisk: 42.1, critical: 7, high: 8, med: 27, low: 30, costRisk: 43.5, timeRisk: 40.7 },
];

export const MINISTRY_RISK_DATA = [
  { ministry: 'Ministry of Jal Shakti', projects: 342, avgRisk: 74.6, criticalPercent: 34.5 },
  { ministry: 'Ministry of Road Transport & Highways', projects: 520, avgRisk: 68.2, criticalPercent: 23.8 },
  { ministry: 'Ministry of Railways', projects: 388, avgRisk: 63.5, criticalPercent: 18.5 },
  { ministry: 'Ministry of Petroleum & Natural Gas', projects: 215, avgRisk: 59.1, criticalPercent: 17.6 },
  { ministry: 'Ministry of Power', projects: 198, avgRisk: 53.8, criticalPercent: 13.1 },
  { ministry: 'Ministry of Housing & Urban Affairs', projects: 145, avgRisk: 51.2, criticalPercent: 11.0 },
  { ministry: 'Ministry of Ports, Shipping & Waterways', projects: 86, avgRisk: 46.4, criticalPercent: 10.4 },
];

export const STATE_RISK_DATA = [
  { state: 'Maharashtra', code: 'MH', projects: 248, critical: 64, high: 88, med: 62, low: 34, avgRisk: 68.4, lat: 19.75, lng: 75.71 },
  { state: 'Punjab', code: 'PB', projects: 112, critical: 38, high: 42, med: 22, low: 10, avgRisk: 72.8, lat: 31.14, lng: 75.34 },
  { state: 'West Bengal', code: 'WB', projects: 165, critical: 42, high: 58, med: 44, low: 21, avgRisk: 67.1, lat: 22.98, lng: 87.85 },
  { state: 'Haryana', code: 'HR', projects: 134, critical: 35, high: 48, med: 35, low: 16, avgRisk: 66.5, lat: 29.05, lng: 76.08 },
  { state: 'Uttar Pradesh', code: 'UP', projects: 310, critical: 58, high: 104, med: 98, low: 50, avgRisk: 64.9, lat: 26.84, lng: 80.94 },
  { state: 'Bihar', code: 'BR', projects: 142, critical: 39, high: 52, med: 36, low: 15, avgRisk: 69.3, lat: 25.09, lng: 85.31 },
  { state: 'Rajasthan', code: 'RJ', projects: 178, critical: 36, high: 56, med: 54, low: 32, avgRisk: 61.2, lat: 27.02, lng: 74.21 },
  { state: 'Odisha', code: 'OR', projects: 125, critical: 24, high: 42, med: 39, low: 20, avgRisk: 59.8, lat: 20.95, lng: 85.09 },
  { state: 'Andhra Pradesh', code: 'AP', projects: 138, critical: 28, high: 45, med: 42, low: 23, avgRisk: 60.5, lat: 15.91, lng: 79.74 },
  { state: 'Madhya Pradesh', code: 'MP', projects: 156, critical: 22, high: 48, med: 56, low: 30, avgRisk: 56.4, lat: 22.97, lng: 78.65 },
  { state: 'Gujarat', code: 'GJ', projects: 190, critical: 18, high: 44, med: 72, low: 56, avgRisk: 48.7, lat: 22.25, lng: 71.19 },
  { state: 'Tamil Nadu', code: 'TN', projects: 180, critical: 16, high: 41, med: 69, low: 54, avgRisk: 47.9, lat: 11.12, lng: 78.65 },
  { state: 'Karnataka', code: 'KA', projects: 168, critical: 15, high: 38, med: 66, low: 49, avgRisk: 46.8, lat: 15.31, lng: 75.71 },
  { state: 'Assam', code: 'AS', projects: 88, critical: 21, high: 34, med: 22, low: 11, avgRisk: 66.8, lat: 26.20, lng: 92.93 },
  { state: 'Kerala', code: 'KL', projects: 76, critical: 9, high: 18, med: 29, low: 20, avgRisk: 44.5, lat: 10.85, lng: 76.27 },
];

/**
 * Helper to generate 100+ realistic project records
 */
const rawSeedProjects = [
  {
    projectId: '701410',
    projectName: 'Relining of Rajasthan Feeder and Sirhind Feeder',
    ministry: 'Ministry of Jal Shakti',
    sector: 'Water Resources',
    state: 'Punjab',
    district: 'Ferozepur / Muktsar',
    state: 'Punjab, Rajasthan',
    district: 'Ferozepur / Muktsar / Sri Ganganagar',
    originalCost: 1976.4,
    cumulativeExpenditure: 1892.5,
    physicalProgress: 42.0,
    expenditurePercentage: 95.8,
    costRisk: 92.0,
    timeRisk: 89.0,
    overallRisk: 90.5,
    riskLevel: 'CRITICAL',
    status: 'Under Progress',
    startDate: '15-Mar-2019',
    expectedCompletion: '31-Dec-2027',
    originalCompletion: '30-Jun-2023',
    contractor: 'Patel - Som Datt Consortium',
    delayMonths: 54,
    shapFactors: [
      { name: 'Expenditure vs Original Cost', contribution: 32, type: 'increase', detail: 'Financial outlay has hit 95.8% while physical output lags at 42%' },
      { name: 'Low Physical Progress Gap', contribution: 24, type: 'increase', detail: 'Slippage of 53.8% between financial & physical completion milestones' },
      { name: 'Historical Sector Risk (Water)', contribution: 18, type: 'increase', detail: 'Irrigation & canal projects have 78% baseline overrun rate' },
      { name: 'Inter-State Water Dispute Delays', contribution: 15, type: 'increase', detail: 'Canal shutdown approvals restricted to short seasonal windows' },
      { name: 'Right of Way & State Clearances', contribution: 8, type: 'increase', detail: 'Forest clearance along 32 km canal bank pending' },
      { name: 'Approved Budget Allocation', contribution: -7, type: 'decrease', detail: 'Central funding under PMKSY allocated timely' }
    ]
  },
  {
    projectId: '701391',
    projectName: 'Aruna Medium Irrigation Project',
    ministry: 'Ministry of Jal Shakti',
    sector: 'Water Resources',
    state: 'Maharashtra',
    district: 'Sindhudurg',
    originalCost: 684.2,
    cumulativeExpenditure: 645.8,
    physicalProgress: 38.5,
    expenditurePercentage: 94.4,
    costRisk: 89.0,
    timeRisk: 88.0,
    overallRisk: 88.5,
    riskLevel: 'CRITICAL',
    status: 'Under Progress',
    startDate: '10-Jan-2018',
    expectedCompletion: '15-Nov-2027',
    originalCompletion: '31-Mar-2022',
    contractor: 'Kalyan Toll Infrastructure Ltd.',
    delayMonths: 68,
    shapFactors: [
      { name: 'Excessive Financial Burning Rate', contribution: 30, type: 'increase', detail: 'Fund drawdowns ahead of dam spillway concrete pour' },
      { name: 'Submerged Land Compensation Litigation', contribution: 26, type: 'increase', detail: '4 villages yet to accept R&R compensation package' },
      { name: 'Monsoon Flooding Disruptions', contribution: 17, type: 'increase', detail: 'Heavy Konkan rainfall restricts work to 5 months/year' },
      { name: 'Contractor Equipment Under-mobilization', contribution: 12, type: 'increase', detail: 'Core drilling rigs at 40% of mandated capacity' }
    ]
  },
  {
    projectId: '701383',
    projectName: 'Waghur Project (Dam & Canals)',
    ministry: 'Ministry of Jal Shakti',
    sector: 'Water Resources',
    state: 'Maharashtra',
    district: 'Jalgaon',
    originalCost: 1248.0,
    cumulativeExpenditure: 1195.0,
    physicalProgress: 45.0,
    expenditurePercentage: 95.8,
    costRisk: 86.0,
    timeRisk: 88.0,
    overallRisk: 87.0,
    riskLevel: 'CRITICAL',
    status: 'Under Progress',
    startDate: '20-Oct-2017',
    expectedCompletion: '30-Jun-2027',
    originalCompletion: '31-Dec-2021',
    contractor: 'Hindustan Construction Co.',
    delayMonths: 66,
    shapFactors: [
      { name: 'Canal Network Land Acquisition Gaps', contribution: 28, type: 'increase', detail: 'Left bank canal stretch blocked by unresolved land parcels' },
      { name: 'Cumulative Expenditure Ratio', contribution: 27, type: 'increase', detail: '95.8% funds utilized for 45% finished delivery' },
      { name: 'Contractor Renegotiation Claims', contribution: 20, type: 'increase', detail: 'Pending arbitration on price escalation clauses' }
    ]
  },
  {
    projectId: '617302',
    projectName: 'Durgapur-Haldia Pipeline Phase II',
    ministry: 'Ministry of Petroleum & Natural Gas',
    sector: 'Petroleum & Gas',
    state: 'West Bengal',
    district: 'Purba Medinipur / Paschim Bardhaman',
    state: 'West Bengal, Jharkhand',
    district: 'Purba Medinipur / Paschim Bardhaman / Dhanbad',
    originalCost: 2850.0,
    cumulativeExpenditure: 2480.0,
    physicalProgress: 52.0,
    expenditurePercentage: 87.0,
    costRisk: 84.0,
    timeRisk: 82.0,
    overallRisk: 83.0,
    riskLevel: 'CRITICAL',
    status: 'Under Progress',
    startDate: '01-Aug-2020',
    expectedCompletion: '31-Mar-2027',
    originalCompletion: '30-Sep-2023',
    contractor: 'GAIL / L&T Hydrocarbon',
    delayMonths: 42,
    shapFactors: [
      { name: 'River Crossing HDD HDD Technical Impasse', contribution: 31, type: 'increase', detail: 'Horizontal directional drilling stalled at Hooghly crossing' },
      { name: 'Crop Compensation Blockades', contribution: 22, type: 'increase', detail: 'Local landowner unions halting pipe laying in 3 blocks' },
      { name: 'Steel Pipeline Procurement Cost Inflation', contribution: 19, type: 'increase', detail: 'Imported alloy prices rose 24% over contract estimate' }
    ]
  },
  {
    projectId: '618482',
    projectName: 'Delhi-Amritsar-Katra Expressway Phase-I',
    ministry: 'Ministry of Road Transport & Highways',
    sector: 'Road Transport',
    state: 'Haryana',
    district: 'Jhajjar / Rohtak / Jind',
    state: 'Delhi, Haryana, Punjab, Jammu and Kashmir',
    district: 'Jhajjar / Rohtak / Jind / Ludhiana',
    originalCost: 15400.0,
    cumulativeExpenditure: 12936.0,
    physicalProgress: 58.0,
    expenditurePercentage: 84.0,
    costRisk: 82.0,
    timeRisk: 80.0,
    overallRisk: 81.0,
    riskLevel: 'CRITICAL',
    status: 'Under Progress',
    startDate: '15-Feb-2021',
    expectedCompletion: '31-Dec-2026',
    originalCompletion: '31-Dec-2024',
    contractor: 'NHAI / Dilip Buildcon & GR Infra',
    delayMonths: 24,
    shapFactors: [
      { name: 'Flyash & Earthfill Material Shortages', contribution: 25, type: 'increase', detail: 'Procurement distance increased by 45 km due to local quarry bans' },
      { name: 'High-Speed Railway Interface Approvals', contribution: 21, type: 'increase', detail: 'Design nod for 2 railway overbridges (ROBs) delayed' },
      { name: 'Tier-1 EPC Contractor Bandwidth', contribution: 18, type: 'increase', detail: 'Multiple simultaneous packages stretching sub-vendor capacity' }
    ]
  },
  {
    projectId: '619201',
    projectName: 'Delhi–Mumbai Expressway Corridor',
    ministry: 'Ministry of Road Transport & Highways',
    sector: 'Road Transport',
    state: 'Delhi, Haryana, Rajasthan, Gujarat, Maharashtra',
    district: 'Gurugram / Jaipur / Vadodara / Thane',
    originalCost: 98000.0,
    cumulativeExpenditure: 84280.0,
    physicalProgress: 68.0,
    expenditurePercentage: 86.0,
    costRisk: 83.0,
    timeRisk: 79.0,
    overallRisk: 81.0,
    riskLevel: 'CRITICAL',
    status: 'Under Progress',
    startDate: '01-Mar-2019',
    expectedCompletion: '30-Jun-2026',
    originalCompletion: '31-Mar-2024',
    contractor: 'NHAI / L&T / GR Infra',
    delayMonths: 27,
    shapFactors: [
      { name: 'Multi-State Land Acquisition Alignment', contribution: 29, type: 'increase', detail: 'Right of Way clearances across 5 states' },
      { name: 'Wildlife & Eco-Sensitive Corridor Passes', contribution: 24, type: 'increase', detail: 'Mukundara & Ranthambore wildlife overpass statutory nod' },
      { name: 'Bridge Construction over Narmada & Chambal', contribution: 18, type: 'increase', detail: 'Extra-dosed cable stayed bridge deep foundation work' }
    ]
  },
  {
    projectId: '619305',
    projectName: 'Western Dedicated Freight Corridor (DFC)',
    ministry: 'Ministry of Railways',
    sector: 'Railways',
    state: 'Delhi, Haryana, Rajasthan, Gujarat, Maharashtra',
    district: 'Rewari / Palanpur / JNPT Navi Mumbai',
    originalCost: 51100.0,
    cumulativeExpenditure: 46500.0,
    physicalProgress: 78.0,
    expenditurePercentage: 91.0,
    costRisk: 76.0,
    timeRisk: 74.0,
    overallRisk: 75.0,
    riskLevel: 'HIGH',
    status: 'Under Progress',
    startDate: '10-Oct-2016',
    expectedCompletion: '31-Dec-2026',
    originalCompletion: '31-Dec-2021',
    contractor: 'DFCCIL / Sojitz-L&T Consortium',
    delayMonths: 60,
    shapFactors: [
      { name: 'JNPT Port Connectivity Tunneling', contribution: 28, type: 'increase', detail: 'Parsik Hill double-stack container tunnel excavation' },
      { name: 'Overhead 25kV Traction Electrification', contribution: 20, type: 'increase', detail: 'Substation power grid synchronization delays' }
    ]
  }
];

// Additional rich project seeds to reach 100+ high-quality diverse projects
const ministriesList = [
  'Ministry of Road Transport & Highways',
  'Ministry of Railways',
  'Ministry of Jal Shakti',
  'Ministry of Petroleum & Natural Gas',
  'Ministry of Power',
  'Ministry of Housing & Urban Affairs',
  'Ministry of Ports, Shipping & Waterways',
  'Ministry of Civil Aviation'
];

const sectorsMap = {
  'Ministry of Road Transport & Highways': 'Road Transport',
  'Ministry of Railways': 'Railways',
  'Ministry of Jal Shakti': 'Water Resources',
  'Ministry of Petroleum & Natural Gas': 'Petroleum & Gas',
  'Ministry of Power': 'Power & Renewable',
  'Ministry of Housing & Urban Affairs': 'Urban Development',
  'Ministry of Ports, Shipping & Waterways': 'Shipping & Ports',
  'Ministry of Civil Aviation': 'Civil Aviation'
};

const statesList = [
  'Maharashtra', 'Punjab', 'West Bengal', 'Haryana', 'Uttar Pradesh',
  'Bihar', 'Rajasthan', 'Odisha', 'Andhra Pradesh', 'Madhya Pradesh',
  'Gujarat', 'Tamil Nadu', 'Karnataka', 'Assam', 'Kerala', 'Telangana', 'Jharkhand'
];

const projectTitlesGenerator = [
  { prefix: 'Dedicated Freight Corridor', sub: 'Western Trunk / Eastern Link', sector: 'Railways' },
  { prefix: 'Greenfield International Airport', sub: 'Phase 2 Expansion & Terminal', sector: 'Civil Aviation' },
  { prefix: 'National Highway 4-Laning Bypass', sub: 'Corridor Modernization Package', sector: 'Road Transport' },
  { prefix: 'Ultra Mega Solar Power Park', sub: '1200MW Grid Evacuation Line', sector: 'Power & Renewable' },
  { prefix: 'Underground Metro Corridor', sub: 'Line 4 Tunnelling & Signaling', sector: 'Urban Development' },
  { prefix: 'Multi-Modal Logistics Park (MMLP)', sub: 'Rail-Road Inland Hub', sector: 'Road Transport' },
  { prefix: 'Deep Sea Port Deepening & Berth', sub: 'Container Terminal Expansion', sector: 'Shipping & Ports' },
  { prefix: 'Lift Irrigation & Pressurized Pipe', sub: 'Barrage & Canal Automation', sector: 'Water Resources' },
  { prefix: 'LNG Import Terminal & Regasification', sub: 'Cryogenic Pipeline Network', sector: 'Petroleum & Gas' },
  { prefix: 'Semi-High Speed Rail Doubling', sub: 'Track Modernization & Electrification', sector: 'Railways' },
  { prefix: 'Smart City 24x7 Water Supply', sub: 'SCADA Ring Main Infrastructure', sector: 'Urban Development' },
  { prefix: 'Pumped Storage Hydroelectric Plant', sub: 'Upper Reservoir & Turbines', sector: 'Power & Renewable' }
];

const contractors = [
  'Larsen & Toubro Ltd.', 'Tata Projects Ltd.', 'Afcons Infrastructure',
  'NCC Limited', 'Dilip Buildcon Ltd.', 'GR Infraprojects', 'MEIL Infra',
  'Hindustan Construction Co.', 'Ircon International', 'RVNL', 'KEC International'
];

export const generateProjectsDataset = () => {
  const projects = [...rawSeedProjects];
  
  // Seed remaining up to 105 projects
  const baseId = 702000;
  for (let i = 0; i < 100; i++) {
    const template = projectTitlesGenerator[i % projectTitlesGenerator.length];
    const state = statesList[i % statesList.length];
    const ministry = Object.keys(sectorsMap).find(k => sectorsMap[k] === template.sector) || ministriesList[i % ministriesList.length];
    const sector = sectorsMap[ministry];
    
    // Deterministic progression
    const cost = Number((350 + (i * 243.5) % 18500).toFixed(1));
    const physicalProgress = Number((15 + (i * 17.3) % 80).toFixed(1));
    
    // Risk curve calculation to distribute realistic Critical, High, Medium, Low
    let expRatio;
    let costRisk, timeRisk;
    
    if (i % 5 === 0 || i < 15) {
      // Critical project profile
      expRatio = Math.min(1.35, (physicalProgress + 35 + (i % 20)) / 100);
      costRisk = Math.min(96, Math.max(80, 80 + (i % 17)));
      timeRisk = Math.min(97, Math.max(80, 79 + ((i * 3) % 19)));
    } else if (i % 3 === 0) {
      // High risk profile
      expRatio = Math.min(1.15, (physicalProgress + 18 + (i % 15)) / 100);
      costRisk = Math.min(79, Math.max(52, 54 + (i % 25)));
      timeRisk = Math.min(78, Math.max(50, 52 + ((i * 2) % 26)));
    } else if (i % 2 === 0) {
      // Medium risk profile
      expRatio = Math.min(1.0, (physicalProgress + 4 + (i % 8)) / 100);
      costRisk = Math.min(49, Math.max(26, 27 + (i % 22)));
      timeRisk = Math.min(49, Math.max(25, 26 + (i % 23)));
    } else {
      // Low risk profile
      expRatio = Math.max(0.2, (physicalProgress - 5) / 100);
      costRisk = Math.min(24.5, Math.max(8, 9 + (i % 15)));
      timeRisk = Math.min(24.8, Math.max(6, 8 + ((i * 2) % 16)));
    }

    const cumulativeExp = Number((cost * expRatio).toFixed(1));
    const expPercentage = Number(((cumulativeExp / cost) * 100).toFixed(1));
    const overallRisk = Number(((costRisk + timeRisk) / 2).toFixed(1));

    let riskLevel = 'LOW';
    if (overallRisk >= 80) riskLevel = 'CRITICAL';
    else if (overallRisk >= 50) riskLevel = 'HIGH';
    else if (overallRisk >= 25) riskLevel = 'MEDIUM';

    const startYear = 2019 + (i % 5);
    const delay = overallRisk > 75 ? 24 + (i % 36) : overallRisk > 50 ? 12 + (i % 18) : (i % 6);
    
    projects.push({
      projectId: String(baseId + i),
      projectName: `${template.prefix} - ${state} (${template.sub})`,
      ministry,
      sector,
      state,
      district: `${state} Central District`,
      originalCost: cost,
      cumulativeExpenditure: cumulativeExp,
      physicalProgress,
      expenditurePercentage: expPercentage,
      costRisk: Number(costRisk.toFixed(1)),
      timeRisk: Number(timeRisk.toFixed(1)),
      overallRisk,
      riskLevel,
      status: physicalProgress >= 95 ? 'Nearing Completion' : 'Under Progress',
      startDate: `12-${['Jan', 'Mar', 'Jun', 'Sep', 'Nov'][i % 5]}-${startYear}`,
      expectedCompletion: `30-${['Mar', 'Jun', 'Oct', 'Dec'][i % 4]}-${2026 + Math.floor(delay / 12)}`,
      originalCompletion: `31-Dec-${startYear + 3}`,
      contractor: contractors[i % contractors.length],
      delayMonths: delay,
      shapFactors: [
        { name: 'Expenditure vs Progress Discrepancy', contribution: Math.round(overallRisk * 0.35), type: 'increase', detail: `Variance of ${(expPercentage - physicalProgress).toFixed(1)}% between spend and ground progress` },
        { name: 'Contractor Execution Velocity', contribution: Math.round(overallRisk * 0.25), type: 'increase', detail: 'Monthly milestone delivery tracking below target baseline' },
        { name: 'Regulatory / Environmental Clearances', contribution: Math.round(overallRisk * 0.18), type: 'increase', detail: 'Pending stage-2 approval for ancillary works' },
        { name: 'Fund Disbursement Regularity', contribution: -Math.round((100 - overallRisk) * 0.2), type: 'decrease', detail: 'Quarterly budgetary releases processed on schedule' }
      ]
    });
  }

  return projects;
};

export const MOCK_PROJECTS = generateProjectsDataset();

export const EARLY_WARNING_ALERTS = [
  {
    alertId: 'ALT-2026-881',
    projectId: '701410',
    projectName: 'Relining of Rajasthan Feeder and Sirhind Feeder',
    ministry: 'Ministry of Jal Shakti',
    state: 'Punjab',
    riskType: 'Cost Escalation & Delay',
    severity: 'CRITICAL',
    probability: 92,
    reason: 'Expenditure reached 95.8% of sanction while physical completion is only 42.0%. Predicted cost overrun probability >90%.',
    recommendation: 'Trigger joint technical audit and enforce milestone-linked escrow fund release.',
    created: '04 Sep 2026, 08:30 AM',
    status: 'New',
    badgeColor: 'bg-red-500'
  },
  {
    alertId: 'ALT-2026-880',
    projectId: '701391',
    projectName: 'Aruna Medium Irrigation Project',
    ministry: 'Ministry of Jal Shakti',
    state: 'Maharashtra',
    riskType: 'Time Delay & Cost',
    severity: 'CRITICAL',
    probability: 89,
    reason: 'Dam spillway construction halted due to rehabilitation litigation. 68 months aggregate delay predicted.',
    recommendation: 'Expedite district collectorate settlement for 4 displaced villages.',
    created: '03 Sep 2026, 04:15 PM',
    status: 'Under Review',
    badgeColor: 'bg-red-500'
  },
  {
    alertId: 'ALT-2026-879',
    projectId: '617302',
    projectName: 'Durgapur-Haldia Pipeline Phase II',
    ministry: 'Ministry of Petroleum & Natural Gas',
    state: 'West Bengal',
    riskType: 'Execution Bottleneck',
    severity: 'CRITICAL',
    probability: 84,
    reason: 'Horizontal drilling under Hooghly river encountering bedrock fractures; material cost inflation +24%.',
    recommendation: 'Review alternative micro-tunneling route and engage expert marine EPC consultants.',
    created: '02 Sep 2026, 11:20 AM',
    status: 'Action Initiated',
    badgeColor: 'bg-red-500'
  },
  {
    alertId: 'ALT-2026-878',
    projectId: '618482',
    projectName: 'Delhi-Amritsar-Katra Expressway Phase-I',
    ministry: 'Ministry of Road Transport & Highways',
    state: 'Haryana',
    riskType: 'Material Shortage Delay',
    severity: 'HIGH',
    probability: 81,
    reason: 'Earthfill borrow-pit bans in NCR causing flyash supply deficit; package 4 execution slowed by 32%.',
    recommendation: 'Facilitate inter-state thermal power plant flyash haulage permits.',
    created: '01 Sep 2026, 02:45 PM',
    status: 'Under Review',
    badgeColor: 'bg-orange-500'
  },
  {
    alertId: 'ALT-2026-877',
    projectId: '701383',
    projectName: 'Waghur Project (Dam & Canals)',
    ministry: 'Ministry of Jal Shakti',
    state: 'Maharashtra',
    riskType: 'Contractor Arbitration Risk',
    severity: 'HIGH',
    probability: 86,
    reason: 'Contractor submitted price escalation claim of ₹240 Cr; potential work slowdown in dry season.',
    recommendation: 'Convene Dispute Resolution Board meeting before next milestone lapse.',
    created: '31 Aug 2026, 09:10 AM',
    status: 'Under Review',
    badgeColor: 'bg-orange-500'
  },
  {
    alertId: 'ALT-2026-876',
    projectId: '702004',
    projectName: 'Underground Metro Corridor - Uttar Pradesh',
    ministry: 'Ministry of Housing & Urban Affairs',
    state: 'Uttar Pradesh',
    riskType: 'Tunnel Boring Machine (TBM) Delay',
    severity: 'MEDIUM',
    probability: 48,
    reason: 'TBM cutter-head replacement needed at station 6 interface; minor schedule compression required.',
    recommendation: 'Monitor weekly advance rates and adjust parallel station cavern construction.',
    created: '30 Aug 2026, 05:00 PM',
    status: 'Resolved',
    badgeColor: 'bg-amber-500'
  },
  {
    alertId: 'ALT-2026-875',
    projectId: '702003',
    projectName: 'Ultra Mega Solar Power Park - Gujarat',
    ministry: 'Ministry of Power',
    state: 'Gujarat',
    riskType: 'Grid Interconnection Delay',
    severity: 'MEDIUM',
    probability: 44,
    reason: 'Substation bays equipment transformer delivery rescheduled by 6 weeks.',
    recommendation: 'Coordinate with CTUIL for provisional charged energization.',
    created: '29 Aug 2026, 01:20 PM',
    status: 'Resolved',
    badgeColor: 'bg-amber-500'
  },
  {
    alertId: 'ALT-2026-874',
    projectId: '702008',
    projectName: 'LNG Import Terminal & Regasification - Odisha',
    ministry: 'Ministry of Petroleum & Natural Gas',
    state: 'Odisha',
    riskType: 'Coastal Regulatory Compliance',
    severity: 'HIGH',
    probability: 74,
    reason: 'CRZ monitoring report requested supplementary marine ecology survey.',
    recommendation: 'Submit NIOT survey findings to state coastal zone authority.',
    created: '28 Aug 2026, 10:40 AM',
    status: 'Action Initiated',
    badgeColor: 'bg-orange-500'
  }
];

export const AI_ASSISTANT_KNOWLEDGE_BASE = [
  {
    triggers: ['critical', 'highest risk', 'which projects are at critical risk', 'critical projects'],
    response: `### 🚨 Critical Risk Projects Analysis (September 2026)

Based on the DRISHTI AI predictive model, **410 projects (20.9%)** are categorized as **CRITICAL RISK** (Overall Risk Score ≥ 80).

Here are the top high-urgency projects requiring executive intervention:

1. **Relining of Rajasthan Feeder & Sirhind Feeder (ID: 701410)**
   - **Overall Risk:** 90.5 | **Cost Risk:** 92.0% | **Time Risk:** 89.0%
   - **Root Cause:** 95.8% expenditure utilized with only 42.0% physical progress completed.
   - **Key Factor:** Inter-state canal closure constraints and RoW clearances.

2. **Aruna Medium Irrigation Project (ID: 701391)**
   - **Overall Risk:** 88.5 | **Cost Risk:** 89.0% | **Time Risk:** 88.0%
   - **Root Cause:** Spillway construction halted; 68 months cumulative delay.

3. **Waghur Project (ID: 701383)**
   - **Overall Risk:** 87.0 | **Cost Risk:** 86.0% | **Time Risk:** 88.0%
   - **Root Cause:** Land acquisition bottlenecks on Left Bank canal.

4. **Durgapur-Haldia Pipeline Phase II (ID: 617302)**
   - **Overall Risk:** 83.0 | **Cost Risk:** 84.0% | **Time Risk:** 82.0%
   - **Root Cause:** HDD technical impasse under Hooghly river bed.

5. **Delhi-Amritsar-Katra Expressway Phase-I (ID: 618482)**
   - **Overall Risk:** 81.0 | **Cost Risk:** 82.0% | **Time Risk:** 80.0%
   - **Root Cause:** Embankment material supply bottlenecks and ROB approvals.

👉 *Recommended Action: Initiate fast-track inter-ministerial coordination via PMG / PRAGATI portal for these top 5 assets.*`
  },
  {
    triggers: ['state', 'which state has highest risk', 'highest state risk', 'state risk'],
    response: `### 🗺️ State-Level Infrastructure Risk Breakdown

According to spatial aggregated predictions:

1. **Punjab (Average Risk: 72.8)**
   - 38 Critical projects out of 112 monitored assets (33.9% critical ratio).
   - Dominated by water canal relining and irrigation bottleneck projects.

2. **Bihar (Average Risk: 69.3)**
   - 39 Critical projects out of 142 monitored assets.
   - Land acquisition & seasonal monsoon flooding are primary SHAP risk contributors.

3. **Maharashtra (Average Risk: 68.4)**
   - Highest absolute number of at-risk capital (64 Critical, 88 High Risk out of 248 total).
   - High concentration in medium irrigation dams and western highway corridors.

4. **West Bengal (Average Risk: 67.1)**
   - 42 Critical projects; environmental and RoW clearances add +28% average delay probability.

5. **Haryana (Average Risk: 66.5)**
   - High concentration of expressway and multi-modal logistics packages.

💡 *Insight: Northern & Eastern river basin states exhibit 22% higher time overrun risks due to seasonal hydro-geological constraints.*`
  },
  {
    triggers: ['why is this project critical', 'why risky', 'shap', 'explainable ai', 'root cause'],
    response: `### 🔍 Explainable AI (XAI) Risk Decomposition

DRISHTI AI evaluates 36 dynamic feature variables using gradient-boosted SHAP trees:

| Risk Driver | Average Weight | Primary Impact Mechanism |
| :--- | :--- | :--- |
| **Financial / Physical Progress Divergence** | **+32%** | Disproportionate expenditure drawdowns before physical milestone verification. |
| **Contractor Velocity & Capacity** | **+24%** | EPC contractor equipment deployment below mandated DPR specifications. |
| **Historical Sector Vulnerability** | **+18%** | Water Resources & Highway sectors have structural delay tendencies. |
| **Land Acquisition & RoW Litigations** | **+15%** | Section 19 land award disputes halting linear infrastructure packages. |
| **Geographic / Seasonal Constraints** | **+8%** | Monsoonal restrictions and local quarry supply bans. |

✨ *All predictions feature transparent positive/negative factor attribution to eliminate black-box decision making.*`
  },
  {
    triggers: ['cost overrun', 'cost risk', 'high cost overrun'],
    response: `### 💰 Cost Overrun Risk Overview

- **National Average Predicted Cost Risk:** 64.2%
- **Projects with >80% Cost Overrun Probability:** 310 projects (₹4.82 Lakh Cr capital exposed).
- **Most Vulnerable Sector:** Water Resources (78.4% cost risk) followed by Road Transport (71.0%).
- **Primary Cost Escalation Factor:** Extended time delays leading to IDC (Interest During Construction) and contractual price-index adjustments.`
  },
  {
    triggers: ['low physical progress', 'physical progress', 'slowest'],
    response: `### 📉 Low Physical Progress Alert Summary

There are **186 projects** where expenditure exceeds 70% but physical progress remains **under 35%**:

- **701410 - Rajasthan Feeder Relining:** 42.0% progress (95.8% spend)
- **701391 - Aruna Irrigation Dam:** 38.5% progress (94.4% spend)
- **701383 - Waghur Dam & Canals:** 45.0% progress (95.8% spend)
- **702014 - Lift Irrigation Barrage AP:** 28.2% progress (76.4% spend)
- **702022 - Smart City Ring Main WB:** 31.0% progress (82.1% spend)

⚠️ *These 186 projects have been automatically queued for physical drone-based geospatial verification audits.*`
  }
];

export const REPORTS_LIST = [
  {
    id: 'REP-2026-PMO-00',
    title: 'PMO Infrastructure Briefing Dossier (Inter-Ministerial)',
    category: 'PMO Executive Brief',
    description: 'Standard 2-tone PMO executive briefing sheets with SHAP root cause bottlenecks, fiscal divergence, and directives.',
    generatedDate: '09 Sep 2026',
    fileSize: '5.2 MB',
    format: 'PDF / CSV',
    badge: 'PMO Standard',
    isPmoBrief: true
  },
  {
    id: 'REP-2026-Q3-01',
    title: 'National Infrastructure Risk Assessment - Q3 2026',
    category: 'Executive Summary',
    description: 'Comprehensive macro analysis covering all 1,966 projects across 8 central ministries.',
    generatedDate: '04 Sep 2026',
    fileSize: '4.8 MB',
    format: 'PDF',
    badge: 'Official'
  },
  {
    id: 'REP-2026-CRIT-02',
    title: 'High-Risk & Critical Projects Dossier (410 Assets)',
    category: 'Priority Action',
    description: 'Detailed project-level SHAP risk breakdown for Cabinet Secretariat & PRAGATI review.',
    generatedDate: '03 Sep 2026',
    fileSize: '12.4 MB',
    format: 'PDF',
    badge: 'Critical',
    isPmoBrief: true
  },
  {
    id: 'REP-2026-GEO-03',
    title: 'State-wise Risk & Spatial Bottleneck Report',
    category: 'Geographic Intelligence',
    description: 'Corridor-level land acquisition, environmental clearance, and contractor performance map.',
    generatedDate: '01 Sep 2026',
    fileSize: '8.2 MB',
    format: 'PDF',
    badge: 'Spatial'
  },
  {
    id: 'REP-2026-COST-04',
    title: 'Predicted Cost Escalation & Fiscal Exposure Forecast',
    category: 'Financial Analytics',
    description: 'Quantitative probability distributions of potential ₹11.42 Lakh Cr capital risk.',
    generatedDate: '28 Aug 2026',
    fileSize: '3.6 MB',
    format: 'CSV / PDF',
    badge: 'Financial'
  },
  {
    id: 'REP-2026-MIN-05',
    title: 'Ministry of Jal Shakti - Sectoral Vulnerability Audit',
    category: 'Sector Dossier',
    description: 'Deep dive into 342 irrigation and water infrastructure projects across 18 river basins.',
    generatedDate: '25 Aug 2026',
    fileSize: '6.1 MB',
    format: 'PDF',
    badge: 'Sector'
  }
];


