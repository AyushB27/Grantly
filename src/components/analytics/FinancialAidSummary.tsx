import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowRight,
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
      if (app.stage === 'awarded') {
        totalAwardedAmount += grant.amount;
      }
      if (app.stage === 'in_progress' || app.stage === 'submitted') {
        totalAppliedAmount += grant.amount;
      }
    }
  });

  const targetTuition = profile.targetAnnualFees || 180000;
  const remainingGap = Math.max(0, targetTuition - totalAwardedAmount);

  const awardedPercent = Math.min(100, Math.round((totalAwardedAmount / targetTuition) * 100));
  const appliedPercent = Math.min(
    100 - awardedPercent,
    Math.round((totalAppliedAmount / targetTuition) * 100)
  );

  return (
    <section aria-label="Financial Aid and Tuition Gap Visualizer" className="space-y-6">
      {/* Top Config & Strategy Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>Tuition Coverage & Gap Engine</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Financial Aid Portfolio Strategy
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualize how your tracked scholarships close your real-world college tuition burden.
            </p>
          </div>

          {/* Target Tuition Input */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center gap-3">
            <label
              htmlFor="target-tuition-input"
              className="text-xs font-bold text-slate-700 whitespace-nowrap"
            >
              Annual College Fees:
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">₹</span>
              <input
                id="target-tuition-input"
                type="number"
                min="5000"
                step="5000"
                value={targetTuition}
                onChange={(e) =>
                  updateProfile({ targetAnnualFees: parseInt(e.target.value) || 0 })
                }
                className="w-32 pl-6 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Set target annual college fee in Indian Rupees"
              />
            </div>
          </div>
        </div>

        {/* 3 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          {/* Card 1: Secured Aid */}
          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
              <span>Secured Aid</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950">
              {formatCurrency(totalAwardedAmount)}
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">
              {awardedPercent}% of annual tuition covered
            </p>
          </div>

          {/* Card 2: Pending Applications */}
          <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-blue-800 font-semibold mb-1">
              <span>In-Pipeline (Pending)</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-950">
              {formatCurrency(totalAppliedAmount)}
            </div>
            <p className="text-[11px] text-blue-700 mt-1">
              {appliedPercent}% potential additional coverage
            </p>
          </div>

          {/* Card 3: Remaining Need */}
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
              <span>Remaining Unmet Need</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-950">
              {formatCurrency(remainingGap)}
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              {remainingGap === 0 ? 'Goal achieved!' : 'Funding gap to close'}
            </p>
          </div>
        </div>

        {/* Stacked Visual Coverage Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Tuition Goal Progress Bar</span>
            <span>
              {formatCurrency(totalAwardedAmount + totalAppliedAmount)} Total Potential /{' '}
              {formatCurrency(targetTuition)}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex border border-slate-200">
            {/* Awarded Green Segment */}
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${awardedPercent}%` }}
              title={`Secured Aid: ${formatCurrency(totalAwardedAmount)} (${awardedPercent}%)`}
            />
            {/* Pending Blue Segment */}
            <div
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${appliedPercent}%` }}
              title={`Pending Pipeline: ${formatCurrency(totalAppliedAmount)} (${appliedPercent}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Awarded ({awardedPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span>Pending Decisions ({appliedPercent}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" />
              <span>Unmet Gap ({100 - awardedPercent - appliedPercent}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Strategic Next Steps */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-white">Next Step to Close Your Gap</h3>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl">
            You currently have {trackedApplications.length} tracked opportunities. We identified 4 high-match
            STEM & First-Gen grants that could fully fund your remaining {formatCurrency(remainingGap)} gap.
          </p>
        </div>

        <button
          onClick={onNavigateDiscovery}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-900 font-extrabold text-xs rounded-xl hover:bg-indigo-50 transition-colors shrink-0 shadow-sm"
        >
          <span>Find Matching Grants</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
