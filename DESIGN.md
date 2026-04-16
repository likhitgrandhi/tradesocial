# Design System — Groww Balance \| INR

> Extracted from: `https://groww.in/user/balance/inr`

---

## 1. Visual Theme & Atmosphere

Groww Balance \| INR is a light-mode interface built on **GrowwSans / Soehne** typography. The canvas is light (`#FFFFFF`), with pill-shaped interactive elements and flat surfaces with no elevation. Typography uses 3 weights (435, 535, 400) to create hierarchy. The spacing system is rich with 12 defined steps.

The accent color (`#04AD83`) drives interactive elements — buttons, links, and focus states — creating a consistent action signal throughout the interface.

**Key Characteristics:**
- Light canvas (`#FFFFFF`) — the primary background surface
- Primary text `#44475B`, secondary `#000000`
- Accent / action color: `#04AD83`
- Border: `#E9E9EB`
- Font: `GrowwSans` + `Soehne`
- Weight system: 3 weights (435, 535, 400)
- Shape: pill-shaped elements
- Depth: flat / no elevation
- Spacing: rich (12 steps, base 4px)
- 8 component type(s) detected

**Design Tokens**

| Token | Value |
|-------|-------|
| `color.surface.base` | `#FFFFFF` |
| `color.surface.raised` | `#F8F8F8` |
| `color.text.primary` | `#44475B` |
| `color.text.secondary` | `#000000` |
| `color.action.primary` | `#04AD83` |
| `color.border.default` | `#E9E9EB` |
| `color.surface.muted` | `#DFE0EF` |
| `radius.xs` | `0px` |
| `radius.sm` | `2px` |
| `radius.md` | `3px` |
| `radius.lg` | `8px` |
| `radius.xl` | `10px` |
| `radius.2xl` | `16px` |
| `font.size.xs` | `14px` |
| `font.size.sm` | `16px` |
| `font.size.md` | `20px` |
| `space.1` | `4px` |
| `space.2` | `8px` |
| `space.3` | `9px` |
| `space.4` | `10px` |
| `space.5` | `12px` |
| `space.6` | `15px` |
| `space.7` | `16px` |
| `space.8` | `20px` |

## 2. Color Palette & Roles

### Primary & Background

- **Canvas** (`#FFFFFF`): Page background / canvas
- **Surface** (`#F8F8F8`): Card / surface background
- **Overlay** (`#DFE0EF`): Overlay / muted surface
- **Muted Surface** (`#E9FAF3`): Overlay / muted surface
- **Sunken** (`#121212`): Overlay / muted surface
- **Backgrounds 6** (`#ED5533`): Overlay / muted surface

### Text

- **Primary Text** (`#44475B`): Headings and primary body text
- **Secondary Text** (`#000000`): Secondary / supporting text
- **Muted Text** (`#7C7E8C`): Muted / disabled text
- **Disabled Text** (`#A1A3AD`): Muted / disabled text
- **Inverse Text** (`#04B488`): Muted / disabled text
- **Text 6** (`#5367FF`): Muted / disabled text

### Interactive & Accent

- **Accent** (`#04AD83`): Primary CTA, links, focus rings
- **Primary Action** (`#44475B`): Secondary actions
- **Secondary Action** (`#04B488`): Hover / active state

### Borders & Dividers

- **Border Default** (`#E9E9EB`): Default border on cards and inputs

### CSS Color Tokens

