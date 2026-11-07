# GRANTLY Functional Features Specification

> **Platform:** GRANTLY — From Scholarship Search to Scholarship Success  
> **Target Audience:** Indian Higher Education Scholars (Central NSP, State DBT, CSR Foundations)  
> **Design Principle:** *Clarity over volume. Confidence over choice. Action over bureaucracy.*

---

## Module 1. Smart Onboarding Profile & Calibration

### Purpose
Eliminates repetitive form-filling and bureaucratic hurdles by capturing verified academic, economic, and identity attributes in a multi-step guided experience that auto-persists locally.

### Specifications
- **Steps**:
  1. *Academic Identity*: Full legal name, Course title, Specialization/Branch, Academic level, Current study year.
  2. *Academic Performance*: Interactive CGPA slider (5.0 to 10.0), auto-calculated percentage (~9.5x AICTE formula), and target annual college fees.
  3. *Social & Financial Status*: Reservation category (General, General (EWS), OBC-NCL, SC, ST), Annual income band, First-generation student affirmation, Single girl child affirmation.
  4. *Domicile & Verification*: Domicile State / UT (essential for State DBT programs), with a live review digest.
- **Persistence**: Auto-synced to `localStorage` under `grantly_student_profile_v2`.
- **Validation**: Inline error validation prevents advancing without essential attributes.

---

## Module 2. Personalized Scholarship Feed

### Purpose
Delivers a tailored scholarship catalog sorted by real student win-probability rather than arbitrary chronological listings.

### Specifications
- **Card Elements**:
  - Scheme title and verified organization (`Central Govt (NSP)`, `State Govt`, `CSR Foundation`, `Private Trust`).
  - Award amount in Indian Rupees (`₹`) with recurrence badge (`Renewable Annually`).
  - **Mandatory "Why you match" Line**: Clear 1-line justification explaining exactly why the student qualified (e.g. *"First-generation learner preference • High CGPA (8.65 vs 7.50)"*).
  - Effort Estimate (e.g. `⚡ ~35 mins effort`).
  - Verified Source Badge with direct external portal linkage.
  - Match Score Pill (0–100%) with high-contrast color coding.
- **Search & Filtering**:
  - Instant text search across scheme titles, providers, branches, and categories.
  - Academic level dropdown (`Undergraduate`, `Postgraduate`, `PhD / Research`, `Class 11-12`).
  - Category radio pills (`STEM`, `Need-Based`, `Women in Tech`, `SC / ST / OBC`, etc.).
  - Checkbox toggles: `Renewable`, `High Match (≥75%)`, `Almost Eligible (Gap Match)`.

---

## Module 3. Plain-English Detail View & Application Roadmap

### Purpose
Demystifies dense government and institutional rules into plain-English, actionable roadmaps with zero legalese.

### Specifications
- **Plain-English Summary**: Summarizes eligibility and value proposition with zero legalese.
- **3-Way Eligibility Checklist**:
  - **Met ✓**: Green badge indicating the student meets or exceeds the criterion.
  - **Near Miss ▲**: Amber badge indicating small repairable shortfall (e.g. within 0.5 CGPA).
  - **Unmet ✕**: Rose badge indicating non-qualifying condition.
- **Application Roadmap**: 3 to 5 guided sequential steps (e.g. Step 1: OTR Portal Registration, Step 2: HOD Bonafide Endorsement, Step 3: Direct NEFT Disbursal).
- **Required Documents List**: Specific certificates enumerated for immediate preparation.
- **Tuition Coverage Gauge**: Visual progress bar showing what % of annual college fees this grant covers.

---

## Module 4. "Almost Eligible" Gap Advisor *(Signature Feature)*

### Purpose
Rescues near-miss scholarships that students usually discard by identifying the exact shortfall, suggesting the fix, and offering alternative matching grants.

### Specifications
- **Exact Shortfall Diagnosis**:
  - e.g. *"0.35 CGPA below the marks cutoff"* or *"Missing digital income certificate under ₹4 Lakhs"*.
