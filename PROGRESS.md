# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-09-28  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)

This file tracks implementation state in the repository. A checked item means the implementation exists; visual, accessibility, or production acceptance is tracked separately and is not implied by code being present.

---

## 1. Current checkpoint

The project currently has:

```text
Research corpus
      ↓
Markdown source of truth
      ↓
Next.js content pipeline
      ↓
Searchable Archive
      ↓
Research chapter reader
      ↓
Consistent design-system implementation
      ↓
KaTeX mathematics + research tables/code
      ↓
Combination inspiration
```

The next major product layers remain:

```text
Browser/accessibility acceptance
      ↓
Algorithm entities
      ↓
Atlas
      ↓
Lab
      ↓
Evidence + experiments + citations
```

### Overall phase status

| Phase | Status |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Next.js archive foundation | ✅ Established |
| 2 — Design-system consolidation | 🟡 Implemented, acceptance/cleanup still open |
| 3 — Algorithm-level indexing | ⬜ Not started |
| 4 — Atlas | ⬜ Not started |
| 5 — Lab | ⬜ Not started |
| 6 — Research evidence layer | ⬜ Not started |
| 7 — Advanced discovery | ⬜ Not started |

---

# Phase 0 — Research corpus foundation

## Completed

- [x] General foundational algorithm research collection (`00–09`).
- [x] AI / ML research branch (`10–14`).
- [x] Quantum computing research branch (`20–25`).
- [x] Cybersecurity research branch (`30–35`).
- [x] Cross-field combination map (`40`).
- [x] Emerging-algorithms watchlist (`41`).
- [x] Motivation / Contribution / Implementation framing established across the collection.
- [x] Combination-research perspective established.

## Still needed

- [ ] Standardize primary-reference formatting across chapters.
- [ ] Add proof/proof-sketch coverage where useful.
- [ ] Add more executable examples and reference implementations.
- [ ] Add benchmark/dataset recommendations by algorithm family.
- [ ] Add explicit maturity labels.
- [ ] Add machine-readable relationship metadata.
- [ ] Add source-passage anchors for future algorithm entities.

---

# Phase 1 — Research archive web foundation

## Application/content pipeline

- [x] Next.js App Router application.
- [x] React + TypeScript structure.
- [x] `docs/*.md` remains the canonical content source.
- [x] Chapter title/summary/number/field extraction.
- [x] Word count and reading-time extraction.
- [x] Full-body search text generation.
- [x] Heading extraction.
- [x] GitHub-compatible heading slug generation.
- [x] Major `#` section headings are now indexed after the document title.
- [x] Table of contents includes `#`, `##`, and `###` research sections.

## Home

- [x] Mission/orientation hero.
- [x] Primary research search.
- [x] Quick field filters.
- [x] Research-field overview.
- [x] Algorithm-atlas visual motif.
- [x] Combination/research-direction preview.
- [x] Archive preview.
- [x] Home archive preview converted from cards to list-first research rows.

## Archive

- [x] `/archive` route.
- [x] Full-text chapter search.
- [x] Field filter.
- [x] Sorting.
- [x] Result count and clear-filter behavior.
- [x] List-first archive rows.
- [x] Direct chapter navigation.
- [x] Field identity is now restrained to accents/identifiers in the design-system layer.

### Archive still needed

- [ ] Encode filter/search state in the URL.
- [ ] Family-level filters.
- [ ] Algorithm-level filters.
- [ ] Maturity/evidence filters.
- [ ] Matching-passage highlighting.

## Research chapter reader

- [x] Dynamic `/archive/[slug]` route.
- [x] GFM Markdown rendering.
- [x] Source/provenance link to GitHub Markdown.
- [x] TOC.
- [x] Related research.
- [x] Previous/next navigation.
- [x] Major internal Markdown H1 sections normalized semantically under the page H1.
- [x] Controlled research reading width implemented.
- [x] Refined H1/H2/H3 hierarchy implemented.
- [x] Refined paragraphs/lists/blockquotes/links.
- [x] Refined inline and block code styling.
- [x] Research-oriented table styling and horizontal overflow handling.
- [x] KaTeX math rendering stack implemented.
- [x] Existing `\(...\)` and `\[...\]` corpus delimiters normalized at render time while fenced code remains untouched.
- [x] Equation overflow handling implemented.

