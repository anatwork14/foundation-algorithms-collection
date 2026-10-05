import assert from "node:assert/strict";
import test from "node:test";
import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";

test("GCN primary source backs normalized-neighbor aggregation claim", () => {
  const reference = getReference("kipf-welling-2017-gcn");
  const claim = getClaim("gcn-normalized-neighbor-aggregation");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.year, 2017);
  assert.deepEqual(reference.algorithmIds, ["graph-neural-networks"]);
  assert.ok(claim);
  assert.equal(claim.kind, "Mechanism");
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(claim.passageContains, "Graph convolutional networks aggregate normalized neighboring features");
});

test("GraphSAGE primary source backs sampled inductive aggregation claim", () => {
  const reference = getReference("hamilton-2017-graphsage");
  const claim = getClaim("graphsage-sampled-inductive-aggregation");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.year, 2017);
  assert.deepEqual(reference.algorithmIds, ["graph-neural-networks"]);
  assert.ok(claim);
  assert.equal(claim.kind, "Mechanism");
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "GraphSAGE learns aggregation functions and can sample neighborhoods, enabling inductive inference on unseen nodes and scaling to larger graphs",
  );
});