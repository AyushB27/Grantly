/**
 * Core domain types for GRANTLY - Scholarship Discovery & Management Platform
 * Aligned with FAIE v3.1 Static Analysis & Problem Statement Specifications
 */

export type EducationLevel =
  | 'High School Senior'
  | 'Undergraduate'
  | 'Graduate'
  | 'Doctoral';

export type CategoryTag =
  | 'STEM'
  | 'Need-Based'
  | 'Merit'
  | 'Women in Tech'
  | 'First-Generation'
  | 'Minority'
  | 'Community Service'
  | 'Healthcare';

export type AwardType =
  | 'Tuition & Fees'
  | 'Living Stipend'
  | 'Research Grant'
  | 'Books & Supplies'
  | 'Full Ride';

export type CitizenshipStatus =
  | 'US Citizen'
  | 'Permanent Resident'
  | 'DACA'
  | 'International';

export type IncomeBracket =
  | '<$30k'
  | '$30k-$60k'
  | '$60k-$100k'
  | '>$100k';

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  organizationType: 'Corporate' | 'Foundation' | 'Government' | 'Non-Profit' | 'University';
  amount: number;
  awardType: AwardType;
  renewable: boolean;
  deadline: string; // ISO date format YYYY-MM-DD
  educationLevel: EducationLevel[];
  minGpa: number;
  categories: CategoryTag[];
  majors: string[];
  citizenship: CitizenshipStatus[];
  financialNeedRequired: boolean;
  description: string;
  plainEnglishSummary: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationUrl: string;
  estimatedCompletionMinutes: number;
  acceptanceRateEstimate: string;
}

export interface StudentProfile {
  fullName: string;
  gpa: number;
  academicLevel: EducationLevel;
  major: string;
  householdIncomeBracket: IncomeBracket;
  citizenship: CitizenshipStatus;
  isFirstGen: boolean;
  targetTuitionAnnual: number;
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
  maxGpaRequirement: number;
  onlyRenewable: boolean;
  onlyEligible: boolean;
  sortBy: 'match' | 'deadline' | 'amount_desc' | 'amount_asc' | 'title';
}

export interface MatchScoreBreakdown {
  overallPercentage: number;
  gpaMatch: boolean;
  gpaScore: number;
  levelMatch: boolean;
  levelScore: number;
  majorMatch: boolean;
  majorScore: number;
  needMatch: boolean;
  needScore: number;
  citizenshipMatch: boolean;
  citizenshipScore: number;
  reasons: string[];
  warningFlags: string[];
}
