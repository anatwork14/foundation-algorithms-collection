# Foundation Algorithms — Product and UI/UX Design

This document records the product intent and interaction principles behind the Next.js research hub. The website is not a separate CMS: the Markdown files in `docs/` remain the canonical research corpus, and the interface is a discovery layer over that source of truth.

## Product purpose

The hub has five jobs:

1. **Archive** — preserve a coherent, durable collection of foundational algorithm research.
2. **Repository** — keep every rendered chapter traceable to its Markdown source on GitHub.
3. **Discovery hub** — make a large technical corpus searchable and browsable without knowing exact filenames.
4. **Research storage** — organize long-form knowledge by field and collection sequence while retaining the raw documents.
5. **Inspiration engine** — make relationships and cross-field combinations visible enough to generate research hypotheses.

The desired feeling is closer to a modern research library than a marketing website: calm, information-rich, legible, and fast.

## Design research

The interface was informed by patterns in modern document search, library discovery, developer documentation, and research repositories.

### Search should be primary

Voyager's Knowledge UI describes a document-focused interface centered on keyword search, faceted refinement, breadcrumbs, result metadata, and a detail view. It explicitly favors a clean search experience over unrelated controls.

Reference: https://voyager.atlassian.net/wiki/spaces/VH/pages/3560735858/Welcome+to+Knowledge+UI+What+s+New

The Next.js documentation also treats `Cmd/Ctrl + K` search as a primary navigation mechanism for large technical information spaces.

Reference: https://nextjs.org/docs

**Applied here:**

- a large search field on the landing page;
- a global `Cmd/Ctrl + K` command search;
- search across title, summary, and chapter text;
- direct navigation from results into the research chapter.

### Quick filters should be visible; deep filtering should not dominate the page

The University of Washington's 2026 Library Search redesign highlighted positive user feedback around prominent quick filters and the ability to avoid a permanently expanded filter wall.

Reference: https://lib.uw.edu/2026/08/12/the-new-uw-libraries-search/

The University of Newcastle similarly describes quick filter tabs plus detailed facets that can remain out of the way until needed.

Reference: https://www.newcastle.edu.au/news/2026/05/library-search-gets-a-new-look-and-some-useful-new-features

**Applied here:**

- research fields appear as lightweight filter pills near search;
- the archive uses a compact sticky toolbar rather than a wide permanent sidebar;
- filters can be cleared without resetting the user's entire navigation context.

### The overview should orient, not overwhelm

Temple University Libraries has evaluated a bento-style “Everything” page as a high-level snapshot across different resource types.

Reference: https://sites.temple.edu/assessment/2026/02/17/revisiting-the-bento-style-everything-page-in-library-search/

**Applied here:**

- the landing page uses a small number of distinct visual regions: atlas, research fields, archive preview, combination lab;
- the full archive intentionally switches back to a dense, calm list;
- research detail pages favor reading over dashboard-like decoration.

### Research detail pages should expose relationships

Drexel's DragonSearch redesign includes related-entity cards and citation trails so a resource can become the start of another research path rather than a dead end.

Reference: https://library.drexel.edu/news-and-events/news/2026/March/Primo-Now-Live

**Applied here:**

- every chapter has a table of contents;
- related chapters from the same field are surfaced beside the reading flow;
- previous/next chapter navigation preserves collection sequence;
- the Combination Lab provides explicit cross-field paths.

### Command interfaces are useful when actions scale

Linear's command-menu design groups a growing action space into a searchable keyboard-first surface.

References:
- https://linear.app/changelog/2019-10-07-contextual-command-menu
- https://linear.app/changelog/2019-12-18-new-command-menu

**Applied here:**

- global search is keyboard accessible;
- the command palette is intentionally limited to navigation/search rather than becoming a second application menu;
- the same search corpus powers both the command palette and archive browsing.

## Information architecture

```text
/
├── orientation / mission
├── global search
├── research fields
├── archive preview
├── combination lab
└── research-use principles

/archive
├── full-text search
├── field filter
├── sort
└── all research chapters

/archive/[slug]
├── source metadata
├── Markdown research content
├── generated table of contents
├── related research
└── previous / next chapter
```

## Research taxonomy

The high-level navigation deliberately separates durable fields from individual algorithm names.

