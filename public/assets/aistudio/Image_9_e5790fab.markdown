---
name: PinHub Modern Geo-Discovery
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#414754'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#006e2d'
  on-secondary: '#ffffff'
  secondary-container: '#7cf994'
  on-secondary-container: '#007230'
  tertiary: '#b81d17'
  on-tertiary: '#ffffff'
  tertiary-container: '#dc392c'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#7ffc97'
  secondary-fixed-dim: '#62df7d'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a9'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930004'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
  metric-counter:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
This design system balances the high-utility functional clarity of Google Maps with the airy, reduced aesthetic of Scandinavian utility software. Built for spontaneous urban exploration and multi-category venue triage within a 20 km zone, the interface prioritizes spatial legibility, low cognitive friction, and rapid visual hierarchy.

The product evokes efficiency, precision, and confidence. To keep dynamic vector maps readable beneath dense layers of points of interest (POIs), the surrounding UI leans on crisp optical surfaces, tactile floating overlays, subtle translucent blurs, and strict category color-coding. The system treats map pins not as static markers, but as vibrant, informative data anchors that pair seamlessly with swipeable discovery cards and structured sheet drawers.

## Colors
The color architecture divides strictly between structural chrome and contextual data tags. Structural chrome utilizes a restrained neutral palette to let the underlying terrain breathe, while a high-contrast category taxonomy ensures immediate differentiation among intersecting venue types.

### Structural Palette
- **Canvas Base (`#F8F9FA`):** Low-strain, neutral tint for off-map sheets and background containers.
- **Surface Elevation (`#FFFFFF`):** High-clarity white for floating search bars, bottom sheets, and interactive chips.
- **On-Surface Strong (`#1F2937`):** Slate-charcoal for immediate legibility across labels, distances, and place names.
- **On-Surface Subdued (`#6B7280`):** Muted slate for operational metadata, opening hours, and inactive icons.
- **Border / Divider (`#E5E7EB`):** Ultra-light boundary separation for cards, lists, and filter controls.

### Category Taxonomy Palette
- **Dining & Restaurants:** Coral Vermillion (`#EA4335`)
- **Cafes & Bakeries:** Amber Roast (`#D97706`)
- **Hotels & Stays:** Rose Magenta (`#E91E63`)
- **Shopping & Markets:** Clear Cerulean (`#0284C7`)
- **Nature & Outdoor:** Leaf Green (`#16A34A`)
- **Culture & Worship (Temples/Mosques/Churches):** Royal Violet (`#7C3AED`)

Category colors must never be used for generic actions; their use is restricted to category pin markers, active pill-chip badges, and venue type labels.

## Typography
Plus Jakarta Sans provides geometric legibility that harmonizes with modern Thai script metrics (e.g., Sukhumvit Set, Noto Sans Thai). The baseline and cap heights allow seamless bilingual rendering without vertical clipping or awkward badge misalignment.

- **Headlines:** Reserved for destination names, sheet headers, and collection titles. Kept tight to prevent awkward wrapping over narrow map panes.
- **Labels & Counters:** High-weight, slightly compact forms specifically tuned for category chips, numeric result tallies, and inline metric distances (e.g., "1.2 km", "450 m").
- **Body:** Neutral line height and relaxed tracking to guarantee rapid readability during transit or outdoor viewing under bright sunlight.

## Layout & Spacing
The layout architecture centers around a full-bleed vector map canvas paired with non-blocking floating controls and a multi-height bottom sheet. 

- **Layout Structure:** On mobile devices, views rely on safe-area bounds with an interactive bottom sheet dockable at 3 breakpoints (Collapsed: 80px preview bar; Mid: 45% screen height list; Expanded: 92% screen height full browse).
- **Floating Controls (FABs & Sliders):** Anchored with a default margin of `16px` (`margin-mobile`) from screen borders, pinned above the collapsed sheet boundary.
- **Grid & Gutters:** Tablet and split-screen landscape views use an 8-column system with `16px` gutters. Desktop mapping interfaces apply a 12-column system, docking the discovery list in a fixed 420px left rail while dedicating remaining columns to the fluid map.

