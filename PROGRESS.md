# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-10-01  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)  
**UI audit:** [`UI_AUDIT.md`](./UI_AUDIT.md)  
**Contribution guide:** [`CONTRIBUTING.md`](./CONTRIBUTING.md)  
**Algorithm authoring:** [`ALGORITHM_AUTHORING.md`](./ALGORITHM_AUTHORING.md)  
**Atlas authoring:** [`ATLAS_AUTHORING.md`](./ATLAS_AUTHORING.md)  
**Evidence authoring:** [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md)  
**Evidence profile policy:** [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md)  
**Operations:** [`OPERATIONS.md`](./OPERATIONS.md)

A checked item means the implementation or acceptance gate exists in the repository. Build success, research-evidence quality, automated browser acceptance, manual assistive-technology acceptance, and physical-device acceptance remain distinct.

---

## Current product chain

```text
Research corpus
      ↓
Markdown source of truth
      ↓
Next.js Archive + chapter reader
      ↓
Deterministic passage index
      ↓
Curated Algorithm entities
      ↓
Typed Atlas relationship graph
      ├── source-backed vs conceptual edges
      ├── verified relation provenance
      └── Reference + Implementation evidence neighbors
      ↓
Structured Combination Lab
      ├── curated hypotheses
      └── rule-based arbitrary-pair assumption analysis
      ↓
Unified Evidence hub
      ├── Claims → unique passages + explicit References
      ├── Primary references + verified citation graph
      ├── Commit-pinned implementation registry
      ├── Experiment protocols/results + append-only revision history
      ├── Independent replication/evaluation records
      └── Passage provenance
      ↓
Descriptive evidence profiles + structural/lexical discovery
      ↓
Automated Chromium responsive/theme/a11y/reflow acceptance
      ↓
Retained rendered screenshot review
      ↓
Vercel production deployment
```

---

# Phase overview

| Phase | State |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Archive foundation | ✅ Established |
| 2 — Design system | 🟡 Canonical system + automated/rendered browser acceptance implemented; manual AT/device review remains |
| 3 — Algorithm indexing | 🟡 Strong curated system; breadth can expand |
| 4 — Atlas | 🟡 Typed neighborhood graph, evidence neighbors, URL state, and explicit relation provenance implemented; breadth/history can expand |
| 5 — Lab | 🟡 Structured hypotheses + arbitrary-pair rule-based assumption analysis + first empirical result path implemented; persistence/broader outcomes remain open |
| 6 — Evidence layer | 🟡 Full record architecture + first independent evaluation + first reproducible project result implemented; breadth remains limited |
| 7 — Discovery | 🟡 Structural + deterministic multi-passage lexical discovery implemented; semantic retrieval intentionally deferred |
| 8 — Production acceptance | 🟡 Dedicated Vercel production + automated Chromium acceptance green; manual screen-reader/physical-device review remains |

---

# Phase 0 — Research corpus

## Implemented

- [x] General foundations chapters.
- [x] AI / ML chapters.
- [x] Quantum computing chapters.
- [x] Cybersecurity / cryptography chapters.
- [x] Cross-field combination map.
- [x] Emerging-algorithms watchlist.
- [x] Motivation / Contribution / Implementation framing.
- [x] Combination-research perspective.
- [x] Markdown remains the canonical long-form source.

## Open

- [ ] Standardize primary-reference formatting across every chapter.
- [ ] Add proof/proof-sketch coverage where it materially improves the archive.
- [ ] Expand benchmark/dataset recommendations by family.
- [ ] Continue replacing broad prose with curated Claim records where claim-level provenance matters.

---

# Phase 1 — Archive and reader

## Implemented

