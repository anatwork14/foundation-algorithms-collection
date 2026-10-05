import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";

test("PyG GCN is a commit-pinned executable GNN record with matching verification history", () => {
  const implementation = getImplementation("pyg-gcn");
  assert.ok(implementation);
  assert.equal(implementation.verifiedRef, "master");
  assert.equal(implementation.verifiedCommit, "79d33965a40b7fa83616a9f598a0f8619f25d939");
  assert.equal(implementation.license, "MIT");
  assert.deepEqual(implementation.algorithmIds, ["graph-neural-networks"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    ["GCNConv implementation", "GCNConv tests", "Repository license"],
  );

  const history = verificationHistoryForImplementation("pyg-gcn");
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);
});

test("GNN executable coverage now includes both PyG GCN and GraphSAGE", () => {
  const ids = implementationsForAlgorithm("graph-neural-networks").map((item) => item.id).sort();
  assert.deepEqual(ids, ["pyg-gcn", "pyg-graphsage"]);
});
