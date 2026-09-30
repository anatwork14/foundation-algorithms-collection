# Evidence Authoring Guide

This guide defines how to extend the Foundation Algorithms evidence layer without weakening the research archive's provenance.

See also [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md) for the descriptive evidence-stage model, reference roles, citation provenance, and independent-evaluation policy.

The governing rule is simple:

> **Concepts, sources, claims, implementations, hypotheses, project experiments, and independent evaluations are different kinds of knowledge. Never collapse them into one record.**

The website deliberately separates:

```text
Algorithm / concept
      ↓
Primary reference
      ↓
Curated claim ↔ Markdown passage
      ↓
Implementation snapshot
      ↓
Lab hypothesis
      ↓
Project experiment → result / limitation
      ↓
Independent replication / evaluation
```

A link between records means they are related. It does **not** mean that one proves all claims in another.

---

## 1. Algorithm entities

Algorithm entities live in the curated algorithm catalogs under `lib/`.

Use an Algorithm entity for the stable conceptual object:

- name and aliases;
- research fields and families;
- motivation;
- contribution;
- assumptions;
- complexity notes;
- maturity;
- implementation guidance;
- failure modes;
- typed relations;
- tags;
- open questions;
- source chapters.

Do not use an Algorithm entity to store a bibliography, repository-specific behavior, benchmark result, or untested combination claim.

### Source provenance

Algorithm pages resolve heading-level source sections from the live Markdown TOC by matching the Algorithm name/aliases. This is a navigation/provenance aid, not claim-level citation proof.

When a statement needs stronger provenance, add a curated Claim record that resolves to one passage and one or more explicit References.

### Evidence profile

Algorithm evidence stages are derived from linked records and describe **archive coverage**, not scientific quality.

Do not manually promote an Algorithm by changing a stage label. Add the missing Reference, Implementation, Experiment/result, or independently verified Replication record; the profile should follow the evidence graph.

---

## 2. Reference entities

References live in `lib/references.ts`.

Use a `ReferenceEntity` for a paper, standard, or book that materially supports the collection.

Required discipline:

1. Prefer primary sources over summaries.
2. Store an HTTPS canonical source URL when possible.
3. Use DOI metadata when available.
4. Link only to Algorithms / Lab combinations / chapters the source genuinely informs.
5. Write `summary` as a neutral description.
6. Write `significance` as why the source matters to this archive—not as a claim that it proves everything linked to it.
7. Assign the controlled `evidenceRole` describing why the source is present.
8. Add source-to-source citation edges only after direct verification.

### Reference evidence roles

Use one of:

- `Primary method` — introduces/defines the central method;
- `Primary extension` — introduces a material extension/variant;
- `Normative standard` — specifies normative requirements;
- `Survey / synthesis` — synthesizes existing literature;
- `Replication / evaluation` — materially reproduces, benchmarks, or independently evaluates an existing method.

The role is descriptive, not a quality grade.

### Citation edges

Citation graph edges use this shape:

```ts
{
  targetId: "another-reference-id",
  note: "Why the citation is known to exist and where it appears.",
  verificationUrl: "https://authoritative-source/...",
  verifiedAt: "2026-09-30"
}
```

Rules:

1. Verify against the source itself or an authoritative proceedings/standards copy.
2. Never infer a citation because two papers are related or chronologically ordered.
3. Never add a citation edge from model memory alone.
4. Keep the note concise and descriptive.
5. A missing edge means **not curated yet**, not **does not cite**.
6. Re-check the verification source when materially editing an edge.
7. A Reference used as an independent replication/evaluation source must explicitly cite every original Reference named by the corresponding `ReplicationRecord`.

Example Reference shape:

```ts
{
  id: "author-year-short-name",
  title: "...",
  authors: ["..."],
  year: 2026,
  kind: "Paper",
  evidenceRole: "Primary method",
  venue: "...",
  url: "https://...",
  doi: "...",
  algorithmIds: ["..."],
  combinationIds: ["..."],
  chapterSlugs: ["..."],
  citations: [],
  summary: "...",
  significance: "...",
  tags: ["..."]
}
```

---

## 3. Claim records and passage provenance

Claims live in `lib/claims.ts`. Passage records are generated from canonical Markdown and exposed through `/passages`.

Use a Claim record only for an important statement that benefits from explicit inspectable provenance. A Claim must contain:

