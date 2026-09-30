# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-09-30  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)  
**UI audit:** [`UI_AUDIT.md`](./UI_AUDIT.md)  
**Contribution guide:** [`CONTRIBUTING.md`](./CONTRIBUTING.md)  
**Algorithm authoring:** [`ALGORITHM_AUTHORING.md`](./ALGORITHM_AUTHORING.md)  
**Atlas authoring:** [`ATLAS_AUTHORING.md`](./ATLAS_AUTHORING.md)  
**Evidence authoring:** [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md)  
**Evidence profile policy:** [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md)  
**Operations:** [`OPERATIONS.md`](./OPERATIONS.md)

A checked item means the implementation or acceptance gate exists in the repository. Build success, research-evidence quality, automated browser acceptance, manual assistive-technology acceptance, and production acceptance remain distinct.

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
      ↓
Structured Combination Lab
      ↓
Unified Evidence hub
      ├── Claims → unique passages + explicit References
      ├── Primary references + verified citation graph
      ├── Commit-pinned implementation registry
      ├── Experiment protocols/results
      ├── Independent replication/evaluation records
      └── Passage provenance
      ↓
Descriptive evidence profiles + structural/lexical discovery
      ↓
Automated Chromium responsive/theme/a11y acceptance
      ↓
Vercel production deployment
```

---

# Phase overview

| Phase | State |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Archive foundation | ✅ Established |
| 2 — Design system | 🟡 Canonical system + automated browser acceptance implemented; manual AT/device review remains |
| 3 — Algorithm indexing | 🟡 Strong curated first system; breadth can expand |
| 4 — Atlas | 🟡 Working typed-neighborhood graph; edge provenance remains open |
| 5 — Lab | 🟡 Structured hypotheses/protocol links implemented; persistence/results open |
| 6 — Evidence layer | 🟡 Full record architecture implemented; breadth and real empirical outcomes remain limited |
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

## Content pipeline

- [x] Next.js App Router + TypeScript.
- [x] Titles, summaries, chapter numbers, fields, headings, word counts, reading time, and search text derived from Markdown.
- [x] GitHub-compatible heading slugs including duplicate-heading behavior.
- [x] Render-time math-delimiter normalization outside fenced code.
- [x] Deterministic lexical passage segmentation.
- [x] Content-derived passage IDs.
- [x] Exact Markdown source-line ranges per passage.
- [x] Passage anchors validated against live chapter TOCs.
- [x] Content-summary/passage-segmentation regression tests.

## Archive

- [x] `/archive` route.
- [x] URL-backed query, field, family, Algorithm, evidence-availability, evidence-stage, and sort state.
- [x] Back/forward restoration of Archive state.
- [x] Field/family/Algorithm/evidence/stage filters.
- [x] Dedicated structural-filter/sort unit tests.
- [x] Deterministic multi-passage lexical ranking.
- [x] Top ranked passage navigation and cropped search snippets.
- [x] Multiple matching passages surfaced instead of silently treating the first source paragraph as definitive.

## Chapter reader

- [x] Dynamic `/archive/[slug]` route.
- [x] GFM Markdown rendering.
- [x] Generated/current-section TOC.
- [x] KaTeX mathematics.
- [x] Research tables, code, links, lists, and blockquotes.
- [x] Related chapters and previous/next navigation.
- [x] Chapter → Algorithm links.
- [x] Chapter → curated Reference links.
- [x] Algorithm → heading-level chapter provenance.
- [x] Passage-level provenance with stable IDs and source lines.
- [x] Automated phone containment check for long math/tables/code.
- [x] Wide technical scrollers remain keyboard reachable.

## Open reader acceptance

- [ ] Manual assistive-technology review of mathematical expression reading.
- [ ] Physical-device stress review for unusually long technical content and text scaling.

---

# Phase 2 — Design system and accessibility

## Implemented

- [x] **Fraunces** for editorial hierarchy via `next/font`.
- [x] **Source Sans 3** for UI/body/reading via `next/font`.
- [x] **JetBrains Mono** for code/technical metadata via `next/font`.
- [x] KaTeX preserves its own mathematical glyph fonts.
- [x] Explicit typography, spacing, radius, color, focus, shell, control-height, and reading-width tokens.
- [x] Neutral warm-light / neutral-dark palettes.
- [x] Research fields neutralized by default; color reserved primarily for semantic state.
- [x] Canonical color and monochrome SVG marks.
- [x] SVG mark used in product chrome/favicon.
- [x] One canonical global visual/theme authority: `app/research-ui.css`.
- [x] Deprecated glass/minimal/index visual override layers removed.
- [x] Editorial Research-fields index replaces oversized category cards.
- [x] Research-fields index remains single-column through the tablet band.
- [x] Shared 42px control system and canonical radii across major surfaces.
- [x] Visible `:focus-visible` styling.
- [x] Reduced-motion behavior.
- [x] Primary navigation: Archive / Algorithms / Atlas / Lab / Evidence.
- [x] Shared Evidence sub-navigation including Claims and Replications.
- [x] Command-palette modal focus containment and previous-focus restoration.
- [x] Background scroll locked while modal dialogs are active.
- [x] Mobile navigation expanded/current-page semantics.
- [x] Atlas explicit accessible names/selected state/named relationship regions.
- [x] Metadata contrast protected at ≥4.5:1 by `check:ui` in both themes.
- [x] Automated axe WCAG A/AA scans on representative routes in both themes.
- [x] Automated desktop/tablet/phone light/dark containment matrix.
- [x] Representative full-page screenshot artifacts generated in CI.
- [x] Generated branded Open Graph image.
- [x] Twitter/X image route reuses the same branded social asset.
- [x] Open Graph/Twitter metadata uses the deployed site origin rather than the GitHub repository URL.

## Manual acceptance still open

- [ ] VoiceOver/NVDA checks on representative routes.
- [ ] Screen-reader review of KaTeX/math behavior.
- [ ] Physical-device touch/zoom/text-scaling checks.
- [ ] Manual aesthetic review of retained browser snapshots for major design changes.
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

- [x] Typed Algorithm relation model.
- [x] Relation target/self/duplicate validation.
- [x] `/atlas` focused-neighborhood explorer.
- [x] Incoming/outgoing relations.
- [x] Progressive traversal by selecting neighbors.
- [x] Search, field filtering, and relation-type filtering.
- [x] Accessible textual relationship table.
- [x] Explicit accessible search naming, selected entity state, and named relationship regions.
- [x] Responsive phone/tablet/desktop containment covered in Chromium.
- [x] Cross-field foundation chains for learned search, neural bandits, embedding retrieval, formal solving, coding/QEC, lattices/PQC/FHE, MPC/FHE/ZK, and related mechanisms.
- [x] Dedicated Atlas relationship authoring guide.

## Open

- [ ] Broader relation density where a mechanism-level edge is justified.
- [ ] Reference/paper nodes inside Atlas itself.
- [ ] Implementation nodes inside Atlas itself.
- [ ] Explicit evidence/provenance metadata on Algorithm relation edges.
- [ ] Historical/evolution relationships.
- [ ] Manual screen-reader traversal review.

---

# Phase 5 — Combination Lab

## Implemented

- [x] `ResearchCombination` schema.
- [x] Validation of components, chapter links, required research fields, and experiment-plan structure.
- [x] `/lab` route.
- [x] Algorithm pair explorer.
- [x] Shared fields/families and direct Atlas relations surfaced.
- [x] Structured hypotheses with compatibility, tensions, expected benefits, risks, metrics, experiment plan, and status.
- [x] Distinction between speculation/research intent and established evidence.
- [x] Lab → Reference and Lab → Experiment links where curated.

## Open

- [ ] Persist user-authored hypotheses/experiments.
- [ ] Automatic assumption-conflict analysis for arbitrary pairs.
- [ ] Attach real empirical outcomes as experiments are actually run.
- [ ] Rich dataset/benchmark artifact attachments.
- [ ] Experiment revision/status history.

---

# Phase 6 — Evidence layer

## Unified Evidence surface

- [x] `/evidence` overview.
- [x] Separate surfaces for References, Implementations, Experiments, Passages, Claims, and Replications.
- [x] Shared Evidence navigation.
- [x] Archive-stage coverage distribution without numeric truth/quality scoring.
- [x] Global command search spans Algorithms, Claims, References, Implementations, Experiments, Replications, and chapters.
- [x] Evidence representative route covered by automated axe and responsive/theme acceptance.

## References

- [x] `ReferenceEntity` schema.
- [x] Controlled evidence roles: Primary method / Primary extension / Normative standard / Survey-synthesis / Replication-evaluation.
- [x] HTTPS/year/tag/link validation.
- [x] Verified citation-edge model with note, verification URL, and checked date.
- [x] Citation validation rejects broken, duplicate, self-referential, and malformed edges.
- [x] `/references` index and detail routes.
- [x] `/references/graph` focused citation explorer.
- [x] Citation-edge unit tests.

### Open

- [ ] Broader primary-reference coverage.
- [ ] Broader directly verified citation-graph coverage.
- [ ] Retraction/correction/version metadata where relevant.

## Claims and passage provenance

- [x] `ClaimRecord` model.
- [x] Claim → exactly one passage selector contract.
- [x] Claim → one or more explicit supporting References.
- [x] Claim validation rejects missing/ambiguous passages and broken graph links.
- [x] `/claims` evidence surface.
- [x] Initial curated Claims for LinUCB, HNSW, ML-KEM, AdamW, Transformer attention, and selective SSMs.
- [x] `/passages` source-provenance index.
- [x] Passage search/ranking regression tests.

### Open

- [ ] Expand Claim coverage only where both a unique archive passage and appropriate curated source exist.

## Implementations

- [x] `ImplementationRecord` schema.
- [x] Repository, homepage, Algorithm links, language, interfaces, license, maturity, notes, source paths, ref, commit, and verification date.
- [x] Every implementation source path pinned to its declared full 40-character Git commit.
- [x] Build/test validation rejects floating or mismatched source paths.
- [x] `/implementations` index and detail routes.
- [x] Commit/ref provenance visible in UI.
- [x] Current curated registry includes HNSW implementations, Qiskit QPE, liboqs ML-KEM, PyTorch AdamW, PyTorch MultiheadAttention, and Z3 SAT/SMT.

### Open

- [ ] Continue expanding implementation coverage through direct upstream verification.
- [ ] Automated freshness/version checks that preserve immutable historical pins.

## Experiments

- [x] `ExperimentRecord` schema.
- [x] Planned / Running / Completed / Inconclusive / Failed status model.
- [x] Positive / Negative / Mixed / Inconclusive outcome model.
- [x] Baselines, datasets/benchmarks, metrics, environment controls, procedure, success criteria, artifacts, results, and limitations.
- [x] Completed experiments require a result.
- [x] Negative/inconclusive studies remain representable.
- [x] `/experiments` index/detail routes.
- [x] Initial predeclared protocols for selected cross-field hypotheses.
- [x] Experiment validator unit tests.

### Open

- [ ] Run and attach the first real empirical result.
- [ ] Add concrete benchmark/data artifacts as studies mature.
- [ ] Persist user-authored experiment updates/results.

## Independent replications

- [x] First-class `ReplicationRecord` model.
- [x] Explicit outcome separate from coverage state.
- [x] Source must be classified `Replication / evaluation`.
- [x] Original source and independent evaluation source must be distinct.
- [x] Algorithm overlap, independence note, and verification date required.
- [x] `/replications` Evidence route with an honest zero-record state.
- [x] Algorithm evidence profiles derive `Replicated` only from explicit replication records.
- [x] Replication validation unit tests.
- [x] No fabricated seed replication records.

### Open

- [ ] Curate the first independent replication only after directly verifying a genuinely independent evaluation source.

---

# Phase 7 — Discovery

## Implemented

- [x] Structural Archive filtering by field, Algorithm family, individual Algorithm, evidence availability, and evidence stage.
- [x] Conceptual maturity and evidence stage kept separate on Algorithm discovery.
- [x] Shareable URL-backed Archive state.
- [x] Deterministic ranked multi-passage lexical matching.
- [x] Multiple passage matches per chapter can remain inspectable while navigation selects the highest-ranked source unit.
- [x] Global chapter search exposes ranked passage count and source-line context.
- [x] Dedicated `/passages` provenance search.
- [x] Archive-filter unit tests.
- [x] Passage-ranking unit tests.

## Deferred intentionally

- [ ] Semantic/vector retrieval with inspectable source grounding.
- [ ] Related-Algorithm suggestions beyond curated graph structure.
- [ ] Saved research trails/boards.

Semantic retrieval should not be added merely to make search appear sophisticated. Structural and lexical evidence paths must remain inspectable.

---

# Quality and CI

## Implemented

- [x] GitHub Actions workflow on `main` and pull requests.
- [x] Markdown local-link validation.
- [x] Deterministic external-URL/HTTPS policy without third-party network dependency.
- [x] Dependency-free application source-hygiene check.
- [x] Canonical UI consistency/source-regression check.
- [x] Research utility test suite.
- [x] TypeScript typecheck.
- [x] Next.js production build.
- [x] Production-server route smoke tests.
- [x] `robots.txt` and `sitemap.xml` included in production smoke coverage.
- [x] Algorithm validation tests.
- [x] Combination validation tests.
- [x] Reference/citation validation tests.
- [x] Claim provenance tests.
- [x] Implementation pinning/validation tests.
- [x] Experiment validation tests.
- [x] Replication validation tests.
- [x] Evidence-stage derivation tests.
- [x] Heading/TOC slug tests.
- [x] Math-delimiter normalization tests.
- [x] Archive structural-filter tests.
- [x] Content-summary/passage-segmentation tests.
- [x] Passage ranking/snippet tests.
- [x] Deployment-origin metadata resolution tests.
- [x] Playwright Chromium browser acceptance on production build.
- [x] Desktop/tablet/phone × light/dark representative containment matrix.
- [x] Automated axe WCAG A/AA scans.
- [x] Keyboard interaction tests for search and mobile navigation.
- [x] Technical overflow/keyboard-reachability acceptance for long-form content.
- [x] Exact overflow-offender diagnostics on failure.
- [x] Representative full-page screenshot artifacts.
- [x] Playwright HTML report + `test-results` retained for 14 days on every CI run.

## Open quality gates

- [ ] Full ESLint rule set if/when added deliberately and pinned.
- [ ] Manual VoiceOver/NVDA acceptance.
- [ ] Physical-device acceptance.
- [ ] Strict pixel-diff visual baselines only if/when the UI becomes stable enough to justify them.

---

# Deployment and browser acceptance

## Implemented

- [x] Dedicated Vercel project connected to this repository.
- [x] Production Vercel deployment pipeline from `main`.
- [x] Public production alias: `https://foundation-algorithms-collection.vercel.app`.
- [x] Repository builds as a production Next.js application.
- [x] CI starts the production server and smoke-tests representative routes.
- [x] Deployment/acceptance procedure documented in [`OPERATIONS.md`](./OPERATIONS.md).
- [x] Metadata origin resolves from explicit configuration or Vercel production/preview environment.
- [x] Generated Open Graph and Twitter/X social previews.
- [x] Deployment-aware `robots.txt`.
- [x] Deployment-aware sitemap covering static and curated detail routes.
- [x] Automated real-Chromium desktop/tablet/phone acceptance.
- [x] Automated real-Chromium light/dark acceptance.
- [x] Automated command-palette and mobile-navigation keyboard acceptance.
- [x] Automated axe representative-route WCAG scan.
- [x] Vercel deployment/runtime status inspectable through project tooling.

