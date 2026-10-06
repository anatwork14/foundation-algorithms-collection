import assert from "node:assert/strict";
import test from "node:test";

import { algorithms } from "../lib/algorithms.ts";
import {
  getRelationProvenance,
  relationProvenanceForReference,
} from "../lib/relation-provenance.ts";

test("Graphormer source-backs GNN and Transformer combination edges in both directions", () => {
  const transformer = algorithms.find((algorithm) => algorithm.id === "transformer-attention");
  const gnn = algorithms.find((algorithm) => algorithm.id === "graph-neural-networks");

  assert.ok(transformer);
  assert.ok(gnn);
  assert.ok(transformer.relations.some((relation) =>
    relation.target === "graph-neural-networks" && relation.type === "combines-with"
  ));
  assert.ok(gnn.relations.some((relation) =>
    relation.target === "transformer-attention" && relation.type === "combines-with"
  ));

  const transformerToGnn = getRelationProvenance(
    "transformer-attention",
    "combines-with",
    "graph-neural-networks",
  );
  const gnnToTransformer = getRelationProvenance(
    "graph-neural-networks",
    "combines-with",
    "transformer-attention",
  );

  assert.ok(transformerToGnn);
  assert.ok(gnnToTransformer);
  assert.deepEqual(transformerToGnn.referenceIds, ["ying-2021-graphormer"]);
  assert.deepEqual(gnnToTransformer.referenceIds, ["ying-2021-graphormer"]);
  assert.equal(transformerToGnn.verifiedAt, "2026-10-06");
  assert.equal(gnnToTransformer.verifiedAt, "2026-10-06");

  const graphormerEdges = relationProvenanceForReference("ying-2021-graphormer");
  assert.deepEqual(
    graphormerEdges
      .map((record) => [record.sourceId, record.relationType, record.targetId])
      .sort(),
    [
      ["graph-neural-networks", "combines-with", "transformer-attention"],
      ["transformer-attention", "combines-with", "graph-neural-networks"],
    ],
  );
});
