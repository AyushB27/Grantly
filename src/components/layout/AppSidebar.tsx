import React from 'react';
import {
  GraduationCap,
  Search,
  AlertCircle,
  ShieldCheck,
  CheckSquare,
  Clock,
  Layers,
  Calculator,
  User,
  LogOut,
  Sun,
  Moon,
  RotateCcw,
  X,
} from 'lucide-react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { ActiveTab } from '../../context/ScholarshipContext';

interface AppSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onOpenComparison?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isMobileOpen = false,
  onMobileClose,
  onOpenComparison,
}) => {
  const {
    activeTab,
    setActiveTab,
    trackedApplications,
    readinessPercentage,
    comparisonIds,
    currentUser,
    profile,
    theme,
    toggleTheme,
    setCurrentView,
    logout,
    resetAllToSeedData,
  } = useScholarshipContext();

  const primaryNavItems: {
    id: ActiveTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string | number;
  }[] = [
    {
      id: 'discovery',
      label: 'Feed & Match',
      description: 'Personalized Schemes',
      icon: Search,
    },
    {
      id: 'gaps',
      label: 'Almost Eligible',
      description: 'Gap Diagnostics',
      icon: AlertCircle,
    },
    {
      id: 'vault',
      label: 'Document Vault',
      description: 'Readiness & Uploads',
      icon: ShieldCheck,
      badge: `${readinessPercentage}%`,
    },
    {
      id: 'tracker',
      label: 'Pipeline Tracker',
      description: '5-Stage Application Board',
      icon: CheckSquare,
      badge: trackedApplications.length > 0 ? trackedApplications.length : undefined,
    },
  ];

  const financialToolItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: 'deadlines', label: 'Deadlines Radar', icon: Clock },
    { id: 'stack', label: 'Stack Planner', icon: Layers },
    { id: 'calculator', label: 'Tuition Fee Gap', icon: Calculator },
  ];

  const handleSelectTab = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleSignOut = () => {
    logout();
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleEditProfile = () => {
    setCurrentView('onboarding');
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111827] border-r border-[#1e293b] text-[#f8fafc] w-64 lg:w-72 selection:bg-emerald-500/20">
      {/* 1. Header: Branding & Portal Title */}
      <div className="p-5 border-b border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#162032] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#f8fafc] block leading-tight">
              GRANTLY
            </span>
            <span className="text-[10px] font-sans font-medium text-emerald-400 block tracking-wide">
              Scholarship Portal
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#162032]"
            aria-label="Close navigation sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 2. Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Core Workspaces */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#64748b] block mb-2 font-semibold">
            Workspaces
          </span>
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold shadow-xs'
                    : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#162032] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-[#162032] text-[#94a3b8] group-hover:text-[#f8fafc]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-sans block leading-snug">{item.label}</span>
                    <span className="text-[10px] text-[#64748b] block truncate">
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-[#1e293b] text-[#94a3b8]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Financial Tools */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#64748b] block mb-2 font-semibold">
            Planning & Deadlines
          </span>
          {financialToolItems.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => handleSelectTab(tool.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-sans transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold'
                    : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#162032]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-[#64748b]'}`} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* Comparison Trigger if Active */}
        {comparisonIds.length > 0 && onOpenComparison && (
          <div className="px-1 pt-2">
            <button
              onClick={() => {
                onOpenComparison();
                if (onMobileClose) onMobileClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-sans font-medium hover:bg-blue-500/20 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Compare Schemes
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500 text-slate-950 text-[10px] font-mono font-bold">
                {comparisonIds.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Footer: User Profile & Utility Bar */}
      <div className="p-3 border-t border-[#1e293b] space-y-2 bg-[#0b0f19]">
        {/* User Card */}
        <div
          onClick={handleEditProfile}
          className="p-2.5 rounded-xl bg-[#111827] border border-[#1e293b] hover:border-emerald-500/30 flex items-center justify-between cursor-pointer transition-all group"
          title="Click to calibrate your university & academic profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
              {currentUser?.avatarText || 'ST'}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#f8fafc] group-hover:text-emerald-400 block truncate transition-colors">
                {currentUser?.name || 'Aarav Sharma'}
              </span>
              <span className="text-[10px] text-[#94a3b8] block truncate">
                {profile.university || 'IIT Delhi'}
              </span>
            </div>
          </div>
          <User className="w-3.5 h-3.5 text-[#64748b] group-hover:text-emerald-400 shrink-0" />
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center gap-1.5 pt-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex-1 py-1.5 px-2 bg-[#111827] hover:bg-[#162032] border border-[#1e293b] rounded-lg text-xs font-sans text-[#94a3b8] hover:text-[#f8fafc] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-500" />
                <span>Dark</span>
              </>
            )}
          </button>

          {/* Reset Demo State */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state (profile, applications, checklist, vault)?')) {
                resetAllToSeedData();
              }
            }}
            className="p-2 bg-[#111827] hover:bg-[#162032] border border-[#1e293b] rounded-lg text-[#94a3b8] hover:text-[#f8fafc] transition-colors cursor-pointer"
            title="Reset to default benchmark data"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Sign Out (Returns to Landing Page) */}
          <button
            onClick={handleSignOut}
            className="p-2 bg-[#111827] hover:bg-red-500/10 border border-[#1e293b] hover:border-red-500/30 rounded-lg text-[#94a3b8] hover:text-red-400 transition-colors cursor-pointer"
            title="Sign Out to Landing Page"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-xs flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          onClick={onMobileClose}
        >
          <div className="h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
