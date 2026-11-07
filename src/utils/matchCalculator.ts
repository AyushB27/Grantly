import type { Scholarship, StudentProfile, MatchScoreBreakdown } from '../types/scholarship';

/**
 * Deterministic Eligibility & Match Scoring Engine for Indian Scholarship Ecosystem
 * Computes a weighted 0-100% suitability index between student credentials
 * and scholarship requirements with transparent, explainable reasoning.
 */
export function calculateMatchScore(
  scholarship: Scholarship,
  profile: StudentProfile
): MatchScoreBreakdown {
  const reasons: string[] = [];
  const warningFlags: string[] = [];

  // 1. CGPA & Academic Merit Evaluation (Weight: 30%)
  let cgpaScore = 0;
  let cgpaMatch = false;

  if (profile.cgpa >= scholarship.minCgpa) {
    cgpaMatch = true;
    cgpaScore = 30;
    const surplus = (profile.cgpa - scholarship.minCgpa).toFixed(2);
    if (parseFloat(surplus) > 0.5) {
      reasons.push(
        `CGPA ${profile.cgpa.toFixed(2)} comfortably clears eligibility cutoff (${scholarship.minCgpa.toFixed(2)}) by +${surplus}`
      );
    } else {
      reasons.push(`CGPA ${profile.cgpa.toFixed(2)} meets minimum cutoff (${scholarship.minCgpa.toFixed(2)})`);
    }
  } else if (profile.cgpa >= scholarship.minCgpa - 0.4) {
    cgpaScore = 15;
    warningFlags.push(
      `CGPA ${profile.cgpa.toFixed(2)} is near the ${scholarship.minCgpa.toFixed(2)} benchmark; selection may be competitive`
    );
  } else {
    cgpaScore = 0;
    warningFlags.push(
      `Requires minimum ${scholarship.minCgpa.toFixed(2)} CGPA or ~${(scholarship.minCgpa * 9.5).toFixed(0)}% board score`
    );
  }

  // 2. Academic Level & Program Eligibility (Weight: 25%)
  let levelScore = 0;
  let levelMatch = false;
  if (scholarship.educationLevel.includes(profile.academicLevel)) {
    levelMatch = true;
    levelScore = 25;
    reasons.push(`Eligible enrolled status: ${profile.academicLevel}`);
  } else {
    warningFlags.push(`Targeted for ${scholarship.educationLevel.join(', ')}`);
  }

  // 3. Branch of Study / Specialization (Weight: 20%)
  let branchScore = 0;
  let branchMatch = false;
  const isAllStreams = scholarship.branches.some((b) =>
    ['All Streams', 'Any Discipline', 'All Branches', 'General'].includes(b)
  );

  if (isAllStreams) {
    branchMatch = true;
    branchScore = 20;
    reasons.push(`Open to all academic streams and degree programs`);
  } else if (
    scholarship.branches.some(
      (b) =>
        b.toLowerCase() === profile.branch.toLowerCase() ||
        profile.branch.toLowerCase().includes(b.toLowerCase())
    )
  ) {
    branchMatch = true;
    branchScore = 20;
    reasons.push(`Direct branch alignment: ${profile.branch}`);
  } else if (scholarship.categories.includes('STEM') && isStemBranch(profile.branch)) {
    branchMatch = true;
    branchScore = 18;
    reasons.push(`STEM engineering/science stream: ${profile.branch}`);
  } else {
    branchScore = 5;
    warningFlags.push(`Preference for streams: ${scholarship.branches.join(', ')}`);
  }

  // 4. Family Annual Income & EWS Assessment (Weight: 15%)
  let incomeScore = 0;
  let incomeMatch = false;

  if (scholarship.familyIncomeCapMax === 0) {
    // Pure merit scheme with no income ceiling
    incomeMatch = true;
    incomeScore = 15;
    reasons.push(`No family income ceiling (Pure Merit / Talent Fellowship)`);
  } else {
    const isEwsHighPriority = profile.familyAnnualIncome.includes('< ₹2.5 Lakhs');
    const isModerateIncome = profile.familyAnnualIncome.includes('₹2.5L - ₹5 Lakhs');

    if (scholarship.familyIncomeCapMax <= 250000) {
      if (isEwsHighPriority) {
        incomeMatch = true;
        incomeScore = 15;
        reasons.push(`Meets strict EWS / BPL income ceiling (< ₹2.5 Lakhs/year)`);
      } else {
        incomeScore = 2;
        warningFlags.push(`Strict income ceiling of ₹2.5 Lakhs/year (Income Certificate required)`);
      }
    } else if (scholarship.familyIncomeCapMax <= 600000) {
      if (isEwsHighPriority || isModerateIncome) {
        incomeMatch = true;
        incomeScore = 15;
        reasons.push(`Qualifies under CSR family income ceiling (< ₹6 Lakhs/year)`);
      } else {
        incomeScore = 5;
        warningFlags.push(`Family income must be below ₹6 Lakhs/year`);
      }
    } else {
      if (!profile.familyAnnualIncome.includes('> ₹8 Lakhs')) {
        incomeMatch = true;
        incomeScore = 15;
        reasons.push(`Within Non-Creamy Layer / Central Govt quota limit (< ₹8 Lakhs)`);
      } else {
        incomeScore = 4;
        warningFlags.push(`Income cap of ₹8 Lakhs applies`);
      }
    }
  }

  // 5. Social Category / Reservation / Affirmative Diversity (Weight: 10%)
  let categoryScore = 0;
  let categoryMatch = false;

  if (
    scholarship.eligibleCategories.includes(profile.socialCategory) ||
    scholarship.eligibleCategories.includes('General' as any)
  ) {
    categoryMatch = true;
    categoryScore = 10;
    reasons.push(`Qualifies under category: ${profile.socialCategory}`);
  } else {
    warningFlags.push(`Restricted to ${scholarship.eligibleCategories.join(', ')} categories`);
  }

  // Indian context diversity bonuses
  if (profile.isSingleGirlChild && scholarship.categories.includes('Single Girl Child')) {
    reasons.push(`Eligible for Single Girl Child affirmative priority quota`);
  }

  if (profile.isFirstGen && scholarship.categories.includes('First-Generation Learner')) {
    reasons.push(`First-generation higher education learner priority`);
  }

  const overallPercentage = Math.min(
    100,
    Math.round(cgpaScore + levelScore + branchScore + incomeScore + categoryScore)
  );

  return {
    overallPercentage,
    cgpaMatch,
    cgpaScore,
    levelMatch,
    levelScore,
    branchMatch,
    branchScore,
    incomeMatch,
    incomeScore,
    categoryMatch,
    categoryScore,
    reasons,
    warningFlags,
  };
}

/**
 * Check if branch belongs to Engineering / Science / Tech in Indian universities
 */
function isStemBranch(branch: string): boolean {
  const stemKeywords = [
    'computer',
    'information',
    'b.tech',
    'engineering',
    'science',
    'physics',
    'chemistry',
    'mathematics',
    'data',
    'artificial intelligence',
    'electronics',
    'mechanical',
    'civil',
    'biotechnology',
    'm.tech',
    'mca',
  ];
  const lower = branch.toLowerCase();
  return stemKeywords.some((keyword) => lower.includes(keyword));
}
