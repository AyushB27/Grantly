import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type {
  Scholarship,
  StudentProfile,
  TrackedApplication,
  FilterState,
  ApplicationStage,
  DocumentVaultItem,
  DocumentStatus,
} from '../types/scholarship';
import {
  MOCK_SCHOLARSHIPS,
  DEFAULT_STUDENT_PROFILE,
  DEFAULT_TRACKED_APPLICATIONS,
  DEFAULT_DOCUMENT_VAULT,
} from '../data/mockScholarships';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type ActiveTab =
  | 'discovery'
  | 'gaps' // F4 Almost Eligible Gap Analysis
  | 'vault' // F5 Document Vault & Readiness
  | 'tracker' // F6 5-Stage Kanban Board
  | 'deadlines' // F7 Urgency Radar
  | 'stack' // Stretch: Stack Planner
  | 'calculator'; // Tuition Gap visualizer

export type AppView = 'landing' | 'app';
export type AppTheme = 'dark' | 'light';

export interface UserSession {
  name: string;
  email: string;
  avatarText: string;
  isDemo?: boolean;
}

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  academicLevel: 'All',
  category: 'All',
  minAmount: 0,
  maxEffortMinutes: 120,
  onlyRenewable: false,
  onlyEligible: false,
  onlyAlmostEligible: false,
  sortBy: 'match',
};

const DEFAULT_USER: UserSession = {
  name: 'Aarav Sharma',
  email: 'aarav.sharma@iitd.ac.in',
  avatarText: 'AS',
  isDemo: true,
};

interface ScholarshipContextValue {
  scholarships: Scholarship[];
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  filters: FilterState;
  updateFilters: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  trackedApplications: TrackedApplication[];
  setApplicationStage: (
    scholarshipId: string,
    stage: ApplicationStage,
    resultOutcome?: 'awarded' | 'regret'
  ) => void;
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
  documentVault: DocumentVaultItem[];
  updateDocumentStatus: (docId: string, status: DocumentStatus) => void;
  readinessPercentage: number;
  stackScholarshipIds: string[];
  toggleStackScholarship: (id: string) => void;
  clearStack: () => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  resetAllToSeedData: () => void;
  // Theme & View controls
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (t: AppTheme) => void;
  currentView: AppView;
  setCurrentView: (v: AppView) => void;
  // Auth controls
  currentUser: UserSession | null;
  login: (email: string, name?: string, newProfile?: Partial<StudentProfile>) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const ScholarshipContext = createContext<ScholarshipContextValue | undefined>(undefined);

export const ScholarshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useLocalStorage<StudentProfile>(
    'grantly_student_profile_v2',
    DEFAULT_STUDENT_PROFILE
  );

  const [trackedApplications, setTrackedApplications] = useLocalStorage<TrackedApplication[]>(
    'grantly_tracked_applications_v2',
    DEFAULT_TRACKED_APPLICATIONS
  );

  const [documentVault, setDocumentVault] = useLocalStorage<DocumentVaultItem[]>(
    'grantly_document_vault_v2',
    DEFAULT_DOCUMENT_VAULT
  );

  const [stackScholarshipIds, setStackScholarshipIds] = useLocalStorage<string[]>(
    'grantly_stack_ids_v2',
    ['ind-grant-01', 'ind-grant-03']
  );

