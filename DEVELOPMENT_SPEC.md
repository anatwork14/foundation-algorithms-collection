# Foundation Algorithms Research Hub — Development Specification

**Status:** Living implementation specification  
**Repository:** `anatwork14/foundation-algorithms-collection`  
**Last updated:** 2026-09-28  
**Primary source of truth for research content:** `docs/*.md`  
**Related documents:** `README.md`, `DESIGN.md`, `PROGRESS.md`

---

## 1. Purpose

Foundation Algorithms is intended to become a durable **research archive, algorithm repository, knowledge atlas, and research-inspiration environment** for foundational computational ideas.

The product is not primarily a blog, documentation site, course, dashboard, or static collection of Markdown files. It is a research instrument whose job is to make foundational algorithms easy to preserve, study, compare, connect, implement, and combine into future research directions.

The long-term product model is:

```text
FOUNDATION ALGORITHMS
        │
        ├── ARCHIVE  — what we know
        ├── ATLAS    — how ideas connect
        └── LAB      — what we might build next
```

The website must remain grounded in the underlying research corpus and must never hide source material behind an opaque application layer.

### 1.1 Product jobs

The product has six primary jobs.

1. **Archive** — preserve long-form research chapters in a coherent, durable structure.
2. **Repository** — keep rendered knowledge traceable to GitHub Markdown source and commit history.
3. **Discovery hub** — make a growing corpus searchable and navigable without requiring users to know filenames or taxonomy in advance.
4. **Knowledge atlas** — expose relationships among algorithms, mechanisms, assumptions, problems, and fields.
5. **Research laboratory** — help researchers form useful algorithm combinations and research hypotheses.
6. **Research memory** — accumulate references, implementations, experiments, failures, maturity evidence, and historical changes over time.

### 1.2 Product principle

The central rule is:

> Increase research leverage without hiding the underlying evidence, assumptions, implementation details, or source material.

---

## 2. Product identity

The interface should feel like a **modern scientific archive with an interactive algorithm atlas**, not a generic SaaS application.

Desired qualities:

- calm;
- precise;
- scholarly without being old-fashioned;
- technically rigorous;
- readable for long sessions;
- dense when the task requires density;
- easy to scan;
- visually quiet enough that mathematics and algorithms remain primary;
- exploratory when moving between related ideas;
- trustworthy and source-oriented.

The interface should avoid:

- excessive gradients;
- futuristic neon styling;
- glassmorphism as a primary visual language;
- oversized rounded cards everywhere;
- dashboard-style metric walls;
- marketing-page visual patterns in research reading flows;
- decorative animation without research value;
- hiding research provenance;
- inconsistent typography between pages.

---

## 3. Information architecture

### 3.1 Primary navigation

The stable primary navigation should converge on:

```text
Archive
Atlas
Lab
About
Search
```

Search remains globally available and should not be buried inside Archive.

### 3.2 Archive

Archive answers:

> What knowledge is currently stored here?

Structure:

```text
Archive
├── Fields
│   ├── Foundations
│   ├── AI / ML
│   ├── Quantum Computing
│   ├── Cybersecurity
│   └── Cross-field
├── Families
├── Algorithms
├── Research chapters
└── Sources / references
```

The initial implementation is chapter-centric because `docs/*.md` is the current content model. The target architecture is algorithm-centric while preserving chapter context.

### 3.3 Atlas

Atlas answers:

> How are these ideas related?

Relationships may include:

- derived from;
- generalizes;
- special case of;
- alternative to;
- combines with;
- depends on;
- optimizes;
- approximates;
- assumes;
- solves;
- used by;
- implemented with;
- historically influenced;
- security relationship;
- quantum/classical analogue;
- theoretical/production variant.

Example:

```text
Bayesian inference
    │
    ├── Thompson Sampling
    │       └── contextual Thompson Sampling
    │
    ├── Bayesian optimization
    └── probabilistic uncertainty estimation

UCB
    │
    └── LinUCB
        ├── Hybrid LinUCB
        └── NeuralUCB
```

### 3.4 Lab

Lab answers:

> What promising research directions can be formed by combining these foundations?

Lab should eventually support:

