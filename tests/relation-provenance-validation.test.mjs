import test from "node:test";
import assert from "node:assert/strict";
import { validateRelationProvenance } from "../lib/relation-provenance-validation.ts";

const algorithms = [
  {
    id: "source",
    relations: [{ target: "target", type: "derived-from", note: "Source relation" }],
  },
  { id: "target", relations: [] },
];

const references = [
  { id: "reference-a", algorithmIds: ["source"] },
  { id: "reference-b", algorithmIds: ["unrelated"] },
];

function record(overrides = {}) {
  return {
    sourceId: "source",
    targetId: "target",
    relationType: "derived-from",
    referenceIds: ["reference-a"],
    evidenceNote: "Primary source supports this relation.",
    verifiedAt: "2026-09-30",
    ...overrides,
  };
}

test("a complete relation provenance record validates", () => {
  assert.deepEqual(validateRelationProvenance([record()], algorithms, references), []);
});

test("provenance must match a real typed algorithm relation", () => {
  const errors = validateRelationProvenance([
    record({ relationType: "alternative-to" }),
    record({ sourceId: "missing" }),
    record({ targetId: "missing" }),
  ], algorithms, references);

  assert.ok(errors.some((error) => error.includes("does not match an existing source relation")));
  assert.ok(errors.some((error) => error.includes("source algorithm does not exist")));
  assert.ok(errors.some((error) => error.includes("target algorithm does not exist")));
});

test("provenance rejects duplicate, unknown, and unrelated references", () => {
  const errors = validateRelationProvenance([
    record({ referenceIds: ["reference-a", "reference-a", "missing", "reference-b"] }),
  ], algorithms, references);

  assert.ok(errors.some((error) => error.includes("duplicate reference id")));
  assert.ok(errors.some((error) => error.includes("reference does not exist: missing")));
  assert.ok(errors.some((error) => error.includes("reference reference-b is not linked to either edge endpoint")));
});

test("provenance requires evidence notes, dates, and unique relation keys", () => {
  const errors = validateRelationProvenance([
    record({ evidenceNote: "", verifiedAt: "2026/09/30" }),
    record(),
  ], algorithms, references);

  assert.ok(errors.some((error) => error.includes("Duplicate relation provenance record")));
  assert.ok(errors.some((error) => error.includes("evidence note is required")));
  assert.ok(errors.some((error) => error.includes("verifiedAt must use YYYY-MM-DD")));
});
