import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("probabilistic error-correction decoding is passage-backed and source-backs Bayesian inference", () => {
  const reference = getReference("olding-2014-bayesian-error-correction");
  const claim = getClaim("error-correction-posterior-decoding");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.equal(reference.doi, "10.21914/anziamj.v55i0.7817");
  assert.deepEqual(reference.algorithmIds, ["error-correcting-codes", "bayesian-inference"]);

  assert.ok(claim);
  assert.deepEqual(claim.algorithmIds, reference.algorithmIds);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "Probabilistic decoding can be framed as posterior inference over candidate error patterns or codewords conditioned on observed syndrome or soft channel evidence.",
  );

  const relation = getRelationProvenance(
    "error-correcting-codes",
    "combines-with",
    "bayesian-inference",
  );
  assert.ok(relation);
  assert.deepEqual(relation.referenceIds, [reference.id]);
  assert.equal(relation.verifiedAt, "2026-10-07");
  assert.match(relation.evidenceNote, /Bayesian networks|belief propagation/i);
});