- algorithm pairings;
- mechanism pairings;
- cross-field combinations;
- research hypotheses;
- assumptions and incompatibilities;
- expected advantage;
- expected risk;
- experiment design;
- benchmark selection;
- implementation references;
- evidence status;
- experiment results;
- failed attempts and lessons.

Example:

```text
Contextual bandit
        ×
Coverage-guided fuzzing
        ↓
Adaptive mutation strategy selection
        ↓
Hypothesis
        ↓
Experiment
        ↓
Evidence
```

---

## 4. Research taxonomy

The top-level fields remain:

| Field | Purpose |
|---|---|
| Foundations | Durable general algorithms and computational mechanisms |
| AI / ML | Learning, inference, optimization, representation, reasoning, agents, adaptation |
| Quantum | Quantum primitives, algorithms, simulation, optimization, QEC, fault tolerance |
| Cybersecurity | Cryptography, PQC, ZK, MPC/FHE/privacy, analysis, verification, cryptanalysis |
| Cross-field | Combination maps, hybrid systems, emerging directions |

The numeric chapter sequence remains visible because it communicates intentional research organization and gives stable references such as `08`, `24`, and `40`.

The application should not encode the numeric sequence as the only taxonomy. Algorithms may belong to multiple fields and families.

---

## 5. Content model

### 5.1 Current source model

Current canonical content:

```text
docs/*.md
```

The Next.js application derives:

- title;
- summary;
- chapter number;
- field;
- search text;
- word count;
- reading time;
- headings;
- table of contents;
- rendered chapter content.

No React object should manually duplicate a research chapter.

### 5.2 Target algorithm entity model

The next major content abstraction is an algorithm-level entity.

Proposed structure:

```ts
type AlgorithmEntity = {
  id: string
  name: string
  aliases: string[]
  fields: FieldId[]
  families: string[]
  chapterSlugs: string[]
  summary: string
  motivation: string
  contribution: string
  assumptions: string[]
  complexity?: ComplexityRecord
  maturity: MaturityLevel
  relations: Relation[]
  references: ReferenceId[]
  implementations: ImplementationRef[]
  tags: string[]
}
```

This does not replace Markdown chapters. It indexes them.

### 5.3 Standard research card

Every algorithm should eventually expose the following research structure when source material supports it:

1. Name
2. Motivation
3. Problem definition
4. Historical origin
5. Core contribution
6. Mathematical foundation
7. Derivation
8. Algorithm
9. Pseudocode
10. Correctness / guarantees
11. Time complexity
12. Space complexity
13. Statistical/sample complexity when relevant
14. Assumptions
15. Implementation
16. Numerical considerations
17. Failure modes
18. Security implications when relevant
19. Modern variants
20. Production usage
21. Combination opportunities
22. Open research questions
23. Primary papers / references
24. Known implementations
25. Maturity / evidence status

---

## 6. Typography specification

Typography must be consistent across the complete product.

### 6.1 Font families

Target family:

```text
Primary UI and research text: IBM Plex Sans
Code and technical identifiers: IBM Plex Mono
Mathematics: KaTeX/STIX-compatible math rendering when introduced
```

Do not mix unrelated display serif fonts into page titles after this migration.

The product should have one primary textual voice.

### 6.2 Why IBM Plex

IBM Plex is preferred because it is:

- engineered for technical communication;
- readable in long documents;
- visually mature;
- suitable for dense interfaces;
- distinctive without becoming decorative;
- supported by a matching monospace family.

### 6.3 Type tokens

The CSS system should expose explicit tokens rather than scattered one-off font declarations.

Suggested scale:

```text
Display:   64–72px / 1.00 / 500
Page H1:   42–48px / 1.08 / 500
H2:        28–32px / 1.18 / 550–600
H3:        20–22px / 1.30 / 600
Body:      16–17px / 1.70 / 400
UI:        14px / 1.45 / 450–500
Metadata:  12px / 1.40 / 500
Label:     11px / 1.20 / 600, uppercase where appropriate
Code:      14–15px / 1.65 / 400
```

Example token naming:

```css
--font-sans
--font-mono
--text-display
--text-h1
--text-h2
--text-h3
--text-body
--text-ui
--text-meta
--text-label
--text-code
```

### 6.4 Typography rules

