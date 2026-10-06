# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-10-05  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)  
**UI audit:** [`UI_AUDIT.md`](./UI_AUDIT.md)  
**Contribution guide:** [`CONTRIBUTING.md`](./CONTRIBUTING.md)  
**Algorithm authoring:** [`ALGORITHM_AUTHORING.md`](./ALGORITHM_AUTHORING.md)  
**Atlas authoring:** [`ATLAS_AUTHORING.md`](./ATLAS_AUTHORING.md)  
**Evidence authoring:** [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md)  
**Evidence policy:** [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md)  
**Operations:** [`OPERATIONS.md`](./OPERATIONS.md)

This file is a **current-state checkpoint**, not a changelog. Checked items mean the implementation or automated acceptance gate exists in the repository. Manual assistive-technology and physical-device review remain separate from automated Chromium acceptance.

---

## Current product chain

```text
Markdown research corpus
        ↓
Archive + long-form reader
        ↓
Deterministic passage provenance
        ↓
Curated Algorithm entities + Variants
        ↓
Typed Atlas relationship graph
        ↓
Combination Lab
        ↓
Evidence
  ├── 39 curated passage-backed Claims
  ├── 42 curated References + citation graph
  ├── 29 commit-pinned Implementation records + append-only verification history
  ├── Append-only upstream Implementation review ledger
  ├── Experiments + append-only history
  ├── 4 independent Replication/Evaluation records
  ├── 30 source-backed Atlas relations
  ├── Evidence Gaps
  └── Passages
        ↓
Structural + ranked lexical discovery
        ↓
Research/unit validation + Chromium acceptance
        ↓
Production build + route smoke
        ↓
Vercel production
```

Production alias: `https://foundation-algorithms-collection.vercel.app`

---

# Phase overview

| Phase | State |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Archive foundation | ✅ Established |
| 2 — Design system & accessibility | 🟡 Automated acceptance established; manual AT/device review remains |
| 3 — Algorithm + Variant indexing | 🟡 Strong curated system; breadth can expand |
| 4 — Atlas | 🟡 Typed/evidence-aware graph implemented; provenance density can expand |
| 5 — Lab | 🟡 Structured hypotheses + empirical paths implemented |
| 6 — Evidence | 🟡 Full record architecture + curated evidence; breadth can expand |
| 7 — Discovery | 🟡 Structural + deterministic ranked lexical retrieval implemented; semantic retrieval deferred |
| 8 — Production acceptance | ✅ CI/browser/build/deployment infrastructure established |

---

# 0 — Research corpus

## Implemented

- [x] Foundations chapters.
- [x] AI / ML chapters.
- [x] Quantum-computing chapters.
- [x] Cybersecurity / cryptography chapters.
- [x] Cross-field combination map and emerging-algorithms watchlist.
- [x] Motivation / Contribution / Implementation framing.
- [x] Markdown remains the canonical long-form source.

## Open

- [ ] Standardize primary-reference formatting across every chapter.
- [ ] Add proof/proof-sketch coverage where useful.
- [ ] Expand benchmark/dataset recommendations by family.
- [ ] Continue converting provenance-sensitive prose into curated Claims.

---

# 1 — Archive and reader

## Implemented

- [x] Next.js App Router + TypeScript.
- [x] Markdown-derived metadata, headings, word count, reading time, and search text.
- [x] GitHub-compatible heading slugs including duplicates.
- [x] GFM + KaTeX + tables + code + TOC + related/previous/next navigation.
- [x] Deterministic passages with stable IDs and exact source-line ranges.
- [x] Complete passage indexing across long chapters.
- [x] Live Claim-catalog validation against the real Markdown corpus.
- [x] Ranked multi-passage lexical matching with cropped snippets and heading anchors.
- [x] URL-backed Archive query/field/family/Algorithm/evidence/stage/sort state.
- [x] Chapter ↔ Algorithm / Reference provenance links.
- [x] Local scrolling and keyboard reachability for long math, wide tables, and code.
- [x] Automated narrow-screen and 200% text reflow checks.

## Manual acceptance still open

- [ ] VoiceOver/NVDA pronunciation review for mathematics.
- [ ] Physical-device stress review for unusually long technical content, browser zoom, and OS text scaling.

