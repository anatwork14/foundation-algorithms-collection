# Atlas Relationship Authoring Guide

The Atlas is a typed research graph over curated Algorithm entities. Its purpose is to expose reusable structural relationships without turning topical similarity into an unsupported knowledge graph.

Read [`ALGORITHM_AUTHORING.md`](./ALGORITHM_AUTHORING.md), [`CONTRIBUTING.md`](./CONTRIBUTING.md), and [`EVIDENCE_AUTHORING.md`](./EVIDENCE_AUTHORING.md) first.

## Graph model

Atlas edges currently originate from each Algorithm entity's `relations` array:

```ts
{
  target: "target-algorithm-id",
  type: "combines-with",
  note: "Why this relationship exists."
}
```

The UI derives incoming edges automatically. Do not duplicate an inverse edge merely so both Algorithms can display one another.

## What an Atlas edge means

An edge means there is a useful mechanism-level relationship between two curated Algorithms.

It does **not** mean:

- the target is cited by the source's primary paper;
- one method empirically outperforms the other;
- the methods are interchangeable;
- a proposed combination has been experimentally validated;
- the relation is complete or exhaustive.

Paper citation provenance belongs in the Reference graph. Empirical support belongs in Experiments/Replications. Combination hypotheses belong in Lab records.

## Controlled relation types

Use one of the existing types.

### `derived-from`

The source materially extends or adapts ideas from the target.

Example: a contextual confidence-bound method derived from a simpler UCB mechanism.

### `generalizes`

The source covers a broader problem/representation in which the target appears as a narrower case.

### `special-case-of`

The source can be obtained by restricting the target's assumptions, parameters, or representation.

### `alternative-to`

Both methods address a meaningfully overlapping decision/problem role through different mechanisms.

Do not use this merely because two methods occur in the same chapter.

### `combines-with`

The mechanisms have a plausible and inspectable interface for use together.

This is a structural possibility, not evidence that the combination works. If the combination warrants a research hypothesis, add a Lab record separately.

### `depends-on`

The source concept relies on the target mechanism or foundation in a substantive way.

### `used-by`

The source mechanism is commonly used as a component by the target or enables it at the represented abstraction level.

Be especially careful with direction. The note should make the direction obvious.

### `approximates`

The source provides an approximation to the target computation/objective or an otherwise explicit approximate surrogate.

### `secures`

The source provides a security/privacy/integrity mechanism for the target computation or system relationship.

### `accelerates`

The source can reduce computational/system cost for the target without being required for its definition.

## Relation direction

Ask: “Read as a sentence, does `source —type→ target` make sense?”

Examples:

```text
LinUCB —derived-from→ UCB1
Dijkstra —special-case-of→ A*
Bayesian Optimization —depends-on→ Bayesian Inference
HNSW —used-by?→ Embedding Models   # likely wrong direction at this abstraction
Embedding Models —used-by→ HNSW    # also ambiguous: fix the note or choose a clearer relation
```

If a relation label becomes awkward, do not force it. Either choose the correct existing type or leave the edge out until the model supports the distinction cleanly.

## Notes

Every edge must explain why it is present in one concise sentence.

Good notes identify the interface or mechanism:

- “LinUCB carries UCB optimism into a contextual linear reward model.”
- “Symbolic execution uses SMT solving to determine path feasibility and produce satisfying inputs.”
- “HNSW indexes embedding vectors for approximate nearest-neighbor retrieval.”

Avoid notes such as “These are related” or “Useful together.”

## Evidence discipline

The Algorithm relation graph is currently conceptual/structural. It is not a citation or evidence graph.

Therefore:

- do not add `derived-from` solely because one paper cites another;
- do not add `alternative-to` solely because two methods are benchmarked together;
- do not add `combines-with` because a model suggests an interesting hybrid;
- do not encode an empirical result into the edge note.

If a relationship needs source-level proof in the future, add explicit relation-provenance metadata rather than overloading the current edge.

## Cross-field relations

Cross-field edges are valuable when the interface is concrete.

Good examples describe what flows across the boundary:

- embeddings → vector index: vectors become searchable objects;
- learned heuristic → A*: model output becomes a cost-to-go estimate;
- SAT/SMT → symbolic execution: path predicates become solver constraints;
- error-correcting codes → QEC: coding concepts transfer to protected logical information and syndrome decoding;
- lattice foundations → ML-KEM: module-lattice assumptions instantiate a standardized KEM.

Avoid “AI × Quantum” style edges without a mechanism-level interface.

## Duplicates and inverse edges

Validation rejects duplicate relations from one source to the same target/type and self-relations.

Do not add symmetric `combines-with` edges to both entities unless each direction communicates materially different information and the duplication is intentional. The UI already shows inbound and outbound relationships.

## When to create a Lab combination instead

Create or extend a `ResearchCombination` when the relationship needs:

- a falsifiable hypothesis;
- compatibility assumptions;
- tensions/conflicts;
- expected benefits;
- risks;
- metrics;
- experiment plans.

Keep the Atlas edge concise and structural; keep research intent in Lab.

## Graph quality checklist

Before adding an edge:

- [ ] Both Algorithm IDs already exist.
- [ ] The relation is mechanism-level, not mere topical similarity.
- [ ] The direction reads correctly as `source —type→ target`.
- [ ] The selected type matches the intended semantics.
- [ ] The note explains the interface or conceptual dependency.
- [ ] The edge does not smuggle in an unverified citation or empirical result.
- [ ] A Lab record is used instead if the main content is a speculative combination hypothesis.
- [ ] The inverse edge is not duplicated unnecessarily.
- [ ] `npm run test:research` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run build` passes.

The Atlas should remain sparse enough that every visible edge is interpretable. More edges are useful only when they add structure rather than noise.
