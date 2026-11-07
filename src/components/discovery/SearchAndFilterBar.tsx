import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { Search, X, ArrowUpDown, RotateCcw } from 'lucide-react';
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
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="scholarship-search"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            placeholder="Search by scheme name, Reliance, Tata, NSP, PMRF, B.Tech, MBBS..."
            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs transition-all"
            aria-label="Search scholarships"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => updateFilters({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
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
            className="px-3.5 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer max-w-[200px]"
            aria-label="Filter by academic level"
          >
            <option value="All">All Education Levels</option>
            <option value="Class 11-12">Class 11-12</option>
            <option value="Undergraduate (B.Tech / B.Sc / B.Com / MBBS)">Undergraduate (B.Tech/MBBS)</option>
            <option value="Postgraduate (M.Tech / M.Sc / MBA)">Postgraduate (M.Tech/MBA)</option>
            <option value="PhD / Doctoral Research">PhD / PMRF Research</option>
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
              className="px-3.5 py-3 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs pr-8 cursor-pointer"
              aria-label="Sort scholarships"
            >
              <option value="match">Best Match Score</option>
              <option value="deadline">Soonest Deadline</option>
              <option value="amount_desc">Highest Award (₹)</option>
              <option value="amount_asc">Lowest Award (₹)</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills & Quick Filters */}
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs scale-102'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Checkbox Toggles & Reset */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 select-none">
            <input
              type="checkbox"
              checked={filters.onlyRenewable}
              onChange={(e) => updateFilters({ onlyRenewable: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500 accent-indigo-600"
              aria-label="Show renewable scholarships only"
            />
            <span>Renewable (Annual)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 select-none">
            <input
              type="checkbox"
              checked={filters.onlyEligible}
              onChange={(e) => updateFilters({ onlyEligible: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500 accent-indigo-600"
              aria-label="Filter to high eligibility matches (75% or above)"
            />
            <span>High Match (≥75%)</span>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-200/60"
            title="Reset active search & filters"
            aria-label="Reset all search and filter criteria"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Dynamic Results Counter with aria-live */}
      <div className="flex items-center justify-between pt-2 pb-1 text-xs text-slate-500 border-b border-slate-200/70">
        <p aria-live="polite" role="status" className="font-semibold text-slate-700">
          Showing <span className="font-extrabold text-indigo-600">{totalResults}</span> verified scholarship schemes
        </p>
        <span className="text-[11px] text-slate-600">
          Ranked by CGPA, income limit, and reservation entitlement
        </span>
      </div>
    </aside>
  );
};
