import test from "node:test";
import assert from "node:assert/strict";
import { implementationVerificationHistory } from "../lib/implementation-verification-catalog.ts";
import { implementationCommitUrl, implementations } from "../lib/implementations.ts";

test("every implementation record pins a full Git commit", () => {
  for (const implementation of implementations) {
    assert.match(implementation.verifiedCommit, /^[0-9a-f]{40}$/);
    assert.ok(implementation.verifiedRef.trim());
  }
});

test("every implementation source path is immutable at the verified commit", () => {
  for (const implementation of implementations) {
    assert.ok(implementation.sourcePaths.length > 0);
    for (const source of implementation.sourcePaths) {
      assert.ok(
        source.url.includes(`/${implementation.verifiedCommit}/`),
        `${implementation.id} has a floating or mismatched source URL: ${source.url}`,
      );
    }
  }
});

test("commit links resolve to the pinned repository revision URL shape", () => {
  for (const implementation of implementations) {
    assert.equal(
      implementationCommitUrl(implementation),
      `${implementation.repository}/commit/${implementation.verifiedCommit}`,
    );
  }
});

test("NetworkX shortest-path evidence covers A* and Dijkstra at one immutable revision", () => {
  const record = implementations.find((implementation) => implementation.id === "networkx-shortest-path-search");
  assert.ok(record);
  assert.deepEqual(record.algorithmIds, ["a-star", "dijkstra"]);
  assert.equal(record.license, "BSD-3-Clause");
  assert.equal(record.verifiedCommit, "31b74e96903d7f873b30c8ff36d71a4c9252b107");
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/networkx/algorithms/shortest_paths/astar.py")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/networkx/algorithms/shortest_paths/weighted.py")));

  const history = implementationVerificationHistory.filter((entry) => entry.implementationId === record.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, record.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, record.sourcePaths);
});

test("PyMatching surface-code decoder evidence is pinned with matching history", () => {
  const record = implementations.find((implementation) => implementation.id === "pymatching-surface-code-decoder");
  assert.ok(record);
  assert.deepEqual(record.algorithmIds, ["surface-code-decoding"]);
  assert.equal(record.license, "Apache-2.0");
  assert.equal(record.verifiedRef, "master");
  assert.equal(record.verifiedCommit, "6f63b2b9474ba0fa7e511fe52bffdce858a06984");
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/src/pymatching/matching.py")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/src/pymatching/sparse_blossom/driver/mwpm_decoding.cc")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/benchmarks/surface_codes/README.md")));

  const history = implementationVerificationHistory.filter((entry) => entry.implementationId === record.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, record.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, record.sourcePaths);
});
