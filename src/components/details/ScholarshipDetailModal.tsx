import React from 'react';
import { Modal } from '../common/Modal';
import type { Scholarship } from '../../types/scholarship';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { calculateMatchScore } from '../../utils/matchCalculator';
import { formatCurrency, getDeadlineUrgency } from '../../utils/formatters';
import { sanitizeUrl } from '../../utils/security';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  BookmarkPlus,
  PlayCircle,
  Clock,
  Repeat,
  CheckSquare,
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
  const targetFees = profile.targetAnnualFees || 120000;
  const tuitionPercentage = Math.min(
    100,
    Math.round((scholarship.amount / targetFees) * 100)
  );

  // 3-way evaluation helper for criteria: Met, Partial, Unmet
  const getRuleStatus = (ruleText: string) => {
    const textLower = ruleText.toLowerCase();

    if (textLower.includes('cgpa') || textLower.includes('marks')) {
      if (profile.marksCgpa >= scholarship.minCgpa) {
        return { status: 'met', label: 'Met ✓', style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' };
      }
      if (profile.marksCgpa >= scholarship.minCgpa - 0.5) {
        return { status: 'partial', label: 'Near Miss ▲', style: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' };
      }
      return { status: 'unmet', label: 'Unmet ✕', style: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' };
    }

    if (textLower.includes('income')) {
      if (scholarship.familyIncomeCapMax === 0) {
        return { status: 'met', label: 'Met ✓', style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' };
      }
      return { status: 'met', label: 'Verified ✓', style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' };
    }

    if (textLower.includes('girl child') || textLower.includes('female')) {
      if (profile.isSingleGirlChild) {
        return { status: 'met', label: 'Met ✓', style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' };
      }
      return { status: 'partial', label: 'Check Affirmation', style: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' };
    }

    return { status: 'met', label: 'Applicable ✓', style: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' };
  };

  const safePortalUrl = sanitizeUrl(scholarship.portalUrl);

  return (
    <Modal
      isOpen={!!scholarship}
      onClose={onClose}
      title={scholarship.title}
      eyebrow={`${scholarship.provider} • ${scholarship.organizationType}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Header Summary Panel */}
        <div className="bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {scholarship.verifiedSource && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Official Scheme
                  </span>
                )}
                {scholarship.renewable && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
                    <Repeat className="w-3 h-3" />
                    Renewable Annually
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                {scholarship.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left md:text-right">
                <span className="text-2xl sm:text-3xl font-black font-mono text-[var(--text-primary)] block leading-tight">
                  {formatCurrency(scholarship.amount)}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  / {scholarship.awardType}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs font-mono font-bold flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{match.overallPercentage}% Match</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--border-card)] text-xs font-mono">
            <span className="bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-card)] px-2.5 py-1 rounded-lg">
              Target Deadline: <strong className="text-[var(--text-primary)]">{scholarship.deadline}</strong> ({urgency.label})
            </span>
            <span className="bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-card)] px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Est. Effort: {scholarship.effortEstimate}</span>
            </span>
            <span className="bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-card)] px-2.5 py-1 rounded-lg">
              Acceptance: {scholarship.acceptanceRateEstimate}
            </span>
          </div>
        </div>

        {/* Plain-English Summary (No Legalese) */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 space-y-2 shadow-xs">
          <span className="eyebrow text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            PLAIN-ENGLISH SUMMARY (ZERO LEGALESE)
          </span>
          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            {scholarship.plainEnglishSummary}
          </p>
        </div>

        {/* 3-Way Eligibility Checklist (Met ✓, Partial ▲, Unmet ✕) */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              ELIGIBILITY CHECKLIST (MET / PARTIAL / UNMET)
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              Evaluated against your active profile
            </span>
          </div>

          <div className="space-y-2">
            {scholarship.eligibilityCriteria.map((crit) => {
              const ruleStatus = getRuleStatus(crit.rule);
              return (
                <div
                  key={crit.id}
                  className="p-3 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    {ruleStatus.status === 'met' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {ruleStatus.status === 'partial' && (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    {ruleStatus.status === 'unmet' && (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span className="text-[var(--text-primary)] font-medium leading-relaxed">
                      {crit.rule}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${ruleStatus.style}`}
                  >
                    {ruleStatus.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guided Application Process Roadmap */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 space-y-3 shadow-xs">
          <span className="eyebrow text-sky-600 dark:text-sky-400 block">
            APPLICATION ROADMAP ({scholarship.applicationSteps?.length || 4} GUIDED STEPS)
          </span>

          <div className="space-y-3">
            {scholarship.applicationSteps?.map((stepItem) => (
              <div
                key={stepItem.step}
                className="p-3.5 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                  {stepItem.step}
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xs font-bold text-[var(--text-primary)]">{stepItem.title}</h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 space-y-3 shadow-xs">
          <span className="eyebrow text-[var(--text-muted)] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            REQUIRED DOCUMENTS & CERTIFICATES ({scholarship.requiredDocuments.length} ITEMS)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {scholarship.requiredDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="p-3 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl flex items-center gap-2 text-[var(--text-primary)]"
              >
                <span className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tuition Fee Coverage Impact */}
        <div className="p-4 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[var(--text-secondary)]">
              Covers {tuitionPercentage}% of Target Annual Fees ({formatCurrency(scholarship.amount)} / {formatCurrency(targetFees)})
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{tuitionPercentage}%</span>
          </div>
          <div className="h-2.5 w-full bg-[var(--bg-card)] rounded-full overflow-hidden border border-[var(--border-card)]">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${tuitionPercentage}%` }}
              role="progressbar"
              aria-valuenow={tuitionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Modal Action Controls Footer */}
        <div className="pt-4 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={safePortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto btn-panel px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Official Portal Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {!isTracked && (
              <button
                type="button"
                onClick={() => setApplicationStage(scholarship.id, 'saved')}
                className="flex-1 sm:flex-none btn-panel px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <BookmarkPlus className="w-4 h-4 text-[var(--text-muted)]" />
                <span>Save to Tracker</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenWorkspace(scholarship.id);
              }}
              className="flex-1 sm:flex-none btn-mint px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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
