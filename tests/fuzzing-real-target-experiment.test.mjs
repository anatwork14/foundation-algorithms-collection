import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getExperiment } from "../lib/experiments.ts";
import { historyForExperiment } from "../lib/experiment-history.ts";
import { runExperiment as runSingleTargetExperiment } from "../experiments/linucb-fuzzing-framed-record-target.mjs";
import { runExperiment as runMultiTargetExperiment } from "../experiments/linucb-fuzzing-multitarget.mjs";

const singleTargetRecorded = JSON.parse(
  fs.readFileSync(new URL("../experiments/results/linucb-fuzzing-framed-record-target-pilot.json", import.meta.url), "utf8"),
);
const multiTargetRecorded = JSON.parse(
  fs.readFileSync(new URL("../experiments/results/linucb-fuzzing-multitarget-executed-pilot.json", import.meta.url), "utf8"),
);

test("executed-target fuzzing pilot is exactly reproducible and preserves the negative signal", () => {
  assert.deepEqual(runSingleTargetExperiment(), singleTargetRecorded);
  assert.ok(singleTargetRecorded.interpretation.linucbUniqueFeatureDeltaVsUniform < 0);
  assert.ok(singleTargetRecorded.interpretation.linucbUniqueFeatureDeltaVsUcb1 < 0);
  assert.ok(singleTargetRecorded.interpretation.linucbAcceptedInputDeltaVsUniform < 0);
  assert.ok(singleTargetRecorded.interpretation.linucbAcceptedInputDeltaVsUcb1 < 0);
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

test("multi-target executed pilot is exactly reproducible and preserves cross-target disagreement", () => {
  assert.deepEqual(runMultiTargetExperiment(), multiTargetRecorded);
  const framed = multiTargetRecorded.interpretation.perTarget["framed-record-parser"];
  const command = multiTargetRecorded.interpretation.perTarget["command-script-parser"];
  assert.ok(framed.linucbUniqueFeatureDeltaVsUniform > 0);
  assert.ok(framed.linucbUniqueFeatureDeltaVsUcb1 > 0);
  assert.ok(command.linucbUniqueFeatureDeltaVsUniform > 0);
  assert.ok(command.linucbUniqueFeatureDeltaVsUcb1 < 0);
  assert.equal(multiTargetRecorded.interpretation.targetsWithLinucbFeatureLeadVsUniform, 2);
  assert.equal(multiTargetRecorded.interpretation.targetsWithLinucbFeatureLeadVsUcb1, 1);
});

test("multi-target experiment reports per-target trace spaces instead of manufacturing a pooled winner", () => {
  const experiment = getExperiment("linucb-fuzzing-multitarget-executed-pilot");
  assert.ok(experiment);
  assert.equal(experiment.status, "Completed");
  assert.equal(experiment.result?.outcome, "Mixed");
  assert.deepEqual(experiment.algorithmIds, ["linucb", "ucb1", "coverage-guided-fuzzing"]);
  assert.ok(experiment.artifacts.every((artifact) => Boolean(artifact.url)));
  assert.ok(experiment.successCriteria.some((item) => item.includes("raw target feature counts separate")));
  assert.ok(experiment.result?.limitations.some((item) => item.includes("two targets")));
  assert.ok(experiment.result?.limitations.some((item) => item.includes("AFL++ edge coverage")));
  assert.ok(experiment.result?.summary.includes("Mixed result"));
});

test("multi-target experiment has contiguous append-only protocol, artifact, and result history", () => {
  const history = historyForExperiment("linucb-fuzzing-multitarget-executed-pilot");
  assert.deepEqual(history.map((entry) => entry.revision), [1, 2, 3]);
  assert.deepEqual(history.map((entry) => entry.kind), ["Protocol", "Artifact", "Result"]);
  assert.equal(history.at(-1)?.status, "Completed");
  assert.equal(history.at(-1)?.date, "2026-10-04");
});
