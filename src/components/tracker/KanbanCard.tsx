import React from 'react';
import type { Scholarship, TrackedApplication, ApplicationStage } from '../../types/scholarship';
import { formatCurrency, getDeadlineUrgency } from '../../utils/formatters';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileText,
  Trash2,
  Award,
  XCircle,
} from 'lucide-react';
import { useScholarshipContext } from '../../context/ScholarshipContext';

interface KanbanCardProps {
  scholarship: Scholarship;
  application: TrackedApplication;
  onOpenWorkspace: (scholarshipId: string) => void;
}

const STAGES: ApplicationStage[] = ['saved', 'preparing', 'submitted', 'under_review', 'result'];

export const KanbanCard: React.FC<KanbanCardProps> = ({
  scholarship,
  application,
  onOpenWorkspace,
}) => {
  const { setApplicationStage, removeTrackedApplication } = useScholarshipContext();
  const urgency = getDeadlineUrgency(scholarship.deadline);
  const totalTasks = scholarship.requiredDocuments.length;
  const completedTasks = application.completedChecklist.length;

  const currentIndex = STAGES.indexOf(application.stage);

  return (
    <article
      className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] hover:border-emerald-500/40 p-3.5 transition-all shadow-xs flex flex-col justify-between h-[230px]"
      aria-labelledby={`kanban-card-${scholarship.id}`}
    >
      {/* 1. Top Row: Provider & Delete Action */}
      <div>
        <div className="flex items-center justify-between gap-1.5 h-4 mb-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold truncate flex-1" title={scholarship.provider}>
            {scholarship.provider}
          </span>
          <button
            onClick={() => removeTrackedApplication(scholarship.id)}
            className="text-[var(--text-muted)] hover:text-red-500 p-0.5 transition-colors rounded-md shrink-0"
            title="Remove from tracking"
            aria-label={`Remove ${scholarship.title} from tracker`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. Scheme Title */}
        <h4
          id={`kanban-card-${scholarship.id}`}
          onClick={() => onOpenWorkspace(scholarship.id)}
          className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors block h-5 leading-5"
          title={scholarship.title}
        >
          {scholarship.title}
        </h4>
      </div>

      {/* 3. Amount & Urgency Row */}
      <div className="flex items-center justify-between text-xs font-mono h-6 gap-2">
        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm truncate">
          {formatCurrency(scholarship.amount)}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-secondary)] whitespace-nowrap shrink-0">
          {urgency.label}
        </span>
      </div>

      {/* 4. Progress Strip OR Outcome Selector */}
      {application.stage === 'result' ? (
        <div className="h-8 px-2 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-card)] flex items-center justify-between text-xs gap-1">
          <span className="text-[10px] font-mono text-[var(--text-muted)] font-bold shrink-0">STATUS:</span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setApplicationStage(scholarship.id, 'result', 'awarded')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                application.resultOutcome === 'awarded'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'bg-[var(--bg-card)] text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
              }`}
              title="Mark as Awarded"
            >
              <Award className="w-3 h-3" />
              <span>Won</span>
            </button>
            <button
              onClick={() => setApplicationStage(scholarship.id, 'result', 'not_selected')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                application.resultOutcome === 'not_selected' || application.resultOutcome === 'regret'
                  ? 'bg-red-600 text-white dark:bg-red-500 dark:text-slate-950 shadow-xs'
                  : 'bg-[var(--bg-card)] text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30'
              }`}
              title="Mark as Not Selected"
            >
              <XCircle className="w-3 h-3" />
              <span>Closed</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="h-8 px-2.5 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-card)] flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Docs: {completedTasks}/{totalTasks}</span>
          </span>
          {application.essayDraft ? (
            <span className="text-sky-600 dark:text-sky-400 font-medium text-[10px] truncate ml-1">Draft active</span>
          ) : (
            <span className="text-[var(--text-muted)] text-[10px] ml-1">Ready</span>
          )}
        </div>
      )}

      {/* 5. Action Footer: Uniform Symmetrical Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-card)] text-xs h-9">
        {/* Step Backward / Forward Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => currentIndex > 0 && setApplicationStage(scholarship.id, STAGES[currentIndex - 1])}
            disabled={currentIndex === 0}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
              currentIndex > 0
                ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] bg-[var(--bg-card)] cursor-pointer'
                : 'text-[var(--text-muted)] opacity-30 border border-transparent cursor-not-allowed'
            }`}
            title={currentIndex > 0 ? `Move back to ${STAGES[currentIndex - 1].replace('_', ' ')}` : 'At initial stage'}
            aria-label="Move back one stage"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => currentIndex < STAGES.length - 1 && setApplicationStage(scholarship.id, STAGES[currentIndex + 1])}
            disabled={currentIndex === STAGES.length - 1}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
              currentIndex < STAGES.length - 1
                ? 'text-[var(--text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] bg-[var(--bg-card)] cursor-pointer'
                : 'text-[var(--text-muted)] opacity-30 border border-transparent cursor-not-allowed'
            }`}
            title={currentIndex < STAGES.length - 1 ? `Advance to ${STAGES[currentIndex + 1].replace('_', ' ')}` : 'At final stage'}
            aria-label="Advance to next stage"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Open Application Checklist Action */}
        <button
          onClick={() => onOpenWorkspace(scholarship.id)}
          className="btn-mint h-7.5 inline-flex items-center gap-1.5 px-3 rounded-lg font-bold text-xs cursor-pointer shadow-xs"
          aria-label={`Open checklist for ${scholarship.title}`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Open Checklist</span>
        </button>
      </div>
    </article>
  );
};
