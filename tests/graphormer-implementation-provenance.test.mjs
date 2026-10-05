import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation } from "../lib/implementations.ts";
import { getReference } from "../lib/references.ts";

test("Graphormer primary reference records Transformer lineage across graph and attention indexes", () => {
  const reference = getReference("ying-2021-graphormer");
  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.venue, "NeurIPS 2021");
  assert.deepEqual(reference.algorithmIds, ["graph-neural-networks", "transformer-attention"]);
  assert.deepEqual(reference.citations.map((citation) => citation.targetId), ["vaswani-2017-attention"]);
});

test("Microsoft Graphormer is commit-pinned with matching append-only verification history", () => {
  const implementation = getImplementation("microsoft-graphormer");
  assert.ok(implementation);
  assert.equal(implementation.verifiedRef, "main");
  assert.equal(implementation.verifiedCommit, "59c0decffcade9df81d29dcc178a489b31958bab");
  assert.equal(implementation.license, "MIT");
  assert.equal(implementation.maturity, "Established open-source");
  assert.deepEqual(implementation.algorithmIds, ["graph-neural-networks", "transformer-attention"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    ["Graph structural encodings", "Graphormer encoder", "Pretrained-model tests", "Repository README", "Repository license"],
  );
  assert.match(implementation.implementationNotes.join(" "), /legacy environment/i);
  assert.match(implementation.implementationNotes.join(" "), /rather than numerically validating the full graph encoder/i);

  const history = verificationHistoryForImplementation("microsoft-graphormer");
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);
});