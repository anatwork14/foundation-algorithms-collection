import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("DDPM and Flow Matching have primary references and live-passage mechanism claims", () => {
  const ddpm = getReference("ho-2020-ddpm");
  const flow = getReference("lipman-2023-flow-matching");
  const ddpmClaim = getClaim("ddpm-forward-noise-reverse-denoising");
  const flowClaim = getClaim("flow-matching-vector-field-regression");

  assert.ok(ddpm);
  assert.ok(flow);
  assert.equal(ddpm.evidenceRole, "Primary method");
  assert.equal(flow.evidenceRole, "Primary method");
  assert.deepEqual(ddpm.algorithmIds, ["diffusion-models"]);
  assert.deepEqual(flow.algorithmIds, ["flow-matching", "diffusion-models"]);
  assert.ok(flow.citations.some((citation) => citation.targetId === ddpm.id));

  assert.ok(ddpmClaim);
  assert.ok(flowClaim);
  assert.deepEqual(ddpmClaim.referenceIds, [ddpm.id]);
  assert.deepEqual(flowClaim.referenceIds, [flow.id]);
  assert.equal(
    ddpmClaim.passageContains,
    "Generation becomes iterative denoising from a simple noise distribution toward the data distribution.",
  );
  assert.equal(
    flowClaim.passageContains,
    "Instead of simulating stochastic diffusion during training, directly learn a vector field that transports samples along a chosen probability path.",
  );
});

test("Diffusion and Flow Matching alternative edges are source-backed in both directions", () => {
  const diffusionToFlow = getRelationProvenance(
    "diffusion-models",
    "alternative-to",
    "flow-matching",
  );
  const flowToDiffusion = getRelationProvenance(
    "flow-matching",
    "alternative-to",
    "diffusion-models",
  );

  assert.ok(diffusionToFlow);
  assert.ok(flowToDiffusion);
  assert.deepEqual(diffusionToFlow.referenceIds, ["ho-2020-ddpm", "lipman-2023-flow-matching"]);
  assert.deepEqual(flowToDiffusion.referenceIds, ["lipman-2023-flow-matching", "ho-2020-ddpm"]);
  assert.equal(diffusionToFlow.verifiedAt, "2026-10-06");
  assert.equal(flowToDiffusion.verifiedAt, "2026-10-06");
});
