import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("detector-graph GNN decoding is passage-backed and sources both surface-code relation directions", () => {
  const reference = getReference("lange-2025-gnn-qec-decoder");
  const claim = getClaim("gnn-surface-code-detector-graph-decoding");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.doi, "10.1103/PhysRevResearch.7.023181");
  assert.deepEqual(reference.algorithmIds, ["graph-neural-networks", "surface-code-decoding"]);
  assert.ok(reference.citations.some((citation) => citation.targetId === "dennis-2002-topological-quantum-memory"));

  assert.ok(claim);
  assert.deepEqual(claim.algorithmIds, reference.algorithmIds);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "Graph neural network decoders can encode stabilizer measurements as detector graphs and predict logical-error classes from the resulting structured syndrome data.",
  );

  const gnnToSurface = getRelationProvenance(
    "graph-neural-networks",
    "combines-with",
    "surface-code-decoding",
  );
  const surfaceToGnn = getRelationProvenance(
    "surface-code-decoding",
    "combines-with",
    "graph-neural-networks",
  );

  assert.ok(gnnToSurface);
  assert.ok(surfaceToGnn);
  assert.deepEqual(gnnToSurface.referenceIds, [reference.id]);
  assert.deepEqual(surfaceToGnn.referenceIds, [reference.id]);
  assert.equal(gnnToSurface.verifiedAt, "2026-10-06");
  assert.equal(surfaceToGnn.verifiedAt, "2026-10-06");
  assert.match(gnnToSurface.evidenceNote, /detector graph|graph classification/i);
});
