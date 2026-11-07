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
      <div className="bg-[#101313] border border-[#222827] rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#222827]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="eyebrow text-[#a9f46b]">FINANCIAL AID STRATEGY</span>
              <span className="text-[#525c57]">•</span>
              <span className="eyebrow text-[#70b4ff]">FEE GAP VISUALIZER</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#edf1ec] tracking-tight">
              College Tuition Coverage & Net Out-of-Pocket
            </h1>
            <p className="text-xs text-[#89918c] mt-0.5">
              Track how your matched Central, State, and CSR scholarships close your college tuition gap.
            </p>
          </div>

          {/* Target Tuition Input */}
          <div className="bg-[#141818] border border-[#222827] p-3.5 rounded-xl flex items-center gap-3">
            <label
              htmlFor="target-tuition-input"
              className="text-xs font-mono font-bold text-[#89918c] whitespace-nowrap"
            >
              Annual College Fees:
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-xs font-bold text-[#89918c]">₹</span>
              <input
                id="target-tuition-input"
                type="number"
                min="5000"
                step="5000"
                value={targetTuition}
                onChange={(e) =>
                  updateProfile({ targetAnnualFees: parseInt(e.target.value) || 0 })
                }
                className="w-32 pl-6 pr-2 py-1.5 bg-[#101313] border border-[#222827] focus:border-[#a9f46b] rounded-lg text-xs font-mono font-bold text-[#edf1ec] outline-none"
                aria-label="Set target annual college fee in Indian Rupees"
              />
            </div>
          </div>
        </div>

        {/* 3 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Secured Aid */}
          <div className="bg-[#141818] border border-[#a9f46b]/30 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#a9f46b]">
              <span>SECURED AID (AWARDED)</span>
              <Award className="w-4 h-4 text-[#a9f46b]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#a9f46b]">
              {formatCurrency(totalAwardedAmount)}
            </div>
            <p className="text-[11px] font-mono text-[#89918c]">
              {awardedPercent}% of annual tuition covered
            </p>
          </div>

          {/* Card 2: Pending Applications */}
          <div className="bg-[#141818] border border-[#70b4ff]/30 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#70b4ff]">
              <span>APPLICATIONS IN PROGRESS</span>
              <TrendingUp className="w-4 h-4 text-[#70b4ff]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#70b4ff]">
              {formatCurrency(totalAppliedAmount)}
            </div>
            <p className="text-[11px] font-mono text-[#89918c]">
              {appliedPercent}% potential additional coverage
            </p>
          </div>

          {/* Card 3: Remaining Need */}
          <div className="bg-[#141818] border border-[#f7ba53]/30 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-[#f7ba53]">
              <span>REMAINING UNMET NEED</span>
              <AlertTriangle className="w-4 h-4 text-[#f7ba53]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#edf1ec]">
              {formatCurrency(remainingGap)}
            </div>
            <p className="text-[11px] font-mono text-[#89918c]">
              {remainingGap === 0 ? 'Goal fully achieved!' : 'Funding shortfall to close'}
            </p>
          </div>
        </div>

        {/* Stacked Visual Coverage Bar */}
        <div className="pt-4 border-t border-[#222827] space-y-2">
          <div className="flex justify-between text-xs font-mono text-[#89918c]">
            <span>Tuition Goal Progress</span>
            <span className="text-[#edf1ec]">
              {formatCurrency(totalAwardedAmount + totalAppliedAmount)} Combined Potential /{' '}
              {formatCurrency(targetTuition)}
            </span>
          </div>

          <div className="w-full bg-[#141818] rounded-full h-3.5 overflow-hidden flex border border-[#222827]">
            {/* Awarded Mint Segment */}
            <div
              className="bg-[#a9f46b] h-full transition-all duration-500"
              style={{ width: `${awardedPercent}%` }}
              title={`Secured Aid: ${formatCurrency(totalAwardedAmount)} (${awardedPercent}%)`}
            />
            {/* Pending Blue Segment */}
            <div
              className="bg-[#70b4ff] h-full transition-all duration-500"
              style={{ width: `${appliedPercent}%` }}
              title={`In Progress Applications: ${formatCurrency(totalAppliedAmount)} (${appliedPercent}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-mono text-[#89918c]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a9f46b] inline-block" />
              <span>Awarded ({awardedPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#70b4ff] inline-block" />
              <span>Pending Review ({appliedPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#222827] inline-block" />
              <span>Unmet Gap ({100 - awardedPercent - appliedPercent}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Strategic Call to Action Banner */}
      <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="eyebrow text-[#a9f46b] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            CLOSING YOUR TUITION SHORTFALL
          </span>
          <p className="text-xs text-[#89918c] max-w-xl">
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
