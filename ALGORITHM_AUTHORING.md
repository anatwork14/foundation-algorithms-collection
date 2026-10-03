# Algorithm Metadata Authoring Guide

Algorithm entities are the stable conceptual index over the Markdown research corpus. They should make reusable mechanisms easier to discover without pretending that a metadata card is a paper, proof, implementation, or experiment.

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md) first.

## What belongs in an Algorithm entity

An `AlgorithmEntity` may contain:

- a stable ID and canonical name;
- aliases;
- research fields and algorithm families;
- source chapter links;
- a concise conceptual summary;
- Motivation and Contribution text;
- explicit assumptions;
- complexity notes;
- conceptual maturity;
- implementation guidance;
- failure modes;
- typed relationships;
- tags;
- open research questions.

It should describe the reusable idea rather than one library's API or one benchmark run.

## IDs

Use stable lowercase kebab-case IDs:

```text
linucb
transformer-attention
quantum-phase-estimation
sat-smt-solving
```

Do not encode UI position, evidence stage, maturity, year, or temporary status in the ID.

Changing an existing ID is a graph migration: References, Implementations, Claims, Experiments, Replications, Lab combinations, Variants, and URLs may depend on it.

## Names and aliases

Use the most established research name as `name`. Put common abbreviations and alternative spellings in `aliases`.

Aliases participate in search and heading-level source discovery, so avoid generic aliases that could collide with unrelated entities.

Validation rejects ambiguous duplicate names/aliases.

## Fields and families

`fields` use the controlled research taxonomy:

- `Foundations`
- `AI / ML`
- `Quantum`
- `Cybersecurity`
- `Cross-field`

Use multiple fields only when the mechanism genuinely spans them.

`families` are more specific structural groupings such as `Graph search`, `Contextual bandits`, `Retrieval`, `Coding theory`, or `Formal methods`. Prefer stable mechanism families over fashionable application labels.

## Source chapters

`chapterSlugs` must point to existing Markdown chapters.

A chapter link means the chapter materially discusses the Algorithm. Heading-level provenance is resolved against the live Markdown TOC; do not invent an anchor in metadata.

If a chapter should support direct heading navigation, improve the chapter heading structure or aliases so the match is explicit.

## Summary

Write one sentence describing the mechanism and its purpose. Avoid:

- marketing language;
- benchmark superiority claims;
- vague statements such as “a powerful modern algorithm”;
- implementation-specific claims that are not intrinsic to the concept.

## Motivation

Explain the pressure that makes the Algorithm useful:

- what naive approach is insufficient;
- what resource, uncertainty, scale, or structure creates the problem;
- why this mechanism exists.

Motivation should not be a historical biography unless history is directly relevant to understanding the mechanism.

## Contribution

State the reusable conceptual move introduced by the method. Examples include:

- storing overlapping subproblem solutions;
- adding an uncertainty bonus to action value;
- navigating a hierarchical proximity graph;
- combining Boolean search with theory reasoning;
- decoupling weight decay from an adaptive optimizer update.

Do not turn Contribution into an unqualified performance claim.

## Assumptions

List conditions that materially affect correctness or usefulness. Good assumptions are falsifiable or inspectable:

- non-negative graph edge weights;
- approximately linear contextual rewards;
- access to a likelihood or simulator;
- a supported logical theory;
- independent/noise assumptions relevant to a decoder.

Do not hide important assumptions only in failure modes.

## Complexity

Complexity may contain time, space, sample, and a free-form note.

Use asymptotics only when they are meaningful for the represented level of abstraction. If a family has multiple variants with different costs, prefer a qualified note over a misleading single bound.

State hidden cost models when they matter: oracle access, model inference, memory bandwidth, communication rounds, circuit depth, measurements, or proof generation.

## First-class variants

Use an `AlgorithmVariantRecord` when a formulation is materially different enough to deserve its own assumptions, tradeoffs, implementation notes, source heading, and stable URL, but still shares the parent's conceptual identity.

Examples in the current catalog are:

```text
LinUCB
├── Disjoint LinUCB
├── Shared LinUCB
└── Hybrid LinUCB
```

A Variant must have:

- a stable kebab-case variant ID;
- one valid `parentAlgorithmId`;
- a canonical name and non-ambiguous aliases;
- a concise summary;
- a `distinction` explaining what changes relative to the parent;
- explicit assumptions;
- tradeoffs rather than one-sided benefits;
- implementation notes;
- optional variant-specific complexity notes;
- at least one source link to an exact live chapter heading;
- stable tags for discovery.

