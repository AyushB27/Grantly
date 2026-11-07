import React from 'react';
import { X, Search, CheckSquare, Calculator, User, RefreshCw, Layers } from 'lucide-react';
import type { ActiveTab } from '../../context/ScholarshipContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  comparisonCount: number;
  onOpenComparison: () => void;
  onResetData: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  comparisonCount,
  onOpenComparison,
  onResetData,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'discovery' as ActiveTab, label: 'Scholarship Discovery', icon: Search },
    { id: 'tracker' as ActiveTab, label: 'Application Pipeline', icon: CheckSquare },
    { id: 'calculator' as ActiveTab, label: 'Tuition & Aid Visualizer', icon: Calculator },
    { id: 'profile' as ActiveTab, label: 'Student Profile Simulator', icon: User },
  ];

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      onClick={onClose}
    >
      <div
        className="w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <span className="font-bold text-lg text-slate-900">Grantly Menu</span>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 focus:ring-2 focus:ring-indigo-500"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2" aria-label="Mobile Drawer Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {comparisonCount > 0 && (
            <button
              onClick={() => {
                onOpenComparison();
                onClose();
              }}
              className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-sm font-semibold"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-700" />
                Compare Selected Grants
              </span>
              <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-full text-xs">
                {comparisonCount}
              </span>
            </button>
          )}
        </div>

        <div className="pt-6 border-t border-slate-200">
          <button
            onClick={() => {
              if (window.confirm('Reset all saved applications and filters to fresh demo seed?')) {
                onResetData();
                onClose();
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
