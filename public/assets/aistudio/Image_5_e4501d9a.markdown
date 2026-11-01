---
name: Warm Whimsical Student Ledger
colors:
  surface: '#fff8f5'
  surface-dim: '#ecd6ca'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ea'
  surface-container: '#ffeadf'
  surface-container-high: '#fbe4d8'
  surface-container-highest: '#f5ded2'
  on-surface: '#251912'
  on-surface-variant: '#55433e'
  inverse-surface: '#3b2e26'
  inverse-on-surface: '#ffede5'
  outline: '#88726d'
  outline-variant: '#dac1bb'
  surface-tint: '#964732'
  primary: '#883c28'
  on-primary: '#ffffff'
  primary-container: '#a6533d'
  on-primary-container: '#ffe8e2'
  inverse-primary: '#ffb4a1'
  secondary: '#755b03'
  on-secondary: '#ffffff'
  secondary-container: '#fdd97b'
  on-secondary-container: '#785d06'
  tertiary: '#4c5645'
  on-tertiary: '#ffffff'
  tertiary-container: '#646e5c'
  on-tertiary-container: '#e6f0da'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd2'
  primary-fixed-dim: '#ffb4a1'
  on-primary-fixed: '#3c0800'
  on-primary-fixed-variant: '#78301d'
  secondary-fixed: '#ffdf91'
  secondary-fixed-dim: '#e6c367'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#594400'
  tertiary-fixed: '#dce6d0'
  tertiary-fixed-dim: '#c0cab4'
  on-tertiary-fixed: '#151e10'
  on-tertiary-fixed-variant: '#404a39'
  background: '#fff8f5'
  on-background: '#251912'
  surface-variant: '#f5ded2'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  currency-display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1.25rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
  space-xxl: 3.5rem
---

## Brand & Style
This design system pairs the clarity of a modern personal finance manager with an approachable, tactile storybook warmth tailored for tertiary education students. Navigating personal finances as an undergraduate can evoke anxiety; the interface counters this through a calming "cozy desk" aesthetic, punctuated by quiet, charming feline micro-accents (subtle paw iconography, soft sleeping cat silhouette empty states, whiskered progress markers).

The overall design movement blends **Warm Minimalism** with **Gentle Tactile Elements**:
- **Generous Whitespace & Breathing Room:** Prevents financial cognitive overload by grouping daily spends into soft, bite-sized cards.
- **Warm, Earthy Palette:** Natural fibers, unbleached paper, warm terracotta, and sunlit ochre replace the standard cold fintech blues and aggressive alert reds.
- **Approachable Numeric Display:** Currency formats (specifically tailored for Malaysian Ringgit, `RM`) prioritize high legibility with friendly, rounded numerals without losing financial precision.

## Colors
The color hierarchy is anchored in earthy, unhurried warmth.

- **Primary (`#A6533D` - Brick Brown / Terracotta):** Used for focal interactive states, primary action buttons, budget alert milestones, and high-priority expense categories.
- **Secondary (`#E9C66A` - Muted Sunlit Ochre):** Used for warm badges, savings goals, celebratory milestones, streak counters, and active navigation indicators.
- **Tertiary (`#7A8471` - Soft Matcha Green):** Reserved for positive financial inflows, cash-in indicators, and surplus balances.
- **Neutral Primary (`#45372F` - Deep Espresso Brown):** High-contrast base for primary headers, numerical transaction amounts, and body text. Provides ink-on-paper warmth instead of harsh jet black.
- **Neutral Secondary (`#786E65` - Warm Muted Grey):** Applied to timestamps, recurring transaction indicators, empty labels, and currency prefixes (`RM`).
- **Canvas Base (`#F5F0E6` - Warm Oatmeal Beige):** The background canvas layer, establishing a parchment-like warmth.
- **Surface Layer (`#FFFDF8` - Milk / Off-White):** Applied to elevated spending cards, bottom navigation bars, dropdown menus, and modal dialogs.
- **Borders & Dividers (`#E8DFD1` - Light Flaxen):** Low-contrast boundaries ensuring surfaces separate gently without stark line-cuts.

## Typography
**Plus Jakarta Sans** is utilized across all typography levels. Its clean, geometric foundation features gently rounded terminal strokes that provide contemporary readability without appearing sterile or clinical.

