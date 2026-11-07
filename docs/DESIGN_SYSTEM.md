# GRANTLY Design System & StockFolio Dark Precision Specification

Grantly adopts the **StockFolio Dark Precision Aesthetic** (`#090b0b`), delivering a high-confidence, institutional dashboard experience that treats educational funding with the same clarity and seriousness as modern financial software.

---

## 1. Color Palette Tokens

| Token | Hex Value | Semantic Usage |
|---|---|---|
| `--ink` | `#090b0b` | Root canvas background, deep dark atmosphere |
| `--panel` | `#101313` | Primary card surfaces, modals, and container panels |
| `--panel-hover` | `#141818` | Elevated states, input fields, and hover states |
| `--panel-elevated` | `#161c1b` | Secondary chip backgrounds, nested boxes |
| `--line` | `#222827` | Structural hairline borders (1px) |
| `--line-subtle` | `#191f1e` | Dividers, empty state dashes, progress rails |
| `--mint` | `#a9f46b` | Primary brand accent, High Match badges, CTA buttons |
| `--mint-hover` | `#bcfb8b` | Button hover glow, active highlights |
| `--mint-dim` | `#7ccb3e` | Progress bars, secondary indicators |
| `--soft` | `#89918c` | Monospace eyebrows, secondary labels, subtext |
| `--dim` | `#525c57` | Micro-details, helper hints, deactivated icons |
| `--text` | `#edf1ec` | High-contrast readable body text and headings |
| `--negative` | `#ff8e91` | Overdue deadlines, unmet criteria, delete actions |
| `--warning` | `#f7ba53` | Near-miss gaps, expiring documents, 7-day deadlines |
| `--blue` | `#70b4ff` | In-progress applications, official link pills |
| `--purple` | `#c084fc` | First-generation tags, under-review stage |

---

## 2. Typography & Micro-Copy Rules

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
     font-weight: 500;
     color: var(--soft);
   }
   ```

---

## 3. Precision Button Classes

### `.btn-mint` (Primary CTA)
```css
.btn-mint {
  background-color: var(--mint);
  color: #090b0b;
  font-weight: 700;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 14px rgba(169, 244, 107, 0.15);
}
.btn-mint:hover {
  background-color: var(--mint-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(169, 244, 107, 0.25);
}
```

### `.btn-panel` (Secondary Institutional Button)
```css
.btn-panel {
  background-color: #121614;
  border: 1px solid var(--line);
  color: var(--text);
  transition: all 0.2s ease;
}
.btn-panel:hover {
  border-color: #38423f;
  background-color: #171c1a;
  color: #ffffff;
}
```

---

## 4. Responsive Breakpoints & Container Constraints

- **Mobile (< 768px)**: `1rem` horizontal padding, single-column stacked grids, touch targets ≥ 44px.
- **Tablet (769px – 1024px)**: `1.75rem` padding, 2-column card layouts, compact toolbar.
- **Desktop (≥ 1025px)**: Max container width `1320px` centered with `2.25rem` padding, 3-column scholarship grid, 5-column Kanban pipeline.
- **Zero Horizontal Scroll**: Strict `overflow-x: hidden` on viewport with fluid `flex` and `grid` layouts.
