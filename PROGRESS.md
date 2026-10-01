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
**Evidence policy:** [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md)  
**Operations:** [`OPERATIONS.md`](./OPERATIONS.md)

A checked item means that the implementation or acceptance gate exists in the repository. Automated browser acceptance, research-evidence quality, manual assistive-technology acceptance, and physical-device acceptance are deliberately tracked as separate things.

---

## Current product chain

```text
Markdown research corpus
        ↓
Archive + long-form reader
        ↓
Deterministic passage provenance
        ↓
Curated Algorithm entities
        ↓
Typed Atlas relationship graph
        ├── conceptual vs source-backed edges
        ├── relation provenance
        └── reference / implementation neighbors
        ↓
Combination Lab
        ├── curated research hypotheses
        ├── rule-based assumption analysis
        └── experiment plans/results
        ↓
Evidence layer
        ├── Claims
        ├── References + citation graph
        ├── Commit-pinned implementations
        ├── Experiments + revision history
        ├── Independent replications/evaluations
        └── Passages
        ↓
Structural + lexical discovery
        ↓
Chromium responsive/theme/a11y/reflow acceptance
        ↓
Retained screenshot review
        ↓
Vercel production
```

---

# Phase overview

| Phase | State |
|---|---|
| 0 — Research corpus | ✅ Established |
| 1 — Archive foundation | ✅ Established |
| 2 — Design system & accessibility | 🟡 Canonical system + 132-test browser acceptance implemented; manual AT/device review remains |
| 3 — Algorithm indexing | 🟡 Strong curated system; breadth can expand |
| 4 — Atlas | 🟡 Typed/evidence-aware graph implemented; breadth/history can expand |
| 5 — Lab | 🟡 Structured hypotheses + assumption analysis + first empirical result path implemented |
| 6 — Evidence layer | 🟡 Full record architecture + first independent evaluation + first reproducible project result implemented |
| 7 — Discovery | 🟡 Structural + deterministic multi-passage lexical discovery implemented; semantic retrieval deferred |
| 8 — Production acceptance | 🟡 GitHub production build/browser acceptance green; current Vercel deploy temporarily blocked by account build-rate limit |

---

# Phase 0 — Research corpus

## Implemented

- [x] General foundations chapters.
- [x] AI / ML chapters.
- [x] Quantum computing chapters.
- [x] Cybersecurity / cryptography chapters.
- [x] Cross-field combination map and emerging-algorithms watchlist.
- [x] Motivation / Contribution / Implementation framing.
- [x] Markdown remains the canonical long-form source.

## Open

- [ ] Standardize primary-reference formatting across every chapter.
- [ ] Add proof/proof-sketch coverage where useful.
- [ ] Expand benchmark/dataset recommendations by family.
- [ ] Continue replacing provenance-sensitive broad prose with curated Claim records.

---

# Phase 1 — Archive and reader

## Implemented

- [x] Next.js App Router + TypeScript.
- [x] Markdown-derived metadata, headings, word count, reading time, and search text.
- [x] GitHub-compatible heading slugs including duplicate headings.
- [x] Render-time math normalization outside fenced code.
- [x] Deterministic passages with stable IDs and exact Markdown source-line ranges.
- [x] `/archive` with URL-backed query, field, family, Algorithm, evidence, evidence-stage, and sort state.
- [x] Ranked multi-passage lexical matching with cropped snippets and heading anchors.
- [x] `/archive/[slug]` with GFM, KaTeX, tables, code, links, TOC, related chapters, and previous/next navigation.
- [x] Chapter ↔ Algorithm / Reference provenance links.
- [x] Local scrolling for long math, wide tables, and code.
- [x] Overflowing technical regions become keyboard reachable only when needed and show a visible focus indicator.
- [x] 200% text-only reflow and narrow-screen containment automated.
- [x] KaTeX rendering is automatically checked for MathML + TeX annotation while visual glyph markup remains `aria-hidden`.

## Open reader acceptance

- [ ] Manual VoiceOver/NVDA pronunciation review for mathematics.
- [ ] Physical-device stress review for unusually long technical content and browser zoom/text scaling.

---

# Phase 2 — Design system and accessibility

## Implemented

