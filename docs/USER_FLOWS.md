# GRANTLY Key User Flows & Persona Journeys

Mapped directly against the real educational financial aid journey of Indian higher education students.

---

## 1. Primary Student Personas

| Persona | Background & Context | Primary Pain Point | Grantly Solution Flow |
|---|---|---|---|
| **P1: First-Generation Student** | First in family to attend college; unfamiliar with Central/State quotas and document criteria. | Discovers required paperwork late; intimidated by bureaucratic legalese. | **Flow 1 & Flow 3**: Smart Onboarding pre-fills credentials; Document Vault checklists identify missing certificates in advance. |
| **P2: Mobile-First Tier-2/3 Student** | Browses on a 4G mobile phone with intermittent connectivity and strict data limits. | Portals fail to render, PDF circulars don't load, navigation is confusing. | **Flow 2**: Zero heavy assets, lightweight accessible UI, touch-friendly 44px targets, instant local filtering without server roundtrips. |
| **P3: Final-Year High-Merit Student** | Juggling rigorous exams, capstone projects, and multiple application deadlines. | Forgets critical portal closing dates; unaware of stacking restrictions. | **Flow 4 & Flow 5**: Deadlines Radar sorts by urgency; Multi-Scholarship Combine Planner prevents double-dipping claims. |

---

## 2. Key User Journeys

### Flow 1: First Visit, Landing Page & Smart Onboarding
```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Landing as Landing Page
    participant Auth as Auth / Demo Personas
    participant Onboarding as Onboarding Profile Modal
    participant Engine as Deterministic Match Engine
    participant Dashboard as Dashboard & Side Drawer

    Student->>Landing: Visits Grantly (editorial scroll-reveal showcase)
    Student->>Landing: Interacts with Live Eligibility Preview Widget
    Student->>Auth: Clicks "Launch Dashboard" / Selects Demo Student (e.g. Aarav)
    Auth->>Onboarding: Opens Calibrate Profile
    Onboarding->>Onboarding: Step 1: Course (B.Tech) & Year (3rd Year)
    Onboarding->>Onboarding: Step 2: CGPA (8.8) & Target Tuition (₹1.2L)
    Onboarding->>Onboarding: Step 3: Category (EWS) & Income (< ₹2.5L)
    Onboarding->>Onboarding: Step 4: Domicile (Delhi) & Review
    Onboarding->>Engine: Dispatches updateProfile(sanitizedData)
    Engine->>Dashboard: Recalculates match scores (0-100%)
    Dashboard->>Student: Renders personalized feed with "Why you match" rationales
```

---

### Flow 2: Discover, Compare, and Understand Options
1. **Search**: Student types *"Reliance"* or selects the `STEM` category pill in the filter bar.
2. **Review Feed**: Cards display verified source tags, effort estimates (`⚡ ~35 mins`), and match percentages.
3. **Compare**: Student taps "Compare" on Reliance and Tata Trusts to evaluate them side-by-side in `ComparisonModal`.
4. **Understand**: Student clicks "Understand" on Reliance to review:
   - Plain-English breakdown (no legal circulars).
   - 3-way checklist: 10/12 Marksheets (**Met ✓**), Income (< ₹6L **Met ✓**).
   - 3-step application roadmap.
   - Official portal button with URL protocol validation (`sanitizeUrl`).

---

### Flow 3: Fixing an "Almost Eligible" Gap
1. Student switches to **Almost Eligible** in the side drawer.
2. Views *L'Oréal India STEM Fellowship* flagged with a **Near Miss** score of 72%.
3. Grantly diagnoses exact gap: *"0.30 CGPA below marks cutoff"*.
4. Remedy suggestion: *"Target a +0.5 SGPA boost in upcoming semester exams"*.
5. In the meantime, Grantly surfaces 2 alternative schemes that the student *already* qualifies for (e.g. *Dr. Reddy's Sashakt*).
6. Student clicks "Fix in Document Vault" to verify outstanding certificates, raising their **Application Readiness** score.

---

### Flow 4: Apply, Track, and Manage Outcomes
1. Student saves Reliance Foundation grant to their **My Applications** tracker.
2. Card appears in **Saved** column on the 5-stage application board.
3. Student clicks "Open Checklist" to open **Guided Application Workspace**:
   - Checks off required documents.
   - Drafts personal statement on the continuous auto-saving scratchpad (with live word/character counters).
   - Records application portal reference ID in sanitized notes.
4. Advances stage using symmetrical chevrons: `Saved` → `Preparing Docs` → `Submitted` → `Under Review`.
5. Upon notification, advances to `Awarded / Results` and clicks `Won`.
6. Won funding (₹2,00,000) automatically increments the confirmed won pool in `FinancialAidSummary`!

---

### Flow 5: Scholarship Stacking & Net College Fee Calculator
1. Student navigates to **Combine Scholarships** in the sidebar.
2. Combines a Central Government DBT tuition waiver with a Private CSR living stipend.
3. Concurrency engine validates that private CSR trusts can legally stack with government aid.
4. Net college fee calculator updates: displays **100% Fee Coverage** with ₹0 out-of-pocket remaining.
