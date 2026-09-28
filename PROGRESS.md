# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-09-28  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)

A checked item means the implementation exists in the repository. Visual, accessibility, evidence, and production acceptance are tracked separately.

---

## Current product chain

```text
Research corpus
      ↓
Markdown source of truth
      ↓
Next.js Archive + chapter reader
      ↓
Curated Algorithm entities
      ↓
Typed relationship Atlas
      ↓
Structured Combination Lab
      ↓
Hypotheses + experiment plans
```

### Phase status

| Phase | Status |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Next.js archive foundation | ✅ Established |
| 2 — Design-system consolidation | 🟡 Implemented; browser/accessibility cleanup open |
| 3 — Algorithm-level indexing | 🟡 Working first version |
| 4 — Atlas | 🟡 Working first version with initial foundation graph coverage |
| 5 — Lab | 🟡 Working first version with structured seed hypotheses |
| 6 — Research evidence layer | ⬜ Not started |
| 7 — Advanced discovery | ⬜ Not started |

---

# Phase 0 — Research corpus

## Done

- [x] General foundations (`00–09`).
- [x] AI / ML (`10–14`).
- [x] Quantum computing (`20–25`).
- [x] Cybersecurity (`30–35`).
- [x] Cross-field combination map (`40`).
- [x] Emerging-algorithms watchlist (`41`).
- [x] Motivation / Contribution / Implementation framing.
- [x] Combination-research perspective.

## Still needed

- [ ] Standardize primary-reference formatting across chapters.
- [ ] Add proof/proof-sketch coverage where useful.
- [ ] Add more executable/reference implementations.
- [ ] Add benchmark/dataset recommendations by family.
- [ ] Add explicit maturity labels into Markdown research itself.
- [ ] Add stable source-passage anchors for entity provenance.

---

# Phase 1 — Research archive web foundation

## Content pipeline

- [x] Next.js App Router + TypeScript.
- [x] `docs/*.md` remains canonical research source.
- [x] Extract title, summary, number, field, headings, search text, word count, reading time.
- [x] GitHub-compatible heading slugs.
- [x] `#`, `##`, and `###` research sections indexed after document title.
- [x] Render-time normalization of `\(...\)` / `\[...\]` outside fenced code.

## Home / Archive

- [x] Mission/orientation hero.
- [x] Full-corpus search.
- [x] Quick field filters.
- [x] Field overview.
- [x] Combination preview.
- [x] `/archive` route.
- [x] List-first archive and home preview.
- [x] Field filtering, sorting, result count, clear filters.
- [x] Restrained field identity treatment.

### Archive still needed

- [ ] Encode filter/search state in URL.
- [ ] Family filters inside Archive.
- [ ] Algorithm filters inside Archive.
- [ ] Maturity/evidence filters inside Archive.
- [ ] Matching-passage snippets/highlighting.

## Chapter reader

- [x] Dynamic `/archive/[slug]` route.
- [x] GFM Markdown rendering.
- [x] GitHub source/provenance link.
- [x] Generated TOC.
- [x] Active/current-section TOC via `IntersectionObserver`.
- [x] Related chapters + previous/next navigation.
- [x] Chapter → Algorithm entity panel.
- [x] Internal Markdown H1 sections normalized beneath page H1.
- [x] Controlled reading width and research typography.
- [x] Lists, blockquotes, links, code, and research tables.
- [x] KaTeX mathematics and local equation/table overflow handling.

### Reader still needed

- [ ] Exact source-passage backlinks from Algorithm entities.
- [ ] First-class citation/reference entities.
- [ ] Browser acceptance for extreme equations/tables.
- [ ] Math accessibility review.

## Search

- [x] Chapter title/summary/body search.
- [x] Home and Archive search.
- [x] Global `Cmd/Ctrl + K` search.
- [x] Global search includes Algorithm entities.
- [x] Dedicated Algorithm search with field + maturity filters.

### Search still needed

- [ ] Reference/paper search.
- [ ] Passage-level result snippets.
- [ ] Optional semantic retrieval after structural search matures.

---

# Phase 2 — Design-system consolidation

## Done

- [x] IBM Plex Sans through `next/font`.
- [x] IBM Plex Mono through `next/font`.
- [x] Explicit typography tokens.
- [x] Warm-neutral light and dark palettes.
- [x] Restrained field colors.
- [x] Radius, spacing, focus, and reading-width tokens.
- [x] Reduced decorative shadow/elevation.
- [x] 8px-derived spacing system.
- [x] Visible `:focus-visible` treatment.
- [x] Reduced-motion behavior.
- [x] Research table/code/math treatment.
- [x] Active TOC state.
- [x] Canonical SVG logo: `public/foundation-algorithms-mark.svg`.
- [x] Monochrome SVG: `public/foundation-algorithms-mark-mono.svg`.
- [x] Header and application icon use canonical SVG.

