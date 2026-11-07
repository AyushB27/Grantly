import React from 'react';
import { Modal } from '../common/Modal';
import type { Scholarship } from '../../types/scholarship';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { calculateMatchScore } from '../../utils/matchCalculator';
import { formatCurrency, getDeadlineUrgency } from '../../utils/formatters';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  DollarSign,
  TrendingUp,
  BookmarkPlus,
  PlayCircle,
} from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  onOpenWorkspace: (scholarshipId: string) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  onOpenWorkspace,
}) => {
  const { profile, trackedApplications, setApplicationStage } = useScholarshipContext();

  if (!scholarship) return null;

  const match = calculateMatchScore(scholarship, profile);
  const urgency = getDeadlineUrgency(scholarship.deadline);
  const isTracked = trackedApplications.some((app) => app.scholarshipId === scholarship.id);

  // Tuition coverage estimation
  const tuitionPercentage = Math.min(
    100,
    Math.round((scholarship.amount / (profile.targetTuitionAnnual || 1)) * 100)
  );

  return (
    <Modal
      isOpen={!!scholarship}
      onClose={onClose}
      title="Scholarship Clarity & Options Breakdown"
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Header Block */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                {scholarship.provider} • {scholarship.organizationType}
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                {scholarship.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 block leading-tight">
                  {formatCurrency(scholarship.amount)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {scholarship.awardType} {scholarship.renewable && '• Renewable'}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{match.overallPercentage}% Match</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-200/80 text-xs">
            <span className={`px-2.5 py-1 rounded-md font-semibold border ${urgency.badgeBg}`}>
              Deadline: {urgency.label} ({scholarship.deadline})
            </span>
            <span className="bg-slate-200/70 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              Est. Time: {scholarship.estimatedCompletionMinutes} mins
            </span>
            <span className="bg-slate-200/70 text-slate-700 px-2.5 py-1 rounded-md font-medium">
              Acceptance Rate: {scholarship.acceptanceRateEstimate}
            </span>
          </div>
        </div>

        {/* Plain-English Breakdown Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-indigo-950 flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Plain-English Summary (No Legalese)
          </h2>
          <p className="text-sm text-indigo-900/90 leading-relaxed">
            {scholarship.plainEnglishSummary}
          </p>
        </div>

        {/* Tuition Gap & Financial Impact Estimator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Financial Tuition Gap Impact
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>Covers {tuitionPercentage}% of Target Annual Tuition</span>
              <span>
                {formatCurrency(scholarship.amount)} / {formatCurrency(profile.targetTuitionAnnual)}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${tuitionPercentage}%` }}
                role="progressbar"
                aria-valuenow={tuitionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Tuition coverage percentage"
              />
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Based on your configured target annual tuition of{' '}
              <strong className="text-slate-800">{formatCurrency(profile.targetTuitionAnnual)}</strong>. If
              awarded, remaining unmet need would be{' '}
              <strong className="text-slate-800">
                {formatCurrency(Math.max(0, profile.targetTuitionAnnual - scholarship.amount))}
              </strong>.
            </p>
          </div>
        </div>

        {/* Real-Time Eligibility Match Matrix */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Your Eligibility Verification Matrix
          </h2>

          <div className="space-y-2.5">
            {/* Match points positive */}
            {match.reasons.map((reason, idx) => (
              <div
                key={`reason-${idx}`}
                className="flex items-start gap-2.5 p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-900"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium">{reason}</span>
              </div>
            ))}

            {/* Warning Flags */}
            {match.warningFlags.map((flag, idx) => (
              <div
                key={`warn-${idx}`}
                className="flex items-start gap-2.5 p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="font-medium">{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Vault Preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            Required Documents & Checklist ({scholarship.requiredDocuments.length} Items)
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {scholarship.requiredDocuments.map((doc, idx) => (
              <li
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-700 font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={scholarship.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors focus:ring-2 focus:ring-indigo-500"
          >
            <span>Official Portal Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {!isTracked && (
              <button
                type="button"
                onClick={() => setApplicationStage(scholarship.id, 'bookmarked')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Bookmark</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenWorkspace(scholarship.id);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all focus:ring-2 focus:ring-indigo-500"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch Guided Application</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
