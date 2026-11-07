import React, { useState, useCallback, useMemo } from 'react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { DocumentStatus, DocumentVaultItem } from '../../types/scholarship';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface DocumentRowCardProps {
  doc: DocumentVaultItem;
  isToggled: boolean;
  onStatusChange: (docId: string, newStatus: DocumentStatus) => void;
}

const getStatusBadge = (status: DocumentStatus) => {
  switch (status) {
    case 'uploaded':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
        label: 'VERIFIED IN VAULT',
        icon: CheckCircle2,
      };
    case 'expiring':
      return {
        bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
        label: 'RENEWAL DUE SOON',
        icon: Clock,
      };
    case 'missing':
    default:
      return {
        bg: 'bg-red-50 dark:bg-red-500/10 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/30',
        label: 'ACTION REQUIRED',
        icon: AlertTriangle,
      };
  }
};

const DocumentRowCard = React.memo<DocumentRowCardProps>(({
  doc,
  isToggled,
  onStatusChange,
}) => {
  const badge = getStatusBadge(doc.status);
  const BadgeIcon = badge.icon;

  return (
    <article
      className={`bg-[var(--bg-card)] border rounded-2xl p-5 transition-all space-y-4 shadow-xs ${
        isToggled
          ? 'border-emerald-500 scale-[1.01]'
          : 'border-[var(--border-card)] hover:border-[var(--border-card-hover)]'
      }`}
      aria-labelledby={`doc-title-${doc.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-hover)] border border-[var(--border-card)] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
            <FileText className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="eyebrow text-[var(--text-muted)] block text-[9px]">{doc.category}</span>
            <h2 id={`doc-title-${doc.id}`} className="text-sm font-bold text-[var(--text-primary)] tracking-tight truncate">
              {doc.name}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
              {doc.description}
            </p>
          </div>
        </div>

        <div
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 shrink-0 ${badge.bg}`}
        >
          <BadgeIcon className="w-3 h-3" />
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Document metadata & reuse info */}
      <div className="p-3 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="truncate">
            Universal reuse across <strong className="text-[var(--text-primary)]">all matching schemes</strong>
          </span>
        </div>
        {doc.expiryNote && (
          <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 shrink-0 ml-2">
            {doc.expiryNote}
          </span>
        )}
      </div>

      {/* Action Controls for Status */}
      <div className="pt-2 border-t border-[var(--border-card)] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[var(--text-muted)]">Toggle Status:</span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onStatusChange(doc.id, 'uploaded')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
              doc.status === 'uploaded'
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                : 'bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-emerald-700 dark:hover:text-emerald-400'
            }`}
          >
            ✓ Ready
          </button>

          <button
            type="button"
            onClick={() => onStatusChange(doc.id, 'expiring')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
              doc.status === 'expiring'
                ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-slate-950 font-bold shadow-xs'
                : 'bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-amber-700 dark:hover:text-amber-400'
            }`}
          >
            ▲ Expiring
          </button>

          <button
            type="button"
            onClick={() => onStatusChange(doc.id, 'missing')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
              doc.status === 'missing'
                ? 'bg-red-600 text-white dark:bg-red-500 dark:text-slate-950 font-bold shadow-xs'
                : 'bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-red-700 dark:hover:text-red-400'
            }`}
          >
            ✕ Missing
          </button>
        </div>
      </div>
    </article>
  );
});
DocumentRowCard.displayName = 'DocumentRowCard';

/**
 * Document vault dashboard view with live Application Readiness gauge and category filters
 */
export const DocumentVaultView: React.FC = () => {
  const { documentVault, updateDocumentStatus, readinessPercentage, setActiveTab } =
    useScholarshipContext();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [justToggledId, setJustToggledId] = useState<string | null>(null);

  const categories = ['All', 'Academic', 'Income & Social', 'Identity', 'Institutional'];

  const filteredDocs = useMemo(() => {
    return filterCategory === 'All'
      ? documentVault
      : documentVault.filter((d) => d.category === filterCategory);
  }, [documentVault, filterCategory]);

  const uploadedCount = useMemo(() => documentVault.filter((d) => d.status === 'uploaded').length, [documentVault]);
  const missingCount = useMemo(() => documentVault.filter((d) => d.status === 'missing').length, [documentVault]);
  const expiringCount = useMemo(() => documentVault.filter((d) => d.status === 'expiring').length, [documentVault]);

  const handleStatusChange = useCallback(
    (docId: string, newStatus: DocumentStatus) => {
      updateDocumentStatus(docId, newStatus);
      setJustToggledId(docId);
      setTimeout(() => setJustToggledId(null), 1200);
    },
    [updateDocumentStatus]
  );

  return (
    <section aria-label="Document Vault and Application Readiness" className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-emerald-600 dark:text-emerald-400">DOCUMENT VAULT</span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="eyebrow text-[var(--text-muted)]">CENTRALIZED REUSABLE VAULT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Universal Document Vault & Readiness Score
          </h2>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Scholarship rejections occur mostly from last-minute missing certificates, invalid formats, or expired seals.
            Upload once to your local vault — Grantly reuses them across Central NSP, State DBT, and corporate CSR applications.
          </p>
        </div>
      </div>

      {/* Live Application Readiness Gauge Banner */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Readiness Score Big Metric */}
          <div className="md:col-span-1 text-center md:text-left space-y-1 md:border-r md:border-[var(--border-card)] md:pr-6">
            <span className="eyebrow text-[var(--text-muted)] block">APPLICATION READINESS</span>
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {readinessPercentage}%
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)]">READY</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              {readinessPercentage >= 75
                ? 'High Readiness — eligible to instantly apply for most schemes.'
                : 'Upload pending documents to unlock 1-click apply readiness.'}
            </p>
          </div>

          {/* Progress Bar & Status Counters */}
          <div className="md:col-span-3 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--text-secondary)]">
                  {uploadedCount} of {documentVault.length} Common Prerequisites Verified
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {readinessPercentage}% Complete
                </span>
              </div>

              <div className="h-3 w-full bg-[var(--bg-card-hover)] rounded-full overflow-hidden border border-[var(--border-card)]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{ width: `${readinessPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={readinessPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            {/* Quick Stat Chips */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-[var(--text-primary)]">{uploadedCount} Ready</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-[var(--text-primary)]">{expiringCount} Expiring Soon</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card-hover)] border border-[var(--border-card)] rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span className="font-bold text-[var(--text-primary)]">{missingCount} Missing</span>
              </div>

              <div className="flex items-center gap-1.5 ml-auto text-[11px] text-[var(--text-muted)]">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Zero Cloud Upload: Stored Securely in Browser Memory</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                  : 'bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveTab('discovery')}
          className="btn-panel px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Match With Current Vault</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc: DocumentVaultItem) => (
          <DocumentRowCard
            key={doc.id}
            doc={doc}
            isToggled={justToggledId === doc.id}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </section>
  );
};
