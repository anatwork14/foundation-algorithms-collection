import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";

test("Graphormer primary evidence backs the graph-Transformer structural-encoding mechanism", () => {
  const reference = getReference("ying-2021-graphormer");
  const claim = getClaim("graphormer-structural-encoding-attention");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.year, 2021);
  assert.deepEqual(reference.algorithmIds, ["graph-neural-networks", "transformer-attention"]);
  assert.deepEqual(reference.chapterSlugs, ["11-neural-architectures-attention-ssm-moe-gnn"]);
  assert.ok(reference.citations.some((citation) => citation.targetId === "vaswani-2017-attention"));

  assert.ok(claim);
  assert.equal(claim.kind, "Mechanism");
  assert.deepEqual(claim.algorithmIds, reference.algorithmIds);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(claim.chapterSlug, "11-neural-architectures-attention-ssm-moe-gnn");
  assert.equal(
    claim.passageContains,
    "Graph Transformers generalize attention to graph-structured inputs using structural encodings such as:",
  );
});
