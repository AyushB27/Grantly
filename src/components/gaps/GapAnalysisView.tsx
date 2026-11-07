import React, { useState } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { useScholarships } from '../../hooks/useScholarships';
import type { EnrichedScholarship } from '../../hooks/useScholarships';
import { formatCurrency, getDeadlineUrgency } from '../../utils/formatters';
import {
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Sliders,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface GapAnalysisViewProps {
  onOpenDetails: (scholarship: EnrichedScholarship) => void;
  onOpenWorkspace: (scholarshipId: string) => void;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  onOpenDetails,
  onOpenWorkspace,
}) => {
  const { setActiveTab, setIsOnboardingOpen, setApplicationStage, trackedApplications } =
    useScholarshipContext();
  const { allEnriched } = useScholarships();

  const [expandedAlternativeId, setExpandedAlternativeId] = useState<string | null>(null);

  // Near-miss scholarships: either flagged as isAlmostEligible or score 50-74% with gaps
  const nearMissScholarships = allEnriched.filter(
    (s) =>
      s.matchBreakdown.isAlmostEligible ||
      (s.matchScore >= 50 && s.matchScore < 75 && s.matchBreakdown.gaps.length > 0)
  );

  // Fully eligible alternatives for recommendation
  const eligibleAlternatives = allEnriched.filter(
    (s) => s.matchScore >= 80 && !s.matchBreakdown.isAlmostEligible
  );

  const totalNearMissFunding = nearMissScholarships.reduce((acc, s) => acc + s.amount, 0);

  return (
    <section aria-label="Almost Eligible Gap Analysis" className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#f7ba53]/10 via-[#a9f46b]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-amber-600 dark:text-amber-400">GAP DIAGNOSTICS</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="eyebrow text-[var(--text-muted)]">ELIGIBILITY ADVISOR</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#edf1ec] tracking-tight">
            "Almost Eligible" Gap Analysis & Fixes
          </h1>

          <p className="text-sm text-[#89918c] leading-relaxed">
            Students routinely abandon scholarships because of a single ambiguous criteria.
            Grantly diagnoses exactly what is short (e.g. <em>0.3 CGPA</em> or a missing digital
            certificate), suggests the precise remedy, and maps instant alternative grants.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 bg-[#171c1a] border border-[#222827] rounded-xl flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-[#f7ba53]" />
              <span className="font-bold text-[#edf1ec]">
                {nearMissScholarships.length} Near-Miss Opportunities
              </span>
            </div>

            <div className="px-3 py-1.5 bg-[#171c1a] border border-[#222827] rounded-xl flex items-center gap-2 text-xs">
              <TrendingUp className="w-4 h-4 text-[#a9f46b]" />
              <span className="font-bold text-[#edf1ec]">
                {formatCurrency(totalNearMissFunding)} At Stake
              </span>
            </div>

            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3 py-1.5 bg-[#121614] border border-[#222827] hover:border-[#a9f46b] text-[#89918c] hover:text-[#a9f46b] rounded-xl flex items-center gap-1.5 text-xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulate Profile Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Near Miss Opportunities List */}
      {nearMissScholarships.length === 0 ? (
        <div className="p-12 text-center bg-[#101313] border border-[#222827] rounded-2xl space-y-3">
          <CheckCircle2 className="w-10 h-10 text-[#a9f46b] mx-auto" />
          <h2 className="text-lg font-bold text-[#edf1ec]">No Critical Gaps Detected!</h2>
          <p className="text-xs text-[#89918c] max-w-md mx-auto">
            You qualify comfortably for your matched scholarships, or need to expand your search filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {nearMissScholarships.map((scholarship) => {
            const urgency = getDeadlineUrgency(scholarship.deadline);
            const isTracked = trackedApplications.some((a) => a.scholarshipId === scholarship.id);
            const isAltExpanded = expandedAlternativeId === scholarship.id;

            return (
              <article
                key={scholarship.id}
                className="bg-[#101313] border border-[#222827] hover:border-[#38423f] rounded-2xl p-5 sm:p-6 transition-all space-y-5"
                aria-labelledby={`gap-title-${scholarship.id}`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="eyebrow text-[#89918c]">
                        {scholarship.provider} • {scholarship.organizationType}
                      </span>
                      <span className="text-[10px] font-mono text-[#f7ba53] bg-[#f7ba53]/10 border border-[#f7ba53]/20 px-2 py-0.5 rounded-full">
                        NEAR MISS
                      </span>
                    </div>
                    <h2
                      id={`gap-title-${scholarship.id}`}
                      className="text-lg font-bold text-[#edf1ec] tracking-tight hover:text-[#a9f46b] transition-colors cursor-pointer"
                      onClick={() => onOpenDetails(scholarship)}
                    >
                      {scholarship.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xl font-bold font-mono text-[#edf1ec] block">
                        {formatCurrency(scholarship.amount)}
                      </span>
                      <span className="text-[11px] text-[#89918c]">
                        {scholarship.awardType}
                      </span>
                    </div>

                    <div className="px-3 py-1 bg-[#161c1b] border border-[#f7ba53]/30 rounded-xl text-center">
                      <span className="font-mono text-xs font-bold text-[#f7ba53] block">
                        {scholarship.matchScore}%
                      </span>
                      <span className="text-[9px] font-mono text-[#89918c] uppercase">MATCH</span>
                    </div>
                  </div>
                </div>

                {/* Shortfall Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {scholarship.matchBreakdown.gaps.map((gap, gIdx) => (
                    <div
                      key={gIdx}
                      className="p-4 bg-[#141818] border border-[#2a2218] rounded-xl space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#f7ba53] shrink-0 mt-0.5" />
                        <div>
                          <span className="eyebrow text-[#f7ba53] block mb-0.5">EXACT SHORTFALL</span>
                          <p className="text-xs font-semibold text-[#edf1ec]">
                            {gap.gapDescription}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#222827] flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-[#a9f46b] shrink-0 mt-0.5" />
                        <div>
                          <span className="eyebrow text-[#a9f46b] block mb-0.5">SUGGESTED ACTION</span>
                          <p className="text-xs text-[#89918c] leading-relaxed">
                            {gap.suggestedFix}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alternative Grant Recommendation Trigger */}
                {isAltExpanded && (
                  <div className="p-4 bg-[#141818] border border-[#222827] rounded-xl space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow text-[#a9f46b]">
                        SURFACED ALTERNATIVE SCHEMES (YOU ALREADY QUALIFY)
                      </span>
                      <button
                        onClick={() => setExpandedAlternativeId(null)}
                        className="text-[11px] text-[#89918c] hover:text-[#edf1ec]"
                      >
                        Hide
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {eligibleAlternatives.slice(0, 2).map((alt) => (
                        <div
                          key={alt.id}
                          className="p-3 bg-[#101313] border border-[#222827] rounded-xl flex items-center justify-between gap-3 hover:border-[#a9f46b] transition-colors"
                        >
                          <div>
                            <span className="eyebrow text-[#89918c] block text-[9px]">
                              {alt.provider}
                            </span>
                            <span className="text-xs font-bold text-[#edf1ec] line-clamp-1">
                              {alt.title}
                            </span>
                            <span className="font-mono text-xs text-[#a9f46b] font-semibold">
                              {formatCurrency(alt.amount)} • {alt.matchScore}% Match
                            </span>
                          </div>
                          <button
                            onClick={() => onOpenDetails(alt)}
                            className="btn-panel px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-3 border-t border-[#222827] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-[#89918c]">
                      Deadline: <span className="text-[#edf1ec]">{scholarship.deadline}</span> ({urgency.label})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedAlternativeId(isAltExpanded ? null : scholarship.id)
                      }
                      className="btn-panel px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#a9f46b]" />
                      <span>{isAltExpanded ? 'Close Alternatives' : 'View Matching Alternatives'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('vault')}
                      className="btn-panel px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#70b4ff]" />
                      <span>Fix in Document Vault</span>
                    </button>

                    {isTracked ? (
                      <button
                        type="button"
                        onClick={() => onOpenWorkspace(scholarship.id)}
                        className="btn-panel px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400"
                      >
                        ✓ Tracking
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setApplicationStage(scholarship.id, 'saved')}
                        className="btn-panel px-3 py-1.5 rounded-xl text-xs font-bold text-[#89918c] hover:text-[#edf1ec]"
                      >
                        Track Anyway
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenDetails(scholarship)}
                      className="btn-mint px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <span>Diagnose</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
