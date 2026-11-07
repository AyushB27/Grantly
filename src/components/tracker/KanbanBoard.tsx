import React from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import { KanbanCard } from './KanbanCard';
import type { ApplicationStage } from '../../types/scholarship';
import { formatCurrency } from '../../utils/formatters';
import {
  Download,
  PlusCircle,
  Bookmark,
  Hourglass,
  Send,
  Eye,
  Award,
  Sparkles,
} from 'lucide-react';

interface KanbanBoardProps {
  onOpenWorkspace: (scholarshipId: string) => void;
  onNavigateDiscovery: () => void;
}

const COLUMNS: {
  id: ApplicationStage;
  title: string;
  icon: React.ElementType;
  badgeBg: string;
}[] = [
  {
    id: 'saved',
    title: 'Saved',
    icon: Bookmark,
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  {
    id: 'preparing',
    title: 'Preparing',
    icon: Hourglass,
    badgeBg: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
  },
  {
    id: 'submitted',
    title: 'Submitted',
    icon: Send,
    badgeBg: 'bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30',
  },
  {
    id: 'under_review',
    title: 'Under Review',
    icon: Eye,
    badgeBg: 'bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
  },
  {
    id: 'result',
    title: 'Result',
    icon: Award,
    badgeBg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  onOpenWorkspace,
  onNavigateDiscovery,
}) => {
  const { scholarships, trackedApplications } = useScholarshipContext();

  const scholarshipMap = new Map(scholarships.map((s) => [s.id, s]));

  let totalPipelinePotential = 0;
  let totalAwardedFunding = 0;

  trackedApplications.forEach((app) => {
    const grant = scholarshipMap.get(app.scholarshipId);
    if (grant) {
      if (app.stage === 'result' && app.resultOutcome === 'awarded') {
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

    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `grantly-application-portfolio-${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section aria-label="Application Pipeline Tracker" className="space-y-6">
      {/* Top Pipeline Analytics Strip */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-emerald-600 dark:text-emerald-400">SCHOLARSHIP WORKSPACE</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="eyebrow text-[var(--text-muted)]">5-STAGE KANBAN PIPELINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Application Pipeline & Status Tracker
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Track opportunities across 5 progressive stages with automatic document progress persistence.
          </p>
        </div>

        {/* Aggregated Pipeline Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl">
            <span className="eyebrow text-[var(--text-muted)] block text-[9px]">TOTAL PIPELINE VALUE</span>
            <span className="text-lg font-bold font-mono text-[var(--text-primary)]">
              {formatCurrency(totalPipelinePotential)}
            </span>
          </div>

          <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">
            <span className="eyebrow text-emerald-700 dark:text-emerald-400 block text-[9px]">CONFIRMED WON & AWARDED</span>
            <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">
              {formatCurrency(totalAwardedFunding)}
            </span>
          </div>

          <button
            onClick={handleExportJson}
            className="btn-panel px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download JSON Portfolio Export"
            aria-label="Export tracked applications as JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Portfolio</span>
          </button>
        </div>
      </div>

      {/* 5-Column Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map((col) => {
          const Icon = col.icon;
          const colApps = trackedApplications.filter((app) => app.stage === col.id);
          const colFunding = colApps.reduce((acc, app) => {
            const g = scholarshipMap.get(app.scholarshipId);
            return acc + (g?.amount || 0);
          }, 0);

          return (
            <div
              key={col.id}
              className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-4 flex flex-col space-y-3 min-h-[420px] shadow-xs"
              aria-label={`${col.title} column with ${colApps.length} applications`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-card)]">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                  <h2 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    {col.title}
                  </h2>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${col.badgeBg}`}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Sub-total funding for column */}
              <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center justify-between h-4">
                <span>Total Pool</span>
                <span className="font-semibold">{colFunding > 0 ? formatCurrency(colFunding) : '₹0'}</span>
              </div>

              {/* Card List in Column */}
              <div className="space-y-3 flex-1">
                {colApps.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-[var(--border-card)] rounded-xl text-[11px] text-[var(--text-muted)] px-2">
                    No schemes in {col.title.toLowerCase()}
                  </div>
                ) : (
                  colApps.map((app) => {
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

      {/* Bottom Hint Banner */}
      {trackedApplications.length === 0 && (
        <div className="p-8 text-center bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl space-y-3 shadow-xs">
          <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h2 className="text-base font-bold text-[var(--text-primary)]">Your Application Pipeline is Clean</h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Browse verified scholarships in the feed and tap "Track" to organize deadlines, document checklists, and outcomes.
          </p>
          <button
            onClick={onNavigateDiscovery}
            className="btn-mint px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Discover Opportunities</span>
          </button>
        </div>
      )}
    </section>
  );
};
