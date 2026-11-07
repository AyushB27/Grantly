import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { KanbanCard } from './KanbanCard';
import type { ApplicationStage } from '../../types/scholarship';
import { formatCurrency } from '../../utils/formatters';
import {
  Download,
  Printer,
  PlusCircle,
  Bookmark,
  Hourglass,
  Send,
  Award,
} from 'lucide-react';

interface KanbanBoardProps {
  onOpenWorkspace: (scholarshipId: string) => void;
  onNavigateDiscovery: () => void;
}

const COLUMNS: {
  id: ApplicationStage;
  title: string;
  icon: React.ElementType;
  colorClass: string;
  badgeBg: string;
}[] = [
  {
    id: 'bookmarked',
    title: 'Bookmarked',
    icon: Bookmark,
    colorClass: 'text-slate-700',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: Hourglass,
    colorClass: 'text-amber-800',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
  },
  {
    id: 'submitted',
    title: 'Submitted',
    icon: Send,
    colorClass: 'text-blue-800',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-300',
  },
  {
    id: 'awarded',
    title: 'Awarded & Won',
    icon: Award,
    colorClass: 'text-emerald-800',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onOpenWorkspace,
  onNavigateDiscovery,
}) => {
  const { scholarships, trackedApplications } = useScholarshipContext();

  // Create quick lookup map for scholarships
  const scholarshipMap = new Map(scholarships.map((s) => [s.id, s]));

  // Aggregate stats
  let totalPipelinePotential = 0;
  let totalAwardedFunding = 0;

  trackedApplications.forEach((app) => {
    const grant = scholarshipMap.get(app.scholarshipId);
    if (grant) {
      if (app.stage === 'awarded') {
        totalAwardedFunding += grant.amount;
      }
      totalPipelinePotential += grant.amount;
    }
  });

  // Export JSON backup
  const handleExportJson = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      platform: 'GRANTLY Scholarship Assistant',
      totalTrackedCount: trackedApplications.length,
      applications: trackedApplications.map((app) => ({
        ...app,
        scholarship: scholarshipMap.get(app.scholarshipId),
      })),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `grantly_scholarship_tracker_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section aria-label="Scholarship Application Kanban Board" className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Application Pipeline & Deadline Radar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total In-Pipeline Aid:{' '}
            <strong className="text-slate-800">{formatCurrency(totalPipelinePotential)}</strong> •
            Secured Aid: <strong className="text-emerald-700">{formatCurrency(totalAwardedFunding)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors focus:ring-2 focus:ring-indigo-500"
            title="Download JSON backup of your tracked applications"
            aria-label="Export applications as JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors focus:ring-2 focus:ring-indigo-500"
            title="Print printable summary view"
            aria-label="Print pipeline summary"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={onNavigateDiscovery}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs focus:ring-2 focus:ring-indigo-500"
            aria-label="Explore more scholarships to track"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add More Grants</span>
          </button>
        </div>
      </div>

      {/* 4-Stage Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => {
          const Icon = column.icon;
          const stageApps = trackedApplications.filter((app) => app.stage === column.id);

          // Calculate column subtotal
          const stageSum = stageApps.reduce((acc, app) => {
            const grant = scholarshipMap.get(app.scholarshipId);
            return acc + (grant ? grant.amount : 0);
          }, 0);

          return (
            <div
              key={column.id}
              className="bg-slate-100/70 border border-slate-200/90 rounded-2xl p-4 flex flex-col min-h-[450px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${column.colorClass}`} aria-hidden="true" />
                  <h3 className="font-bold text-sm text-slate-800">{column.title}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-black border ${column.badgeBg}`}>
                  {stageApps.length}
                </span>
              </div>

              {/* Column Total Subtitle */}
              <div className="text-[11px] text-slate-500 mb-3 px-1">
                Value: <span className="font-bold text-slate-700">{formatCurrency(stageSum)}</span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageApps.length === 0 ? (
                  <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400">No applications in this stage</p>
                  </div>
                ) : (
                  stageApps.map((app) => {
                    const grant = scholarshipMap.get(app.scholarshipId);
                    if (!grant) return null;
                    return (
                      <KanbanCard
                        key={app.scholarshipId}
                        scholarship={grant}
                        application={app}
                        onOpenWorkspace={onOpenWorkspace}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
