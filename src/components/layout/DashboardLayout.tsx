import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import {
  Menu,
  ShieldCheck,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import type { ActiveTab } from '../../context/ScholarshipContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onOpenComparison: () => void;
}

const SECTION_HEADERS: Record<ActiveTab, { title: string; subtitle: string }> = {
  discovery: {
    title: 'Scholarship Opportunities',
    subtitle: 'Verified Central, State, and CSR grants matching your profile',
  },
  gaps: {
    title: 'Almost Eligible Gap Diagnostics',
    subtitle: 'Actionable steps to qualify for near-miss high-value scholarships',
  },
  vault: {
    title: 'Universal Document Vault',
    subtitle: 'Upload documents once and verify readiness across all portal guidelines',
  },
  tracker: {
    title: 'Application Pipeline',
    subtitle: '5-stage progress tracking from saved through to fund disbursement',
  },
  deadlines: {
    title: 'Deadlines Radar',
    subtitle: 'Time-sensitive opportunities organized by closing urgency',
  },
  stack: {
    title: 'Scholarship Stack Planner',
    subtitle: 'Combine compatible awards and identify official policy restrictions',
  },
  calculator: {
    title: 'Net Tuition Fee Gap Analysis',
    subtitle: 'Evaluate total matched assistance against your annual institution expenses',
  },
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onOpenComparison,
}) => {
  const { activeTab, readinessPercentage, trackedApplications, setCurrentView } =
    useScholarshipContext();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const headerInfo = SECTION_HEADERS[activeTab] || {
    title: 'Grantly Portal',
    subtitle: 'Educational financial assistance co-pilot',
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] flex selection:bg-emerald-500/20">
      {/* 1. Dedicated Side Drawer / Sidebar (NO TOP NAVBAR) */}
      <AppSidebar
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onOpenComparison={onOpenComparison}
      />

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Modern Minimalist Dashboard Top Bar */}
        <header className="sticky top-0 z-20 h-16 bg-[#111827]/90 backdrop-blur-md border-b border-[#1e293b] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#162032] border border-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc] cursor-pointer"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-[#f8fafc] truncate leading-tight">
                {headerInfo.title}
              </h1>
              <p className="text-xs text-[#94a3b8] truncate hidden sm:block">
                {headerInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right Status Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Vault Readiness Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#162032] border border-[#1e293b] text-xs font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[#94a3b8] hidden sm:inline">Vault:</span>
              <span className="font-bold text-emerald-400 font-mono">{readinessPercentage}%</span>
            </div>

            {/* Pipeline Count Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#162032] border border-[#1e293b] text-xs font-sans">
              <CheckSquare className="w-4 h-4 text-[#38bdf8]" />
              <span className="text-[#94a3b8]">Active:</span>
              <span className="font-bold text-[#f8fafc] font-mono">{trackedApplications.length}</span>
            </div>

            {/* Calibrate Profile Button */}
            <button
              onClick={() => setCurrentView('onboarding')}
              className="btn-panel px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 hover:border-emerald-500/40 cursor-pointer"
              title="Calibrate your university & academic criteria"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Calibrate</span>
            </button>
          </div>
        </header>

        {/* 3. Dashboard Functional Workspace */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
};
