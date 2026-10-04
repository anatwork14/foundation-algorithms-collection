import test from "node:test";
import assert from "node:assert/strict";
import { implementationVerificationHistory } from "../lib/implementation-verification-catalog.ts";
import { implementations } from "../lib/implementations.ts";

test("MAPIE CQR evidence is pinned with matching history and conformalization scope", () => {
  const record = implementations.find(
    (implementation) => implementation.id === "mapie-conformalized-quantile-regression",
  );
  assert.ok(record);
  assert.deepEqual(record.algorithmIds, ["conformal-prediction"]);
  assert.equal(record.maturity, "Established open-source");
  assert.equal(record.license, "BSD-3-Clause");
  assert.equal(record.verifiedRef, "master");
  assert.equal(record.verifiedCommit, "3b84b8212db2bba452ef5a09ae06a0dd545869ae");
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/README.md")));
  assert.ok(
    record.sourcePaths.some((source) => source.url.endsWith("/mapie/regression/quantile_regression.py")),
  );
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/LICENSE")));
  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("conformity scores") && note.includes("conformalization"),
    ),
  );
  assert.ok(
    record.implementationNotes.some((note) => note.includes("Romano") && note.includes("theoretical authority")),
  );
  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("conditional coverage") && note.includes("distribution shift"),
    ),
  );

  const history = implementationVerificationHistory.filter((entry) => entry.implementationId === record.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, record.verifiedCommit);
  assert.equal(history[0].verifiedRef, record.verifiedRef);
  assert.deepEqual(history[0].sourcePaths, record.sourcePaths);
});