- Use font weight sparingly.
- Prefer size, spacing, position, and tone over excessive bold text.
- Body copy should remain comfortable for long technical reading.
- Code must use the mono family.
- Mathematical notation should be rendered as mathematics, not as code.
- Tables must remain legible at research density.
- Avoid typography changes that exist only for decoration.

---

## 7. Color specification

### 7.1 Neutral archive palette

Light mode target:

```text
Canvas       #F5F4EF
Surface      #FBFAF7
Elevated     #FFFFFF
Primary ink  #181A1F
Secondary    #686B73
Tertiary     #92959C
Border       #DEDDD6
Strong line  #CBC9BF
```

Dark mode target:

```text
Canvas       #111214
Surface      #17181B
Elevated     #1D1F22
Primary ink  #EFEFEA
Secondary    #97999F
Border       #292B2F
```

Exact values may be tuned for WCAG contrast, but the visual intent must remain warm-neutral rather than pure white/black.

### 7.2 Field colors

Field identity:

```text
Foundations     blue
AI / ML          violet
Quantum          teal
Cybersecurity    rust / warm orange
Cross-field      ochre
```

Field colors are **identifiers, not themes**.

Use them for:

- small dots;
- thin borders;
- metadata labels;
- graph nodes;
- selected filters;
- subtle link states;
- tiny badges.

Avoid using field colors as full-page backgrounds or large saturated card fills.

---

## 8. Spacing and layout system

### 8.1 Spacing scale

Use an 8px-derived scale:

```text
4
8
12
16
24
32
48
64
96
128
```

Typical rhythm:

```text
label → control              8–12
paragraph → paragraph        16
heading → body               16–24
subsection → subsection      32–48
major section → section      64
major page region            96
hero / major separation      96–128
```

### 8.2 Content widths

Research reading width should be narrower than application shell width.

Targets:

```text
Global shell: 1160–1240px max
Research prose: 720–820px max
TOC / related rail: 220–280px
Search palette: 620–700px
```

Long lines must not dominate chapter pages.

---

## 9. Shape and elevation system

The interface should become slightly sharper and more archival than the current version.

Recommended radii:

```text
button        6–8px
input         8px
small panel   8–10px
large panel   12px
modal         14px
badge         pill only when semantic
```

Avoid large `24px+` radii as the default container treatment.

Elevation rules:

- borders before shadows;
- shadows only when interaction/elevation is meaningful;
- command palette may use stronger elevation;
- hover elevation should be minimal;
- research text surfaces generally remain flat.

---

## 10. Home page specification

The home page is an orientation surface, not the complete archive.

Required regions:

1. Header/navigation
2. Mission statement
3. Global search
4. Quick field filters
5. Foundation field overview
6. Archive preview
7. Research directions / Lab preview
8. Product philosophy / provenance
9. Footer

Target hierarchy:

```text
FOUNDATION ALGORITHMS

The ideas everything else is built from.

A living research archive of algorithms across computation,
intelligence, quantum systems, and security.

[ Search algorithms, ideas, problems, papers…      ⌘K ]

Foundations   AI / ML   Quantum   Security   Cross-field
```

The content itself should be the dominant visual identity.

The existing orbit/atlas motif may remain as a restrained brand element, but it should not compete with search and research navigation.

---

## 11. Archive specification

Archive should favor a **list-first research index**, not a wall of cards.

Example row:

```text
10   Optimization & Learning Theory
     SGD · Adam · Bayesian learning · conformal prediction
     AI / ML                                      42 min →
```

### 11.1 Archive controls

Required:

- full-text search;
- field filter;
- sort;
- clear filters;
- result count;
- direct chapter navigation.

Future:

- family filter;
- algorithm filter;
- maturity filter;
- reference/source filter;
- implementation availability;
- theoretical vs. production evidence;
- relation-based filters.

### 11.2 Archive behavior

- Search must match title, summary, headings, and chapter text.
- Filters must not require opening a permanent wide sidebar.
- URL state should eventually encode relevant filters/search for shareability.
- Keyboard navigation should remain possible.
- Empty results must provide useful reset guidance.

---

## 12. Research chapter specification

Research detail pages are the primary reading surface.

Required structure:

```text
Field / Family
Title
Summary
Metadata
Source link

Table of contents

Research content

Related research
Previous / next
```

