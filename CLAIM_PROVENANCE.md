# Curated Claim Provenance

This document defines the claim-level provenance layer in the Foundation Algorithms Research Hub.

A Claim record answers a narrow question:

> **Which exact archive statement is being asserted, where is that statement grounded in the Markdown corpus, and which curated primary or normative sources are attached to it?**

It does **not** mean that every sentence in the linked passage is proven by every linked reference.

---

## 1. Record boundary

The provenance chain is:

```text
Algorithm / concept
        ↓
Curated Claim
        ↓
Unique Markdown passage
        ↓
Primary / normative Reference
```

Claims are manually curated research assertions. Passages are automatically derived source units. References are separately curated evidence records.

These three objects must remain distinct.

---

## 2. Claim kinds

Current controlled values:

- `Mechanism` — describes how an algorithm or system operates;
- `Assumption` — states a condition required by a model, theorem, or practical interpretation;
- `Guarantee` — states a formal or bounded guarantee and should be used conservatively;
- `Standard` — states something normatively specified by a standard;
- `Empirical` — states an empirical finding and must identify the relevant population/benchmark/conditions.

A claim kind is descriptive metadata, not an evidence-strength score.

---

## 3. Required fields

Each `ClaimRecord` stores:

- stable lowercase kebab-case ID;
- controlled claim kind;
- concise statement;
- one or more linked Algorithm IDs;
- one source chapter;
- a literal `passageContains` selector;
- one or more Reference IDs;
- a note preserving scope/limitations.

The literal selector is not displayed as the claim's provenance ID. It is an authoring locator that must resolve to exactly one generated passage during the build.

The resolved passage supplies:

- deterministic passage ID;
- current section heading/anchor;
- exact Markdown line range;
- inspectable passage text;
- GitHub source-line link.

---

## 4. Validation rules

Build-time validation rejects a Claim when:

- its ID is invalid or duplicated;
- its kind is unknown;
- statement, note, selector, Algorithms, or References are missing;
- a linked Algorithm does not exist;
- the source chapter does not exist;
- the passage selector matches zero passages;
- the passage selector matches more than one passage;
- a linked Reference does not exist;
- a linked Reference is not associated with the selected chapter;
- a linked Reference shares no Algorithm with the Claim.

The purpose is to make provenance break loudly when the research corpus evolves.

---

## 5. Writing claims conservatively

Prefer the smallest statement that is useful and supportable.

Good:

> HNSW organizes proximity search into multiple graph layers, using sparse upper layers for long-range navigation and denser lower layers for local refinement.

Avoid:

> HNSW is the best vector database algorithm.

The second statement is evaluative, workload-dependent, and not a stable mechanism claim.

For empirical claims, include the relevant benchmark/population and conditions in the statement or note. Do not generalize a result beyond what the referenced evidence supports.

For standards, attach the normative standard rather than an implementation repository.

For guarantees, identify the assumptions under which the guarantee applies. Do not transform a theoretical result into an unconditional production claim.

---

## 6. Passage selectors

`passageContains` should be:

- literal text that currently exists in the Markdown source;
- long enough to be unique;
- short enough to survive harmless surrounding edits;
- semantically central to the curated claim.

Do not use a generic word such as `algorithm`, `uncertainty`, or `performance`.

Do not hardcode line numbers as the selector. Line numbers are derived provenance metadata and can change when content is edited.

---

## 7. Relationship to passage IDs

Passage IDs are deterministic content-derived identifiers. They are useful for inspection and downstream references, but they can change when the passage text materially changes.

A Claim therefore resolves through a human-readable unique literal selector and then exposes the current passage ID/source range.

If a material edit changes the passage enough that the selector no longer resolves, the build fails and the Claim must be reviewed.

This is intentional.

---

## 8. Relationship to References

A linked Reference means:

> this source is intentionally attached to this curated Claim in the archive.

It does not mean:

> every sentence in the source passage is directly established by this Reference.

When multiple sources play different roles, attach them separately and preserve those roles in the Reference records.

Reference-to-reference citation edges remain a separate graph with their own verification metadata.

---

## 9. Relationship to evidence stages

Claims do not independently advance an Algorithm's evidence stage.

Evidence stages are still derived from actual evidence objects such as References, Implementations, Experiments, Results, and future Replications.

Claims improve **provenance precision**; they are not another quality score or evidence-strength multiplier.

---

## 10. Current seed claims

The initial claim set intentionally remains small:

- LinUCB optimistic contextual score mechanism;
- HNSW hierarchical navigation mechanism;
- FIPS 203 ML-KEM parameter-set standardization.

These records establish the schema and UI pattern before claim coverage expands across the corpus.

---

## 11. Before adding a Claim

Check:

- [ ] Is the statement narrow and descriptive?
- [ ] Is the Claim kind correct?
- [ ] Does the selector match exactly one current passage?
- [ ] Is the passage the right place in the Markdown corpus?
- [ ] Are the attached References primary/normative where possible?
- [ ] Do the attached References overlap the claimed Algorithm/chapter?
- [ ] Does the note preserve important scope or limitations?
- [ ] Does the research integrity build pass?
- [ ] Do Claim/Passage tests pass?

A curated Claim should make uncertainty and provenance more inspectable—not make the archive sound more certain than the evidence warrants.
