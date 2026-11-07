import React from 'react';
import { Sparkles, ShieldCheck, TrendingUp, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface HeroSectionProps {
  totalAvailableFunding: number;
  totalGrantsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalAvailableFunding,
  totalGrantsCount,
}) => {
  return (
    <section aria-label="Welcome and Platform Overview" className="relative mb-10 overflow-hidden">
      {/* Background ambient decorative glows */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-pink-200/20 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="pt-6 pb-4 max-w-4xl mx-auto text-center space-y-4">
        {/* Pulsing Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-indigo-100 shadow-xs backdrop-blur-xs text-xs font-semibold text-indigo-900">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600">Rethinking Indian Scholarship Access</span>
          <span className="text-indigo-400">•</span>
          <span className="text-indigo-700 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            NSP, State DBT & Top CSR Trusts
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Higher Education Scholarships,{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
            Reimagined for Indian Students.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Accessing educational financial aid shouldn’t be a maze of fragmented government portals and CSR websites.
          Grantly matches your CGPA and family income to verified schemes, with plain-English document checklists.
        </p>

        {/* Metric Badges Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">{formatCurrency(totalAvailableFunding)}</span>
            <span className="text-slate-500">catalog funding</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">{totalGrantsCount} Verified Schemes</span>
            <span className="text-slate-500">central & corporate</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200/70 shadow-xs">
            <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">100% Free Portal</span>
            <span className="text-slate-500">zero intermediary fee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
