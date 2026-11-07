import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { Search, X, ArrowUpDown, RotateCcw, Zap } from 'lucide-react';
import type { CategoryTag } from '../../types/scholarship';

interface SearchAndFilterBarProps {
  totalResults: number;
}

const CATEGORIES: ('All' | CategoryTag)[] = [
  'All',
  'STEM',
  'Need-Based (EWS)',
  'Merit-Based',
  'Women in Tech',
  'SC / ST / OBC',
  'First-Generation Learner',
  'Healthcare & Medical',
  'Single Girl Child',
];

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({ totalResults }) => {
  const { filters, updateFilters, resetFilters } = useScholarshipContext();

  return (
    <aside aria-label="Scholarship Filters" className="space-y-4 mb-8">
      {/* Search Input & Sort Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <label htmlFor="scholarship-search" className="sr-only">
            Search scholarships by title, provider, branch or scheme
          </label>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#89918c]">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="scholarship-search"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            placeholder="Search by scheme name, Reliance, Tata, NSP, PMRF, B.Tech, MBBS..."
            className="w-full pl-11 pr-10 py-3 bg-[#101313] border border-[#222827] focus:border-[#a9f46b] focus:ring-1 focus:ring-[#a9f46b] rounded-2xl text-xs sm:text-sm text-[#edf1ec] placeholder:text-[#525c57] outline-none transition-all"
            aria-label="Search scholarships"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => updateFilters({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#89918c] hover:text-[#edf1ec] focus:outline-none"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Academic Level Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-academic-level" className="sr-only">
            Filter by academic level
          </label>
          <select
            id="filter-academic-level"
            value={filters.academicLevel}
            onChange={(e) => updateFilters({ academicLevel: e.target.value })}
            className="px-3.5 py-3 bg-[#101313] border border-[#222827] focus:border-[#a9f46b] rounded-2xl text-xs sm:text-sm font-semibold text-[#edf1ec] outline-none cursor-pointer max-w-[210px]"
            aria-label="Filter by academic level"
          >
            <option value="All">All Education Levels</option>
            <option value="Undergraduate">Undergraduate (B.Tech/MBBS)</option>
            <option value="Postgraduate">Postgraduate (M.Tech/MBA)</option>
            <option value="PhD / Research">PhD / PMRF Research</option>
            <option value="Class 11-12">Class 11-12</option>
          </select>

          {/* Sort Selector */}
          <label htmlFor="filter-sort-by" className="sr-only">
            Sort scholarships
          </label>
          <div className="relative">
            <select
              id="filter-sort-by"
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="px-3.5 py-3 bg-[#101313] border border-[#222827] focus:border-[#a9f46b] rounded-2xl text-xs sm:text-sm font-semibold text-[#edf1ec] outline-none pr-8 cursor-pointer"
              aria-label="Sort scholarships"
            >
              <option value="match">Best Match Score</option>
              <option value="deadline">Soonest Deadline</option>
              <option value="amount_desc">Highest Award (₹)</option>
              <option value="amount_asc">Lowest Award (₹)</option>
              <option value="effort">Lowest Effort Time</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[#89918c] absolute right-3 top-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills & Quick Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Category Pills */}
        <div
          role="radiogroup"
          aria-label="Filter by scholarship category"
          className="flex flex-wrap items-center gap-1.5"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateFilters({ category: cat })}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-[#a9f46b] text-[#090b0b] font-bold'
                    : 'bg-[#101313] text-[#89918c] border border-[#222827] hover:border-[#38423f] hover:text-[#edf1ec]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Checkbox Toggles & Reset */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#89918c]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#a9f46b] select-none">
            <input
              type="checkbox"
              checked={filters.onlyRenewable}
              onChange={(e) => updateFilters({ onlyRenewable: e.target.checked })}
              className="w-4 h-4 accent-[#a9f46b] rounded"
              aria-label="Show renewable scholarships only"
            />
            <span>Renewable</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#a9f46b] select-none">
            <input
              type="checkbox"
              checked={filters.onlyEligible}
              onChange={(e) => updateFilters({ onlyEligible: e.target.checked })}
              className="w-4 h-4 accent-[#a9f46b] rounded"
              aria-label="Filter to high eligibility matches (75% or above)"
            />
            <span>High Match (≥75%)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#f7ba53] select-none">
            <input
              type="checkbox"
              checked={filters.onlyAlmostEligible}
              onChange={(e) => updateFilters({ onlyAlmostEligible: e.target.checked })}
              className="w-4 h-4 accent-[#f7ba53] rounded"
              aria-label="Filter to almost eligible opportunities"
            />
            <span className="text-[#f7ba53]">Almost Eligible (F4)</span>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-[#89918c] hover:text-[#edf1ec] transition-colors px-2 py-1 rounded-lg hover:bg-[#141818] border border-transparent hover:border-[#222827]"
            title="Reset active search & filters"
            aria-label="Reset all search and filter criteria"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Dynamic Results Counter with aria-live */}
      <div className="flex items-center justify-between pt-2 pb-1 text-xs text-[#89918c] border-b border-[#222827]">
        <p aria-live="polite" role="status" className="font-mono">
          Showing <span className="font-bold text-[#a9f46b]">{totalResults}</span> verified scholarship schemes
        </p>
        <span className="text-[11px] font-mono text-[#525c57] hidden sm:inline flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#a9f46b]" />
          Instant deterministic match against your profile
        </span>
      </div>
    </aside>
  );
};