- a stable lowercase ID;
- a controlled kind (`Mechanism`, `Assumption`, `Guarantee`, `Standard`, or `Empirical`);
- a concise statement that does not overstate the source;
- one or more linked Algorithm IDs;
- one canonical chapter slug;
- a `passageContains` literal resolving to exactly one generated passage;
- one or more explicit Reference IDs;
- a note describing the intended scope/limitation.

Rules:

1. Do not auto-generate Claim records from every paragraph.
2. `passageContains` must be specific enough to match exactly one passage.
3. Every linked Reference must overlap the Claim's Algorithms and source chapter rather than merely being topically related.
4. Prefer primary method papers or normative standards for mechanism/standard claims.
5. The Claim statement should be no stronger than both the Markdown passage and linked source support.
6. Changing Markdown can intentionally break Claim validation; repair the selector only after reviewing whether the claim still maps to the intended passage.

Generated passage IDs and source-line ranges are provenance coordinates. They do not replace the Claim's human-curated source interpretation.

---

## 4. Implementation records

Implementations live in `lib/implementations.ts`.

An implementation record says:

> **There is inspectable code implementing or operationalizing this mechanism at a specific verified revision.**

It does not say:

> **This repository is the canonical or correct implementation.**

Before adding a record, verify the repository and relevant code paths directly.

Record:

- repository URL;
- project homepage if useful;
- linked Algorithm IDs;
- primary language;
- important interfaces;
- license metadata exactly/conservatively;
- implementation maturity;
- implementation-specific notes;
- `verifiedRef` describing the inspected branch/ref;
- full 40-character `verifiedCommit` Git SHA;
- source paths pinned to that exact commit;
- verification date.

### License rule

Do not infer a license from memory. If repository metadata is unclear, store that uncertainty explicitly.

### Immutable source rule

Every implementation source URL must contain the declared `verifiedCommit`. Do not store floating `blob/main`, `tree/main`, `blob/master`, or equivalent source links as evidence paths.

### Freshness rule

`lastVerified` records when the pinned revision and metadata were inspected. The exact commit preserves reproducibility even if the upstream branch moves later.

---

## 5. Lab hypotheses

Lab records live in the combination catalogs.

A Lab record is **research intent**, not evidence. It should state components, motivation, falsifiable hypothesis, compatibility assumptions, tensions, expected benefits, risks, metrics, experiment plan, and explicit status.

The arbitrary-pair Lab analyzer may surface rule-based assumption compatibility/tension signals. These signals are transparent heuristics over curated assumption text, not proof that a combination will or will not work.

---

## 6. Experiment records

Experiments live in `lib/experiments.ts`.

Every experiment should be reproducible enough that another researcher can understand what would count as support or failure **before seeing the outcome**.

Required fields include parent Lab combination, Algorithms under test, status, objective, hypothesis, baselines, datasets/benchmarks, metrics, environment controls, procedure, success criteria, artifact slots, and update date.

### Status meanings

- `Planned` — protocol exists; execution/result does not.
- `Running` — execution is underway; do not report a final conclusion.
- `Completed` — execution finished and a result record exists.
- `Inconclusive` — execution finished but evidence does not support a stable interpretation.
- `Failed` — the experiment could not validly test the hypothesis; preserve why.

### Outcome meanings

- `Positive` — predefined success criteria were met sufficiently to support the tested claim.
- `Negative` — the tested claim did not meet predefined criteria.
- `Mixed` — material benefits and regressions coexist or results vary meaningfully by condition.
- `Inconclusive` — evidence is insufficient or too unstable for a directional conclusion.

Negative and inconclusive outcomes are useful research artifacts and must not be deleted.

### No fabricated results

Never populate a result because an outcome seems likely, because another paper reported something similar, or because a model predicts what will happen.

Only attach results produced by the specific recorded experiment or a clearly identified imported independent evaluation.

---

## 7. Independent replication / evaluation records

Independent records live in `lib/replications.ts`, are listed at `/replications`, and have detail pages at `/replications/[id]`.

Use a `ReplicationRecord` only when a separately authored source materially reproduces, benchmarks, or independently evaluates an existing curated method.

Required fields:

- stable record ID/title;
- one or more Algorithm IDs;
- exactly one independently authored Reference whose role is `Replication / evaluation`;
- one or more original References being evaluated;
- controlled outcome (`Supports original finding`, `Partially supports`, `Does not reproduce`, or `Inconclusive`);
- neutral summary;
- explicit independence note;
- verification date.

### Replication authoring rules

