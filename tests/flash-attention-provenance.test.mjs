import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";
import { getReference, referencesForAlgorithm } from "../lib/references.ts";

test("FlashAttention references preserve method and extension lineage", () => {
  const flash = getReference("dao-2022-flashattention");
  const flash2 = getReference("dao-2024-flashattention-2");

  assert.ok(flash);
  assert.ok(flash2);
  assert.equal(flash.evidenceRole, "Primary method");
  assert.equal(flash.venue, "NeurIPS 2022");
  assert.deepEqual(flash.algorithmIds, ["transformer-attention"]);
  assert.deepEqual(flash.citations.map((citation) => citation.targetId), ["vaswani-2017-attention"]);

  assert.equal(flash2.evidenceRole, "Primary extension");
  assert.equal(flash2.venue, "ICLR 2024");
  assert.deepEqual(flash2.algorithmIds, ["transformer-attention"]);
  assert.deepEqual(flash2.citations.map((citation) => citation.targetId), [flash.id]);
});

test("FlashAttention-2 implementation is immutable and matches revision-1 verification history", () => {
  const implementation = getImplementation("dao-flash-attention-2");
  assert.ok(implementation);
  assert.equal(implementation.verifiedRef, "main");
  assert.equal(implementation.verifiedCommit, "3451a2a67a24eeed8af54d3c5b8d219577113797");
  assert.equal(implementation.license, "BSD-3-Clause");
  assert.equal(implementation.maturity, "Established open-source");
  assert.deepEqual(implementation.algorithmIds, ["transformer-attention"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    ["FA2 package exports", "FA2 public interface", "FA2 canonical tests", "Repository README", "Repository license"],
  );
  assert.match(implementation.implementationNotes.join(" "), /version 2\.8\.4/i);
  assert.match(implementation.implementationNotes.join(" "), /FlashAttention-3 or FlashAttention-4/i);
  assert.match(implementation.implementationNotes.join(" "), /CUDA 12\+/i);
  assert.match(implementation.implementationNotes.join(" "), /ROCm 6\+/i);

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);
});

test("Transformer attention discovery includes FlashAttention sources and executable snapshot", () => {
  const implementationIds = implementationsForAlgorithm("transformer-attention").map((item) => item.id);
  assert.ok(implementationIds.includes("dao-flash-attention-2"));

  const referenceIds = referencesForAlgorithm("transformer-attention").map((item) => item.id);
  assert.ok(referenceIds.includes("dao-2022-flashattention"));
  assert.ok(referenceIds.includes("dao-2024-flashattention-2"));
});