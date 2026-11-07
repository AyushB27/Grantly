# GRANTLY Design System & Dual-Mode Institutional Architecture

Grantly adopts an **Institutional FinTech & EdTech Architecture**, delivering a high-confidence, professional dashboard experience that treats educational funding with the same clarity and seriousness as modern financial software. It features a complete dual-theme engine (Executive Midnight Slate & Clean High-Contrast Light Mode) with dedicated Side Drawer dashboard navigation.

---

## 1. Color Palette Tokens & Dual-Theme System

Grantly guarantees strict WCAG AAA / AA contrast ratios across both dark and light modes.

### A. Light Mode Tokens (`[data-theme="light"]`, Default in `:root`)
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `--bg-app` | `#f8fafc` | Crisp Clean Slate 50 canvas background |
| `--bg-card` | `#ffffff` | Pure White card surfaces, sidebar, and container panels |
| `--bg-card-hover` | `#f1f5f9` | Slate 100 elevated states, hover rows, inputs |
| `--bg-card-subtle` | `#f8fafc` | Subtle inner panel background |
| `--border-card` | `#e2e8f0` | Slate 200 hairline borders |
| `--border-card-hover` | `#cbd5e1` | Slate 300 active card border |
| `--text-primary` | `#0f172a` | Pitch Charcoal Slate 900 (100% sharp readability) |
| `--text-secondary` | `#334155` | Slate 700 high-contrast secondary labels |
| `--text-muted` | `#64748b` | Slate 500 metadata and eyebrows |
| `--brand-emerald` | `#059669` | Deep Emerald 600 high-contrast primary CTA accent |

### B. Dark Mode Tokens (`[data-theme="dark"]`, Executive Midnight)
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `--bg-app` | `#0b0f19` | Executive Deep Midnight Slate canvas background |
| `--bg-card` | `#111827` | Primary card surfaces, sidebar, and container panels |
| `--bg-card-hover` | `#162032` | Elevated states, input fields, and hover states |
| `--bg-card-subtle` | `#1e293b` | Secondary chip backgrounds, nested boxes |
| `--border-card` | `#1e293b` | Structural hairline borders (1px) |
| `--border-card-hover` | `#334155` | Elevated border focus & hover states |
| `--text-primary` | `#f8fafc` | Crisp Slate 50 primary text & headings |
| `--text-secondary` | `#94a3b8` | Slate 400 subtext, descriptions, metadata |
| `--text-muted` | `#64748b` | Slate 500 eyebrows, deactivated icons |
| `--brand-emerald` | `#10b981` | High-trust Emerald primary CTA accent |

---

## 2. Dashboard Navigation: Side Drawer Architecture

In alignment with modern institutional SaaS platforms (Linear, Stripe, Supabase), post-login navigation uses an **Executive Left Side Drawer / Sidebar** instead of horizontal navbars:
1. **Desktop**: Fixed left sidebar (width: 16rem / 18rem on large screens) containing branding, active workspaces, planning tools, active student card, theme toggle, and sign-out.
2. **Mobile**: Accessible slide-out drawer triggered via the top header hamburger toggle with focus trap and backdrop blur dismiss.
3. **Dedicated Workspaces**:
   - `Find Scholarships`: Personalized curated schemes matching profile
   - `Almost Eligible`: Signature gap diagnostics and instant remedies
   - `Document Vault`: Universal document readiness & live % score
   - `My Applications`: 5-stage application progress tracking board
   - `Upcoming Deadlines`: Urgency-sorted countdowns (Urgent, Upcoming, Archived)
   - `Combine Scholarships`: Multi-grant stacking & policy conflict detection
   - `College Fee Calculator`: Net college fee coverage visualizer

---

## 3. Scroll Reveal & Transition Architecture

All landing page sections feature hardware-accelerated scroll transitions using an `IntersectionObserver` observing `.reveal-on-scroll`:
- Smooth `translateY(28px) -> translateY(0)` and `opacity: 0 -> 1` with a `0.65s cubic-bezier(0.16, 1, 0.3, 1)` easing.
- Respects user accessibility preferences: automatically disables transitions when `prefers-reduced-motion: reduce` is detected.

---

## 4. Typography & Micro-Copy Rules

1. **Heading & Body Font**: `Plus Jakarta Sans` (`400`, `500`, `600`, `700`, `800`, `900`).
2. **Monospace & Numerical Data**: `DM Mono` (`400`, `500`). Used for:
   - Currency figures (`₹1,20,000`)
   - Percentages (`85% Match`, `75% Ready`)
   - Eyebrows (`.eyebrow`)
   - Dates and countdowns (`2026-11-30`, `5d left`)
3. **Eyebrow Micro-Labels**:
   ```css
   .eyebrow {
     font-family: var(--font-mono);
     font-size: 10px;
     letter-spacing: 1.4px;
     text-transform: uppercase;
     font-weight: 600;
     color: var(--text-muted);
   }
   ```

---

## 5. Standard Institutional Buttons

### `.btn-mint` (Primary CTA)
```css
.btn-mint {
  background-color: var(--brand-emerald);
  color: #ffffff !important;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(16, 185, 129, 0.25);
}
```

### `.btn-panel` (Secondary Institutional Button)
```css
.btn-panel {
  background-color: var(--bg-card-hover);
  border: 1px solid var(--border-card);
  color: var(--text-primary);
  font-weight: 500;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}
```

---

## 4. Responsive Breakpoints & Container Constraints

- **Mobile (< 768px)**: `1rem` horizontal padding, single-column stacked grids, touch targets ≥ 44px.
- **Tablet (769px – 1024px)**: `1.75rem` padding, 2-column card layouts, compact toolbar.
- **Desktop (≥ 1025px)**: Max container width `1320px` centered with `2.25rem` padding, 3-column scholarship grid, 5-column Kanban application board.
- **Zero Horizontal Scroll**: Strict `overflow-x: hidden` on viewport with fluid `flex` and `grid` layouts.
