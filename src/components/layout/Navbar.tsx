import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  CheckSquare,
  Calculator,
  User,
  Layers,
  Menu,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useScholarshipContext } from '../../context/ScholarshipContext';
import type { ActiveTab } from '../../context/ScholarshipContext';
import { SkipLink } from '../common/SkipLink';
import { MobileDrawer } from './MobileDrawer';

interface NavbarProps {
  onOpenComparison: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenComparison }) => {
  const {
    activeTab,
    setActiveTab,
    comparisonIds,
    resetAllToSeedData,
    trackedApplications,
    profile,
    readinessPercentage,
    setIsOnboardingOpen,
  } = useScholarshipContext();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { id: 'discovery' as ActiveTab, label: 'Feed', icon: Search },
    { id: 'gaps' as ActiveTab, label: 'Almost Eligible', icon: AlertTriangle, isSignature: true },
    { id: 'vault' as ActiveTab, label: 'Document Vault', icon: ShieldCheck, isSignature: true },
    {
      id: 'tracker' as ActiveTab,
      label: 'Pipeline',
      icon: CheckSquare,
      badge: trackedApplications.length,
    },
    { id: 'deadlines' as ActiveTab, label: 'Deadlines', icon: Clock },
    { id: 'stack' as ActiveTab, label: 'Stack Planner', icon: Layers },
    { id: 'calculator' as ActiveTab, label: 'Tuition Gap', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090b0b]/90 backdrop-blur-md border-b border-[#222827]">
      <SkipLink />
      <div className="responsive-container">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('discovery')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-[#a9f46b] rounded-xl p-1 group"
              aria-label="GRANTLY home - return to scholarship discovery"
            >
              <div className="w-8 h-8 rounded-xl bg-[#141818] border border-[#222827] flex items-center justify-center text-[#a9f46b] group-hover:border-[#a9f46b] transition-all">
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="font-black text-base sm:text-lg tracking-tight text-[#edf1ec] block leading-tight">
                  GRANTLY
                </span>
                <span className="eyebrow text-[#a9f46b] block text-[9px]">
                  SCHOLARSHIP CO-PILOT
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-[#101313] p-1 rounded-xl border border-[#222827]"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all relative ${
                    isActive
                      ? 'bg-[#141818] text-[#a9f46b] font-bold border border-[#a9f46b]/40 shadow-xs'
                      : 'text-[#89918c] hover:text-[#edf1ec] hover:bg-[#141818]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full font-mono text-[9px] font-bold ${
                        isActive
                          ? 'bg-[#a9f46b] text-[#090b0b]'
                          : 'bg-[#191f1e] text-[#89918c]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2">
            {/* Compare Button (if any selected) */}
            {comparisonIds.length > 0 && (
              <button
                onClick={onOpenComparison}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141818] border border-[#a9f46b]/40 text-[#a9f46b] hover:bg-[#191f1e] rounded-xl text-xs font-mono font-bold transition-all focus:ring-2 focus:ring-[#a9f46b]"
                aria-label={`Compare ${comparisonIds.length} selected scholarships`}
              >
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Compare</span>
                <span className="bg-[#a9f46b] text-[#090b0b] px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black">
                  {comparisonIds.length}
                </span>
              </button>
            )}

            {/* Live Vault Readiness Pill */}
            <button
              onClick={() => setActiveTab('vault')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#101313] hover:bg-[#141818] border border-[#222827] rounded-xl text-xs font-mono transition-colors"
              title="Universal Document Vault Readiness"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#a9f46b]" />
              <span className="text-[#89918c] hidden md:inline">Vault:</span>
              <span className="font-bold text-[#a9f46b]">{readinessPercentage}%</span>
            </button>

            {/* Quick Profile Pill / Trigger */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#101313] hover:bg-[#141818] border border-[#222827] hover:border-[#38423f] rounded-xl text-xs font-mono text-[#edf1ec] transition-colors"
              title="Edit Student Match Profile"
              aria-label="Edit Student Profile"
            >
              <div className="w-5 h-5 rounded-full bg-[#141818] border border-[#a9f46b]/40 text-[#a9f46b] flex items-center justify-center text-[10px] font-bold">
                <User className="w-3 h-3" />
              </div>
              <span className="hidden sm:inline font-bold">{profile.fullName.split(' ')[0]}</span>
              <span className="text-[10px] text-[#a9f46b] bg-[#a9f46b]/10 px-1.5 py-0.2 rounded border border-[#a9f46b]/20">
                {profile.marksCgpa.toFixed(2)} CGPA
              </span>
            </button>

            {/* Demo Reset */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo state (profile, applications, checklist, vault)?')) {
                  resetAllToSeedData();
                }
              }}
              title="Reset state to initial benchmark data"
              className="p-2 text-[#89918c] hover:text-[#edf1ec] hover:bg-[#141818] rounded-xl transition-colors focus:ring-2 focus:ring-[#a9f46b] border border-[#222827]"
              aria-label="Reset demo dataset to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 text-[#edf1ec] hover:bg-[#141818] rounded-xl focus:ring-2 focus:ring-[#a9f46b] border border-[#222827]"
              aria-expanded={mobileDrawerOpen}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        comparisonCount={comparisonIds.length}
        onOpenComparison={onOpenComparison}
        onResetData={resetAllToSeedData}
      />
    </header>
  );
};