- **Monetary Rules:** Currency signs (`RM`) are set in `label-lg` or `label-md` alongside monetary values to preserve numeric hierarchy. The prefix sits alongside the sum in `font-weight: 600`, slightly scaled down relative to the primary integer sum (e.g., `RM 14.50`).
- **Tabular Figures:** When rendering budgets, daily spend logs, or transaction ledgers, use OpenType tabular figure settings (`tnum`) to keep decimal points cleanly aligned vertically.

## Layout & Spacing
This system follows an 8pt spatial grid built around an airy, mobile-first responsive container.

- **Mobile (< 768px):** Single column fluid feed with `1.25rem` screen edge margins. All expense entries, wallet summaries, and category wheels expand full width within inner paddings.
- **Tablet (768px - 1024px):** 8-column layout with `1rem` gutters and `2rem` screen margins. Divides analytics and transaction lists into a balanced 5:3 split.
- **Desktop (> 1024px):** Max container constraint of `1120px` centered with 12 columns, `1.5rem` gutters, and `3rem` margins. The navigation operates as a docked left rail, while the main dashboard surfaces budget overviews alongside quick-entry ledger forms.

## Elevation & Depth
Elevation is achieved using ambient warm shadows paired with tonal paper layering, avoiding artificial, cold gray drop shadows.

- **Level 0 (Canvas Base):** Plain `#F5F0E6` ground.
- **Level 1 (Default Card):** `#FFFDF8` surface with a subtle perimeter border (`1px solid #E8DFD1`) and soft warm ambient shadow: `0 4px 16px -2px rgba(69, 55, 47, 0.04)`.
- **Level 2 (Interactive Floating / Hover):** Elevated ledger cards, bottom app bars, and filter sheets: `0 8px 24px -4px rgba(69, 55, 47, 0.08)`.
- **Level 3 (Modals & Popovers):** Quick expense-entry drawers, category picker dialogues: `0 16px 40px -8px rgba(69, 55, 47, 0.14)`.

## Shapes
A roundedness level of `2` provides an approachable, organic feel that echoes smooth stones or rounded cat paws without turning completely into bubbly novelty pill forms.

- Standard buttons, form fields, and ledger cards feature a base radius of `0.5rem` (8px).
- Larger containers, overview summary cards, and modal dialogs use `rounded-lg` (`1rem` / 16px) or `rounded-xl` (`1.5rem` / 24px).
- Small tags, category pills, and numeric chips adopt full circle or capsule curves to create physical contrast against structured card blocks.

## Components

### Buttons
- **Primary:** Filled with Brick Brown (`#A6533D`), text in `#FFFDF8`, 8px radius, padded with `0.75rem 1.25rem`. On hover, shifts to slightly deeper tone (`#8E4330`) with an animated scale transition of `1.01`.
- **Secondary:** Filled with Muted Ochre (`#E9C66A`), text in Deep Espresso (`#45372F`), ideal for "Add Custom Category" or "Export Month".
- **Ghost / Tertiary:** Transparent background, Espresso text, soft border (`1px solid #E8DFD1`) that transitions to warm cream on hover.

### Cards
- **Financial Summary Cards:** Milk white surface (`#FFFDF8`), 16px radius (`rounded-lg`), subtle boundary stroke, and Level 1 elevation. Internal padding standardizes to `1.25rem`.
- **Cat Accent Details:** Monthly milestone summaries feature a subtle paw watermark stamp in the lower-right corner at `6%` opacity of the neutral color.

### Form Inputs & Monetary Entry
- **Amount Input:** Extra-large numerical field (`currency-display`). The `RM` currency indicator is permanently affixed on the left in warm muted grey (`#786E65`).
- **Text & Dropdowns:** Inset background `#F5F0E6`, bordered by `#E8DFD1`. Focus ring glows with a 2px offset in `#A6533D` at 25% opacity.

### Chips & Badges
- **Category Chips (e.g., Mamak, Boba, Textbooks, Campus Transit):** Soft pill shape, height 28px, colored using a tint of Primary or Secondary with 12% opacity background, housing dark `#45372F` text and an expressive micro-emoji or cat paw icon.

### Transaction List Items
- Structured row item with `0.75rem` vertical spacing. Left side displays category circle icon; center displays merchant and timestamp in `body-md` and `body-sm`; right side displays tabulated currency (`-RM 12.00` in neutral `#45372F` or `+RM 150.00` allowance in `#7A8471`).

### Empty States & Micro-Delights
- Empty lists (e.g., zero expenses recorded for the day) display a minimalist sleeping cat line-illustration with the caption: *"Purr-fect! No expenses logged yet today."*