### 12.1 Reading requirements

- comfortable measure;
- consistent type hierarchy;
- sticky or accessible TOC on desktop;
- usable TOC on mobile;
- high-quality tables;
- styled code blocks;
- rendered mathematics;
- accessible links;
- stable anchor IDs;
- clear source/provenance link;
- related chapter paths.

### 12.2 Algorithm-level detail target

When algorithm entity indexing exists, detail pages should additionally expose:

- parents;
- variants;
- alternatives;
- assumptions;
- complexity summary;
- combination opportunities;
- open questions;
- known implementations;
- references;
- maturity.

---

## 13. Mathematics specification

Mathematics is a first-class part of the archive.

Target rendering stack should support Markdown math through KaTeX or equivalent.

Requirements:

- inline math;
- block math;
- accessible fallback text where feasible;
- horizontal overflow handling on mobile;
- consistent equation spacing;
- no accidental mono/code styling for mathematical expressions.

Example:

```text
a_t = argmax_a [ xᵀ θ̂_a + α sqrt(xᵀ A_a⁻¹ x) ]
```

should render as mathematical notation, not a raw code string.

---

## 14. Tables specification

Comparison tables are central to algorithm research.

The product must treat tables as first-class content rather than generic Markdown output.

Target use cases:

- complexity comparison;
- assumptions;
- guarantees;
- online/offline behavior;
- uncertainty handling;
- maturity/evidence;
- quantum resource requirements;
- cryptographic security properties;
- benchmark results.

Requirements:

- sticky header where useful;
- responsive horizontal scroll;
- clear row/column hierarchy;
- mono styling only for code/complexity expressions as needed;
- field colors used sparingly;
- readable dark mode.

---

## 15. Search specification

### 15.1 Current phase

Local corpus search over:

- title;
- summary;
- headings;
- complete chapter text.

Used in:

- home search;
- archive;
- command palette.

### 15.2 Target phases

Phase A — structural keyword search  
Phase B — algorithm-entity search  
Phase C — reference/source search  
Phase D — optional semantic retrieval

Semantic search should not replace transparent keyword/structural search. It should complement it and show source passages.

### 15.3 Command palette

`Cmd/Ctrl + K` remains the global discovery shortcut.

It should stay focused on:

- search;
- navigation;
- eventually algorithm/research entity lookup.

It should not become an overloaded application command center unless there is a demonstrated need.

---

## 16. Atlas specification

Atlas is a planned first-class product surface.

### 16.1 Graph model

Minimum graph types:

```text
Algorithm
Mechanism
Problem
Assumption
Field
Reference
Implementation
Research hypothesis
Experiment
```

Minimum edge types:

```text
derives_from
generalizes
special_case_of
alternative_to
uses
solves
assumes
optimizes
approximates
combines_with
implemented_by
supported_by
contradicted_by
```

### 16.2 Atlas UX

The graph should not start as an uncontrolled force-directed visualization.

Preferred interaction:

1. Search/select an entity.
2. Show focused neighborhood.
3. Group relationships semantically.
4. Let the user expand specific branches.
5. Keep a textual relationship panel beside the visualization.
6. Allow navigation into Archive or Lab.

The graph is a research navigation tool, not decoration.

---

## 17. Lab specification

Lab is a planned first-class surface for combination research.

### 17.1 Combination record

Proposed model:

```ts
type ResearchCombination = {
  id: string
  title: string
  components: EntityId[]
  motivation: string
  hypothesis: string
  compatibility: string[]
  tensions: string[]
  expectedBenefits: string[]
  risks: string[]
  experimentPlan?: string
  metrics?: string[]
  references: ReferenceId[]
  status: "idea" | "designed" | "running" | "supported" | "rejected" | "inconclusive"
}
```

### 17.2 Lab UX

A useful flow:

```text
Select idea A
      ×
Select idea B
      ↓
Inspect compatible interfaces
      ↓
Inspect assumption conflicts
      ↓
Generate hypothesis template
      ↓
Design experiment
      ↓
Attach evidence/results
```

The product must avoid presenting speculative combinations as established research.

---

## 18. References and provenance

Every research object must retain provenance.

Required principles:

