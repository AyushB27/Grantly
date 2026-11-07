import React from 'react';
import { Modal } from '../common/Modal';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { formatCurrency, getDeadlineUrgency } from '../../utils/formatters';
import { Trash2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { calculateMatchScore } from '../../utils/matchCalculator';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForDetails: (scholarshipId: string) => void;
}

/**
 * Side-by-side comparison modal for evaluating multiple scholarships simultaneously
 */
export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectForDetails,
}) => {
  const { scholarships, comparisonIds, toggleComparison, profile } = useScholarshipContext();

  const comparedScholarships = scholarships.filter((s) => comparisonIds.includes(s.id));

  if (comparedScholarships.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Side-by-Side Grant Comparison">
        <div className="text-center py-8">
          <p className="text-sm text-[#89918c] mb-2">No scholarships selected for comparison.</p>
          <p className="text-xs text-[#525c57]">
            Click the "Compare" button on any scholarship card to compare up to 3 side-by-side.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Side-by-Side Scholarship Comparison"
      eyebrow="MULTI-CRITERIA EVALUATION"
      maxWidth="4xl"
    >
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-card)]">
              <th className="py-3 px-4 font-mono font-bold text-[var(--text-secondary)] uppercase w-1/4">Criteria</th>
              {comparedScholarships.map((grant) => {
                const match = calculateMatchScore(grant, profile);
                return (
                  <th key={grant.id} className="py-3 px-4 font-bold text-[var(--text-primary)] w-1/4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm line-clamp-2">{grant.title}</span>
                      <button
                        onClick={() => toggleComparison(grant.id)}
                        className="text-[var(--text-muted)] hover:text-red-500 p-1 cursor-pointer"
                        title="Remove from comparison"
                        aria-label={`Remove ${grant.title} from comparison`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-mono text-[10px] font-bold">
                      {match.overallPercentage}% Match
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-card)] text-[var(--text-primary)]">
            <tr>
              <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">Award Amount</td>
              {comparedScholarships.map((grant) => (
                <td key={grant.id} className="py-3 px-4 font-mono font-bold text-base text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(grant.amount)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">Renewable</td>
              {comparedScholarships.map((grant) => (
                <td key={grant.id} className="py-3 px-4">
                  {grant.renewable ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 font-mono text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Yes (Annual)
                    </span>
                  ) : (
                    <span className="text-[var(--text-muted)] font-medium flex items-center gap-1 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> One-time
                    </span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">Deadline Urgency</td>
              {comparedScholarships.map((grant) => {
                const urgency = getDeadlineUrgency(grant.deadline);
                return (
                  <td key={grant.id} className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-primary)]">
                      {urgency.label}
                    </span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">Min CGPA</td>
              {comparedScholarships.map((grant) => {
                const meetsCgpa = profile.marksCgpa >= grant.minCgpa;
                return (
                  <td key={grant.id} className="py-3 px-4">
                    <span className={meetsCgpa ? 'text-emerald-700 dark:text-emerald-400 font-bold font-mono' : 'text-amber-700 dark:text-amber-400 font-bold font-mono'}>
                      {grant.minCgpa.toFixed(2)} (You: {profile.marksCgpa.toFixed(2)})
                    </span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">Required Docs</td>
              {comparedScholarships.map((grant) => (
                <td key={grant.id} className="py-3 px-4 font-mono text-[var(--text-secondary)]">
                  {grant.requiredDocuments.length} items required
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-mono text-[var(--text-secondary)]">Action</td>
              {comparedScholarships.map((grant) => (
                <td key={grant.id} className="py-3 px-4">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectForDetails(grant.id);
                    }}
                    className="btn-mint inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <span>Breakdown</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
