/**
 * Application constants and institutional domain defaults for GRANTLY
 */

import type {
  CategoryTag,
  EducationLevel,
  IncomeBracket,
  SocialCategory,
  StudentProfile,
} from '../types';

/**
 * LocalStorage keys for client-side persistence
 */
export const STORAGE_KEYS = {
  PROFILE: 'grantly_student_profile_v2',
  APPLICATIONS: 'grantly_tracked_applications_v2',
  VAULT: 'grantly_document_vault_v2',
  STACK_IDS: 'grantly_stack_ids_v2',
  THEME: 'grantly_theme_v3',
  VIEW: 'grantly_view_v2',
  CURRENT_USER: 'grantly_current_user_v2',
} as const;

/**
 * Standard Indian social reservation and EWS categories
 */
export const SOCIAL_CATEGORIES: SocialCategory[] = [
  'General',
  'General (EWS)',
  'OBC (Non-Creamy Layer)',
  'SC',
  'ST',
];

/**
 * Family annual income brackets according to EWS and Non-Creamy Layer limits
 */
export const INCOME_BRACKETS: IncomeBracket[] = [
  '< ₹2.5 Lakhs (Full EWS)',
  '₹2.5L - ₹5 Lakhs',
  '₹5L - ₹8 Lakhs (Non-Creamy Limit)',
  '> ₹8 Lakhs (General / Creamy Layer)',
];

/**
 * Indian higher education degree levels
 */
export const EDUCATION_LEVELS: EducationLevel[] = [
  'Class 11-12',
  'Undergraduate',
  'Postgraduate',
  'PhD / Research',
];

/**
 * Common scholarship tag taxonomy
 */
export const CATEGORY_TAGS: CategoryTag[] = [
  'STEM',
  'Need-Based (EWS)',
  'Merit-Based',
  'Women in Tech',
  'SC / ST / OBC',
  'First-Generation Learner',
  'Healthcare & Medical',
  'Single Girl Child',
];

/**
 * Academic progression years
 */
export const ACADEMIC_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  'Final Year',
  'Postgraduate',
] as const;

/**
 * Indian states and union territories for domicile matching
 */
export const POPULAR_INDIAN_STATES = [
  'All India',
  'Delhi',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
  'Telangana',
  'Gujarat',
  'Rajasthan',
  'Kerala',
  'Bihar',
  'Madhya Pradesh',
  'Punjab',
] as const;

/**
 * Default seed student profile (Aarav Sharma - B.Tech EWS Benchmark)
 */
export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  fullName: 'Aarav Sharma',
  university: 'IIT Delhi',
  course: 'B.Tech Computer Science & Engineering',
  currentYear: '2nd Year',
  academicLevel: 'Undergraduate',
  branch: 'Computer Science & Engineering',
  marksCgpa: 8.65,
  marksPercentage: 82.2,
  socialCategory: 'General (EWS)',
  familyAnnualIncome: '₹2.5L - ₹5 Lakhs',
  regionState: 'Delhi',
  isFirstGen: true,
  isSingleGirlChild: false,
  targetAnnualFees: 180000,
  isOnboardingCompleted: true,
};