---

# 2 — Design system and accessibility

## Implemented

- [x] Fraunces editorial hierarchy.
- [x] Source Sans 3 UI/body/reading.
- [x] JetBrains Mono technical metadata/code.
- [x] KaTeX mathematical fonts.
- [x] Neutral warm-light / neutral-dark persisted theme.
- [x] Canonical SVG logo + monochrome mark.
- [x] `app/research-ui.css` is the single global visual authority.
- [x] Deprecated glass/minimal/index override generations removed.
- [x] Editorial research indexes replace oversized dashboard-card walls where comparison is the task.
- [x] Shared geometry, spacing, surfaces, toolbar grammar, focus, and responsive behavior across major routes.
- [x] Skip link, visible focus, reduced motion, modal focus containment/return, accessible mobile navigation.
- [x] Command-palette keyboard behavior and live result announcements.
- [x] Atlas selection/region semantics and keyboard traversal.
- [x] CI-enforced metadata contrast ≥ 4.5:1 in both themes.
- [x] Axe WCAG A/AA representative scans.
- [x] Desktop/tablet/phone/narrow Chromium matrix in light and dark.
- [x] Touch/coarse-pointer acceptance and minimum visible target checks.
- [x] Retained browser screenshots/reports as CI artifacts.

## Manual acceptance still open

- [ ] VoiceOver/NVDA walkthrough on representative routes.
- [ ] Real screen-reader evaluation of math pronunciation/verbosity.
- [ ] Physical-device phone/tablet ergonomics and browser chrome.
- [ ] Physical-device OS font rendering, favicon-scale review, pinch zoom, and text scaling.

---

# 3 — Algorithm and Variant indexing

## Implemented

- [x] Curated `AlgorithmEntity` schema/catalogs.
- [x] IDs, aliases, fields, families, assumptions, complexity, maturity, guidance, failure modes, tags, open questions.
- [x] Duplicate/alias/relation/chapter validation.
- [x] Searchable `/algorithms` + detail routes.
- [x] Incoming/outgoing typed relationships and source-section links.
- [x] Reference, Claim, Implementation, Experiment, Replication, Variant, and Lab backlinks.
- [x] Multidimensional evidence profile separated from conceptual maturity.
- [x] First-class Variant records and `/variants` surface where relation-only modeling is insufficient.
- [x] Hybrid LinUCB represented as a first-class Variant.
- [x] Kalman Filter promoted into a first-class Algorithm entity.

## Open

- [ ] Broader curated mechanism coverage.
- [ ] Promote additional variants when they need assumptions/complexity/evidence separate from their parent Algorithm.

---

# 4 — Atlas

## Implemented

- [x] Typed relationship graph with validation.
- [x] Focused-neighborhood Atlas explorer.
- [x] Search + field + relation-type + evidence filters.
- [x] URL-restorable Atlas state.
- [x] Reference and commit-pinned Implementation neighbors.
- [x] First-class relation-provenance records.
- [x] **30 source-backed relation records** currently curated; remaining edges stay explicitly conceptual-only.
- [x] Source-backed coverage now includes bandit lineages and alternatives (including both LinUCB↔Thompson Sampling and UCB1↔Thompson Sampling directions), ANN/embedding links, both Transformer↔SSM alternative directions, lattice/ML-KEM, lattice/FHE, QSVT/QPE, A*/Dijkstra, Q-learning/Dynamic Programming, Bayesian-Inference/Bayesian-Optimization, Learned-Heuristics/Branch-and-Bound, SAT/SMT→Symbolic-Execution, Error-Correcting-Codes→Surface-Code-Decoding, both Symbolic-Execution/Coverage-Guided-Fuzzing directions, Secure-MPC/FHE alternatives, and Secure-MPC/Zero-Knowledge combinations.
- [x] Accessible table/regions/selection + keyboard picker.

## Open

- [ ] Broader justified relation density.
- [ ] Broader source-backed relation coverage.
- [ ] Historical/evolution relations where primary sources justify them.
- [ ] Manual screen-reader traversal review.

---

# 5 — Combination Lab

## Implemented

