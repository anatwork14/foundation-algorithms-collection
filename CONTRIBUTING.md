# Contributing to Foundation Algorithms

Foundation Algorithms is a research archive, not a general-purpose link collection. Contributions should make the archive easier to inspect, reproduce, challenge, and extend without blurring concepts, sources, code, hypotheses, experiments, and results.

Before changing evidence-bearing data, read:

- [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md)
- [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md)
- [`DEVELOPMENT_SPEC.md`](./DEVELOPMENT_SPEC.md)
- [`PROGRESS.md`](./PROGRESS.md)

## Core rule

Treat each kind of research object separately:

```text
Algorithm / concept
      ↓
Source passage + primary reference
      ↓
Inspectable implementation
      ↓
Research hypothesis
      ↓
Experiment protocol
      ↓
Result
      ↓
Independent replication / evaluation
```

A relation between records means they are connected. It does not mean one record proves every claim in another.

## Local validation

Use Node.js 22 and run the same gates used by CI:

```bash
npm install
npm run check:links
npm run check:source
npm run test:research
npm run typecheck
npm run build
```

A production build also runs structural research-integrity validation through the application routes. Do not bypass a validator to make a contribution pass.

## Markdown chapters

The canonical long-form research corpus remains under `docs/`.

When editing a chapter:

- preserve the Motivation / Contribution / Implementation research framing where applicable;
- use headings as meaningful research boundaries because heading slugs participate in navigation and provenance;
- keep mathematical notation renderable in Markdown/KaTeX;
- prefer primary sources, standards, and authoritative books over secondary summaries;
- do not place benchmark claims into prose without enough context to understand population, setup, metric, and limitation;
- preserve negative, mixed, and inconclusive evidence;
- do not rewrite uncertainty into certainty.

Generated passage IDs and line ranges are derived from the Markdown source. Changing prose can therefore change passage provenance and may require Claim selectors to be reviewed.

## Algorithm entities

Algorithm metadata is curated rather than generated from prose.

Use stable lowercase kebab-case IDs and keep conceptual maturity distinct from evidence stage. An Algorithm record may summarize:

- motivation and contribution;
- assumptions;
- complexity notes;
- implementation guidance;
- failure modes;
- typed relationships;
- open research questions;
- source chapters.

Do not put repository-specific behavior, a benchmark result, or a speculative combination result into the Algorithm entity itself.

## Claims

A `ClaimRecord` is a reviewed assertion that joins one archive statement to both:

1. exactly one current Markdown passage; and
2. one or more curated References that materially support the statement.

Rules:

- write the claim narrowly enough to be supported by the linked sources;
- use a `passageContains` literal selector that resolves to exactly one passage;
- link only Algorithm IDs actually discussed by the claim;
- link only References that overlap the claimed Algorithms/chapter;
- keep scope and limitations in the note;
- do not add a Claim merely because a statement sounds plausible.

Build validation rejects zero-match and ambiguous passage selectors.

## References and citation edges

A `ReferenceEntity` should normally represent a primary paper, normative standard, authoritative book, or explicit replication/evaluation source.

Every reference has a controlled evidence role. The role describes why the source is present; it is not a quality score.

Citation graph edges must be directly verified. Record the target, verification URL, concise note, and verification date. Do not infer an edge from topical similarity, chronology, or model memory.

A missing edge means **not curated yet**, not **does not cite**.

## Implementation records

Implementation evidence must be reproducible at an immutable revision.

Before adding a record:

1. inspect the upstream repository directly;
2. record the branch/ref that was inspected;
3. record the exact 40-character Git commit;
4. link source paths using that exact commit, never `main`, `master`, or another moving ref;
5. describe only behavior visible in the inspected code;
6. record license metadata conservatively from the repository itself;
7. record the verification date.

The validator rejects malformed commit pins and source URLs that float or point at a different revision.

A code record means the implementation is inspectable. It does not certify correctness, security, conformance, or canonical status.

## Lab hypotheses and combinations

Lab records are research intent, not evidence.

A combination should make its assumptions and tensions inspectable and contain a falsifiable hypothesis, expected benefits, risks, metrics, and an experiment plan. Use conservative status labels. Do not promote a plausible mechanism to an empirical conclusion.

## Experiments and results

Experiment protocols should define what would count as support or failure before the outcome is attached.

Keep explicit:

- baselines;
- dataset/benchmark descriptions;
- metrics;
- environment and configuration controls;
- procedure;
- success criteria;
- artifact slots;
- status and update date.

Only attach a result produced by the recorded experiment or a clearly identified imported evaluation. Never synthesize a result from a related paper or expected behavior.

Negative, mixed, failed, and inconclusive outcomes are first-class research artifacts and must not be deleted simply because they are inconvenient.

## Independent replications

The `Replicated` evidence stage is reserved for explicit independent replication/evaluation records.

A replication record must identify:

- the independently authored evaluation source;
- the original source or sources being evaluated;
- the Algorithm(s) under evaluation;
- the outcome without forcing it to be positive;
- why the source is independent;
- the verification date.

A supporting, contradicting, mixed, or inconclusive independent outcome can all count as replication coverage. Coverage and outcome are separate dimensions.

Do not create a replication record from an in-project experiment, an implementation repository, or a source authored by the original work unless the independence policy is genuinely satisfied.

## Search and discovery changes

Search behavior must remain inspectable. Current passage ranking is deterministic lexical ranking, not semantic inference.

When changing ranking or filtering:

- add a pure utility where practical;
- add deterministic regression tests;
- keep structural filters and evidence-stage filters semantically distinct;
- do not imply semantic relevance if the system only performed lexical matching;
- preserve direct navigation to the inspectable source passage.

## UI and accessibility

Research content must remain usable without a pointer device.

When changing interactive UI:

- preserve visible `:focus-visible` states;
- provide accessible names for icon-only controls;
- ensure dialogs manage focus correctly;
- keep keyboard traversal deterministic;
- respect reduced-motion preferences;
- avoid using color alone to communicate evidence state or meaning.

Browser, screen-reader, contrast, table, and math acceptance remain separate from build success and should not be marked complete without actual review.

## Static source policy

Application source under `app/`, `components/`, and `lib/` is checked for committed debug statements, broad TypeScript suppression, and unsafe external anchors.

Markdown external URLs are validated structurally without depending on third-party network availability. New research links should use HTTPS unless there is a documented, narrowly scoped exception.

## Pull request checklist

Before proposing a change, verify:

- [ ] The change uses the correct record type.
- [ ] IDs are stable, lowercase kebab-case where applicable, and all graph links resolve.
- [ ] Claims resolve to one unique current passage and explicit supporting References.
- [ ] Implementation source links are pinned to the declared 40-character commit.
- [ ] Citation edges and replication relationships were directly verified.
- [ ] No empirical result was fabricated, inferred, or silently upgraded.
- [ ] Negative/mixed/inconclusive evidence remains visible.
- [ ] Search/ranking changes have deterministic tests.
- [ ] Keyboard and focus behavior remain usable for changed interactive UI.
- [ ] `npm run check:links` passes.
- [ ] `npm run check:source` passes.
- [ ] `npm run test:research` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.

The objective is not to make the archive look certain. It is to make the source, type, scope, and limits of its knowledge inspectable.