| Token | Value |
|-------|-------|
| `--dangerouslySetPrimaryBg` | `#fff` |
| `--background-commodities-gh1` | `#e0f8ee` |
| `--background-commodities-gh2` | `#cdf3e3` |
| `--background-commodities-gh3` | `#b7ecd6` |
| `--background-commodities-gh4` | `#9ce2c6` |
| `--background-commodities-gh5` | `#75d3b0` |
| `--background-commodities-gh6` | `#24bf92` |
| `--border-commodities-gh1` | `#e0f8ee` |
| `--border-commodities-gh2` | `#cdf3e3` |
| `--border-commodities-gh3` | `#b7ecd6` |
| `--border-commodities-gh4` | `#9ce2c6` |
| `--border-commodities-gh5` | `#75d3b0` |
| `--border-commodities-gh6` | `#24bf92` |
| `--background-primary` | `var(--white)` |
| `--background-secondary` | `var(--gray50)` |
| `--background-tertiary` | `var(--gray100)` |
| `--background-transparent` | `var(--overlay00)` |
| `--background-surface-primary` | `var(--white)` |
| `--background-surface-secondary` | `var(--gray50)` |
| `--background-inverse-primary` | `var(--gray900)` |
| `--background-overlay-primary` | `var(--overlay70)` |
| `--background-overlay-secondary` | `var(--overlay30)` |
| `--background-always-dark` | `var(--black)` |
| `--background-always-light` | `var(--white)` |
| `--background-accent` | `var(--green9)` |
| `--background-positive` | `var(--green9)` |
| `--background-negative` | `var(--red9)` |
| `--background-warning` | `var(--yellow500)` |
| `--background-accent-subtle` | `var(--green2)` |
| `--background-positive-subtle` | `var(--green2)` |
| `--background-negative-subtle` | `var(--red100)` |
| `--background-warning-subtle` | `var(--yellow100)` |
| `--background-accent-secondary` | `var(--purple500)` |
| `--background-accent-secondary-subtle` | `var(--purple100)` |
| `--background-on-warning-subtle` | `var(--yellow11)` |
| `--background-disabled` | `var(--neutral2)` |
| `--background-surface-z1` | `var(--neutral1)` |
| `--background-surface-z2` | `var(--neutral1)` |
| `--background-surface-docked` | `var(--neutral1)` |
| `--background-secondary-on-surface-z1` | `var(--neutral2)` |
| `--background-tertiary-on-surface-z1` | `var(--neutral3)` |
| `--background-accent-subtle-on-surface-z1` | `var(--green2)` |
| `--background-secondary-subtle-on-surface-z1` | `var(--blue2)` |
| `--background-positive-subtle-on-surface-z1` | `var(--green2)` |
| `--background-negative-subtle-on-surface-z1` | `var(--red2)` |
| `--background-warning-subtle-on-surface-z1` | `var(--yellow2)` |
| `--background-disabled-on-surface-z1` | `var(--neutral2)` |
| `--background-secondary-on-surface-z2` | `var(--neutral2)` |
| `--background-tertiary-on-surface-z2` | `var(--neutral3)` |
| `--background-accent-subtle-on-surface-z2` | `var(--green2)` |
| `--background-secondary-subtle-on-surface-z2` | `var(--blue2)` |
| `--background-positive-subtle-on-surface-z2` | `var(--green2)` |
| `--background-negative-subtle-on-surface-z2` | `var(--red2)` |
| `--background-warning-subtle-on-surface-z2` | `var(--yellow2)` |
| `--background-disabled-on-surface-z2` | `var(--neutral2)` |
| `--border-primary` | `var(--gray150)` |
| `--border-disabled` | `var(--gray100)` |
| `--border-accent` | `var(--green9)` |
| `--border-positive` | `var(--green9)` |
| `--border-negative` | `var(--red9)` |
| `--border-neutral` | `var(--gray900)` |
| `--border-primary-on-surface-z1` | `var(--neutral4)` |
| `--border-disabled-on-surface-z1` | `var(--neutral3)` |
| `--border-primary-on-surface-z2` | `var(--neutral4)` |
| `--border-disabled-on-surface-z2` | `var(--neutral3)` |
| `--content-primary` | `var(--gray900)` |
| `--content-secondary` | `var(--gray700)` |
| `--content-inverse-primary` | `var(--white)` |
| `--content-inverse-secondary` | `var(--gray300)` |
| `--content-accent` | `var(--green9)` |
| `--content-warning` | `var(--yellow500)` |
| `--content-accent-secondary` | `var(--purple500)` |
| `--content-accent-secondary-subtle` | `var(--purple300)` |
| `--content-on-warning-subtle` | `var(--yellow11)` |
| `--content-on-accent-subtle` | `var(--green11)` |
| `--content-on-accent-secondary-subtle` | `var(--blue11)` |
| `--accent-hover` | `#04ad83` |
| `--accent-subtle-hover` | `#e0f8ee` |
| `--accent-selected` | `#04ad83` |
| `--accent-subtle-selected` | `#ddf5ee` |

## 3. Typography Rules

### Font Families

| Role | Family | Fallback |
|------|--------|----------|
| Primary | `GrowwSans` | system-ui, sans-serif |
| Secondary / Monospace | `Soehne` | system-ui, sans-serif |

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Body | `GrowwSans` | 16px (1.00rem) | 435 | normal | normal | — |
| Label / Caption | `GrowwSans` | 14px (0.88rem) | 535 | 20px | normal | — |
| Heading | `Soehne` | 20px (1.25rem) | 535 | 32px | normal | — |
| Body | `GrowwSans` | 14px (0.88rem) | 400 | 20px | normal | — |

### Principles

- **Multi-weight system**: 3 weights (`435`, `535`, `400`) create a rich typographic hierarchy.
- **Open line-heights**: Generous line-heights favour readability over density.

### Font Tokens