## Still needed

- [ ] Remove obsolete overridden Inter/serif/radius/shadow rules from legacy `globals.css`.
- [ ] Finish migration of all legacy components to spacing tokens.
- [ ] Browser font/weight audit.
- [ ] Favicon-scale visual verification.
- [ ] Light/dark visual acceptance.
- [ ] Phone/tablet/desktop visual acceptance.
- [ ] Formal WCAG contrast audit.
- [ ] Full keyboard-only walkthrough.
- [ ] Command-palette focus-trap/return-focus audit.
- [ ] VoiceOver/NVDA checks.
- [ ] Table/math accessibility checks.
- [ ] Social/share image.

---

# Phase 3 — Algorithm-level indexing

**State:** working curated entity system.

## Done

- [x] `AlgorithmEntity` schema.
- [x] IDs, aliases, fields, families, assumptions, complexity, maturity.
- [x] Motivation, Contribution, Implementation, failure modes, open questions.
- [x] Source-chapter linkage.
- [x] Curated metadata strategy.
- [x] Core + extension catalogs.
- [x] Cross-field entity coverage spanning foundations, AI/ML, quantum, and cybersecurity.
- [x] Validation for duplicate IDs/names/aliases, missing required data, self/duplicate/broken relations.
- [x] `/algorithms` searchable index.
- [x] `/algorithms/[id]` static research cards.
- [x] Incoming/outgoing typed relationships.
- [x] Source-chapter links.
- [x] Lab hypothesis links from Algorithm cards.
- [x] Algorithm entities in global search.
- [x] Chapter → Algorithm backlinks.

## Second-wave entities now added

- [x] Learned Heuristics.
- [x] Branch and Bound.
- [x] NeuralUCB.
- [x] Embedding Models.
- [x] SAT / SMT Solving.
- [x] Error-Correcting Codes.
- [x] Lattice Problems and Reduction.
- [x] Secure Multi-Party Computation.

## Still needed

- [ ] Exact source-passage linkage.
- [ ] Explicit variant records rather than relation-only variants.
- [ ] First-class papers/references.
- [ ] First-class implementation repository records.

---

# Phase 4 — Atlas

**State:** focused-neighborhood first version implemented.

## Done

- [x] Algorithm nodes backed by machine-readable entities.
- [x] Typed relation/edge model.
- [x] Relationship target validation.
- [x] `/atlas` route.
- [x] Focused-neighborhood view rather than all-node hairball.
- [x] Incoming and outgoing relations.
- [x] Progressive traversal by selecting neighbors.
- [x] Algorithm search.
- [x] Field filter.
- [x] Relation-type filter.
- [x] Algorithm research-card links.
- [x] Mobile layout.
- [x] Accessible textual relationship table.

## Initial foundation chains

- [x] Search → A* ↔ Learned Heuristics.
- [x] Learned Heuristics ↔ Branch and Bound.
- [x] Dynamic Programming → reinforcement learning / Q-Learning.
- [x] Bayesian Inference → Thompson Sampling / Bayesian Optimization.
- [x] UCB → LinUCB → NeuralUCB.
- [x] Representation learning / Embeddings → HNSW.
- [x] SAT / SMT → Symbolic Execution / formal analysis.
- [x] Error-Correcting Codes → QEC / Surface-Code Decoding.
- [x] Lattice foundations → ML-KEM / FHE.
- [x] MPC ↔ FHE / Zero-Knowledge proof relationships.

## Still needed

- [ ] More relation density across all seeded entities.
- [ ] Reference/paper nodes.
- [ ] Implementation nodes.
- [ ] Evidence strength on edges.
- [ ] Historical/evolution relationships.

---

# Phase 5 — Lab

**State:** structured hypothesis + experiment-design first version implemented.

## Done

- [x] `ResearchCombination` schema.
- [x] Core + extension combination catalogs.
- [x] Components, Motivation, hypothesis, compatibility, tensions, benefits, risks, metrics, experiment plan, status.
- [x] Combination validation for IDs, component existence, required research fields, and experiment structure.
- [x] `/lab` route.
- [x] Algorithm A × Algorithm B pair explorer.
- [x] Pair explorer shows shared fields/families, direct Atlas relation, and existing Lab records.
- [x] Structured hypothesis records and experiment plans.
- [x] Speculation/status labels distinct from established knowledge.
- [x] Algorithm cards link into relevant Lab hypotheses.

