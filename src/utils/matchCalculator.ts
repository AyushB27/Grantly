/**
 * Deterministic Eligibility & Match Scoring Engine for GRANTLY
 * Evaluates student profiles against institutional scholarship criteria across 5 dimensions:
 * Academic Merit (30%), Education Level (25%), Social Category & Gender (15%),
 * Family Income Ceiling (20%), and State Domicile (10%).
 */

import type { Scholarship, StudentProfile, MatchScoreBreakdown } from '../types/scholarship';

/**
 * Calculates a comprehensive match breakdown, percentage score, plain-English rationales,
 * warning flags, and diagnostic shortfalls for a given scholarship and student profile.
 * 
 * @param scholarship Target scholarship with institutional criteria benchmarks
 * @param profile Active student profile attributes
 * @returns Complete MatchScoreBreakdown object with percentage and gap diagnoses
 */
export function calculateMatchScore(
  scholarship: Scholarship,
  profile: StudentProfile
): MatchScoreBreakdown {
  const reasons: string[] = [];
  const warningFlags: string[] = [];
  const gaps: { requirement: string; gapDescription: string; suggestedFix: string }[] = [];

  // 1. CGPA & Academic Merit Evaluation (Weight: 30%)
  let cgpaScore = 0;
  let cgpaMatch = false;

  if (profile.marksCgpa >= scholarship.minCgpa) {
    cgpaMatch = true;
    cgpaScore = 30;
    const surplus = (profile.marksCgpa - scholarship.minCgpa).toFixed(2);
    if (parseFloat(surplus) > 0.4) {
      reasons.push(`CGPA ${profile.marksCgpa.toFixed(2)} clears minimum (${scholarship.minCgpa.toFixed(2)}) by +${surplus}`);
    } else {
      reasons.push(`CGPA ${profile.marksCgpa.toFixed(2)} satisfies the ${scholarship.minCgpa.toFixed(2)} benchmark`);
    }
  } else if (profile.marksCgpa >= scholarship.minCgpa - 0.45) {
    // Near-miss CGPA
    cgpaScore = 15;
    const gapDiff = (scholarship.minCgpa - profile.marksCgpa).toFixed(2);
    const approxPercentGap = (parseFloat(gapDiff) * 9.5).toFixed(0);
    gaps.push({
      requirement: `Minimum ${scholarship.minCgpa.toFixed(2)} CGPA required`,
      gapDescription: `${gapDiff} CGPA (~${approxPercentGap}%) below the marks cutoff`,
      suggestedFix: `Target a +0.5 SGPA boost in your upcoming semester exams to qualify for renewal`,
    });
    warningFlags.push(`Marks slightly below cutoff (-${gapDiff} CGPA)`);
  } else {
    cgpaScore = 0;
    const gapDiff = (scholarship.minCgpa - profile.marksCgpa).toFixed(2);
    gaps.push({
      requirement: `Minimum ${scholarship.minCgpa.toFixed(2)} CGPA required`,
      gapDescription: `${gapDiff} CGPA below cutoff (Current: ${profile.marksCgpa.toFixed(2)} vs required: ${scholarship.minCgpa.toFixed(2)})`,
      suggestedFix: `Explore similar scholarships with flexible 6.5 - 7.0 CGPA criteria`,
    });
    warningFlags.push(`Requires minimum ${scholarship.minCgpa.toFixed(2)} CGPA`);
  }

  // 2. Academic Program & Year Level (Weight: 25%)
  let levelScore = 0;
  let levelMatch = false;
  if (scholarship.educationLevel.includes(profile.academicLevel)) {
    levelMatch = true;
    levelScore = 25;
    reasons.push(`Eligible for ${profile.academicLevel} (${profile.currentYear})`);
  } else {
    gaps.push({
      requirement: `Education Level: ${scholarship.educationLevel.join(', ')}`,
      gapDescription: `Program is open only for ${scholarship.educationLevel.join(', ')}`,
      suggestedFix: `Bookmark for when you advance into ${scholarship.educationLevel[0]}`,
    });
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
    reasons.push(`Open to all academic degree streams`);
  } else if (
    scholarship.branches.some(
      (b) =>
        b.toLowerCase() === profile.branch.toLowerCase() ||
        profile.branch.toLowerCase().includes(b.toLowerCase()) ||
        profile.course.toLowerCase().includes(b.toLowerCase())
    )
  ) {
    branchMatch = true;
    branchScore = 20;
    reasons.push(`Direct degree alignment: ${profile.branch}`);
  } else if (scholarship.categories.includes('STEM') && isStemBranch(profile.branch)) {
    branchMatch = true;
    branchScore = 18;
    reasons.push(`STEM engineering/science stream: ${profile.branch}`);
  } else {
    branchScore = 5;
    gaps.push({
      requirement: `Priority streams: ${scholarship.branches.join(', ')}`,
      gapDescription: `Your branch (${profile.branch}) is outside the core priority list`,
      suggestedFix: `Check if your elective or interdisciplinary project aligns with ${scholarship.branches[0]}`,
    });
    warningFlags.push(`Preference for ${scholarship.branches.slice(0, 2).join(', ')}`);
  }

  // 4. Family Annual Income & EWS Assessment (Weight: 15%)
  let incomeScore = 0;
  let incomeMatch = false;

  const incomeCap = scholarship.familyIncomeCapMax ?? 0;

  if (incomeCap === 0) {
    incomeMatch = true;
    incomeScore = 15;
    reasons.push(`No family income ceiling (Pure Merit Award)`);
  } else {
    const isEwsHighPriority = profile.familyAnnualIncome.includes('< ₹2.5 Lakhs');
    const isModerateIncome = profile.familyAnnualIncome.includes('₹2.5L - ₹5 Lakhs');

    if (incomeCap <= 250000) {
      if (isEwsHighPriority) {
        incomeMatch = true;
        incomeScore = 15;
        reasons.push(`Meets strict EWS / BPL income ceiling (< ₹2.5L/year)`);
      } else {
        incomeScore = 3;
        gaps.push({
          requirement: `Annual family income under ₹2.5 Lakhs`,
          gapDescription: `Your income band (${profile.familyAnnualIncome}) exceeds the ₹2.5L cap`,
          suggestedFix: `Apply for CSR scholarships with ₹6L - ₹8L income caps (e.g. Kotak or Infosys)`,
        });
        warningFlags.push(`Strict income ceiling of ₹2.5 Lakhs`);
      }
    } else if (incomeCap <= 600000) {
      if (isEwsHighPriority || isModerateIncome) {
        incomeMatch = true;
        incomeScore = 15;
        reasons.push(`Qualifies under CSR family income ceiling (< ₹6L/year)`);
      } else {
        incomeScore = 5;
        gaps.push({
          requirement: `Family income cap of ₹6 Lakhs`,
          gapDescription: `Exceeds the ₹6,00,000 threshold`,
          suggestedFix: `Explore general merit fellowships without means-testing`,
        });
        warningFlags.push(`Income cap of ₹6 Lakhs`);
      }
    } else {
      if (!profile.familyAnnualIncome.includes('> ₹8 Lakhs')) {
        incomeMatch = true;
        incomeScore = 15;
        reasons.push(`Within Central Govt Non-Creamy limit (< ₹8L/year)`);
      } else {
        incomeScore = 4;
        gaps.push({
          requirement: `Family income cap of ₹8 Lakhs`,
          gapDescription: `Exceeds the ₹8,00,000 non-creamy layer threshold`,
          suggestedFix: `Apply for merit-based corporate fellowships`,
        });
        warningFlags.push(`Income cap of ₹8 Lakhs applies`);
      }
    }
  }

  // 5. Social Category & Affirmative Factors (Weight: 10%)
  let categoryScore = 0;
  let categoryMatch = false;
  const eligibleCategories = scholarship.eligibleCategories || ['General', 'General (EWS)', 'OBC (Non-Creamy Layer)', 'SC', 'ST'];

  if (
    eligibleCategories.includes(profile.socialCategory) ||
    eligibleCategories.includes('General' as any)
  ) {
    categoryMatch = true;
    categoryScore = 10;
    reasons.push(`Category eligible: ${profile.socialCategory}`);
  } else {
    gaps.push({
      requirement: `Category reserved for ${eligibleCategories.join(', ')}`,
      gapDescription: `Opportunity is reserved for ${eligibleCategories.join(', ')} applicants`,
      suggestedFix: `Review open General/EWS schemes like Reliance or Tata Trusts`,
    });
    warningFlags.push(`Reserved for ${eligibleCategories.join(', ')}`);
  }

  // Region Check
  let regionMatch = true;
  const eligibleRegions = scholarship.eligibleRegions || ['All India'];
  const isNational = eligibleRegions.includes('All India');
  if (!isNational && !eligibleRegions.includes(profile.regionState)) {
    regionMatch = false;
    gaps.push({
      requirement: `Domicile: ${eligibleRegions.join(', ')}`,
      gapDescription: `Restricted to students from ${eligibleRegions.join(', ')}`,
      suggestedFix: `Check if you have resident status or native schooling in ${eligibleRegions[0]}`,
    });
    warningFlags.push(`State domicile required: ${eligibleRegions.join(', ')}`);
  }

  // Bonus points for Single Girl Child or First-Gen
  if (profile.isSingleGirlChild && scholarship.categories.includes('Single Girl Child')) {
    reasons.push(`Single Girl Child quota eligible`);
  }
  if (profile.isFirstGen && scholarship.categories.includes('First-Generation Learner')) {
    reasons.push(`First-generation learner priority`);
  }

  const overallPercentage = Math.min(
    100,
    Math.round(cgpaScore + levelScore + branchScore + incomeScore + categoryScore)
  );

  // Almost Eligible detection
  // A scholarship is "Almost Eligible" if score is 50-74% OR has 1-2 fixable gaps
  const isAlmostEligible =
    (overallPercentage >= 50 && overallPercentage < 75) ||
    (gaps.length > 0 && gaps.length <= 2 && overallPercentage >= 45);

  // "Why you match" summary one-liner
  const whyYouMatchLine =
    reasons.length > 0
      ? `Why you match: ${reasons.slice(0, 2).join(' • ')}`
      : scholarship.whyYouMatchSummary;

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
    regionMatch,
    reasons,
    whyYouMatchLine,
    warningFlags,
    isAlmostEligible,
    gaps,
  };
}

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