## Elevation & Depth
Depth hierarchy maintains separation between map tiles, floating toolbars, and dynamic discovery panels without heavy visual clutter.

- **Level 0 (Map Baseline):** The flat cartographic canvas.
- **Level 1 (Subtle Containers):** Internal table cells, divider lines, and inactive state containers (`background: #FFFFFF; border: 1px solid #E5E7EB`).
- **Level 2 (Floating Chips & Map Pins):** Active filter pills, pin markers, and cluster bubbles (`box-shadow: 0 2px 6px -1px rgba(31, 41, 55, 0.12), 0 1px 4px -1px rgba(31, 41, 55, 0.06)`).
- **Level 3 (Interactive Floating Dock & FABs):** Search input bars, 20 km radius selectors, and location recalibration buttons (`box-shadow: 0 4px 12px -2px rgba(31, 41, 55, 0.14), 0 2px 6px -1px rgba(31, 41, 55, 0.08)`).
- **Level 4 (Modal Sheets & Venue Flyouts):** Primary bottom sheets and focused venue spotlight cards (`box-shadow: 0 12px 28px -4px rgba(31, 41, 55, 0.20), 0 4px 10px -2px rgba(31, 41, 55, 0.10)`).
- **Backdrop Frosting:** Overlapping modal overlays and collapsed sheet handles utilize `backdrop-filter: blur(12px)` with an 85% alpha-white fill to preserve context underneath.

## Shapes
A roundedness level of 3 (Pill-shaped) reinforces the tactile, friendly Scandinavian utility theme. 

- **Filters and Badges:** Strict pill curvature (`border-radius: 9999px`) provides a clean visual boundary that separates actionable items from map icons.
- **Cards and Bottom Sheets:** Main containers, location cards, and modal bottom sheets utilize `rounded-xl` (1.5rem / 24px) on their free corners, softening device edges while avoiding screen interference.
- **Map Pins:** Shaped as rounded teardrops or circular badges with a bottom-centered 4px anchor tail pointing precisely to geocoordinates.

## Components

### Multi-Select Pill Chips
- **Inactive State:** Solid white background, 1px border (`#E5E7EB`), text (`#1F2937`), and a light gray counter pill.
- **Active State:** Tinted category background (12% opacity of category color), solid 1.5px border of the category color, category-colored text, and an opaque counter badge showing active venues in range.
- **Layout:** Horizontal scroll container with hidden scrollbars and `8px` spacing (`space-sm`) between chips.

### Category Map Pins
- High-contrast circular heads (36px default, 44px on focus) with an embedded category icon (Fork, Coffee Cup, Bed, Shopping Bag, Tree, Temple/Star).
- Pin background uses the full-saturation category color with a solid 2px white border for contrast against diverse satellite and street map backgrounds.
- Selected pins expand to show an attached callout bubble with name, rating, and distance.

### Floating Radius Selector (20 km)
- Compact pill docked at the top-right or center-top of the screen.
- Features a slider or stepp-wheel popover allowing quick adjustment between 1 km, 5 km, 10 km, and 20 km.
- Displays an active radial perimeter highlight on the map canvas with an animated dashed boundary.

### Interactive Bottom Sheet Drawer
- Rounded top corners (`24px`), persistent grab handle (36px wide by 4px high, `#D1D5DB`).
- Header area houses total search result count, sorting trigger (Distance vs Rating), and clear-all filters link.
- Body supports virtualized scrolling for venue items.

### Place Discovery Cards
- Horizontal card (mobile map overlay) or full-width row (within bottom sheet).
- Left: 72x72px rounded thumbnail (`12px` corner radius).
- Right: Place title, dynamic category badge with matching category color, distance counter (e.g., "750 m away"), Google review rating with star icon, and operating status ("Open until 22:00").

### Form Controls (Checkboxes & Radios)
- Checkboxes appear in nested multi-filters with a 4px corner radius, filling with `#1A73E8` when selected.
- Radio buttons feature a 2px offset inner dot.