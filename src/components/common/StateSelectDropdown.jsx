import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, MapPin, Check, Search, Globe, X } from 'lucide-react';
import { STANDARDIZED_STATES } from '../../utils/riskUtils';
import { STATE_RISK_DATA } from '../../data/mockData';

// Complete list of all 36 Indian States and Union Territories sorted alphabetically
export const ALL_INDIAN_STATES = [
  'Andaman & Nicobar',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const StateSelectDropdown = ({
  value = 'ALL',
  onChange,
  className = '',
  buttonClassName = '',
  showAllOption = true,
  allLabel = 'All States',
  placeholder = 'Select State',
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Project count mapping for quick visual feedback
  const stateProjectCounts = useMemo(() => {
    const map = {};
    STATE_RISK_DATA.forEach((item) => {
      map[item.state.toLowerCase()] = item.projects;
    });
    return map;
  }, []);

  // Filtered states based on search input
  const filteredStates = useMemo(() => {
    if (!searchTerm.trim()) return ALL_INDIAN_STATES;
    const term = searchTerm.toLowerCase().trim();
    return ALL_INDIAN_STATES.filter((state) =>
      state.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSelect = (stateVal) => {
    if (onChange) {
      onChange(stateVal);
    }
    setIsOpen(false);
  };

  const selectedDisplay = useMemo(() => {
    if (!value || value === 'ALL' || value === 'All States') {
      return allLabel;
    }
    return value;
  }, [value, allLabel]);

  const isAllSelected = !value || value === 'ALL' || value === 'All States';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`inline-flex items-center justify-between gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gov-700/20 focus:border-gov-700 transition cursor-pointer min-w-[140px] sm:min-w-[160px] ${
          isOpen ? 'ring-2 ring-gov-700/20 border-gov-700' : ''
        } ${buttonClassName}`}
      >
        <div className="inline-flex items-center gap-1.5 truncate">
          {isAllSelected ? (
            <Globe className="w-3.5 h-3.5 text-gov-600 shrink-0" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          )}
          <span className="truncate">{selectedDisplay}</span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gov-700' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu with Search & Custom Scroll */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1.5 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100`}
          role="listbox"
        >
          {/* Header & Search Box */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search state or UT..."
                className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-gov-700 focus:border-gov-700"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable States List */}
          <div className="max-h-64 sm:max-h-72 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-slate-50">
            {/* "All States" Option */}
            {showAllOption && (!searchTerm || 'all states'.includes(searchTerm.toLowerCase())) && (
              <button
                type="button"
                role="option"
                aria-selected={isAllSelected}
                onClick={() => handleSelect('ALL')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                  isAllSelected
                    ? 'bg-gov-50 text-gov-800 font-bold border border-gov-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${isAllSelected ? 'bg-gov-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    <Globe className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="block">{allLabel}</span>
                    <span className="text-[10px] text-slate-400 font-normal">National Portfolio Overview</span>
                  </div>
                </div>
                {isAllSelected && <Check className="w-4 h-4 text-gov-700 shrink-0" />}
              </button>
            )}

            {/* List of All Indian States */}
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => {
                const isSelected = value?.toLowerCase() === state.toLowerCase();
                const projectCount = stateProjectCounts[state.toLowerCase()];

                return (
                  <button
                    key={state}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(state)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-gov-50 text-gov-800 font-bold border border-gov-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-gov-700' : 'text-slate-400'}`} />
                      <span className="truncate">{state}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {projectCount !== undefined && projectCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium">
                          {projectCount}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-gov-700 shrink-0 ml-1" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching state found for "{searchTerm}"
              </div>
            )}
          </div>

          {/* Footer showing count */}
          <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-400">
            <span>{ALL_INDIAN_STATES.length} States & UTs</span>
            <span>Scroll for all options</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateSelectDropdown;
