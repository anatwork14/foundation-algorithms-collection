import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";

const cases = [
  {
    id: "fplll-lattice-reduction",
    algorithmId: "lattice-problems",
    commit: "a48096bbd19792eed4267025f924b5095f079e29",
    ref: "master",
    license: "LGPL-2.1-or-later",
    labels: ["LLL implementation", "BKZ implementation", "LLL tests", "BKZ tests", "Repository license"],
  },
  {
    id: "galois-classical-codes",
    algorithmId: "error-correcting-codes",
    commit: "0243840b44e39713dec1f9d48d4faa7581306b3d",
    ref: "main",
    license: "MIT",
    labels: ["BCH implementation", "Reed–Solomon implementation", "BCH tests", "Reed–Solomon tests", "Repository license"],
  },
];

for (const item of cases) {
  test(`${item.id} is commit-pinned with matching revision-1 history`, () => {
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
    assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);
    assert.ok(implementationsForAlgorithm(item.algorithmId).some((candidate) => candidate.id === item.id));
  });
}

test("foundational-gap implementation scopes remain conservative", () => {
  const fplll = getImplementation("fplll-lattice-reduction");
  const galois = getImplementation("galois-classical-codes");
  assert.ok(fplll);
  assert.ok(galois);
  assert.match(fplll.implementationNotes.join(" "), /does not.*security|does not.*insecure/i);
  assert.match(galois.implementationNotes.join(" "), /classical algebraic coding/i);
  assert.match(galois.implementationNotes.join(" "), /surface-code quantum decoding/i);
});
