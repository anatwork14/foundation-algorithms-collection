# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-10-03  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)  
**UI audit:** [`UI_AUDIT.md`](./UI_AUDIT.md)  
**Contribution guide:** [`CONTRIBUTING.md`](./CONTRIBUTING.md)  
**Algorithm authoring:** [`ALGORITHM_AUTHORING.md`](./ALGORITHM_AUTHORING.md)  
**Atlas authoring:** [`ATLAS_AUTHORING.md`](./ATLAS_AUTHORING.md)  
**Evidence authoring:** [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md)  
**Evidence policy:** [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md)  
**Operations:** [`OPERATIONS.md`](./OPERATIONS.md)

This file tracks the **current state**, not a full changelog. A checked item means the implementation or automated acceptance gate exists in the repository. Manual assistive-technology and physical-device acceptance remain separate from automated browser acceptance.

---

## Current product chain

```text
Markdown research corpus
        ↓
Archive + long-form reader
        ↓
Complete deterministic passage provenance
        ↓
Curated Algorithm entities
        ↓
Typed Atlas relationship graph
        ↓
Combination Lab
        ↓
Evidence
  ├── 23 curated passage-backed Claims
  ├── 23 curated References + citation graph
  ├── 13 commit-pinned Implementation records + append-only verification history
  ├── Experiments + append-only history
  ├── 2 independent Replication/Evaluation records
  ├── Evidence Gaps
  └── Passages
        ↓
Structural + ranked lexical discovery
        ↓
112 research/unit tests
        ↓
143 Chromium UI/accessibility/reflow tests
        ↓
Production build + route smoke
        ↓
Vercel production
```

---

# Phase overview

| Phase | State |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Archive foundation | ✅ Established |
| 2 — Design system & accessibility | 🟡 Canonical system + automated browser acceptance; manual AT/device review remains |
| 3 — Algorithm indexing | 🟡 Strong curated system; breadth can expand |
| 4 — Atlas | 🟡 Typed/evidence-aware graph implemented; provenance density can expand |
| 5 — Lab | 🟡 Structured hypotheses + assumption analysis + empirical result paths implemented |
| 6 — Evidence | 🟡 Full record architecture + curated evidence; breadth can expand |
| 7 — Discovery | 🟡 Structural + deterministic ranked lexical retrieval implemented; semantic retrieval deferred |
| 8 — Production acceptance | ✅ CI/browser/build/deployment infrastructure established |

---

# Phase 0 — Research corpus

## Implemented

- [x] Foundations chapters.
- [x] AI / ML chapters.
- [x] Quantum computing chapters.
- [x] Cybersecurity / cryptography chapters.
- [x] Cross-field combination map and emerging-algorithms watchlist.
- [x] Motivation / Contribution / Implementation framing.
- [x] Markdown remains the canonical long-form research source.

## Open

- [ ] Standardize primary-reference formatting across every chapter.
- [ ] Add proof/proof-sketch coverage where useful.
- [ ] Expand benchmark/dataset recommendations by family.
- [ ] Continue converting provenance-sensitive prose into curated Claim records.

---

# Phase 1 — Archive and reader

## Implemented

- [x] Next.js App Router + TypeScript.
- [x] Markdown-derived metadata, headings, word count, reading time, and search text.
- [x] GitHub-compatible heading slugs including duplicates.
- [x] GFM + KaTeX + tables + code + TOC + related/previous/next navigation.
- [x] Deterministic passages with stable IDs and exact Markdown source-line ranges.
- [x] Complete passage indexing across long chapters; no fixed first-N truncation.
- [x] Live-catalog regression test proving every curated Claim resolves to exactly one real passage.
- [x] Ranked multi-passage lexical matching with cropped snippets and heading anchors.
- [x] URL-backed Archive query/field/family/Algorithm/evidence/stage/sort state.
- [x] Chapter ↔ Algorithm / Reference provenance links.
- [x] Local scrolling and keyboard reachability for long math, wide tables, and code.
- [x] 200% text-only reflow and narrow-screen containment automation.

## Open manual reader acceptance

