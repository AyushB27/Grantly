import React from 'react';
import { ShieldCheck, IndianRupee, CheckSquare } from 'lucide-react';
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
  const { readinessPercentage, setActiveTab, trackedApplications } = useScholarshipContext();

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Total Matched Opportunity Pool */}
      <div className="p-4 bg-[#111827] border border-[#1e293b] rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] block font-semibold">
            TOTAL MATCHED OPPORTUNITY
          </span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatCurrency(totalAvailableFunding)}
          </div>
          <span className="text-[11px] text-[#64748b] block">
            {totalGrantsCount} Verified National & CSR Schemes
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <IndianRupee className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Document Vault Readiness */}
      <div
        onClick={() => setActiveTab('vault')}
        className="p-4 bg-[#111827] border border-[#1e293b] hover:border-emerald-500/30 rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] block font-semibold">
            DOCUMENT VAULT READINESS
          </span>
          <div className="text-xl font-bold font-mono text-[#f8fafc] group-hover:text-emerald-400 transition-colors">
            {readinessPercentage}% Complete
          </div>
          <span className="text-[11px] text-[#64748b] block">
            Marksheets, Income & Domicile
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Active Applications in Pipeline */}
      <div
        onClick={() => setActiveTab('tracker')}
        className="p-4 bg-[#111827] border border-[#1e293b] hover:border-emerald-500/30 rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] block font-semibold">
            APPLICATION PIPELINE
          </span>
          <div className="text-xl font-bold font-mono text-[#f8fafc] group-hover:text-emerald-400 transition-colors">
            {trackedApplications.length} Tracked
          </div>
          <span className="text-[11px] text-[#64748b] block">
            Saved → Preparing → Submitted
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
          <CheckSquare className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
