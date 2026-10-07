import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";
import { getReference } from "../lib/references.ts";

test("Lange GNN surface-code decoder is pinned as scoped research/prototyping executable evidence", () => {
  const implementation = getImplementation("lange-gnn-surface-code-decoder");
  const reference = getReference("lange-2025-gnn-qec-decoder");

  assert.ok(implementation);
  assert.ok(reference);
  assert.equal(implementation.verifiedRef, "main");
  assert.equal(implementation.verifiedCommit, "15d8443bedf7862ef72ec1b5239ecd01163eb8d6");
  assert.equal(implementation.lastVerified, "2026-10-07");
  assert.equal(implementation.license, "MIT");
  assert.equal(implementation.maturity, "Research/prototyping");
  assert.deepEqual(implementation.algorithmIds, ["graph-neural-networks", "surface-code-decoding"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    [
      "Decoder training and simulation",
      "GNN model",
      "Syndrome sampling",
      "Distance-3 surface-code config",
      "Distance-9 surface-code config",
      "Training entrypoint",
      "Circuit-level distance-3 checkpoint",
      "Repository README",
      "Repository license",
    ],
  );
  const notes = implementation.implementationNotes.join(" ");
  assert.match(notes, /Stim/i);
  assert.match(notes, /k-nearest-neighbor/i);
  assert.match(notes, /no.*standalone automated.*test suite/i);

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedAt, "2026-10-07");
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);

  assert.ok(implementationsForAlgorithm("graph-neural-networks").some((item) => item.id === implementation.id));
  assert.ok(implementationsForAlgorithm("surface-code-decoding").some((item) => item.id === implementation.id));
  assert.deepEqual(reference.algorithmIds, implementation.algorithmIds);
});
