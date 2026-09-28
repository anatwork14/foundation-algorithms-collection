# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-09-28  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)

This file tracks implementation state in the repository. A checked item means the implementation exists; visual, accessibility, evidence, or production acceptance is tracked separately and is not implied by code being present.

---

## 1. Current checkpoint

The project now has this working product chain:

```text
Research corpus
      ↓
Markdown source of truth
      ↓
Next.js content pipeline
      ↓
Archive + chapter reader
      ↓
Curated algorithm entities
      ↓
Typed relationship Atlas
      ↓
Structured combination Lab
      ↓
Research hypotheses + experiment plans
```

The next major product layers are:

```text
Browser/accessibility acceptance
      ↓
Exact source-passage + citation/reference entities
      ↓
Experiment/evidence persistence
      ↓
Diff-aware research history
      ↓
Advanced retrieval / saved research trails
```

### Overall phase status

| Phase | Status |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Next.js archive foundation | ✅ Established |
| 2 — Design-system consolidation | 🟡 Implemented, acceptance/cleanup still open |
| 3 — Algorithm-level indexing | 🟡 First working version implemented |
| 4 — Atlas | 🟡 First working version implemented |
| 5 — Lab | 🟡 First working version implemented |
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
- [ ] Add explicit maturity labels into the Markdown corpus itself.
- [ ] Add source-passage anchors for algorithm/reference entities.

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
- [x] Major `#` section headings indexed after the document title.
- [x] TOC includes `#`, `##`, and `###` research sections.
- [x] Existing LaTeX `\(...\)` / `\[...\]` delimiters normalized at render time outside fenced code.

## Home

- [x] Mission/orientation hero.
- [x] Primary research search.
- [x] Quick field filters.
- [x] Research-field overview.
- [x] Algorithm-atlas visual motif.
- [x] Combination/research-direction preview.
- [x] Archive preview.
- [x] Home archive preview converted to list-first research rows.

## Archive

- [x] `/archive` route.
- [x] Full-text chapter search.
- [x] Field filter.
- [x] Sorting.
- [x] Result count and clear-filter behavior.
- [x] List-first archive rows.
- [x] Direct chapter navigation.
- [x] Restrained field identity treatment.

### Archive still needed

- [ ] Encode filter/search state in URL.
- [ ] Family-level filters.
- [ ] Algorithm-level filters inside Archive.
- [ ] Maturity/evidence filters.
- [ ] Matching-passage highlighting.

## Research chapter reader

- [x] Dynamic `/archive/[slug]` route.
- [x] GFM Markdown rendering.
- [x] GitHub source/provenance link.
- [x] Generated TOC.
- [x] Active/current-section TOC tracking with `IntersectionObserver`.
- [x] Related research navigation.
- [x] Previous/next navigation.
- [x] Chapter → algorithm entity panel.
- [x] Major internal Markdown H1 sections normalized semantically beneath the page H1.
- [x] Controlled research reading width.
- [x] Refined H1/H2/H3 hierarchy.
- [x] Refined paragraphs/lists/blockquotes/links.
- [x] Refined inline and block code styling.
- [x] Research-oriented table styling and local overflow handling.
- [x] KaTeX math rendering.
- [x] Equation overflow handling.

### Reader still needed

- [ ] Reference/citation entities.
- [ ] Browser acceptance for especially large equations/tables.
- [ ] Math accessibility review.
- [ ] Exact source-passage backlinks from algorithm entities.

## Search

- [x] Chapter title search.
- [x] Chapter summary search.
- [x] Chapter body search.
- [x] Home search.
- [x] Archive search.
- [x] Global `Cmd/Ctrl + K` search.
- [x] Global search includes algorithm entities.
- [x] Dedicated `/algorithms` entity search with field and maturity filters.

### Search still needed

- [ ] Independent reference search.
- [ ] Passage result snippets/highlighting.
- [ ] Optional semantic retrieval after structural search matures.

---

# Phase 2 — Design-system consolidation

**State:** first implementation pass complete; visual/accessibility acceptance and legacy cleanup remain open.

## Typography

- [x] IBM Plex Sans through `next/font/google`.
- [x] IBM Plex Mono through `next/font/google`.
- [x] Deterministic Next.js font integration.
- [x] IBM Plex Sans is the effective primary runtime font.
- [x] IBM Plex Mono is used for code and technical identifiers.
- [x] Explicit type tokens.
- [x] Display/H1/H2/H3/body/UI/meta/label/code hierarchy.
- [x] Standardized research prose, metadata, labels, and code typography.
- [ ] Remove obsolete `Inter` and generic-serif declarations from legacy `globals.css` rather than only overriding them.
- [ ] Final browser audit for font fallback/weight behavior.

## Color

