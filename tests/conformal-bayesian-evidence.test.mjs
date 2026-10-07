import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("conformalized ridge comparison sources the conformal-to-Bayesian alternative edge", () => {
  const reference = getReference("burnaev-2014-conformalized-ridge-efficiency");
  const claim = getClaim("conformal-vs-bayesian-ridge-efficiency");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Replication / evaluation");
  assert.equal(reference.venue, "COLT 2014, PMLR 35");
  assert.deepEqual(reference.algorithmIds, ["conformal-prediction", "bayesian-inference"]);

  assert.ok(claim);
  assert.equal(claim.kind, "Guarantee");
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "In Bayesian ridge-regression settings, conformalized prediction sets can provide a calibration-based alternative whose asymptotic efficiency approaches standard Bayesian prediction intervals when the Bayesian assumptions hold.",
  );

  const relation = getRelationProvenance(
    "conformal-prediction",
    "alternative-to",
    "bayesian-inference",
  );
  assert.ok(relation);
  assert.deepEqual(relation.referenceIds, [reference.id]);
  assert.equal(relation.verifiedAt, "2026-10-07");
  assert.match(relation.evidenceNote, /ridge|asymptotic/i);
});
