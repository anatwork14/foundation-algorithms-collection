import test from "node:test";
import assert from "node:assert/strict";
import { validateImplementationVerificationHistory } from "../lib/implementation-verification-validation.ts";

const commitA = "a".repeat(40);
const commitB = "b".repeat(40);

function implementation(overrides = {}) {
  return {
    id: "implementation-a",
    name: "Implementation A",
    repository: "https://github.com/example/project",
    algorithmIds: ["algorithm-a"],
    language: "TypeScript",
    interfaces: ["API"],
    license: "MIT",
    maturity: "Research/prototyping",
    summary: "Summary",
    implementationNotes: ["Note"],
    sourcePaths: [{ label: "Source", url: `https://github.com/example/project/blob/${commitA}/src/index.ts` }],
    verifiedRef: "main",
    verifiedCommit: commitA,
    lastVerified: "2026-10-01",
    ...overrides,
  };
}

function entry(overrides = {}) {
  return {
    implementationId: "implementation-a",
    revision: 1,
    verifiedAt: "2026-10-01",
    verifiedRef: "main",
    verifiedCommit: commitA,
    sourcePaths: [{ label: "Source", url: `https://github.com/example/project/blob/${commitA}/src/index.ts` }],
    note: "Directly inspected source snapshot.",
    ...overrides,
  };
}

test("single verification snapshot validates", () => {
  assert.deepEqual(validateImplementationVerificationHistory([entry()], [implementation()]), []);
});

test("verification revisions must be contiguous and chronological", () => {
  const errors = validateImplementationVerificationHistory([
    entry({ revision: 1, verifiedAt: "2026-10-02" }),
    entry({ revision: 3, verifiedAt: "2026-10-01" }),
  ], [implementation()]);

  assert.ok(errors.some((error) => error.includes("revisions must be contiguous")));
  assert.ok(errors.some((error) => error.includes("dates must be nondecreasing")));
});

test("current registry pin must equal latest historical snapshot", () => {
  const errors = validateImplementationVerificationHistory([
    entry(),
    entry({
      revision: 2,
      verifiedAt: "2026-10-02",
      verifiedCommit: commitB,
      sourcePaths: [{ label: "Source", url: `https://github.com/example/project/blob/${commitB}/src/index.ts` }],
    }),
  ], [implementation()]);

  assert.ok(errors.some((error) => error.includes("latest verification commit")));
  assert.ok(errors.some((error) => error.includes("latest verification date")));
  assert.ok(errors.some((error) => error.includes("source paths")));
});

test("source paths must be immutable commit-pinned snapshots", () => {
  const errors = validateImplementationVerificationHistory([
    entry({ sourcePaths: [{ label: "Source", url: "https://github.com/example/project/blob/main/src/index.ts" }] }),
  ], [implementation({ sourcePaths: [{ label: "Source", url: "https://github.com/example/project/blob/main/src/index.ts" }] })]);

  assert.ok(errors.some((error) => error.includes("source URL must contain its verified commit")));
});

test("every implementation requires a verification history", () => {
  const errors = validateImplementationVerificationHistory([], [implementation()]);
  assert.ok(errors.some((error) => error.includes("at least one implementation verification revision is required")));
});