| Token | Value |
|-------|-------|
| `--font-size-10` | `0.625rem` |
| `--font-size-12` | `0.75rem` |
| `--font-size-14` | `0.875rem` |
| `--font-size-16` | `1rem` |
| `--font-size-18` | `1.125rem` |
| `--font-size-20` | `1.25rem` |
| `--font-size-22` | `1.375rem` |
| `--font-size-24` | `1.5rem` |
| `--font-size-28` | `1.75rem` |
| `--font-size-32` | `2rem` |
| `--font-size-40` | `2.5rem` |
| `--font-size-44` | `2.75rem` |
| `--font-size-56` | `3.5rem` |
| `--font-weight-regular` | `435` |
| `--font-weight-medium` | `535` |
| `--font-weight-bold` | `660` |

## 4. Component Stylings

> Populated automatically from page scan. **Create DS** fills missing values with exact computed styles.

| Component | Variant / Notes | Background Color | Text Color | Text Size | Label Size | Padding | Margin | Shadow | Border Color | Border Stroke | Border Radius | Icon Color | Icon Size | Size | Other |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Button** | Primary | #04AD83 | #FFFFFF | 14px | — | 12px 16px | — | — | #000000 | 1px | 8px | #FFFFFF | — | 40px | 535 |
| **Button** | Secondary | #44475B | #44475B | — | — | 12px 12px | — | — | #E9E9EB | 1px | 8px | #44475B | — | 32px | — |
| **Button** | Destructive | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Aspect Ratio** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Navigation Menu** | Top Bar | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | 64px | — |
| **Input** | Text Field | #FFFFFF | #44475B | 16px | — | 4px 16px | — | — | #E9E9EB | 1px | 8px | — | — | 40px | — |
| **Avatar** | — | #FFFFFF | — | — | — | — | — | — | #000000 | — | 50% | — | — | 32px | — |
| **Badge** | — | #F8F8F8 | #44475B | 16px | — | — | — | — | — | — | — | #44475B | — | — | 435 |
| **Links** | — | — | #04B488 | — | — | — | — | — | — | — | — | #04B488 | — | — | — |
| **Checkbox** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Context Menu** | — | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | — | — |
| **Button Group** | — | #44475B | #44475B | — | — | 12px 12px | — | — | #E9E9EB | 1px | 8px | — | — | — | — |
| **Calendar** | — | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | — | — |
| **Card** | — | #F8F8F8 | #44475B | — | — | 16px 16px | — | — | #E9E9EB | 1px | 16px | — | — | — | — |
| **Accordion** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Alert** | — | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | — | — |
| **Alert Dialog** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Command** | — | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | — | — |
| **Table** | Header | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Table** | Cell | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Dialog** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Drawer** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Hover Card** | — | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | — | — |
| **Menu Bar** | — | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | 64px | — |
| **Pop-over** | — | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | — | — |
| **Radio Button** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Sidebar** | Default | #FFFFFF | #44475B | — | — | — | — | — | — | — | — | — | — | 384px | — |
| **Sidebar** | Active Item | #FFFFFF | #04B488 | — | — | — | — | — | — | — | — | — | — | — | 500 |
| **Toast** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Switch** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Tabs** | List | #FFFFFF | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Tabs** | Active Tab | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| **Text Area** | — | #FFFFFF | #44475B | 16px | — | 4px 16px | — | — | #E9E9EB | 1px | 8px | — | — | — | — |
| **Tooltip** | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |


**Required States** — every interactive component in the table above must implement:
`default` · `hover` · `focus-visible` · `active` · `disabled` · `loading` · `error`

> **Keyboard**: all interactive components must be fully operable via keyboard. **Touch**: minimum 44px tap target, minimum 8px gap between tappable elements.

## 5. Layout Principles

### Spacing System

- Base unit: **4px**
- Scale: 4px, 8px, 9px, 10px, 12px, 15px, 16px, 20px, 24px, 30px, 32px, 37px

### Grid & Container

| Property | Value |
|----------|-------|
| Container max-width | `1280px` |
| Container padding | `32px` |
| Flex containers | `25` |

### Whitespace Philosophy

The light canvas provides breathing room between content blocks. The rich spacing scale (12 steps) supports precise, intentional rhythm throughout the layout.

### Border Radius Scale

- **0px** (`0px`): Sharp / rectangular — badge
- **2px** (`2px`): Slightly rounded — XS
- **3px** (`3px`): Slightly rounded — SM
- **8px** (`8px`): Standard cards — MD
- **10px** (`10px`): Standard cards — LG
- **16px** (`16px`): Feature cards / panels — card
- **50px** (`50%`): Pill / fully rounded — Full / Pill


## 6. Depth & Elevation

**Flat design** — no shadows detected.

> Depth is communicated through color contrast and spacing alone. Don't introduce drop shadows — the flat surface is intentional.

## 7. Do's and Don'ts

### Must (non-negotiable)

