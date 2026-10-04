import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getExperiment } from "../lib/experiments.ts";
import { historyForExperiment } from "../lib/experiment-history.ts";
import { runExperiment } from "../experiments/linucb-fuzzing-framed-record-target.mjs";

const recorded = JSON.parse(
  fs.readFileSync(new URL("../experiments/results/linucb-fuzzing-framed-record-target-pilot.json", import.meta.url), "utf8"),
);

test("executed-target fuzzing pilot is exactly reproducible and preserves the negative signal", () => {
  assert.deepEqual(runExperiment(), recorded);
  assert.ok(recorded.interpretation.linucbUniqueFeatureDeltaVsUniform < 0);
  assert.ok(recorded.interpretation.linucbUniqueFeatureDeltaVsUcb1 < 0);
  assert.ok(recorded.interpretation.linucbAcceptedInputDeltaVsUniform < 0);
  assert.ok(recorded.interpretation.linucbAcceptedInputDeltaVsUcb1 < 0);
});

test("executed-target experiment remains scoped below AFL++ and external benchmark evidence", () => {
  const experiment = getExperiment("linucb-fuzzing-framed-record-target-pilot");
  assert.ok(experiment);
  assert.equal(experiment.status, "Completed");
  assert.equal(experiment.result?.outcome, "Negative");
  assert.deepEqual(experiment.algorithmIds, ["linucb", "ucb1", "coverage-guided-fuzzing"]);
  assert.ok(experiment.artifacts.every((artifact) => Boolean(artifact.url)));
  assert.ok(experiment.result?.limitations.some((item) => item.includes("in-repository research harness")));
  assert.ok(experiment.result?.limitations.some((item) => item.includes("does not use AFL++ instrumentation")));
  assert.ok(experiment.result?.summary.includes("rejects the directional improvement hypothesis"));
});

test("executed-target experiment has contiguous append-only protocol, artifact, and result history", () => {
  const history = historyForExperiment("linucb-fuzzing-framed-record-target-pilot");
  assert.deepEqual(history.map((entry) => entry.revision), [1, 2, 3]);
  assert.deepEqual(history.map((entry) => entry.kind), ["Protocol", "Artifact", "Result"]);
  assert.equal(history.at(-1)?.status, "Completed");
  assert.equal(history.at(-1)?.date, "2026-10-04");
});
