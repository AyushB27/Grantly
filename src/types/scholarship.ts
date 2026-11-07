/**
 * Core domain types for GRANTLY - Indian Scholarship & Educational Financial Aid Platform
 * Tailored for the Indian higher education ecosystem (NSP, CSR, State Portals, Merit & EWS)
 */

export type EducationLevel =
  | 'Class 11-12'
  | 'Undergraduate (B.Tech / B.Sc / B.Com / MBBS)'
  | 'Postgraduate (M.Tech / M.Sc / MBA)'
  | 'PhD / Doctoral Research';

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
  | 'Equipment & Laptop Grant'
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

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  organizationType: 'Central Govt (NSP)' | 'State Govt' | 'CSR Foundation' | 'Private Trust' | 'University';
  amount: number; // in INR (₹)
  awardType: AwardType;
  renewable: boolean;
  deadline: string; // ISO date format YYYY-MM-DD
  educationLevel: EducationLevel[];
  minCgpa: number; // On 10.0 scale (or equivalent board % / 10)
  categories: CategoryTag[];
  branches: string[]; // e.g. Computer Science, Mechanical, Medical, All Streams
  eligibleCategories: SocialCategory[];
  familyIncomeCapMax: number; // in INR (e.g. 250000, 600000, 800000, or 0 for no cap)
  description: string;
  plainEnglishSummary: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  portalUrl: string;
  estimatedCompletionMinutes: number;
  acceptanceRateEstimate: string;
}

export interface StudentProfile {
  fullName: string;
  cgpa: number; // 0.0 to 10.0 scale
  academicLevel: EducationLevel;
  branch: string; // Engineering, Medical, Arts, Commerce
  familyAnnualIncome: IncomeBracket;
  socialCategory: SocialCategory;
  isFirstGen: boolean;
  isSingleGirlChild: boolean;
  targetAnnualFees: number; // Target annual college fees in INR
}

export type ApplicationStage =
  | 'bookmarked'
  | 'in_progress'
  | 'submitted'
  | 'awarded';

export interface TrackedApplication {
  scholarshipId: string;
  stage: ApplicationStage;
  dateAdded: string;
  completedChecklist: string[];
  essayDraft: string;
  notes: string;
  customReminderDate?: string;
}

export interface FilterState {
  searchQuery: string;
  academicLevel: string;
  category: string;
  minAmount: number;
  maxCgpaRequirement: number;
  onlyRenewable: boolean;
  onlyEligible: boolean;
  sortBy: 'match' | 'deadline' | 'amount_desc' | 'amount_asc' | 'title';
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
  reasons: string[];
  warningFlags: string[];
}