- **Foundations** — general algorithms and reusable computational mechanisms.
- **AI / ML** — learning, neural systems, generative models, reasoning, uncertainty, and adaptation.
- **Quantum** — quantum primitives, algorithms, QEC, fault tolerance, and compilation.
- **Cybersecurity** — cryptographic foundations, PQC, verifiable/private computation, security analysis, and cryptanalysis.
- **Cross-field** — combination maps and emerging research directions.

The numeric Markdown sequence remains visible because it communicates the intended research map and gives stable references such as `08`, `24`, and `40`.

## Visual system

### Tone

The visual system combines a paper/library background with precise technical UI components. It avoids both “enterprise dashboard gray” and overly futuristic neon styling.

### Typography

- UI and metadata: system sans-serif for density and clarity.
- large research headings: system serif stack to evoke papers, books, and archival material.
- code: native monospace through browser defaults.

No hosted font is required for the first version, keeping the site fast and dependency-light.

### Color

The neutral palette represents the archive. Each field gets one restrained identifier:

- Foundations — blue
- AI / ML — violet
- Quantum — teal
- Cybersecurity — warm orange
- Cross-field — ochre

Field colors are identifiers, not full-page themes. This keeps the reading surface consistent.

### Shape

- moderate corner radii rather than extreme “bubble” UI;
- thin borders for archival structure;
- circular orbit mark as the visual identity for interacting algorithm families;
- shadows only where elevation communicates behavior, such as search and hover states.

### Dark mode

Dark mode follows `prefers-color-scheme` automatically. The information hierarchy remains the same; only neutral surfaces and contrast values change.

## Interaction principles

### 1. One source of truth

Do not manually duplicate research content into React objects. `docs/*.md` is loaded at build/server time and generates archive metadata, search text, routes, and rendered chapter pages.

### 2. Search before hierarchy

Users often remember an algorithm concept but not its category. Search therefore remains reachable globally even when reading a chapter.

### 3. Progressive disclosure

The home page provides orientation. `/archive` provides density. Chapter pages provide depth. These modes should not collapse into one overloaded screen.

### 4. Relationships are first-class

The purpose of the collection includes future invention. Combination ideas and neighboring chapters therefore deserve visible UI, not only hyperlinks buried inside prose.

### 5. Preserve research provenance

Every rendered chapter links directly back to the corresponding Markdown file on GitHub.

### 6. Mobile is a reading mode, not a compressed desktop dashboard

On smaller screens:

- navigation collapses;
- domain/archive grids become single-column;
- the TOC becomes a horizontal scroller;
- related sidebar content is removed from the immediate reading flow;
- metadata remains compact.

## Accessibility baseline

- semantic landmarks (`header`, `nav`, `main`, `article`, `aside`, `footer`);
- visible text labels for key actions;
- native inputs/selects for archive controls;
- keyboard shortcut for search without making keyboard use mandatory;
- responsive type sizes;
- color is never the only field label;
- reduced dependence on tiny icon-only controls.

A future acceptance pass should additionally include automated WCAG testing, keyboard-only navigation, screen-reader validation, and contrast checks across both color schemes.

## Future product directions

The current site is deliberately local/static around the repository. Good next layers include:

1. **Algorithm-level indexing** — derive individual algorithm entities from long chapters rather than only indexing chapter documents.
2. **Research graph** — model `algorithm → mechanism → assumption → field → combination` relationships and expose an interactive graph view.
3. **Citation graph** — extract papers and primary references into first-class source records.
4. **Saved research trails** — allow a researcher to collect chapters/algorithms into a temporary path or hypothesis board.
5. **Semantic search** — add embeddings only after keyword and structural search have clear limitations; keep source passages inspectable.
6. **Combination generator** — propose pairings based on compatible interfaces and mismatched assumptions, not random algorithm-name combinations.
7. **Experiment records** — attach benchmark results, implementations, datasets, failures, and reproduction instructions to research hypotheses.
8. **Maturity metadata** — distinguish established foundation, production-proven, active research, emerging, and speculative mechanisms.
9. **Diff-aware archive** — surface what changed in research chapters between commits.
10. **Contribution workflow** — templates for proposing a new algorithm card, combination hypothesis, or evidence update through GitHub.

The central rule for future features: **increase research leverage without hiding the underlying evidence or source material.**