### Reader still needed

- [ ] Active/current-section TOC feedback.
- [ ] Algorithm-level relationship panel.
- [ ] Reference/citation entities.
- [ ] Browser acceptance for especially large equations/tables.
- [ ] Math accessibility review.

## Search

- [x] Search titles.
- [x] Search summaries.
- [x] Search chapter body text.
- [x] Home search.
- [x] Archive search.
- [x] Global `Cmd/Ctrl + K` search.

### Search still needed

- [ ] Independent algorithm-entity search.
- [ ] Independent reference search.
- [ ] Passage result snippets/highlighting.
- [ ] Optional semantic retrieval after structural search matures.

---

# Phase 2 — Design-system consolidation

**State:** first implementation pass complete; visual/accessibility acceptance still open.

## Typography

- [x] IBM Plex Sans added through `next/font/google`.
- [x] IBM Plex Mono added through `next/font/google`.
- [x] Font loading uses deterministic Next.js font integration.
- [x] IBM Plex Sans is the effective primary runtime font.
- [x] IBM Plex Mono is used for code and technical identifiers.
- [x] Explicit type tokens created.
- [x] Display/H1/H2/H3/body/UI/meta/label/code hierarchy defined.
- [x] Research prose size and line height standardized in the consolidation layer.
- [x] Label/metadata typography standardized.
- [x] Code typography standardized.
- [ ] Remove obsolete `Inter` and generic-serif declarations from legacy `globals.css` instead of only overriding them.
- [ ] Final browser audit for font fallback/weight behavior.

## Color

- [x] Warm-neutral light palette refined.
- [x] Warm-neutral dark palette refined.
- [x] Field colors retained for Foundations, AI/ML, Quantum, Cybersecurity, Cross-field.
- [x] Field colors restricted toward identifiers, borders, labels, and small states in the consolidation layer.
- [x] Selection/focus tokens established.
- [ ] Formal WCAG contrast audit.
- [ ] Browser review of selected/hover/focus states.

## Shape/elevation

- [x] Button radius token.
- [x] Input radius token.
- [x] Panel radius token.
- [x] Modal radius token.
- [x] Large default radii reduced through the consolidation layer.
- [x] Decorative shadows reduced.
- [x] Borders are favored over elevation for research surfaces.
- [ ] Remove obsolete legacy radius/shadow declarations after visual acceptance.

## Spacing

- [x] 8px-derived spacing token system added (`4/8/12/16/24/32/48/64/96/128`).
- [x] Research-reader vertical rhythm moved onto spacing tokens.
- [x] Archive/home list padding normalized.
- [x] Main reading layout gap normalized.
- [ ] Complete migration of every legacy component declaration to spacing tokens.

## Archive visual language

- [x] `/archive` is list-first.
- [x] Home archive preview is list-first.
- [x] Chapter number/field identity uses restrained accent treatment rather than saturated blocks.
- [x] Dense title/summary/metadata hierarchy refined.
- [x] Archive controls remain compact.
- [ ] Visual acceptance at phone/tablet/desktop widths.

## Research reading surface

- [x] Controlled prose width.
- [x] Heading hierarchy.
- [x] Paragraph/list rhythm.
- [x] Blockquotes.
- [x] Reference/link treatment.
- [x] Inline code.
- [x] Code blocks.
- [x] Research tables.
- [x] KaTeX equations.
- [x] Equation horizontal overflow handling.
- [ ] Active TOC state.
- [ ] Screen-reader/math accessibility acceptance.

## Logo / brand

- [x] Circular/orbit identity concept.
- [x] Canonical SVG logo source: `public/foundation-algorithms-mark.svg`.
- [x] Canonical mark is now used by the React header component.
- [x] SVG adapts its neutral disc/orbit treatment to system dark mode.
- [x] Monochrome SVG variant: `public/foundation-algorithms-mark-mono.svg`.
- [x] Canonical SVG configured as application icon metadata.
- [ ] Visually verify favicon-scale legibility in browsers.
- [ ] Visually verify dark/light variants in browsers.
- [ ] Social/share image asset.

