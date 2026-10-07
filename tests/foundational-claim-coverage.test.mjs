import assert from "node:assert/strict";
import test from "node:test";

import { algorithms } from "../lib/algorithm-catalog.ts";
import { claimsForAlgorithm, getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";

const cases = [
  {
    algorithmId: "dynamic-programming",
    claimId: "dynamic-programming-state-reuse",
    referenceId: "bellman-1952-dynamic-programming",
    doi: "10.1073/pnas.38.8.716",
    passage: "Dynamic programming converts repeated recursive work into a directed acyclic dependency computation whenever the state transitions can be ordered.",
  },
  {
    algorithmId: "bayesian-inference",
    claimId: "bayesian-inference-prior-evidence-posterior",
    referenceId: "gelman-2013-bayesian-data-analysis",
    doi: null,
    passage: "We need a principled way to update prior beliefs after observing evidence.",
  },
  {
    algorithmId: "embedding-models",
    claimId: "embedding-models-continuous-vector-representations",
    referenceId: "mikolov-2013-word-representations",
    doi: null,
    passage: "The word2vec work demonstrated efficient learning of continuous word representations at large scale.",
  },
];

for (const item of cases) {
  test(`${item.algorithmId} has a primary source and passage-backed Claim`, () => {
    const claim = getClaim(item.claimId);
    const reference = getReference(item.referenceId);

    assert.ok(claim);
    assert.ok(reference);
    assert.deepEqual(claim.algorithmIds, [item.algorithmId]);
    assert.deepEqual(claim.referenceIds, [item.referenceId]);
    assert.equal(claim.passageContains, item.passage);
    assert.ok(["Primary method", "Survey / synthesis"].includes(reference.evidenceRole));
    assert.deepEqual(reference.algorithmIds, [item.algorithmId]);
    assert.equal(reference.doi ?? null, item.doi);
  });
}

test("every first-class algorithm has at least one curated Claim", () => {
  const missing = algorithms
    .filter((algorithm) => claimsForAlgorithm(algorithm.id).length === 0)
    .map((algorithm) => algorithm.id)
    .sort();

  assert.deepEqual(missing, []);
});
