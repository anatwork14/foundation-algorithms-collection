import test from "node:test";
import assert from "node:assert/strict";
import { implementationVerificationHistory } from "../lib/implementation-verification-catalog.ts";
import { implementations } from "../lib/implementations.ts";

test("SCIP branch-and-bound evidence is pinned with matching history and cutoff scope", () => {
  const record = implementations.find((implementation) => implementation.id === "scip-branch-and-bound");
  assert.ok(record);
  assert.deepEqual(record.algorithmIds, ["branch-and-bound"]);
  assert.equal(record.maturity, "Established open-source");
  assert.equal(record.license, "Apache-2.0");
  assert.equal(record.verifiedRef, "master");
  assert.equal(record.verifiedCommit, "ab66fc1bbadc22fa7b03c72e3dd0d30c404e0a53");
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/README.md")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/src/scip/scip_branch.c")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/src/scip/tree.c")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/src/scip/primal.c")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/LICENSE")));
  assert.ok(record.implementationNotes.some((note) => note.includes("lower bound") && note.includes("cutoff bound")));
  assert.ok(record.implementationNotes.some((note) => note.includes("objective-integrality") && note.includes("exact mode")));

  const history = implementationVerificationHistory.filter((entry) => entry.implementationId === record.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, record.verifiedCommit);
  assert.equal(history[0].verifiedRef, record.verifiedRef);
  assert.deepEqual(history[0].sourcePaths, record.sourcePaths);
});