## Accessibility implementation

- [x] Semantic HTML in major page structure.
- [x] Native form controls for search/filtering.
- [x] Keyboard-independent navigation exists.
- [x] Global `:focus-visible` treatment added.
- [x] Reduced-motion CSS behavior added.
- [x] Color is accompanied by text labels in major UI.
- [ ] Full keyboard-only walkthrough.
- [ ] Command-palette focus management audit.
- [ ] VoiceOver spot check.
- [ ] NVDA spot check.
- [ ] WCAG contrast review.
- [ ] Table accessibility review.
- [ ] Math accessibility review.

## Phase 2 acceptance gates

- [x] IBM Plex Sans is the effective primary typeface.
- [x] IBM Plex Mono is the effective code/identifier typeface.
- [x] Archive implementation is list-first.
- [x] Field colors are restrained in the consolidation layer.
- [x] Research table styling exists.
- [x] Equations use a math renderer.
- [x] Equation/table containers have local overflow handling.
- [x] Keyboard focus styling exists.
- [x] `npm run typecheck` passes in CI after the implementation tranche.
- [x] `npm run build` passes in CI after the implementation tranche.
- [ ] No legacy font/radius declaration cleanup remains.
- [ ] Mobile browser acceptance passes.
- [ ] Desktop browser acceptance passes.
- [ ] Light/dark visual review passes.
- [ ] Accessibility acceptance passes.

---

# Phase 3 — Algorithm-level indexing

**Goal:** let users discover individual algorithms independently of chapter files.

- [ ] Define `AlgorithmEntity` schema.
- [ ] Define aliases/families/assumptions/complexity/maturity.
- [ ] Define source chapter and exact passage linkage.
- [ ] Decide curated vs generated metadata strategy.
- [ ] Seed major algorithm entities.
- [ ] Add entity validation and duplicate/alias handling.
- [ ] Add algorithm detail route.
- [ ] Add algorithm search results.
- [ ] Add motivation/contribution/implementation quick navigation.
- [ ] Add assumptions/failure modes/complexity summaries.
- [ ] Add variants, alternatives, combinations, references, implementations.

---

# Phase 4 — Atlas

**Goal:** make algorithm relationships traversable.

- [ ] Define node types.
- [ ] Define relation/edge types.
- [ ] Add machine-readable relation storage and validation.
- [ ] Build `/atlas`.
- [ ] Focused-neighborhood graph rather than an unreadable all-node hairball.
- [ ] Text relationship panel.
- [ ] Progressive expansion.
- [ ] Field/relation filters.
- [ ] Archive/entity links from nodes.
- [ ] Mobile textual fallback.
- [ ] Accessible non-visual relationship representation.

Initial relation targets:

- [ ] Search → A* → learned heuristics.
- [ ] Dynamic programming → Bellman equations → RL.
- [ ] Bayesian inference → Thompson Sampling / Bayesian optimization.
- [ ] UCB → LinUCB → NeuralUCB.
- [ ] Representation learning → embeddings → ANN/HNSW.
- [ ] CSP/SAT → symbolic execution/formal analysis.
- [ ] Error-correcting codes → QEC → decoding.
- [ ] Lattices → PQC / FHE.

---

# Phase 5 — Lab

**Goal:** turn combinations into explicit hypotheses and experiments.

- [ ] Define `ResearchCombination` schema.
- [ ] Model component entities, motivation, hypothesis, compatibility, conflicts, benefits, risks, metrics, plan, status, and evidence.
- [ ] Build `/lab`.
- [ ] Select mechanism/algorithm A and B.
- [ ] Show shared interfaces and assumption conflicts.
- [ ] Create hypothesis records.
- [ ] Create experiment plans.
- [ ] Attach evidence/results.
- [ ] Visually distinguish speculation from established knowledge.

Seed structured combinations:

- [ ] Contextual bandits × fuzzing.
- [ ] GNN/SSM × quantum decoding.
- [ ] Bayesian optimization × quantum calibration.
- [ ] LLM × SMT/symbolic execution.
- [ ] FHE/MPC × ZK × AI.
- [ ] Learned heuristics × A*/branch-and-bound.

