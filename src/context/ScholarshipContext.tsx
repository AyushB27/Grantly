import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type {
  Scholarship,
  StudentProfile,
  TrackedApplication,
  FilterState,
  ApplicationStage,
} from '../types/scholarship';
import {
  MOCK_SCHOLARSHIPS,
  DEFAULT_STUDENT_PROFILE,
  DEFAULT_TRACKED_APPLICATIONS,
} from '../data/mockScholarships';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type ActiveTab = 'discovery' | 'tracker' | 'calculator' | 'profile';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  academicLevel: 'All',
  category: 'All',
  minAmount: 0,
  maxGpaRequirement: 4.0,
  onlyRenewable: false,
  onlyEligible: false,
  sortBy: 'match',
};

interface ScholarshipContextValue {
  scholarships: Scholarship[];
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  trackedApplications: TrackedApplication[];
  setApplicationStage: (scholarshipId: string, stage: ApplicationStage) => void;
  toggleChecklistItem: (scholarshipId: string, item: string) => void;
  saveApplicationDraft: (scholarshipId: string, essayDraft: string, notes: string) => void;
  removeTrackedApplication: (scholarshipId: string) => void;
  selectedScholarship: Scholarship | null;
  setSelectedScholarship: (s: Scholarship | null) => void;
  comparisonIds: string[];
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  workspaceScholarshipId: string | null;
  setWorkspaceScholarshipId: (id: string | null) => void;
  resetAllToSeedData: () => void;
}

const ScholarshipContext = createContext<ScholarshipContextValue | undefined>(undefined);

export const ScholarshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useLocalStorage<StudentProfile>(
    'grantly_student_profile_v1',
    DEFAULT_STUDENT_PROFILE
  );

  const [trackedApplications, setTrackedApplications] = useLocalStorage<TrackedApplication[]>(
    'grantly_tracked_applications_v1',
    DEFAULT_TRACKED_APPLICATIONS
  );

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('discovery');
  const [workspaceScholarshipId, setWorkspaceScholarshipId] = useState<string | null>(null);

  const updateProfile = useCallback(
    (updates: Partial<StudentProfile>) => {
      setProfile((prev) => ({ ...prev, ...updates }));
    },
    [setProfile]
  );

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const setApplicationStage = useCallback(
    (scholarshipId: string, stage: ApplicationStage) => {
      setTrackedApplications((prev) => {
        const existingIndex = prev.findIndex((app) => app.scholarshipId === scholarshipId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], stage };
          return updated;
        } else {
          const newApp: TrackedApplication = {
            scholarshipId,
            stage,
            dateAdded: new Date().toISOString().split('T')[0],
            completedChecklist: [],
            essayDraft: '',
            notes: '',
          };
          return [...prev, newApp];
        }
      });
    },
    [setTrackedApplications]
  );

  const toggleChecklistItem = useCallback(
    (scholarshipId: string, item: string) => {
      setTrackedApplications((prev) => {
        return prev.map((app) => {
          if (app.scholarshipId !== scholarshipId) return app;
          const exists = app.completedChecklist.includes(item);
          const updatedList = exists
            ? app.completedChecklist.filter((i) => i !== item)
            : [...app.completedChecklist, item];
          return { ...app, completedChecklist: updatedList };
        });
      });
    },
    [setTrackedApplications]
  );

  const saveApplicationDraft = useCallback(
    (scholarshipId: string, essayDraft: string, notes: string) => {
      setTrackedApplications((prev) => {
        const index = prev.findIndex((app) => app.scholarshipId === scholarshipId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], essayDraft, notes };
          return updated;
        } else {
          return [
            ...prev,
            {
              scholarshipId,
              stage: 'bookmarked',
              dateAdded: new Date().toISOString().split('T')[0],
              completedChecklist: [],
              essayDraft,
              notes,
            },
          ];
        }
      });
    },
    [setTrackedApplications]
  );

  const removeTrackedApplication = useCallback(
    (scholarshipId: string) => {
      setTrackedApplications((prev) => prev.filter((app) => app.scholarshipId !== scholarshipId));
    },
    [setTrackedApplications]
  );

  const toggleComparison = useCallback((id: string) => {
    setComparisonIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        // Maximum 3 for optimal responsive UI
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonIds([]);
  }, []);

  const resetAllToSeedData = useCallback(() => {
    setProfile(DEFAULT_STUDENT_PROFILE);
    setTrackedApplications(DEFAULT_TRACKED_APPLICATIONS);
    setFilters(INITIAL_FILTERS);
    setComparisonIds([]);
    setSelectedScholarship(null);
  }, [setProfile, setTrackedApplications]);

  const value = useMemo(
    () => ({
      scholarships: MOCK_SCHOLARSHIPS,
      profile,
      updateProfile,
      filters,
      updateFilters,
      resetFilters,
      trackedApplications,
      setApplicationStage,
      toggleChecklistItem,
      saveApplicationDraft,
      removeTrackedApplication,
      selectedScholarship,
      setSelectedScholarship,
      comparisonIds,
      toggleComparison,
      clearComparison,
      activeTab,
      setActiveTab,
      workspaceScholarshipId,
      setWorkspaceScholarshipId,
      resetAllToSeedData,
    }),
    [
      profile,
      updateProfile,
      filters,
      updateFilters,
      resetFilters,
      trackedApplications,
      setApplicationStage,
      toggleChecklistItem,
      saveApplicationDraft,
      removeTrackedApplication,
      selectedScholarship,
      comparisonIds,
      toggleComparison,
      clearComparison,
      activeTab,
      setActiveTab,
      workspaceScholarshipId,
      resetAllToSeedData,
    ]
  );

  return <ScholarshipContext.Provider value={value}>{children}</ScholarshipContext.Provider>;
};

// oxlint-disable-next-line react/only-export-components
export function useScholarshipContext(): ScholarshipContextValue {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error('useScholarshipContext must be used within a ScholarshipProvider');
  }
  return context;
}
