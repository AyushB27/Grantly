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
  } = useScholarshipContext();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { id: 'discovery' as ActiveTab, label: 'Discover & Match', icon: Search },
    {
      id: 'tracker' as ActiveTab,
      label: 'Application Tracker',
      icon: CheckSquare,
      badge: trackedApplications.length,
    },
    { id: 'calculator' as ActiveTab, label: 'Aid & Tuition Gap', icon: Calculator },
    { id: 'profile' as ActiveTab, label: 'Student Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <SkipLink />
      <div className="responsive-container">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('discovery')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1 group"
              aria-label="GRANTLY home - return to scholarship discovery"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                  GRANTLY
                </span>
                <span className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase block">
                  Scholarship Experience
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-2xs"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Utilities: Compare Button & Demo Reset */}
          <div className="flex items-center gap-2.5">
            {comparisonIds.length > 0 && (
              <button
                onClick={onOpenComparison}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                aria-label={`Compare ${comparisonIds.length} selected scholarships`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                <span className="hidden sm:inline">Compare</span>
                <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black">
                  {comparisonIds.length}
                </span>
              </button>
            )}

            {/* Quick Profile Pill */}
            <button
              onClick={() => setActiveTab('profile')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
              title="Open Student Profile"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                {profile.fullName.split(' ').map((n) => n[0]).join('')}
              </div>
              <span className="text-slate-800">{profile.fullName}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm border border-emerald-200">
                {profile.gpa.toFixed(2)}
              </span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo state (profile, applications, checklist)?')) {
                  resetAllToSeedData();
                }
              }}
              title="Reset state to initial benchmark data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:ring-2 focus:ring-indigo-500 border border-slate-200/60"
              aria-label="Reset demo dataset to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 border border-slate-200"
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