  const [theme, setThemeState] = useLocalStorage<AppTheme>('grantly_theme_v2', 'dark');
  const [currentView, setCurrentView] = useLocalStorage<AppView>('grantly_view_v2', 'landing');
  const [currentUser, setCurrentUser] = useLocalStorage<UserSession | null>(
    'grantly_current_user_v2',
    DEFAULT_USER
  );

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('discovery');
  const [workspaceScholarshipId, setWorkspaceScholarshipId] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync theme with HTML document attribute & root class
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setThemeState]);

  const setTheme = useCallback(
    (t: AppTheme) => {
      setThemeState(t);
    },
    [setThemeState]
  );

  const login = useCallback(
    (email: string, name?: string, newProfile?: Partial<StudentProfile>) => {
      const resolvedName = name || email.split('@')[0];
      const initials = resolvedName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      setCurrentUser({
        name: resolvedName,
        email,
        avatarText: initials || 'ST',
        isDemo: false,
      });

      if (newProfile) {
        setProfile((prev) => ({
          ...prev,
          fullName: resolvedName,
          ...newProfile,
        }));
      }
    },
    [setCurrentUser, setProfile]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

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
    (scholarshipId: string, stage: ApplicationStage, resultOutcome?: 'awarded' | 'regret') => {
      setTrackedApplications((prev) => {
        const existingIndex = prev.findIndex((app) => app.scholarshipId === scholarshipId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            stage,
            ...(resultOutcome ? { resultOutcome } : {}),
          };
          return updated;
        } else {
          const newApp: TrackedApplication = {
            scholarshipId,
            stage,
            dateAdded: new Date().toISOString().split('T')[0],
            completedChecklist: [],
            essayDraft: '',
            notes: '',
            ...(resultOutcome ? { resultOutcome } : {}),
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
              stage: 'saved',
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
        return [prev[1], prev[2], id];
      }
      return [...prev, id];
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonIds([]);
  }, []);

  const updateDocumentStatus = useCallback(
    (docId: string, status: DocumentStatus) => {
      setDocumentVault((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, status } : doc))
      );
    },
    [setDocumentVault]
  );

  const readinessPercentage = useMemo(() => {
    if (documentVault.length === 0) return 0;
    const uploaded = documentVault.filter((d) => d.status === 'uploaded').length;
    return Math.round((uploaded / documentVault.length) * 100);
  }, [documentVault]);

  const toggleStackScholarship = useCallback(
    (id: string) => {
      setStackScholarshipIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    },
    [setStackScholarshipIds]
  );

  const clearStack = useCallback(() => {
    setStackScholarshipIds([]);
  }, [setStackScholarshipIds]);

  const resetAllToSeedData = useCallback(() => {
    setProfile(DEFAULT_STUDENT_PROFILE);
    setTrackedApplications(DEFAULT_TRACKED_APPLICATIONS);
    setDocumentVault(DEFAULT_DOCUMENT_VAULT);
    setStackScholarshipIds(['ind-grant-01', 'ind-grant-03']);
    setFilters(INITIAL_FILTERS);
    setComparisonIds([]);
    setSelectedScholarship(null);
    setWorkspaceScholarshipId(null);
    setCurrentUser(DEFAULT_USER);
  }, [
    setProfile,
    setTrackedApplications,
    setDocumentVault,
    setStackScholarshipIds,
    setCurrentUser,
  ]);

  const value = useMemo<ScholarshipContextValue>(
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
      documentVault,
      updateDocumentStatus,
      readinessPercentage,
      stackScholarshipIds,
      toggleStackScholarship,
      clearStack,
      isOnboardingOpen,
      setIsOnboardingOpen,
      resetAllToSeedData,
      theme,
      toggleTheme,
      setTheme,
      currentView,
      setCurrentView,
      currentUser,
      login,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
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
      workspaceScholarshipId,
      documentVault,
      updateDocumentStatus,
      readinessPercentage,
      stackScholarshipIds,
      toggleStackScholarship,
      clearStack,
      isOnboardingOpen,
      resetAllToSeedData,
      theme,
      toggleTheme,
      setTheme,
      currentView,
      setCurrentView,
      currentUser,
      login,
      logout,
      isAuthModalOpen,
    ]
  );

  return <ScholarshipContext.Provider value={value}>{children}</ScholarshipContext.Provider>;
};

// oxlint-disable-next-line react-refresh/only-export-components
export function useScholarshipContext(): ScholarshipContextValue {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error('useScholarshipContext must be used within a ScholarshipProvider');
  }
  return context;
}
