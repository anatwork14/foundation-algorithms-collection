import assert from "node:assert/strict";
import test from "node:test";

import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";
import { getReference } from "../lib/references.ts";

test("Diffusers DDPM is commit-pinned with matching revision-1 verification history", () => {
  const implementation = getImplementation("diffusers-ddpm");
  const reference = getReference("ho-2020-ddpm");

  assert.ok(implementation);
  assert.ok(reference);
  assert.equal(implementation.verifiedRef, "main");
  assert.equal(implementation.verifiedCommit, "899c9f3fd0e64f3206781c00c71c28249eff9ca5");
  assert.equal(implementation.lastVerified, "2026-10-06");
  assert.equal(implementation.license, "Apache-2.0");
  assert.equal(implementation.maturity, "Production-proven");
  assert.deepEqual(implementation.algorithmIds, ["diffusion-models"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    ["DDPM scheduler", "DDPM pipeline", "DDPM scheduler tests", "DDPM pipeline tests", "Repository license"],
  );
  assert.match(implementation.implementationNotes.join(" "), /forward add_noise|forward diffusion/i);
  assert.match(implementation.implementationNotes.join(" "), /scheduler\.step/i);
  assert.match(implementation.implementationNotes.join(" "), /CIFAR-10/i);

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);

  const diffusionImplementations = implementationsForAlgorithm("diffusion-models").map((item) => item.id);
  assert.ok(diffusionImplementations.includes(implementation.id));
  assert.deepEqual(reference.algorithmIds, ["diffusion-models"]);
});
