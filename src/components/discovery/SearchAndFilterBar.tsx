import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { Search, X, ArrowUpDown, RotateCcw, Zap } from 'lucide-react';
import type { CategoryTag } from '../../types/scholarship';
import { sanitizeInput } from '../../utils/security';

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

/**
 * Interactive search, sort, and multi-facet filtering bar
 */
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
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="scholarship-search"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: sanitizeInput(e.target.value) })}
            placeholder="Search by scheme name, Reliance, Tata, NSP, PMRF, B.Tech, MBBS..."
            className="w-full pl-11 pr-10 py-3 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all shadow-xs"
            aria-label="Search scholarships"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => updateFilters({ searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none cursor-pointer"
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
            className="px-3.5 py-3 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-2xl text-xs sm:text-sm font-semibold text-[var(--text-primary)] outline-none cursor-pointer max-w-[210px] shadow-xs"
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
              className="px-3.5 py-3 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-2xl text-xs sm:text-sm font-semibold text-[var(--text-primary)] outline-none pr-8 cursor-pointer shadow-xs"
              aria-label="Sort scholarships"
            >
              <option value="match">Best Match Score</option>
              <option value="deadline">Soonest Deadline</option>
              <option value="amount_desc">Highest Award (₹)</option>
              <option value="amount_asc">Lowest Award (₹)</option>
              <option value="effort">Lowest Effort Time</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-3 top-4 pointer-events-none" />
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
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-card)] hover:border-emerald-500/40 hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Checkbox Toggles & Reset */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-secondary)]">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 select-none">
            <input
              type="checkbox"
              checked={filters.onlyRenewable}
              onChange={(e) => updateFilters({ onlyRenewable: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              aria-label="Show renewable scholarships only"
            />
            <span>Renewable</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 select-none">
            <input
              type="checkbox"
              checked={filters.onlyEligible}
              onChange={(e) => updateFilters({ onlyEligible: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              aria-label="Filter to high eligibility matches (75% or above)"
            />
            <span>High Match (≥75%)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 select-none">
            <input
              type="checkbox"
              checked={filters.onlyAlmostEligible}
              onChange={(e) => updateFilters({ onlyAlmostEligible: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              aria-label="Filter to almost eligible opportunities"
            />
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Almost Eligible (Gap Match)</span>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] cursor-pointer shadow-xs"
            title="Reset active search & filters"
            aria-label="Reset all search and filter criteria"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Dynamic Results Counter with aria-live */}
      <div className="flex items-center justify-between pt-2 pb-1 text-xs text-[var(--text-secondary)] border-b border-[var(--border-card)]">
        <p aria-live="polite" role="status" className="font-mono">
          Showing <span className="font-bold text-emerald-700 dark:text-emerald-400">{totalResults}</span> verified scholarship schemes
        </p>
        <span className="text-[11px] font-mono text-[var(--text-muted)] hidden sm:inline-flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Instant deterministic match against your profile
        </span>
      </div>
    </aside>
  );
};