- [x] Next.js App Router + TypeScript.
- [x] Titles, summaries, chapter numbers, fields, headings, word counts, reading time, and search text derived from Markdown.
- [x] GitHub-compatible heading slugs including duplicate-heading behavior.
- [x] Render-time math-delimiter normalization outside fenced code.
- [x] Deterministic lexical passage segmentation.
- [x] Content-derived passage IDs and exact Markdown source-line ranges.
- [x] Passage anchors validated against live chapter TOCs.
- [x] `/archive` with URL-backed query, field, family, Algorithm, evidence, evidence-stage, and sort state.
- [x] Back/forward restoration of Archive state.
- [x] Deterministic ranked multi-passage lexical matching with cropped snippets.
- [x] `/archive/[slug]` long-form reader with GFM, KaTeX, tables, code, links, TOC, related chapters, and previous/next navigation.
- [x] Chapter → Algorithm and curated Reference links.
- [x] Algorithm → heading-level chapter provenance.
- [x] Passage-level provenance with stable IDs/source lines.
- [x] Automated phone containment for long math/tables/code.
- [x] Wide technical scrollers remain keyboard reachable.
- [x] Representative 200% text-only reflow remains page-contained.
- [x] Content, filter, passage, heading, and math-processing regression tests.

## Open reader acceptance

- [ ] Manual assistive-technology review of mathematical expression reading.
- [ ] Physical-device stress review for unusually long technical content and browser-level zoom/text scaling.

---

# Phase 2 — Design system and accessibility

## Implemented

- [x] **Fraunces** for editorial hierarchy via `next/font`.
- [x] **Source Sans 3** for UI/body/reading via `next/font`.
- [x] **JetBrains Mono** for code/technical metadata via `next/font`.
- [x] KaTeX preserves mathematical glyph fonts.
- [x] Explicit typography, spacing, radius, color, focus, shell, control-height, and reading-width tokens.
- [x] Neutral warm-light / neutral-dark palettes.
- [x] Research fields neutralized by default; color reserved primarily for semantic state.
- [x] Canonical color and monochrome SVG marks used in product chrome/favicon.
- [x] One canonical global visual/theme authority: `app/research-ui.css`.
- [x] Deprecated glass/minimal/index override layers removed.
- [x] Editorial Research-fields index replaces oversized category cards.
- [x] Shared 42px control system and canonical radii across major surfaces.
- [x] Visible keyboard focus, skip-to-content path, reduced-motion support, and modal focus restoration.
- [x] Mobile navigation expanded/current-page semantics.
- [x] Atlas accessible names/selected state/named relationship regions.
- [x] Metadata contrast protected at ≥4.5:1 in both themes.
- [x] Automated axe WCAG A/AA scans on representative routes in both themes.
- [x] Automated desktop/tablet/phone/narrow light/dark containment matrix.
- [x] Automated 200% text-only reflow checks.
- [x] Automated minimum 24px visible-control target check on phone.
- [x] Representative full-page screenshot artifacts retained and reviewed after major UI changes.
- [x] Generated branded Open Graph/Twitter asset with deployment-aware metadata origin.

## Manual acceptance still open

- [ ] VoiceOver/NVDA checks on representative routes.
- [ ] Screen-reader review of KaTeX/math behavior.
- [ ] Physical-device touch ergonomics/browser chrome/OS font rendering.
- [ ] Physical-device pinch zoom and browser-level text scaling.
- [ ] Favicon-scale visual review on physical browser/device chrome.

---

# Phase 3 — Algorithm indexing

## Implemented

- [x] `AlgorithmEntity` schema and curated catalogs.
- [x] IDs, aliases, fields, families, assumptions, complexity, maturity, implementation guidance, failure modes, tags, and open questions.
- [x] Duplicate/alias/relation/chapter validation.
- [x] `/algorithms` searchable index.
- [x] `/algorithms/[id]` research-card detail routes.
- [x] Incoming/outgoing typed relationships.
- [x] Source chapter and source-section links.
- [x] Reference, Claim, Implementation, Experiment, Replication, and Lab backlinks.
- [x] Multidimensional evidence profile per Algorithm.
- [x] Evidence stage separated from conceptual maturity.
- [x] Independent-replication count shown explicitly, including zero.
- [x] Dedicated Algorithm metadata authoring guide.

## Open