- **Must**: Use `GrowwSans` as the primary typeface
- **Must**: Use `#FFFFFF` as the page canvas background
- **Must**: Stay within the extracted color palette
- **Must**: Every interactive component must define all 7 states (default, hover, focus-visible, active, disabled, loading, error)
- **Must**: All text must meet WCAG 2.2 AA contrast — 4.5:1 for body text, 3:1 for large text (≥18px regular or ≥14px bold)
- **Must**: Focus indicators must be visible (`focus-visible`) on every interactive element

### Should (strong recommendation)

- **Should**: Snap all spacing to the 4px base unit
- **Should**: Use the defined radius scale (`0px` – `50%`) for all elements
- **Should**: Use colour contrast for depth — the design is intentionally flat
- **Should**: Reference the component CSS recipes above for new UI

### Don't

- Introduce fonts outside `GrowwSans / Soehne`
- Swap the canvas for a different background tone
- Introduce off-palette colors
- Use arbitrary spacing values outside the defined scale
- Mix arbitrary border-radius values not in the scale
- Add shadows — they conflict with the flat surface philosophy
- Deviate from defined component padding, radius, or border without reason

## 8. Accessibility

- **Target**: WCAG 2.2 AA minimum
- **Contrast**: Body text must meet 4.5:1; large text (≥18px) must meet 3:1
- **Detected contrast**: `#44475B` on `#FFFFFF` = **9.1:1** (✓ passes AA)
- **Keyboard**: Tab order must follow visual reading order; no keyboard traps
- **Focus**: `focus-visible` ring required on all interactive elements; do not suppress with `outline: none` without a custom replacement
- **Semantics**: Use native HTML elements (`<button>`, `<input>`, `<nav>`) before adding ARIA roles
- **Motion**: Respect `prefers-reduced-motion` — disable or reduce transitions for users who opt out
- **Touch**: Minimum 44×44px tap targets; minimum 8px gap between adjacent targets

## 9. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | < 400px | Single column, tight padding |
| Mobile | 401px – 480px | Standard mobile, stacked layout |
| Mobile | 481px – 600px | Standard mobile, stacked layout |
| Mobile | 601px – 601px | Standard mobile, stacked layout |
| Mobile | 602px – 767px | Standard mobile, stacked layout |
| Tablet | 768px – 768px | 2-column grids, condensed nav |
| Tablet | 769px – 800px | 2-column grids, condensed nav |
| Tablet | 801px – 996px | 2-column grids, condensed nav |
| Desktop S | 997px – 1025px | Full layout, expanded sections |
| Desktop S | 1026px – 1200px | Full layout, expanded sections |
| Desktop S | 1201px – 1240px | Full layout, expanded sections |
| Wide | 1241px – 1800px | Full layout, expanded sections |

### Touch Targets

- Buttons: `12px 16px` padding — verify minimum 44px tap area on mobile
- Interactive elements: use generous padding to ease mobile tapping
- Avoid placing tappable elements closer than 8px apart

### Collapsing Strategy

- Navigation: horizontal → hamburger / collapsed at mobile breakpoint
- Multi-column layouts: collapse to single column on mobile
- Cards: maintain border-radius and padding ratios across breakpoints
- Full-width sections: preserve full-width but compress vertical padding

## 10. Agent Prompt Guide

### Quick Color Reference

- Background: `#FFFFFF`
- Surface: `#F8F8F8`
- Text: `#44475B`
- Secondary text: `#000000`
- Accent / CTA: `#04AD83`
- Secondary action: `#44475B`
- Border: `#E9E9EB`
- Font: `GrowwSans`
- Spacing base: `4px`
- Radius (sm): `0px`
- Radius (lg): `50%`

### Example Component Prompts

- "Create a button: background `#04AD83`, color `#FFFFFF`, font-size `14px` weight `535` `GrowwSans`, padding `12px 16px`, border-radius `8px`, border `1px solid #000000`."
- "Create a card: background `#F8F8F8`, border-radius `16px`, border `1px solid #E9E9EB`, padding `8px`, font `GrowwSans`, color `#44475B`."
- "Create an input: background `#FFFFFF`, color `#44475B`, font-size `16px` `GrowwSans`, border `1px solid #E9E9EB`, border-radius `8px`, padding `4px 16px`."
- "Create a heading: font-family `GrowwSans`, font-size `16px`, font-weight `435`, line-height `normal`, color `#44475B`."

### Iteration Guide

1. **Canvas first** — set background to `#FFFFFF` before anything else
2. **Typography** — apply font-family `GrowwSans`, then set sizes and weights from the type scale
3. **Color** — use the palette above; accent `#04AD83` for actions, `#44475B` for text
4. **Spacing** — snap all padding/margin/gap to the 4px base unit
5. **Radius** — use `0px` for small elements (inputs, badges), `50%` for cards and panels
6. **Elevation** — keep surfaces flat; use colour contrast for depth
7. **Components** — reference the CSS recipes in Section 4 for exact sizing and tokens

