import React, { useState } from 'react';
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

export const DeadlinesRadarView: React.FC<DeadlinesRadarViewProps> = ({
  onOpenDetails,
  onOpenWorkspace,
}) => {
  const { trackedApplications, setApplicationStage } = useScholarshipContext();
  const { allEnriched } = useScholarships();

  const [filterMode, setFilterMode] = useState<'all' | 'tracked'>('all');

  const trackedIds = new Set(trackedApplications.map((a) => a.scholarshipId));

  const listToDisplay =
    filterMode === 'tracked'
      ? allEnriched.filter((s) => trackedIds.has(s.id))
      : allEnriched;

  // Partition into 3 categories: Overdue, This Week, Later
  const overdueList: EnrichedScholarship[] = [];
  const thisWeekList: EnrichedScholarship[] = [];
  const laterList: EnrichedScholarship[] = [];

  listToDisplay.forEach((s) => {
    const urgency = getDeadlineUrgency(s.deadline);
    if (urgency.daysRemaining < 0) {
      overdueList.push(s);
    } else if (urgency.daysRemaining <= 7) {
      thisWeekList.push(s);
    } else {
      laterList.push(s);
    }
  });

  // Sort each partition by deadline ascending
  const sortByDate = (a: EnrichedScholarship, b: EnrichedScholarship) =>
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime();

  overdueList.sort(sortByDate);
  thisWeekList.sort(sortByDate);
  laterList.sort(sortByDate);

  const renderScholarshipDeadlineCard = (
    scholarship: EnrichedScholarship,
    category: 'overdue' | 'this_week' | 'later'
  ) => {
    const urgency = getDeadlineUrgency(scholarship.deadline);
    const isTracked = trackedIds.has(scholarship.id);

    const borderStyle =
      category === 'this_week'
        ? 'border-[#f7ba53]/40 bg-[#121614]'
        : category === 'overdue'
        ? 'border-[#ff8e91]/30 bg-[#101313]'
        : 'border-[#222827] bg-[#101313]';

    const pillStyle =
      category === 'this_week'
        ? 'bg-[#f7ba53]/15 text-[#f7ba53] border-[#f7ba53]/30'
        : category === 'overdue'
        ? 'bg-[#ff8e91]/15 text-[#ff8e91] border-[#ff8e91]/30'
        : 'bg-[#a9f46b]/15 text-[#a9f46b] border-[#a9f46b]/30';

    return (
      <article
        key={scholarship.id}
        className={`p-4 sm:p-5 rounded-2xl border transition-all hover:border-[#38423f] flex flex-col justify-between gap-4 ${borderStyle}`}
        aria-labelledby={`deadline-title-${scholarship.id}`}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <span className="eyebrow text-[#89918c] block text-[9px]">
              {scholarship.provider} • {scholarship.organizationType}
            </span>
            <div
              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border flex items-center gap-1 shrink-0 ${pillStyle}`}
            >
              <Clock className="w-3 h-3" />
              <span>{urgency.label}</span>
            </div>
          </div>

          <h3
            id={`deadline-title-${scholarship.id}`}
            onClick={() => onOpenDetails(scholarship)}
            className="text-sm sm:text-base font-bold text-[#edf1ec] hover:text-[#a9f46b] transition-colors cursor-pointer line-clamp-1"
          >
            {scholarship.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-bold text-[#edf1ec]">
              {formatCurrency(scholarship.amount)}
            </span>
            <span className="text-[#525c57]">•</span>
            <span className="font-mono text-[#a9f46b]">{scholarship.matchScore}% Match</span>
            <span className="text-[#525c57]">•</span>
            <span className="text-[#89918c]">{scholarship.effortEstimate}</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-[#222827] flex items-center justify-between gap-2 text-xs">
          <span className="font-mono text-[11px] text-[#89918c] flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#70b4ff]" />
            <span>Target: {scholarship.deadline}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {isTracked ? (
              <button
                type="button"
                onClick={() => onOpenWorkspace(scholarship.id)}
                className="btn-panel px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#a9f46b]"
              >
                In Pipeline
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setApplicationStage(scholarship.id, 'saved')}
                className="btn-panel px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#89918c] hover:text-[#edf1ec]"
              >
                + Track
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenDetails(scholarship)}
              className="btn-mint px-3 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section aria-label="Deadlines Radar and Timeline" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ff8e91]/10 via-[#f7ba53]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-[#f7ba53]">F7 CORE CAPABILITY</span>
            <span className="text-[#525c57]">•</span>
            <span className="eyebrow text-[#89918c]">DEADLINES RADAR</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#edf1ec] tracking-tight">
            Urgency Timeline & Deadlines Radar
          </h1>

          <p className="text-sm text-[#89918c] leading-relaxed">
            Never miss an educational grant due to buried dates. Partitioned transparently into
            urgent (this week), upcoming, and archived schemes with live countdown indicators.
          </p>

          {/* Filter Toggle Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                filterMode === 'all'
                  ? 'bg-[#a9f46b] text-[#090b0b]'
                  : 'bg-[#141818] border border-[#222827] text-[#89918c] hover:text-[#edf1ec]'
              }`}
            >
              All Catalog Grants ({allEnriched.length})
            </button>

            <button
              onClick={() => setFilterMode('tracked')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-colors ${
                filterMode === 'tracked'
                  ? 'bg-[#a9f46b] text-[#090b0b]'
                  : 'bg-[#141818] border border-[#222827] text-[#89918c] hover:text-[#edf1ec]'
              }`}
            >
              My Tracked Pipeline ({trackedApplications.length})
            </button>
          </div>
        </div>
      </div>

      {/* 1. THIS WEEK / CRITICAL URGENCY */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-[#222827]">
          <Flame className="w-4 h-4 text-[#f7ba53]" />
          <span className="eyebrow text-[#f7ba53]">THIS WEEK — HIGH URGENCY ({thisWeekList.length})</span>
        </div>

        {thisWeekList.length === 0 ? (
          <div className="p-4 bg-[#101313] border border-[#222827] rounded-xl text-xs text-[#89918c]">
            No deadlines closing within the next 7 days in this view.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {thisWeekList.map((s) => renderScholarshipDeadlineCard(s, 'this_week'))}
          </div>
        )}
      </div>

      {/* 2. LATER / UPCOMING DEADLINES */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-2 pb-1 border-b border-[#222827]">
          <Calendar className="w-4 h-4 text-[#a9f46b]" />
          <span className="eyebrow text-[#a9f46b]">LATER / UPCOMING PORTALS ({laterList.length})</span>
        </div>

        {laterList.length === 0 ? (
          <div className="p-4 bg-[#101313] border border-[#222827] rounded-xl text-xs text-[#89918c]">
            No future deadlines found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {laterList.map((s) => renderScholarshipDeadlineCard(s, 'later'))}
          </div>
        )}
      </div>

      {/* 3. OVERDUE / ARCHIVED */}
      {overdueList.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 pb-1 border-b border-[#222827]">
            <AlertTriangle className="w-4 h-4 text-[#ff8e91]" />
            <span className="eyebrow text-[#ff8e91]">OVERDUE / CLOSED PORTALS ({overdueList.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueList.map((s) => renderScholarshipDeadlineCard(s, 'overdue'))}
          </div>
        </div>
      )}
    </section>
  );
};