Variant source links are stronger than a chapter-only association: build validation checks both the chapter and the exact TOC anchor. If a heading is renamed, moved, or removed, the integrity build must fail until the record is reconciled.

Do **not** create a Variant merely because a paper or implementation uses a different hyperparameter, backend, optimizer, data structure, or API. Those differences belong in implementation/evidence records unless they change the research formulation itself.

Promote a formulation to a standalone `AlgorithmEntity` instead of a Variant when it develops enough independent identity that it needs its own mechanism-level relationships, evidence profile, research lineage, or conceptual treatment. Examples can include a method that began as an extension but is now routinely studied as a separate algorithm family.

Variants inherit the parent's broad conceptual/evidence context; they do not automatically inherit a claim that every parent guarantee, implementation, benchmark, or replication applies unchanged. Add variant-specific evidence records when that distinction matters scientifically.

## Conceptual maturity

Maturity and evidence stage are intentionally separate.

Use the existing maturity vocabulary conservatively:

- `Established foundation`
- `Production-proven`
- `Active research`
- `Emerging`

Maturity is a curated description of the mechanism's conceptual/adoption state. Evidence stage is automatically derived from linked archive records and must never be set here.

A Variant may override the parent maturity only when there is a clear reason. Otherwise its UI inherits the parent Algorithm's maturity description.

## Implementation guidance

The `implementation` list describes how someone would operationalize the mechanism without binding the entity to one repository.

Good items mention state representation, update rules, numerical choices, invariants, logging, or systems considerations.

Specific executable repositories belong in `ImplementationRecord` entries.

## Failure modes

Failure modes should be concrete enough to change engineering or research decisions. Include issues such as:

- violated assumptions;
- numerical instability;
- state or memory explosion;
- calibration failure;
- distribution shift;
- pathological search structure;
- side-channel leakage;
- approximation or modeling error.

Do not omit a known limitation because it makes the concept look less mature.

## Relationships

Each relation has:

- a valid target Algorithm ID;
- a controlled relation type;
- a short explanatory note.

Available relation types include:

```text
derived-from
generalizes
special-case-of
alternative-to
combines-with
depends-on
used-by
approximates
secures
accelerates
```

A relation should express a mechanism-level connection, not mere topical similarity.

Direction matters. For example, if A is a special case of B, encode the direction that matches the relation label and explain it in the note.

Avoid adding both directions mechanically. The Atlas can display incoming relations without duplicating data.

Do not use Algorithm relationships as a substitute for a Variant when the relationship is really “same parent mechanism, different formulation.” First-class Variant records exist specifically to keep that distinction explicit.

## Tags

Tags aid search. Prefer a small set of stable concepts (`bandit`, `uncertainty`, `graph`, `pqc`) over long keyword stuffing.

## Open questions

An open question should identify a genuine unresolved design or research tension. Good questions connect directly to assumptions, scaling, evidence gaps, or cross-field combinations.

Do not phrase a product roadmap item as a scientific open question.

## Evidence backlinks

Algorithm pages derive their evidence profile from linked records:

- References;
- Claims;
- Implementations;
- Experiments/results;
- independent Replications.

Do not manually adjust an Algorithm entity to make its evidence stage appear stronger. Add the missing evidence record only when it genuinely exists.

Variant pages currently remain subordinate to the parent Algorithm's evidence graph while preserving exact source-section provenance. Add variant-specific evidence linkages only when the evidence actually distinguishes that formulation.

## Validation checklist

Before committing an Algorithm entity:

- [ ] ID is stable lowercase kebab-case.
- [ ] Name and aliases do not collide with existing entities.
- [ ] Every chapter slug exists and materially discusses the concept.
- [ ] Motivation and Contribution describe the mechanism rather than marketing it.
- [ ] Assumptions are explicit.
- [ ] Complexity is qualified for the represented abstraction.
- [ ] Maturity is conservative and not confused with evidence stage.
- [ ] Implementation guidance is repository-independent.
- [ ] Failure modes are concrete.
- [ ] Every relation target exists and relation direction is intentional.
- [ ] Open questions are genuinely unresolved.

Before committing a Variant:

- [ ] Parent Algorithm exists.
- [ ] Variant ID/name/aliases are unique.
- [ ] Distinction from the parent is explicit.
- [ ] Assumptions and tradeoffs are formulation-specific.
- [ ] Every source chapter and exact heading anchor exists.
- [ ] The record is truly a formulation variant rather than an implementation/configuration detail.
- [ ] The formulation does not already deserve a standalone Algorithm entity.

For both record types:

- [ ] `npm run test:research` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.
- [ ] relevant browser acceptance passes.
