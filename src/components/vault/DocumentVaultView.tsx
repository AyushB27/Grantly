import React, { useState } from 'react';
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

export const DocumentVaultView: React.FC = () => {
  const { documentVault, updateDocumentStatus, readinessPercentage, setActiveTab } =
    useScholarshipContext();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [justToggledId, setJustToggledId] = useState<string | null>(null);

  const categories = ['All', 'Academic', 'Income & Social', 'Identity', 'Institutional'];

  const filteredDocs =
    filterCategory === 'All'
      ? documentVault
      : documentVault.filter((d) => d.category === filterCategory);

  const uploadedCount = documentVault.filter((d) => d.status === 'uploaded').length;
  const missingCount = documentVault.filter((d) => d.status === 'missing').length;
  const expiringCount = documentVault.filter((d) => d.status === 'expiring').length;

  const handleStatusChange = (docId: string, newStatus: DocumentStatus) => {
    updateDocumentStatus(docId, newStatus);
    setJustToggledId(docId);
    setTimeout(() => setJustToggledId(null), 1200);
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'uploaded':
        return {
          bg: 'bg-[#a9f46b]/10 text-[#a9f46b] border-[#a9f46b]/30',
          label: 'VERIFIED IN VAULT',
          icon: CheckCircle2,
        };
      case 'expiring':
        return {
          bg: 'bg-[#f7ba53]/10 text-[#f7ba53] border-[#f7ba53]/30',
          label: 'RENEWAL DUE SOON',
          icon: Clock,
        };
      case 'missing':
      default:
        return {
          bg: 'bg-[#ff8e91]/10 text-[#ff8e91] border-[#ff8e91]/30',
          label: 'ACTION REQUIRED',
          icon: AlertTriangle,
        };
    }
  };

  return (
    <section aria-label="Document Vault and Application Readiness" className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#a9f46b]/10 via-[#70b4ff]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-[#a9f46b]">F5 SIGNATURE FEATURE</span>
            <span className="text-[#525c57]">•</span>
            <span className="eyebrow text-[#89918c]">CENTRALIZED REUSABLE VAULT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#edf1ec] tracking-tight">
            Universal Document Vault & Readiness Score
          </h1>

          <p className="text-sm text-[#89918c] leading-relaxed">
            Scholarship rejections occur mostly from last-minute missing certificates, invalid formats, or expired seals.
            Upload once to your local vault — Grantly reuses them across Central NSP, State DBT, and corporate CSR applications.
          </p>
        </div>
      </div>

      {/* Live Application Readiness Gauge Banner */}
      <div className="p-6 bg-[#101313] border border-[#222827] rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Readiness Score Big Metric */}
          <div className="md:col-span-1 text-center md:text-left space-y-1 md:border-r md:border-[#222827] md:pr-6">
            <span className="eyebrow text-[#89918c] block">APPLICATION READINESS</span>
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-4xl sm:text-5xl font-black font-mono text-[#a9f46b]">
                {readinessPercentage}%
              </span>
              <span className="text-xs font-mono text-[#89918c]">READY</span>
            </div>
            <p className="text-[11px] text-[#525c57]">
              {readinessPercentage >= 75
                ? 'High Readiness — eligible to instantly apply for most schemes.'
                : 'Upload pending documents to unlock 1-click apply readiness.'}
            </p>
          </div>

          {/* Progress Bar & Status Counters */}
          <div className="md:col-span-3 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#89918c]">
                  {uploadedCount} of {documentVault.length} Common Prerequisites Verified
                </span>
                <span className="text-[#a9f46b] font-bold">
                  {readinessPercentage}% Complete
                </span>
              </div>

              <div className="h-3 w-full bg-[#141818] rounded-full overflow-hidden border border-[#222827]">
                <div
                  className="h-full bg-gradient-to-r from-[#70b4ff] via-[#a9f46b] to-[#a9f46b] transition-all duration-500 rounded-full"
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
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141818] border border-[#a9f46b]/30 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#a9f46b]" />
                <span className="font-bold text-[#edf1ec]">{uploadedCount} Ready</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141818] border border-[#f7ba53]/30 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-[#f7ba53]" />
                <span className="font-bold text-[#edf1ec]">{expiringCount} Expiring Soon</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141818] border border-[#ff8e91]/30 rounded-xl">
                <AlertTriangle className="w-3.5 h-3.5 text-[#ff8e91]" />
                <span className="font-bold text-[#edf1ec]">{missingCount} Missing</span>
              </div>

              <div className="flex items-center gap-1.5 ml-auto text-[11px] text-[#89918c]">
                <ShieldCheck className="w-4 h-4 text-[#70b4ff]" />
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
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
                filterCategory === cat
                  ? 'bg-[#a9f46b] text-[#090b0b] font-bold'
                  : 'bg-[#101313] border border-[#222827] text-[#89918c] hover:text-[#edf1ec] hover:border-[#38423f]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setActiveTab('discovery')}
          className="btn-panel px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#a9f46b]" />
          <span>Match With Current Vault</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc: DocumentVaultItem) => {
          const badge = getStatusBadge(doc.status);
          const BadgeIcon = badge.icon;
          const isToggled = justToggledId === doc.id;

          return (
            <article
              key={doc.id}
              className={`bg-[#101313] border rounded-2xl p-5 transition-all space-y-4 ${
                isToggled
                  ? 'border-[#a9f46b] scale-[1.01]'
                  : 'border-[#222827] hover:border-[#38423f]'
              }`}
              aria-labelledby={`doc-title-${doc.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#141818] border border-[#222827] flex items-center justify-center text-[#a9f46b] shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="eyebrow text-[#89918c] block text-[9px]">{doc.category}</span>
                    <h2 id={`doc-title-${doc.id}`} className="text-sm font-bold text-[#edf1ec] tracking-tight">
                      {doc.name}
                    </h2>
                    <p className="text-[11px] text-[#89918c] line-clamp-1">
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
              <div className="p-3 bg-[#141818] border border-[#222827] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[#89918c]">
                  <Layers className="w-3.5 h-3.5 text-[#70b4ff]" />
                  <span>
                    Universal reuse across <strong className="text-[#edf1ec]">all matching schemes</strong>
                  </span>
                </div>
                {doc.expiryNote && (
                  <span className="font-mono text-[10px] text-[#f7ba53]">
                    {doc.expiryNote}
                  </span>
                )}
              </div>

              {/* Action Controls for Status */}
              <div className="pt-2 border-t border-[#222827] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#525c57]">Toggle Status:</span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(doc.id, 'uploaded')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                      doc.status === 'uploaded'
                        ? 'bg-[#a9f46b] text-[#090b0b] font-bold'
                        : 'bg-[#141818] border border-[#222827] text-[#89918c] hover:text-[#a9f46b]'
                    }`}
                  >
                    ✓ Ready
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(doc.id, 'expiring')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                      doc.status === 'expiring'
                        ? 'bg-[#f7ba53] text-[#090b0b] font-bold'
                        : 'bg-[#141818] border border-[#222827] text-[#89918c] hover:text-[#f7ba53]'
                    }`}
                  >
                    ▲ Expiring
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(doc.id, 'missing')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                      doc.status === 'missing'
                        ? 'bg-[#ff8e91] text-[#090b0b] font-bold'
                        : 'bg-[#141818] border border-[#222827] text-[#89918c] hover:text-[#ff8e91]'
                    }`}
                  >
                    ✕ Missing
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
