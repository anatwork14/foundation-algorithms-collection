import assert from "node:assert/strict";
import test from "node:test";

import { getReference } from "../lib/references.ts";
import {
  getRelationProvenance,
  relationProvenanceForReference,
} from "../lib/relation-provenance.ts";

test("Anserini HNSW source-backs Transformer dense-retrieval relations in both directions", () => {
  const reference = getReference("ma-2023-anserini-hnsw");
  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.equal(reference.doi, "10.1145/3583780.3615112");
  assert.deepEqual(reference.algorithmIds, ["hnsw", "transformer-attention", "embedding-models"]);
  assert.deepEqual(
    reference.citations.map((citation) => citation.targetId).sort(),
    ["malkov-2018-hnsw", "vaswani-2017-attention"],
  );

  const hnswToTransformer = getRelationProvenance(
    "hnsw",
    "combines-with",
    "transformer-attention",
  );
  const transformerToHnsw = getRelationProvenance(
    "transformer-attention",
    "combines-with",
    "hnsw",
  );

  assert.ok(hnswToTransformer);
  assert.ok(transformerToHnsw);
  assert.deepEqual(hnswToTransformer.referenceIds, [reference.id]);
  assert.deepEqual(transformerToHnsw.referenceIds, [reference.id]);
  assert.equal(hnswToTransformer.verifiedAt, "2026-10-07");
  assert.equal(transformerToHnsw.verifiedAt, "2026-10-07");
  assert.equal(relationProvenanceForReference(reference.id).length, 2);
});

