import React from 'react';
import {
  X,
  Search,
  CheckSquare,
  Calculator,
  User,
  RotateCcw,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import type { ActiveTab } from '../../context/ScholarshipContext';
import { useScholarshipContext } from '../../context/ScholarshipContext';

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
  const { trackedApplications, readinessPercentage, setIsOnboardingOpen } = useScholarshipContext();

  if (!isOpen) return null;

  const navItems = [
    { id: 'discovery' as ActiveTab, label: 'Feed & Match Engine', icon: Search },
    { id: 'gaps' as ActiveTab, label: 'Almost Eligible (F4)', icon: AlertTriangle },
    { id: 'vault' as ActiveTab, label: `Document Vault (${readinessPercentage}%)`, icon: ShieldCheck },
    {
      id: 'tracker' as ActiveTab,
      label: `Pipeline (${trackedApplications.length})`,
      icon: CheckSquare,
    },
    { id: 'deadlines' as ActiveTab, label: 'Deadlines Radar (F7)', icon: Clock },
    { id: 'stack' as ActiveTab, label: 'Stack Planner (Stretch)', icon: Layers },
    { id: 'calculator' as ActiveTab, label: 'Tuition Fee Gap', icon: Calculator },
  ];

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Drawer"
      onClick={onClose}
    >
      <div
        className="w-4/5 max-w-sm bg-[#101313] border-l border-[#222827] h-full shadow-2xl p-6 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222827]">
            <div>
              <span className="font-black text-lg text-[#edf1ec] block">GRANTLY</span>
              <span className="eyebrow text-[#a9f46b] text-[9px]">SCHOLARSHIP CO-PILOT</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#89918c] hover:text-[#a9f46b] rounded-lg hover:bg-[#141818] transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1.5" aria-label="Mobile Drawer Navigation">
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#141818] text-[#a9f46b] font-bold border border-[#a9f46b]/30'
                      : 'text-[#89918c] hover:bg-[#141818] hover:text-[#edf1ec]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 text-[#a9f46b]" aria-hidden="true" />
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
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#141818] border border-[#a9f46b]/40 text-[#a9f46b] rounded-xl text-xs font-mono font-bold"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Compare Selected Grants
              </span>
              <span className="px-2 py-0.5 bg-[#a9f46b] text-[#090b0b] rounded-full text-[10px] font-black">
                {comparisonCount}
              </span>
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-[#222827] space-y-2">
          <button
            onClick={() => {
              setIsOnboardingOpen(true);
              onClose();
            }}
            className="btn-mint w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Edit Match Profile</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo state to initial benchmarks?')) {
                onResetData();
                onClose();
              }
            }}
            className="w-full py-2 text-xs font-mono text-[#89918c] hover:text-[#ff8e91] flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
