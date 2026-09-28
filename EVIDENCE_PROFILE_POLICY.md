# Evidence Profile and Citation Provenance Policy

This document defines how the Foundation Algorithms Research Hub describes evidence coverage without turning heterogeneous research artifacts into a misleading numeric score.

## 1. Principle

The product must answer:

> **Which evidence layers are present, and where did they come from?**

It must not claim:

> **This algorithm is 87% true, reliable, or scientifically proven.**

Papers, standards, implementations, experiment protocols, empirical results, and independent replications are different evidence objects. They are not interchangeable and should not be collapsed into one scalar rating.

---

## 2. Algorithm evidence stages

Each Algorithm entity receives a derived archive stage based on the evidence records currently linked to it:

1. `Concept only`
   - the curated Algorithm entity exists;
   - no primary Reference has yet been linked.

2. `Source-backed`
   - at least one curated Reference is linked.

3. `Inspectable implementation`
   - at least one verified Implementation record is linked.

4. `Experiment protocol`
   - at least one structured Experiment record exists.

5. `Empirical result`
   - at least one Experiment record contains an explicit result.

6. `Replicated`
   - reserved for future explicit independent-replication records.

Stages are monotonic descriptions of **archive coverage**, not quality rankings. A later stage does not imply that every claim is better supported than every claim at an earlier stage.

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
- a completed experiment does not replace primary literature;
- one positive result is not independent replication.

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

## 5. Citation graph rules

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

---

## 6. Current seeded citation edges

The initial graph intentionally contains only verified edges inside the existing curated source set:

- `zhou-2020-neuralucb` → `li-2010-contextual-bandit-news`
  - NeuralUCB explicitly cites Li et al. (2010) in its discussion of linear contextual bandits.

- `gu-2023-mamba` → `vaswani-2017-attention`
  - Mamba explicitly cites Vaswani et al. (2017) when describing the Transformer as a predominant modern sequence architecture.

More edges should be added only as they are checked.

---

## 7. UI requirements

The UI must:

- label the derived stage as an `Evidence stage` or `Evidence profile`, never a score;
- state that it describes archive coverage, not truth/correctness;
- show evidence dimensions separately;
- expose Reference evidence roles;
- expose citation verification metadata on source pages;
- keep citation graphs sparse and focused rather than implying completeness;
- preserve negative, mixed, failed, and inconclusive experiment results.

---

## 8. Future extensions

The following may be added without changing the core policy:

- first-class independent replication records;
- claim/passage-level source records;
- result-to-reference comparison records;
- historical evidence-stage transitions;
- source retraction/correction metadata;
- benchmark-quality metadata;
- statistical-power/reproduction metadata.

Any future aggregate score must be rejected unless it can preserve the distinctions above and has a clear scientific interpretation. The default remains an inspectable multidimensional profile.
