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
          <p className="text-sm text-slate-500 mb-4">No scholarships selected for comparison.</p>
          <p className="text-xs text-slate-400">
            Click the "Compare" button on any scholarship card to compare up to 3 side-by-side.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Side-by-Side Scholarship Comparison" maxWidth="4xl">
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4 font-bold text-slate-400 uppercase w-1/4">Criteria</th>
              {comparedScholarships.map((grant) => {
                const match = calculateMatchScore(grant, profile);
                return (
                  <th key={grant.id} className="py-3 px-4 font-bold text-slate-900 w-1/4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm line-clamp-2">{grant.title}</span>
                      <button
                        onClick={() => toggleComparison(grant.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove from comparison"
                        aria-label={`Remove ${grant.title} from comparison`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold">
                      {match.overallPercentage}% Match
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-500">Award Amount</td>
              {comparedScholarships.map((grant) => (
                <td key={grant.id} className="py-3 px-4 font-extrabold text-base text-slate-900">
                  {formatCurrency(grant.amount)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-500">Renewable</td>
              {comparedScholarships.map((grant) => (
                <td key={grant.id} className="py-3 px-4">
                  {grant.renewable ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Yes (Annual)
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> One-time
                    </span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-500">Deadline Urgency</td>
              {comparedScholarships.map((grant) => {
                const urgency = getDeadlineUrgency(grant.deadline);
                return (
                  <td key={grant.id} className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-medium ${urgency.badgeBg}`}>
                      {urgency.label}
                    </span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-500">Min GPA</td>
              {comparedScholarships.map((grant) => {
                const meetsGpa = profile.gpa >= grant.minGpa;
                return (
                  <td key={grant.id} className="py-3 px-4">
                    <span className={meetsGpa ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {grant.minGpa.toFixed(2)} (You: {profile.gpa.toFixed(2)})
                    </span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-500">Required Docs</td>
              {comparedScholarships.map((grant) => (
                <td key={grant.id} className="py-3 px-4">
                  {grant.requiredDocuments.length} items required
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-500">Action</td>
              {comparedScholarships.map((grant) => (
                <td key={grant.id} className="py-3 px-4">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectForDetails(grant.id);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                  >
                    <span>Full Breakdown</span>
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
