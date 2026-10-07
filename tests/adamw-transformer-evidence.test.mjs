import assert from "node:assert/strict";
import test from "node:test";

import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("Swin Transformer source-backs AdamW use in a Transformer architecture", () => {
  const reference = getReference("liu-2021-swin-transformer");
  const relation = getRelationProvenance(
    "adamw",
    "used-by",
    "transformer-attention",
  );

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.equal(reference.year, 2021);
  assert.deepEqual(reference.algorithmIds, ["transformer-attention", "adamw"]);
  assert.deepEqual(
    reference.citations.map((citation) => citation.targetId).sort(),
    ["loshchilov-2019-adamw", "vaswani-2017-attention"],
  );
  assert.ok(reference.citations.every((citation) => citation.verifiedAt === "2026-10-08"));

  assert.ok(relation);
  assert.deepEqual(relation.referenceIds, [reference.id]);
  assert.equal(relation.verifiedAt, "2026-10-08");
  assert.match(relation.evidenceNote, /Swin Transformer architecture with AdamW/i);
  assert.match(relation.evidenceNote, /does not imply/i);
});
