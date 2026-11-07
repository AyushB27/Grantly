import { describe, it, expect } from 'vitest';
import { detectStackConflicts } from '../stackConflictDetector';
import type { Scholarship } from '../../types/scholarship';

const createMockGrant = (overrides: Partial<Scholarship>): Scholarship => ({
  id: 'grant-mock-1',
  title: 'Mock Scholarship 1',
  provider: 'Provider 1',
  organizationType: 'CSR Foundation',
  amount: 50000,
  awardType: 'Tuition Fee Waiver',
  renewable: true,
  deadline: '2026-12-31',
  effortEstimate: '⚡ ~30 mins',
  effortMinutes: 30,
  educationLevel: ['Undergraduate'],
  minCgpa: 7.0,
  categories: ['STEM'],
  branches: ['All Streams'],
  eligibleCategories: ['General'],
  eligibleRegions: ['All India'],
  familyIncomeCapMax: 800000,
  description: 'Mock Description',
  plainEnglishSummary: 'Mock Summary',
  whyYouMatchSummary: 'Mock Match',
  eligibilityCriteria: [],
  requiredDocuments: [],
  applicationSteps: [],
  portalUrl: 'https://example.gov.in',
  verifiedSource: true,
  acceptanceRateEstimate: '~15%',
  stackConflicts: [],
  ...overrides,
});

describe('Stack Conflict Detector Engine', () => {
  it('returns empty conflicts array for an empty or single scholarship list', () => {
    expect(detectStackConflicts([])).toEqual([]);
    expect(detectStackConflicts([createMockGrant({ id: 'g1' })])).toEqual([]);
  });

  it('allows non-conflicting CSR and Private Trust combinations', () => {
    const grantA = createMockGrant({
      id: 'csr-reliance',
      title: 'Reliance Foundation Grant',
      organizationType: 'CSR Foundation',
    });
    const grantB = createMockGrant({
      id: 'csr-tata',
      title: 'Tata Trusts Grant',
      organizationType: 'Private Trust',
    });

    const conflicts = detectStackConflicts([grantA, grantB]);
    expect(conflicts).toHaveLength(0);
  });

  it('flags conflict when combining two Central Government (NSP) schemes', () => {
    const grantA = createMockGrant({
      id: 'nsp-central-sector',
      title: 'Central Sector Scheme',
      organizationType: 'Central Govt (NSP)',
    });
    const grantB = createMockGrant({
      id: 'nsp-inspire',
      title: 'INSPIRE SHE Fellowship',
      organizationType: 'Central Govt (NSP)',
    });

    const conflicts = detectStackConflicts([grantA, grantB]);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].grantA).toBe('Central Sector Scheme');
    expect(conflicts[0].grantB).toBe('INSPIRE SHE Fellowship');
    expect(conflicts[0].reason).toContain('prohibited under NSP guidelines');
  });

  it('flags conflict between Central Govt and State Govt schemes', () => {
    const grantA = createMockGrant({
      id: 'nsp-central',
      title: 'Central Sector Scheme',
      organizationType: 'Central Govt (NSP)',
    });
    const grantB = createMockGrant({
      id: 'state-post-matric',
      title: 'Karnataka SSP Post-Matric',
      organizationType: 'State Govt',
    });

    const conflicts = detectStackConflicts([grantA, grantB]);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].reason).toContain('State DBT and Central NSP schemes');
  });

  it('flags explicit custom ID stack conflicts defined by provider', () => {
    const grantA = createMockGrant({
      id: 'kvpy',
      title: 'KVPY Fellowship',
      organizationType: 'Private Trust',
      stackConflicts: ['pmrf-fellowship'],
    });
    const grantB = createMockGrant({
      id: 'pmrf-fellowship',
      title: 'PMRF Fellowship',
      organizationType: 'Private Trust',
      stackConflicts: [],
    });

    const conflicts = detectStackConflicts([grantA, grantB]);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].reason).toContain('Explicit dual-benefit restriction');
  });
});
