import test from "node:test";
import assert from "node:assert/strict";
import { validateExperiments } from "../lib/experiment-validation.ts";
import { validateImplementations } from "../lib/implementation-validation.ts";

const algorithms = [{ id: "algorithm-a" }];
const combinations = [{ id: "combination-a" }];

function implementation(overrides = {}) {
  const commit = "a".repeat(40);
  return {
    id: "implementation-a",
    name: "Implementation A",
    repository: "https://github.com/example/project",
    algorithmIds: ["algorithm-a"],
    language: "TypeScript",
    interfaces: ["Library"],
    license: "MIT",
    maturity: "Research/prototyping",
    summary: "A complete implementation validation fixture.",
    implementationNotes: ["Inspect the pinned source."],
    sourcePaths: [{ label: "Source", url: `https://github.com/example/project/blob/${commit}/src/index.ts` }],
    verifiedRef: "main",
    verifiedCommit: commit,
    lastVerified: "2026-09-28",
    ...overrides,
  };
}

function experiment(overrides = {}) {
  return {
    id: "experiment-a",
    title: "Experiment A",
    combinationId: "combination-a",
    algorithmIds: ["algorithm-a"],
    status: "Planned",
    objective: "Measure the proposed mechanism.",
    hypothesis: "The mechanism improves the target metric.",
    baselines: ["Baseline"],
    datasets: ["Dataset"],
    metrics: ["Metric"],
    environment: ["Environment"],
    procedure: ["Procedure"],
    successCriteria: ["Criterion"],
    artifacts: [],
    lastUpdated: "2026-09-28",
    ...overrides,
  };
}

test("complete implementation record validates", () => {
  assert.deepEqual(validateImplementations([implementation()], algorithms), []);
});

test("implementation validation rejects floating source URLs and malformed commits", () => {
  const errors = validateImplementations([
    implementation({
      verifiedCommit: "short-sha",
      sourcePaths: [{ label: "Source", url: "https://github.com/example/project/blob/main/src/index.ts" }],
    }),
  ], algorithms);

  assert.ok(errors.some((error) => error.includes("40-character lowercase Git SHA")));
  assert.ok(errors.some((error) => error.includes("source path must be pinned")));
});

test("planned experiment record validates without a result", () => {
  assert.deepEqual(validateExperiments([experiment()], algorithms, combinations), []);
});

test("completed experiments require an inspectable result", () => {
  const errors = validateExperiments([experiment({ status: "Completed" })], algorithms, combinations);
  assert.ok(errors.some((error) => error.includes("completed experiment requires a result")));
});

test("experiment validation rejects broken graph links", () => {
  const errors = validateExperiments([
    experiment({ combinationId: "missing-combination", algorithmIds: ["missing-algorithm"] }),
  ], algorithms, combinations);

  assert.ok(errors.some((error) => error.includes("unknown combination missing-combination")));
  assert.ok(errors.some((error) => error.includes("unknown algorithm missing-algorithm")));
});