- [x] Structured `ResearchCombination` records.
- [x] Arbitrary Algorithm-pair explorer.
- [x] Rule-based assumption compatibility/tension analysis with explicit non-proof caveat.
- [x] Structured hypotheses, benefits, risks, metrics, experiment plans, and status.
- [x] Reference / Experiment links.
- [x] Reproducible HNSW + LinUCB reranking drift pilot with committed artifacts.
- [x] Reproducible LinUCB mutation-scheduler drift pilot with committed artifacts.
- [x] Append-only experiment revision history.

## Open

- [ ] Persist user-authored hypotheses/experiments.
- [ ] Attach more real-target empirical outcomes as studies run.
- [ ] Add richer benchmark/data artifacts where justified.

---

# 6 — Evidence

## Implemented

- [x] Unified Evidence overview/navigation + Evidence Gaps.
- [x] References, Implementations, Implementation Reviews, Experiments, Passages, Claims, Replications as separate record surfaces.
- [x] Controlled Reference evidence roles, citation edges, and lifecycle notices.
- [x] Claim → exactly one passage → explicit Reference provenance contract.
- [x] **39 curated passage-backed Claims**.
- [x] **42 curated References**.
- [x] New 2026-10-05 AI/ML evidence adds Shazeer et al.'s sparsely gated Mixture-of-Experts paper plus passage-backed sparse expert routing; Kipf–Welling GCN plus normalized-neighbor aggregation; Hamilton–Ying–Leskovec GraphSAGE plus sampled inductive neighborhood aggregation; Veličković et al. Graph Attention Networks plus learned neighbor-attention weighting; and Ying et al. Graphormer as a primary graph-Transformer source with explicit Transformer lineage, all tied to the live neural-architectures chapter.
- [x] New 2026-10-05 attention-systems evidence adds Dao et al.'s NeurIPS 2022 FlashAttention paper as the primary IO-aware exact-attention method and Dao's ICLR 2024 FlashAttention-2 paper as the work-partitioning extension, preserving the lineage from standard Transformer attention through exact GPU-memory-aware execution.
- [x] FlashAttention now has an explicit passage-backed IO-aware exact-attention mechanism Claim tied to Dao et al. 2022; the Claim preserves exact dense-attention semantics while scoping the systems contribution to reduced memory traffic through tiling and online softmax rather than generalizing speedups across hardware or workloads.
- [x] New 2026-10-05 independent GNN evaluation adds Dwivedi et al.'s JMLR benchmark as a no-author-overlap comparison of GCN and GraphSAGE under a common reproducible parameter/training framework; the same benchmark evaluates and cites GAT, but the archive does not count it as independent GAT replication because Yoshua Bengio is an author of both works. Relative performance varies across tasks and datasets rather than establishing a universal winner.
- [x] New 2026-10-03 foundational/security/quantum additions include Land–Doig Branch-and-Bound, Jones–Schonlau–Welch EGO, Khalil et al. learned branching, KLEE symbolic execution, Dennis et al. surface-code recovery, Driller hybrid fuzzing/symbolic execution, de Moura–Bjørner Z3 SMT solving, Gentry fully homomorphic encryption, Goldreich–Micali–Wigderson secure multiparty computation, and Goldwasser–Micali–Rackoff zero knowledge.
- [x] New 2026-10-04 bandit provenance adds Agrawal–Goyal contextual Thompson Sampling as a Primary extension, source-backs both LinUCB↔Thompson Sampling directions, and now source-backs both UCB1↔Thompson Sampling alternative-method directions using the independently authored Chapelle–Li evaluation without asserting a universal winner.
- [x] New 2026-10-04 replication coverage adds Dewolf–De Baets–Waegeman's independently authored prediction-interval comparison for Conformal Prediction/CQR. The source explicitly attributes the CQR calibration construction to Romano–Patterson–Candès, reports substantial benchmark-to-benchmark performance variation, and is therefore curated as partial support rather than as a universal reproduction of CQR efficiency, conditional coverage, or distribution-shift robustness.
- [x] Zero-Knowledge Proofs have an explicit passage-backed no-additional-knowledge Claim tied to Goldwasser–Micali–Rackoff 1989; the existing Secure-MPC/Zero-Knowledge Atlas edge now cites both the foundational ZK source and GMW's MPC construction that consumes ZK subprotocols.
- [x] Secure MPC has an explicit passage-backed private-input-computation Claim tied to GMW 1987; its FHE alternative edge cites both GMW and Gentry, while its Zero-Knowledge combination edge preserves the relevant adversary/protocol scope rather than treating all MPC protocols as identical.
- [x] SAT/SMT solving has an explicit theory-aware satisfiability Claim tied to the Z3 primary system paper and the live SMT chapter passage; its Symbolic-Execution Atlas edge cites both Z3 and KLEE.
- [x] Gentry 2009 now source-backs the existing lattice-to-FHE Atlas lineage without treating all modern FHE schemes as identical to the original ideal-lattice construction.
- [x] FHE has an explicit passage-backed arbitrary-circuit/bootstrapping Claim tied to Gentry 2009, while noting that later leveled and optimized schemes can manage evaluable depth and noise differently.
- [x] Learned Heuristics now have an explicit passage-backed learned-branching Claim tied to Khalil et al. 2016, while preserving exact branch-and-bound bounding and pruning as the correctness boundary rather than the learned branch-ranking policy.
- [x] Hybrid fuzzing now has an explicit passage-backed selective symbolic-solving Claim tied to Driller, preserving the division between high-throughput coverage exploration and solver-backed hard-branch reasoning without claiming universal performance gains.
- [x] Surface-code decoding has an explicit repeated-syndrome/spacetime Claim tied to Dennis et al. and the live chapter passage.
- [x] Symbolic Execution has an explicit passage-backed Claim tied to KLEE and source-backed SAT/SMT + hybrid-fuzzing Atlas links.
- [x] Branch-and-Bound and Bayesian Optimization have primary-source-backed curated Claims.
- [x] Commit-pinned Implementation registry with immutable source URLs and append-only verification history.
- [x] Append-only upstream Implementation review ledger with explicit Retain pin / Advance pin / Needs follow-up decisions, inspected-path blob identities, dedicated registry/search, detail history, stable review permalinks, and global command-palette discovery.
- [x] **29 implementation records** currently registered.
- [x] PyTorch Geometric now provides separate commit-pinned GCN, GraphSAGE, and GAT implementation records at the same immutable upstream revision. `GCNConv` exposes Kipf–Welling symmetric degree normalization, self-loop/weighted-edge handling, sparse adjacency, and transductive caching; `SAGEConv` exposes learned sampled-neighborhood aggregation with optional projection/root features and alternative aggregators; and `GATConv` exposes learned multi-head neighborhood attention, returned attention weights, bipartite inputs, residuals, and edge-feature-aware attention. Their pinned tests exercise dense/sparse paths and the relevant API behavior, while the GAT snapshot explicitly preserves the unsupported SparseTensor edge-attribute plus automatic-self-loop combination. Kipf–Welling, Hamilton–Ying–Leskovec, and Veličković et al. remain the primary method sources and independent evaluation remains a separate evidence layer.
- [x] Microsoft Graphormer now provides a commit-pinned graph-Transformer implementation record at its current main revision. The inspected source combines node features with in/out-degree embeddings and a graph token, injects spatial-distance and edge encodings into per-head attention bias, and feeds those biases through stacked Transformer encoder layers. The repository test surface currently centers on pretrained/local checkpoint loading rather than full numerical encoder behavior, and the README explicitly frames its pinned Python 3.9/PyTorch 1.9.1/Fairseq container as a legacy reproducibility environment rather than current-version compatibility; both limits are preserved in the revision-1 verification snapshot.
- [x] FlashAttention-2 now has a commit-pinned v2.8.4 executable record scoped to the official dense, packed, variable-length, and KV-cache Python APIs. The inspected public interface dispatches exact attention to CUDA/ROCm kernels, while the canonical test suite builds a PyTorch reference attention and exercises the exported API across masks, padding, shapes, gradients, and inference-oriented paths. The revision-1 snapshot explicitly excludes the repository's separate FlashAttention-3/4 paths and preserves the documented PyTorch 2.2+, CUDA 12+ or ROCm 6+ backend, GPU-family, dtype, and feature constraints instead of generalizing paper speedups to arbitrary hardware.
- [x] MAPIE now provides a commit-pinned Conformal Prediction implementation record scoped to Conformalized Quantile Regression: the inspected source fits lower/upper quantile estimators, calibrates on a held-out conformalization set through conformity scores, and exposes calibrated prediction intervals, with a matching revision-1 verification snapshot. Romano–Patterson–Candès 2019 remains the theoretical authority; the implementation does not establish conditional coverage or robustness under distribution shift.
- [x] PennyLane now provides a commit-pinned QSVT implementation record scoped to polynomial singular-value transformation: the high-level `qsvt` wrapper converts polynomial coefficients to QSVT phase angles, chooses a supported block encoding, constructs projector-controlled phases, and returns the `QSVT` circuit template, while pinned tests exercise validity, decomposition, and numerical behavior. The snapshot preserves encoding/normalization constraints and does not treat executable support as evidence of end-to-end quantum advantage.
- [x] MABWiser now provides one commit-pinned executable bandit record spanning LinUCB, UCB1, and Thompson Sampling: the inspected LinUCB path is the disjoint/per-arm ridge-regression form with an uncertainty bonus, UCB1 uses mean plus a count/log confidence term, and Thompson Sampling draws from Beta success/failure posteriors with binary rewards or an explicit binarizer. The matching revision-1 snapshot preserves those distinct scopes instead of treating the three exploration strategies as equivalent or inheriting theoretical guarantees for arbitrary tuning and reward models.
- [x] The official state-spaces Mamba repository now provides a commit-pinned Selective State-Space Models implementation record scoped to the Mamba-1 block: `mamba_simple.py` derives sequence-dependent `dt`, `B`, and `C` before selective scanning, `selective_scan_ref` exposes the recurrent update with variable B/C by position, and the matching revision-1 snapshot preserves the current README's opt-in CUDA selective-scan requirement without conflating Mamba-2/3 or all SSMs with that path.
- [x] SCIP now provides a commit-pinned Branch-and-Bound implementation record scoped to its exact-search tree: the inspected branching API creates child subproblems, `tree.c` cuts off nodes whose lower bound is not better than the active cutoff, and `primal.c` propagates improved primal bounds into that cutoff while preserving objective-integrality, numerical-tolerance, objective-limit, and optional exact-mode distinctions in a matching revision-1 verification snapshot.
- [x] AFL++ now provides a commit-pinned Coverage-Guided Fuzzing implementation record scoped to its instrumentation-guided greybox loop: the inspected approach document and source cover queued seeds, mutation, execution-path novelty, and retention of interesting inputs, with a matching revision-1 verification snapshot and upstream licensing scope preserved.
- [x] arkworks Groth16 now provides a commit-pinned Zero-Knowledge Proofs implementation record scoped to the Groth16 zkSNARK: the inspected source exposes circuit-specific common-reference-string generation, randomized zero-knowledge proof creation, and pairing-based verification, while preserving the repository's own academic proof-of-concept/not-production-ready warning and Groth16's setup assumptions in a matching revision-1 verification snapshot.
- [x] OpenFHE now provides a commit-pinned FHE record scoped to CKKS approximate bootstrapping: the inspected example enables FHE, generates bootstrap evaluation keys, refreshes a deliberately depleted ciphertext, and restores levels for continued encrypted computation, with a matching revision-1 verification snapshot. This modern CKKS path remains distinct from Gentry's original 2009 ideal-lattice construction and from other OpenFHE schemes.
- [x] MP-SPDZ now provides a commit-pinned secure-MPC record whose inspected dishonest-majority `Semi` protocol uses Beaver-triple multiplication with masked openings, with a matching revision-1 verification snapshot; the other protocol/security models exposed by MP-SPDZ remain distinct rather than inheriting that one path's assumptions.
- [x] KLEE now provides a commit-pinned symbolic-execution record whose verified executor evaluates branch conditions against path constraints, forks feasible states, and appends branch constraints, with a matching revision-1 verification snapshot.
- [x] PyMatching provides a commit-pinned MWPM surface-code decoder record with repeated-measurement/timelike-edge and Stim detector-error-model support, plus an append-only verification snapshot.
- [x] Experiment protocol/result/limitations/artifacts model + append-only history.
- [x] CI regenerates and compares committed deterministic experiment artifacts.
- [x] **4 independent Replication/Evaluation records**.
- [x] Evidence stage remains descriptive coverage, never a truth score.

