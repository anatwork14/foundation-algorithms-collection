import assert from "node:assert/strict";
import test from "node:test";
import { claims } from "../lib/claims.ts";
import { references } from "../lib/references.ts";
import { relationProvenance } from "../lib/relation-provenance.ts";

const claimById = new Map(claims.map((claim) => [claim.id, claim]));
const referenceById = new Map(references.map((reference) => [reference.id, reference]));

function relationKey(sourceId, relationType, targetId) {
  return `${sourceId}:${relationType}:${targetId}`;
}

const relationByKey = new Map(
  relationProvenance.map((record) => [relationKey(record.sourceId, record.relationType, record.targetId), record]),
);

test("new foundational references are present and directly linked", () => {
  const expectedReferences = [
    ["grover-1996-database-search", "grover-search"],
    ["watkins-dayan-1992-q-learning", "q-learning"],
    ["kalman-1960-linear-filtering", "kalman-filter"],
    ["land-doig-1960-branch-bound", "branch-and-bound"],
    ["jones-1998-efficient-global-optimization", "bayesian-optimization"],
    ["khalil-2016-learning-to-branch", "learned-heuristics"],
    ["khalil-2016-learning-to-branch", "branch-and-bound"],
  ];

  for (const [referenceId, algorithmId] of expectedReferences) {
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
    ["branch-and-bound-valid-bound-pruning", "branch-and-bound", "land-doig-1960-branch-bound"],
    ["bayesian-optimization-surrogate-acquisition", "bayesian-optimization", "jones-1998-efficient-global-optimization"],
  ];

  for (const [claimId, algorithmId, referenceId] of expectedClaims) {
    const claim = claimById.get(claimId);
    assert.ok(claim, `missing claim ${claimId}`);
    assert.ok(claim.algorithmIds.includes(algorithmId), `${claimId} must link ${algorithmId}`);
    assert.ok(claim.referenceIds.includes(referenceId), `${claimId} must link ${referenceId}`);
  }
});

test("learned branching keeps both existing Atlas combination directions source-backed", () => {
  const expectedRelations = [
    ["learned-heuristics", "combines-with", "branch-and-bound"],
    ["branch-and-bound", "combines-with", "learned-heuristics"],
  ];

  for (const [sourceId, relationType, targetId] of expectedRelations) {
    const relation = relationByKey.get(relationKey(sourceId, relationType, targetId));
    assert.ok(relation, `missing source-backed relation ${sourceId} ${relationType} ${targetId}`);
    assert.ok(
      relation.referenceIds.includes("khalil-2016-learning-to-branch"),
      `${sourceId} ${relationType} ${targetId} must cite the learned-branching primary extension`,
    );
  }
});