- [ ] VoiceOver/NVDA pronunciation review for mathematics.
- [ ] Physical-device stress review for unusually long technical content and browser zoom/text scaling.

---

# Phase 2 — Design system and accessibility

## Implemented

- [x] Fraunces editorial hierarchy.
- [x] Source Sans 3 UI/body/reading.
- [x] JetBrains Mono technical metadata/code.
- [x] KaTeX mathematical fonts.
- [x] Neutral warm-light / neutral-dark persisted theme.
- [x] Canonical SVG logo + monochrome mark.
- [x] `app/research-ui.css` is the single global visual authority.
- [x] Deprecated glass/minimal/index override layers removed.
- [x] Editorial research indexes replace oversized dashboard-card walls where comparison/scanning is the task.
- [x] Shared geometry, surfaces, spacing, focus, and responsive behavior across major routes.
- [x] Skip link, visible focus, reduced motion, modal focus containment/return, accessible mobile nav.
- [x] Command palette keyboard acceleration and live result announcements.
- [x] Atlas selection/region semantics and keyboard traversal.
- [x] CI-enforced metadata contrast ≥ 4.5:1 in both themes.
- [x] Axe WCAG A/AA representative scans.
- [x] Desktop/tablet/phone/narrow responsive matrix in light and dark.
- [x] 200% text-only reflow checks.
- [x] Coarse-pointer/touch acceptance and minimum visible target checks.
- [x] Retained screenshot artifacts for visual review.

## Open manual acceptance

- [ ] VoiceOver/NVDA walkthrough on representative routes.
- [ ] Real screen-reader evaluation of mathematical pronunciation/verbosity.
- [ ] Physical-device phone/tablet touch ergonomics and browser chrome.
- [ ] Physical-device OS font rendering, favicon-scale review, pinch zoom, and text scaling.

---

# Phase 3 — Algorithm indexing

## Implemented

- [x] Curated `AlgorithmEntity` schema/catalogs.
- [x] IDs, aliases, fields, families, assumptions, complexity, maturity, guidance, failure modes, tags, open questions.
- [x] Duplicate/alias/relation/chapter validation.
- [x] Searchable `/algorithms` + detail routes.
- [x] Incoming/outgoing typed relationships and source-section links.
- [x] Reference, Claim, Implementation, Experiment, Replication, and Lab backlinks.
- [x] Multidimensional evidence profile separated from conceptual maturity.
- [x] Kalman Filter promoted from chapter-only coverage into a first-class Algorithm entity with assumptions, failure modes, implementation guidance, and open questions.

## Open

- [ ] Broader curated mechanism coverage.
- [ ] First-class variant records where relation-only variants become ambiguous.

---

# Phase 4 — Atlas

## Implemented

- [x] Typed relationship graph with validation.
- [x] Focused-neighborhood Atlas explorer.
- [x] Search + field + relation-type + evidence filters.
- [x] URL-restorable Atlas state.
- [x] Reference and commit-pinned Implementation neighbors.
- [x] First-class relation-provenance records.
- [x] **16 source-backed relation records** currently curated, alongside conceptual-only edges.
- [x] Source-backed coverage includes LinUCB/UCB, Thompson/Bayesian/UCB alternatives, NeuralUCB/LinUCB, embeddings/HNSW, embeddings/Transformer attention, lattice/ML-KEM, QSVT/QPE, SSM/Transformer, the bidirectional A*/Dijkstra relation, both directions of the Q-learning/Dynamic Programming Bellman lineage, and both directions of the Bayesian-Inference/Bayesian-Optimization surrogate lineage.
- [x] Conceptual vs source-backed edges remain distinct.
- [x] Accessible table/regions/selection + keyboard picker.

## Open

- [ ] Broader justified relation density.
- [ ] Broader source-backed relation coverage.
- [ ] Historical/evolution relations.
- [ ] Manual screen-reader traversal review.

---

# Phase 5 — Combination Lab

## Implemented