## Structured seed hypotheses

- [x] LinUCB × coverage-guided fuzzing.
- [x] GNN / SSM × quantum error decoding.
- [x] Bayesian optimization × quantum calibration / QEC.
- [x] Learned planning × symbolic execution × proof constraints.
- [x] HNSW retrieval × LinUCB reranking.
- [x] FHE × uncertainty-aware prediction.
- [x] FHE × MPC × Zero Knowledge × AI.
- [x] Learned Heuristics × A* × Branch and Bound.

## Still needed

- [ ] Persist user-authored hypotheses/experiments.
- [ ] Automatic assumption-conflict analysis for arbitrary pairs.
- [ ] Evidence/results field and persistence.
- [ ] Dataset/benchmark attachments.
- [ ] Experiment status/history.

---

# Phase 6 — Research evidence layer

- [ ] Reference entity schema.
- [ ] Primary-reference extraction/curation.
- [ ] Reference → Algorithm links.
- [ ] Reference → Combination links.
- [ ] Citation graph.
- [ ] Implementation records with language/framework/license/source metadata.
- [ ] Experiment entity schema.
- [ ] Dataset/benchmark links.
- [ ] Environment/configuration/results/reproduction instructions.
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

## Done

- [x] GitHub Actions validation workflow.
- [x] Dependency installation step.
- [x] TypeScript typecheck.
- [x] Next.js production build.
- [x] Algorithm validation participates in static build.
- [x] Combination validation participates in Lab static build.
- [x] Expanded Algorithm / Atlas / Lab catalog passes typecheck and production build.

## Still needed

- [ ] ESLint/static lint workflow.
- [ ] Content-parser unit tests.
- [ ] Algorithm/Combination validation unit tests.
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
- [x] `DESIGN.md` — product/UI rationale.
- [x] `DEVELOPMENT_SPEC.md` — intended product/technical specification.
- [x] `PROGRESS.md` — active implementation tracker.
- [ ] Contribution guide.
- [ ] Algorithm metadata authoring guide.
- [ ] Atlas relationship authoring guide.
- [ ] Lab hypothesis/experiment authoring guide.
- [ ] Deployment/operations guide.

---

# Implementation log

## 2026-09-28 — Design-system tranche 1

- IBM Plex Sans + IBM Plex Mono;
- type/spacing/radius/color/focus tokens;
- canonical color + monochrome SVG mark;
- list-first Archive language;
- refined research reader, code, tables, KaTeX mathematics;
- active section-ready heading/TOC structure;
- reduced motion + visible focus;
- CI typecheck/build passed.

## 2026-09-28 — Algorithms / Atlas / Lab tranche 1

- curated `AlgorithmEntity` model and validation;
- searchable `/algorithms` and research-card detail pages;
- chapter/entity/global-search integration;
- typed relationship Atlas with search, filters, progressive traversal, textual fallback;
- structured `ResearchCombination` model;
- Lab hypotheses, metrics, experiment plans, and pair explorer;
- active chapter TOC tracking;
- CI typecheck/build passed.

## 2026-09-28 — Algorithms / Atlas / Lab tranche 2

- added Learned Heuristics, Branch and Bound, NeuralUCB, Embedding Models, SAT/SMT, Error-Correcting Codes, Lattice foundations, and MPC;
- introduced combined Algorithm catalog so all new entities participate in search, Archive backlinks, Algorithm pages, and Atlas;
- closed the initial Atlas chains for learned search, neural bandits, embedding retrieval, formal solving, coding/QEC, and lattice/PQC/FHE;
- added FHE × MPC × ZK × AI structured research hypothesis;
- added Learned Heuristics × A* × Branch-and-Bound structured hypothesis;
- added Combination validation;
- latest expanded catalog passed TypeScript and production Next.js build in GitHub Actions.

---

## Immediate next engineering work

1. Browser acceptance across phone/tablet/desktop and light/dark.
2. Accessibility/contrast/math acceptance.
3. Clean obsolete legacy CSS after browser review.
4. Start Phase 6 with reference/paper entities and source-passage provenance.
5. Add experiment/evidence records to Lab.
6. Add tests for content parsing, entity validation, search, routes, and broken links.

---

## Maintenance rule

Update this file whenever a meaningful feature, acceptance gate, or phase changes.

- `[x]` — implemented and present in the repository.
- `[ ]` — not yet complete.
- Implementation does **not** imply visual/accessibility/evidence/production acceptance unless that acceptance item is also checked.
