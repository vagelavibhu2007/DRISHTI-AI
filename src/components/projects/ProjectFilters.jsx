import React, { useMemo } from 'react';
import { RotateCcw, Filter, Building2, MapPin, Layers, ShieldAlert } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from '../common/SearchBar';
import { FilterDropdown } from '../common/FilterDropdown';
import { ALL_INDIAN_STATES } from '../common/StateSelectDropdown';

export const ProjectFilters = ({ showCount = true, resultsCount = 0 }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedRiskFilter,
    setSelectedRiskFilter,
    selectedMinistryFilter,
    setSelectedMinistryFilter,
    selectedSectorFilter,
    setSelectedSectorFilter,
    selectedStateFilter,
    setSelectedStateFilter,
    clearAllFilters
  } = useDashboard();
  const { isStateAuthority, assignedState } = useAuth();

  const isFiltered =
    searchQuery ||
    selectedRiskFilter !== 'ALL' ||
    selectedMinistryFilter !== 'ALL' ||
    selectedSectorFilter !== 'ALL' ||
    (!isStateAuthority && selectedStateFilter !== 'ALL');

  const riskOptions = [
    { value: 'ALL', label: 'All Risk Levels' },
    { value: 'CRITICAL', label: 'Critical (≥ 80)' },
    { value: 'HIGH', label: 'High (50 - 79.9)' },
    { value: 'MEDIUM', label: 'Medium (25 - 49.9)' },
    { value: 'LOW', label: 'Low (< 25)' },
  ];

  const ministryOptions = [
    { value: 'ALL', label: 'All Ministries' },
    { value: 'Ministry of Jal Shakti', label: 'Ministry of Jal Shakti' },
    { value: 'Ministry of Road Transport & Highways', label: 'Ministry of Road Transport & Highways' },
    { value: 'Ministry of Railways', label: 'Ministry of Railways' },
    { value: 'Ministry of Petroleum & Natural Gas', label: 'Ministry of Petroleum & Natural Gas' },
    { value: 'Ministry of Power', label: 'Ministry of Power' },
    { value: 'Ministry of Housing & Urban Affairs', label: 'Ministry of Housing & Urban Affairs' },
    { value: 'Ministry of Ports, Shipping & Waterways', label: 'Ministry of Ports & Shipping' },
    { value: 'Ministry of Civil Aviation', label: 'Ministry of Civil Aviation' },
  ];

  const sectorOptions = [
    { value: 'ALL', label: 'All Sectors' },
    { value: 'Water Resources', label: 'Water Resources' },
    { value: 'Road Transport', label: 'Road Transport' },
    { value: 'Railways', label: 'Railways' },
    { value: 'Petroleum & Gas', label: 'Petroleum & Gas' },
    { value: 'Power & Renewable', label: 'Power & Renewable' },
    { value: 'Urban Development', label: 'Urban Development' },
    { value: 'Shipping & Ports', label: 'Shipping & Ports' },
    { value: 'Civil Aviation', label: 'Civil Aviation' },
  ];

  const stateOptions = [
    { value: 'ALL', label: 'All States' },
    ...ALL_INDIAN_STATES.map((s) => ({ value: s, label: s }))
  ];

  const effectiveMinistryOptions = useMemo(() => {
    if (selectedMinistryFilter !== 'ALL' && !ministryOptions.some(o => o.value.toLowerCase() === selectedMinistryFilter.toLowerCase())) {
      return [...ministryOptions, { value: selectedMinistryFilter, label: selectedMinistryFilter }];
    }
    return ministryOptions;
  }, [selectedMinistryFilter]);

  const effectiveSectorOptions = useMemo(() => {
    if (selectedSectorFilter !== 'ALL' && !sectorOptions.some(o => o.value.toLowerCase() === selectedSectorFilter.toLowerCase())) {
      return [...sectorOptions, { value: selectedSectorFilter, label: selectedSectorFilter }];
    }
    return sectorOptions;
  }, [selectedSectorFilter]);

  const effectiveStateOptions = useMemo(() => {
    if (selectedStateFilter !== 'ALL' && !stateOptions.some(o => o.value.toLowerCase() === selectedStateFilter.toLowerCase())) {
      return [...stateOptions, { value: selectedStateFilter, label: selectedStateFilter }];
    }
    return stateOptions;
  }, [selectedStateFilter, stateOptions]);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-card space-y-4">
      {/* Top Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by Project ID (e.g. 701410), Project Name, State or Ministry..."
          className="flex-1"
        />

        {isFiltered && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition self-end md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-slate-100">
        <FilterDropdown
          label="Risk Level"
          value={selectedRiskFilter}
          onChange={setSelectedRiskFilter}
          options={riskOptions}
          icon={ShieldAlert}
        />
        <FilterDropdown
          label="Ministry"
          value={selectedMinistryFilter}
          onChange={setSelectedMinistryFilter}
          options={effectiveMinistryOptions}
          icon={Building2}
        />
        <FilterDropdown
          label="Sector"
          value={selectedSectorFilter}
          onChange={setSelectedSectorFilter}
          options={effectiveSectorOptions}
          icon={Layers}
        />
        <FilterDropdown
          label="State"
          value={selectedStateFilter}
          onChange={setSelectedStateFilter}
          options={effectiveStateOptions}
          icon={MapPin}
        />
      </div>

      {/* Results Count Bar */}
      {showCount && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Showing:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {resultsCount} projects
            </span>
            {isFiltered && <span className="text-slate-400 italic">(filtered criteria)</span>}
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Default sort: Overall Risk Score (Highest to Lowest)
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;

