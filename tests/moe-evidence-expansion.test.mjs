import assert from "node:assert/strict";
import test from "node:test";
import { getClaim } from "../lib/claims.ts";
import { getReference } from "../lib/references.ts";

test("sparse MoE has a primary reference and passage-backed mechanism claim", () => {
  const reference = getReference("shazeer-2017-sparsely-gated-moe");
  const claim = getClaim("moe-sparse-expert-routing");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.year, 2017);
  assert.equal(reference.url, "https://arxiv.org/abs/1701.06538");
  assert.deepEqual(reference.algorithmIds, ["mixture-of-experts"]);
  assert.deepEqual(reference.chapterSlugs, ["11-neural-architectures-attention-ssm-moe-gnn"]);

  assert.ok(claim);
  assert.equal(claim.kind, "Mechanism");
  assert.deepEqual(claim.algorithmIds, ["mixture-of-experts"]);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(claim.chapterSlug, "11-neural-architectures-attention-ssm-moe-gnn");
  assert.equal(claim.passageContains, "A mixture-of-experts model contains multiple expert networks and a router");
});