## Implementation freshness policy

- Each Implementation points to an immutable 40-character commit and exact source paths.
- Append-only verification history must match the current registry snapshot.
- CI reports whether the tracked upstream branch has moved.
- Upstream movement is reviewed in a separate append-only ledger and is never permission to auto-advance an archive pin.

## Open

- [ ] Broader primary-reference and curated Claim coverage.
- [ ] Broader citation/relation-provenance coverage.
- [ ] Broader commit-pinned implementation coverage.
- [ ] Broader independent replication/evaluation coverage.
- [ ] More real-target empirical experiments beyond controlled/synthetic stress pilots.

---

# 7 — Discovery

## Implemented

- [x] Archive structural filtering by field, family, Algorithm, evidence availability, and evidence stage.
- [x] Conceptual maturity remains separate from evidence stage.
- [x] Shareable URL-backed Archive state.
- [x] Deterministic ranked multi-passage lexical matching.
- [x] Complete long-chapter passage corpus remains searchable/inspectable.
- [x] Dedicated `/passages` provenance search.
- [x] Global command search across entity/evidence/chapter types, including upstream Implementation review records and stable review anchors.
- [x] Evidence Gaps deterministic curation-planning view.

## Deferred intentionally

- [ ] Semantic/vector retrieval with inspectable source grounding.
- [ ] Related-Algorithm suggestions beyond curated graph structure.
- [ ] Saved research trails/boards.

