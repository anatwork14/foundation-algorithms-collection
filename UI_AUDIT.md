# Foundation Algorithms — UI/UX Consistency Audit

**Status:** canonical UI implemented; automated browser acceptance green  
**Last reviewed:** 2026-10-01  
**Validated code head:** `64e518e8b05a4f2d7ff5800f42d05f62def13dc6`  
**GitHub Actions run:** `36808420678` — 132/132 Playwright acceptance tests passed

This document is the visual and interaction contract for the research hub. It exists to prevent the interface from drifting back into multiple competing design systems.

---

## Product character

Foundation Algorithms should feel like a **serious research publication and working research instrument**, not a colorful SaaS dashboard.

The hierarchy should come primarily from:

1. typography;
2. whitespace and rhythm;
3. alignment;
4. separators;
5. information density;
6. interaction state.

Color, elevation, glass effects, gradients, and decorative cards are not the primary hierarchy tools.

---

## Canonical typography

The entire product uses one three-role type system:

- **Fraunces** — editorial hierarchy only: hero titles, page titles, and major section headings;
- **Source Sans 3** — navigation, controls, lists, prose, labels that are meant to be read, and general UI;
- **JetBrains Mono** — code, identifiers, counters, technical labels, provenance metadata, and keyboard hints;
- **KaTeX fonts** — mathematical notation.

Do not reintroduce generic serif/sans stacks as first-choice fonts on individual routes. Route CSS may specialize size/spacing but not invent a fourth typography role.

---

## Canonical visual system

`app/research-ui.css` is the single global visual/theme authority. Feature styles may define specialized layout and structure, but the final color, typography, surface, control, focus, and interaction language resolves through the canonical tokens.

Core principles:

- neutral warm-light canvas;
- neutral dark canvas;
- explicit persisted light/dark mode;
- research-field identity is neutral by default;
- semantic color is reserved for actual status/state;
- 42px standard control geometry;
- restrained 7–12px interface radii where bounded surfaces are justified;
- 760px long-form reading width;
- 1180px main shell;
- common 980px / 760px / 520px responsive boundaries;
- visible `:focus-visible` treatment;
- reduced-motion support;
- small metadata contrast protected at WCAG AA levels;
- no decorative global glass, glow, gradient, or shadow system.

Deprecated global visual layers must not return. CI guards this contract through `npm run check:ui`.

---

## Surface grammar

Different research tasks can have different structures, but every surface must use the same visual grammar.

### Home

The homepage is an editorial gateway:

- Research fields use one aligned index rather than five oversized cards.
- Archive preview uses text-first rows.
- Combination Lab preview uses a restrained two-column editorial index rather than a six-card wall.
- Search is prominent without turning the page into a marketing hero.

### Archive and Algorithms

Use list/table-like rows for text-heavy comparison:

- thin separators;
- aligned metadata;
- subtle hover state;
- no boxed card wall;
- filters/search use the shared control system.

### Evidence

Evidence previously read like a dashboard. The accepted layout now uses:

- a compact coverage strip;
- six Evidence destinations as full-width editorial index rows;
- one seven-step Evidence-discipline sequence as index rows;
- no rounded dashboard-card grid for these navigation concepts.

The destination row hierarchy is:

`icon → evidence type/title → description → coverage metadata → action`

### Atlas

Atlas is a workspace, so compact bounded nodes are allowed when they represent discrete graph relationships. It should remain:

- picker/filter pane;
- focused Algorithm content;
- evidence neighbors;
- named relationship regions;
- accessible textual relationship table.

Do not force Atlas into the Archive row pattern simply for visual sameness.

### Lab

Lab may use bounded panels where a panel represents a real research object or analysis unit, such as:

- pair compatibility;
- assumption tensions;
- expected benefits/risks;
- experiment planning;
- known records.

The homepage Lab preview, however, remains editorial/list-like because it is navigation rather than analysis.

### Registries

References, Implementations, Experiments, Claims, Passages, and Replications use the same control and list language where their task is browsing many records.

