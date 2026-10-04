import test from "node:test";
import assert from "node:assert/strict";
import { implementationVerificationHistory } from "../lib/implementation-verification-catalog.ts";
import { implementations } from "../lib/implementations.ts";


test("PennyLane QSVT evidence is pinned with matching history and polynomial-transform scope", () => {
  const record = implementations.find((implementation) => implementation.id === "pennylane-qsvt");
  assert.ok(record);
  assert.deepEqual(record.algorithmIds, ["qsvt"]);
  assert.equal(record.maturity, "Established open-source");
  assert.equal(record.license, "Apache-2.0");
  assert.equal(record.verifiedRef, "main");
  assert.equal(record.verifiedCommit, "04a3038c02ec15874947bfed85cf28ebe84f75be");
  assert.ok(
    record.sourcePaths.some((source) =>
      source.url.endsWith("/pennylane/templates/subroutines/qsvt.py"),
    ),
  );
  assert.ok(
    record.sourcePaths.some((source) =>
      source.url.endsWith("/tests/templates/subroutines/test_qsvt.py"),
    ),
  );
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/LICENSE")));
  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("phase angles") && note.includes("projector-controlled"),
    ),
  );
  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("BlockEncode/FABLE") && note.includes("PrepSelPrep/Qubitization"),
    ),
  );
  assert.ok(
    record.implementationNotes.some(
      (note) => note.includes("asymptotic quantum advantage") && note.includes("block encoding"),
    ),
  );

  const history = implementationVerificationHistory.filter((entry) => entry.implementationId === record.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, record.verifiedCommit);
  assert.equal(history[0].verifiedRef, record.verifiedRef);
  assert.deepEqual(history[0].sourcePaths, record.sourcePaths);
});
