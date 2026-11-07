# Changelog

All notable changes to the **GRANTLY** scholarship platform will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), adhering to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-07

### Added
- **Personalized Feed Engine**: Deterministic match scoring algorithm computing eligibility across Central NSP, State DBT, and CSR foundation schemes.
- **"Almost Eligible" Gap Advisor**: Real-time diagnosis of near-miss academic/income criteria with actionable remediation advice.
- **Universal Document Vault**: Reusable certificate tracking with live Application Readiness score and expiration monitoring.
- **5-Stage Application Tracker**: Visual board organizing applications (`Saved`, `Preparing`, `Submitted`, `Under Review`, `Awarded/Closed`) with checklist progress.
- **Deadlines Radar**: Time-sensitive urgency classifier prioritizing schemes closing in 0–7 days.
- **Scholarship Stacking Engine**: Pure conflict detector preventing illegal double-dipping between concurrent government tuition grants.
- **Full Offline & Privacy Sovereignty**: 100% client-side persistence in `localStorage` with zero remote telemetry or tracking.
- **Security Hardening**:
  - Deep string and HTML input sanitization (`sanitizeInput`) preventing XSS attacks.
  - Strict HTTPS protocol enforcement for external application portals (`sanitizeUrl`).
  - Safe JSON deserialization primitives (`safeJsonParse`) with defensive schema fallbacks.
  - Vercel edge deployment security headers (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
- **Accessibility & Design System**:
  - High-contrast Light Mode default (`15.8:1` contrast ratio) with accessible Dark Mode toggle.
  - Semantic HTML5 landmarks (`header`, `nav`, `main`, `footer`), single `h1` per page, and Skip to Content link.
  - Active keyboard focus trap in all modal dialogs with Escape dismissal and focus restoration.
  - Polite ARIA live regions for real-time simulator and filter feedback.
  - Minimal `@media print` stylesheet for clean student financial aid reports.
- **Automated Testing Suite**: 40 passing unit tests across matching engine, formatters, sanitization, storage primitives, and conflict detection.
