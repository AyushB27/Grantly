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

  // Match score visual styling in dark theme
  const getMatchBadge = (score: number) => {
    if (score >= 85) {
      return {
        bg: 'bg-[#a9f46b]/15 text-[#a9f46b] border-[#a9f46b]/40',
        label: 'High Match',
      };
    }
    if (score >= 70) {
      return {
        bg: 'bg-[#70b4ff]/15 text-[#70b4ff] border-[#70b4ff]/40',
        label: 'Good Match',
      };
    }
    return {
      bg: 'bg-[#f7ba53]/15 text-[#f7ba53] border-[#f7ba53]/40',
      label: 'Fair Match',
    };
  };

  const matchBadge = getMatchBadge(scholarship.matchScore);

  return (
    <article
      aria-labelledby={`grant-title-${scholarship.id}`}
      className="bg-[#101313] rounded-2xl border border-[#222827] hover:border-[#38423f] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group focus-within:ring-2 focus-within:ring-[#a9f46b]"
    >
      <div className="p-5 pb-0">
        {/* Top Header: Provider, Verification & Match Gauge */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="eyebrow text-[#89918c]">
                {scholarship.provider} • {scholarship.organizationType}
              </span>
              {scholarship.verifiedSource && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-[#a9f46b] bg-[#a9f46b]/10 border border-[#a9f46b]/30 px-1.5 py-0.2 rounded">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  VERIFIED
                </span>
              )}
            </div>

            <h3
              id={`grant-title-${scholarship.id}`}
              onClick={() => onOpenDetails(scholarship)}
              className="font-bold text-base text-[#edf1ec] group-hover:text-[#a9f46b] transition-colors line-clamp-2 leading-snug cursor-pointer"
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
          <span className="text-2xl font-bold font-mono text-[#edf1ec] tracking-tight">
            {formatCurrency(scholarship.amount)}
          </span>
          <span className="text-xs font-mono text-[#89918c]">
            / {scholarship.awardType}
          </span>
          {scholarship.renewable && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-[#a9f46b] bg-[#a9f46b]/10 px-2 py-0.5 rounded-full border border-[#a9f46b]/20">
              <Repeat className="w-2.5 h-2.5" />
              Renewable
            </span>
          )}
        </div>

        {/* F2 Mandatory "Why you match" Line */}
        <div className="p-3 bg-[#141818] rounded-xl border border-[#222827] mb-3 flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-[#a9f46b] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="eyebrow text-[#a9f46b] block text-[9px]">WHY YOU MATCH</span>
            <p className="text-xs text-[#edf1ec] leading-relaxed line-clamp-2">
              {scholarship.matchBreakdown?.whyYouMatchLine || scholarship.whyYouMatchSummary}
            </p>
          </div>
        </div>

        {/* Key Metrics Chips (Effort, CGPA, Deadline) */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] font-mono text-[#89918c]">
          <span className="inline-flex items-center gap-1 bg-[#141818] border border-[#222827] px-2 py-0.5 rounded-lg text-[#edf1ec]">
            <GraduationCap className="w-3 h-3 text-[#70b4ff]" aria-hidden="true" />
            <span>Min {scholarship.minCgpa.toFixed(1)} CGPA</span>
          </span>

          <span className="inline-flex items-center gap-1 bg-[#141818] border border-[#222827] px-2 py-0.5 rounded-lg text-[#edf1ec]">
            <Clock className="w-3 h-3 text-[#a9f46b]" aria-hidden="true" />
            <span>{scholarship.effortEstimate}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-semibold ${
              urgency.isUrgent
                ? 'bg-[#f7ba53]/15 text-[#f7ba53] border-[#f7ba53]/30'
                : 'bg-[#141818] text-[#89918c] border-[#222827]'
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
            <span className="text-[10px] text-[#525c57] self-center font-mono">
              +{scholarship.categories.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3 bg-[#131717] border-t border-[#222827] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Compare toggle */}
          <button
            type="button"
            onClick={() => toggleComparison(scholarship.id)}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isCompared
                ? 'bg-[#a9f46b] text-[#090b0b] border-[#a9f46b]'
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
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#a9f46b] bg-[#a9f46b]/10 border border-[#a9f46b]/30 hover:bg-[#a9f46b]/20 transition-colors"
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
              <BookmarkPlus className="w-3.5 h-3.5 text-[#89918c]" />
              <span>Track</span>
            </button>
          )}
        </div>

        {/* View Details Primary Trigger */}
        <button
          type="button"
          onClick={() => onOpenDetails(scholarship)}
          className="btn-mint inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold"
          aria-label={`Understand options and view full breakdown for ${scholarship.title}`}
        >
          <span>Understand</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
