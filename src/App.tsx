import React, { useState, useCallback, Suspense, lazy } from 'react';
import { ScholarshipProvider, useScholarshipContext } from './context/ScholarshipContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LandingPage } from './components/landing/LandingPage';
import { HeroSection } from './components/discovery/HeroSection';
import { QuickProfileBar } from './components/profile/QuickProfileBar';
import { SearchAndFilterBar } from './components/discovery/SearchAndFilterBar';
import { ScholarshipGrid } from './components/discovery/ScholarshipGrid';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useScholarships } from './hooks/useScholarships';
import type { EnrichedScholarship } from './hooks/useScholarships';

// Lazy-loaded secondary route views and dashboard tabs (code splitting)
const AuthPage = lazy(() => import('./components/auth/AuthPage').then((m) => ({ default: m.AuthPage })));
const OnboardingFlow = lazy(() => import('./components/onboarding/OnboardingFlow').then((m) => ({ default: m.OnboardingFlow })));
const GapAnalysisView = lazy(() => import('./components/gaps/GapAnalysisView').then((m) => ({ default: m.GapAnalysisView })));
const DocumentVaultView = lazy(() => import('./components/vault/DocumentVaultView').then((m) => ({ default: m.DocumentVaultView })));
const KanbanBoard = lazy(() => import('./components/tracker/KanbanBoard').then((m) => ({ default: m.KanbanBoard })));
const DeadlinesRadarView = lazy(() => import('./components/deadlines/DeadlinesRadarView').then((m) => ({ default: m.DeadlinesRadarView })));
const ScholarshipStackPlanner = lazy(() => import('./components/stack/ScholarshipStackPlanner').then((m) => ({ default: m.ScholarshipStackPlanner })));
const FinancialAidSummary = lazy(() => import('./components/analytics/FinancialAidSummary').then((m) => ({ default: m.FinancialAidSummary })));

// Lazy-loaded modal dialogs
const ScholarshipDetailModal = lazy(() => import('./components/details/ScholarshipDetailModal').then((m) => ({ default: m.ScholarshipDetailModal })));
const ApplicationWorkspaceModal = lazy(() => import('./components/companion/ApplicationWorkspaceModal').then((m) => ({ default: m.ApplicationWorkspaceModal })));
const ComparisonModal = lazy(() => import('./components/discovery/ComparisonModal').then((m) => ({ default: m.ComparisonModal })));
const OnboardingModal = lazy(() => import('./components/profile/OnboardingModal').then((m) => ({ default: m.OnboardingModal })));
const AuthModal = lazy(() => import('./components/auth/AuthModal').then((m) => ({ default: m.AuthModal })));

/**
 * Minimal non-shifting fallback placeholder during asynchronous module chunk retrieval
 */
const ViewFallback: React.FC = () => (
  <div
    className="w-full min-h-[360px] flex items-center justify-center p-8 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]/40 transition-opacity"
    aria-busy="true"
    aria-label="Loading view module"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      <span className="text-xs font-mono text-[var(--text-muted)]">Loading module...</span>
    </div>
  </div>
);

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

  const handleOpenDetails = useCallback((scholarship: EnrichedScholarship) => {
    setSelectedScholarship(scholarship);
  }, [setSelectedScholarship]);

  const handleOpenWorkspace = useCallback((scholarshipId: string) => {
    setWorkspaceScholarshipId(scholarshipId);
  }, [setWorkspaceScholarshipId]);

  const handleSelectFromComparison = useCallback((scholarshipId: string) => {
    const found = allRawScholarships.find((s) => s.id === scholarshipId);
    if (found) {
      setSelectedScholarship(found);
    }
  }, [allRawScholarships, setSelectedScholarship]);

  // Standalone dedicated views with zero app navbar
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'auth') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <AuthPage />
      </Suspense>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <Suspense fallback={<ViewFallback />}>
        <OnboardingFlow />
      </Suspense>
    );
  }

  return (
    <DashboardLayout onOpenComparison={() => setComparisonModalOpen(true)}>
      {/* Personalized Scholarship Feed (Default eager first view) */}
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

      {/* Lazy-Loaded Dashboard Tabs with non-shifting Suspense */}
      <Suspense fallback={<ViewFallback />}>
        {/* Almost Eligible Gap Analysis */}
        {activeTab === 'gaps' && (
          <GapAnalysisView
            onOpenDetails={handleOpenDetails}
            onOpenWorkspace={handleOpenWorkspace}
          />
        )}

        {/* Universal Document Vault & Readiness Score */}
        {activeTab === 'vault' && <DocumentVaultView />}

        {/* 5-Stage Application Tracker */}
        {activeTab === 'tracker' && (
          <KanbanBoard
            onOpenWorkspace={handleOpenWorkspace}
            onNavigateDiscovery={() => setActiveTab('discovery')}
          />
        )}

        {/* Deadlines Radar View */}
        {activeTab === 'deadlines' && (
          <DeadlinesRadarView
            onOpenDetails={handleOpenDetails}
            onOpenWorkspace={handleOpenWorkspace}
          />
        )}

        {/* Scholarship Stack Planner */}
        {activeTab === 'stack' && <ScholarshipStackPlanner />}

        {/* Tuition Gap Visualizer */}
        {activeTab === 'calculator' && (
          <FinancialAidSummary onNavigateDiscovery={() => setActiveTab('discovery')} />
        )}

        {/* Authentication Modal with Demo Personas */}
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}

        {/* Smart Onboarding Profile Modal */}
        {isOnboardingOpen && (
          <OnboardingModal
            isOpen={isOnboardingOpen}
            onClose={() => setIsOnboardingOpen(false)}
          />
        )}

        {/* Scholarship Detail View Modal */}
        {selectedScholarship && (
          <ScholarshipDetailModal
            scholarship={selectedScholarship}
            onClose={() => setSelectedScholarship(null)}
            onOpenWorkspace={handleOpenWorkspace}
          />
        )}

        {/* Guided Application Workspace Modal */}
        {workspaceScholarship && (
          <ApplicationWorkspaceModal
            scholarship={workspaceScholarship}
            onClose={() => setWorkspaceScholarshipId(null)}
          />
        )}

        {/* Side-by-Side Comparison Modal */}
        {comparisonModalOpen && (
          <ComparisonModal
            isOpen={comparisonModalOpen}
            onClose={() => setComparisonModalOpen(false)}
            onSelectForDetails={handleSelectFromComparison}
          />
        )}
      </Suspense>
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ScholarshipProvider>
        <MainAppContent />
      </ScholarshipProvider>
    </ErrorBoundary>
  );
}