- [x] Structured `ResearchCombination` records.
- [x] Arbitrary Algorithm pair explorer.
- [x] Rule-based assumption compatibility/tension analysis with explicit non-proof caveat.
- [x] Structured hypotheses, benefits, risks, metrics, experiment plans, status.
- [x] Reference / Experiment links.
- [x] Reproducible HNSW + LinUCB reranking drift pilot with committed manifest/result artifact.
- [x] Reproducible LinUCB mutation-scheduler drift pilot with committed manifest/result artifact.
- [x] Append-only experiment revision history.

## Open

- [ ] Persist user-authored hypotheses/experiments.
- [ ] Attach more real-target empirical outcomes as studies run.
- [ ] Add richer benchmark/data artifacts where justified.

---

# Phase 6 — Evidence

## Implemented

- [x] Unified Evidence overview/navigation + Evidence Gaps.
- [x] References, Implementations, Experiments, Passages, Claims, Replications as separate record surfaces.
- [x] Controlled Reference evidence roles, citation edges, and lifecycle notices.
- [x] Claim → exactly one passage → explicit Reference provenance contract.
- [x] **23 curated passage-backed Claims** across classical search, bandits, ANN, optimization, Transformers/SSMs, PQC, quantum algorithms, reinforcement learning, state estimation, differential privacy, conformal prediction, and NeuralUCB.
- [x] **23 curated References**, including primary Grover search, Q-learning, Kalman-filter, Land–Doig branch-and-bound, and Jones–Schonlau–Welch efficient-global-optimization sources added on 2026-10-03.
- [x] Live Claim-catalog test validates every Claim against the real Markdown corpus before build.
- [x] Commit-pinned Implementation registry with immutable source URLs and append-only verification history.
- [x] **13 implementation records** currently registered: Faiss HNSW, hnswlib, Qiskit QPE, Qiskit Algorithms VQE/QAOA/Grover, liboqs ML-KEM, PyTorch AdamW, PyTorch MultiheadAttention, Z3 SAT/SMT, NetworkX A*/Dijkstra, statsmodels Kalman Filter, IBM diffprivlib Laplace, Qiskit QFT, and BoTorch Bayesian Optimization.
- [x] Qiskit Algorithms is pinned to directly inspected commit `bcb7ded3594dac02e14acce7f59f05976916d39d`; verification revision 2 expands that immutable snapshot from VQE/QAOA to include the inspected Grover amplitude-amplifier source without pretending the upstream commit moved.
- [x] statsmodels Kalman Filter is pinned to directly inspected commit `cc001c25997351ecbd0b04d2968a08106a04a71f`, including the state-space filter source and repository license, with revision-1 verification history.
- [x] IBM diffprivlib Laplace is pinned to `f9a37dd74b18108d46a421e66321635a3d774eab`, directly connecting the archive's Dwork sensitivity-calibration claim to executable epsilon/delta/sensitivity-aware code.
- [x] Qiskit QFT is pinned to `a1c2c2e796ff265c59a916c49d09942b27eb0e28`, with the registry explicitly steering future readers toward `QFTGate`/synthesis rather than the deprecated BlueprintCircuit wrapper.
- [x] BoTorch Bayesian Optimization is pinned to `bda063ae5c6d2bbe058a7d1566818ae2e14a673e`, with directly inspected posterior-based Probability/Expected/Log Expected Improvement acquisition code and MIT licensing.
- [x] Grover search, Kalman Filter, differential privacy, and Bayesian Optimization now have increasingly complete source/code evidence ladders; Branch-and-Bound has its foundational Land–Doig method source curated.
- [x] Q-learning has an explicit passage-backed Claim tied to its primary source and its Bellman/Dynamic-Programming lineage source-backed in Atlas.
- [x] Experiment model with protocol/result/limitations/artifacts + append-only history.
- [x] CI regenerates and compares committed deterministic experiment artifacts.
- [x] **2 independent Replication/Evaluation records**: ANN-Benchmarks/HNSW and Chapelle–Li/Thompson Sampling.
- [x] Evidence stage remains descriptive coverage, never a truth score.

## Implementation freshness policy

- Each Implementation record points to an immutable 40-character commit and exact source paths.
- Append-only verification history must match the current registry snapshot.
- CI reports whether the tracked upstream branch has moved.
- Upstream movement is a review signal, never permission to auto-advance the archive pin.

