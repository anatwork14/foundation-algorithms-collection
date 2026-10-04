import test from "node:test";
import assert from "node:assert/strict";
import { implementationVerificationHistory } from "../lib/implementation-verification-catalog.ts";
import { implementations } from "../lib/implementations.ts";

test("Mamba selective-SSM evidence is pinned with matching history and input-dependent scan scope", () => {
  const record = implementations.find((implementation) => implementation.id === "mamba-selective-ssm");
  assert.ok(record);
  assert.deepEqual(record.algorithmIds, ["state-space-models"]);
  assert.equal(record.maturity, "Established open-source");
  assert.equal(record.license, "Apache-2.0");
  assert.equal(record.verifiedRef, "main");
  assert.equal(record.verifiedCommit, "e9594ce1c732d97440f0332fdc43170a2294dbfa");
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/README.md")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/mamba_ssm/modules/mamba_simple.py")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/mamba_ssm/ops/selective_scan_interface.py")));
  assert.ok(record.sourcePaths.some((source) => source.url.endsWith("/LICENSE")));
  assert.ok(record.implementationNotes.some((note) => note.includes("input-dependent") && note.includes("B") && note.includes("C")));
  assert.ok(record.implementationNotes.some((note) => note.includes("selective_scan_ref") && note.includes("recurrent state")));
  assert.ok(record.implementationNotes.some((note) => note.includes("CUDA selective-scan extension") && note.includes("opt-in")));

  const history = implementationVerificationHistory.filter((entry) => entry.implementationId === record.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, record.verifiedCommit);
  assert.equal(history[0].verifiedRef, record.verifiedRef);
  assert.deepEqual(history[0].sourcePaths, record.sourcePaths);
});
