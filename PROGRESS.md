# Foundation Algorithms Research Hub — Progress Tracker

**Status:** Active  
**Last updated:** 2026-09-28  
**Specification:** [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)  
**Design rationale:** [`DESIGN.md`](./DESIGN.md)

This file tracks what has been completed, what is currently established but still needs refinement, and what remains to be built.

The checkboxes reflect implementation state in the repository, not aspirational design intent.

---

## 1. Overall status

### Completed foundations

- [x] General foundational algorithm research collection established.
- [x] AI / ML research branch added.
- [x] Quantum computing research branch added.
- [x] Cybersecurity research branch added.
- [x] Cross-field research combination map added.
- [x] Emerging-algorithms research watchlist added.
- [x] Next.js research-hub application created.
- [x] Markdown corpus used as the application content source.
- [x] Home research-discovery experience implemented.
- [x] Archive browsing implemented.
- [x] Chapter rendering implemented.
- [x] Full-corpus local search implemented.
- [x] Global command search implemented.
- [x] Field filtering implemented.
- [x] Related research navigation implemented.
- [x] Previous/next chapter navigation implemented.
- [x] Light/dark system styling exists.
- [x] Responsive layout exists.
- [x] GitHub source provenance links exist.
- [x] CI typecheck/build workflow exists and has passed.
- [x] Product/UI rationale documented in `DESIGN.md`.
- [x] Intended development architecture documented in `DEVELOPMENT_SPEC.md`.
- [x] Progress tracking established in this file.

### Major work still ahead

- [ ] Typography/design-system consolidation.
- [ ] Algorithm-level entity indexing.
- [ ] Proper mathematical rendering.
- [ ] Research-quality comparison table system.
- [ ] Atlas as a real interactive research surface.
- [ ] Lab as a real research-hypothesis/experiment surface.
- [ ] Citation/reference entities and citation graph.
- [ ] Experiment/evidence records.
- [ ] Maturity/evidence metadata across algorithms.
- [ ] Diff-aware research history.
- [ ] Accessibility acceptance pass.
- [ ] Visual regression/browser acceptance pass.
- [ ] Public production deployment and documented URL.

---

# Phase 0 — Research corpus foundation

**Goal:** Build the core research archive itself.

## General foundations

- [x] `00-research-framework.md`
- [x] `01-core-problem-solving-paradigms.md`
- [x] `02-search-graphs-ordering-indexing.md`
- [x] `03-optimization-randomization-constraints.md`
- [x] `04-state-streaming-dataflow-systems.md`
- [x] `05-probabilistic-control-reinforcement-learning.md`
- [x] `06-representation-similarity-compression-parsing.md`
- [x] `07-distributed-coordination-reliability.md`
- [x] `08-bandits-contextual-bandits-linucb.md`
- [x] `09-combination-research-map.md`

## AI / ML

- [x] `10-ai-optimization-learning-theory.md`
- [x] `11-neural-architectures-attention-ssm-moe-gnn.md`
- [x] `12-generative-models-diffusion-flow-autoregressive.md`
- [x] `13-ai-reasoning-alignment-agents.md`
- [x] `14-uncertainty-causal-active-continual-meta-learning.md`

## Quantum computing

- [x] `20-quantum-computation-foundations.md`
- [x] `21-quantum-search-fourier-phase-estimation.md`
- [x] `22-quantum-simulation-qsp-qsvt-linear-algebra.md`
- [x] `23-quantum-optimization-vqe-qaoa.md`
- [x] `24-quantum-error-correction-decoding.md`
- [x] `25-fault-tolerance-error-mitigation-compilation.md`

## Cybersecurity

- [x] `30-cryptographic-foundations.md`
- [x] `31-post-quantum-cryptography.md`
- [x] `32-zero-knowledge-verifiable-computation.md`
- [x] `33-mpc-homomorphic-encryption-differential-privacy.md`
- [x] `34-security-analysis-symbolic-execution-fuzzing.md`
- [x] `35-cryptanalysis-side-channels-adversarial-methods.md`

## Cross-field research

- [x] `40-ai-quantum-cybersecurity-combination-map.md`
- [x] `41-emerging-algorithms-research-watchlist.md`

## Corpus improvements still needed

- [ ] Standardize primary-reference formatting across chapters.
- [ ] Add proof/proof-sketch coverage where especially useful.
- [ ] Add more executable examples and reference implementations.
- [ ] Add benchmark/dataset recommendations per algorithm family.
- [ ] Add explicit maturity labels to research topics.
- [ ] Add machine-readable relation metadata.
- [ ] Add exact source passage references for future algorithm entities.

---

# Phase 1 — Research archive web foundation

**Goal:** Make the corpus discoverable, searchable, and readable through Next.js.

## Application foundation

