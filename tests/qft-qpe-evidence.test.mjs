import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("QFT-based phase-estimation readout is passage-backed and source-backs the quantum relation gaps", () => {
  const reference = getReference("cleve-1998-quantum-algorithms-revisited");
  const claim = getClaim("qft-based-phase-estimation-readout");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.equal(reference.doi, "10.1098/rspa.1998.0164");
  assert.deepEqual(reference.algorithmIds, ["quantum-fourier-transform", "quantum-phase-estimation"]);
  assert.ok(reference.citations.some((citation) => citation.targetId === "kitaev-1995-eigenvalue-measurement"));

  assert.ok(claim);
  assert.deepEqual(claim.algorithmIds, reference.algorithmIds);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "The inverse Fourier transform is central to converting accumulated quantum phases into measurable binary information.",
  );

  const qftToQpe = getRelationProvenance(
    "quantum-fourier-transform",
    "used-by",
    "quantum-phase-estimation",
  );
  const qpeToQft = getRelationProvenance(
    "quantum-phase-estimation",
    "depends-on",
    "quantum-fourier-transform",
  );
  const qpeToQsvt = getRelationProvenance(
    "quantum-phase-estimation",
    "alternative-to",
    "qsvt",
  );

  assert.ok(qftToQpe);
  assert.ok(qpeToQft);
  assert.ok(qpeToQsvt);
  assert.deepEqual(qftToQpe.referenceIds, [reference.id]);
  assert.deepEqual(qpeToQft.referenceIds, [reference.id]);
  assert.deepEqual(qpeToQsvt.referenceIds, ["gilyen-2018-qsvt"]);
  assert.equal(qftToQpe.verifiedAt, "2026-10-06");
  assert.equal(qpeToQft.verifiedAt, "2026-10-06");
  assert.equal(qpeToQsvt.verifiedAt, "2026-10-06");
  assert.match(qpeToQft.evidenceNote, /canonical|iterative/i);
  assert.match(qpeToQsvt.evidenceNote, /not universally interchangeable/i);
});
