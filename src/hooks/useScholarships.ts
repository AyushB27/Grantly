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
      // Keyword search
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesProvider = item.provider.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesBranch = item.branches.some((b) => b.toLowerCase().includes(query));
        const matchesCategory = item.categories.some((c) => c.toLowerCase().includes(query));

        if (!matchesTitle && !matchesProvider && !matchesDesc && !matchesBranch && !matchesCategory) {
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

      // Max Effort in minutes
      if (filters.maxEffortMinutes > 0 && item.effortMinutes > filters.maxEffortMinutes) {
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

      // F4 Almost Eligible Filter
      if (filters.onlyAlmostEligible && !item.matchBreakdown.isAlmostEligible) {
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
      case 'effort':
        return list.sort((a, b) => a.effortMinutes - b.effortMinutes);
      default:
        return list;
    }
  }, [filteredScholarships, filters.sortBy]);

  // 4. Financial Aid & Portfolio Aggregates in INR (₹)
  const aidAnalytics = useMemo(() => {
    let totalPotentialFunding = 0;
    let totalAppliedFunding = 0;
    let totalAwardedFunding = 0;
    let urgentDeadlineCount = 0;
    let almostEligibleCount = 0;

    const statusMap = new Map(
      trackedApplications.map((app) => [app.scholarshipId, app.stage])
    );

    enrichedScholarships.forEach((s) => {
      const stage = statusMap.get(s.id);
      totalPotentialFunding += s.amount;

      if (stage === 'preparing' || stage === 'submitted' || stage === 'under_review' || stage === 'result') {
        totalAppliedFunding += s.amount;
      }

      if (stage === 'result') {
        const app = trackedApplications.find((a) => a.scholarshipId === s.id);
        if (app?.resultOutcome === 'awarded') {
          totalAwardedFunding += s.amount;
        }
      }

      const urgency = getDeadlineUrgency(s.deadline);
      if (urgency.isUrgent) {
        urgentDeadlineCount += 1;
      }

      if (s.matchBreakdown.isAlmostEligible) {
        almostEligibleCount += 1;
      }
    });

    const netTuitionNeedRemaining = Math.max(
      0,
      profile.targetAnnualFees - totalAwardedFunding
    );

    const fundingCoveragePercentage = Math.min(
      100,
      Math.round((totalAwardedFunding / (profile.targetAnnualFees || 1)) * 100)
    );

    return {
      totalPotentialFunding,
      totalAppliedFunding,
      totalAwardedFunding,
      urgentDeadlineCount,
      almostEligibleCount,
      netTuitionNeedRemaining,
      fundingCoveragePercentage,
      totalCount: scholarships.length,
      filteredCount: sortedScholarships.length,
    };
  }, [
    scholarships.length,
    enrichedScholarships,
    sortedScholarships.length,
    trackedApplications,
    profile.targetAnnualFees,
  ]);

  return {
    scholarships: sortedScholarships,
    allEnriched: enrichedScholarships,
    aidAnalytics,
  };
}