- [ ] Broader curated coverage across all Markdown mechanisms.
- [ ] Explicit first-class variant records where relation-only variants become ambiguous.

---

# Phase 4 — Atlas

## Implemented

- [x] Typed Algorithm relation model with target/self/duplicate validation.
- [x] `/atlas` focused-neighborhood explorer.
- [x] Incoming/outgoing relations and progressive traversal.
- [x] Search, field, relation-type, and relation-evidence filters.
- [x] URL-backed focused node and structural filters with back/forward restoration.
- [x] Accessible textual relationship table.
- [x] Responsive/reflow browser acceptance.
- [x] Cross-field foundation chains across learned search, neural bandits, embedding retrieval, formal solving, QEC, PQC/FHE, MPC/FHE/ZK, and related mechanisms.
- [x] Reference/paper evidence neighbors shown for the focused Algorithm.
- [x] Commit-pinned Implementation evidence neighbors shown for the focused Algorithm.
- [x] First-class relation-provenance registry with Reference IDs, evidence notes, and verification dates.
- [x] Source-backed and conceptual edges remain visibly distinct.
- [x] Relation-provenance validation rejects broken, duplicate, unrelated, or malformed evidence records.
- [x] Relation-provenance coverage utility and Evidence-hub coverage reporting.
- [x] Algorithm and Reference detail pages backlink to relation provenance.
- [x] Browser acceptance covers provenance filters, focused URLs, source-backed/conceptual states, and Reference backlinks.
- [x] Dedicated Atlas relationship authoring guide.

## Open

- [ ] Broader relation density where a mechanism-level edge is justified.
- [ ] Broader source-backed edge coverage through direct Reference verification.
- [ ] Historical/evolution relationships.
- [ ] Manual screen-reader traversal review.

---

# Phase 5 — Combination Lab

## Implemented

- [x] `ResearchCombination` schema and validation.
- [x] `/lab` route.
- [x] Algorithm pair explorer.
- [x] Shared fields/families and direct Atlas relations surfaced.
- [x] Structured hypotheses with compatibility, tensions, expected benefits, risks, metrics, experiment plan, and status.
- [x] Distinction between speculation/research intent and established evidence.
- [x] Lab → Reference and Lab → Experiment links where curated.
- [x] Rule-based assumption compatibility/conflict analysis for arbitrary Algorithm pairs.
- [x] Assumption-analysis output exposes the exact curated assumption text that triggered a rule and states that the signal is not proof.
- [x] Assumption-analysis unit tests include polarity/reversed-direction/no-invented-conflict cases.
- [x] Lab reflow covered at 200% text-only scaling.
- [x] Homepage Lab preview uses uniform neutral research tiles.
- [x] First reproducible project outcome attached to the retrieval + contextual-bandit research direction with explicit limitations.
- [x] Append-only experiment revision/status history with validated protocol/status/artifact/result milestones.

## Open

- [ ] Persist user-authored hypotheses/experiments.
- [ ] Continue attaching real empirical outcomes as experiments are actually run.
- [ ] Rich dataset/benchmark artifact attachments.

---

# Phase 6 — Evidence layer

## Unified Evidence surface

- [x] `/evidence` overview with shared Evidence navigation.
- [x] Separate surfaces for References, Implementations, Experiments, Passages, Claims, and Replications.
- [x] Archive-stage coverage distribution without numeric truth/quality scoring.
- [x] Global command search spans Algorithms, Claims, References, Implementations, Experiments, Replications, and chapters.
- [x] Evidence routes covered by automated axe/responsive/reflow acceptance.

## References and citation provenance

- [x] `ReferenceEntity` schema with controlled evidence roles.
- [x] HTTPS/year/tag/link validation.
- [x] Verified citation-edge model with note, verification URL, and checked date.
- [x] Citation validation rejects broken, duplicate, self-referential, and malformed edges.
- [x] `/references` index/detail routes and `/references/graph` focused citation explorer.
- [x] Reference detail pages expose Claim, Atlas-relation, and independent-replication backlinks.

### Open

