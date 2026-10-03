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
    ["cadar-2008-klee", "symbolic-execution"],
    ["cadar-2008-klee", "sat-smt-solving"],
    ["dennis-2002-topological-quantum-memory", "error-correcting-codes"],
    ["dennis-2002-topological-quantum-memory", "surface-code-decoding"],
    ["stephens-2016-driller", "coverage-guided-fuzzing"],
    ["stephens-2016-driller", "symbolic-execution"],
    ["de-moura-bjorner-2008-z3", "sat-smt-solving"],
    ["gentry-2009-fully-homomorphic-encryption", "fhe"],
    ["gentry-2009-fully-homomorphic-encryption", "lattice-problems"],
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
    ["symbolic-execution-solver-concretization", "symbolic-execution", "cadar-2008-klee"],
    ["surface-code-repeated-syndrome-spacetime-decoding", "surface-code-decoding", "dennis-2002-topological-quantum-memory"],
    ["smt-theory-aware-satisfiability", "sat-smt-solving", "de-moura-bjorner-2008-z3"],
  ];

  for (const [claimId, algorithmId, referenceId] of expectedClaims) {
    const claim = claimById.get(claimId);
    assert.ok(claim, `missing claim ${claimId}`);
    assert.ok(claim.algorithmIds.includes(algorithmId), `${claimId} must link ${algorithmId}`);
    assert.ok(claim.referenceIds.includes(referenceId), `${claimId} must link ${referenceId}`);
  }
});

test("UCB1 to LinUCB keeps its confidence-bound lineage source-backed", () => {
  const relation = relationByKey.get(relationKey("ucb1", "generalizes", "linucb"));
  assert.ok(relation, "missing source-backed UCB1 → LinUCB generalization relation");
  assert.ok(relation.referenceIds.includes("auer-2002-ucb1"), "UCB1 → LinUCB must cite the UCB1 primary source");
  assert.ok(relation.referenceIds.includes("li-2010-contextual-bandit-news"), "UCB1 → LinUCB must cite the LinUCB primary source");
});

test("learned branching keeps both existing Atlas combination directions source-backed", () => {
  const expectedRelations = [
    ["learned-heuristics", "combines-with", "branch-and-bound"],
    ["branch-and-bound", "combines-with", "learned-heuristics"],
  ];
  for (const [sourceId, relationType, targetId] of expectedRelations) {
    const relation = relationByKey.get(relationKey(sourceId, relationType, targetId));
    assert.ok(relation, `missing source-backed relation ${sourceId} ${relationType} ${targetId}`);
    assert.ok(relation.referenceIds.includes("khalil-2016-learning-to-branch"), `${sourceId} ${relationType} ${targetId} must cite the learned-branching primary extension`);
  }
});

test("symbolic execution keeps both solver-method and consumer-system provenance", () => {
  const relation = relationByKey.get(relationKey("sat-smt-solving", "used-by", "symbolic-execution"));
  assert.ok(relation, "missing source-backed SAT/SMT → Symbolic Execution relation");
  assert.ok(relation.referenceIds.includes("de-moura-bjorner-2008-z3"), "SAT/SMT → Symbolic Execution must cite a primary SMT solver source");
  assert.ok(relation.referenceIds.includes("cadar-2008-klee"), "SAT/SMT → Symbolic Execution must cite the KLEE primary consumer-system source");
});

test("surface-code decoding keeps its coding-theory lineage source-backed", () => {
  const relation = relationByKey.get(relationKey("error-correcting-codes", "used-by", "surface-code-decoding"));
  assert.ok(relation, "missing source-backed Error-Correcting Codes → Surface-Code Decoding relation");
  assert.ok(relation.referenceIds.includes("dennis-2002-topological-quantum-memory"), "Error-Correcting Codes → Surface-Code Decoding must cite the topological quantum memory primary source");
});

test("lattice problems to FHE keeps its original lattice construction source-backed", () => {
  const relation = relationByKey.get(relationKey("lattice-problems", "used-by", "fhe"));
  assert.ok(relation, "missing source-backed Lattice Problems → FHE relation");
  assert.ok(
    relation.referenceIds.includes("gentry-2009-fully-homomorphic-encryption"),
    "Lattice Problems → FHE must cite Gentry's primary FHE construction",
  );
});

test("hybrid fuzzing keeps both Atlas combination directions source-backed", () => {
  const expectedRelations = [
    ["symbolic-execution", "combines-with", "coverage-guided-fuzzing"],
    ["coverage-guided-fuzzing", "combines-with", "symbolic-execution"],
  ];
  for (const [sourceId, relationType, targetId] of expectedRelations) {
    const relation = relationByKey.get(relationKey(sourceId, relationType, targetId));
    assert.ok(relation, `missing source-backed relation ${sourceId} ${relationType} ${targetId}`);
    assert.ok(relation.referenceIds.includes("stephens-2016-driller"), `${sourceId} ${relationType} ${targetId} must cite the Driller hybrid-testing source`);
  }
});