1. Directly inspect the independent evaluation source before adding a record.
2. Do not infer independence merely because a source has different authors; explain the independent evaluation setup in `independenceNote`.
3. The independent Reference must link every Algorithm claimed by the record.
4. Every original Reference must link every Algorithm claimed by the record.
5. The independent Reference and original Reference(s) must be distinct.
6. The independent Reference must contain an explicit verified citation edge to every original Reference named by the record.
7. A second implementation is not replication.
8. A project Experiment in this repository is not independent replication.
9. A paper that merely cites or extends an earlier method is not automatically replication/evaluation evidence.
10. Keep outcome separate from evidence stage. `Replicated` means independent evaluation exists; it does not mean the result was positive.
11. Use `Partially supports` when only part of the original practical/theoretical scope is independently supported.
12. Preserve non-reproduction and inconclusive outcomes without downgrading or deleting the record.

The first curated example is `aumuller-2020-hnsw-evaluation`, which links ANN-Benchmarks to the original HNSW source with a conservative `Partially supports` outcome.

---

## 8. Artifact handling

Experiment artifacts may include code/config commits, environment lockfiles, benchmark manifests, raw event/log schemas, result tables, notebooks/reports, dataset references, plots, and failure notes.

If an artifact is planned but does not exist, keep the slot explicitly pending. Do not use placeholder URLs.

---

## 9. Validation

Current build-time validators cover:

- Algorithm identifiers and relation targets;
- Combination component IDs and required fields;
- Reference roles and links to Algorithms, combinations, and chapters;
- Reference citation targets, duplicate/self edges, verification URL/note/date;
- first-class Atlas relation provenance and its overlap with real typed edges and curated References;
- Claim IDs, Algorithm/Reference/chapter links, and unique passage resolution;
- Passage IDs, source-line ranges, and live TOC anchors;
- Implementation links, immutable commit pins, and repository metadata;
- Experiment links to Algorithms/combinations and required protocol/result fields;
- Replication source role, Algorithm overlap, original-source separation, explicit original-source citation edges, independence note, and verification date.

The research utility suite additionally exercises passage search, Claim resolution, evidence-stage derivation, Markdown processing, citation validation, relation provenance, assumption analysis, entity graph validation, immutable implementation pins, experiments, and independent replications.

A production build is therefore also a structural research-data validation pass.

Validation does **not** prove scientific correctness. Human review remains required for source relevance, mathematical correctness, implementation interpretation, benchmark design, statistical validity, causal claims, independence, and conclusion strength.

---

## 10. Naming and IDs

Use stable lowercase kebab-case IDs.

Good:

```text
linucb
quantum-phase-estimation
li-2010-contextual-bandit-news
faiss-hnsw
linucb-fuzzing-scheduler-ablation
aumuller-2020-hnsw-evaluation
```

Avoid encoding temporary UI position, maturity, or status into IDs.

---

## 11. Evidence quality ladder

A useful mental model is:

```text
Idea / open question
        ↓
Structured hypothesis
        ↓
Primary literature / standard
        ↓
Curated claim + source passage
        ↓
Inspectable pinned implementation
        ↓
Predeclared project experiment protocol
        ↓
Reproducible project result
        ↓
Independent replication / evaluation
```

The UI calls the derived position an **evidence stage**. It is an archive-coverage description, never a scalar truth or quality score.

Do not visually or textually present lower rungs as if they were higher rungs, and do not interpret a later stage as automatically positive evidence.

---

## 12. Before committing a new evidence record

Check:

- [ ] Is this the correct record type?
- [ ] Are all IDs stable and linked to real entities?
- [ ] Is the source/repository URL directly verified?
- [ ] Does every Reference have the correct evidence role?
- [ ] If adding a citation edge, did I record a verification URL, note, and checked date?
- [ ] If adding a Claim, does its selector resolve to exactly one passage and do all References directly support its scope?
- [ ] If adding an Implementation, are all source links pinned to its full verified commit SHA?
- [ ] If adding a Replication record, is the evaluation genuinely independent and does its Reference explicitly cite every original Reference named by the record?
- [ ] Is the replication outcome conservative and separate from the derived evidence stage?
- [ ] Are uncertainty and limitations preserved?
- [ ] Is the wording descriptive rather than promotional?
- [ ] For an experiment, were success criteria defined before the result?
- [ ] Are negative/inconclusive outcomes retained?
- [ ] Does `npm run test:research` pass?
- [ ] Does `npm run typecheck` pass?
- [ ] Does `npm run build` pass?
- [ ] Does `npm run test:acceptance` pass for user-visible Evidence changes?

The purpose of the Evidence layer is not to make the collection look certain. It is to make the **degree, source, type, and independence of evidence inspectable**.
