import type { Scholarship, StudentProfile, MatchScoreBreakdown } from '../types/scholarship';

/**
 * Deterministic Eligibility & Match Scoring Engine for GRANTLY
 * Computes a weighted 0-100% suitability index between student credentials
 * and scholarship requirements with explainable reasoning.
 */
export function calculateMatchScore(
  scholarship: Scholarship,
  profile: StudentProfile
): MatchScoreBreakdown {
  const reasons: string[] = [];
  const warningFlags: string[] = [];

  // 1. GPA Evaluation (Weight: 30%)
  let gpaScore = 0;
  let gpaMatch = false;

  if (profile.gpa >= scholarship.minGpa) {
    gpaMatch = true;
    gpaScore = 30;
    const surplus = (profile.gpa - scholarship.minGpa).toFixed(2);
    if (parseFloat(surplus) > 0.3) {
      reasons.push(`GPA ${profile.gpa.toFixed(2)} exceeds min requirement (${scholarship.minGpa.toFixed(2)}) by +${surplus}`);
    } else {
      reasons.push(`GPA ${profile.gpa.toFixed(2)} meets min requirement (${scholarship.minGpa.toFixed(2)})`);
    }
  } else if (profile.gpa >= scholarship.minGpa - 0.2) {
    // Within competitive margin
    gpaScore = 15;
    warningFlags.push(`GPA ${profile.gpa.toFixed(2)} is slightly below ${scholarship.minGpa.toFixed(2)} threshold`);
  } else {
    gpaScore = 0;
    warningFlags.push(`Requires min GPA ${scholarship.minGpa.toFixed(2)} (Current: ${profile.gpa.toFixed(2)})`);
  }

  // 2. Academic Level Evaluation (Weight: 25%)
  let levelScore = 0;
  let levelMatch = false;
  if (scholarship.educationLevel.includes(profile.academicLevel)) {
    levelMatch = true;
    levelScore = 25;
    reasons.push(`Enrolled as ${profile.academicLevel}`);
  } else {
    warningFlags.push(`Targeted for ${scholarship.educationLevel.join(', ')}`);
  }

  // 3. Field of Study / Major Match (Weight: 20%)
  let majorScore = 0;
  let majorMatch = false;
  const isAllMajors = scholarship.majors.some((m) =>
    ['All Majors', 'Any', 'General'].includes(m)
  );

  if (isAllMajors) {
    majorMatch = true;
    majorScore = 20;
    reasons.push(`Open to all academic disciplines`);
  } else if (
    scholarship.majors.some(
      (m) =>
        m.toLowerCase() === profile.major.toLowerCase() ||
        profile.major.toLowerCase().includes(m.toLowerCase())
    )
  ) {
    majorMatch = true;
    majorScore = 20;
    reasons.push(`Direct major match: ${profile.major}`);
  } else if (scholarship.categories.includes('STEM') && isStemMajor(profile.major)) {
    majorMatch = true;
    majorScore = 18;
    reasons.push(`STEM discipline alignment: ${profile.major}`);
  } else {
    majorScore = 5;
    warningFlags.push(`Priority for majors: ${scholarship.majors.join(', ')}`);
  }

  // 4. Financial Need & Income Bracket (Weight: 15%)
  let needScore = 0;
  let needMatch = false;

  if (!scholarship.financialNeedRequired) {
    needMatch = true;
    needScore = 15;
    reasons.push(`No financial need restrictions (Merit-based)`);
  } else {
    if (profile.householdIncomeBracket === '<$30k') {
      needMatch = true;
      needScore = 15;
      reasons.push(`Strong priority for high financial need (<$30k bracket)`);
    } else if (profile.householdIncomeBracket === '$30k-$60k') {
      needMatch = true;
      needScore = 12;
      reasons.push(`Eligible under moderate need guidelines`);
    } else if (profile.householdIncomeBracket === '$60k-$100k') {
      needScore = 6;
      warningFlags.push(`Financial need criteria may favor lower income brackets`);
    } else {
      needScore = 2;
      warningFlags.push(`Strict need-based aid qualification`);
    }
  }

  // 5. Citizenship & Demographic Factors (Weight: 10%)
  let citizenshipScore = 0;
  let citizenshipMatch = false;

  if (scholarship.citizenship.includes(profile.citizenship)) {
    citizenshipMatch = true;
    citizenshipScore = 10;
    reasons.push(`Verified ${profile.citizenship} residency eligibility`);
  } else {
    warningFlags.push(`Restricted to ${scholarship.citizenship.join(', ')}`);
  }

  // Bonus: First-Gen or specific diversity category boosts
  if (profile.isFirstGen && scholarship.categories.includes('First-Generation')) {
    reasons.push(`First-generation student qualification bonus`);
  }

  const overallPercentage = Math.min(
    100,
    Math.round(gpaScore + levelScore + majorScore + needScore + citizenshipScore)
  );

  return {
    overallPercentage,
    gpaMatch,
    gpaScore,
    levelMatch,
    levelScore,
    majorMatch,
    majorScore,
    needMatch,
    needScore,
    citizenshipMatch,
    citizenshipScore,
    reasons,
    warningFlags,
  };
}

/**
 * Check if a major name belongs to STEM field
 */
function isStemMajor(major: string): boolean {
  const stemKeywords = [
    'computer',
    'software',
    'engineering',
    'data',
    'math',
    'physics',
    'chemistry',
    'biology',
    'biotech',
    'cyber',
    'information',
    'statistics',
  ];
  const lower = major.toLowerCase();
  return stemKeywords.some((keyword) => lower.includes(keyword));
}
