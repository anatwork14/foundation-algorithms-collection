# Foundation Algorithms — UI/UX Consistency Audit

Status: active implementation audit  
Scope: homepage, global shell, Archive, Algorithms, Atlas, Lab, Evidence, References, Implementations, Experiments, Claims, Passages, long-form chapter reading, light/dark mode, responsive behavior.

## Why the interface felt inconsistent

The main problem was architectural rather than a single bad component. The application had accumulated multiple generations of global visual CSS: early base styles, a design-system layer, feature styles, liquid-glass layers, typography overrides, a minimal-theme override, and a field-index override. Different routes therefore depended on cascade order instead of a single visual contract.

That produced visible inconsistencies in:

- heading scale and font roles;
- border radii and surface elevation;
- search/filter control heights;
- card/list density;
- sticky toolbar treatment;
- use of color by research field;
- tablet/mobile breakpoints;
- light/dark surfaces;
- registry pages that implemented nearly identical controls differently;
- pages with fixed-height cards despite very different content lengths.

## Canonical direction

The product should feel like a serious research instrument, not a collection of SaaS dashboards.

The canonical hierarchy is:

- **Fraunces** — editorial hierarchy only: hero, page and major section headings;
- **Source Sans 3** — UI, navigation, reading, controls, lists and normal content;
- **JetBrains Mono** — identifiers, labels, code, counters and technical metadata;
- **KaTeX fonts** — mathematical glyphs.

Visual hierarchy comes primarily from typography, spacing, alignment and separators. Research fields are taxonomy, not decoration, so their default UI treatment is neutral. Color is reserved primarily for semantic state such as experiment status.

## Canonical visual contract

`app/research-ui.css` is the only global visual/theme authority. Feature CSS may describe specialized structure, but the final typography, color, surface, spacing, control, focus and responsive language resolves through this file.

Current core values:

- neutral warm-light / neutral-dark canvas;
- 42 px standard control height;
- 68 px desktop header;
- 7–12 px interface radii;
- 760 px long-form reading width;
- 1180 px main shell;
- common responsive boundaries at 980 px, 760 px and 520 px;
- visible keyboard focus;
- reduced-motion support;
- AA-capable small metadata contrast in both themes;
- no decorative global shadows or glass blur.

No new global visual override layer should be introduced after `research-ui.css`. Route/feature styles should solve specialized structure; they must not establish a separate color, typography, surface, control, or interaction system.

## Concrete issues found and fixed

### 1. Conflicting visual systems

Removed obsolete global layers:

- `liquid-glass.css`
- `liquid-glass-research.css`
- `minimal-research.css`
- `agocode-typography.css`
- `research-index.css`
- unused duplicate `interface-consistency.css`

The root layout now loads feature/structural CSS and ends with one canonical `research-ui.css` visual layer.

### 2. Research field cards were inappropriate

The five tall rounded field cards were replaced by an editorial research index:

`number → field → description → chapter count → action`

This is denser, easier to scan and more consistent with an archive/catalogue.

A later Chromium tablet test exposed a legacy cascade regression at 820 px: the old two-column card rule still won in that band, creating 542 px-wide field items and a 1102 px document. The tablet band is now explicitly kept single-column until the dedicated phone layout takes over below 760 px. The exact regression is protected by both `check:ui` and Playwright containment tests.

### 3. Evidence summary had the wrong grid

The Evidence page rendered five summary metrics into a four-column grid, leaving an orphaned fifth metric and inconsistent borders. It now uses:

- five columns on wide screens;
- three columns on tablet;
- one column on mobile.

Evidence destination cards were also shortened and no longer use artificial 340 px minimum heights.

The Evidence root uses `.evidence-hub`; the canonical page-rhythm selectors target that real class at both desktop and mobile breakpoints so it receives the same top spacing as Archive, Algorithms, Atlas, Lab and the registry routes.

### 4. Registry controls drifted

References, Implementations and Experiments independently recreated nearly identical filter toolbars. They now share the same:

- 42 px control height;
- 8 px input radius;
- neutral toolbar surface;
- focus treatment;
- row density;
- metadata hierarchy;
- 980/760 responsive behavior.

The old Reference `backdrop-filter: blur(14px)` was removed.

### 5. Atlas / Algorithm controls retained old glass behavior

Entity controls retained blur from an earlier visual direction. Blur is now removed and Atlas filters use the same control height/radius as the rest of the product.

Atlas remains a focused relationship workspace rather than being forced into the Archive list pattern, because its task is traversal rather than browsing.

### 6. Lab controls used a separate geometry

Combination selects were 44 px while most product controls were 42 px, and known-combination panels carried field-tinted backgrounds. They now use the shared control system and neutral research surfaces.

### 7. Claims / Passages had their own design generation

Both provenance routes still used blurred sticky bars and one-off breakpoints (`720px` and `780px`). They now use the common 760 px mobile boundary and the same registry toolbar language.

### 8. Experiment status and field color were conflated

Research-field color is now neutral by default. Experiment status retains restrained semantic color because planned/running/completed/failed is actual state information.

### 9. Theme control referenced retired tokens and lived outside the header action system

The theme control previously referenced old `--glass-*` variables after the glass system was retired and was visually mounted as a floating utility outside the header.