- [x] Next.js App Router application created.
- [x] React/TypeScript application structure created.
- [x] Root layout implemented.
- [x] Global styling implemented.
- [x] Repository content remains the canonical source.

## Content pipeline

- [x] Read `docs/*.md` from the repository at build/server time.
- [x] Extract chapter title.
- [x] Extract summary.
- [x] Extract numeric chapter identifier.
- [x] Map chapters to high-level fields.
- [x] Calculate word count.
- [x] Calculate approximate reading time.
- [x] Extract headings.
- [x] Generate search text from chapter contents.
- [x] Generate chapter TOC.
- [x] Match TOC slugs to Markdown renderer behavior.

## Home page

- [x] Mission/orientation hero exists.
- [x] Primary search exists.
- [x] Quick field filters exist.
- [x] Field overview exists.
- [x] Archive preview exists.
- [x] Combination/research-direction preview exists.
- [x] Research identity/orbit visual exists.

## Archive

- [x] `/archive` route exists.
- [x] Full corpus is browsable.
- [x] Full-text filtering exists.
- [x] Field filter exists.
- [x] Sorting exists.
- [x] Result count exists.
- [x] Direct navigation to chapter pages exists.
- [ ] Archive redesigned into the final list-first visual system.
- [ ] Filter/search state encoded into URL.
- [ ] Family-level filters.
- [ ] Algorithm-level filters.
- [ ] Maturity filters.

## Chapter pages

- [x] Dynamic `/archive/[slug]` route exists.
- [x] Markdown chapter rendering exists.
- [x] GFM support exists.
- [x] TOC exists.
- [x] Related research exists.
- [x] Previous/next navigation exists.
- [x] GitHub source link exists.
- [ ] Proper mathematical rendering.
- [ ] Final research table styling.
- [ ] Final code-block styling.
- [ ] Algorithm-level relationship panel.
- [ ] Exact reference/citation entities.

## Search

- [x] Search chapter titles.
- [x] Search chapter summaries.
- [x] Search chapter body text.
- [x] Home-page search.
- [x] Archive search.
- [x] Global `Cmd/Ctrl + K` search.
- [ ] Highlight matching passages.
- [ ] Search algorithm entities independently.
- [ ] Search references independently.
- [ ] Optional semantic retrieval.

## Responsive behavior

- [x] Responsive layout rules exist.
- [x] Mobile navigation treatment exists.
- [x] Main grids collapse responsively.
- [x] Chapter layout responds to smaller screens.
- [ ] Full mobile acceptance pass.
- [ ] Large-table overflow acceptance.
- [ ] Equation overflow acceptance.
- [ ] Mobile screen-reader acceptance.

## Theme

- [x] Light palette exists.
- [x] Dark palette exists.
- [x] System preference is supported.
- [ ] Explicit color contrast audit.
- [ ] Visual consistency audit across all major components.

---

# Phase 2 — Design-system consolidation

**Goal:** Establish one coherent visual language before adding large new product surfaces.

## Typography

- [ ] Add IBM Plex Sans.
- [ ] Add IBM Plex Mono.
- [ ] Load fonts through a deterministic Next.js/self-hosted strategy.
- [ ] Replace current `Inter` declaration.
- [ ] Remove generic serif hero/title overrides.
- [ ] Create type tokens.
- [ ] Apply type tokens across all components.
- [ ] Standardize research prose size/line height.
- [ ] Standardize label/metadata typography.
- [ ] Standardize code typography.

## Color

- [x] Warm-neutral archive palette concept exists.
- [x] Field colors exist.
- [ ] Refine light token values against final typography/components.
- [ ] Refine dark token values.
- [ ] Restrict field colors to accents/identifiers.
- [ ] Audit selected/hover/focus contrast.

## Shape

- [x] Border/radius system exists in first version.
- [ ] Reduce default large radii.
- [ ] Standardize button radius.
- [ ] Standardize input radius.
- [ ] Standardize panel radius.
- [ ] Reserve pill shapes for semantic pills/badges.
- [ ] Reduce decorative shadows.

## Spacing

- [ ] Create explicit spacing tokens.
- [ ] Align page sections to documented 8px-derived scale.
- [ ] Normalize card/list padding.
- [ ] Normalize chapter vertical rhythm.
- [ ] Normalize header/footer spacing.

## Archive visual redesign

- [ ] Replace card-heavy archive sections with list-first research rows.
- [ ] Improve title/metadata hierarchy.
- [ ] Improve dense scanning.
- [ ] Keep filters compact.
- [ ] Preserve field identity without large color surfaces.

## Research reading surface

