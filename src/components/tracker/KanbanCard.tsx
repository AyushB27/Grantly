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
      className="bg-[#141818] rounded-xl border border-[#222827] hover:border-[#38423f] p-4 transition-all space-y-3"
      aria-labelledby={`kanban-card-${scholarship.id}`}
    >
      {/* Title & Provider */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="eyebrow text-[#89918c] block text-[9px]">
            {scholarship.provider}
          </span>
          <h4
            id={`kanban-card-${scholarship.id}`}
            onClick={() => onOpenWorkspace(scholarship.id)}
            className="text-xs sm:text-sm font-bold text-[#edf1ec] line-clamp-1 mt-0.5 hover:text-[#a9f46b] cursor-pointer"
          >
            {scholarship.title}
          </h4>
        </div>
        <button
          onClick={() => removeTrackedApplication(scholarship.id)}
          className="text-[#89918c] hover:text-[#ff8e91] p-1 transition-colors"
          title="Remove from tracking"
          aria-label={`Remove ${scholarship.title} from tracker`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Award & Urgency */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-bold text-[#a9f46b]">
          {formatCurrency(scholarship.amount)}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-[#101313] border border-[#222827] text-[#89918c]">
          {urgency.label}
        </span>
      </div>

      {/* Requirements status */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#89918c] bg-[#101313] px-2.5 py-1.5 rounded-lg border border-[#222827]">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#a9f46b]" />
          <span>Docs: {completedTasks}/{totalTasks}</span>
        </span>
        {application.essayDraft && (
          <span className="text-[#70b4ff]">Draft active</span>
        )}
      </div>

      {/* Result outcome selector if in 'result' stage */}
      {application.stage === 'result' && (
        <div className="p-2 bg-[#101313] border border-[#222827] rounded-lg flex items-center justify-between text-xs">
          <span className="eyebrow text-[#89918c] text-[9px]">OUTCOME:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setApplicationStage(scholarship.id, 'result', 'awarded')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors ${
                application.resultOutcome === 'awarded'
                  ? 'bg-[#a9f46b] text-[#090b0b]'
                  : 'bg-[#141818] text-[#a9f46b] border border-[#a9f46b]/30'
              }`}
            >
              <Award className="w-3 h-3" />
              <span>Awarded</span>
            </button>
            <button
              onClick={() => setApplicationStage(scholarship.id, 'result', 'regret')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors ${
                application.resultOutcome === 'regret'
                  ? 'bg-[#ff8e91] text-[#090b0b]'
                  : 'bg-[#141818] text-[#ff8e91] border border-[#ff8e91]/30'
              }`}
            >
              <XCircle className="w-3 h-3" />
              <span>Regret</span>
            </button>
          </div>
        </div>
      )}

      {/* Card Action Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-[#222827] text-xs">
        {/* Stage Navigation */}
        <div className="flex items-center gap-1">
          {currentIndex > 0 && (
            <button
              onClick={() => setApplicationStage(scholarship.id, STAGES[currentIndex - 1])}
              className="p-1 text-[#89918c] hover:text-[#edf1ec] hover:bg-[#191f1e] rounded-md transition-colors"
              title={`Move back to ${STAGES[currentIndex - 1].replace('_', ' ')}`}
              aria-label={`Move ${scholarship.title} back to ${STAGES[currentIndex - 1]}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {currentIndex < STAGES.length - 1 && (
            <button
              onClick={() => setApplicationStage(scholarship.id, STAGES[currentIndex + 1])}
              className="px-2 py-0.5 text-[#89918c] hover:text-[#a9f46b] hover:bg-[#191f1e] rounded-md font-mono text-[10px] flex items-center transition-colors"
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
          className="btn-mint inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px]"
          aria-label={`Open application checklist and workspace for ${scholarship.title}`}
        >
          <FileText className="w-3 h-3" />
          <span>Work</span>
        </button>
      </div>
    </article>
  );
};