Both issues are resolved. The control uses canonical neutral tokens, and `ThemeToggle` portals its interactive button into `.header-actions`. The root layout keeps only a nonvisual `display: contents` mount so theme initialization remains independent from the header implementation while the actual control shares the same DOM/action group, geometry, hover/focus behavior and responsive treatment as Search and GitHub.

### 10. Future drift was unguarded

Added `scripts/check-ui-consistency.mjs` and `npm run check:ui`. CI rejects reintroduction of deprecated theme files, incorrect CSS ordering, removal of canonical visual contracts, stale Evidence-root selectors, theme-control regressions, the tablet Research-fields regression, and the accessibility/contrast contracts listed below.

### 11. Acceptance hardening exposed semantic and narrow-screen gaps

The source-level acceptance pass identified issues that were not visual-theme problems but still affected usability:

- the Atlas search input relied on placeholder text rather than an explicit accessible name;
- the active Atlas entity was indicated visually but not exposed as selected to assistive technology;
- complex Atlas relationship areas were not named regions;
- the mobile menu toggle did not expose `aria-expanded` / `aria-controls`, and current navigation links lacked `aria-current`;
- Escape closed Search but not an open mobile menu;
- long KaTeX display equations had no local horizontal-overflow containment;
- the secondary muted token was too low-contrast for the small metadata text that consumes it.

These are resolved:

- Atlas search has an explicit accessible name, picker buttons expose `aria-pressed`, and relationship areas are named regions;
- mobile navigation exposes ownership and expanded state, current links expose page state, Search declares dialog-popup behavior, and Escape closes either transient header surface;
- display equations scroll inside the reading surface instead of widening the page;
- `.table-scroll` provides local horizontal scrolling for wide tables;
- `--muted-2` is `#6d7076` in light mode and `#81848a` in dark mode. Against common canvas/surface backgrounds, the worst-case ratios are approximately 4.63:1 and 4.55:1 respectively, clearing WCAG AA's 4.5:1 threshold for normal text;
- `check:ui` computes the metadata-token contrast ratio from the CSS itself and fails if a future palette change drops below 4.5:1.

### 12. Rendered browser acceptance is now a CI gate

The application now has a Playwright/Chromium acceptance suite running against the production build. It covers:

- all major product routes for desktop page-level horizontal containment;
- homepage, LinUCB chapter, LinUCB Algorithm, Atlas and Evidence in light/dark at 1440×1000, 820×1180 and 390×844;
- axe WCAG A/AA scans on representative routes in both themes;
- command-palette keyboard operation and focus restoration;
- mobile-navigation state/current-page/Escape behavior;
- long equation/table/code containment and keyboard reachability on phone.

The first full matrix deliberately found a real tablet regression in the Research-fields index. After the targeted cascade fix, all **58 functional/accessibility browser tests passed**.

A separate visual-review spec captures 12 representative full-page screenshots covering the homepage across all three widths and both themes plus representative chapter, Atlas and Evidence states. CI retains the Playwright report and screenshot attachments for 14 days so rendered changes can be inspected even when tests pass.

These screenshots are review artifacts rather than strict pixel-diff baselines. That is intentional while the visual system is still evolving.

## CI consistency contract

`npm run check:ui` currently protects all of the following:

- deprecated visual layers cannot return;
- `research-ui.css` remains the final app CSS import;
- required typography, theme, control, shell and breakpoint contracts remain present;
- the theme control remains portal-mounted into `.header-actions` while its layout mount stays nonvisual;
- the real `.evidence-hub` root remains part of shared page rhythm;
- mobile navigation keeps expanded/current-page semantics;
- Search keeps dialog-popup semantics;
- Atlas keeps explicit search, selected-entity and relationship-region semantics;
- long display equations remain locally horizontally scrollable;
- light and dark `--muted-2` tokens remain at or above 4.5:1 against the primary canvas and strong surface;
- the tablet Research-fields editorial index remains single-column rather than regressing to the legacy two-column card layout.

Playwright complements those source guards with rendered containment, responsive/theme, keyboard, axe and visual-artifact checks.

## Surface rules going forward

### Archive / Algorithms / registries

Use list/table-like rows when users are comparing many text-heavy records. Do not turn every record into a tall card.

### Atlas

Use a two-pane research workspace: picker/filter region + focused relationship content. Neighbor items may use compact bounded surfaces because they represent discrete graph relationships.

### Lab

Use structured research records. Panels are allowed where they separate compatibility, tensions, metrics or experiment planning, but the interface should remain neutral and information-dense.

### Evidence

Use compact destination surfaces at the hub level and lists for references/implementations/experiments. Evidence stage is descriptive coverage, never a quality score.

### Long-form research

Keep prose near 760 px, use generous vertical section spacing, real math rendering, locally scrollable wide tables/equations, restrained code blocks and a consistent TOC.

## Remaining manual acceptance work

The structural/design-system cleanup, source-level accessibility hardening, automated Chromium responsive/theme checks, and axe WCAG scans are implemented.

Still perform manual checks where browser automation cannot substitute for the real interaction environment:

- VoiceOver and/or NVDA announcements on command palette, Atlas and Evidence provenance surfaces;
- mathematical expression reading with assistive technology;
- physical-device touch ergonomics and OS/browser font rendering;
- zoom/text-scaling behavior on representative mobile/tablet hardware;
- aesthetic review of retained screenshots for major design changes.

These are manual acceptance checks, not invitations to add another visual-system override layer. Any future fix should preserve the canonical hierarchy and add a deterministic regression test when possible.
