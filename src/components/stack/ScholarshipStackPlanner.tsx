import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Layers,
  AlertTriangle,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';

export const ScholarshipStackPlanner: React.FC = () => {
  const {
    scholarships,
    profile,
    stackScholarshipIds,
    toggleStackScholarship,
    clearStack,
    setActiveTab,
  } = useScholarshipContext();

  const stackedScholarships = scholarships.filter((s) => stackScholarshipIds.includes(s.id));
  const unstackedScholarships = scholarships.filter((s) => !stackScholarshipIds.includes(s.id));

  // Detect conflicts between any pair of stacked scholarships
  const detectedConflicts: {
    grantA: string;
    grantB: string;
    reason: string;
  }[] = [];

  for (let i = 0; i < stackedScholarships.length; i++) {
    for (let j = i + 1; j < stackedScholarships.length; j++) {
      const a = stackedScholarships[i];
      const b = stackedScholarships[j];

      const aConflictsWithB = a.stackConflicts?.includes(b.id);
      const bConflictsWithA = b.stackConflicts?.includes(a.id);

      // Central Govt concurrency rule check
      const bothCentral =
        a.organizationType === 'Central Govt (NSP)' && b.organizationType === 'Central Govt (NSP)';
      const centralAndState =
        (a.organizationType === 'Central Govt (NSP)' && b.organizationType === 'State Govt') ||
        (a.organizationType === 'State Govt' && b.organizationType === 'Central Govt (NSP)');

      if (aConflictsWithB || bConflictsWithA || bothCentral || centralAndState) {
        detectedConflicts.push({
          grantA: a.title,
          grantB: b.title,
          reason: bothCentral
            ? 'Concurrent Central Govt grants prohibited under NSP guidelines.'
            : centralAndState
            ? 'State DBT and Central NSP schemes generally cannot be drawn together for tuition.'
            : 'Explicit dual-benefit restriction defined by the granting authorities.',
        });
      }
    }
  }

  const totalStackedFunding = stackedScholarships.reduce((acc, s) => acc + s.amount, 0);
  const targetTuition = profile.targetAnnualFees || 120000;
  const coverageRatio = Math.min(100, Math.round((totalStackedFunding / targetTuition) * 100));
  const outOfPocket = Math.max(0, targetTuition - totalStackedFunding);

  return (
    <section aria-label="Scholarship Stack Planner" className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#70b4ff]/10 via-[#a9f46b]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-[#a9f46b]">STRETCH INNOVATION</span>
            <span className="text-[#525c57]">•</span>
            <span className="eyebrow text-[#70b4ff]">MULTI-GRANT STACK PLANNER</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#edf1ec] tracking-tight">
            Scholarship Stacking & Concurrency Engine
          </h1>

          <p className="text-sm text-[#89918c] leading-relaxed">
            Combine multiple non-conflicting awards (e.g. Government tuition fee waivers stacked with
            Corporate CSR living stipends) while auto-flagging legal dual-beneficiary restrictions.
          </p>
        </div>
      </div>

      {/* Aggregate Funding & Coverage Card */}
      <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="space-y-1">
            <span className="eyebrow text-[#89918c] block">TOTAL STACKED FUNDING</span>
            <span className="text-3xl sm:text-4xl font-black font-mono text-[#a9f46b] block">
              {formatCurrency(totalStackedFunding)}
            </span>
            <span className="text-[11px] font-mono text-[#525c57]">
              From {stackedScholarships.length} combined award{stackedScholarships.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="eyebrow text-[#89918c] block">TARGET ANNUAL TUITION</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#edf1ec] block">
              {formatCurrency(targetTuition)}
            </span>
            <span className="text-[11px] text-[#525c57]">
              As recorded in your student profile
            </span>
          </div>

          <div className="space-y-1">
            <span className="eyebrow text-[#89918c] block">FEE COVERAGE</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[#70b4ff] block">
              {coverageRatio}%
            </span>
            <span className="text-[11px] font-mono text-[#525c57]">
              {outOfPocket === 0 ? 'Fully funded!' : `${formatCurrency(outOfPocket)} net out-of-pocket`}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={clearStack}
              disabled={stackedScholarships.length === 0}
              className="btn-panel px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-[#ff8e91] hover:text-white disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stack</span>
            </button>
            <button
              onClick={() => setActiveTab('discovery')}
              className="btn-mint px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add From Feed</span>
            </button>
          </div>
        </div>

        {/* Coverage Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[#222827] space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#89918c]">Financial Aid Coverage Gauge</span>
            <span className="text-[#a9f46b] font-bold">{coverageRatio}%</span>
          </div>
          <div className="h-2.5 w-full bg-[#141818] rounded-full overflow-hidden border border-[#222827]">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                coverageRatio >= 100
                  ? 'bg-[#a9f46b]'
                  : 'bg-gradient-to-r from-[#70b4ff] to-[#a9f46b]'
              }`}
              style={{ width: `${Math.min(100, coverageRatio)}%` }}
              role="progressbar"
              aria-valuenow={coverageRatio}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Conflict Warning Alerts */}
      {detectedConflicts.length > 0 && (
        <div className="p-5 bg-[#171410] border border-[#f7ba53]/40 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#f7ba53]" />
            <h2 className="text-sm font-bold text-[#f7ba53] tracking-tight">
              {detectedConflicts.length} Stacking Concurrency Conflict{detectedConflicts.length === 1 ? '' : 's'} Flagged
            </h2>
          </div>

          <div className="space-y-2">
            {detectedConflicts.map((c, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#101313] border border-[#222827] rounded-xl text-xs space-y-1"
              >
                <div className="font-semibold text-[#edf1ec]">
                  Conflict: <span className="text-[#ff8e91]">{c.grantA}</span> ↔{' '}
                  <span className="text-[#ff8e91]">{c.grantB}</span>
                </div>
                <p className="text-[11px] text-[#89918c]">{c.reason}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#89918c]">
            <Info className="w-4 h-4 text-[#70b4ff] shrink-0" />
            <span>
              Tip: Private CSR trusts (e.g. Tata, Reliance) can usually be received alongside Government grants, but two Government DBT tuition waivers cannot.
            </span>
          </div>
        </div>
      )}

      {/* Active Stack Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#222827]">
          <span className="eyebrow text-[#a9f46b]">
            CURRENTLY STACKED SCHOLARSHIPS ({stackedScholarships.length})
          </span>
          <span className="font-mono text-xs text-[#89918c]">
            Combined: {formatCurrency(totalStackedFunding)}
          </span>
        </div>

        {stackedScholarships.length === 0 ? (
          <div className="p-8 text-center bg-[#101313] border border-[#222827] rounded-2xl space-y-2">
            <Layers className="w-8 h-8 text-[#525c57] mx-auto" />
            <p className="text-xs text-[#89918c]">No scholarships currently in your stack.</p>
            <p className="text-[11px] text-[#525c57]">
              Select from the catalog below or browse the feed to build your aid portfolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stackedScholarships.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-[#101313] border border-[#222827] rounded-xl flex items-center justify-between gap-3"
              >
                <div>
                  <span className="eyebrow text-[#89918c] block text-[9px]">
                    {s.provider} • {s.organizationType}
                  </span>
                  <span className="text-sm font-bold text-[#edf1ec] block line-clamp-1">
                    {s.title}
                  </span>
                  <span className="font-mono text-xs text-[#a9f46b] font-semibold">
                    {formatCurrency(s.amount)} / {s.awardType}
                  </span>
                </div>

                <button
                  onClick={() => toggleStackScholarship(s.id)}
                  className="p-2 text-[#89918c] hover:text-[#ff8e91] rounded-lg hover:bg-[#141818] transition-colors"
                  title="Remove from stack"
                  aria-label={`Remove ${s.title} from stack`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available to Add to Stack */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#222827]">
          <span className="eyebrow text-[#89918c]">
            AVAILABLE SCHOLARSHIPS TO ADD TO STACK ({unstackedScholarships.length})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unstackedScholarships.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="p-3.5 bg-[#101313] border border-[#222827] hover:border-[#38423f] rounded-xl flex items-center justify-between gap-3 transition-colors"
            >
              <div className="space-y-0.5">
                <span className="eyebrow text-[#89918c] block text-[9px]">{s.provider}</span>
                <span className="text-xs font-bold text-[#edf1ec] block line-clamp-1">{s.title}</span>
                <span className="font-mono text-xs text-[#a9f46b]">{formatCurrency(s.amount)}</span>
              </div>

              <button
                onClick={() => toggleStackScholarship(s.id)}
                className="btn-panel px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                aria-label={`Add ${s.title} to stack`}
              >
                <Plus className="w-3.5 h-3.5 text-[#a9f46b]" />
                <span>Stack</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
