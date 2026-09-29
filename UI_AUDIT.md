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
- no decorative global shadows or glass blur.

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

### 3. Evidence summary had the wrong grid

The Evidence page rendered five summary metrics into a four-column grid, leaving an orphaned fifth metric and inconsistent borders. It now uses:

- five columns on wide screens;
- three columns on tablet;
- one column on mobile.

Evidence destination cards were also shortened and no longer use artificial 340 px minimum heights.

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

### 9. Theme control referenced retired tokens

The floating theme control still referenced old `--glass-*` variables after the glass system was retired. It now uses only canonical neutral tokens.

### 10. Future drift was unguarded

Added `scripts/check-ui-consistency.mjs` and `npm run check:ui`. CI now rejects:

- reintroduction of deprecated theme files;
- importing old visual layers;
- a layout where `research-ui.css` is not the final app CSS layer;
- removal of the required font/theme/control/breakpoint contracts;
- return of retired glass tokens in the theme control.

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

Keep prose near 760 px, use generous vertical section spacing, real math rendering, horizontally scrollable tables, restrained code blocks and a consistent TOC.

## Known follow-up acceptance work

The structural/design-system cleanup is implemented, but the following should continue to be checked on actual rendered deployments whenever the environment permits full browser automation:

- desktop/tablet/phone screenshots in both themes;
- long tables at narrow widths;
- long mathematical expressions;
- keyboard-only navigation across every workspace;
- screen-reader labeling of complex relationship/evidence surfaces;
- contrast of muted text and semantic experiment-status colors;
- whether the persistent theme control should ultimately be placed inside the header action group rather than remain a floating utility.

The last item is intentionally recorded instead of hidden: the control is now visually consistent, but its placement is still a product-level decision.