- [ ] Broader primary-reference coverage.
- [ ] Broader directly verified citation-graph coverage.
- [ ] Retraction/correction/version metadata where relevant.

## Claims and passage provenance

- [x] `ClaimRecord` model with unique passage selector + explicit supporting References.
- [x] Validation rejects missing/ambiguous passages and broken graph links.
- [x] `/claims` and `/passages` evidence surfaces.
- [x] Initial curated Claims for LinUCB, HNSW, ML-KEM, AdamW, Transformer attention, and selective SSMs.
- [x] Passage search/ranking regression tests.

### Open

- [ ] Expand Claim coverage only where both a unique archive passage and appropriate curated source exist.

## Implementations

- [x] `ImplementationRecord` schema.
- [x] Repository, homepage, Algorithm links, language, interfaces, license, maturity, notes, source paths, ref, commit, and verification date.
- [x] Every implementation source path pinned to its declared full 40-character Git commit.
- [x] Build/test validation rejects floating or mismatched source paths.
- [x] `/implementations` index/detail routes with visible commit/ref provenance.
- [x] Current registry includes HNSW implementations, Qiskit QPE, liboqs ML-KEM, PyTorch AdamW, PyTorch MultiheadAttention, and Z3 SAT/SMT.

### Open

- [ ] Continue expanding implementation coverage through direct upstream verification.
- [ ] Automated freshness/version checks that preserve immutable historical pins.

## Experiments

- [x] `ExperimentRecord` schema with Planned / Running / Completed / Inconclusive / Failed status and Positive / Negative / Mixed / Inconclusive outcomes.
- [x] Baselines, datasets/benchmarks, metrics, environment controls, procedure, success criteria, artifacts, results, and limitations.
- [x] Completed experiments require an inspectable result; negative/inconclusive results remain representable.
- [x] `/experiments` index/detail routes.
- [x] Initial predeclared protocols for selected cross-field hypotheses.
- [x] Experiment validator unit tests.
- [x] First reproducible project result: controlled LinUCB reranking adaptation under preference drift, with committed deterministic simulator and aggregate result artifact.
- [x] CI regenerates and structurally compares the deterministic result artifact before accepting it.
- [x] First-class append-only experiment history registry with revision/date/kind/status/note/artifact metadata.
- [x] History validation enforces contiguous revisions, nondecreasing dates, current status/date agreement, valid artifact labels, and result-event consistency.
- [x] Experiment detail pages expose revision history and browser acceptance verifies the completed pilot timeline.

### Open

- [ ] Add concrete benchmark/data artifacts as studies mature.
- [ ] Persist user-authored experiment updates/results.
- [ ] Broaden empirical coverage beyond the first controlled pilot.

## Independent replications / evaluations

- [x] First-class `ReplicationRecord` model.
- [x] Explicit outcome remains separate from coverage state.
- [x] Independent source must be classified `Replication / evaluation`.
- [x] Original source and independent source must be distinct.
- [x] Algorithm overlap, independence note, and verification date required.
- [x] Independent-evaluation Reference must explicitly cite every original Reference claimed by the record.
- [x] `/replications` index and dedicated `/replications/[id]` detail routes.
- [x] Replication detail routes link independent source, original sources, and affected Algorithms.
- [x] Reference pages backlink to replication records from both the independent-evaluation and original-source directions.
- [x] Algorithm evidence profiles derive `Replicated` only from explicit replication records.
- [x] Replication validation and integration tests.
- [x] First directly verified independent record: ANN-Benchmarks evaluation of HNSW (`Partially supports`).
- [x] HNSW now reaches `Replicated` as a descriptive archive-coverage stage without converting the result into a truth score.
- [x] Replication detail route included in sitemap, production smoke checks, and Playwright provenance acceptance.

### Open

- [ ] Broaden independent replication/evaluation coverage only through direct verification.
- [ ] Add benchmark-quality/statistical-power metadata where it can be represented defensibly.

---

# Phase 7 — Discovery

## Implemented

