import React from 'react';
import type { EnrichedScholarship } from '../../hooks/useScholarships';
import { ScholarshipCard } from './ScholarshipCard';
import { SearchX, RotateCcw } from 'lucide-react';
import { useScholarshipContext } from '../../context/ScholarshipContext';

interface ScholarshipGridProps {
  scholarships: EnrichedScholarship[];
  onOpenDetails: (scholarship: EnrichedScholarship) => void;
  onOpenWorkspace: (scholarshipId: string) => void;
}

/**
 * Responsive grid container rendering personalized scholarship cards with empty state recovery
 */
export const ScholarshipGrid: React.FC<ScholarshipGridProps> = ({
  scholarships,
  onOpenDetails,
  onOpenWorkspace,
}) => {
  const { resetFilters } = useScholarshipContext();

  if (scholarships.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-card)] p-12 text-center my-8 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[var(--bg-card-hover)] border border-[var(--border-card)] flex items-center justify-center text-[var(--text-muted)] mx-auto mb-4">
          <SearchX className="w-8 h-8" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">No Scholarships Match Your Criteria</h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
          Try loosening your GPA threshold, broadening your academic level, or resetting your search keywords.
        </p>
        <button
          type="button"
          onClick={resetFilters}
          className="btn-mint inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          aria-label="Reset all filters and restore full scholarship catalog"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="region"
      aria-label="Scholarship Opportunities List"
    >
      {scholarships.map((scholarship) => (
        <ScholarshipCard
          key={scholarship.id}
          scholarship={scholarship}
          onOpenDetails={onOpenDetails}
          onOpenWorkspace={onOpenWorkspace}
        />
      ))}
    </div>
  );
};