### Long-form chapters

- prose stays near 760px;
- section spacing is generous;
- KaTeX renders real math;
- code is restrained;
- wide tables/equations/code scroll locally rather than widening the page;
- the TOC remains consistent and active-section aware.

---

## Accessibility and interaction contract

Implemented and browser-guarded:

- skip-to-main-content path;
- visible keyboard focus;
- modal focus trapping and focus restoration;
- mobile navigation `aria-expanded`, `aria-controls`, current-page semantics, and Escape handling;
- Search dialog semantics and polite live result announcements;
- native Tab order preserved in command search;
- ArrowUp / ArrowDown / Home / End accelerate command-palette result traversal;
- no positive tabindex ordering;
- one coherent `main` landmark and H1 entry point on representative routes;
- explicit regions have accessible names;
- Atlas selection and relationship regions expose usable semantics;
- overflowing technical content becomes keyboard reachable only when needed and receives a visible focus indicator;
- KaTeX output is checked for MathML and a non-empty TeX annotation while visual HTML remains hidden from assistive technology;
- reduced-motion preference suppresses meaningful animations/transitions.

Automated checks do **not** replace manual VoiceOver/NVDA evaluation. In particular, MathML presence does not prove that a real screen reader will pronounce every expression usefully.

---

## Automated acceptance state

Validated on commit:

`64e518e8b05a4f2d7ff5800f42d05f62def13dc6`

GitHub Actions run:

`36808420678`

The acceptance run completed with **132/132 Playwright tests passing**.

Coverage includes:

- production route rendering;
- light/dark themes;
- desktop, tablet, phone, and narrow viewports;
- page-level horizontal containment;
- 200% text-only reflow;
- phone minimum interactive target checks;
- Axe WCAG A/AA scans in both themes;
- keyboard Search/navigation/workspace flows;
- skip-link behavior;
- Atlas/Lab/Evidence focus visibility;
- Evidence editorial-index regression checks;
- KaTeX/MathML structure;
- technical-overflow focus visibility;
- reduced-motion behavior;
- retained visual screenshots for representative pages.

Fresh rendered screenshots were manually reviewed after the Evidence and homepage Combination Lab flattening. The current visual direction is accepted at the source/browser-artifact level.

---

## Current production/deployment state

The dedicated Vercel project and public production alias already exist:

`https://foundation-algorithms-collection.vercel.app`

The exact current UI head has a green GitHub production build, route smoke test, and browser acceptance suite. Vercel rejected deployment of that exact commit because the account hit a **build-rate limit** (`upgradeToPro=build-rate-limit`). This is an external account-capacity condition, not an application build failure.

Until the rate limit clears, the public alias continues serving the most recent successful Vercel production deployment.

---

## Manual acceptance still required

These remain intentionally open:

- VoiceOver walkthrough on representative routes;
- NVDA walkthrough on representative routes;
- real screen-reader review of mathematical pronunciation and verbosity;
- physical phone/tablet touch ergonomics;
- browser chrome and OS font-rendering review;
- physical-device pinch zoom and browser-level text scaling;
- favicon-scale review in real browser/device chrome.

These are manual/device acceptance gates, not reasons to create a new visual system.

---

## Maintenance rules

1. Do not add another global visual override layer after `research-ui.css`.
2. Prefer editorial rows/lists for text-heavy navigation and comparison.
3. Use bounded cards/panels only when the boundary represents a genuine discrete object or workspace concept.
4. Do not use field color decoratively; reserve stronger color for semantic state.
5. Preserve the Fraunces / Source Sans 3 / JetBrains Mono role separation.
6. Keep technical overflow local rather than allowing document-level horizontal scrolling.
7. Add browser regression checks when fixing a reproducible visual/accessibility bug.
8. Do not equate Axe/DOM semantics with completed VoiceOver/NVDA acceptance.
9. Review retained screenshots after significant layout changes before declaring visual acceptance.
10. Update this audit and `PROGRESS.md` whenever the accepted UI contract or a meaningful blocker changes.