- chapter links to source Markdown;
- references remain visible;
- algorithm entities point back to supporting chapter passages;
- experiments point to code/data/results where available;
- changes should eventually be diff-aware;
- maturity claims must be evidence-based.

Target reference entity:

```ts
type Reference = {
  id: string
  title: string
  authors?: string[]
  year?: number
  url?: string
  doi?: string
  arxiv?: string
  sourceType: string
  citedBy: EntityId[]
}
```

---

## 19. Maturity model

Algorithms and research directions should eventually carry explicit maturity metadata.

Proposed levels:

1. **Foundational** — long-established theory/mechanism.
2. **Production-proven** — broad real-world deployment and evidence.
3. **Active research** — substantial current literature, evolving methods.
4. **Emerging** — promising but evidence/standards still developing.
5. **Speculative combination** — hypothesis or early exploration.

Maturity must never be inferred only from recency or popularity.

---

## 20. Accessibility specification

Baseline target: WCAG 2.2 AA where applicable.

Required:

- semantic landmarks;
- keyboard access to navigation and search;
- visible focus indicators;
- no color-only semantic information;
- correct form labels;
- adequate contrast in light/dark themes;
- screen-reader-friendly headings;
- accessible dialog semantics for command palette;
- accessible tables;
- motion reduction support;
- responsive text without clipping;
- no critical hover-only interactions.

Acceptance work should include:

- automated accessibility checks;
- keyboard-only walkthrough;
- VoiceOver/NVDA spot checks;
- color contrast validation;
- mobile zoom/text-size testing.

---

## 21. Responsive behavior

### Desktop

- full navigation;
- sticky header;
- reading content plus TOC/related rail where space permits;
- dense archive rows;
- focused Atlas visualization plus textual relation panel.

### Tablet

- reduced side rails;
- archive remains list-based;
- TOC may collapse or move above content.

### Mobile

Mobile is a reading mode, not a compressed desktop dashboard.

Required:

- collapsed navigation;
- single-column archive;
- large touch targets;
- horizontal overflow for technical tables/equations;
- TOC as collapsible or horizontally scrollable section;
- related research moved after main content;
- reduced decorative visualization;
- no horizontal page overflow.

---

## 22. Theme behavior

Support:

- light;
- dark;
- system preference.

The system preference remains default unless explicit user theme controls are introduced.

Themes must preserve semantic hierarchy and field identity rather than merely invert colors.

---

## 23. Logo and brand mark

The circular orbit concept remains the preferred identity.

Meaning:

> Multiple algorithmic ideas orbit and connect around foundational computational principles.

Requirements:

- canonical SVG source;
- works at favicon size;
- works in monochrome;
- works in light/dark backgrounds;
- no dependency on gradients;
- does not rely on tiny details to remain recognizable;
- suitable for repository/social/website usage.

Target sizes:

```text
16px favicon
24–32px navigation
48px avatar/icon
128px documentation branding
512px social/share asset
```

---

## 24. Technical architecture

### 24.1 Framework

- Next.js App Router
- React
- TypeScript
- Markdown source under `docs/`
- static/server build-time corpus extraction where possible

### 24.2 Current content pipeline

```text
docs/*.md
   ↓
lib/content.ts
   ↓
metadata + search text + TOC
   ↓
Next.js routes/components
   ↓
Archive / Search / Chapter UI
```

### 24.3 Architecture principles

- Markdown remains canonical.
- Derived metadata should be reproducible.
- Avoid unnecessary databases until a feature requires persistent user/research state.
- Keep algorithm relationships machine-readable when Atlas work begins.
- Separate research data from presentation components.
- Prefer deterministic generation over duplicated manual metadata.
- Ensure search and rendering degrade gracefully if optional enriched metadata is missing.

---

## 25. Proposed project structure evolution

Current:

```text
app/
components/
lib/
docs/
```

Target direction:

```text
app/
  archive/
  atlas/
  lab/
  about/

components/
  archive/
  atlas/
  lab/
  research/
  shared/

lib/
  content/
  search/
  graph/
  taxonomy/
  references/

research/
  entities/
  relations/
  combinations/
  references/
  experiments/

docs/
```

The exact filesystem structure may evolve; separation of concerns is the requirement.

---

## 26. Performance requirements

Target behavior:

