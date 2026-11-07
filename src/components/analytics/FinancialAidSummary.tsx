import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { formatCurrency } from '../../utils/formatters';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface FinancialAidSummaryProps {
  onNavigateDiscovery: () => void;
}

export const FinancialAidSummary: React.FC<FinancialAidSummaryProps> = ({
  onNavigateDiscovery,
}) => {
  const { profile, updateProfile, scholarships, trackedApplications } = useScholarshipContext();

  const scholarshipMap = new Map(scholarships.map((s) => [s.id, s]));

  let totalAppliedAmount = 0;
  let totalAwardedAmount = 0;

  trackedApplications.forEach((app) => {
    const grant = scholarshipMap.get(app.scholarshipId);
    if (grant) {
      if (app.stage === 'result' && app.resultOutcome === 'awarded') {
        totalAwardedAmount += grant.amount;
      }
      if (app.stage === 'preparing' || app.stage === 'submitted' || app.stage === 'under_review') {
        totalAppliedAmount += grant.amount;
      }
    }
  });

  const targetTuition = profile.targetAnnualFees || 120000;
  const remainingGap = Math.max(0, targetTuition - totalAwardedAmount);

  const awardedPercent = Math.min(100, Math.round((totalAwardedAmount / targetTuition) * 100));
  const appliedPercent = Math.min(
    100 - awardedPercent,
    Math.round((totalAppliedAmount / targetTuition) * 100)
  );

  return (
    <section aria-label="Financial Aid and Tuition Gap Visualizer" className="space-y-6">
      {/* Top Config & Strategy Banner */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border-card)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="eyebrow text-emerald-700 dark:text-emerald-400">FINANCIAL AID STRATEGY</span>
              <span className="text-[var(--text-muted)]">•</span>
              <span className="eyebrow text-sky-700 dark:text-sky-400">FEE GAP VISUALIZER</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              College Tuition Coverage & Net Out-of-Pocket
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Track how your matched Central, State, and CSR scholarships close your college tuition gap.
            </p>
          </div>

          {/* Target Tuition Input */}
          <div className="bg-[var(--bg-card-subtle)] border border-[var(--border-card)] p-3.5 rounded-xl flex items-center gap-3">
            <label
              htmlFor="target-tuition-input"
              className="text-xs font-mono font-bold text-[var(--text-secondary)] whitespace-nowrap"
            >
              Annual College Fees:
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-xs font-bold text-[var(--text-muted)]">₹</span>
              <input
                id="target-tuition-input"
                type="number"
                min="5000"
                step="5000"
                value={targetTuition}
                onChange={(e) =>
                  updateProfile({ targetAnnualFees: parseInt(e.target.value) || 0 })
                }
                className="w-32 pl-6 pr-2 py-1.5 bg-[var(--bg-card)] border border-[var(--border-card)] focus:border-emerald-500 rounded-lg text-xs font-mono font-bold text-[var(--text-primary)] outline-none"
                aria-label="Set target annual college fee in Indian Rupees"
              />
            </div>
          </div>
        </div>

        {/* 3 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Secured Aid */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
              <span>SECURED AID (AWARDED)</span>
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {formatCurrency(totalAwardedAmount)}
            </div>
            <p className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
              {awardedPercent}% of annual tuition covered
            </p>
          </div>

          {/* Card 2: Pending Applications */}
          <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-sky-700 dark:text-sky-400 font-bold">
              <span>APPLICATIONS IN PROGRESS</span>
              <TrendingUp className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-sky-700 dark:text-sky-400">
              {formatCurrency(totalAppliedAmount)}
            </div>
            <p className="text-[11px] font-mono text-sky-800 dark:text-sky-300">
              {appliedPercent}% potential additional coverage
            </p>
          </div>

          {/* Card 3: Remaining Need */}
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-amber-700 dark:text-amber-400 font-bold">
              <span>REMAINING UNMET NEED</span>
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
              {formatCurrency(remainingGap)}
            </div>
            <p className="text-[11px] font-mono text-amber-800 dark:text-amber-300">
              {remainingGap === 0 ? 'Goal fully achieved!' : 'Funding shortfall to close'}
            </p>
          </div>
        </div>

        {/* Stacked Visual Coverage Bar */}
        <div className="pt-4 border-t border-[var(--border-card)] space-y-2">
          <div className="flex justify-between text-xs font-mono text-[var(--text-secondary)]">
            <span>Tuition Goal Progress</span>
            <span className="text-[var(--text-primary)] font-bold">
              {formatCurrency(totalAwardedAmount + totalAppliedAmount)} Combined Potential /{' '}
              {formatCurrency(targetTuition)}
            </span>
          </div>

          <div className="w-full bg-[var(--bg-card-hover)] rounded-full h-3.5 overflow-hidden flex border border-[var(--border-card)]">
            {/* Awarded Mint Segment */}
            <div
              className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${awardedPercent}%` }}
              title={`Secured Aid: ${formatCurrency(totalAwardedAmount)} (${awardedPercent}%)`}
            />
            {/* Pending Blue Segment */}
            <div
              className="bg-sky-500 h-full transition-all duration-500"
              style={{ width: `${appliedPercent}%` }}
              title={`In Progress Applications: ${formatCurrency(totalAppliedAmount)} (${appliedPercent}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-mono text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-500 inline-block" />
              <span>Awarded ({awardedPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span>Pending Review ({appliedPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-card)] inline-block" />
              <span>Unmet Gap ({100 - awardedPercent - appliedPercent}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Strategic Call to Action Banner */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <span className="eyebrow text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            CLOSING YOUR TUITION SHORTFALL
          </span>
          <p className="text-xs text-[var(--text-secondary)] max-w-xl">
            You currently have {trackedApplications.length} tracked opportunities. We identified high-match
            schemes that can comfortably eliminate your {formatCurrency(remainingGap)} tuition gap.
          </p>
        </div>

        <button
          onClick={onNavigateDiscovery}
          className="btn-mint inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shrink-0"
        >
          <span>Explore Matching Grants</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