- [x] **Fraunces** — editorial hierarchy.
- [x] **Source Sans 3** — UI/body/reading.
- [x] **JetBrains Mono** — technical metadata/code.
- [x] KaTeX keeps mathematical fonts.
- [x] Neutral warm-light / neutral-dark theme with explicit persisted light/dark control.
- [x] Typography, spacing, radius, control-height, shell, reading-width, focus, and contrast tokens.
- [x] Research-field color neutralized by default; semantic color reserved for actual state.
- [x] Canonical SVG logo + monochrome mark.
- [x] `app/research-ui.css` is the single global visual authority.
- [x] Deprecated glass/minimal/index visual layers removed.
- [x] Research fields use an editorial index instead of oversized cards.
- [x] Evidence destinations and Evidence-discipline steps use editorial index rows instead of dashboard cards.
- [x] Homepage Combination Lab preview is a restrained two-column editorial list instead of a six-card wall.
- [x] Shared control geometry and neutral surface hierarchy across Archive, Algorithms, Atlas, Lab, Evidence, and registries.
- [x] Visible keyboard focus, skip-to-content, reduced-motion support, modal focus containment/return focus.
- [x] Mobile navigation exposes expanded/current-page state and Escape behavior.
- [x] Command palette supports native Tab order plus ArrowUp/ArrowDown/Home/End acceleration.
- [x] Search-result updates are announced through a polite live region.
- [x] Atlas picker/relationship regions expose accessible selection and region names.
- [x] Small metadata tokens are CI-protected at ≥4.5:1 in both themes.
- [x] Axe WCAG A/AA scans on representative routes in light and dark mode.
- [x] Desktop/tablet/phone/narrow responsive containment matrix.
- [x] 200% text-only reflow checks.
- [x] Phone minimum 24px visible-control target check.
- [x] Screen-reader structural checks: one main/H1 entry point, named explicit regions, no positive tabindex ordering.
- [x] Retained full-page screenshots reviewed after the current editorial-index cleanup.

## Manual acceptance still open

- [ ] VoiceOver/NVDA walkthrough on representative routes.
- [ ] Real screen-reader evaluation of mathematical pronunciation/verbosity.
- [ ] Physical-device phone/tablet touch ergonomics and browser chrome.
- [ ] Physical-device OS font rendering and favicon-scale review.
- [ ] Pinch zoom and browser-level text scaling on physical devices.

---

# Phase 3 — Algorithm indexing

## Implemented

- [x] `AlgorithmEntity` schema and curated catalogs.
- [x] IDs, aliases, fields, families, assumptions, complexity, maturity, guidance, failure modes, tags, and open questions.
- [x] Duplicate/alias/relation/chapter validation.
- [x] Searchable `/algorithms` and detailed `/algorithms/[id]` routes.
- [x] Incoming/outgoing typed relationships and source-section links.
- [x] Reference, Claim, Implementation, Experiment, Replication, and Lab backlinks.
- [x] Multidimensional evidence profile separated from conceptual maturity.
- [x] Independent-replication count shown explicitly, including zero.

## Open

- [ ] Broader curated mechanism coverage.
- [ ] First-class variant records where relation-only variants become ambiguous.

---

# Phase 4 — Atlas

## Implemented

- [x] Typed relation graph with self/duplicate/target validation.
- [x] Focused-neighborhood `/atlas` explorer.
- [x] Search, field, relation-type, and relation-evidence filters.
- [x] URL-restorable focus/filter state.
- [x] Reference and commit-pinned Implementation evidence neighbors.
- [x] First-class relation-provenance records with References, notes, and verification dates.
- [x] Source-backed and conceptual edges remain visibly distinct.
- [x] Accessible relationship table, named regions, selected-state semantics, roving keyboard picker.
- [x] Browser acceptance covers URL state, provenance filters, evidence neighbors, keyboard focus, and reflow.

## Open

- [ ] Broader justified relation density.
- [ ] Broader source-backed relation coverage.
- [ ] Historical/evolution relations.
- [ ] Manual screen-reader traversal review.

---

# Phase 5 — Combination Lab

## Implemented

