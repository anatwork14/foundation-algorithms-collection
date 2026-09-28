import test from "node:test";
import assert from "node:assert/strict";
import { validateReplications } from "../lib/replication-validation.ts";

const algorithms = [{ id: "algorithm-a" }];
const references = [
  { id: "original-a", evidenceRole: "Primary method", algorithmIds: ["algorithm-a"] },
  { id: "replication-a", evidenceRole: "Replication / evaluation", algorithmIds: ["algorithm-a"] },
  { id: "wrong-role", evidenceRole: "Primary extension", algorithmIds: ["algorithm-a"] },
];

function record(overrides = {}) {
  return {
    id: "replication-record-a",
    title: "Independent evaluation of Algorithm A",
    algorithmIds: ["algorithm-a"],
    replicationReferenceId: "replication-a",
    originalReferenceIds: ["original-a"],
    outcome: "Partially supports",
    summary: "Independent evidence that reproduces only part of the original result.",
    independenceNote: "Authored by a separate group using an independent implementation and evaluation setup.",
    verifiedAt: "2026-09-29",
    ...overrides,
  };
}

test("a complete independent replication record validates", () => {
  assert.deepEqual(validateReplications([record()], algorithms, references), []);
});

test("replication source must be explicitly classified as replication/evaluation", () => {
  const errors = validateReplications([record({ replicationReferenceId: "wrong-role" })], algorithms, references);
  assert.ok(errors.some((error) => error.includes("must use evidence role Replication / evaluation")));
});

test("replication source cannot also be the original source", () => {
  const errors = validateReplications([
    record({ replicationReferenceId: "replication-a", originalReferenceIds: ["replication-a"] }),
  ], algorithms, references);
  assert.ok(errors.some((error) => error.includes("cannot also be an original reference")));
});

test("replication validation rejects unknown graph links", () => {
  const errors = validateReplications([
    record({
      algorithmIds: ["missing-algorithm"],
      replicationReferenceId: "missing-replication",
      originalReferenceIds: ["missing-original"],
    }),
  ], algorithms, references);

  assert.ok(errors.some((error) => error.includes("unknown algorithm missing-algorithm")));
  assert.ok(errors.some((error) => error.includes("unknown replication reference missing-replication")));
  assert.ok(errors.some((error) => error.includes("unknown original reference missing-original")));
});

test("replication records require independence notes and ISO verification dates", () => {
  const errors = validateReplications([
    record({ independenceNote: "", verifiedAt: "29/09/2026" }),
  ], algorithms, references);

  assert.ok(errors.some((error) => error.includes("independence note is required")));
  assert.ok(errors.some((error) => error.includes("verifiedAt must use YYYY-MM-DD")));
});
