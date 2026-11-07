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
      className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-card)] hover:border-[var(--border-card-hover)] p-4 transition-all space-y-3 shadow-xs"
      aria-labelledby={`kanban-card-${scholarship.id}`}
    >
      {/* Title & Provider */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="eyebrow text-[var(--text-muted)] block text-[9px] truncate">
            {scholarship.provider}
          </span>
          <h4
            id={`kanban-card-${scholarship.id}`}
            onClick={() => onOpenWorkspace(scholarship.id)}
            className="text-xs sm:text-sm font-bold text-[var(--text-primary)] line-clamp-1 mt-0.5 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
          >
            {scholarship.title}
          </h4>
        </div>
        <button
          onClick={() => removeTrackedApplication(scholarship.id)}
          className="text-[var(--text-muted)] hover:text-red-500 p-1 transition-colors rounded-md"
          title="Remove from tracking"
          aria-label={`Remove ${scholarship.title} from tracker`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Award & Urgency */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(scholarship.amount)}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-secondary)]">
          {urgency.label}
        </span>
      </div>

      {/* Requirements status */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] bg-[var(--bg-card-hover)] px-2.5 py-1.5 rounded-lg border border-[var(--border-card)]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Docs: {completedTasks}/{totalTasks}</span>
        </span>
        {application.essayDraft && (
          <span className="text-sky-600 dark:text-sky-400 font-medium">Draft active</span>
        )}
      </div>

      {/* Result outcome selector if in 'result' stage */}
      {application.stage === 'result' && (
        <div className="p-2 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-lg flex items-center justify-between text-xs">
          <span className="eyebrow text-[var(--text-muted)] text-[9px]">OUTCOME:</span>
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

      {/* Card Action Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-card)] text-xs">
        {/* Stage Navigation */}
        <div className="flex items-center gap-1">
          {currentIndex > 0 && (
            <button
              onClick={() => setApplicationStage(scholarship.id, STAGES[currentIndex - 1])}
              className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-md transition-colors cursor-pointer"
              title={`Move back to ${STAGES[currentIndex - 1].replace('_', ' ')}`}
              aria-label={`Move ${scholarship.title} back to ${STAGES[currentIndex - 1]}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {currentIndex < STAGES.length - 1 && (
            <button
              onClick={() => setApplicationStage(scholarship.id, STAGES[currentIndex + 1])}
              className="px-2 py-0.5 text-[var(--text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-[var(--bg-card-hover)] rounded-md font-mono text-[10px] flex items-center transition-colors cursor-pointer"
              title={`Advance to ${STAGES[currentIndex + 1].replace('_', ' ')}`}
              aria-label={`Advance ${scholarship.title} to ${STAGES[currentIndex + 1]}`}
            >
              <span className="capitalize">{STAGES[currentIndex + 1].replace('_', ' ')}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          )}
        </div>

        {/* Open Workspace */}
        <button
          onClick={() => onOpenWorkspace(scholarship.id)}
          className="btn-mint inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer"
          aria-label={`Open application checklist and workspace for ${scholarship.title}`}
        >
          <FileText className="w-3 h-3" />
          <span>Work</span>
        </button>
      </div>
    </article>
  );
};
