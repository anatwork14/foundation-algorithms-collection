# UI/UX Research — Minimal Research Interface

This document records the design rationale for the Foundation Algorithms research hub. The goal is not visual minimalism for its own sake; it is **lower visual noise so research structure, evidence, and reading remain dominant**.

## Product context

Foundation Algorithms is a research archive, not a marketing site and not a conventional analytics dashboard. Users need to:

- scan a large technical corpus;
- search and filter quickly;
- compare metadata and evidence;
- read long-form research comfortably;
- follow relationships between algorithms, claims, experiments, and sources;
- switch between dense discovery views and quiet reading views.

That favors a restrained interface where typography, spacing, alignment, borders, and information structure do most of the work.

## Research references

### Vercel Web Interface Guidelines

Reference: https://vercel.com/design/guidelines

Relevant principles:

- keyboard access should work throughout the interface;
- focus states must be obvious;
- interaction states should increase contrast rather than depend on decoration;
- borders should be crisp;
- radii should remain internally consistent;
- UI should not rely on color alone for status;
- copy and controls should stay concise.

### GitHub Primer — Color usage

Reference: https://primer.style/product/getting-started/foundations/color-usage/

Relevant principles:

- neutral scales should carry most backgrounds, text, borders, and structure;
- colors should be assigned by functional role;
- accent color is for active, selected, focused, and informational states rather than general decoration;
- semantic states such as success, warning, and danger should remain distinct.

### Atlassian Design System — Color

Reference: https://atlassian.design/foundations/color

Relevant principles:

- neutral is the default role for text, navigation, backgrounds, and secondary controls;
- stronger colors should communicate meaning or increased emphasis;
- emphasis should be controlled through contrast levels;
- dark mode should use dedicated neutral mappings rather than simply invert light colors.

### Atlassian Design System — Elevation

Reference: https://atlassian.design/foundations/elevation

Relevant principle:

- flat surfaces are the baseline; raised elevation should be reserved for elements that truly need to appear above the current surface.

### GOV.UK Design System — Color and layout

References:

- https://design-system.service.gov.uk/styles/colour/
- https://design-system.service.gov.uk/styles/layout/

Relevant principles:

- meaning must never depend on color alone;
- accessible contrast is mandatory;
- long reading lines should be constrained;
- content-first layouts should avoid unnecessary visual complexity.

## Chosen design direction

### 1. Neutral first

The default UI uses near-white / near-black neutral surfaces with restrained gray borders. Saturated field colors are removed from routine navigation and content cards.

Research categories remain identifiable through labels, names, ordering, icons, and structure rather than five competing colors.

### 2. One subdued interaction accent

The interface keeps one low-saturation slate accent for:

- focus rings;
- selected states;
- active navigation;
- subtle interactive emphasis.

This accent is not used as decoration.

### 3. Semantic color only when it has meaning

Success, warning, danger, error, and similar states may still use semantic color. Those states must also include text, icons, or labels so color is never the only cue.

### 4. Flat surfaces by default

Cards, panels, filters, tables, and search surfaces use:

- a solid surface;
- a 1px neutral border;
- little or no shadow;
- no decorative gradient;
- no glass blur.

Elevation is reserved primarily for overlays such as the command palette.

### 5. Smaller, quieter geometry

Large glass-era radii are reduced. The target geometry is:

- buttons: ~8px;
- inputs: ~10px;
- panels/cards: ~12px;
- large containers/modals: ~16px.

The result should feel precise rather than soft or bubbly.

### 6. Typography carries hierarchy

The existing AgoCode-inspired typography roles remain:

- **Fraunces** — major editorial/research hierarchy;
- **Source Sans 3** — body, navigation, controls, and long reading;
- **JetBrains Mono** — code, identifiers, technical metadata, and keyboard hints.

Color is intentionally reduced so heading scale, weight, spacing, and typeface contrast do more of the hierarchy work.

### 7. Search remains visually important without being colorful

Search should be easy to locate through size, placement, border contrast, and focus treatment. It does not need a bright accent fill or glow.

### 8. Dense research views stay readable

Tables and registries use subtle row separation and hover contrast. Headers are muted rather than tinted. Numeric/technical columns continue to use tabular or monospace treatment where appropriate.

### 9. Dark mode is independently tuned

Dark mode uses charcoal surfaces rather than pure black, restrained neutral borders, and off-white text. It does not reintroduce saturated category colors.

### 10. Motion and decoration are subordinate

Decorative glows, gradients, glass effects, and deep shadows are removed. Animation should communicate state change, not make the interface feel lively for its own sake.

## Implementation

The final override is loaded from:

- `app/minimal-research.css`

It intentionally loads after the historical visual layers so existing layout and feature CSS can remain stable while the final visual language is controlled in one place.

The layer:

- replaces the old multi-color field palette with a neutral category token;
- flattens generic cards, panels, toolbars, tables, and search surfaces;
- removes page background glows and grid decoration;
- converts the floating glass header into a simple sticky header with one divider;
- removes most shadows and backdrop blur;
- keeps modest elevation only for the command palette / overlay behavior;
- neutralizes decorative atlas colors;
- preserves semantic state colors where they communicate real meaning;
- preserves the existing typography system.

## Acceptance criteria

The visual system is successful when:

1. a screenshot reads primarily as text, structure, and evidence rather than colored components;
2. no research field visually dominates because of hue;
3. active/focus/hover states remain immediately discoverable;
4. long-form reading remains comfortable in light and dark modes;
5. dense tables and registries are easy to scan;
6. color is never the only way to understand status or category;
7. overlays are clearly elevated while ordinary content stays flat;
8. typography remains consistent across all routes;
9. mobile continues to behave as a reading-first interface;
10. the site still feels intentional and distinctive through typography, spacing, and the circular mark rather than decorative effects.