Semantic retrieval should only be added when it preserves inspectable provenance and demonstrably improves over the deterministic structural/lexical baseline.

---

# 8 — CI, browser acceptance, and production

## Implemented

- [x] GitHub Actions on `main` and pull requests.
- [x] Markdown-link/URL policy, source hygiene, UI consistency, experiment artifact verification, research tests, TypeScript, production build.
- [x] Chromium browser acceptance integrated into CI.
- [x] Light/dark × desktop/tablet/phone/narrow containment.
- [x] Axe WCAG A/AA representative scans.
- [x] Keyboard, touch, reflow, screen-reader-structure, KaTeX-MathML, overflow, provenance, Lab, Atlas, Evidence, Variant, and visual-artifact acceptance.
- [x] Production route smoke tests.
- [x] Implementation-freshness reporting retained with browser artifacts.
- [x] Browser-acceptance screenshots/reports retained as workflow artifacts.
- [x] Dedicated Vercel project + public production alias.

## Manual quality gates still open

- [ ] VoiceOver/NVDA acceptance.
- [ ] Real math screen-reader behavior.
- [ ] Physical-device touch/browser/OS rendering.
- [ ] Physical-device zoom/text-scaling acceptance.
- [ ] Strict pixel-diff baselines only if the visual system becomes stable enough to justify their maintenance cost.

