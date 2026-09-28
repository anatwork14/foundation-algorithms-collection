# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-09-28  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)  
**Evidence authoring:** [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md)  
**Evidence profile policy:** [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md)

A checked item means the implementation exists in the repository. Visual, accessibility, evidence-quality, and production acceptance are tracked separately.

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
Unified Evidence hub
      ├── Primary references + verified citation graph
      ├── Implementation registry
      └── Experiment registry
      ↓
Descriptive evidence profiles + structural discovery
```

### Phase status

| Phase | Status |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Next.js archive foundation | ✅ Established |
| 2 — Design-system consolidation | 🟡 Implemented; browser/accessibility cleanup open |
| 3 — Algorithm-level indexing | 🟡 Working first version with evidence profiles |
| 4 — Atlas | 🟡 Working first version with initial foundation graph coverage |
| 5 — Lab | 🟡 Working first version with structured seed hypotheses |
| 6 — Research evidence layer | 🟡 Working first version: sources + citation provenance + code + planned experiments |
| 7 — Advanced discovery | 🟡 Structural/evidence-stage discovery implemented; semantic retrieval intentionally deferred |

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
- [ ] Add explicit claim/passage identifiers where heading-level provenance is insufficient.

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
- [x] Archive query/field/family/algorithm/evidence/stage/sort state encoded in URL.
- [x] Back/forward navigation restores URL-backed Archive state.
- [x] Algorithm-family filters.
- [x] Individual Algorithm filters.
- [x] Evidence-availability filters for References / Implementations / Experiments.
- [x] Algorithm evidence-stage filter derived from linked evidence records.
- [x] Archive search also matches curated Algorithm names, families, and evidence stages.
- [x] Archive rows expose linked Algorithm/evidence metadata and represented evidence stages.

### Archive still needed

- [ ] Matching-passage snippets/highlighting.
- [ ] Decide whether a separate conceptual-maturity filter is useful at chapter level; do not conflate it with evidence stage.

## Chapter reader

- [x] Dynamic `/archive/[slug]` route.
- [x] GFM Markdown rendering.
- [x] GitHub source/provenance link.
- [x] Generated TOC.
- [x] Active/current-section TOC via `IntersectionObserver`.
- [x] Related chapters + previous/next navigation.
- [x] Chapter → Algorithm entity panel.
- [x] Chapter → curated Reference panel.
- [x] Internal Markdown H1 sections normalized beneath page H1.
- [x] Controlled reading width and research typography.
- [x] Lists, blockquotes, links, code, and research tables.
- [x] KaTeX mathematics and local equation/table overflow handling.
- [x] Algorithm → heading-level chapter provenance using live TOC anchors.

### Reader still needed

- [ ] Claim/paragraph-level provenance where a heading is too broad.
- [ ] Browser acceptance for extreme equations/tables.
- [ ] Math accessibility review.

## Search

- [x] Chapter title/summary/body search.
- [x] Home and Archive search.
- [x] Global `Cmd/Ctrl + K` search.
- [x] Global search includes Algorithm entities.
- [x] Global search includes References.
- [x] Global search includes Implementation records.
- [x] Global search includes Experiment records.
- [x] Global Algorithm results expose and match evidence stage.
- [x] Dedicated Algorithm search with field + maturity + evidence-stage filters.
- [x] Dedicated Reference search/type/evidence-role filters.
- [x] Dedicated Implementation search/maturity filter.
- [x] Dedicated Experiment search/status filter.

### Search still needed

- [ ] Passage-level result snippets.
- [ ] Optional semantic retrieval after structural search/evidence coverage matures.

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
- [x] Primary product navigation consolidated to Archive / Algorithms / Atlas / Lab / Evidence.
- [x] Evidence sub-navigation standardized across Overview / References / Implementations / Experiments.
- [x] Evidence-profile and citation-provenance surfaces use the same restrained research UI system.

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
- [x] Heading-level source provenance resolved from live chapter TOCs.
- [x] Curated metadata strategy.
- [x] Core + extension catalogs.
- [x] Cross-field entity coverage spanning foundations, AI/ML, quantum, and cybersecurity.
- [x] Validation for duplicate IDs/names/aliases, missing required data, self/duplicate/broken relations.
- [x] `/algorithms` searchable index.
- [x] `/algorithms/[id]` static research cards.
- [x] Incoming/outgoing typed relationships.
- [x] Source-chapter links.
- [x] Source-section anchor links when Algorithm names/aliases match chapter headings.
- [x] Primary Reference backlinks.
- [x] Implementation-record backlinks.
- [x] Experiment-record backlinks.
- [x] Lab hypothesis links from Algorithm cards.
- [x] Algorithm entities in global search.
- [x] Chapter → Algorithm backlinks.
- [x] Derived multidimensional evidence profile per Algorithm.
- [x] Evidence stage shown separately from conceptual maturity.
- [x] Evidence dimensions expose literature, inspectable code, project experiments, and independent replication independently.

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

- [ ] Explicit claim/paragraph-level source linkage.
- [ ] Explicit variant records rather than relation-only variants.
- [ ] Broader curated coverage across all Markdown algorithms.
- [ ] First-class independent-replication records.

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
- [ ] Reference/paper nodes in Atlas itself.
- [ ] Implementation nodes in Atlas itself.
- [ ] Evidence/provenance metadata on Algorithm relation edges.
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
- [x] Lab records link to supporting curated References where available.
- [x] Lab records link to structured Experiment records where available.

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
- [ ] Attach actual empirical outcomes as experiments are run.
- [ ] Rich dataset/benchmark attachments.
- [ ] Experiment revision/status history.

---

# Phase 6 — Research evidence layer

**State:** first structured evidence system implemented; breadth and empirical results still limited.

## Unified evidence surface

- [x] `/evidence` overview route.
- [x] Evidence model visually distinguishes conceptual knowledge, primary sources, implementations, and experiments.
- [x] Shared Evidence sub-navigation across Overview / References / Implementations / Experiments.
- [x] Evidence sub-surfaces remain separately searchable and inspectable.
- [x] Evidence overview shows archive-stage coverage distribution without presenting it as a quality score.

## References

- [x] `ReferenceEntity` schema.
- [x] Controlled evidence-role metadata: Primary method / Primary extension / Normative standard / Survey-synthesis / Replication-evaluation.
- [x] Initial curated primary-source/standards set.
- [x] Reference validation for IDs, HTTPS source, year, role, tags, Algorithm links, Combination links, and chapter slugs.
- [x] Verified citation-edge schema with target, note, verification URL, and checked date.
- [x] Citation validation rejects broken, duplicate, self-referential, or malformed verification edges.
- [x] `/references` searchable/type/evidence-role-filtered index.
- [x] `/references/[id]` evidence detail pages.
- [x] `/references/graph` focused citation-neighborhood explorer.
- [x] Accessible citation-edge table.
- [x] Reference detail pages expose citation notes, verification source, and checked date.
- [x] Reference → Algorithm links.
- [x] Reference → Combination/Lab links.
- [x] Reference → chapter links.
- [x] Algorithm → Reference backlinks.
- [x] Lab → Reference backlinks where curated.
- [x] Chapter → Reference backlinks.
- [x] References included in global command search.
- [x] Initial verified in-corpus citation edges seeded conservatively.
- [ ] Broader primary-reference coverage across all entities.
- [ ] Exact claim-level source linkage.
- [ ] Broader citation-graph coverage through direct source verification.
- [ ] Retraction/correction/version metadata where relevant.

## Implementations

- [x] `ImplementationRecord` schema.
- [x] Repository, homepage, Algorithm links, language, interfaces, license, maturity, implementation notes, source paths, and verification date.
- [x] Initial registry includes verified HNSW, QPE, and ML-KEM implementation sources.
- [x] Implementation validation against Algorithm entity IDs and required metadata.
- [x] `/implementations` searchable/maturity-filtered registry.
- [x] `/implementations/[id]` detail pages.
- [x] Algorithm → Implementation backlinks.
- [x] Implementation → Algorithm links.
- [x] Implementation records included in global command search.
- [ ] Expand implementation coverage across more Algorithm entities.
- [ ] Automated repository freshness/version checks.
- [ ] Track specific release/version/commit in addition to verification date.

## Experiments

- [x] `ExperimentRecord` schema.
- [x] Planned/Running/Completed/Inconclusive/Failed status model.
- [x] Positive/Negative/Mixed/Inconclusive outcome model.
- [x] Baselines.
- [x] Dataset/benchmark descriptions.
- [x] Metrics.
- [x] Environment/configuration controls.
- [x] Reproduction procedure.
- [x] Precommitted success criteria.
- [x] Artifact slots.
- [x] Result/outcome/limitations slots.
- [x] Validation against Algorithm and Combination IDs.
- [x] `/experiments` searchable/status-filtered registry.
- [x] `/experiments/[id]` detail pages.
- [x] Algorithm → Experiment backlinks.
- [x] Lab hypothesis → Experiment backlinks.
- [x] Experiments included in global command search.
- [x] Initial planned studies for LinUCB×fuzzing, HNSW×LinUCB, and learned-QEC priors.
- [x] Schema can preserve failed/inconclusive studies instead of deleting them.
- [ ] Run and attach first empirical result.
- [ ] Add concrete benchmark URLs/data artifacts as experiments mature.
- [ ] Persist user-authored experiment updates/results.

## Evidence authoring / provenance

- [x] `EVIDENCE_AUTHORING.md` defines the distinction between concepts, sources, implementations, hypotheses, experiments, and results.
- [x] `EVIDENCE_PROFILE_POLICY.md` defines descriptive evidence stages and citation-provenance rules.
- [x] Evidence quality ladder documented.
- [x] Explicit no-fabricated-results rule documented.
- [x] Negative/inconclusive result preservation documented.
- [x] Heading-level Algorithm → Markdown provenance is generated from live TOC anchors.
- [x] Evidence stage is derived from actual linked records rather than manually scored.
- [x] Evidence dimensions remain independent instead of being collapsed into a numeric score.
- [ ] Claim-level/source-passage provenance model.
- [ ] First-class independent-replication record model.

## Evidence history still needed

- [ ] Research-chapter diff view.
- [ ] Algorithm/evidence-stage history.

---

# Phase 7 — Advanced discovery

## Structural discovery already implemented

- [x] Archive structural filtering by field.
- [x] Archive structural filtering by Algorithm family.
- [x] Archive structural filtering by individual Algorithm.
- [x] Archive structural filtering by Evidence availability.
- [x] Archive structural filtering by Algorithm evidence stage.
- [x] Algorithm index filtering by conceptual maturity and evidence stage separately.
- [x] Shareable URL-backed Archive discovery state.
- [x] Global search can match/display Algorithm evidence stage.

## Still needed

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
- [x] Reference validation participates in Reference static build.
- [x] Citation-edge verification metadata participates in Reference validation.
- [x] Implementation validation participates in Implementation static build.
- [x] Experiment validation participates in Experiment static build.
- [x] Expanded Algorithm / Atlas / Lab catalog passes typecheck and production build.
- [x] Complete Evidence + Archive discovery + heading-level provenance tranche passes typecheck and production build (GitHub Actions run 118).
- [x] Evidence-profile + citation-provenance + Algorithm/Archive evidence-stage discovery code passes typecheck and production build (GitHub Actions run 153).

## Still needed

- [ ] ESLint/static lint workflow.
- [ ] Content-parser unit tests.
- [ ] Algorithm/Combination/Reference/Implementation/Experiment validation unit tests.
- [ ] Citation graph validation unit tests.
- [ ] Evidence-profile derivation tests.
- [ ] Math-delimiter normalization tests.
- [ ] Heading/TOC slug tests.
- [ ] Search/filter tests.
- [ ] Route smoke tests.
- [ ] Broken-link validation.
- [ ] Markdown/reference validation.
- [ ] Accessibility CI.
- [ ] Screenshot/visual regression tests.
- [ ] Browser acceptance matrix.

---

# Deployment / browser acceptance

- [x] Repository builds as a Next.js application.
- [x] CI confirms the current code implementation builds successfully.
- [ ] Hosting/Vercel project connected for this repository.
- [ ] Preview deployment reviewed.
- [ ] Production deployment reviewed.
- [ ] Public production URL documented.
- [ ] Deployment status linked from README.
- [ ] Real-browser phone/tablet/desktop acceptance.
- [ ] Real-browser light/dark acceptance.

### Current environment limitation

- Vercel account/team access is available, but there is currently no Vercel project linked to this repository.
- The available local execution environment could not resolve `github.com` to clone/serve the repository for browser automation.
- Therefore browser/deployment acceptance remains intentionally open rather than inferred from CI.

---

# Documentation

- [x] `README.md` — research collection and reading map.
- [x] `DESIGN.md` — product/UI rationale.
- [x] `DEVELOPMENT_SPEC.md` — intended product/technical specification.
- [x] `PROGRESS.md` — active implementation tracker.
- [x] `EVIDENCE_AUTHORING.md` — reference/implementation/experiment/provenance authoring contract.
- [x] `EVIDENCE_PROFILE_POLICY.md` — evidence-stage, source-role, and citation-edge policy.
- [ ] General contribution guide.
- [ ] Algorithm metadata authoring guide.
- [ ] Atlas relationship authoring guide.
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
- closed initial Atlas chains for learned search, neural bandits, embedding retrieval, formal solving, coding/QEC, and lattice/PQC/FHE;
- added FHE × MPC × ZK × AI structured hypothesis;
- added Learned Heuristics × A* × Branch-and-Bound structured hypothesis;
- added Combination validation;
- expanded catalog passed TypeScript and production Next.js build in GitHub Actions.

## 2026-09-28 — Evidence tranche 1

- first-class `ReferenceEntity` records with validation and `/references` index/detail routes;
- bidirectional Reference links with Algorithms, Lab hypotheses, and Archive chapters;
- first-class `ImplementationRecord` registry with repository/source-path/license/maturity metadata and validation;
- verified initial implementation repositories/source paths before registry inclusion;
- `/implementations` index/detail routes and Algorithm backlinks;
- `ExperimentRecord` schema with baselines, datasets, metrics, environments, procedure, success criteria, artifacts, result slots, and negative/inconclusive outcome support;
- three initial planned experiment records and `/experiments` index/detail routes;
- Experiment links from Algorithms and Lab hypotheses;
- unified `/evidence` hub;
- global command search across Algorithms, References, Implementations, Experiments, and chapters.

## 2026-09-28 — Discovery / provenance tranche

- primary navigation standardized as Archive / Algorithms / Atlas / Lab / Evidence;
- shared Evidence sub-navigation added;
- Archive state made shareable through URL query parameters;
- Archive family / Algorithm / evidence-availability structural filters added;
- chapter discovery metadata generated from Algorithm and Evidence catalogs;
- Algorithm source provenance now resolves matching Markdown sections through the chapter's live generated TOC;
- Algorithm cards link directly to matching source headings;
- `EVIDENCE_AUTHORING.md` added with evidence-quality and no-fabricated-results rules;
- full tranche passes TypeScript and Next.js production build in GitHub Actions.

## 2026-09-28 — Evidence profile / citation provenance tranche

- added controlled Reference evidence roles;
- added verified source-to-source citation edge records with notes, verification URLs, and checked dates;
- added build validation for duplicate/self/broken citation edges and malformed verification metadata;
- added `/references/graph` focused citation explorer and accessible edge table;
- Reference pages now expose citation neighborhoods and verification provenance;
- added multidimensional Algorithm evidence profiles instead of a scalar quality score;
- added derived evidence stages from concept-only through future independent replication;
- Evidence overview now shows stage coverage distribution;
- Algorithm pages expose evidence stage and independent evidence dimensions;
- Archive supports shareable Algorithm evidence-stage filtering;
- Algorithm index separates conceptual maturity from evidence stage;
- global Algorithm search exposes/matches evidence stage;
- added `EVIDENCE_PROFILE_POLICY.md` and updated evidence authoring contract;
- code checkpoint passes TypeScript and Next.js production build in GitHub Actions run 153.

---

## Immediate next engineering work

1. Add stronger CI checks for route/data/internal-link consistency without duplicating the existing validators.
2. Add passage-level search snippets before semantic retrieval.
3. Expand primary-reference, citation-edge, and implementation coverage through direct verification.
4. Add explicit claim/paragraph provenance where heading-level anchors are insufficient.
5. Add tests for content parsing, search/filter behavior, evidence-profile derivation, citation validation, heading math normalization, and entity validators.
6. Connect this repository to a preview hosting project, then run phone/tablet/desktop and light/dark browser acceptance.
7. Perform keyboard, contrast, screen-reader, table, and math accessibility acceptance.
8. Clean obsolete legacy CSS only after rendered browser review.
9. Run the first reproducible experiment and preserve its outcome, including negative/inconclusive results.
10. Add first-class independent-replication records before allowing any `Replicated` evidence stage.

---

## Maintenance rule

Update this file whenever a meaningful feature, acceptance gate, or phase changes.

- `[x]` — implemented and present in the repository.
- `[ ]` — not yet complete.
- Implementation does **not** imply visual/accessibility/evidence-quality/production acceptance unless that acceptance item is also checked.
