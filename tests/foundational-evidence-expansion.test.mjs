import assert from "node:assert/strict";
import test from "node:test";
import { algorithms } from "../lib/algorithm-catalog.ts";
import { claims } from "../lib/claims.ts";
import { getAlgorithmEvidenceGaps } from "../lib/evidence-gaps.ts";
import { references } from "../lib/references.ts";

const algorithmById = new Map(algorithms.map((algorithm) => [algorithm.id, algorithm]));
const claimById = new Map(claims.map((claim) => [claim.id, claim]));
const referenceById = new Map(references.map((reference) => [reference.id, reference]));

test("new foundational evidence records stay connected to the live catalog", () => {
  const expectedReferences = [
    ["grover-1996-database-search", "grover-search"],
    ["watkins-dayan-1992-q-learning", "q-learning"],
    ["kalman-1960-linear-filtering", "kalman-filter"],
  ];

  for (const [referenceId, algorithmId] of expectedReferences) {
    assert.ok(algorithmById.has(algorithmId), `missing algorithm ${algorithmId}`);
    const reference = referenceById.get(referenceId);
    assert.ok(reference, `missing reference ${referenceId}`);
    assert.ok(reference.algorithmIds.includes(algorithmId), `${referenceId} must link ${algorithmId}`);
  }
});

test("new foundational claims retain explicit primary-source links", () => {
  const expectedClaims = [
    ["grover-reflection-amplitude-rotation", "grover-search", "grover-1996-database-search"],
    ["q-learning-off-policy-td-control", "q-learning", "watkins-dayan-1992-q-learning"],
    ["kalman-recursive-gaussian-belief", "kalman-filter", "kalman-1960-linear-filtering"],
    ["differential-privacy-laplace-sensitivity", "differential-privacy", "dwork-2006-calibrating-noise"],
  ];

  for (const [claimId, algorithmId, referenceId] of expectedClaims) {
    const claim = claimById.get(claimId);
    assert.ok(claim, `missing claim ${claimId}`);
    assert.ok(claim.algorithmIds.includes(algorithmId), `${claimId} must link ${algorithmId}`);
    assert.ok(claim.referenceIds.includes(referenceId), `${claimId} must link ${referenceId}`);
  }
});

test("new source-backed foundations no longer report primary-source or curated-claim gaps", () => {
  for (const algorithmId of ["grover-search", "q-learning", "kalman-filter", "differential-privacy"]) {
    const record = getAlgorithmEvidenceGaps(algorithmId);
    assert.ok(record, `missing evidence-gap record for ${algorithmId}`);
    const gapKeys = new Set(record.gaps.map((gap) => gap.key));
    assert.equal(gapKeys.has("primary-source"), false, `${algorithmId} should have a primary source`);
    assert.equal(gapKeys.has("curated-claim"), false, `${algorithmId} should have a curated claim`);
  }
});
