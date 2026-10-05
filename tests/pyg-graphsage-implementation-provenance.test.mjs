import assert from "node:assert/strict";
import test from "node:test";
import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation } from "../lib/implementations.ts";

test("PyG GraphSAGE implementation is commit-pinned with matching verification history", () => {
  const implementation = getImplementation("pyg-graphsage");
  const history = verificationHistoryForImplementation("pyg-graphsage");

  assert.ok(implementation);
  assert.deepEqual(implementation.algorithmIds, ["graph-neural-networks"]);
  assert.equal(implementation.license, "MIT");
  assert.equal(implementation.verifiedRef, "master");
  assert.equal(implementation.verifiedCommit, "79d33965a40b7fa83616a9f598a0f8619f25d939");
  assert.deepEqual(
    implementation.sourcePaths.map((source) => source.url),
    [
      "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/torch_geometric/nn/conv/sage_conv.py",
      "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/test/nn/conv/test_sage_conv.py",
      "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/LICENSE",
    ],
  );

  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedAt, implementation.lastVerified);
  assert.equal(history[0].verifiedRef, implementation.verifiedRef);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);
});