import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";
import { getReference } from "../lib/references.ts";

test("Meta Flow Matching is pinned as research/prototyping executable evidence", () => {
  const implementation = getImplementation("meta-flow-matching");
  const reference = getReference("lipman-2023-flow-matching");

  assert.ok(implementation);
  assert.ok(reference);
  assert.equal(implementation.verifiedRef, "main");
  assert.equal(implementation.verifiedCommit, "11568d37f8d5a080e12aa7b5305d9c35ae07d136");
  assert.equal(implementation.license, "CC BY-NC 4.0");
  assert.equal(implementation.maturity, "Research/prototyping");
  assert.deepEqual(implementation.algorithmIds, ["flow-matching"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    [
      "Probability-path abstraction",
      "Affine probability path",
      "Path sample and velocity target",
      "ODE solver",
      "Probability-path tests",
      "ODE-solver tests",
      "Repository README",
      "Repository license",
    ],
  );
  assert.match(implementation.implementationNotes.join(" "), /dx_t/i);
  assert.match(implementation.implementationNotes.join(" "), /CC BY-NC 4\.0/i);
  assert.match(implementation.implementationNotes.join(" "), /Research\/prototyping/i);

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);

  assert.ok(implementationsForAlgorithm("flow-matching").some((item) => item.id === implementation.id));
  assert.ok(reference.algorithmIds.includes("flow-matching"));
});