- static/pre-rendered research pages where practical;
- minimal client JavaScript for reading pages;
- client code reserved for search/filter/graph/lab interactions;
- no large visualization library loaded on pages that do not need Atlas;
- avoid remote runtime dependency for basic archive access;
- optimize fonts through Next.js or self-hosted package path;
- avoid layout shifts;
- lazy-load expensive graph/math/interactive features when appropriate.

Desired web-vital direction:

- LCP under ~2.5s on reasonable mobile conditions;
- CLS near zero;
- responsive interaction under 200ms for local filters/search where practical.

These are engineering targets, not guarantees independent of hosting/network conditions.

---

## 27. Testing and validation

### 27.1 Required CI

Existing CI must continue to validate:

```bash
npm install
npm run typecheck
npm run build
```

Future additions:

- linting;
- unit tests for content extraction;
- search tests;
- route smoke tests;
- accessibility tests;
- screenshot/visual regression checks;
- broken-link checks;
- Markdown/reference validation.

### 27.2 Acceptance dimensions

Each major UI change should be reviewed for:

- desktop light;
- desktop dark;
- mobile light;
- mobile dark;
- keyboard navigation;
- long chapter content;
- tables;
- code blocks;
- equations;
- very long titles;
- empty search state;
- many search results;
- source link correctness.

---

## 28. Security and privacy

The current site is a public read-only research archive and should keep its attack surface small.

Principles:

- do not execute arbitrary Markdown scripts;
- sanitize or constrain embedded HTML;
- use safe external-link behavior;
- avoid unnecessary client secrets;
- do not add analytics/tracking by default without explicit product need;
- if user accounts/saved trails are added, treat private research notes as private data;
- if semantic search is added, keep retrieval provenance visible.

---

## 29. Deployment model

Near-term target:

- GitHub as source repository;
- CI on every relevant change;
- Vercel or equivalent Next.js-compatible hosting;
- preview deployments for UI review;
- production deployment from validated `main`.

Deployment is not considered complete until:

- build is green;
- responsive UI has been inspected;
- light/dark themes have been inspected;
- primary archive/search/chapter flows work;
- public URL is documented.

---

## 30. Development phases

### Phase 0 — Research corpus foundation

Goal: establish the actual foundational research collection.

Deliverables:

- general foundation chapters;
- AI/ML branch;
- quantum branch;
- cybersecurity branch;
- cross-field combination map;
- emerging research watchlist.

### Phase 1 — Research archive web foundation

Goal: make the corpus discoverable and readable as a Next.js site.

Deliverables:

- Next.js app;
- homepage;
- full archive;
- chapter pages;
- full-text structural search;
- field filtering;
- command palette;
- source links;
- responsive layout;
- light/dark behavior;
- CI.

### Phase 2 — Design-system consolidation

Goal: remove visual inconsistency before adding large new features.

Deliverables:

- IBM Plex Sans + IBM Plex Mono;
- unified typography tokens;
- reduced serif usage;
- refined spacing tokens;
- tighter radius system;
- list-first archive redesign;
- standardized tables/code/equation styling;
- accessibility focus states;
- explicit light/dark token sets;
- canonical SVG logo cleanup.

### Phase 3 — Algorithm-level indexing

Goal: move from chapter discovery to algorithm discovery.

Deliverables:

- algorithm entity extraction/model;
- aliases;
- families;
- assumptions;
- complexity metadata;
- maturity;
- chapter passage references;
- algorithm search/results;
- algorithm detail surface.

### Phase 4 — Atlas

Goal: expose relationships among foundational ideas.

Deliverables:

- relation data model;
- relation authoring/storage format;
- focused graph explorer;
- textual relation panel;
- algorithm neighborhood navigation;
- Archive ↔ Atlas navigation.

### Phase 5 — Lab

Goal: turn relationships into explicit future research workflows.

Deliverables:

- combination records;
- hypothesis templates;
- compatibility/assumption analysis;
- experiment-plan records;
- status/evidence model;
- Atlas ↔ Lab navigation.

### Phase 6 — Research evidence layer

Goal: strengthen provenance and reproducibility.

Deliverables:

- reference entities;
- citation graph;
- implementation links;
- datasets/benchmarks;
- experiment records;
- failed-result tracking;
- maturity evidence;
- diff-aware chapter history.