- [x] Structural Archive filtering by field, Algorithm family, individual Algorithm, evidence availability, and evidence stage.
- [x] Conceptual maturity and evidence stage kept separate.
- [x] Shareable URL-backed Archive state.
- [x] Deterministic ranked multi-passage lexical matching.
- [x] Multiple passage matches per chapter remain inspectable while navigation selects the highest-ranked source unit.
- [x] Global chapter search exposes ranked passage count and source-line context.
- [x] Dedicated `/passages` provenance search.
- [x] Archive-filter and passage-ranking tests.

## Deferred intentionally

- [ ] Semantic/vector retrieval with inspectable source grounding.
- [ ] Related-Algorithm suggestions beyond curated graph structure.
- [ ] Saved research trails/boards.

Semantic retrieval should not be added merely to make search appear sophisticated. Structural and lexical evidence paths must remain inspectable.

---

# Quality, CI, and production

## Implemented

- [x] GitHub Actions on `main` and pull requests.
- [x] Markdown local-link validation and deterministic external-URL/HTTPS policy.
- [x] Application source-hygiene and canonical UI consistency checks.
- [x] Research utility tests covering Algorithms, combinations, assumptions, references/citations, relation provenance, Claims, implementations, experiments, experiment history, replications, evidence stages, Archive filters, passage ranking, content parsing, math/heading processing, theme, and deployment origin.
- [x] TypeScript typecheck and Next.js production build.
- [x] Production-server route smoke tests including dynamic Evidence detail routes.
- [x] Playwright Chromium browser acceptance on the production build.
- [x] Desktop/tablet/phone/narrow × light/dark representative containment matrix.
- [x] Automated axe WCAG A/AA scans.
- [x] Keyboard interaction tests for Search, mobile navigation, skip link, Atlas, and Evidence provenance flows.
- [x] 200% text-only reflow, phone minimum-target, reduced-motion, and technical-overflow checks.
- [x] Representative screenshot artifacts and HTML/test reports retained in CI.
- [x] Dedicated Vercel project connected to this repository.
- [x] Public production alias: `https://foundation-algorithms-collection.vercel.app`.
- [x] Deployment-aware Open Graph/Twitter, robots.txt, sitemap, and metadata origin.

## Open quality gates

- [ ] Manual VoiceOver/NVDA acceptance.
- [ ] Math screen-reader behavior.
- [ ] Physical-device touch ergonomics/browser chrome/OS font rendering.
- [ ] Physical-device pinch zoom and browser-level text scaling.
- [ ] Strict pixel-diff visual baselines only if/when the interface is stable enough to justify their maintenance cost.

---

# Documentation

- [x] `README.md` — collection overview and reading map.
- [x] `DESIGN.md` — product/UI rationale.
- [x] `DEVELOPMENT_SPEC.md` — product/technical specification.
- [x] `PROGRESS.md` — current implementation tracker.
- [x] `UI_AUDIT.md` — canonical UI consistency and acceptance audit.
- [x] `CONTRIBUTING.md` — repository-wide contribution contract.
- [x] `ALGORITHM_AUTHORING.md` — Algorithm metadata guidance.
- [x] `ATLAS_AUTHORING.md` — typed relationship/provenance guidance.
- [x] `EVIDENCE_AUTHORING.md` — evidence authoring contract, including append-only experiment history.
- [x] `EVIDENCE_PROFILE_POLICY.md` — evidence-stage/citation/replication policy.
- [x] `OPERATIONS.md` — CI, deployment, browser, and release operations.

---

# Recent implementation checkpoints

## 2026-10-01 — first reproducible result and experiment history

- accepted the first reproducible project Experiment result for controlled LinUCB reranking adaptation under preference drift;
- preserved the result as `Mixed` with explicit synthetic-simulation, retrieval, real-user, counterfactual, and latency limitations;
- committed the deterministic simulator and aggregate result artifact and made CI regenerate/compare them;
- added first-class append-only experiment revision history with Protocol / Status / Artifact / Result events;
- added validation for revision continuity, chronology, current-state agreement, artifact references, and result milestones;
- exposed revision history on experiment detail pages and covered the completed pilot in Playwright acceptance;
- documented the history authoring contract so future result changes append provenance instead of rewriting it.

