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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <SkipLink />
      <div className="responsive-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('discovery')}
              className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
              aria-label="GRANTLY home - return to scholarship discovery"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <GraduationCap className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                  GRANTLY
                </span>
                <span className="text-[11px] font-medium text-indigo-700 tracking-wide uppercase block">
                  Scholarship Experience
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/80"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
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
          <div className="flex items-center gap-2">
            {comparisonIds.length > 0 && (
              <button
                onClick={onOpenComparison}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors focus:ring-2 focus:ring-indigo-500"
                aria-label={`Compare ${comparisonIds.length} selected scholarships`}
              >
                <Layers className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <span className="hidden sm:inline">Compare</span>
                <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {comparisonIds.length}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('Reset all demo state (profile, applications, checklist)?')) {
                  resetAllToSeedData();
                }
              }}
              title="Reset state to initial benchmark data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500"
              aria-label="Reset demo dataset to initial state"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500"
              aria-expanded={mobileDrawerOpen}
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
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
