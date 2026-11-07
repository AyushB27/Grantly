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
  ShieldCheck,
  Zap,
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

  // Match score visual styling with dual-theme contrast
  const getMatchBadge = (score: number) => {
    if (score >= 85) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/40',
        label: 'High Match',
      };
    }
    if (score >= 70) {
      return {
        bg: 'bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/40',
        label: 'Good Match',
      };
    }
    return {
      bg: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/40',
      label: 'Fair Match',
    };
  };

  const matchBadge = getMatchBadge(scholarship.matchScore);

  return (
    <article
      aria-labelledby={`grant-title-${scholarship.id}`}
      className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-card)] hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group focus-within:ring-2 focus-within:ring-emerald-500 shadow-xs"
    >
      <div className="p-5 pb-0">
        {/* Top Header: Provider, Verification & Match Gauge */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="eyebrow text-[var(--text-muted)]">
                {scholarship.provider} • {scholarship.organizationType}
              </span>
              {scholarship.verifiedSource && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-1.5 py-0.2 rounded font-semibold">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  VERIFIED
                </span>
              )}
            </div>

            <h3
              id={`grant-title-${scholarship.id}`}
              onClick={() => onOpenDetails(scholarship)}
              className="font-bold text-base text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug cursor-pointer"
            >
              {scholarship.title}
            </h3>
          </div>

          {/* Match Score Badge */}
          <div
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${matchBadge.bg}`}
            title={`Algorithmic Match Score: ${scholarship.matchScore}%`}
          >
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            <span>{scholarship.matchScore}%</span>
          </div>
        </div>

        {/* Award Amount & Terms */}
        <div className="flex flex-wrap items-baseline gap-2 mt-2.5 mb-3">
          <span className="text-2xl font-bold font-mono text-[var(--text-primary)] tracking-tight">
            {formatCurrency(scholarship.amount)}
          </span>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            / {scholarship.awardType}
          </span>
          {scholarship.renewable && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
              <Repeat className="w-2.5 h-2.5" />
              Renewable
            </span>
          )}
        </div>

        {/* Mandatory "Why you match" Line */}
        <div className="p-3 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-card)] mb-3 flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="eyebrow text-emerald-700 dark:text-emerald-400 block text-[9px]">WHY YOU MATCH</span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
              {scholarship.matchBreakdown?.whyYouMatchLine || scholarship.whyYouMatchSummary}
            </p>
          </div>
        </div>

        {/* Key Metrics Chips (Effort, CGPA, Deadline) */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1 bg-[var(--bg-card-hover)] border border-[var(--border-card)] px-2 py-0.5 rounded-lg text-[var(--text-secondary)] font-medium">
            <GraduationCap className="w-3 h-3 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <span>Min {scholarship.minCgpa.toFixed(1)} CGPA</span>
          </span>

          <span className="inline-flex items-center gap-1 bg-[var(--bg-card-hover)] border border-[var(--border-card)] px-2 py-0.5 rounded-lg text-[var(--text-secondary)] font-medium">
            <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>{scholarship.effortEstimate}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-semibold ${
              urgency.isUrgent
                ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                : 'bg-[var(--bg-card-hover)] text-[var(--text-muted)] border border-[var(--border-card)]'
            }`}
          >
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
            <span className="text-[10px] text-[var(--text-muted)] self-center font-mono">
              +{scholarship.categories.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3 bg-[var(--bg-card-hover)] border-t border-[var(--border-card)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Compare toggle */}
          <button
            type="button"
            onClick={() => toggleComparison(scholarship.id)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isCompared
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 border-emerald-600 dark:border-emerald-500 shadow-xs'
                : 'btn-panel'
            }`}
            title="Compare up to 3 grants side-by-side"
            aria-label={`${isCompared ? 'Remove' : 'Add'} ${scholarship.title} to comparison drawer`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* Quick Track Status */}
          {trackedApp ? (
            <button
              type="button"
              onClick={() => onOpenWorkspace(scholarship.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-colors"
              aria-label={`Open application workspace for ${scholarship.title}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="capitalize">{trackedApp.stage.replace('_', ' ')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setApplicationStage(scholarship.id, 'saved')}
              className="btn-panel px-2.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1"
              aria-label={`Bookmark ${scholarship.title}`}
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Track</span>
            </button>
          )}
        </div>

        {/* View Details Primary Trigger */}
        <button
          type="button"
          onClick={() => onOpenDetails(scholarship)}
          className="btn-mint inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
          aria-label={`Understand options and view full breakdown for ${scholarship.title}`}
        >
          <span>Understand</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
