import React, { useState } from 'react';
import { ScholarshipProvider, useScholarshipContext } from './context/ScholarshipContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { HeroSection } from './components/discovery/HeroSection';
import { QuickProfileBar } from './components/profile/QuickProfileBar';
import { SearchAndFilterBar } from './components/discovery/SearchAndFilterBar';
import { ScholarshipGrid } from './components/discovery/ScholarshipGrid';
import { ScholarshipDetailModal } from './components/details/ScholarshipDetailModal';
import { ApplicationWorkspaceModal } from './components/companion/ApplicationWorkspaceModal';
import { ComparisonModal } from './components/discovery/ComparisonModal';
import { OnboardingModal } from './components/profile/OnboardingModal';
import { AuthModal } from './components/auth/AuthModal';
import { GapAnalysisView } from './components/gaps/GapAnalysisView';
import { DocumentVaultView } from './components/vault/DocumentVaultView';
import { KanbanBoard } from './components/tracker/KanbanBoard';
import { DeadlinesRadarView } from './components/deadlines/DeadlinesRadarView';
import { ScholarshipStackPlanner } from './components/stack/ScholarshipStackPlanner';
import { FinancialAidSummary } from './components/analytics/FinancialAidSummary';
import { useScholarships } from './hooks/useScholarships';
import type { EnrichedScholarship } from './hooks/useScholarships';
import { Clock, Layers, Calculator, CheckSquare } from 'lucide-react';
import type { ActiveTab } from './context/ScholarshipContext';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    activeTab,
    setActiveTab,
    selectedScholarship,
    setSelectedScholarship,
    workspaceScholarshipId,
    setWorkspaceScholarshipId,
    scholarships: allRawScholarships,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useScholarshipContext();

  const { scholarships: filteredScholarships, aidAnalytics } = useScholarships();
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);

  // Active workspace scholarship lookup
  const workspaceScholarship = workspaceScholarshipId
    ? allRawScholarships.find((s) => s.id === workspaceScholarshipId) || null
    : null;

  const handleOpenDetails = (scholarship: EnrichedScholarship) => {
    setSelectedScholarship(scholarship);
  };

  const handleOpenWorkspace = (scholarshipId: string) => {
    setWorkspaceScholarshipId(scholarshipId);
  };

  const handleSelectFromComparison = (scholarshipId: string) => {
    const found = allRawScholarships.find((s) => s.id === scholarshipId);
    if (found) {
      setSelectedScholarship(found);
    }
  };

  const trackerSubNavs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'tracker', label: '5-Stage Pipeline', icon: CheckSquare },
    { id: 'deadlines', label: 'Deadlines Radar', icon: Clock },
    { id: 'stack', label: 'Stack Planner', icon: Layers },
    { id: 'calculator', label: 'Tuition Fee Gap', icon: Calculator },
  ];

  // Standalone dedicated views with zero app navbar
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'auth') {
    return <AuthPage />;
  }

  if (currentView === 'onboarding') {
    return <OnboardingFlow />;
  }

  return (
    <DashboardLayout onOpenComparison={() => setComparisonModalOpen(true)}>
      {/* If inside Tracker hub (pipeline, deadlines, stack, or calculator), show clean sub-nav pill */}
      {(activeTab === 'tracker' ||
        activeTab === 'deadlines' ||
        activeTab === 'stack' ||
        activeTab === 'calculator') && (
        <div className="mb-6 flex flex-wrap items-center gap-2 p-1.5 bg-[#111827] border border-[#1e293b] rounded-2xl w-fit">
          {trackerSubNavs.map((sub) => {
            const Icon = sub.icon;
            const isActive = activeTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveTab(sub.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-xs'
                    : 'text-[#94a3b8] hover:text-[#f8fafc]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* F2: Personalized Scholarship Feed */}
      {activeTab === 'discovery' && (
        <>
          <HeroSection
            totalAvailableFunding={aidAnalytics.totalPotentialFunding}
            totalGrantsCount={allRawScholarships.length}
          />

          <QuickProfileBar />

          <SearchAndFilterBar totalResults={filteredScholarships.length} />

          <ScholarshipGrid
            scholarships={filteredScholarships}
            onOpenDetails={handleOpenDetails}
            onOpenWorkspace={handleOpenWorkspace}
          />
        </>
      )}

      {/* F4: Almost Eligible Gap Analysis */}
      {activeTab === 'gaps' && (
        <GapAnalysisView
          onOpenDetails={handleOpenDetails}
          onOpenWorkspace={handleOpenWorkspace}
        />
      )}

      {/* F5: Universal Document Vault & Readiness Score */}
      {activeTab === 'vault' && <DocumentVaultView />}

      {/* F6: 5-Stage Application Tracker */}
      {activeTab === 'tracker' && (
        <KanbanBoard
          onOpenWorkspace={handleOpenWorkspace}
          onNavigateDiscovery={() => setActiveTab('discovery')}
        />
      )}

      {/* F7: Deadlines Radar View */}
      {activeTab === 'deadlines' && (
        <DeadlinesRadarView
          onOpenDetails={handleOpenDetails}
          onOpenWorkspace={handleOpenWorkspace}
        />
      )}

      {/* Stretch: Scholarship Stack Planner */}
      {activeTab === 'stack' && <ScholarshipStackPlanner />}

      {/* Tuition Gap Visualizer */}
      {activeTab === 'calculator' && (
        <FinancialAidSummary onNavigateDiscovery={() => setActiveTab('discovery')} />
      )}

      {/* Authentication Modal with Demo Personas */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* F1: Smart Onboarding Profile Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* F3: Scholarship Detail View Modal */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        onOpenWorkspace={handleOpenWorkspace}
      />

      {/* Guided Application Workspace Modal */}
      <ApplicationWorkspaceModal
        scholarship={workspaceScholarship}
        onClose={() => setWorkspaceScholarshipId(null)}
      />

      {/* Side-by-Side Comparison Modal */}
      <ComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onSelectForDetails={handleSelectFromComparison}
      />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ScholarshipProvider>
      <MainAppContent />
    </ScholarshipProvider>
  );
}
