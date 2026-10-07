import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("CMFuzz grounds contextual LinUCB mutation selection and both Atlas directions", () => {
  const reference = getReference("wang-2021-cmfuzz");
  const claim = getClaim("linucb-context-aware-fuzz-mutation");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.equal(reference.doi, "10.1007/s10664-020-09927-3");
  assert.deepEqual(reference.algorithmIds, ["linucb", "coverage-guided-fuzzing"]);
  assert.ok(reference.citations.some((citation) => citation.targetId === "li-2010-contextual-bandit-news"));

  assert.ok(claim);
  assert.deepEqual(claim.algorithmIds, reference.algorithmIds);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "LinUCB or Thompson-sampling variants can adapt mutation policy online while preserving exploration.",
  );

  const linucbToFuzz = getRelationProvenance(
    "linucb",
    "combines-with",
    "coverage-guided-fuzzing",
  );
  const fuzzToLinucb = getRelationProvenance(
    "coverage-guided-fuzzing",
    "combines-with",
    "linucb",
  );

  assert.ok(linucbToFuzz);
  assert.ok(fuzzToLinucb);
  assert.deepEqual(linucbToFuzz.referenceIds, [reference.id]);
  assert.deepEqual(fuzzToLinucb.referenceIds, [reference.id]);
  assert.equal(linucbToFuzz.verifiedAt, "2026-10-07");
  assert.equal(fuzzToLinucb.verifiedAt, "2026-10-07");
  assert.match(linucbToFuzz.evidenceNote, /mutation operators|contextual-bandit/i);
});
