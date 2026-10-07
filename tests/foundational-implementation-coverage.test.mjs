import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";

const cases = [
  {
    id: "gensim-word2vec",
    algorithmId: "embedding-models",
    commit: "37f90ec121eb7cd401448a947e80953e0c53ccdc",
    ref: "develop",
    license: "LGPL-2.1",
    labels: ["Word2Vec model", "Word2Vec Cython training kernels", "Word2Vec tests", "Repository license"],
  },
  {
    id: "pymc-posterior-sampling",
    algorithmId: "bayesian-inference",
    commit: "19a783ff4564fcda6340477415b8efdd0f245871",
    ref: "main",
    license: "Apache-2.0",
    labels: ["Posterior sampling entry point", "Native NUTS sampler", "MCMC sampling tests", "Repository license"],
  },
];

for (const item of cases) {
  test(`${item.id} is commit-pinned with matching revision-1 verification history`, () => {
    const implementation = getImplementation(item.id);
    assert.ok(implementation);
    assert.equal(implementation.verifiedCommit, item.commit);
    assert.equal(implementation.verifiedRef, item.ref);
    assert.equal(implementation.lastVerified, "2026-10-07");
    assert.equal(implementation.license, item.license);
    assert.equal(implementation.maturity, "Established open-source");
    assert.deepEqual(implementation.algorithmIds, [item.algorithmId]);
    assert.deepEqual(implementation.sourcePaths.map((path) => path.label), item.labels);

    const history = verificationHistoryForImplementation(item.id);
    assert.equal(history.length, 1);
    assert.equal(history[0].revision, 1);
    assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
    assert.equal(history[0].verifiedRef, implementation.verifiedRef);
    assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);

    assert.ok(implementationsForAlgorithm(item.algorithmId).some((candidate) => candidate.id === item.id));
  });
}

test("Word2Vec and PyMC records preserve their intended scope", () => {
  const word2vec = getImplementation("gensim-word2vec");
  const pymc = getImplementation("pymc-posterior-sampling");
  assert.ok(word2vec);
  assert.ok(pymc);
  assert.match(word2vec.implementationNotes.join(" "), /skip-gram|CBOW/i);
  assert.match(word2vec.implementationNotes.join(" "), /Cython/i);
  assert.match(pymc.implementationNotes.join(" "), /posterior/i);
  assert.match(pymc.implementationNotes.join(" "), /NUTS/i);
  assert.match(pymc.implementationNotes.join(" "), /convergence/i);
});
