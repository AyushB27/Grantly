/**
 * Core domain types for GRANTLY: From Scholarship Search to Scholarship Success
 * Covers F1-F7 Core Features, Indian Educational Ecosystem, and Stretch Capabilities
 */

export type EducationLevel =
  | 'Class 11-12'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'PhD / Research';

export type CategoryTag =
  | 'STEM'
  | 'Need-Based (EWS)'
  | 'Merit-Based'
  | 'Women in Tech'
  | 'SC / ST / OBC'
  | 'First-Generation Learner'
  | 'Healthcare & Medical'
  | 'Single Girl Child';

export type AwardType =
  | 'Tuition Fee Waiver'
  | 'Annual Maintenance Allowance'
  | 'Direct Cash Grant'
  | 'Research Fellowship';

export type IncomeBracket =
  | '< ₹2.5 Lakhs (Full EWS)'
  | '₹2.5L - ₹5 Lakhs'
  | '₹5L - ₹8 Lakhs (Non-Creamy Limit)'
  | '> ₹8 Lakhs (General / Creamy Layer)';

export type SocialCategory =
  | 'General'
  | 'General (EWS)'
  | 'OBC (Non-Creamy Layer)'
  | 'SC'
  | 'ST';

export interface EligibilityRuleItem {
  id: string;
  rule: string;
  type: 'cgpa' | 'level' | 'branch' | 'income' | 'category' | 'region';
}

export interface ApplicationStepItem {
  step: number;
  title: string;
  description: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  organizationType: 'Central Govt (NSP)' | 'State Govt' | 'CSR Foundation' | 'Private Trust';
  amount: number; // in INR (₹)
  awardType: AwardType;
  renewable: boolean;
  deadline: string; // ISO date format YYYY-MM-DD
  effortEstimate: string; // e.g. "⚡ ~35 mins effort"
  effortMinutes: number;
  educationLevel: EducationLevel[];
  minCgpa: number; // On 10.0 scale
  categories: CategoryTag[];
  branches: string[];
  eligibleCategories: SocialCategory[];
  eligibleRegions: string[]; // e.g. "All India", "Karnataka", "Maharashtra"
  familyIncomeCapMax: number; // 0 for no cap, or ceiling in INR
  description: string;
  plainEnglishSummary: string;
  whyYouMatchSummary: string; // Default template for F2 "Why you match"
  eligibilityCriteria: EligibilityRuleItem[];
  requiredDocuments: string[];
  applicationSteps: ApplicationStepItem[]; // F3: 3-5 step application process
  verifiedSource: boolean; // F3: Verified source badge
  portalUrl: string;
  acceptanceRateEstimate: string;
  stackConflicts: string[]; // Stretch: Stack planner conflicts
}

export interface StudentProfile {
  fullName: string;
  course: string; // e.g. B.Tech Computer Science, MBBS, B.Sc
  currentYear: '1st Year' | '2nd Year' | '3rd Year' | 'Final Year' | 'Postgraduate';
  academicLevel: EducationLevel;
  branch: string;
  marksCgpa: number; // 0.0 to 10.0
  marksPercentage: number;
  socialCategory: SocialCategory;
  familyAnnualIncome: IncomeBracket;
  regionState: string; // e.g. "All India", "Delhi", "Uttar Pradesh", "Maharashtra"
  isFirstGen: boolean;
  isSingleGirlChild: boolean;
  targetAnnualFees: number;
  isOnboardingCompleted: boolean;
}

export type DocumentStatus = 'uploaded' | 'missing' | 'expiring';

export interface DocumentVaultItem {
  id: string;
  name: string;
  description: string;
  category: 'Academic' | 'Income & Social' | 'Identity' | 'Institutional';
  status: DocumentStatus;
  lastUpdated?: string;
  expiryNote?: string;
}

// F6. 5-Stage Application Tracker: Saved → Preparing → Submitted → Under Review → Result
export type ApplicationStage =
  | 'saved'
  | 'preparing'
  | 'submitted'
  | 'under_review'
  | 'result';

export interface TrackedApplication {
  scholarshipId: string;
  stage: ApplicationStage;
  dateAdded: string;
  completedChecklist: string[];
  essayDraft: string;
  notes: string;
  resultOutcome?: 'awarded' | 'regret';
  customReminderDate?: string;
}

export interface FilterState {
  searchQuery: string;
  academicLevel: string;
  category: string;
  minAmount: number;
  maxEffortMinutes: number;
  onlyRenewable: boolean;
  onlyEligible: boolean;
  onlyAlmostEligible: boolean; // F4 Gap Analysis filter
  sortBy: 'match' | 'deadline' | 'amount_desc' | 'amount_asc' | 'effort';
}

export interface MatchScoreBreakdown {
  overallPercentage: number;
  cgpaMatch: boolean;
  cgpaScore: number;
  levelMatch: boolean;
  levelScore: number;
  branchMatch: boolean;
  branchScore: number;
  incomeMatch: boolean;
  incomeScore: number;
  categoryMatch: boolean;
  categoryScore: number;
  regionMatch: boolean;
  reasons: string[];
  whyYouMatchLine: string; // F2 mandatory "Why you match" line
  warningFlags: string[];
  isAlmostEligible: boolean; // F4 Signature feature
  gaps: { requirement: string; gapDescription: string; suggestedFix: string }[];
}
