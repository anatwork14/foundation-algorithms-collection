# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-10-02  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)  
**UI audit:** [`UI_AUDIT.md`](./UI_AUDIT.md)  
**Contribution guide:** [`CONTRIBUTING.md`](./CONTRIBUTING.md)  
**Algorithm authoring:** [`ALGORITHM_AUTHORING.md`](./ALGORITHM_AUTHORING.md)  
**Atlas authoring:** [`ATLAS_AUTHORING.md`](./ATLAS_AUTHORING.md)  
**Evidence authoring:** [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md)  
**Evidence policy:** [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md)  
**Operations:** [`OPERATIONS.md`](./OPERATIONS.md)

This file intentionally tracks the **current state**, not a full changelog. A checked item means the implementation or automated acceptance gate exists in the repository. Manual assistive-technology and physical-device acceptance remain separate from automated browser acceptance.

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
  ├── Claims
  ├── References + citation graph
  ├── Commit-pinned Implementations + append-only verification history
  ├── Experiments + append-only history
  ├── Independent Replications/Evaluations
  ├── Evidence Gaps
  └── Passages
        ↓
Structural + ranked lexical discovery
        ↓
101 research/unit tests
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
| 5 — Lab | 🟡 Structured hypotheses + assumption analysis + first empirical result path implemented |
| 6 — Evidence | 🟡 Full record architecture + curated evidence; breadth can expand |
| 7 — Discovery | 🟡 Structural + deterministic ranked lexical retrieval implemented; semantic retrieval deferred |
| 8 — Production acceptance | ✅ Current implementation checkpoint is CI-green and production infrastructure is active |

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
- [x] **Complete passage indexing across long chapters**; the former first-100-passage cap is removed.
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
- [x] First reproducible project result for HNSW + LinUCB reranking under drift.
- [x] Append-only experiment revision history.

## Open

- [ ] Persist user-authored hypotheses/experiments.
- [ ] Attach more real empirical outcomes as studies run.
- [ ] Add richer benchmark/data artifacts where justified.

---

# Phase 6 — Evidence

## Implemented

- [x] Unified Evidence overview/navigation + Evidence Gaps.
- [x] References, Implementations, Experiments, Passages, Claims, Replications as separate record surfaces.
- [x] Controlled Reference evidence roles, citation edges, and lifecycle notices.
- [x] Claim → exactly one passage → explicit Reference provenance contract.
- [x] **Nine curated passage-backed Claims**, including NeuralUCB's neural-gradient/tangent-feature uncertainty mechanism.
- [x] Live Claim-catalog test validates every Claim against the real Markdown corpus before build.
- [x] Commit-pinned Implementation registry with immutable source URLs and append-only verification history.
- [x] Oct 2 direct re-verification advanced Faiss HNSW, Qiskit QPE, PyTorch AdamW, PyTorch MultiheadAttention, and Z3 to inspected immutable snapshots.
- [x] PyTorch was re-reviewed again after two later test-only upstream commits; AdamW and MultiheadAttention were advanced to the directly inspected `ce42d088103272f0a90317697749d2069c815959` snapshot with revision 5 history entries.
- [x] Experiment model with protocol/result/limitations/artifacts + append-only history.
- [x] Deterministic 30-seed LinUCB reranking pilot artifact regenerated and compared in CI.
- [x] Independent Replication/Evaluation record model + first HNSW evaluation.
- [x] Evidence stage remains descriptive coverage, never a truth score.

## Current implementation freshness

The Oct 2 CI freshness report on implementation checkpoint `46f283ce24f6adc4afd3c71544e309465bcabe82` reports:

- **Current (7):** Faiss HNSW, hnswlib, Qiskit QPE, liboqs ML-KEM, PyTorch AdamW, PyTorch MultiheadAttention, Z3 SAT/SMT.
- **Upstream moved (0).**
- **Unavailable (0).**

Every currently registered implementation therefore points at the same upstream branch head observed by the freshness reporter at that checkpoint. This does **not** imply future upstream movement is safe to auto-adopt: any later change still requires direct inspection and a new append-only verification entry before the archive pin advances.

## Open

- [ ] Broader primary-reference and curated Claim coverage.
- [ ] Broader citation/relation-provenance coverage.
- [ ] Broader commit-pinned implementation coverage.
- [ ] Broader independent replication/evaluation coverage.
- [ ] Broaden empirical project experiments beyond the first controlled pilot.

---

# Phase 7 — Discovery

## Implemented

- [x] Archive structural filtering by field, family, Algorithm, evidence availability, and evidence stage.
- [x] Conceptual maturity remains separate from evidence stage.
- [x] Shareable URL-backed Archive state.
- [x] Deterministic ranked multi-passage lexical matching.
- [x] Complete long-chapter passage corpus remains searchable/inspectable; no arbitrary 100-passage truncation.
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
- [x] **101/101 research/unit tests passed** on implementation checkpoint `46f283ce24f6adc4afd3c71544e309465bcabe82`.
- [x] **143/143 Chromium browser acceptance tests passed** on the same checkpoint.
- [x] Light/dark × desktop/tablet/phone/narrow containment.
- [x] Axe WCAG A/AA representative scans.
- [x] Keyboard, touch, reflow, screen-reader-structure, KaTeX-MathML, overflow, provenance, Lab, Atlas, Evidence and visual-artifact acceptance.
- [x] Production route smoke tests passed.
- [x] Implementation-freshness report generated and retained with browser artifacts; checkpoint `46f283ce…` reports 7 current / 0 moved / 0 unavailable.
- [x] Browser-acceptance artifact retained for the checkpoint (`browser-acceptance`, artifact ID `11203797140`).
- [x] Dedicated Vercel project + public production alias.
- [x] Production alias is active; the last observed READY production deployment before this tracker-only commit was implementation checkpoint `b4a99e9753c536a18398e2e0fcc3c81e091db3b1`. The current implementation checkpoint `46f283ce…` is CI-green and is eligible for the normal Git/Vercel production propagation path.

Production alias: `https://foundation-algorithms-collection.vercel.app`

## Manual quality gates still open

- [ ] VoiceOver/NVDA acceptance.
- [ ] Real math screen-reader behavior.
- [ ] Physical-device touch/browser/OS rendering.
- [ ] Physical-device zoom/text-scaling acceptance.
- [ ] Strict pixel-diff baselines only if the visual system becomes stable enough to justify their maintenance cost.

---

# Immediate next work

1. Expand curated primary-source + Claim coverage where the corpus has a unique passage and direct primary evidence.
2. Expand source-backed Atlas relation provenance without manufacturing graph density.
3. Add another independently authored evaluation/replication where provenance is directly verifiable.
4. Add another empirical project experiment with a reproducible artifact and explicit limitations.
5. Continue manual assistive-technology / physical-device acceptance outside automated CI.

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
