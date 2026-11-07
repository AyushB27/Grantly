import React, { useState } from 'react';
import { ScholarshipProvider, useScholarshipContext } from './context/ScholarshipContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/discovery/HeroSection';
import { QuickProfileBar } from './components/profile/QuickProfileBar';
import { SearchAndFilterBar } from './components/discovery/SearchAndFilterBar';
import { ScholarshipGrid } from './components/discovery/ScholarshipGrid';
import { ScholarshipDetailModal } from './components/details/ScholarshipDetailModal';
import { ApplicationWorkspaceModal } from './components/companion/ApplicationWorkspaceModal';
import { ComparisonModal } from './components/discovery/ComparisonModal';
import { KanbanBoard } from './components/tracker/KanbanBoard';
import { FinancialAidSummary } from './components/analytics/FinancialAidSummary';
import { StudentProfileView } from './components/profile/StudentProfileView';
import { useScholarships } from './hooks/useScholarships';
import type { EnrichedScholarship } from './hooks/useScholarships';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedScholarship,
    setSelectedScholarship,
    workspaceScholarshipId,
    setWorkspaceScholarshipId,
    scholarships: allRawScholarships,
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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Accessible Navbar & Skip Landmark */}
      <Navbar onOpenComparison={() => setComparisonModalOpen(true)} />

      {/* Main Content Landmark */}
      <main id="main-content" className="flex-1 responsive-container py-6" tabIndex={-1}>
        {activeTab === 'discovery' && (
          <>
            {/* Inspiring Hero Banner */}
            <HeroSection
              totalAvailableFunding={aidAnalytics.totalPotentialFunding}
              totalGrantsCount={allRawScholarships.length}
            />

            {/* Interactive Profile Simulator */}
            <QuickProfileBar />

            {/* Faceted Filters & Search */}
            <SearchAndFilterBar totalResults={filteredScholarships.length} />

            {/* Responsive Grid with a11y Live Announcer */}
            <ScholarshipGrid
              scholarships={filteredScholarships}
              onOpenDetails={handleOpenDetails}
              onOpenWorkspace={handleOpenWorkspace}
            />
          </>
        )}

        {activeTab === 'tracker' && (
          <KanbanBoard
            onOpenWorkspace={handleOpenWorkspace}
            onNavigateDiscovery={() => setActiveTab('discovery')}
          />
        )}

        {activeTab === 'calculator' && (
          <FinancialAidSummary onNavigateDiscovery={() => setActiveTab('discovery')} />
        )}

        {activeTab === 'profile' && <StudentProfileView />}
      </main>

      {/* Modals & Slide-Overs */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        onOpenWorkspace={handleOpenWorkspace}
      />

      <ApplicationWorkspaceModal
        scholarship={workspaceScholarship}
        onClose={() => setWorkspaceScholarshipId(null)}
      />

      <ComparisonModal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        onSelectForDetails={handleSelectFromComparison}
      />

      {/* Semantic Accessible Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ScholarshipProvider>
      <MainAppContent />
    </ScholarshipProvider>
  );
}
