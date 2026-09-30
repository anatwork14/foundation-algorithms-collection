import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { experiments, getExperiment } from "../lib/experiments.ts";
import { runExperiment } from "../experiments/hnsw-linucb-reranking-simulation.mjs";

const recorded = JSON.parse(
  fs.readFileSync(new URL("../experiments/results/hnsw-linucb-reranking-drift-pilot.json", import.meta.url), "utf8"),
);

test("committed reranking pilot artifact is exactly reproducible", () => {
  assert.deepEqual(runExperiment(), recorded);
});

test("experiment registry exposes the reproducible pilot as a completed mixed result", () => {
  const experiment = getExperiment("hnsw-linucb-reranking-drift-pilot");
  assert.ok(experiment);
  assert.equal(experiment.status, "Completed");
  assert.equal(experiment.result?.outcome, "Mixed");
  assert.ok(experiment.algorithmIds.includes("linucb"));
  assert.ok(experiment.algorithmIds.includes("hnsw"));
  assert.ok(experiment.artifacts.every((artifact) => Boolean(artifact.url)));
  assert.ok(experiment.result?.limitations.some((item) => item.includes("does not execute or benchmark an HNSW index")));
});

test("recorded pilot preserves the observed directional signal without relabeling it confirmatory", () => {
  assert.equal(recorded.configuration.runs, 30);
  assert.ok(recorded.interpretation.linucbRewardLiftVsGreedy > 0);
  assert.ok(recorded.interpretation.linucbPostDriftLiftVsGreedy > 0);
  assert.ok(recorded.interpretation.linucbRegretReductionVsGreedy > 0);

  const experiment = experiments.find((item) => item.id === recorded.experimentId);
  assert.ok(experiment);
  assert.ok(experiment.successCriteria.some((item) => item.includes("Exploratory pilot only")));
  assert.equal(experiment.result?.outcome, "Mixed");
});
