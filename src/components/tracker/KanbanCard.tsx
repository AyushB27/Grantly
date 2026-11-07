import React from 'react';
import type { Scholarship, TrackedApplication, ApplicationStage } from '../../types/scholarship';
import { formatCurrency, getDeadlineUrgency } from '../../utils/formatters';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  FileText,
  Trash2,
} from 'lucide-react';
import { useScholarshipContext } from '../../context/ScholarshipContext';

interface KanbanCardProps {
  scholarship: Scholarship;
  application: TrackedApplication;
  onOpenWorkspace: (scholarshipId: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  scholarship,
  application,
  onOpenWorkspace,
}) => {
  const { setApplicationStage, removeTrackedApplication } = useScholarshipContext();
  const urgency = getDeadlineUrgency(scholarship.deadline);
  const totalTasks = scholarship.requiredDocuments.length;
  const completedTasks = application.completedChecklist.length;

  const stages: ApplicationStage[] = ['bookmarked', 'in_progress', 'submitted', 'awarded'];
  const currentIndex = stages.indexOf(application.stage);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all space-y-3">
      {/* Title & Provider */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {scholarship.provider}
          </span>
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
            {scholarship.title}
          </h4>
        </div>
        <button
          onClick={() => removeTrackedApplication(scholarship.id)}
          className="text-slate-400 hover:text-rose-600 p-1"
          title="Remove from tracking"
          aria-label={`Remove ${scholarship.title} from tracker`}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Award & Urgency */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-extrabold text-slate-900">
          {formatCurrency(scholarship.amount)}
        </span>
        <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${urgency.badgeBg}`}>
          {urgency.label}
        </span>
      </div>

      {/* Requirements status */}
      <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Docs: {completedTasks}/{totalTasks}</span>
        </span>
        {application.essayDraft && (
          <span className="text-emerald-700 font-medium">Draft started</span>
        )}
      </div>

      {/* Card Action Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        {/* Stage Navigation */}
        <div className="flex items-center gap-1">
          {currentIndex > 0 && (
            <button
              onClick={() => setApplicationStage(scholarship.id, stages[currentIndex - 1])}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
              title={`Move back to ${stages[currentIndex - 1].replace('_', ' ')}`}
              aria-label={`Move ${scholarship.title} back to ${stages[currentIndex - 1]}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {currentIndex < stages.length - 1 && (
            <button
              onClick={() => setApplicationStage(scholarship.id, stages[currentIndex + 1])}
              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-medium flex items-center"
              title={`Advance to ${stages[currentIndex + 1].replace('_', ' ')}`}
              aria-label={`Advance ${scholarship.title} to ${stages[currentIndex + 1]}`}
            >
              <span className="text-[10px] mr-0.5 capitalize">
                {stages[currentIndex + 1].replace('_', ' ')}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Open Workspace */}
        <button
          onClick={() => onOpenWorkspace(scholarship.id)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md font-bold text-xs transition-colors"
          aria-label={`Open application checklist and workspace for ${scholarship.title}`}
        >
          <FileText className="w-3 h-3" />
          <span>Workspace</span>
        </button>
      </div>
    </div>
  );
};
