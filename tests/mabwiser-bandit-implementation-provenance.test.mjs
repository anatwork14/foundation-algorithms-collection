import test from "node:test";
import assert from "node:assert/strict";
import { implementationVerificationHistory } from "../lib/implementation-verification-catalog.ts";
import { implementations } from "../lib/implementations.ts";


test("MABWiser bandit evidence is pinned with matching history and distinct policy scope", () => {
  const record = implementations.find((implementation) => implementation.id === "mabwiser-bandit-core");
  assert.ok(record);
  assert.deepEqual(record.algorithmIds, ["linucb", "ucb1", "thompson-sampling"]);
  assert.equal(record.maturity, "Established open-source");
  assert.equal(record.license, "Apache-2.0");
  assert.equal(record.verifiedRef, "master");
  assert.equal(record.verifiedCommit, "b104071351d532aae977955d19b83872a9c1b1e3");

  for (const suffix of [
    "/mabwiser/mab.py",
    "/mabwiser/linear.py",
    "/mabwiser/ucb.py",
    "/mabwiser/thompson.py",
    "/tests/test_linucb.py",
    "/tests/test_ucb.py",
    "/tests/test_thompson.py",
    "/LICENSE",
  ]) {
    assert.ok(record.sourcePaths.some((source) => source.url.endsWith(suffix)), suffix);
  }

  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("disjoint/per-arm LinUCB") && note.includes("sqrt(x A^-1 x)"),
    ),
  );
  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("2 log(N) / n_i") && note.includes("alpha is configurable"),
    ),
  );
  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("Beta(1,1)") && note.includes("binary rewards") && note.includes("binarizer"),
    ),
  );
  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("does not establish universal superiority") && note.includes("theoretical guarantees"),
    ),
  );

  const history = implementationVerificationHistory.filter((entry) => entry.implementationId === record.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, record.verifiedCommit);
  assert.equal(history[0].verifiedRef, record.verifiedRef);
  assert.deepEqual(history[0].sourcePaths, record.sourcePaths);
});
