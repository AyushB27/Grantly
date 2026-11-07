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
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-emerald-700 dark:text-emerald-400">SMART COMBINATION</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="eyebrow text-sky-700 dark:text-sky-400">MULTI-GRANT PLANNER</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Scholarship Stacking & Concurrency Engine
          </h2>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Combine multiple non-conflicting awards (e.g. Government tuition fee waivers stacked with
            Corporate CSR living stipends) while auto-flagging legal dual-beneficiary restrictions.
          </p>
        </div>
      </div>

      {/* Aggregate Funding & Coverage Card */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="space-y-1">
            <span className="eyebrow text-[var(--text-muted)] block">TOTAL STACKED FUNDING</span>
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-700 dark:text-emerald-400 block">
              {formatCurrency(totalStackedFunding)}
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              From {stackedScholarships.length} combined award{stackedScholarships.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="eyebrow text-[var(--text-muted)] block">TARGET ANNUAL TUITION</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] block">
              {formatCurrency(targetTuition)}
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              As recorded in your student profile
            </span>
          </div>

          <div className="space-y-1">
            <span className="eyebrow text-[var(--text-muted)] block">FEE COVERAGE</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-sky-700 dark:text-sky-400 block">
              {coverageRatio}%
            </span>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              {outOfPocket === 0 ? 'Fully funded!' : `${formatCurrency(outOfPocket)} net out-of-pocket`}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={clearStack}
              disabled={stackedScholarships.length === 0}
              className="btn-panel px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stack</span>
            </button>
            <button
              onClick={() => setActiveTab('discovery')}
              className="btn-mint px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add From Feed</span>
            </button>
          </div>
        </div>

        {/* Coverage Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[var(--border-card)] space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[var(--text-secondary)]">Financial Aid Coverage Gauge</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{coverageRatio}%</span>
          </div>
          <div className="h-2.5 w-full bg-[var(--bg-card-hover)] rounded-full overflow-hidden border border-[var(--border-card)]">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                coverageRatio >= 100
                  ? 'bg-emerald-600 dark:bg-emerald-500'
                  : 'bg-gradient-to-r from-sky-500 to-emerald-500'
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
        <div className="p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-bold text-amber-800 dark:text-amber-400 tracking-tight">
              {detectedConflicts.length} Stacking Conflict{detectedConflicts.length === 1 ? '' : 's'} Flagged
            </h2>
          </div>

          <div className="space-y-2">
            {detectedConflicts.map((c, idx) => (
              <div
                key={idx}
                className="p-3 bg-[var(--bg-card)] border border-amber-200 dark:border-amber-500/30 rounded-xl text-xs space-y-1 shadow-xs"
              >
                <div className="font-semibold text-[var(--text-primary)]">
                  Conflict: <span className="text-red-600 dark:text-red-400">{c.grantA}</span> ↔{' '}
                  <span className="text-red-600 dark:text-red-400">{c.grantB}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{c.reason}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
            <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>
              Tip: Private CSR trusts (e.g. Tata, Reliance) can usually be received alongside Government grants, but two Government DBT tuition waivers cannot.
            </span>
          </div>
        </div>
      )}

      {/* Active Stack Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[var(--border-card)]">
          <span className="eyebrow text-emerald-700 dark:text-emerald-400">
            CURRENTLY STACKED SCHOLARSHIPS ({stackedScholarships.length})
          </span>
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Combined: {formatCurrency(totalStackedFunding)}
          </span>
        </div>

        {stackedScholarships.length === 0 ? (
          <div className="p-8 text-center bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl space-y-2 shadow-xs">
            <Layers className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
            <p className="text-xs text-[var(--text-secondary)]">No scholarships currently in your stack.</p>
            <p className="text-[11px] text-[var(--text-muted)]">
              Select from the catalog below or browse the feed to build your scholarship plan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stackedScholarships.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <span className="eyebrow text-[var(--text-muted)] block text-[9px]">
                    {s.provider} • {s.organizationType}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-primary)] block line-clamp-1">
                    {s.title}
                  </span>
                  <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    {formatCurrency(s.amount)} / {s.awardType}
                  </span>
                </div>

                <button
                  onClick={() => toggleStackScholarship(s.id)}
                  className="p-2 text-[var(--text-muted)] hover:text-red-500 rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
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
        <div className="flex items-center justify-between pb-1 border-b border-[var(--border-card)]">
          <span className="eyebrow text-[var(--text-muted)]">
            AVAILABLE SCHOLARSHIPS TO ADD TO STACK ({unstackedScholarships.length})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unstackedScholarships.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-emerald-500/40 rounded-xl flex items-center justify-between gap-3 transition-colors shadow-xs"
            >
              <div className="space-y-0.5">
                <span className="eyebrow text-[var(--text-muted)] block text-[9px]">{s.provider}</span>
                <span className="text-xs font-bold text-[var(--text-primary)] block line-clamp-1">{s.title}</span>
                <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{formatCurrency(s.amount)}</span>
              </div>

              <button
                onClick={() => toggleStackScholarship(s.id)}
                className="btn-panel px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                aria-label={`Add ${s.title} to stack`}
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Stack</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