- [x] Warm-neutral light palette.
- [x] Warm-neutral dark palette.
- [x] Field colors for Foundations, AI/ML, Quantum, Cybersecurity, Cross-field.
- [x] Field colors restricted toward identifiers, borders, labels, and small states.
- [x] Selection/focus tokens.
- [ ] Formal WCAG contrast audit.
- [ ] Browser review of selected/hover/focus states.

## Shape / elevation / spacing

- [x] Button/input/panel/modal radius tokens.
- [x] Large default radii reduced in the consolidation layer.
- [x] Decorative shadows reduced.
- [x] Borders favored over elevation for research surfaces.
- [x] 8px-derived spacing scale (`4/8/12/16/24/32/48/64/96/128`).
- [x] Reader/list/layout rhythm moved onto spacing tokens.
- [ ] Remove obsolete legacy radius/shadow declarations after visual acceptance.
- [ ] Complete migration of every legacy component declaration to spacing tokens.

## Logo / brand

- [x] Circular/orbit identity concept.
- [x] Canonical SVG: `public/foundation-algorithms-mark.svg`.
- [x] Monochrome SVG: `public/foundation-algorithms-mark-mono.svg`.
- [x] Header uses canonical SVG.
- [x] SVG adapts neutral treatment to system dark mode.
- [x] Canonical SVG configured as application icon metadata.
- [ ] Visually verify favicon-scale legibility.
- [ ] Visually verify dark/light variants in browsers.
- [ ] Social/share image asset.

## Accessibility implementation

- [x] Semantic HTML in major page structure.
- [x] Native form controls for search/filtering.
- [x] Keyboard-independent navigation exists.
- [x] Global `:focus-visible` treatment.
- [x] Reduced-motion CSS behavior.
- [x] Color accompanied by text labels in major UI.
- [x] Atlas has a textual relationship table in addition to visual neighbor cards.
- [ ] Full keyboard-only walkthrough.
- [ ] Command-palette focus management audit.
- [ ] VoiceOver spot check.
- [ ] NVDA spot check.
- [ ] WCAG contrast review.
- [ ] Table accessibility review.
- [ ] Math accessibility review.

## Phase 2 acceptance gates

- [x] IBM Plex Sans primary typeface.
- [x] IBM Plex Mono code/identifier typeface.
- [x] Archive list-first.
- [x] Restrained field colors.
- [x] Research table styling.
- [x] KaTeX math renderer.
- [x] Local equation/table overflow handling.
- [x] Keyboard focus styling.
- [x] Active TOC state implemented.
- [x] CI typecheck passes.
- [x] CI production build passes.
- [ ] Legacy font/radius declaration cleanup complete.
- [ ] Mobile browser acceptance passes.
- [ ] Desktop browser acceptance passes.
- [ ] Light/dark visual review passes.
- [ ] Accessibility acceptance passes.

---

# Phase 3 — Algorithm-level indexing

**State:** first working entity layer implemented.

- [x] `AlgorithmEntity` schema.
- [x] Aliases, fields, families, assumptions, complexity, maturity, implementation guidance, failure modes, tags, and open questions.
- [x] Source-chapter linkage.
- [ ] Exact source-passage linkage.
- [x] Curated metadata strategy chosen for the first version.
- [x] Major cross-field algorithm entities seeded.
- [x] Duplicate ID/name/alias validation.
- [x] Broken relation-target validation.
- [x] `/algorithms` searchable index.
- [x] `/algorithms/[id]` static detail routes.
- [x] Motivation / Contribution / Implementation sections.
- [x] Assumption / failure-mode / complexity sections.
- [x] Typed relationships and inbound relationships.
- [x] Source-chapter links.
- [x] Lab hypothesis links from algorithm cards.
- [x] Algorithm entities integrated into global command search.
- [x] Chapter pages link back to entities they contain.
- [ ] Explicit variant records rather than relation-only variants.
- [ ] First-class reference/paper entities.
- [ ] First-class implementation repository records.
- [ ] Source-passage-level provenance.

---

# Phase 4 — Atlas

**State:** focused-neighborhood first version implemented.

- [x] Algorithm nodes backed by `AlgorithmEntity`.
- [x] Typed relation/edge model.
- [x] Machine-readable relation storage.
- [x] Relation-target validation.
- [x] `/atlas` route.
- [x] Focused-neighborhood view instead of all-node hairball.
- [x] Incoming and outgoing relationship handling.
- [x] Progressive traversal by selecting neighbor nodes.
- [x] Algorithm search.
- [x] Field filter.
- [x] Relation-type filter.
- [x] Links to algorithm research cards.
- [x] Mobile layout.
- [x] Accessible textual relationship table.

### Initial relation coverage