- **Actionable Remedy Suggestion**:
  - e.g. *"Target an 7.80 SGPA in Semester 3 examinations to pull your cumulative score above the threshold"* or *"Upload valid Digital Income Certificate issued by Tehsildar in Document Vault"*.
- **Surfaced Matching Alternatives**:
  - One-click trigger that unfolds alternative scholarships with lower thresholds for which the student *already* satisfies 100% of criteria.
- **Interactive Triggers**: Quick links to "Fix in Document Vault" and "Simulate Profile Metrics".

---

## Module 5. Universal Document Vault & Readiness Score *(Signature Feature)*

### Purpose
Pre-verifies mandatory paperwork to prevent last-minute disqualifications, calculating an aggregate **Application Readiness %** that updates live.

### Specifications
- **Central Paperwork Inventory**:
  - Aadhaar Card (DBT-seeded), Class 10/12 Marksheets, College Bonafide, Family Income Certificate, Digital Caste Certificate, Bank Passbook, Fee Structure, and Statement of Purpose.
- **Interactive Status Toggles**:
  - `✓ Ready` (`uploaded`): Paperwork confirmed in local browser memory.
  - `▲ Expiring` (`expiring`): Renewal note surfaced (e.g. *"Expires in 22 days • Renew at Tehsil portal"*).
  - `✕ Missing` (`missing`): Direct action prompt.
- **Live Readiness Gauge**:
  - Weighted computation of verified items displayed as an accessible progress bar and big-number indicator.
- **Zero Cloud Upload**: All documents remain strictly on the student's local machine for maximum privacy.

---

## Module 6. Application Progress Tracker

### Purpose
Organizes and tracks multiple concurrent grant applications through a structured 5-stage board without missed deadlines or corporate jargon.

### Specifications
- **5 Progressive Stages**:
  1. `Saved`: Bookmarked schemes under consideration.
  2. `Preparing Docs`: Actively drafting essays, gathering college seals.
  3. `Submitted`: Application lodged on official government / trust portal.
  4. `Under Review`: Acknowledgment code recorded, institutional verification pending.
  5. `Awarded / Results`: Outcome determined (`Won` with funding added to total won pool, or `Closed`).
- **Interactive Card Controls**:
  - Compact `[ ← ]` and `[ → ]` controls for advancing or moving back stages.
  - Outcome selector in `Results` stage (`Won` / `Closed`).
  - Uniform `h-[230px]` card alignment across all columns.
  - One-click `[ Open Checklist ]` button leading to the guided workspace.
- **Export Facility**: One-click download of the complete tracked applications as a clean JSON file.

---

## Module 7. Upcoming Deadlines Radar

### Purpose
Organizes critical closing dates by urgency so students never lose grants to unannounced portal closures.

### Specifications
- **3 Clean Partitions**:
  1. **This Week — High Urgency**: Deadlines closing within 0 to 7 days with countdown badge.
  2. **Later / Upcoming Portals**: Portals open beyond 7 days.
  3. **Overdue / Closed Portals**: Archived schemes for historical reference.
- **Filter Switcher**: Seamlessly toggle between "All Catalog Grants" and "My Tracked Applications".

---

## Module 8. Multi-Scholarship Concurrency Planner *(Stretch Feature)*

### Purpose
Allows ambitious students to combine multiple grants into a comprehensive financial aid package while auto-detecting legal non-stacking clauses.

### Specifications
- **Concurrency Conflict Detection**:
  - Flags duplicate Central Government grants prohibited under National Scholarship Portal (NSP) rules.
  - Flags State DBT vs Central NSP tuition waiver overlaps.
  - Clarifies when private CSR grants (Tata, Reliance) can be legally received alongside government waivers.
- **Financial Aid Aggregator**:
  - Computes Net Total Stacked Funding vs Target Annual Fees.
  - Computes net out-of-pocket remaining tuition costs.