---

# Phase 6 — Research evidence layer

- [ ] Reference entity schema.
- [ ] Primary-reference extraction/curation.
- [ ] Reference → algorithm links.
- [ ] Reference → combination links.
- [ ] Citation graph.
- [ ] Implementation records and maturity/license/source metadata.
- [ ] Experiment schema.
- [ ] Dataset/benchmark links.
- [ ] Metrics/environment/results/reproduction instructions.
- [ ] Preserve failed and inconclusive experiments.
- [ ] Research-chapter diff view.
- [ ] Algorithm/evidence maturity history.

---

# Phase 7 — Advanced discovery

- [ ] Passage-level results.
- [ ] Semantic retrieval with inspectable evidence.
- [ ] Related-algorithm suggestions.
- [ ] Saved research trails.
- [ ] Research/hypothesis boards.
- [ ] Contribution templates and update workflow.

---

# Quality / CI

## Current

- [x] GitHub Actions workflow.
- [x] Dependency installation.
- [x] TypeScript typecheck.
- [x] Next.js production build.
- [x] Latest design-system/math/logo implementation tranche passes both typecheck and build.

## Still needed

- [ ] ESLint/static lint workflow.
- [ ] Content-parser unit tests.
- [ ] Math-delimiter normalization tests.
- [ ] Heading/TOC slug tests.
- [ ] Search tests.
- [ ] Route smoke tests.
- [ ] Broken-link validation.
- [ ] Markdown/reference validation.
- [ ] Accessibility CI.
- [ ] Screenshot/visual regression tests.
- [ ] Browser acceptance matrix.

---

# Deployment

- [x] Repository builds as a Next.js application.
- [x] CI confirms production builds succeed.
- [ ] Hosting/Vercel project connected.
- [ ] Preview deployment reviewed.
- [ ] Production deployment reviewed.
- [ ] Public production URL documented.
- [ ] Deployment status linked from README.

---

# Documentation

- [x] `README.md` — research collection and reading map.
- [x] `DESIGN.md` — initial product/UI rationale.
- [x] `DEVELOPMENT_SPEC.md` — intended product and technical specification.
- [x] `PROGRESS.md` — active implementation tracker.
- [ ] Contribution guide.
- [ ] Algorithm metadata authoring guide.
- [ ] Atlas relationship authoring guide.
- [ ] Lab hypothesis/experiment authoring guide.
- [ ] Deployment/operations guide.

---

# Implementation log

## 2026-09-28 — Design-system tranche 1

Completed:

- IBM Plex Sans + IBM Plex Mono integration through `next/font`;
- global type, spacing, radius, neutral color, field color, and focus tokens;
- canonical color SVG algorithm-atlas mark;
- monochrome SVG mark;
- application metadata icon wired to canonical SVG;
- home archive converted to list-first rows;
- field color treatment reduced from large surfaces toward accents;
- controlled research reading width and improved vertical rhythm;
- code, blockquote, link, list, and table refinement;
- `remark-math` + `rehype-katex` + KaTeX integration;
- render-time conversion of the corpus's LaTeX `\(...\)` / `\[...\]` delimiters;
- code-fence protection during math normalization;
- major body `#` headings added to TOC/preview extraction;
- internal research H1 sections rendered semantically beneath the page H1;
- reduced-motion support;
- visible focus treatment;
- successful CI typecheck and production build.

Still intentionally open after this tranche:

- rendered browser inspection;
- mobile/tablet/desktop acceptance;
- light/dark acceptance;
- formal contrast/accessibility testing;
- active TOC highlighting;
- physical cleanup of overridden legacy font/radius CSS;
- Phase 3 algorithm entity model.

---

## Maintenance rule

Update this file whenever a meaningful feature, acceptance gate, or phase changes.

Use these meanings consistently:

- `[x]` — implemented and present in the repository;
- `[ ]` — not yet complete;
- implementation does **not** imply visual/accessibility/production acceptance unless the corresponding acceptance item is also checked.
