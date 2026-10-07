import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("Bayesian optimization is source-backed as a variational-quantum outer-loop option", () => {
  const qaoaReference = getReference("tibaldi-2023-bo-qaoa");
  const vqeReference = getReference("iannelli-2022-noisy-bo-vqe");
  const claim = getClaim("bayesian-optimization-variational-quantum-outer-loop");

  assert.ok(qaoaReference);
  assert.ok(vqeReference);
  assert.equal(qaoaReference.doi, "10.1109/TQE.2023.3325167");
  assert.equal(vqeReference.doi, "10.22323/1.396.0251");
  assert.deepEqual(qaoaReference.algorithmIds, ["bayesian-optimization", "qaoa"]);
  assert.deepEqual(vqeReference.algorithmIds, ["bayesian-optimization", "vqe"]);
  assert.ok(qaoaReference.citations.some((citation) => citation.targetId === "farhi-2014-qaoa"));
  assert.ok(vqeReference.citations.some((citation) => citation.targetId === "peruzzo-2014-vqe"));

  assert.ok(claim);
  assert.deepEqual(claim.referenceIds, [qaoaReference.id, vqeReference.id]);
  assert.equal(
    claim.passageContains,
    "For expensive noisy variational objectives, Bayesian optimization can serve as the classical outer-loop optimizer for VQE or QAOA.",
  );

  const boToQaoa = getRelationProvenance("bayesian-optimization", "combines-with", "qaoa");
  const qaoaToBo = getRelationProvenance("qaoa", "combines-with", "bayesian-optimization");
  const vqeToBo = getRelationProvenance("vqe", "combines-with", "bayesian-optimization");

  assert.ok(boToQaoa);
  assert.ok(qaoaToBo);
  assert.ok(vqeToBo);
  assert.deepEqual(boToQaoa.referenceIds, [qaoaReference.id]);
  assert.deepEqual(qaoaToBo.referenceIds, [qaoaReference.id]);
  assert.deepEqual(vqeToBo.referenceIds, [vqeReference.id]);
  assert.equal(boToQaoa.verifiedAt, "2026-10-07");
  assert.equal(qaoaToBo.verifiedAt, "2026-10-07");
  assert.equal(vqeToBo.verifiedAt, "2026-10-07");
});
