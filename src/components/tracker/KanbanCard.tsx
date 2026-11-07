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
      className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] hover:border-[var(--border-card-hover)] p-3.5 transition-all space-y-3 shadow-xs flex flex-col justify-between"
      aria-labelledby={`kanban-card-${scholarship.id}`}
    >
      {/* 1. Header: Provider & Scheme Title */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold truncate block h-4 leading-4 flex-1">
            {scholarship.provider}
          </span>
          <button
            onClick={() => removeTrackedApplication(scholarship.id)}
            className="text-[var(--text-muted)] hover:text-red-500 p-0.5 transition-colors rounded-md shrink-0 -mr-1 -mt-0.5"
            title="Remove from tracking"
            aria-label={`Remove ${scholarship.title} from tracker`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <h4
          id={`kanban-card-${scholarship.id}`}
          onClick={() => onOpenWorkspace(scholarship.id)}
          className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors block h-5 leading-5"
          title={scholarship.title}
        >
          {scholarship.title}
        </h4>
      </div>

      {/* 2. Amount & Urgency Row */}
      <div className="flex items-center justify-between text-xs font-mono h-6 gap-2">
        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm truncate">
          {formatCurrency(scholarship.amount)}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-secondary)] whitespace-nowrap shrink-0">
          {urgency.label}
        </span>
      </div>

      {/* 3. Requirements Checklist Status Row */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--bg-card-hover)] px-2.5 py-1.5 rounded-lg border border-[var(--border-card)] h-8">
        <span className="flex items-center gap-1.5 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Docs: {completedTasks}/{totalTasks}</span>
        </span>
        {application.essayDraft ? (
          <span className="text-sky-600 dark:text-sky-400 font-medium text-[10px] truncate ml-1">Draft active</span>
        ) : (
          <span className="text-[var(--text-muted)] text-[10px] ml-1">Checklist</span>
        )}
      </div>

      {/* 4. Result Outcome Selector (Exclusively in 'result' stage) */}
      {application.stage === 'result' && (
        <div className="p-2 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-lg flex items-center justify-between text-xs">
          <span className="eyebrow text-[var(--text-muted)] text-[9px] shrink-0">OUTCOME:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setApplicationStage(scholarship.id, 'result', 'awarded')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                application.resultOutcome === 'awarded'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'bg-[var(--bg-card)] text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>Awarded</span>
            </button>
            <button
              onClick={() => setApplicationStage(scholarship.id, 'result', 'regret')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                application.resultOutcome === 'regret'
                  ? 'bg-red-600 text-white dark:bg-red-500 dark:text-slate-950 shadow-xs'
                  : 'bg-[var(--bg-card)] text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30'
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>Regret</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Card Action Toolbar: Clean Symmetrical Alignment */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-card)] text-xs h-9">
        {/* Stage Shift Controls */}
        <div className="flex items-center gap-1">
          {currentIndex > 0 ? (
            <button
              onClick={() => setApplicationStage(scholarship.id, STAGES[currentIndex - 1])}
              className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-lg transition-colors cursor-pointer"
              title={`Move back to ${STAGES[currentIndex - 1].replace('_', ' ')}`}
              aria-label={`Move back to ${STAGES[currentIndex - 1].replace('_', ' ')}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-7 h-7" aria-hidden="true" />
          )}

          {currentIndex < STAGES.length - 1 ? (
            <button
              onClick={() => setApplicationStage(scholarship.id, STAGES[currentIndex + 1])}
              className="h-7 px-2 text-[var(--text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-lg font-mono text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title={`Advance to ${STAGES[currentIndex + 1].replace('_', ' ')}`}
              aria-label={`Advance to ${STAGES[currentIndex + 1].replace('_', ' ')}`}
            >
              <span className="capitalize">{STAGES[currentIndex + 1].replace('_', ' ')}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          ) : (
            <div className="h-7 px-2 flex items-center text-[10px] font-mono text-[var(--text-muted)]">
              Outcome
            </div>
          )}
        </div>

        {/* Open Workspace Action */}
        <button
          onClick={() => onOpenWorkspace(scholarship.id)}
          className="btn-mint h-7 inline-flex items-center gap-1 px-3 rounded-lg font-bold text-[11px] cursor-pointer shadow-xs"
          aria-label={`Open application checklist and workspace for ${scholarship.title}`}
        >
          <FileText className="w-3 h-3" />
          <span>Work</span>
        </button>
      </div>
    </article>
  );
};
