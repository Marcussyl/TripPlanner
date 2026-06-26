---
name: Modern Explorer
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#5b4138'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8f7066'
  outline-variant: '#e3bfb3'
  surface-tint: '#ab3600'
  primary: '#ab3600'
  on-primary: '#ffffff'
  primary-container: '#ff5f1f'
  on-primary-container: '#561700'
  inverse-primary: '#ffb59c'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#5c5f61'
  on-tertiary: '#ffffff'
  tertiary-container: '#919496'
  on-tertiary-container: '#292d2f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832700'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system is built for the adventurous yet organized traveler. It balances high-energy "Action Orange" with a grounded, map-inspired canvas to create a "Modern Explorer" aesthetic. The interface is optimized for clarity and rapid decision-making during collaborative trip planning.

The style is **Modern / High-Contrast**, leaning into crisp lines, generous whitespace, and purposeful pops of color. It utilizes high-contrast typography to ensure legibility against map overlays or photography. Subtle depth is used to separate collaborative layers, while heavy roundedness keeps the experience feeling approachable and optimistic.

## Colors
The palette is rooted in the utility of modern cartography.

*   **Primary (Action Orange):** Used exclusively for interactive elements, call-to-actions, and "live" collaborative moments.
*   **Secondary (Deep Slate/Charcoal):** Provides the structural weight for headers, icons, and primary text.
*   **Background (Map Tint):** A base of `Off-White (#FDFDFD)` and `Light Slate (#F8FAFC)` mimics the clean aesthetic of digital maps, reducing eye strain during long planning sessions.
*   **Collaboration Tones:** A secondary set of vibrant, high-contrast swatches (Cyan, Violet, Lime) is reserved solely for user presence cursors and avatars to ensure distinct visibility.

## Typography
This design system utilizes **Inter** across all levels to maintain a systematic, utilitarian feel. 

Headlines use heavy weights (Bold/ExtraBold) with slight negative letter-spacing to create a "headline-ready" editorial look. Body text prioritizes readability with standard tracking and a slightly generous line height. Labels are occasionally transformed to uppercase to distinguish metadata from content.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed maximum widths for content readability. 

*   **Desktop:** 12-column grid, 24px gutters, 48px side margins.
*   **Tablet:** 8-column grid, 16px gutters, 32px side margins.
*   **Mobile:** 4-column grid, 16px gutters, 16px side margins.

Spacing follows a 4px baseline, with standard increments (8, 16, 24, 40, 64) used to create clear groupings of information. Large containers like itinerary cards use `lg` padding, while smaller UI controls use `sm`.

## Elevation & Depth
Depth is used functionally to indicate hierarchy in a multi-user environment.

*   **Level 0 (Flat):** Background canvas and inactive map areas.
*   **Level 1 (Soft Border):** Sidebars and persistent navigation, using a 1px `Slate-200` border rather than a shadow.
*   **Level 2 (Floating):** Itinerary cards and trip modules. These use a subtle, highly diffused shadow (0px 4px 20px, 5% opacity charcoal) to appear lifted from the map.
*   **Level 3 (Interactive):** Active presence indicators, tooltips, and dropdowns. These use a crisp shadow with higher contrast (0px 8px 24px, 12% opacity charcoal) to sit atop all other collaborative elements.

## Shapes
The shape language is consistently **Rounded**. 

The base radius of 8px (`0.5rem`) applies to standard buttons and input fields. Larger containers, such as destination cards and modals, use `rounded-xl` (24px/1.5rem) to create a soft, modern container look that feels premium and friendly. Collaboration avatars are strictly circular.

## Components

### Buttons & Inputs
*   **Primary Button:** Action Orange background, white text, 8px corner radius. High-contrast hover state (darkened orange).
*   **Secondary Button:** Deep Charcoal outline (2px), charcoal text, transparent background.
*   **Input Fields:** Off-white background with a 1px slate border. Focus state uses a 2px Action Orange ring.

### Collaboration & Presence
*   **Presence Cursors:** Thin 2px lines in user-specific colors with a name tag floating above.
*   **Avatars:** Circular, 32px or 40px, with a 2px white "halo" and a 2px outer ring matching the user's assigned presence color.
*   **Live Indicators:** Small pulsing dots in Action Orange for "currently editing" states.

### Cards & Navigation
*   **Itinerary Cards:** Large 24px corner radius, white background, level 2 shadow. Includes a thick 4px left-border accent for the "active" day.
*   **Chips:** Pill-shaped, light slate background, bold charcoal text for tags (e.g., "Flight," "Dinner," "Hiking").
*   **Navigation Bar:** Top-aligned, frosted glass effect (backdrop-blur: 10px) with a subtle bottom border to allow map imagery to bleed through slightly.