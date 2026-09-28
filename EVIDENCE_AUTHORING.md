# Evidence Authoring Guide

This guide defines how to extend the Foundation Algorithms evidence layer without weakening the research archive's provenance.

See also [`EVIDENCE_PROFILE_POLICY.md`](./EVIDENCE_PROFILE_POLICY.md) for the descriptive evidence-stage model, reference roles, and citation-provenance rules.

The governing rule is simple:

> **Concepts, sources, implementations, hypotheses, and empirical results are different kinds of knowledge. Never collapse them into one record.**

The website deliberately separates:

```text
Algorithm / concept
      ↓
Primary reference
      ↓
Implementation
      ↓
Lab hypothesis
      ↓
Experiment
      ↓
Result / limitation
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

Do not use an Algorithm entity to store:

- a bibliography;
- repository-specific behavior;
- a benchmark result;
- a new untested combination claim.

### Source provenance

Algorithm pages automatically resolve heading-level source sections from the live Markdown chapter TOC by matching the algorithm name/aliases.

This is a **navigation/provenance aid**, not claim-level citation proof.

If an important algorithm has no matching heading, improve the Markdown structure or add a future explicit passage record rather than inventing an anchor.

### Evidence profile

Algorithm evidence stages are derived from linked records and describe **archive coverage**, not scientific quality.

Do not manually promote an Algorithm by changing a stage label. Add the missing Reference, Implementation, Experiment, result, or future replication record; the profile should follow the evidence graph.

---

## 2. Reference entities

References live in `lib/references.ts`.

Use a `ReferenceEntity` for a primary paper, standard, or book that materially supports the collection.

Required discipline:

1. Prefer primary sources over summaries.
2. Store an HTTPS canonical source URL when possible.
3. Use DOI metadata when available.
4. Link only to Algorithms / Lab combinations / chapters that the source genuinely informs.
5. Write `summary` as a neutral description of the source.
6. Write `significance` as why the source matters to this archive—not as a claim that the source proves everything linked to it.
7. Assign the controlled `evidenceRole` that describes why the source is in the archive.
8. Add source-to-source citation edges only after direct verification.

### Reference evidence roles

Use one of:

- `Primary method` — introduces/defines the central method represented here;
- `Primary extension` — introduces a material extension/variant;
- `Normative standard` — specifies normative requirements;
- `Survey / synthesis` — synthesizes existing literature;
- `Replication / evaluation` — materially reproduces or independently evaluates an existing method.

The role is descriptive, not a quality grade.

### Citation edges

Citation graph edges use this shape:

```ts
{
  targetId: "another-reference-id",
  note: "Why the citation is known to exist and where it appears.",
  verificationUrl: "https://authoritative-source/...",
  verifiedAt: "2026-09-28"
}
```

Rules:

1. Verify against the source itself or an authoritative proceedings/standards copy.
2. Never infer a citation because two papers are related or chronologically ordered.
3. Never add a citation edge from model memory alone.
4. Keep the note concise and descriptive.
5. A missing edge means **not curated yet**, not **does not cite**.
6. Re-check the verification source when materially editing an edge.

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

Run/build validation must reject broken Algorithm, Combination, chapter, and citation links, as well as malformed citation-verification metadata.

---

## 3. Implementation records

Implementations live in `lib/implementations.ts`.

An implementation record says:

> **There is inspectable code implementing or operationalizing this mechanism.**

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
- short implementation-specific notes;
- direct source paths when available;
- verification date.

### License rule

Do not infer a license from memory. If repository metadata is unclear, store that uncertainty explicitly rather than assigning a familiar license.

### Freshness rule

`lastVerified` means the record was checked on that date. It is not a guarantee that the external repository remains unchanged afterward.

Future work should add explicit release/commit pinning for reproducibility.

---

## 4. Lab hypotheses

Lab records live in the combination catalogs.

A Lab record is **research intent**, not evidence.

It should state:

- components;
- motivation;
- falsifiable hypothesis;
- compatibility/interface assumptions;
- tensions/conflicts;
- expected benefits;
- risks;
- metrics;
- experiment plan;
- explicit status.

Use conservative status labels. A plausible idea remains a hypothesis until evidence changes its state.

---

## 5. Experiment records

Experiments live in `lib/experiments.ts`.

Every experiment should be reproducible enough that another researcher can understand what would count as support or failure **before seeing the outcome**.

Required fields include:

- parent Lab combination;
- Algorithms under test;
- status;
- objective;
- hypothesis;
- baselines;
- datasets/benchmark descriptions;
- metrics;
- environment/configuration controls;
- procedure;
- success criteria;
- artifact slots;
- update date.

### Status meanings

- `Planned` — protocol exists; execution/result does not.
- `Running` — execution is underway; do not report a final conclusion.
- `Completed` — execution finished and a result record exists.
- `Inconclusive` — execution finished but evidence does not support a stable interpretation.
- `Failed` — the experiment could not validly test the hypothesis; preserve why.

### Outcome meanings

When a result exists:

- `Positive` — predefined success criteria were met sufficiently to support the tested claim.
- `Negative` — the tested claim did not meet predefined criteria.
- `Mixed` — material benefits and regressions coexist or results vary meaningfully by condition.
- `Inconclusive` — evidence is insufficient or too unstable for a directional conclusion.

A negative or inconclusive outcome is a useful research artifact and should not be deleted.

### No fabricated results

Never populate a result field because an outcome seems likely, because a paper reported something similar, or because a model predicts what will happen.

Only attach results produced by the specific recorded experiment or a clearly identified imported replication.

---

## 6. Artifact handling

Experiment artifacts may include:

- code/config commit;
- environment lockfile;
- benchmark manifest;
- raw event/log schema;
- result table;
- notebook/report;
- dataset snapshot/reference;
- plots;
- failure notes.

If an artifact is planned but does not exist, keep the slot explicitly pending. Do not use placeholder URLs.

---

## 7. Validation

Current build-time validators cover:

- Algorithm entity identifiers and relation targets;
- Combination component IDs and required fields;
- Reference roles and links to Algorithms, combinations, and chapters;
- Reference citation targets, duplicate/self edges, verification URL, verification note, and verification date;
- Implementation links and required repository metadata;
- Experiment links to Algorithms and combinations and required protocol fields.

A production build is therefore also a structural research-data validation pass.

Validation does **not** prove scientific correctness. Human review remains required for:

- source relevance;
- mathematical correctness;
- implementation interpretation;
- benchmark design;
- statistical validity;
- causal claims;
- conclusion strength.

---

## 8. Naming and IDs

Use stable lowercase kebab-case IDs.

Good:

```text
linucb
quantum-phase-estimation
li-2010-contextual-bandit-news
faiss-hnsw
linucb-fuzzing-scheduler-ablation
```

Avoid encoding temporary UI position, maturity, or status into IDs.

---

## 9. Evidence quality ladder

A useful mental model is:

```text
Idea / open question
        ↓
Structured hypothesis
        ↓
Primary literature / standard
        ↓
Inspectable implementation
        ↓
Predeclared experiment protocol
        ↓
Reproducible result
        ↓
Independent replication / broader evidence
```

The UI calls the derived position an **evidence stage**. It is an archive-coverage description, never a scalar truth or quality score.

Do not visually or textually present lower rungs as if they were higher rungs.

---

## 10. Before committing a new evidence record

Check:

- [ ] Is this the correct record type?
- [ ] Are all IDs stable and linked to real entities?
- [ ] Is the source/repository URL verified?
- [ ] Does every Reference have the correct evidence role?
- [ ] If adding a citation edge, did I record a verification URL, note, and checked date?
- [ ] Are uncertainty and limitations preserved?
- [ ] Is the wording descriptive rather than promotional?
- [ ] For an experiment, were success criteria defined before the result?
- [ ] Are negative/inconclusive outcomes retained?
- [ ] Does `npm run typecheck` pass?
- [ ] Does `npm run build` pass?

The purpose of the Evidence layer is not to make the collection look certain. It is to make the **degree, source, and type of certainty inspectable**.
