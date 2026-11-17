import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Filter } from 'lucide-react';

const FILTER_SECTIONS = [
  {
    key: 'domain',
    label: 'Industry / Domain',
    type: 'checkbox',
    options: ['FinTech', 'EdTech', 'AgriTech', 'HealthTech', 'AI/ML', 'CleanTech', 'SaaS'],
  },
  {
    key: 'fundingStage',
    label: 'Funding Stage',
    type: 'checkbox',
    options: ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'],
  },
  {
    key: 'location',
    label: 'Location (State)',
    type: 'checkbox',
    options: ['Rajasthan', 'Karnataka', 'Maharashtra', 'Delhi', 'Telangana', 'Gujarat', 'Tamil Nadu', 'Kerala'],
  },
  {
    key: 'status',
    label: 'Verification Status',
    type: 'radio',
    options: ['All', 'Approved', 'Pending', 'Rejected'],
  },
];

const FilterPanel = ({ filters = {}, onFilterChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState(
    FILTER_SECTIONS.reduce((acc, s) => ({ ...acc, [s.key]: true }), {})
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getActiveCount = (section) => {
    const val = filters[section.key];
    if (!val) return 0;
    if (section.type === 'radio') return val && val !== 'All' ? 1 : 0;
    if (Array.isArray(val)) return val.length;
    return 0;
  };

  const handleCheckboxChange = (sectionKey, option) => {
    const current = filters[sectionKey] || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onFilterChange(sectionKey, updated);
  };

  const handleRadioChange = (sectionKey, option) => {
    onFilterChange(sectionKey, option);
  };

  const totalActive = FILTER_SECTIONS.reduce((sum, s) => sum + getActiveCount(s), 0);

  const panelContent = (
    <div className="space-y-4">
      {FILTER_SECTIONS.map((section) => {
        const activeCount = getActiveCount(section);
        return (
          <div key={section.key} className="border-b border-gray-100 pb-4 last:border-b-0">
            <button
              onClick={() => toggleSection(section.key)}
              className="flex items-center justify-between w-full text-left font-medium text-gray-800 hover:text-gray-900 transition-colors duration-200"
            >
              <span className="flex items-center gap-2">
                {section.label}
                {activeCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                    {activeCount}
                  </span>
                )}
              </span>
              {expandedSections[section.key] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {expandedSections[section.key] && (
              <div className="mt-3 space-y-2 pl-1">
                {section.options.map((option) => {
                  if (section.type === 'radio') {
                    return (
                      <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                        <input
                          type="radio"
                          name={section.key}
                          checked={(filters[section.key] || 'All') === option}
                          onChange={() => handleRadioChange(section.key, option)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        />
                        {option}
                      </label>
                    );
                  }
                  const checked = (filters[section.key] || []).includes(option);
                  return (
                    <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxChange(section.key, option)}
                        className="h-4 w-4 rounded text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={onClearFilters}
        className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2 font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors duration-200"
      >
        <Filter className="h-4 w-4" />
        Clear All Filters
        {totalActive > 0 && (
          <span className="text-xs bg-amber-500 text-white rounded-full px-1.5 py-0.5">
            {totalActive}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors duration-200 w-full justify-center"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {mobileOpen ? 'Hide Filters' : 'Show Filters'}
          {totalActive > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 text-xs font-semibold text-white bg-blue-600 rounded-full">
              {totalActive}
            </span>
          )}
        </button>
      </div>

      {/* Desktop panel — always visible */}
      <aside className="hidden lg:block bg-white rounded-xl shadow-md p-5 w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          Filters
        </h3>
        {panelContent}
      </aside>

      {/* Mobile panel — toggled */}
      {mobileOpen && (
        <aside className="lg:hidden bg-white rounded-xl shadow-md p-5 mb-4">
          {panelContent}
        </aside>
      )}
    </>
  );
};

export default FilterPanel;
