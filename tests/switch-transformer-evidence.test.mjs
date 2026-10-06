import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import {
  getRelationProvenance,
  relationProvenanceForReference,
} from "../lib/relation-provenance.ts";

test("Switch Transformer source-backs conditional MoE capacity inside Transformer models", () => {
  const reference = getReference("fedus-2022-switch-transformer");
  const claim = getClaim("switch-transformer-conditional-capacity");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.equal(reference.year, 2022);
  assert.deepEqual(reference.algorithmIds, ["mixture-of-experts", "transformer-attention"]);
  assert.deepEqual(
    reference.citations.map((citation) => citation.targetId).sort(),
    ["shazeer-2017-sparsely-gated-moe", "vaswani-2017-attention"],
  );

  assert.ok(claim);
  assert.equal(claim.kind, "Mechanism");
  assert.deepEqual(claim.algorithmIds, reference.algorithmIds);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(claim.passageContains, "MoE + Transformer");

  const transformerToMoe = getRelationProvenance(
    "transformer-attention",
    "combines-with",
    "mixture-of-experts",
  );
  const moeToTransformer = getRelationProvenance(
    "mixture-of-experts",
    "combines-with",
    "transformer-attention",
  );

  assert.ok(transformerToMoe);
  assert.ok(moeToTransformer);
  assert.deepEqual(transformerToMoe.referenceIds, [reference.id]);
  assert.deepEqual(moeToTransformer.referenceIds, [reference.id]);
  assert.equal(transformerToMoe.verifiedAt, "2026-10-06");
  assert.equal(moeToTransformer.verifiedAt, "2026-10-06");

  assert.equal(relationProvenanceForReference(reference.id).length, 2);
});
