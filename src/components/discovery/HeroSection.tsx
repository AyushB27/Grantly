import React from 'react';
import { Sparkles, ShieldCheck, TrendingUp, IndianRupee, Layers } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useScholarshipContext } from '../../context/ScholarshipContext';

interface HeroSectionProps {
  totalAvailableFunding: number;
  totalGrantsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalAvailableFunding,
  totalGrantsCount,
}) => {
  const { readinessPercentage, setActiveTab, setIsOnboardingOpen } = useScholarshipContext();

  return (
    <section aria-label="Welcome and Platform Overview" className="relative mb-8 overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#a9f46b]/10 via-[#101313]/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="pt-4 pb-2 max-w-4xl mx-auto text-center space-y-4">
        {/* Pulsing Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101313] border border-[#222827] text-xs font-mono">
          <span className="flex h-2 w-2 rounded-full bg-[#a9f46b] animate-pulse" />
          <span className="text-[#89918c]">INDIAN SCHOLARSHIP CO-PILOT</span>
          <span className="text-[#525c57]">•</span>
          <span className="text-[#a9f46b] font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#a9f46b]" />
            NSP Central, State DBT & Premier CSR
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#edf1ec] tracking-tight leading-[1.12]">
          Higher Education Funding,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a9f46b] via-[#bcfb8b] to-[#7ccb3e]">
            Without the Confusion.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#89918c] max-w-2xl mx-auto leading-relaxed">
          Students miss scholarships not from lack of qualification, but because requirements are dense and scattered.
          Grantly matches your verified profile to real Indian schemes with plain-language checklists and gap repair.
        </p>

        {/* Quick Action Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="btn-mint px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Calibrate Match Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className="btn-panel px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#a9f46b]" />
            <span>Vault Readiness: {readinessPercentage}%</span>
          </button>

          <button
            onClick={() => setActiveTab('gaps')}
            className="btn-panel px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 text-[#f7ba53] hover:text-white"
          >
            <Layers className="w-4 h-4" />
            <span>Almost Eligible Gap Analysis</span>
          </button>
        </div>

        {/* Metric Badges Strip */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#101313] rounded-xl border border-[#222827]">
            <div className="w-6 h-6 rounded-lg bg-[#141818] border border-[#222827] flex items-center justify-center text-[#a9f46b]">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono font-bold text-[#edf1ec]">{formatCurrency(totalAvailableFunding)}</span>
            <span className="text-[#89918c]">catalog pool</span>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#101313] rounded-xl border border-[#222827]">
            <div className="w-6 h-6 rounded-lg bg-[#141818] border border-[#222827] flex items-center justify-center text-[#70b4ff]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono font-bold text-[#edf1ec]">{totalGrantsCount} Verified Schemes</span>
            <span className="text-[#89918c]">NSP & Corporate</span>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#101313] rounded-xl border border-[#222827]">
            <div className="w-6 h-6 rounded-lg bg-[#141818] border border-[#222827] flex items-center justify-center text-[#c084fc]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono font-bold text-[#edf1ec]">100% Free Open Platform</span>
            <span className="text-[#89918c]">zero middlemen</span>
          </div>
        </div>
      </div>
    </section>
  );
};