---

# Immediate next work

1. Continue expanding source-backed Atlas provenance on high-value conceptual-only edges, prioritizing relations with direct primary-method/primary-extension support.
2. Continue passage-backed Claim coverage for algorithms that have primary sources but remain concept-only at the Claim layer.
3. Broaden commit-pinned executable coverage, but only when an append-only verification-history snapshot can be added at the same time.
4. Add independently authored evaluations/replications, preserving negative, mixed, and inconclusive outcomes.
5. Move project experiments progressively from synthetic stress tests toward real-target benchmarks/datasets with reproducible artifacts.
6. Continue manual assistive-technology and physical-device acceptance outside automated CI.

---

# Change discipline

Future work must preserve these rules:

1. Markdown remains the canonical long-form research source.
2. Claims resolve to exactly one live passage and explicit supporting References.
3. No fixed passage-count truncation may hide late source material.
4. Implementation links remain immutable commit snapshots with append-only verification history.
5. Upstream movement is a review signal, never permission to auto-advance evidence pins.
6. Evidence stage is coverage, not truth/quality scoring.
7. Negative, mixed, and inconclusive evidence is preserved.
8. `research-ui.css` remains the canonical global visual system; do not add another override generation.
9. Semantic retrieval must preserve inspectable provenance and beat the deterministic baseline before adoption.
10. Atlas edges remain conceptual unless explicit relation-provenance records support them.