## Manual acceptance still open

- [ ] VoiceOver/NVDA walkthrough.
- [ ] Math screen-reader behavior.
- [ ] Physical-device touch ergonomics/browser chrome/OS font rendering.
- [ ] Physical-device zoom/text scaling.
- [ ] Manual review of visual screenshot artifacts for major design releases.

Automated Playwright browser acceptance is now a required engineering gate. It should not be described as equivalent to manual assistive-technology or physical-device acceptance.

---

# Documentation

- [x] `README.md` — collection overview and reading map.
- [x] `DESIGN.md` — product/UI rationale.
- [x] `DEVELOPMENT_SPEC.md` — product/technical specification.
- [x] `PROGRESS.md` — current implementation tracker.
- [x] `UI_AUDIT.md` — canonical UI consistency and acceptance audit.
- [x] `CONTRIBUTING.md` — repository-wide contribution contract.
- [x] `ALGORITHM_AUTHORING.md` — Algorithm metadata guidance.
- [x] `ATLAS_AUTHORING.md` — typed relationship guidance.
- [x] `EVIDENCE_AUTHORING.md` — evidence authoring contract.
- [x] `EVIDENCE_PROFILE_POLICY.md` — evidence-stage/citation/replication policy.
- [x] `OPERATIONS.md` — CI, deployment, browser, and release operations.

