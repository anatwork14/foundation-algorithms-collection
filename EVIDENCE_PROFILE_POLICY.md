# Evidence Profile and Citation Provenance Policy

This document defines how the Foundation Algorithms Research Hub describes evidence coverage without turning heterogeneous research artifacts into a misleading numeric score.

## 1. Principle

The product must answer:

> **Which evidence layers are present, and where did they come from?**

It must not claim:

> **This algorithm is 87% true, reliable, or scientifically proven.**

Papers, standards, claims, implementations, experiment protocols, empirical results, and independent replications are different evidence objects. They are not interchangeable and should not be collapsed into one scalar rating.

---

## 2. Algorithm evidence stages

Each Algorithm entity receives a derived archive stage based on the evidence records currently linked to it:

1. `Concept only`
   - the curated Algorithm entity exists;
   - no primary Reference has yet been linked.

2. `Source-backed`
   - at least one curated Reference is linked.

3. `Inspectable implementation`
   - at least one verified, commit-pinned Implementation record is linked.

4. `Experiment protocol`
   - at least one structured project Experiment record exists.

5. `Empirical result`
   - at least one project Experiment record contains an explicit result.

6. `Replicated`
   - at least one explicit `ReplicationRecord` exists for the Algorithm;
   - that record points to an independently authored Reference classified as `Replication / evaluation`;
   - it also identifies one or more original References being independently evaluated;
   - the independent-evaluation Reference carries an explicit verified citation edge to every original Reference named by the record.

Stages are monotonic descriptions of **archive coverage**, not quality rankings. A later stage does not imply that every claim is better supported than every claim at an earlier stage.

The `Replicated` stage is intentionally outcome-neutral. A valid independent replication record may:

- support the original finding;
- partially support it;
- fail to reproduce it;
- remain inconclusive.

Presence of independent evaluation advances the **coverage stage**. The replication outcome must remain visible separately and must never be converted into an implied truth score.

---

## 3. Evidence dimensions

Algorithm pages expose dimensions independently:

- Primary literature
- Inspectable code
- Project experiments
- Independent replication

A missing dimension is shown as missing. The UI should not silently infer it from another dimension.

Examples:

- a normative standard may be strongly authoritative even with no project experiment;
- a popular implementation does not prove a theoretical guarantee;
- a completed project experiment does not replace primary literature;
- a second implementation is not independent replication;
- one positive project result is not independent replication;
- an independent non-reproduction is still replication evidence, but its outcome must be shown as a non-reproduction rather than as support.

---

## 4. Reference evidence roles

Every `ReferenceEntity` must state why it exists in the archive using one controlled role:

- `Primary method` — introduces or defines the central method/mechanism represented in the archive;
- `Primary extension` — introduces a material extension or variant of an earlier method;
- `Normative standard` — specifies a standard or normative implementation requirement;
- `Survey / synthesis` — synthesizes prior literature rather than introducing the primary mechanism;
- `Replication / evaluation` — materially reproduces, benchmarks, or independently evaluates an existing method.

The role is descriptive. It is not a source-quality grade.

---

## 5. Independent replication records

Independent replication records live in `lib/replications.ts`, are listed at `/replications`, and have dedicated inspectable detail routes at `/replications/[id]`.

A `ReplicationRecord` must contain:

- a stable record ID and title;
- one or more linked Algorithms;
- exactly one curated independent replication/evaluation Reference;
- one or more original References being evaluated;
- a controlled outcome;
- a neutral summary;
- an explicit independence note;
- a verification date.

Validation rules:

