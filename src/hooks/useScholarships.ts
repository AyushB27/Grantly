import { useMemo } from 'react';
import { useScholarshipContext } from '../context/ScholarshipContext';
import { calculateMatchScore } from '../utils/matchCalculator';
import type { Scholarship, MatchScoreBreakdown } from '../types/scholarship';
import { getDeadlineUrgency } from '../utils/formatters';

export interface EnrichedScholarship extends Scholarship {
  matchBreakdown: MatchScoreBreakdown;
  matchScore: number;
}

export function useScholarships() {
  const { scholarships, profile, filters, trackedApplications } = useScholarshipContext();

  // 1. Enrich all scholarships with dynamic match scoring against current profile
  const enrichedScholarships = useMemo<EnrichedScholarship[]>(() => {
    return scholarships.map((scholarship) => {
      const matchBreakdown = calculateMatchScore(scholarship, profile);
      return {
        ...scholarship,
        matchBreakdown,
        matchScore: matchBreakdown.overallPercentage,
      };
    });
  }, [scholarships, profile]);

  // 2. Filter scholarships based on user search and facet criteria
  const filteredScholarships = useMemo<EnrichedScholarship[]>(() => {
    return enrichedScholarships.filter((item) => {
      // Keyword search (case-insensitive across title, provider, description, majors)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesProvider = item.provider.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesMajor = item.majors.some((m) => m.toLowerCase().includes(query));
        const matchesCategory = item.categories.some((c) => c.toLowerCase().includes(query));

        if (!matchesTitle && !matchesProvider && !matchesDesc && !matchesMajor && !matchesCategory) {
          return false;
        }
      }

      // Academic Level
      if (
        filters.academicLevel !== 'All' &&
        !item.educationLevel.includes(filters.academicLevel as any)
      ) {
        return false;
      }

      // Category
      if (
        filters.category !== 'All' &&
        !item.categories.includes(filters.category as any)
      ) {
        return false;
      }

      // Min Award Amount
      if (filters.minAmount > 0 && item.amount < filters.minAmount) {
        return false;
      }

      // Max GPA requirement
      if (item.minGpa > filters.maxGpaRequirement) {
        return false;
      }

      // Only Renewable
      if (filters.onlyRenewable && !item.renewable) {
        return false;
      }

      // Only Eligible (Match Score >= 75%)
      if (filters.onlyEligible && item.matchScore < 75) {
        return false;
      }

      return true;
    });
  }, [enrichedScholarships, filters]);

  // 3. Sort filtered list
  const sortedScholarships = useMemo<EnrichedScholarship[]>(() => {
    const list = [...filteredScholarships];
    switch (filters.sortBy) {
      case 'match':
        return list.sort((a, b) => b.matchScore - a.matchScore);
      case 'deadline':
        return list.sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
      case 'amount_desc':
        return list.sort((a, b) => b.amount - a.amount);
      case 'amount_asc':
        return list.sort((a, b) => a.amount - b.amount);
      case 'title':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list;
    }
  }, [filteredScholarships, filters.sortBy]);

  // 4. Financial Aid & Portfolio Aggregates
  const aidAnalytics = useMemo(() => {
    let totalPotentialFunding = 0;
    let totalAppliedFunding = 0;
    let totalAwardedFunding = 0;
    let urgentDeadlineCount = 0;

    // Track map for fast status check
    const statusMap = new Map(
      trackedApplications.map((app) => [app.scholarshipId, app.stage])
    );

    scholarships.forEach((s) => {
      const stage = statusMap.get(s.id);
      totalPotentialFunding += s.amount;

      if (stage === 'in_progress' || stage === 'submitted' || stage === 'awarded') {
        totalAppliedFunding += s.amount;
      }

      if (stage === 'awarded') {
        totalAwardedFunding += s.amount;
      }

      const urgency = getDeadlineUrgency(s.deadline);
      if (urgency.isUrgent) {
        urgentDeadlineCount += 1;
      }
    });

    const netTuitionNeedRemaining = Math.max(
      0,
      profile.targetTuitionAnnual - totalAwardedFunding
    );

    const fundingCoveragePercentage = Math.min(
      100,
      Math.round((totalAwardedFunding / (profile.targetTuitionAnnual || 1)) * 100)
    );

    return {
      totalPotentialFunding,
      totalAppliedFunding,
      totalAwardedFunding,
      urgentDeadlineCount,
      netTuitionNeedRemaining,
      fundingCoveragePercentage,
      totalCount: scholarships.length,
      filteredCount: sortedScholarships.length,
    };
  }, [scholarships, sortedScholarships.length, trackedApplications, profile.targetTuitionAnnual]);

  return {
    scholarships: sortedScholarships,
    allEnriched: enrichedScholarships,
    aidAnalytics,
  };
}
