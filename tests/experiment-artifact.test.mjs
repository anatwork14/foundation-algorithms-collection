import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { experiments, getExperiment } from "../lib/experiments.ts";
import { runExperiment as runRerankingExperiment } from "../experiments/hnsw-linucb-reranking-simulation.mjs";
import { runExperiment as runFuzzingSchedulerExperiment } from "../experiments/linucb-fuzzing-scheduler-simulation.mjs";

const rerankingRecorded = JSON.parse(
  fs.readFileSync(new URL("../experiments/results/hnsw-linucb-reranking-drift-pilot.json", import.meta.url), "utf8"),
);
const fuzzingRecorded = JSON.parse(
  fs.readFileSync(new URL("../experiments/results/linucb-fuzzing-scheduler-drift-pilot.json", import.meta.url), "utf8"),
);

test("committed reranking pilot artifact is exactly reproducible", () => {
  assert.deepEqual(runRerankingExperiment(), rerankingRecorded);
});

test("experiment registry exposes the reproducible reranking pilot as a completed mixed result", () => {
  const experiment = getExperiment("hnsw-linucb-reranking-drift-pilot");
  assert.ok(experiment);
  assert.equal(experiment.status, "Completed");
  assert.equal(experiment.result?.outcome, "Mixed");
  assert.ok(experiment.algorithmIds.includes("linucb"));
  assert.ok(experiment.algorithmIds.includes("hnsw"));
  assert.ok(experiment.artifacts.every((artifact) => Boolean(artifact.url)));
  assert.ok(experiment.result?.limitations.some((item) => item.includes("does not execute or benchmark an HNSW index")));
});

test("reranking pilot preserves the observed directional signal without relabeling it confirmatory", () => {
  assert.equal(rerankingRecorded.configuration.runs, 30);
  assert.ok(rerankingRecorded.interpretation.linucbRewardLiftVsGreedy > 0);
  assert.ok(rerankingRecorded.interpretation.linucbPostDriftLiftVsGreedy > 0);
  assert.ok(rerankingRecorded.interpretation.linucbRegretReductionVsGreedy > 0);

  const experiment = experiments.find((item) => item.id === rerankingRecorded.experimentId);
  assert.ok(experiment);
  assert.ok(experiment.successCriteria.some((item) => item.includes("Exploratory pilot only")));
  assert.equal(experiment.result?.outcome, "Mixed");
});

test("committed fuzzing-scheduler pilot artifact is exactly reproducible", () => {
  assert.deepEqual(runFuzzingSchedulerExperiment(), fuzzingRecorded);
});

test("fuzzing-scheduler registry result preserves the abrupt-drift failure signal", () => {
  const experiment = getExperiment("linucb-fuzzing-scheduler-drift-pilot");
  assert.ok(experiment);
  assert.equal(experiment.status, "Completed");
  assert.equal(experiment.result?.outcome, "Mixed");
  assert.ok(experiment.algorithmIds.includes("linucb"));
  assert.ok(experiment.algorithmIds.includes("ucb1"));
  assert.ok(experiment.algorithmIds.includes("thompson-sampling"));
  assert.ok(experiment.artifacts.every((artifact) => Boolean(artifact.url)));
  assert.ok(experiment.result?.limitations.some((item) => item.includes("synthetic mutation-scheduler proxy")));

  assert.ok(fuzzingRecorded.interpretation.linucbRewardLiftVsUcb1 > 0);
  assert.ok(fuzzingRecorded.interpretation.linucbRewardLiftVsThompson > 0);
  assert.ok(fuzzingRecorded.interpretation.linucbPostDriftLiftVsUcb1 < 0);
  assert.ok(fuzzingRecorded.interpretation.linucbPostDriftLiftVsThompson < 0);
  assert.ok(experiment.result?.summary.includes("failure mode"));
  assert.ok(experiment.result?.summary.includes("forgetting"));
});