## Open

- [ ] Broader primary-reference and curated Claim coverage.
- [ ] Broader citation/relation-provenance coverage.
- [ ] Broader commit-pinned implementation coverage.
- [ ] Broader independent replication/evaluation coverage.
- [ ] More real-target empirical experiments beyond controlled/synthetic stress pilots.

---

# Phase 7 — Discovery

## Implemented

- [x] Archive structural filtering by field, family, Algorithm, evidence availability, and evidence stage.
- [x] Conceptual maturity remains separate from evidence stage.
- [x] Shareable URL-backed Archive state.
- [x] Deterministic ranked multi-passage lexical matching.
- [x] Complete long-chapter passage corpus remains searchable/inspectable; no arbitrary passage truncation.
- [x] Dedicated `/passages` provenance search.
- [x] Global command search across entity/evidence/chapter types.
- [x] Evidence Gaps deterministic curation-planning view.

## Deferred intentionally

- [ ] Semantic/vector retrieval with inspectable source grounding.
- [ ] Related-Algorithm suggestions beyond curated graph structure.
- [ ] Saved research trails/boards.

Semantic retrieval should only be added when it preserves inspectable provenance and demonstrably improves over the deterministic structural/lexical baseline.

---

# Phase 8 — CI, browser acceptance, and production

## Implemented

- [x] GitHub Actions on `main` and pull requests.
- [x] Markdown-link/URL policy, source hygiene, UI consistency, experiment artifact verification, research tests, TypeScript, production build.
- [x] 112 research/unit tests in the established suite.
- [x] 143 Chromium browser acceptance tests in the established suite.
- [x] Light/dark × desktop/tablet/phone/narrow containment.
- [x] Axe WCAG A/AA representative scans.
- [x] Keyboard, touch, reflow, screen-reader-structure, KaTeX-MathML, overflow, provenance, Lab, Atlas, Evidence and visual-artifact acceptance.
- [x] Production route smoke tests.
- [x] Implementation-freshness reporting retained with browser artifacts.
- [x] Browser-acceptance screenshots/reports retained as workflow artifacts.
- [x] Dedicated Vercel project + public production alias.

Production alias: `https://foundation-algorithms-collection.vercel.app`

## Manual quality gates still open

- [ ] VoiceOver/NVDA acceptance.
- [ ] Real math screen-reader behavior.
- [ ] Physical-device touch/browser/OS rendering.
- [ ] Physical-device zoom/text-scaling acceptance.
- [ ] Strict pixel-diff baselines only if the visual system becomes stable enough to justify their maintenance cost.

---

# Immediate next work

1. Continue expanding primary-source + passage-backed Claim coverage for high-value algorithms that still have concept-only evidence; Branch-and-Bound and Bayesian Optimization now have primary sources, but still need curated passage-backed Claims.
2. Continue converting important Atlas edges from conceptual-only to source-backed provenance; Q-learning/Dynamic Programming and Bayesian-Inference/Bayesian-Optimization are now source-backed in both directions.
3. Broaden commit-pinned executable implementation coverage beyond the current 13 records and review upstream-moved pins deliberately.
4. Add additional independently authored evaluations/replications, preserving negative/mixed/inconclusive outcomes.
5. Move project experiments progressively from controlled synthetic stress tests toward real-target benchmarks and datasets with reproducible artifacts.
6. Continue manual assistive-technology / physical-device acceptance outside automated CI.

---

# Change discipline

Future work should preserve these rules:

1. Markdown remains the canonical long-form research source.
2. Claims must resolve to exactly one live passage and explicit supporting References.
3. No fixed passage-count truncation may hide late source material.
4. Implementation links remain immutable commit snapshots with append-only verification history.
5. Upstream movement is a review signal, never permission to auto-advance evidence pins.
6. Evidence stage is coverage, not truth/quality scoring.
7. Negative, mixed, and inconclusive evidence is preserved.
8. `research-ui.css` remains the canonical global visual system; do not add another override generation.
9. Semantic retrieval must preserve inspectable provenance and beat the deterministic baseline before adoption.
