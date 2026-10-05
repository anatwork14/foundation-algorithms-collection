import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";

test("FlashAttention has a primary reference and passage-backed IO-aware exact-attention claim", () => {
  const reference = getReference("dao-2022-flashattention");
  const claim = getClaim("flashattention-io-aware-exact-attention");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.year, 2022);
  assert.deepEqual(reference.algorithmIds, ["transformer-attention"]);
  assert.deepEqual(reference.chapterSlugs, ["11-neural-architectures-attention-ssm-moe-gnn"]);

  assert.ok(claim);
  assert.equal(claim.kind, "Mechanism");
  assert.deepEqual(claim.algorithmIds, ["transformer-attention"]);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(claim.chapterSlug, "11-neural-architectures-attention-ssm-moe-gnn");
  assert.equal(
    claim.passageContains,
    "FlashAttention preserves exact attention semantics while reorganizing computation to reduce expensive memory traffic through tiling and online softmax techniques",
  );
});
