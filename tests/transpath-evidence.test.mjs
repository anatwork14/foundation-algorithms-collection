import assert from "node:assert/strict";
import test from "node:test";

import { getImplementation } from "../lib/implementations.ts";
import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("TransPath source-backs Transformer learned heuristics and has a matching immutable implementation snapshot", () => {
  const reference = getReference("kirilenko-2023-transpath");
  const implementation = getImplementation("transpath-transformer-heuristic");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.equal(reference.doi, "10.1609/aaai.v37i10.26465");
  assert.deepEqual(reference.algorithmIds, ["a-star", "learned-heuristics", "transformer-attention"]);
  assert.deepEqual(
    reference.citations.map((citation) => citation.targetId).sort(),
    ["hart-1968-a-star", "vaswani-2017-attention"],
  );

  assert.ok(implementation);
  assert.equal(implementation.verifiedCommit, "7e471c8981ac96996eb5806083b9539477c631a0");
  assert.equal(implementation.verifiedRef, "main");
  assert.equal(implementation.maturity, "Research/prototyping");
  assert.equal(implementation.license, "MIT");
  assert.deepEqual(implementation.algorithmIds, reference.algorithmIds);
  assert.match(implementation.implementationNotes.join(" "), /standalone automated.*test suite/i);

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);

  const aStarToTransformer = getRelationProvenance(
    "a-star",
    "combines-with",
    "transformer-attention",
  );
  const learnedToTransformer = getRelationProvenance(
    "learned-heuristics",
    "combines-with",
    "transformer-attention",
  );

  assert.ok(aStarToTransformer);
  assert.ok(learnedToTransformer);
  assert.deepEqual(aStarToTransformer.referenceIds, [reference.id]);
  assert.deepEqual(learnedToTransformer.referenceIds, [reference.id]);
  assert.equal(aStarToTransformer.verifiedAt, "2026-10-07");
  assert.equal(learnedToTransformer.verifiedAt, "2026-10-07");
});