- [ ] Set controlled reading width.
- [ ] Improve H1/H2/H3 hierarchy.
- [ ] Improve blockquote styling.
- [ ] Improve lists.
- [ ] Improve reference/link styling.
- [ ] Improve code blocks.
- [ ] Improve tables.
- [ ] Add math rendering.
- [ ] Improve TOC active/current-section feedback.

## Logo/brand

- [x] Circular/orbit identity concept exists.
- [x] Website brand mark component exists.
- [ ] Create/refine canonical SVG logo source.
- [ ] Verify favicon-scale legibility.
- [ ] Verify monochrome variant.
- [ ] Verify dark/light variants.
- [ ] Add social/share asset if needed.

## Phase 2 acceptance

- [ ] IBM Plex Sans is the primary typeface everywhere.
- [ ] IBM Plex Mono is used consistently for code/technical identifiers.
- [ ] No accidental font-family fragmentation remains.
- [ ] Archive is list-first.
- [ ] Field colors are restrained accents.
- [ ] Tables are research-quality.
- [ ] Equations use a math renderer.
- [ ] Mobile reading has no page-level horizontal overflow.
- [ ] Keyboard focus is clearly visible.
- [ ] Light/dark visual review passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.

---

# Phase 3 — Algorithm-level indexing

**Goal:** Let users discover and navigate individual algorithms independently of chapter files.

## Data model

- [ ] Define `AlgorithmEntity` schema.
- [ ] Define alias model.
- [ ] Define family model.
- [ ] Define assumption model.
- [ ] Define complexity model.
- [ ] Define maturity model.
- [ ] Define source-chapter linkage.
- [ ] Define source-passage linkage.

## Extraction / authoring

- [ ] Decide generated vs. curated entity metadata strategy.
- [ ] Seed entities for major algorithms.
- [ ] Validate duplicate/alias handling.
- [ ] Add consistency checks.

## UI

- [ ] Algorithm search results.
- [ ] Algorithm detail route.
- [ ] Algorithm metadata summary.
- [ ] Motivation/contribution/implementation quick navigation.
- [ ] Assumptions/failure modes summary.
- [ ] Complexity summary.
- [ ] Variants and alternatives.
- [ ] Combination opportunities.
- [ ] Source chapter links.

---

# Phase 4 — Atlas

**Goal:** Make research relationships traversable.

## Relationship model

- [ ] Define node types.
- [ ] Define edge types.
- [ ] Create machine-readable relation storage.
- [ ] Define validation rules.
- [ ] Add initial relationships for major foundations.

## Atlas UX

- [ ] `/atlas` route.
- [ ] Entity search/select.
- [ ] Focused-neighborhood graph.
- [ ] Relationship text panel.
- [ ] Progressive expansion.
- [ ] Field/relation filters.
- [ ] Archive links from graph nodes.
- [ ] Mobile textual fallback.
- [ ] Accessible non-visual relationship representation.

## Initial relation coverage

- [ ] Search → A* → learned heuristics.
- [ ] Dynamic programming → Bellman equations → RL.
- [ ] Bayesian inference → Thompson Sampling / Bayesian optimization.
- [ ] UCB → LinUCB → NeuralUCB.
- [ ] Representation learning → embeddings → ANN/HNSW.
- [ ] CSP/SAT → symbolic execution/formal analysis.
- [ ] Error-correcting codes → QEC → decoding.
- [ ] Lattices → PQC / FHE.
- [ ] Polynomial methods → ZK / QSP/QSVT relation maps where meaningful.

---

# Phase 5 — Lab

**Goal:** Support disciplined research-combination ideation and experiments.

## Combination model

- [ ] Define `ResearchCombination` schema.
- [ ] Component entities.
- [ ] Motivation.
- [ ] Hypothesis.
- [ ] Compatibility.
- [ ] Conflicts/tensions.
- [ ] Expected benefits.
- [ ] Risks.
- [ ] Metrics.
- [ ] Experiment plan.
- [ ] Status/evidence.

## Lab UX

- [ ] `/lab` route.
- [ ] Select algorithm/mechanism A.
- [ ] Select algorithm/mechanism B.
- [ ] Show shared interfaces.
- [ ] Show assumption conflicts.
- [ ] Create hypothesis record.
- [ ] Create experiment plan.
- [ ] Attach evidence/results.
- [ ] Distinguish speculation from established knowledge.

## Seed combinations

- [x] Combination ideas documented in research Markdown.
- [ ] Contextual bandits × fuzzing as structured Lab record.
- [ ] GNN/SSM × quantum decoding as structured Lab record.
- [ ] Bayesian optimization × quantum calibration as structured Lab record.
- [ ] LLM × SMT/symbolic execution as structured Lab record.
- [ ] FHE/MPC × ZK × AI as structured Lab record.
- [ ] Learned heuristics × A*/branch-and-bound as structured Lab record.

---

# Phase 6 — Research evidence layer

