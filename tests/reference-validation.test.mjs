import test from "node:test";
import assert from "node:assert/strict";
import { validateReferences } from "../lib/reference-validation.ts";

const algorithms = [{ id: "algorithm-a" }];
const combinations = [{ id: "combination-a" }];
const chapters = ["chapter-a"];

function reference(overrides = {}) {
  return {
    id: "reference-a",
    title: "Primary source",
    authors: ["Researcher"],
    year: 2024,
    kind: "Paper",
    evidenceRole: "Primary method",
    url: "https://example.org/source",
    algorithmIds: ["algorithm-a"],
    combinationIds: [],
    chapterSlugs: ["chapter-a"],
    citations: [],
    notices: [],
    summary: "A source used for validation tests.",
    significance: "It gives the validator a complete valid record.",
    tags: ["test"],
    ...overrides,
  };
}

test("a complete reference record validates", () => {
  assert.deepEqual(validateReferences([reference()], algorithms, combinations, chapters), []);
});

test("reference notices require controlled kind and inspectable verification metadata", () => {
  const errors = validateReferences([
    reference({
      notices: [
        { kind: "Unknown", note: "", url: "http://example.org/notice", verifiedAt: "2026/10/01" },
      ],
    }),
  ], algorithms, combinations, chapters);

  assert.ok(errors.some((error) => error.includes("invalid reference notice kind")));
  assert.ok(errors.some((error) => error.includes("notice requires a note")));
  assert.ok(errors.some((error) => error.includes("notice requires an HTTPS verification URL")));
  assert.ok(errors.some((error) => error.includes("notice verifiedAt must use YYYY-MM-DD")));
});

test("citation edges reject self references and malformed verification metadata", () => {
  const errors = validateReferences([
    reference({
      citations: [{ targetId: "reference-a", note: "", verificationUrl: "http://example.org", verifiedAt: "2026/09/28" }],
    }),
  ], algorithms, combinations, chapters);

  assert.ok(errors.some((error) => error.includes("cannot cite itself")));
  assert.ok(errors.some((error) => error.includes("verification note is required")));
  assert.ok(errors.some((error) => error.includes("HTTPS verification URL is required")));
  assert.ok(errors.some((error) => error.includes("verifiedAt must use YYYY-MM-DD")));
});

test("citation edges reject unknown and duplicate targets", () => {
  const target = reference({ id: "reference-b" });
  const source = reference({
    citations: [
      { targetId: "reference-b", note: "Verified citation", verificationUrl: "https://example.org/verify", verifiedAt: "2026-09-28" },
      { targetId: "reference-b", note: "Duplicate citation", verificationUrl: "https://example.org/verify2", verifiedAt: "2026-09-28" },
      { targetId: "missing-reference", note: "Broken citation", verificationUrl: "https://example.org/verify3", verifiedAt: "2026-09-28" },
    ],
  });
  const errors = validateReferences([source, target], algorithms, combinations, chapters);

  assert.ok(errors.some((error) => error.includes("duplicate cited reference id")));
  assert.ok(errors.some((error) => error.includes("unknown cited reference missing-reference")));
});

test("references reject broken algorithm, combination, and chapter links", () => {
  const errors = validateReferences([
    reference({
      algorithmIds: ["missing-algorithm"],
      combinationIds: ["missing-combination"],
      chapterSlugs: ["missing-chapter"],
    }),
  ], algorithms, combinations, chapters);

  assert.ok(errors.some((error) => error.includes("unknown algorithm missing-algorithm")));
  assert.ok(errors.some((error) => error.includes("unknown combination missing-combination")));
  assert.ok(errors.some((error) => error.includes("unknown source chapter missing-chapter")));
});