1. The independent source must already exist as a curated Reference.
2. Its `evidenceRole` must be `Replication / evaluation`.
3. The independent source must link every Algorithm claimed by the replication record.
4. Every original Reference must exist and link every claimed Algorithm.
5. The independent source cannot also be listed as an original source.
6. The independent-evaluation Reference must explicitly cite every original Reference named by the replication record; those citation edges carry their own verification metadata.
7. Duplicate original sources are rejected.
8. Independence must be described rather than assumed from author names or repository differences.
9. Do not create a replication record from this project's own experiment; that remains a project Experiment record.
10. Do not infer replication merely because multiple implementations exist.
11. Do not infer replication from a second paper that cites, extends, or compares a method without materially reproducing/evaluating it.

A zero-record catalog is valid whenever no source clears these rules. Zero is preferable to fabricated or weakly inferred replication coverage.

### Current first curated independent evaluation

The first curated record is:

- `aumuller-2020-hnsw-evaluation`
  - Algorithm: `hnsw`
  - independent source: Aumüller, Bernhardsson, and Faithfull, *ANN-Benchmarks: A Benchmarking Tool for Approximate Nearest Neighbor Algorithms*;
  - original source: Malkov and Yashunin, *Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs*;
  - outcome: `Partially supports`.

The outcome is deliberately conservative. ANN-Benchmarks independently evaluates HNSW in a common multi-algorithm benchmark and supports strong practical high-recall performance, while also documenting settings where graph-based methods can be tripped up. The record therefore does **not** claim that every statement, complexity claim, dataset result, or implementation detail in the original HNSW paper has been independently reproduced.

---

## 6. Citation graph rules

Reference-to-reference citation edges must be explicit and verified.

Each edge records:

- `targetId` — the cited Reference entity;
- `note` — why the edge is known to exist;
- `verificationUrl` — the source used to verify the citation;
- `verifiedAt` — the date the edge was checked.

Rules:

1. Never infer an edge because two papers discuss similar ideas.
2. Never infer an edge from chronology alone.
3. Never use model memory alone as verification.
4. Prefer the paper/standard itself or an authoritative proceedings copy.
5. Missing graph edges mean **not curated yet**, not **does not cite**.
6. Build validation must reject broken, duplicate, or self-referential citation edges.
7. A `ReplicationRecord` requires the independent-evaluation Reference to have an explicit citation edge to every original Reference claimed by that record.

---

## 7. Current seeded citation edges

The graph intentionally contains only verified edges inside the curated source set. Examples include:

- `zhou-2020-neuralucb` → `li-2010-contextual-bandit-news`
  - NeuralUCB explicitly cites Li et al. (2010) in its discussion of linear contextual bandits.

- `gu-2023-mamba` → `vaswani-2017-attention`
  - Mamba explicitly cites Vaswani et al. (2017) when describing the Transformer as a predominant modern sequence architecture.

- `aumuller-2020-ann-benchmarks` → `malkov-2018-hnsw`
  - ANN-Benchmarks independently evaluates HNSW and links that evaluation to the original HNSW source.

More edges should be added only as they are checked.

---

## 8. UI requirements

The UI must:

- label the derived stage as an `Evidence stage` or `Evidence profile`, never a score;
- state that it describes archive coverage, not truth/correctness;
- show evidence dimensions separately;
- expose Reference evidence roles;
- expose citation verification metadata on source pages;
- expose independent replication outcome separately from the `Replicated` coverage stage;
- provide inspectable replication detail pages linking the independent source, original sources, and affected Algorithms;
- show zero independent replication records explicitly whenever none are curated;
- keep citation graphs sparse and focused rather than implying completeness;
- preserve negative, mixed, failed, and inconclusive project experiment results;
- preserve supporting, contradicting, partial, and inconclusive independent replication outcomes.

---

## 9. Future extensions

The following may be added without changing the core policy:

- broader independent replication coverage through direct verification;
- result-to-reference comparison records;
- historical evidence-stage transitions;
- Claim wording/provenance history;
- source retraction/correction metadata;
- benchmark-quality metadata;
- statistical-power/reproduction metadata.

Any future aggregate score must be rejected unless it can preserve the distinctions above and has a clear scientific interpretation. The default remains an inspectable multidimensional profile.
