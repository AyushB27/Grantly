# GRANTLY Domain Data Model & Schema Reference

Grantly uses strictly typed TypeScript domain models across its entire data lifecycle.

---

## 1. Schema Definitions (`src/types/scholarship.ts`)

```typescript
export type EducationLevel =
  | 'Class 11-12'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'PhD / Research';

export type CategoryTag =
  | 'STEM'
  | 'Need-Based (EWS)'
  | 'Merit-Based'
  | 'Women in Tech'
  | 'SC / ST / OBC'
  | 'First-Generation Learner'
  | 'Healthcare & Medical'
  | 'Single Girl Child';

export type SocialCategory =
  | 'General'
  | 'General (EWS)'
  | 'OBC (Non-Creamy Layer)'
  | 'SC'
  | 'ST';

export type IncomeBracket =
  | '< ₹2.5 Lakhs (Full EWS)'
  | '₹2.5L - ₹5 Lakhs'
  | '₹5L - ₹8 Lakhs (Non-Creamy Limit)'
  | '> ₹8 Lakhs (General / Creamy Layer)';

export type ApplicationStage =
  | 'saved'
  | 'preparing'
  | 'submitted'
  | 'under_review'
  | 'result';

export type DocumentStatus = 'uploaded' | 'missing' | 'expiring';
```

---

## 2. Core Entities

### `Scholarship` Entity
```typescript
export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  organizationType: 'Central Govt (NSP)' | 'State Govt' | 'CSR Foundation' | 'Private Trust';
  amount: number; // in INR (₹)
  awardType: 'Tuition Fee Waiver' | 'Annual Maintenance Allowance' | 'Direct Cash Grant' | 'Research Fellowship';
  renewable: boolean;
  deadline: string; // YYYY-MM-DD
  effortEstimate: string; // e.g. "⚡ ~35 mins effort"
  effortMinutes: number;
  educationLevel: EducationLevel[];
  minCgpa: number; // On 10.0 scale
  categories: CategoryTag[];
  branches: string[];
  eligibleCategories: SocialCategory[];
  eligibleRegions: string[];
  familyIncomeCapMax: number; // 0 for no cap, or ceiling in INR
  description: string;
  plainEnglishSummary: string;
  whyYouMatchSummary: string; // Mandatory "Why you match" summary
  eligibilityCriteria: EligibilityRuleItem[];
  requiredDocuments: string[];
  applicationSteps: ApplicationStepItem[]; // 3-5 guided steps
  verifiedSource: boolean;
  portalUrl: string;
  acceptanceRateEstimate: string;
  stackConflicts: string[]; // Concurrency restriction IDs
}
```

### `StudentProfile` Entity
```typescript
export interface StudentProfile {
  fullName: string;
  university?: string; // University / College name (e.g. IIT Delhi, Anna University)
  course: string;
  currentYear: '1st Year' | '2nd Year' | '3rd Year' | 'Final Year' | 'Postgraduate';
  academicLevel: EducationLevel;
  branch: string;
  marksCgpa: number; // 0.0 to 10.0
  marksPercentage: number;
  socialCategory: SocialCategory;
  familyAnnualIncome: IncomeBracket;
  regionState: string;
  isFirstGen: boolean;
  isSingleGirlChild: boolean;
  targetAnnualFees: number;
  isOnboardingCompleted: boolean;
}
```

### `TrackedApplication` Entity
```typescript
export interface TrackedApplication {
  scholarshipId: string;
  stage: ApplicationStage;
  dateAdded: string;
  completedChecklist: string[];
  essayDraft: string;
  notes: string;
  resultOutcome?: 'awarded' | 'not_selected' | 'regret';
  customReminderDate?: string;
}
```

### `DocumentVaultItem` Entity
```typescript
export interface DocumentVaultItem {
  id: string;
  name: string;
  description: string;
  category: 'Academic' | 'Income & Social' | 'Identity' | 'Institutional';
  status: DocumentStatus;
  lastUpdated?: string;
  expiryNote?: string;
}
```

---

## 3. Seeded Datasets (`src/data/mockScholarships.ts`)

- **20 Real Indian Schemes**:
  1. Reliance Foundation Undergraduate Scholarship (₹2,00,000)
  2. HDFC Badhte Kadam / Parivartan ECSS (₹75,000)
  3. Kotak Kanya Scholarship for Girls (₹1,50,000)
  4. Central Sector Scheme of Scholarship (PM-USP / NSP) (₹20,000)
  5. Tata Trusts Individual Grant for Education (₹60,000)
  6. L’Oréal India For Young Women In Science (₹2,50,000)
  7. Prime Minister's Research Fellowship (PMRF) (₹80,000/mo)
  8. ONGC Foundation Scholarship for SC/ST/OBC (₹48,000)
  9. Infosys Foundation STEM Stars Scholarship (₹1,00,000)
  10. Santoor Women’s Scholarship (₹24,000)
  11. Pragati Scholarship Scheme for Girls (AICTE) (₹50,000)
  12. Post Matric Scholarship for SC/ST (NSP) (₹1,35,000)
  13. Dr. Reddy’s Foundation Sashakt Scholarship (₹2,40,000)
  14. INSPIRE Scholarship for Higher Education (SHE) (₹80,000)
  15. Siemens Scholarship Program for First-Year B.Tech (₹1,40,000)
  16. Vidyasaarathi Corporate ACC / JSW CSR (₹40,000)
  17. Narotam Sekhsaria Higher Education Fellowship (₹20,00,000)
  18. LIC Golden Jubilee Scholarship Scheme (₹40,000)
  19. Sitaram Jindal Foundation Scholarship (₹38,400)
  20. Aditya Birla Capital COVID Support & Merit Grant (₹60,000)
