import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import type { Scholarship, ApplicationStage } from '../../types/scholarship';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { calculateEssayMetrics, getDeadlineUrgency } from '../../utils/formatters';
import {
  CheckSquare,
  FileEdit,
  Save,
  CheckCircle2,
  ExternalLink,
  Send,
  Award,
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
  const currentStage: ApplicationStage = trackedApp ? trackedApp.stage : 'bookmarked';
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
      {/* Top Companion Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
            Step-by-Step Application Companion
          </span>
          <h3 className="text-lg font-extrabold text-white mt-0.5">
            {scholarship.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Provider: <span className="font-semibold text-white">{scholarship.provider}</span> •
            Deadline: <span className="text-amber-300 font-bold">{urgency.label}</span>
          </p>
        </div>

        {/* Current Stage Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Pipeline Stage:</span>
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
            {currentStage.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Document Vault & Interactive Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-600" />
            Document Vault & Requirements Checklist
          </h3>
          <span className="text-xs font-bold text-slate-600">
            {completedDocs.length} of {totalDocs} Completed ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
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
                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                }`}
              >
                <input
                  id={checkId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleChecklistItem(scholarship.id, doc)}
                  className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500 mt-0.5"
                  aria-label={`Mark "${doc}" as completed`}
                />
                <div className="flex-1">
                  <span className={`text-xs font-semibold ${isChecked ? 'line-through text-slate-500' : ''}`}>
                    {doc}
                  </span>
                </div>
                {isChecked && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Ready
                  </span>
                )}
              </label>
            );
          })}
        </fieldset>
      </div>

      {/* Live Essay Draft Scratchpad */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-indigo-600" />
            Essay Draft & Personal Statement Scratchpad
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-500">
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
          value={essayDraft}
          onChange={(e) => {
            setEssayDraft(e.target.value);
            saveApplicationDraft(scholarship.id, e.target.value, notes);
          }}
          placeholder="Draft your personal statement or outline key talking points here... (Auto-saves continuously to your local workspace)"
          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono leading-relaxed"
          aria-label="Essay draft textarea"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            {saveStatus === 'saved' ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Changes saved to browser storage
              </span>
            ) : (
              'Auto-saved continuously to browser storage'
            )}
          </span>
          <button
            type="button"
            onClick={handleManualSave}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            aria-label="Save draft notes manually"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Application Notes & Faculty Follow-Up */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
        <label htmlFor="app-notes" className="text-xs font-bold text-slate-700 block">
          Submission Notes, Reference Codes, or Faculty Follow-Up
        </label>
        <input
          id="app-notes"
          type="text"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            saveApplicationDraft(scholarship.id, essayDraft, e.target.value);
          }}
          placeholder="e.g. Professor Smith agreed to write rec letter by Nov 15; App portal ID #99214"
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          aria-label="Application notes and follow-up"
        />
      </div>

      {/* Pipeline Stage Transitions Footer */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Advance Status:</span>
          <button
            type="button"
            onClick={() => setApplicationStage(scholarship.id, 'in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentStage === 'in_progress'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            In Progress
          </button>

          <button
            type="button"
            onClick={() => setApplicationStage(scholarship.id, 'submitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              currentStage === 'submitted'
                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Send className="w-3 h-3" />
            <span>Submitted</span>
          </button>

          <button
            type="button"
            onClick={() => setApplicationStage(scholarship.id, 'awarded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              currentStage === 'awarded'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Awarded</span>
          </button>
        </div>

        <a
          href={scholarship.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <span>Proceed to Official Submission</span>
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
      title="Application Workspace & Document Vault"
      maxWidth="4xl"
    >
      <WorkspaceContent key={scholarship.id} scholarship={scholarship} onClose={onClose} />
    </Modal>
  );
};