---

# Recent implementation checkpoints

## 2026-09-30 — UI consistency and browser acceptance

- canonical research UI consolidated around neutral surfaces and a single final visual layer;
- Fraunces / Source Sans 3 / JetBrains Mono role system standardized across routes;
- oversized Research-field cards replaced by editorial index rows;
- header/theme/Atlas accessibility semantics hardened;
- small metadata contrast raised and guarded at WCAG AA ratio;
- long math/table/code overflow contained locally;
- Playwright + Chromium + axe browser acceptance added to CI;
- real tablet regression found by the new suite: legacy Research-fields two-column grid widened the homepage to 1102px at 820px viewport;
- exact overflow offender diagnostics added;
- tablet Research-fields index corrected to single-column and guarded statically;
- **58 functional/accessibility Chromium tests pass** after the fix;
- 12 representative full-page visual snapshots added to the acceptance suite;
- CI browser artifacts retained for 14 days.

## 2026-09-29 — Evidence integrity, discovery, and release hardening

- immutable implementation commit pinning and UI provenance;
- curated Claim model and six initial passage/reference-backed Claims;
- evidence-stage derivation tests;
- Algorithm/Combination/Reference/Implementation/Experiment validation tests;
- heading/math processing tests;
- deterministic multi-passage lexical ranking and Archive/global-search integration;
- Archive structural-filter tests;
- static external-link policy and application source-hygiene CI gate;
- first-class independent-replication model, validator, Evidence route, search integration, and Algorithm transparency;
- content summary/passage segmentation regression tests;
- pinned PyTorch AdamW and MultiheadAttention implementations;
- pinned Z3 SAT/SMT implementation;
- global modal focus containment/return-focus behavior;
- contribution, Algorithm-authoring, Atlas-authoring, and operations guides;
- generated Open Graph/Twitter social preview;
- environment-aware public metadata origin;
- deployment-aware robots/sitemap metadata and smoke coverage.

Earlier implementation detail remains preserved in Git history and the specification/design documents; this tracker intentionally reflects current state rather than duplicating every historical commit.

---

# Immediate next work

1. Complete manual VoiceOver/NVDA and math screen-reader acceptance on representative routes.
2. Perform physical-device phone/tablet checks for touch ergonomics, browser chrome, zoom and text scaling.
3. Review retained visual screenshot artifacts for major design changes and only introduce pixel-diff baselines once the UI is stable enough.
4. Continue conservative primary Reference, Claim, citation-edge, and commit-pinned Implementation coverage through direct verification.
5. Add relation-edge provenance if Atlas relationships need to support source-level claims.
6. Run the first reproducible project Experiment and preserve the real outcome, including negative/mixed/inconclusive results.
7. Curate independent replication records only when genuinely independent evaluation sources are directly verified.
8. Add semantic retrieval only after it can preserve inspectable provenance and outperform the deterministic structural/lexical baseline.

---

## Maintenance rule

Update this tracker whenever a meaningful feature, acceptance gate, or blocker changes.

- `[x]` — implementation or acceptance gate exists and has passed its defined check.
- `[ ]` — not complete or not yet accepted.
- Build success does **not** imply research-evidence quality or manual assistive-technology/device acceptance.
