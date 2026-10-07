import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("Sparse Mamba surface-code decoding is passage-backed and sources both SSM relation directions", () => {
  const reference = getReference("sayedsalehi-2026-sparse-mamba-qec");
  const claim = getClaim("mamba-surface-code-defect-sequence-decoding");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.venue, "arXiv:2605.17156 (preprint)");
  assert.equal(reference.notices.length, 1);
  assert.equal(reference.notices[0].kind, "Version");
  assert.match(reference.notices[0].note, /preprint|not treated as peer-reviewed/i);
  assert.deepEqual(reference.algorithmIds, ["state-space-models", "surface-code-decoding"]);
  assert.deepEqual(
    reference.citations.map((citation) => citation.targetId).sort(),
    ["dennis-2002-topological-quantum-memory", "gu-2023-mamba"],
  );

  assert.ok(claim);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "Selective state-space decoders can encode active surface-code detection events as a variable-length sequence and process that sequence with a Mamba-style backbone.",
  );

  const ssmToSurface = getRelationProvenance(
    "state-space-models",
    "combines-with",
    "surface-code-decoding",
  );
  const surfaceToSsm = getRelationProvenance(
    "surface-code-decoding",
    "combines-with",
    "state-space-models",
  );

  assert.ok(ssmToSurface);
  assert.ok(surfaceToSsm);
  assert.deepEqual(ssmToSurface.referenceIds, [reference.id]);
  assert.deepEqual(surfaceToSsm.referenceIds, [reference.id]);
  assert.equal(ssmToSurface.verifiedAt, "2026-10-07");
  assert.equal(surfaceToSsm.verifiedAt, "2026-10-07");
  assert.match(ssmToSurface.evidenceNote, /Mamba selective state-space/i);
});
