import { describe, it, expect } from 'vitest';
import { calculateMatchScore } from '../matchCalculator';
import type { Scholarship, StudentProfile } from '../../types/scholarship';

const mockProfile: StudentProfile = {
  fullName: 'Aarav Sharma',
  university: 'IIT Delhi',
  course: 'B.Tech',
  academicLevel: 'Undergraduate',
  currentYear: '3rd Year',
  branch: 'Computer Science & Engineering',
  marksCgpa: 8.8,
  marksPercentage: 83.6,
  familyAnnualIncome: '< ₹2.5 Lakhs (Full EWS)',
  socialCategory: 'General (EWS)',
  regionState: 'Delhi',
  isFirstGen: true,
  isSingleGirlChild: false,
  targetAnnualFees: 120000,
  isOnboardingCompleted: true,
};

const mockScholarship: Scholarship = {
  id: 'grant-test-1',
  title: 'Reliance Foundation Undergraduate Scholarship',
  provider: 'Reliance Foundation (CSR)',
  organizationType: 'CSR Foundation',
  amount: 200000,
  awardType: 'Direct Cash Grant',
  deadline: '2026-11-20',
  description: 'Merit-cum-means scholarship for undergraduate students.',
  plainEnglishSummary: 'Merit aid for college fees.',
  minCgpa: 8.0,
  effortMinutes: 45,
  effortEstimate: '1.5 hrs',
  educationLevel: ['Undergraduate'],
  branches: ['All Streams'],
  familyIncomeCapMax: 600000,
  eligibleCategories: ['General', 'General (EWS)', 'OBC (Non-Creamy Layer)', 'SC', 'ST'],
  eligibleRegions: ['All India'],
  renewable: true,
  requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'College ID'],
  categories: ['STEM', 'Need-Based (EWS)', 'Merit-Based'],
  verifiedSource: true,
  portalUrl: 'https://www.scholarships.reliancefoundation.org',
  acceptanceRateEstimate: '12%',
  stackConflicts: [],
  whyYouMatchSummary: 'CGPA clears cutoff and family income satisfies criteria',
  eligibilityCriteria: [],
  applicationSteps: [],
};

describe('Deterministic Match Scoring Engine (calculateMatchScore)', () => {
  it('awards a high match score (>80%) when student clears CGPA, branch, and income ceiling', () => {
    const result = calculateMatchScore(mockScholarship, mockProfile);
    expect(result.overallPercentage).toBeGreaterThanOrEqual(80);
    expect(result.cgpaMatch).toBe(true);
    expect(result.levelMatch).toBe(true);
    expect(result.branchMatch).toBe(true);
    expect(result.incomeMatch).toBe(true);
    expect(result.categoryMatch).toBe(true);
    expect(result.isAlmostEligible).toBe(false);
    expect(result.whyYouMatchLine).toContain('CGPA');
    expect(result.cgpaScore).toBe(30);
    expect(result.levelScore).toBe(25);
    expect(result.branchScore).toBe(20);
  });

  it('detects "Almost Eligible" gap when CGPA is within 0.45 of the minimum cutoff', () => {
    const nearMissProfile: StudentProfile = {
      ...mockProfile,
      marksCgpa: 7.7, // Short by 0.3 of 8.0 cutoff
    };

    const result = calculateMatchScore(mockScholarship, nearMissProfile);
    expect(result.isAlmostEligible).toBe(true);
    expect(result.gaps.length).toBeGreaterThan(0);
    expect(result.gaps[0].gapDescription).toContain('0.30 CGPA');
    expect(result.gaps[0].suggestedFix).toContain('SGPA boost');
  });

  it('flags warning when family income exceeds scholarship income ceiling', () => {
    const highIncomeProfile: StudentProfile = {
      ...mockProfile,
      familyAnnualIncome: '> ₹8 Lakhs (General / Creamy Layer)',
    };

    const strictEwsScholarship: Scholarship = {
      ...mockScholarship,
      familyIncomeCapMax: 250000,
    };

    const result = calculateMatchScore(strictEwsScholarship, highIncomeProfile);
    expect(result.gaps.some((g) => g.requirement.includes('income') || g.requirement.includes('Income'))).toBe(true);
    expect(result.warningFlags.some((w) => w.includes('income') || w.includes('Income'))).toBe(true);
  });

  it('awards quota bonus reasons when applicable for Single Girl Child', () => {
    const girlChildScholarship: Scholarship = {
      ...mockScholarship,
      categories: ['Single Girl Child', 'STEM'],
    };

    const girlChildProfile: StudentProfile = {
      ...mockProfile,
      isSingleGirlChild: true,
    };

    const result = calculateMatchScore(girlChildScholarship, girlChildProfile);
    expect(result.reasons.some((r) => r.includes('Single Girl Child'))).toBe(true);
  });
});
