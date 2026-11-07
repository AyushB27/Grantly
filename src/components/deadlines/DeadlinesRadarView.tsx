import React, { useState, useMemo, useCallback } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { useScholarships } from '../../hooks/useScholarships';
import type { EnrichedScholarship } from '../../hooks/useScholarships';
import { formatCurrency, getDeadlineUrgency } from '../../utils/formatters';
import {
  Calendar,
  Clock,
  AlertTriangle,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface DeadlinesRadarViewProps {
  onOpenDetails: (scholarship: EnrichedScholarship) => void;
  onOpenWorkspace: (scholarshipId: string) => void;
}

interface DeadlineRowCardProps {
  scholarship: EnrichedScholarship;
  category: 'overdue' | 'this_week' | 'later';
  isTracked: boolean;
  onOpenDetails: (scholarship: EnrichedScholarship) => void;
  onOpenWorkspace: (scholarshipId: string) => void;
  onTrack: (scholarshipId: string) => void;
}

const DeadlineRowCard = React.memo<DeadlineRowCardProps>(({
  scholarship,
  category,
  isTracked,
  onOpenDetails,
  onOpenWorkspace,
  onTrack,
}) => {
  const urgency = getDeadlineUrgency(scholarship.deadline);

  const borderStyle =
    category === 'this_week'
      ? 'border-amber-300 dark:border-amber-500/40 bg-[var(--bg-card)]'
      : category === 'overdue'
      ? 'border-red-200 dark:border-red-500/30 bg-[var(--bg-card)]'
      : 'border-[var(--border-card)] bg-[var(--bg-card)]';

  const pillStyle =
    category === 'this_week'
      ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
      : category === 'overdue'
      ? 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'
      : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';

  return (
    <article
      className={`p-4 sm:p-5 rounded-2xl border transition-all hover:border-emerald-500/40 flex flex-col justify-between gap-4 shadow-xs ${borderStyle}`}
      aria-labelledby={`deadline-title-${scholarship.id}`}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="eyebrow text-[var(--text-muted)] block text-[9px]">
            {scholarship.provider} • {scholarship.organizationType}
          </span>
          <div
            className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border flex items-center gap-1 shrink-0 ${pillStyle}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{urgency.label}</span>
          </div>
        </div>

        <h3
          id={`deadline-title-${scholarship.id}`}
          onClick={() => onOpenDetails(scholarship)}
          className="text-sm sm:text-base font-bold text-[var(--text-primary)] hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
        >
          {scholarship.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono font-bold text-[var(--text-primary)]">
            {formatCurrency(scholarship.amount)}
          </span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">{scholarship.matchScore}% Match</span>
          <span className="text-[var(--text-muted)]">•</span>
          <span className="text-[var(--text-secondary)]">{scholarship.effortEstimate}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-[var(--border-card)] flex items-center justify-between gap-2 text-xs">
        <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Deadline: {scholarship.deadline}</span>
        </span>

        <div className="flex items-center gap-2">
          {isTracked ? (
            <button
              type="button"
              onClick={() => onOpenWorkspace(scholarship.id)}
              className="btn-panel px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 cursor-pointer shadow-xs"
              title="Open application checklist and workspace"
            >
              ✓ Checklist
            </button>
          ) : (
            <button
              onClick={() => onTrack(scholarship.id)}
              className="btn-panel px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer"
            >
              Track
            </button>
          )}

          <button
            onClick={() => onOpenDetails(scholarship)}
            className="btn-mint px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
});
DeadlineRowCard.displayName = 'DeadlineRowCard';

/**
 * Deadlines radar view partitioned into overdue, closing this week, and upcoming portals
 */
export const DeadlinesRadarView: React.FC<DeadlinesRadarViewProps> = ({
  onOpenDetails,
  onOpenWorkspace,
}) => {
  const { trackedApplications, setApplicationStage } = useScholarshipContext();
  const { allEnriched } = useScholarships();

  const [filterMode, setFilterMode] = useState<'all' | 'tracked'>('all');

  const trackedIds = useMemo(
    () => new Set(trackedApplications.map((a) => a.scholarshipId)),
    [trackedApplications]
  );

  const handleTrack = useCallback(
    (scholarshipId: string) => {
      setApplicationStage(scholarshipId, 'saved');
    },
    [setApplicationStage]
  );

  const { overdueList, thisWeekList, laterList } = useMemo(() => {
    const listToDisplay =
      filterMode === 'tracked'
        ? allEnriched.filter((s) => trackedIds.has(s.id))
        : allEnriched;

    const overdue: EnrichedScholarship[] = [];
    const thisWeek: EnrichedScholarship[] = [];
    const later: EnrichedScholarship[] = [];

    listToDisplay.forEach((s) => {
      const urgency = getDeadlineUrgency(s.deadline);
      if (urgency.daysRemaining < 0) {
        overdue.push(s);
      } else if (urgency.daysRemaining <= 7) {
        thisWeek.push(s);
      } else {
        later.push(s);
      }
    });

    const sortByDate = (a: EnrichedScholarship, b: EnrichedScholarship) =>
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime();

    overdue.sort(sortByDate);
    thisWeek.sort(sortByDate);
    later.sort(sortByDate);

    return { overdueList: overdue, thisWeekList: thisWeek, laterList: later };
  }, [allEnriched, filterMode, trackedIds]);

  return (
    <section aria-label="Deadlines Radar and Timeline" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-amber-600 dark:text-amber-400">URGENCY RADAR</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="eyebrow text-[var(--text-muted)]">DEADLINES RADAR</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Urgency Timeline & Deadlines Radar
          </h2>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Never miss an educational grant due to buried dates. Partitioned transparently into
            urgent (this week), upcoming, and archived schemes with live countdown indicators.
          </p>

          {/* Filter Toggle Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              All Catalog Grants ({allEnriched.length})
            </button>

            <button
              onClick={() => setFilterMode('tracked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                filterMode === 'tracked'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              My Tracked Applications ({trackedApplications.length})
            </button>
          </div>
        </div>
      </div>

      {/* 1. THIS WEEK / CRITICAL URGENCY */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-card)]">
          <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="eyebrow text-amber-700 dark:text-amber-400">THIS WEEK — HIGH URGENCY ({thisWeekList.length})</span>
        </div>

        {thisWeekList.length === 0 ? (
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-xs text-[var(--text-secondary)] shadow-xs">
            No deadlines closing within the next 7 days in this view.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {thisWeekList.map((s) => (
              <DeadlineRowCard
                key={s.id}
                scholarship={s}
                category="this_week"
                isTracked={trackedIds.has(s.id)}
                onOpenDetails={onOpenDetails}
                onOpenWorkspace={onOpenWorkspace}
                onTrack={handleTrack}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. LATER / UPCOMING DEADLINES */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-card)]">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="eyebrow text-emerald-700 dark:text-emerald-400">LATER / UPCOMING PORTALS ({laterList.length})</span>
        </div>

        {laterList.length === 0 ? (
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-xs text-[var(--text-secondary)] shadow-xs">
            No future deadlines found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {laterList.map((s) => (
              <DeadlineRowCard
                key={s.id}
                scholarship={s}
                category="later"
                isTracked={trackedIds.has(s.id)}
                onOpenDetails={onOpenDetails}
                onOpenWorkspace={onOpenWorkspace}
                onTrack={handleTrack}
              />
            ))}
          </div>
        )}
      </div>

      {/* 3. OVERDUE / ARCHIVED */}
      {overdueList.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 pb-1 border-b border-[var(--border-card)]">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="eyebrow text-red-700 dark:text-red-400">OVERDUE / CLOSED PORTALS ({overdueList.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueList.map((s) => (
              <DeadlineRowCard
                key={s.id}
                scholarship={s}
                category="overdue"
                isTracked={trackedIds.has(s.id)}
                onOpenDetails={onOpenDetails}
                onOpenWorkspace={onOpenWorkspace}
                onTrack={handleTrack}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