- [x] `ResearchCombination` schema and validation.
- [x] `/lab` route and arbitrary Algorithm pair explorer.
- [x] Shared fields/families and direct Atlas relations.
- [x] Structured hypotheses with compatibility, tensions, benefits, risks, metrics, experiment plan, and status.
- [x] Rule-based assumption compatibility/conflict analysis with exact triggering assumption text and explicit non-proof caveat.
- [x] Lab → Reference / Experiment links.
- [x] Keyboard/reflow acceptance.
- [x] First reproducible project outcome attached to retrieval + contextual-bandit research direction with limitations.
- [x] Append-only experiment revision history.
- [x] Homepage preview now uses the same quiet editorial research language as the rest of the product.

## Open

- [ ] Persist user-authored hypotheses/experiments.
- [ ] Attach more real empirical outcomes as studies run.
- [ ] Add richer benchmark/data artifacts where justified.

---

# Phase 6 — Evidence layer

## Implemented

- [x] Unified `/evidence` overview and shared Evidence navigation.
- [x] Editorial Evidence destination index + evidence-discipline sequence.
- [x] References, Implementations, Experiments, Passages, Claims, and Replications as separate record surfaces.
- [x] `ReferenceEntity` with controlled evidence roles and verified citation edges.
- [x] `/references/graph` citation explorer.
- [x] `ClaimRecord` → one uniquely resolved passage + explicit supporting References.
- [x] Commit-pinned `ImplementationRecord` registry with source paths, licenses, interfaces, maturity, and verification history.
- [x] `ExperimentRecord` model with protocol, status, baselines, datasets, metrics, environment, results, limitations, and append-only history.
- [x] First deterministic/reproducible project result for LinUCB reranking under drift; CI regenerates and compares the artifact.
- [x] `ReplicationRecord` model requiring independent source, original-source citations, Algorithm overlap, independence note, and verification date.
- [x] First directly verified independent record: ANN-Benchmarks evaluation of HNSW (`Partially supports`).
- [x] Evidence-stage profile remains descriptive coverage, never a truth score.
- [x] Global command search spans Algorithms, Claims, References, Implementations, Experiments, Replications, and chapters.

## Open

- [ ] Broader primary-reference and curated Claim coverage.
- [ ] Broader verified citation/relation-provenance coverage.
- [ ] Broader commit-pinned implementation coverage.
- [ ] Broader independent replication/evaluation coverage.
- [ ] Add correction/retraction/version metadata where relevant.
- [ ] Broaden empirical project experiments beyond the first controlled pilot.

---

# Phase 7 — Discovery

## Implemented

- [x] Archive structural filtering by field, family, Algorithm, evidence availability, and evidence stage.
- [x] Conceptual maturity kept separate from evidence stage.
- [x] Shareable URL-backed Archive state.
- [x] Deterministic ranked multi-passage lexical matching.
- [x] Multiple passage matches remain inspectable while navigation selects the highest-ranked source unit.
- [x] Dedicated `/passages` provenance search.
- [x] Global command search exposes evidence/entity types and chapter passage context.

## Deferred intentionally

- [ ] Semantic/vector retrieval with inspectable source grounding.
- [ ] Related-Algorithm suggestions beyond curated graph structure.
- [ ] Saved research trails/boards.

Semantic retrieval should only be added when it preserves inspectable provenance and demonstrably improves on the deterministic structural/lexical baseline.

---

# Phase 8 — CI, browser acceptance, and production

## Implemented

- [x] GitHub Actions on `main` and pull requests.
- [x] Markdown-link/URL policy, source hygiene, UI consistency, experiment artifact verification, research tests, TypeScript, and Next.js production build.
- [x] Production route smoke tests including dynamic Evidence detail routes.
- [x] Playwright automatically discovers every acceptance spec.
- [x] Current browser suite: **132/132 passed** on commit `64e518e8b05a4f2d7ff5800f42d05f62def13dc6`.
- [x] Light/dark × desktop/tablet/phone/narrow containment.
- [x] Axe WCAG A/AA representative scans.
- [x] Keyboard interaction for Search, mobile nav, Atlas, Lab, Evidence, skip link, and technical overflow scrollers.
- [x] Screen-reader structural semantics and KaTeX MathML structure automated.
- [x] 200% text-only reflow, reduced-motion, minimum-target, and page-overflow checks.
- [x] Retained visual artifacts; current Home and Evidence screenshots manually reviewed after editorial-index refactor.
- [x] Dedicated Vercel project and public production alias exist.

## Current deployment blocker

- [ ] Deploy the exact current HEAD after Vercel build-rate capacity becomes available.