## 2026-09-30 — first verified independent evaluation

- curated ANN-Benchmarks as an independently authored evaluation Reference for HNSW;
- linked it explicitly to the original Malkov/Yashunin HNSW source with verified citation metadata;
- added `aumuller-2020-hnsw-evaluation` with conservative `Partially supports` outcome;
- strengthened validation so every replication/evaluation source must explicitly cite every original source named by its record;
- added `/replications/[id]` inspectable detail pages;
- added independent/original source backlinks on Reference pages;
- added sitemap, smoke-test, unit/integration, and Playwright acceptance coverage;
- HNSW now reaches `Replicated` as a descriptive evidence-coverage stage, not a scientific truth score.

## 2026-09-30 — Atlas provenance and Lab assumption analysis

- first-class Atlas relation-provenance records added with Reference IDs, evidence notes, and verification dates;
- source-backed versus conceptual Atlas edges made filterable and visible;
- provenance coverage exposed in Evidence and on Algorithm/Reference pages;
- Atlas state made URL-restorable for focused node and structural filters;
- Reference and commit-pinned Implementation evidence neighbors added to Atlas;
- arbitrary Algorithm pairs in Lab now receive transparent rule-based assumption-compatibility/tension analysis with exact triggering assumption text and explicit non-proof caveats.

## 2026-09-30 — rendered UI acceptance and consistency hardening

- canonical neutral research UI retained around one final visual layer;
- Fraunces / Source Sans 3 / JetBrains Mono role system preserved across routes;
- keyboard skip path, reflow, target-size, reduced-motion, responsive/theme and axe acceptance automated;
- retained visual review corrected homepage field/index, Combination Lab, and Evidence-flow inconsistencies;
- Playwright browser acceptance, production route smoke tests, and matching Vercel production deployment established.

## 2026-09-29 — Evidence integrity, discovery, and release hardening

- immutable implementation commit pinning and UI provenance;
- curated Claim model and initial passage/reference-backed Claims;
- evidence-stage derivation and graph-record validation tests;
- deterministic multi-passage lexical ranking and Archive/global-search integration;
- first-class independent-replication architecture and zero-state policy;
- pinned PyTorch AdamW/MultiheadAttention and Z3 SAT/SMT implementations;
- global modal focus containment/return-focus behavior;
- contribution/authoring/operations guides;
- generated social metadata, public-origin resolution, robots/sitemap metadata and smoke coverage.

Earlier implementation detail remains preserved in Git history and the specification/design documents; this tracker intentionally reflects current state rather than duplicating every historical commit.

---

# Immediate next work

1. Complete manual VoiceOver/NVDA and math screen-reader acceptance on representative routes.
2. Perform physical-device phone/tablet checks for touch ergonomics, browser chrome, OS font rendering, pinch zoom, and browser-level text scaling.
3. Continue conservative primary Reference, Claim, citation-edge, relation-provenance, and commit-pinned Implementation coverage through direct verification.
4. Broaden independent evaluation/replication coverage only where independence and the original-source link can be directly verified.
5. Expand reproducible project Experiments beyond the first controlled pilot and attach concrete benchmark/data artifacts where the study design supports them.
6. Expand Algorithm/Atlas mechanism coverage where the research corpus supports a justified first-class entity or edge.
7. Add semantic retrieval only after it can preserve inspectable provenance and outperform the deterministic structural/lexical baseline.
8. Introduce strict pixel-diff visual baselines only if the reviewed visual system becomes stable enough that the maintenance cost is justified.

---

## Maintenance rule

Update this tracker whenever a meaningful feature, acceptance gate, or blocker changes.

- `[x]` — implementation or acceptance gate exists and has passed its defined check.
- `[ ]` — not complete or not yet accepted.
- Build success does **not** imply research-evidence quality or manual assistive-technology/device acceptance.