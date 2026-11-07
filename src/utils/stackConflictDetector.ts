/**
 * Multi-Grant Concurrency and Stack Conflict Detection Utilities
 * Evaluates dual-benefit eligibility rules across Indian Central Govt (NSP),
 * State Govt DBT schemes, and private CSR trusts to prevent disqualifications.
 */

import type { Scholarship, StackConflict } from '../types';

export type { StackConflict };

/**
 * Pure evaluation function that detects legal and policy concurrency conflicts
 * across a set of simultaneously selected scholarships.
 * 
 * @param scholarships Array of scholarship models selected in the planner
 * @returns Array of detected concurrency conflicts with institutional reasons
 */
export function detectStackConflicts(scholarships: Scholarship[]): StackConflict[] {
  const conflicts: StackConflict[] = [];

  for (let i = 0; i < scholarships.length; i++) {
    for (let j = i + 1; j < scholarships.length; j++) {
      const a = scholarships[i];
      const b = scholarships[j];

      const aConflictsWithB =
        a.stackConflicts?.includes(b.id) || a.stackConflicts?.includes(b.title);
      const bConflictsWithA =
        b.stackConflicts?.includes(a.id) || b.stackConflicts?.includes(a.title);

      // Central Govt concurrency rule check (dual NSP restriction)
      const bothCentral =
        a.organizationType === 'Central Govt (NSP)' &&
        b.organizationType === 'Central Govt (NSP)';

      // State DBT vs Central NSP tuition waiver conflict
      const centralAndState =
        (a.organizationType === 'Central Govt (NSP)' && b.organizationType === 'State Govt') ||
        (a.organizationType === 'State Govt' && b.organizationType === 'Central Govt (NSP)');

      if (aConflictsWithB || bConflictsWithA || bothCentral || centralAndState) {
        conflicts.push({
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

  return conflicts;
}