GitHub CI, Next.js production build, browser acceptance, and production-route smoke tests are green for the current HEAD. Vercel marked the exact HEAD deployment status as failed with `upgradeToPro=build-rate-limit`; this is an account build-rate limit, not an application build failure. The public alias continues serving the most recent successful Vercel deployment until the rate limit permits the new production build.

## Manual quality gates still open

- [ ] VoiceOver/NVDA acceptance.
- [ ] Real math screen-reader behavior.
- [ ] Physical-device touch/browser/OS rendering.
- [ ] Physical-device zoom/text-scaling acceptance.
- [ ] Strict pixel-diff baselines only if the visual system becomes stable enough to justify their maintenance cost.

---

# Documentation

- [x] `README.md` — collection overview.
- [x] `DESIGN.md` — product/UI rationale.
- [x] `DEVELOPMENT_SPEC.md` — product/technical specification.
- [x] `PROGRESS.md` — current implementation tracker.
- [x] `UI_AUDIT.md` — canonical UI consistency and acceptance audit.
- [x] `CONTRIBUTING.md` — repository contribution contract.
- [x] `ALGORITHM_AUTHORING.md` — Algorithm metadata guidance.
- [x] `ATLAS_AUTHORING.md` — relationship/provenance guidance.
- [x] `EVIDENCE_AUTHORING.md` — evidence/experiment authoring contract.
- [x] `EVIDENCE_PROFILE_POLICY.md` — evidence-stage/citation/replication policy.
- [x] `OPERATIONS.md` — CI/deployment/release operations.

---

# Recent implementation checkpoints

## 2026-10-01 — semantic acceptance + editorial consistency

- added rendered landmark/H1/region/tab-order checks across representative surfaces;
- guarded skip-link focus movement and polite command-search result announcements;
- verified KaTeX MathML/TeX annotation structure and `aria-hidden` visual HTML;
- fixed visible focus for dynamically keyboard-reachable math/table/code scrollers;
- added ArrowUp/ArrowDown/Home/End command-palette result traversal without replacing Tab order;
- converted Evidence destination/discipline card grids into editorial index rows;
- converted the homepage Combination Lab preview from a six-card wall into a quiet two-column editorial list;
- reviewed fresh light/dark desktop/phone screenshots after the changes;
- current browser acceptance reached **132/132 passing tests**.

## 2026-10-01 — first reproducible result and experiment history

- accepted the first reproducible project Experiment result for controlled LinUCB reranking adaptation under preference drift;
- preserved the result as `Mixed` with explicit limitations;
- committed deterministic simulator/result artifacts and CI regeneration/comparison;
- added append-only experiment revision history and detail-page timeline.

## 2026-09-30 — independent evaluation + provenance

- added the first verified independent evaluation for HNSW via ANN-Benchmarks;
- added explicit original-source citations and conservative `Partially supports` outcome;
- implemented Atlas relation provenance, source-backed/conceptual edge states, evidence neighbors, and URL-restorable focus/filter state;
- implemented Lab arbitrary-pair rule-based assumption analysis.

Earlier implementation detail remains preserved in Git history and the specification/design documents; this tracker intentionally represents current state rather than duplicating every historical commit.

---

# Immediate next work

1. Complete manual VoiceOver/NVDA and mathematical-pronunciation acceptance on representative routes.
2. Perform physical-device phone/tablet checks for touch ergonomics, browser chrome, OS font rendering, pinch zoom, and browser-level text scaling.
3. Deploy the exact current HEAD once the Vercel build-rate limit clears.
4. Continue conservative primary Reference, Claim, citation-edge, relation-provenance, and commit-pinned Implementation coverage through direct verification.
5. Broaden independent evaluation/replication only where independence and original-source linkage can be directly verified.
6. Expand reproducible Experiments and attach concrete benchmark/data artifacts where study design supports them.
7. Expand Algorithm/Atlas mechanism coverage where the corpus supports a justified first-class entity or edge.
8. Add semantic retrieval only if it preserves inspectable provenance and outperforms the deterministic baseline.

---

## Maintenance rule

Update this tracker whenever a meaningful implementation, acceptance gate, or blocker changes.

- `[x]` — implementation or defined acceptance gate exists and passed.
- `[ ]` — not complete, blocked, or not yet accepted.
- Build success does **not** imply research-evidence quality or manual assistive-technology/device acceptance.
