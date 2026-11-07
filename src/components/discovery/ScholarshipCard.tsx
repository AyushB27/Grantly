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
  BookmarkPlus,
  Repeat,
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

  // Match score visual styling
  const getMatchBadge = (score: number) => {
    if (score >= 85) {
      return {
        bg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs',
        label: 'High Match',
      };
    }
    if (score >= 70) {
      return {
        bg: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs',
        label: 'Good Match',
      };
    }
    return {
      bg: 'bg-slate-100 text-slate-700 border border-slate-200',
      label: 'Fair Match',
    };
  };

  const matchBadge = getMatchBadge(scholarship.matchScore);

  return (
    <article
      aria-labelledby={`grant-title-${scholarship.id}`}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden group focus-within:ring-2 focus-within:ring-indigo-500"
    >
      <div className="p-5 pb-0">
        {/* Top Header: Provider & Match Gauge */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              {scholarship.provider} • {scholarship.organizationType}
            </span>
            <h3
              id={`grant-title-${scholarship.id}`}
              className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug"
            >
              {scholarship.title}
            </h3>
          </div>

          {/* Match Score Badge */}
          <div
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-tight ${matchBadge.bg}`}
            title={`Algorithmic Match Score: ${scholarship.matchScore}%`}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{scholarship.matchScore}% Match</span>
          </div>
        </div>

        {/* Award Amount & Terms */}
        <div className="flex flex-wrap items-baseline gap-2 mt-3 mb-3">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(scholarship.amount)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            / {scholarship.awardType}
          </span>
          {scholarship.renewable && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Repeat className="w-3 h-3" />
              Renewable
            </span>
          )}
        </div>

        {/* Plain-English summary excerpt */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
          {scholarship.plainEnglishSummary}
        </p>

        {/* Key Metrics Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-medium text-slate-600">
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span>Min GPA {scholarship.minGpa.toFixed(1)}</span>
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-semibold ${urgency.badgeBg}`}
          >
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{urgency.label}</span>
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
            <span className="text-[10px] text-slate-600 self-center font-medium">
              +{scholarship.categories.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Compare toggle */}
          <button
            type="button"
            onClick={() => toggleComparison(scholarship.id)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isCompared
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Compare up to 3 grants side-by-side"
            aria-label={`${isCompared ? 'Remove' : 'Add'} ${scholarship.title} to comparison drawer`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* Quick Track/Bookmark Status */}
          {trackedApp ? (
            <button
              type="button"
              onClick={() => onOpenWorkspace(scholarship.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
              aria-label={`Open application workspace for ${scholarship.title}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="capitalize">{trackedApp.stage.replace('_', ' ')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setApplicationStage(scholarship.id, 'bookmarked')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label={`Bookmark ${scholarship.title}`}
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>Track</span>
            </button>
          )}
        </div>

        {/* View Details Primary Trigger */}
        <button
          type="button"
          onClick={() => onOpenDetails(scholarship)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xs group-hover:shadow-md focus:ring-2 focus:ring-indigo-500"
          aria-label={`Understand options and view full breakdown for ${scholarship.title}`}
        >
          <span>Understand</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