**Goal:** Make the hub useful for reproducible, evidence-aware research.

## References

- [ ] Define reference entity schema.
- [ ] Extract/curate primary references.
- [ ] Link references to algorithms.
- [ ] Link references to combinations.
- [ ] Citation graph.

## Implementations

- [ ] Link reference implementations.
- [ ] Track language/framework.
- [ ] Track implementation maturity.
- [ ] Track license/source repository.

## Experiments

- [ ] Experiment entity schema.
- [ ] Dataset/benchmark links.
- [ ] Metrics.
- [ ] Environment/configuration.
- [ ] Results.
- [ ] Reproduction instructions.
- [ ] Failed/inconclusive result preservation.

## Change history

- [ ] Research-chapter diff view.
- [ ] Algorithm metadata diff view.
- [ ] Evidence/maturity change history.

---

# Phase 7 — Advanced discovery

**Goal:** Add advanced retrieval only after structural discovery is strong.

- [ ] Passage-level search.
- [ ] Semantic retrieval.
- [ ] Inspectable retrieval evidence.
- [ ] Related-algorithm suggestions.
- [ ] Saved research trails.
- [ ] Research boards/hypothesis collections.
- [ ] Contribution templates.
- [ ] Research update workflow.

---

# Accessibility status

## Already present

- [x] Semantic HTML used in major page structure.
- [x] Search inputs use native controls.
- [x] Navigation is available without the command palette.
- [x] Responsive behavior exists.
- [x] Color is accompanied by textual field names in major UI.

## Still required

- [ ] Automated accessibility testing.
- [ ] Keyboard-only full walkthrough.
- [ ] Visible-focus audit.
- [ ] VoiceOver spot check.
- [ ] NVDA spot check.
- [ ] WCAG contrast review.
- [ ] Command palette dialog semantics audit.
- [ ] Table accessibility review.
- [ ] Math accessibility review.
- [ ] Reduced-motion review.

---

# Quality / CI status

## Implemented

- [x] GitHub Actions validation workflow.
- [x] TypeScript typecheck step.
- [x] Next.js production build step.
- [x] Successful CI run recorded after implementation.

## Planned

- [ ] ESLint/static lint workflow.
- [ ] Unit tests for content parser.
- [ ] Unit tests for heading/TOC slug generation.
- [ ] Search behavior tests.
- [ ] Route smoke tests.
- [ ] Broken-link validation.
- [ ] Markdown/reference validation.
- [ ] Accessibility CI.
- [ ] Screenshot/visual regression testing.
- [ ] Browser acceptance matrix.

---

# Deployment status

- [x] Repository is buildable as a Next.js application.
- [x] CI confirms production build succeeds.
- [ ] Vercel/project hosting connected.
- [ ] Preview deployment reviewed.
- [ ] Production deployment reviewed.
- [ ] Public production URL documented.
- [ ] Deployment status linked from README.

---

# Documentation status

- [x] `README.md` — research collection and reading map.
- [x] `DESIGN.md` — product/UI rationale and research behind initial interface.
- [x] `DEVELOPMENT_SPEC.md` — intended product/technical development specification.
- [x] `PROGRESS.md` — implementation tracker.
- [ ] Contribution guide.
- [ ] Algorithm metadata authoring guide.
- [ ] Relationship/Atlas authoring guide.
- [ ] Lab hypothesis/experiment authoring guide.
- [ ] Deployment/operations guide.

---

# Immediate next work

The next implementation sequence should be:

1. **Typography migration** — IBM Plex Sans + IBM Plex Mono.
2. **Design tokens** — type, spacing, radius, color, focus.
3. **Archive redesign** — list-first, denser, calmer.
4. **Research reading refinement** — controlled measure, hierarchy, code, tables.
5. **Math rendering** — KaTeX or equivalent.
6. **Accessibility pass** — focus, keyboard, semantics, contrast.
7. **Responsive acceptance** — mobile/tablet/desktop, light/dark.
8. **Deploy preview** — inspect real browser rendering.
9. **Algorithm entity model** — begin Phase 3 only after visual foundation is stable.

---

# Current project checkpoint

At this checkpoint, the project has moved beyond being only a Markdown collection. It now has:

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
Combination inspiration
```

The next checkpoint should establish:

```text
Consistent design system
      ↓
Research-quality typography/math/tables
      ↓
Algorithm entities
      ↓
Atlas
      ↓
Lab
      ↓
Evidence + experiments
```

---

## Maintenance rule

Update this file whenever a meaningful feature, acceptance gate, or project phase changes.

Use these meanings consistently:

- `[x]` — implemented and present in the repository;
- `[ ]` — not yet complete;
- do not mark planned work complete merely because it is described in `DEVELOPMENT_SPEC.md` or `DESIGN.md`.
