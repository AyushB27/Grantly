# GRANTLY Accessibility (A11y) & WCAG 2.1 AA Audit

Grantly is engineered from the ground up to ensure equal access for all students, including mobile-first students on low-bandwidth networks and users relying on assistive screen readers.

---

## 1. Compliance Checklist (WCAG 2.1 AA)

| Criterion | Level | Implementation in Grantly | Status |
|---|---|---|---|
| **1.1.1 Non-text Content** | Level A | All SVG icons have `aria-hidden="true"`, buttons have explicit `aria-label`, informative badges provide descriptive text. | **Pass** |
| **1.3.1 Info and Relationships** | Level A | HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) structure every page. | **Pass** |
| **1.4.1 Use of Color** | Level A | Status information never relies on color alone; every badge includes icons, text labels, and countdown metrics. | **Pass** |
| **1.4.3 Contrast (Minimum)** | Level AA | Contrast ratio between `#090b0b` / `#101313` background and `#edf1ec` text exceeds 14:1 (surpassing 4.5:1 requirement). Mint `#a9f46b` on dark background exceeds 11:1. | **Pass** |
| **2.1.1 Keyboard** | Level A | Every action (modal close, filter selection, kanban stage move, drawer toggle) is 100% keyboard operable with visible focus indicators. | **Pass** |
| **2.4.1 Bypass Blocks** | Level A | Skip Link (`<SkipLink />`) allows keyboard users to immediately skip navigation to `#main-content`. | **Pass** |
| **2.4.3 Focus Order** | Level A | Modals trap keyboard focus upon opening and return focus to triggering element upon Escape or Close. | **Pass** |
| **2.5.5 Target Size** | Level AAA | All interactive buttons and touch controls have a minimum bounding box of 44×44px on mobile viewports. | **Pass** |
| **4.1.2 Name, Role, Value** | Level A | ARIA roles (`role="dialog"`, `role="region"`, `role="radiogroup"`, `aria-live="polite"`, `aria-current="page"`) explicitly declared. | **Pass** |

---

## 2. Landmark Structure

```html
<header class="sticky top-0 z-40 ...">
  <SkipLink /> <!-- "Skip to main content" -->
  <nav aria-label="Main Navigation"> ... </nav>
</header>

<main id="main-content" tabindex="-1">
  <section aria-label="Welcome and Platform Overview"> ... </section>
  <section aria-label="Student Profile Match Simulator"> ... </section>
  <aside aria-label="Scholarship Filters"> ... </aside>
  <div role="region" aria-label="Scholarship Opportunities List">
    <article aria-labelledby="grant-title-..."> ... </article>
  </div>
</main>

<footer class="..."> ... </footer>
```

---

## 3. Keyboard Navigation Shortcuts

- `Tab` / `Shift+Tab`: Natural logical navigation order through interactive landmarks.
- `Escape`: Instantly dismisses active modals (`OnboardingModal`, `ScholarshipDetailModal`, `WorkspaceModal`, `ComparisonModal`, `MobileDrawer`).
- `Enter` / `Space`: Activates buttons, toggles checkboxes, and selects category radio pills.
