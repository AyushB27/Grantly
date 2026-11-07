import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Scholarship, ApplicationStage } from '../../types/scholarship';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { calculateEssayMetrics, getDeadlineUrgency } from '../../utils/formatters';
import { sanitizeUrl } from '../../utils/security';
import {
  CheckSquare,
  FileEdit,
  Save,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface ApplicationWorkspaceModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
}

const WorkspaceContent: React.FC<{
  scholarship: Scholarship;
  onClose: () => void;
}> = ({ scholarship }) => {
  const {
    trackedApplications,
    toggleChecklistItem,
    saveApplicationDraft,
    setApplicationStage,
  } = useScholarshipContext();

  const trackedApp = trackedApplications.find((app) => app.scholarshipId === scholarship.id);

  const [essayDraft, setEssayDraft] = useState(trackedApp?.essayDraft || '');
  const [notes, setNotes] = useState(trackedApp?.notes || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const completedDocs = trackedApp ? trackedApp.completedChecklist : [];
  const totalDocs = scholarship.requiredDocuments.length;
  const progressPercent = totalDocs > 0 ? Math.round((completedDocs.length / totalDocs) * 100) : 0;
  const currentStage: ApplicationStage = trackedApp ? trackedApp.stage : 'saved';
  const essayMetrics = calculateEssayMetrics(essayDraft);
  const urgency = getDeadlineUrgency(scholarship.deadline);

  const handleManualSave = () => {
    setSaveStatus('saving');
    saveApplicationDraft(scholarship.id, essayDraft, notes);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Top Companion Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="eyebrow text-emerald-700 dark:text-emerald-400 block mb-1">
            STEP-BY-STEP APPLICATION WORKSPACE
          </span>
          <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
            {scholarship.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
            Provider: <span className="text-[var(--text-primary)] font-semibold">{scholarship.provider}</span> •
            Deadline: <span className="text-amber-700 dark:text-amber-400 font-bold ml-1">{urgency.label}</span>
          </p>
        </div>

        {/* Current Stage Indicator */}
        <div className="flex items-center gap-2">
          <span className="eyebrow text-[var(--text-muted)]">STAGE:</span>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            {currentStage.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Document Vault & Interactive Checklist */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Document Verification Checklist
          </h3>
          <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            {completedDocs.length} of {totalDocs} Complete ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--bg-card-hover)] rounded-full h-2 overflow-hidden border border-[var(--border-card)]">
          <div
            className="h-full rounded-full transition-all duration-300 bg-emerald-600 dark:bg-emerald-500"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Application documents completion progress"
          />
        </div>

        {/* Checklist Items */}
        <fieldset className="space-y-2">
          <legend className="sr-only">Required documents for application</legend>
          {scholarship.requiredDocuments.map((doc, idx) => {
            const isChecked = completedDocs.includes(doc);
            const checkId = `doc-check-${scholarship.id}-${idx}`;
            return (
              <label
                key={idx}
                htmlFor={checkId}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-[var(--text-primary)]'
                    : 'bg-[var(--bg-card-subtle)] border-[var(--border-card)] text-[var(--text-secondary)] hover:border-emerald-500/40'
                }`}
              >
                <input
                  id={checkId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleChecklistItem(scholarship.id, doc)}
                  className="w-4 h-4 accent-emerald-600 rounded mt-0.5 cursor-pointer"
                  aria-label={`Mark "${doc}" as completed`}
                />
                <div className="flex-1">
                  <span className={`text-xs font-medium ${isChecked ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                    {doc}
                  </span>
                </div>
                {isChecked && (
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded">
                    Ready
                  </span>
                )}
              </label>
            );
          })}
        </fieldset>
      </div>

      {/* Live Essay Draft Scratchpad */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wider">
            <FileEdit className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            Statement of Purpose / Essay Draft
          </h3>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)]">
            <span>{essayMetrics.wordCount} words</span>
            <span>•</span>
            <span>{essayMetrics.charCount} chars</span>
            <span>•</span>
            <span>~{essayMetrics.estimatedMinutes}m read</span>
          </div>
        </div>

        <label htmlFor="essay-scratchpad" className="sr-only">
          Essay and personal statement draft notes
        </label>
        <textarea
          id="essay-scratchpad"
          rows={5}
          maxLength={5000}
          value={essayDraft}
          onChange={(e) => {
            setEssayDraft(e.target.value);
            saveApplicationDraft(scholarship.id, e.target.value, notes);
          }}
          placeholder="Draft your personal statement or outline key talking points here... (Auto-saves continuously to your local workspace)"
          className="w-full p-3.5 bg-[var(--bg-card-subtle)] border border-[var(--border-card)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all font-mono leading-relaxed"
          aria-label="Essay draft textarea"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            {saveStatus === 'saved' ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved to browser storage
              </span>
            ) : (
              'Auto-saved continuously to browser storage'
            )}
          </span>
          <button
            type="button"
            onClick={handleManualSave}
            className="btn-panel px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            aria-label="Save draft notes manually"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Application Notes */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-5 space-y-2 shadow-xs">
        <label htmlFor="app-notes" className="text-xs font-mono font-bold text-[var(--text-secondary)] block uppercase">
          Application Notes, Reference Codes, or University Seal Reminders
        </label>
        <input
          id="app-notes"
          type="text"
          maxLength={500}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            saveApplicationDraft(scholarship.id, essayDraft, e.target.value);
          }}
          placeholder="e.g. HOD signature required; Portal ID #NSP-2026-98124"
          className="w-full px-3.5 py-2.5 bg-[var(--bg-card-subtle)] border border-[var(--border-card)] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          aria-label="Application notes and follow-up"
        />
      </div>

      {/* Stage Progress Transitions Footer */}
      <div className="pt-4 border-t border-[var(--border-card)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="eyebrow text-[var(--text-muted)] mr-1">MOVE STAGE:</span>
          {(['saved', 'preparing', 'submitted', 'under_review', 'result'] as ApplicationStage[]).map(
            (stg) => (
              <button
                key={stg}
                type="button"
                onClick={() => setApplicationStage(scholarship.id, stg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currentStage === stg
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                    : 'bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {stg.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <a
          href={sanitizeUrl(scholarship.portalUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-mint inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export const ApplicationWorkspaceModal: React.FC<ApplicationWorkspaceModalProps> = ({
  scholarship,
  onClose,
}) => {
  if (!scholarship) return null;

  return (
    <Modal
      isOpen={!!scholarship}
      onClose={onClose}
      title="Application Workspace & Document Checklist"
      eyebrow="APPLICATION WORKSPACE"
      maxWidth="4xl"
    >
      <WorkspaceContent key={scholarship.id} scholarship={scholarship} onClose={onClose} />
    </Modal>
  );
};