- [ ] Search → A* → learned heuristics (partial: A* entity exists; learned-heuristic entity still needed).
- [x] Dynamic programming → reinforcement learning (via Q-learning/Bellman relationship).
- [x] Bayesian inference → Thompson Sampling / Bayesian optimization.
- [ ] UCB → LinUCB → NeuralUCB (UCB → LinUCB exists; NeuralUCB entity still needed).
- [ ] Representation learning → embeddings → ANN/HNSW (HNSW exists; embedding entity still needed).
- [ ] CSP/SAT → symbolic execution/formal analysis (symbolic execution exists; SAT/SMT entity still needed).
- [ ] Error-correcting codes → QEC → decoding (surface-code decoding exists; classical code entity still needed).
- [ ] Lattices → PQC / FHE (ML-KEM/FHE exist; shared lattice foundation entity still needed).

---

# Phase 5 — Lab

**State:** structured hypothesis/experiment first version implemented.

- [x] `ResearchCombination` schema.
- [x] Component entities.
- [x] Motivation.
- [x] Hypothesis.
- [x] Compatibility.
- [x] Tensions/conflicts.
- [x] Expected benefits.
- [x] Risks.
- [x] Metrics.
- [x] Experiment plan.
- [x] Status.
- [ ] Evidence/results field and persistence.
- [x] `/lab` route.
- [x] Interactive Algorithm A × Algorithm B pair explorer.
- [x] Pair explorer shows shared fields/families, direct Atlas relation, and existing Lab record matches.
- [x] Structured hypothesis records.
- [x] Structured experiment plans.
- [x] Speculation visually/status-labeled separately from established knowledge.
- [x] Algorithm cards link into relevant Lab hypotheses.
- [ ] Persist user-authored hypotheses/experiments.
- [ ] Automatic assumption-conflict analysis for arbitrary pairs.
- [ ] Attach experimental evidence/results.

### Seed structured combinations

- [x] Contextual bandits × coverage-guided fuzzing.
- [x] GNN/SSM × quantum decoding.
- [x] Bayesian optimization × quantum calibration/QEC.
- [x] Learned planning × symbolic execution × proof constraints.
- [x] HNSW retrieval × LinUCB reranking.
- [x] FHE × uncertainty-aware prediction.
- [ ] FHE/MPC × ZK × AI full multi-party/verifiable record.
- [ ] Learned heuristics × A*/branch-and-bound record.

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
- [ ] Related-algorithm suggestions beyond curated relationships.
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
- [x] Entity validation participates in static build through `/algorithms`.
- [x] Latest Algorithm/Atlas/Lab + active-TOC tranche passes typecheck and production build.

## Still needed

- [ ] ESLint/static lint workflow.
- [ ] Content-parser unit tests.
- [ ] Algorithm validation unit tests.
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

- IBM Plex Sans + IBM Plex Mono through `next/font`;
- type, spacing, radius, neutral color, field color, and focus tokens;
- canonical color and monochrome SVG marks;
- SVG application icon;
- list-first home archive;
- restrained field colors;
- controlled research reading width and vertical rhythm;
- code, blockquote, link, list, and table refinement;
- `remark-math` + `rehype-katex` + KaTeX;
- render-time normalization of `\(...\)` / `\[...\]` delimiters;
- code-fence protection during math normalization;
- research H1 sections added to TOC and normalized beneath page H1;
- reduced-motion and focus treatment;
- successful CI typecheck/build.

## 2026-09-28 — Algorithm / Atlas / Lab tranche 1

Completed:

- curated `AlgorithmEntity` model spanning foundations, AI/ML, quantum, and cybersecurity;
- entity validation for duplicate IDs/names/aliases and broken relation targets;
- searchable `/algorithms` index with field and maturity filtering;
- algorithm research-card pages with Motivation, Contribution, assumptions, complexity, Implementation, failure modes, open questions, relationships, sources, tags, and Lab links;
- global command search now searches algorithms and chapters together;
- chapter pages link to algorithm entities;
- typed relationship Atlas with incoming/outgoing edges, progressive focus traversal, field/relation filtering, and accessible textual table;
- structured `ResearchCombination` model;
- `/lab` with explicit hypotheses, compatibility, tensions, benefits, risks, metrics, experiment plans, sources, and status;
- interactive Algorithm A × Algorithm B pair explorer;
- active chapter TOC tracking with `IntersectionObserver`;
- successful CI typecheck/build for the complete tranche.

Still intentionally open:

- rendered browser inspection;
- mobile/tablet/desktop visual acceptance;
- light/dark acceptance;
- formal contrast/screen-reader/math accessibility testing;
- physical cleanup of overridden legacy CSS;
- exact source-passage linkage;
- citation/reference entities;
- persisted evidence and experiment results;
- remaining Atlas foundation nodes and Lab seed records.

---

## Maintenance rule

Update this file whenever a meaningful feature, acceptance gate, or phase changes.

Use these meanings consistently:

- `[x]` — implemented and present in the repository;
- `[ ]` — not yet complete;
- implementation does **not** imply visual/accessibility/evidence/production acceptance unless the corresponding acceptance item is also checked.
