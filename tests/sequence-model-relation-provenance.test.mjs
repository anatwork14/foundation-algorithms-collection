import test from "node:test";
import assert from "node:assert/strict";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("Transformer and selective SSM alternative edges are source-backed in both directions", () => {
  const transformerToSsm = getRelationProvenance(
    "transformer-attention",
    "alternative-to",
    "state-space-models",
  );
  const ssmToTransformer = getRelationProvenance(
    "state-space-models",
    "alternative-to",
    "transformer-attention",
  );

  assert.ok(transformerToSsm);
  assert.ok(ssmToTransformer);
  assert.deepEqual(transformerToSsm.referenceIds, ["gu-2023-mamba"]);
  assert.deepEqual(ssmToTransformer.referenceIds, ["gu-2023-mamba"]);
  assert.equal(transformerToSsm.verifiedAt, "2026-10-05");
  assert.match(transformerToSsm.evidenceNote, /quadratic sequence-length cost of Transformer attention/i);
});