### Phase 7 — Advanced discovery

Goal: improve retrieval without compromising transparency.

Potential deliverables:

- semantic search;
- passage-level retrieval;
- related-algorithm recommendations;
- saved research trails;
- hypothesis boards;
- contribution workflow.

---

## 31. Phase 2 acceptance criteria

The immediate UI/UX consolidation phase is complete only when all of the following are true:

- [ ] IBM Plex Sans is the single primary UI/research typeface.
- [ ] IBM Plex Mono is used consistently for code and technical identifiers.
- [ ] Hero/title serif overrides have been removed unless explicitly justified.
- [ ] Typography is tokenized.
- [ ] Major spacing values follow the documented scale.
- [ ] Default card radii are reduced to the archival system.
- [ ] Archive is primarily list-based.
- [ ] Field colors are accents rather than large surfaces.
- [ ] Chapter reading width is controlled.
- [ ] Markdown tables are intentionally styled.
- [ ] Mathematics renders through a real math renderer.
- [ ] Code blocks use the mono family and accessible contrast.
- [ ] Light and dark themes both pass visual review.
- [ ] Mobile chapter reading is free of horizontal page overflow.
- [ ] Keyboard focus is visible.
- [ ] CI typecheck and production build pass.

---

## 32. Phase 3 acceptance criteria

Algorithm indexing is complete when:

- [ ] Algorithms are addressable independently of chapter filenames.
- [ ] One algorithm may map to multiple source chapters.
- [ ] Alias search works.
- [ ] Field/family relationships are machine-readable.
- [ ] Algorithm pages link to exact source context where possible.
- [ ] Complexity/assumption fields permit unknown or non-applicable values.
- [ ] Maturity labels are evidence-aware.
- [ ] Search can return algorithms and chapters distinctly.

---

## 33. Atlas acceptance criteria

Atlas is complete enough for first release when:

- [ ] Relationships are stored outside presentation code.
- [ ] A user can search/select an algorithm.
- [ ] The interface shows a focused local graph rather than the entire corpus by default.
- [ ] Relationship types are readable in text, not only encoded by edge color.
- [ ] Nodes link back to research detail.
- [ ] Users can progressively expand relationships.
- [ ] The graph remains usable with keyboard/touch alternatives where practical.
- [ ] Mobile has a non-graph fallback or relationship list.

---

## 34. Lab acceptance criteria

Lab is complete enough for first release when:

- [ ] A combination contains explicit component algorithms/mechanisms.
- [ ] Motivation and hypothesis are distinct fields.
- [ ] Compatibility and conflicts are recorded.
- [ ] Speculation is visibly distinguished from established evidence.
- [ ] Experiments can be attached to combinations.
- [ ] Results can be supported, rejected, or inconclusive.
- [ ] Failed ideas remain preservable as research knowledge.

---

## 35. Non-goals for the near term

Do not prioritize these before the research/archive foundation is strong:

- social feed;
- follower system;
- generic discussion forum;
- real-time collaborative editor;
- complex account system;
- gamification;
- popularity ranking as a primary research signal;
- opaque AI-generated summaries that replace source text;
- graph visualization with no machine-readable research relationships underneath it.

---

## 36. Decision rules for future features

Before adding a feature, ask:

1. Does it improve research discovery, understanding, comparison, provenance, or experimentation?
2. Does it preserve access to the original source/evidence?
3. Can it be represented in a durable data model?
4. Does it introduce unnecessary visual or technical complexity?
5. Does it work for both foundational and emerging algorithms?
6. Does it distinguish evidence from speculation?
7. Does it remain useful if a currently fashionable algorithm family disappears?

If the answer to the first two questions is no, the feature likely does not belong in the core product.

---

## 37. Intended end state

The long-term product should allow a researcher to move naturally through this loop:

```text
Question
   ↓
Search Archive
   ↓
Study algorithm
   ↓
Inspect assumptions and mechanisms
   ↓
Traverse Atlas
   ↓
Discover compatible or conflicting idea
   ↓
Open Lab
   ↓
Form hypothesis
   ↓
Design experiment
   ↓
Attach implementation + evidence
   ↓
Update research knowledge
   ↓
Archive becomes stronger
```

That loop is the intended development direction for Foundation Algorithms.
