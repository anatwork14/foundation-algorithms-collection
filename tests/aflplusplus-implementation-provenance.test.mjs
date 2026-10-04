import test from "node:test";
import assert from "node:assert/strict";
import { implementationVerificationHistory } from "../lib/implementation-verification-catalog.ts";
import { implementations } from "../lib/implementations.ts";

test("AFL++ coverage-guided fuzzing evidence is pinned with matching history and scoped licensing", () => {
  const record = implementations.find((implementation) => implementation.id === "aflplusplus-coverage-guided-fuzzing");
  assert.ok(record);
  assert.deepEqual(record.algorithmIds, ["coverage-guided-fuzzing"]);
  assert.equal(record.maturity, "Established open-source");
  assert.match(record.license, /AGPL-3\.0-or-later/);
  assert.match(record.license, /Apache-2\.0/);
  assert.equal(record.verifiedRef, "stable");
  assert.equal(record.verifiedCommit, "dbaf11913c1b2702dee5b4d3dcfffd52f1defe50");
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/README.md")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/docs/afl-fuzz_approach.md")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/src/afl-fuzz-bitmap.c")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/src/afl-fuzz-one.c")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/LICENSE")));

  const history = implementationVerificationHistory.filter((entry) => entry.implementationId === record.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, record.verifiedCommit);
  assert.equal(history[0].verifiedRef, record.verifiedRef);
  assert.deepEqual(history[0].sourcePaths, record.sourcePaths);
});
