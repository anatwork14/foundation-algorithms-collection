import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";
import { getReference } from "../lib/references.ts";

test("Hugging Face SwitchTransformers pins top-1 MoE routing inside Transformer blocks", () => {
  const implementation = getImplementation("hf-switch-transformers");
  const reference = getReference("fedus-2022-switch-transformer");

  assert.ok(implementation);
  assert.ok(reference);
  assert.equal(implementation.verifiedCommit, "8073e6dcaea9aa4b42acf2d92ec72148786bbaeb");
  assert.equal(implementation.verifiedRef, "main");
  assert.equal(implementation.license, "Apache-2.0");
  assert.equal(implementation.maturity, "Established open-source");
  assert.deepEqual(implementation.algorithmIds, ["mixture-of-experts", "transformer-attention"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    [
      "Canonical SwitchTransformers modular source",
      "SwitchTransformers configuration",
      "SwitchTransformers model tests",
      "Repository license",
    ],
  );
  assert.match(implementation.implementationNotes.join(" "), /top-1|argmax expert/i);
  assert.match(implementation.implementationNotes.join(" "), /generated.*excluded/i);
  assert.match(implementation.implementationNotes.join(" "), /one-layer.*sparse/i);

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);

  assert.ok(implementationsForAlgorithm("mixture-of-experts").some((item) => item.id === implementation.id));
  assert.ok(implementationsForAlgorithm("transformer-attention").some((item) => item.id === implementation.id));
  assert.deepEqual(reference.algorithmIds, ["mixture-of-experts", "transformer-attention"]);
});
