import test from "node:test";
import assert from "node:assert/strict";
import { experimentHistory } from "../lib/experiment-history.ts";
import { validateExperimentHistory } from "../lib/experiment-history-validation.ts";
import { experiments } from "../lib/experiments.ts";

function experiment(overrides = {}) {
  return {
    id: "experiment-a",
    title: "Experiment A",
    combinationId: "combination-a",
    algorithmIds: ["algorithm-a"],
    status: "Planned",
    objective: "Objective",
    hypothesis: "Hypothesis",
    baselines: ["Baseline"],
    datasets: [{ name: "Dataset", purpose: "Purpose" }],
    metrics: ["Metric"],
    environment: ["Environment"],
    procedure: ["Procedure"],
    successCriteria: ["Criterion"],
    artifacts: [{ label: "Harness", url: "https://example.com/harness" }],
    lastUpdated: "2026-09-28",
    ...overrides,
  };
}

function entry(overrides = {}) {
  return {
    experimentId: "experiment-a",
    revision: 1,
    date: "2026-09-28",
    kind: "Protocol",
    status: "Planned",
    title: "Protocol registered",
    note: "Initial protocol recorded.",
    ...overrides,
  };
}

test("live experiment catalog has a valid append-only history for every experiment", () => {
  assert.deepEqual(validateExperimentHistory(experimentHistory, experiments), []);
  for (const experimentRecord of experiments) {
    assert.ok(
      experimentHistory.some((historyEntry) => historyEntry.experimentId === experimentRecord.id),
      `${experimentRecord.id}: missing experiment history`,
    );
  }
});

test("single planned history entry validates", () => {
  assert.deepEqual(validateExperimentHistory([entry()], [experiment()]), []);
});

test("history revisions must be contiguous and chronologically ordered", () => {
  const errors = validateExperimentHistory([
    entry({ revision: 1, date: "2026-09-29" }),
    entry({ revision: 3, date: "2026-09-28", kind: "Status", status: "Running" }),
  ], [experiment({ status: "Running", lastUpdated: "2026-09-28" })]);

  assert.ok(errors.some((error) => error.includes("revisions must be contiguous")));
  assert.ok(errors.some((error) => error.includes("dates must be nondecreasing")));
});

test("final history state must match current experiment state", () => {
  const errors = validateExperimentHistory([
    entry(),
  ], [experiment({ status: "Running", lastUpdated: "2026-09-30" })]);

  assert.ok(errors.some((error) => error.includes("final history status Planned does not match current status Running")));
  assert.ok(errors.some((error) => error.includes("final history date 2026-09-28 does not match lastUpdated 2026-09-30")));
});

test("result-bearing experiment requires a terminal Result event", () => {
  const result = {
    outcome: "Mixed",
    summary: "Directional result.",
    metricResults: [{ metric: "Metric", value: "1" }],
    limitations: [],
  };

  const missing = validateExperimentHistory([
    entry({ status: "Completed" }),
  ], [experiment({ status: "Completed", result })]);
  assert.ok(missing.some((error) => error.includes("requires a Result history entry")));

  const nonTerminal = validateExperimentHistory([
    entry({ kind: "Result", status: "Running" }),
  ], [experiment({ status: "Running", result })]);
  assert.ok(nonTerminal.some((error) => error.includes("must use a terminal experiment status")));
});

test("history artifact labels must exist on the experiment record", () => {
  const errors = validateExperimentHistory([
    entry({ kind: "Artifact", artifactLabels: ["Missing artifact"] }),
  ], [experiment()]);

  assert.ok(errors.some((error) => error.includes("unknown artifact label Missing artifact")));
});
