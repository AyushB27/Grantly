import React from 'react';
import type { EnrichedScholarship } from '../../hooks/useScholarships';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { formatCurrency, getDeadlineUrgency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import {
  GraduationCap,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: EnrichedScholarship;
  onOpenDetails: (scholarship: EnrichedScholarship) => void;
  onOpenWorkspace: (scholarshipId: string) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onOpenDetails,
  onOpenWorkspace,
}) => {
  const {
    comparisonIds,
    toggleComparison,
    trackedApplications,
    setApplicationStage,
  } = useScholarshipContext();

  const isCompared = comparisonIds.includes(scholarship.id);
  const trackedApp = trackedApplications.find((app) => app.scholarshipId === scholarship.id);
  const urgency = getDeadlineUrgency(scholarship.deadline);

  // Match score visual variant
  const getMatchStyles = (score: number) => {
    if (score >= 85) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        barBg: 'bg-emerald-600',
        label: 'Top Match',
      };
    }
    if (score >= 70) {
      return {
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-300',
        barBg: 'bg-blue-600',
        label: 'Strong Match',
      };
    }
    return {
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
      barBg: 'bg-slate-500',
      label: 'Moderate Match',
    };
  };

  const matchStyles = getMatchStyles(scholarship.matchScore);

  return (
    <article
      aria-labelledby={`grant-title-${scholarship.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500"
    >
      {/* Top Header Strip: Provider & Match Index */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {scholarship.provider}
            </span>
            <h3
              id={`grant-title-${scholarship.id}`}
              className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-0.5"
            >
              {scholarship.title}
            </h3>
          </div>

          {/* Match Score Badge */}
          <div
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-extrabold ${matchStyles.badgeBg}`}
            title={`Suitability Index: ${scholarship.matchScore}% - ${matchStyles.label}`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{scholarship.matchScore}% Match</span>
          </div>
        </div>

        {/* Award Amount & Renewable Status */}
        <div className="flex items-baseline gap-2 mt-3 mb-3">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(scholarship.amount)}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {scholarship.awardType}
          </span>
          {scholarship.renewable && (
            <span className="ml-auto inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Renewable
            </span>
          )}
        </div>

        {/* Plain-English summary excerpt */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {scholarship.plainEnglishSummary}
        </p>

        {/* Quick Requirement Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            Min GPA {scholarship.minGpa.toFixed(1)}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border font-medium ${urgency.badgeBg}`}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {urgency.label}
          </span>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {scholarship.categories.slice(0, 3).map((cat) => (
            <Badge key={cat} category={cat}>
              {cat}
            </Badge>
          ))}
          {scholarship.categories.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{scholarship.categories.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Compare toggle */}
          <button
            type="button"
            onClick={() => toggleComparison(scholarship.id)}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
              isCompared
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Compare with other scholarships"
            aria-label={`${isCompared ? 'Remove' : 'Add'} ${scholarship.title} to comparison`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* Quick Track/Bookmark Status */}
          {trackedApp ? (
            <button
              type="button"
              onClick={() => onOpenWorkspace(scholarship.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100"
              aria-label={`Open application workspace for ${scholarship.title}. Status: ${trackedApp.stage}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="capitalize">{trackedApp.stage.replace('_', ' ')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setApplicationStage(scholarship.id, 'bookmarked')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
              aria-label={`Bookmark ${scholarship.title}`}
            >
              + Track
            </button>
          )}
        </div>

        {/* View Details Primary Trigger */}
        <button
          type="button"
          onClick={() => onOpenDetails(scholarship)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs focus:ring-2 focus:ring-indigo-500"
          aria-label={`Understand options and view full breakdown for ${scholarship.title}`}
        >
          <span>Understand</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
