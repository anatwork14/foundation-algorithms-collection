import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runExperiment as runRerankingExperiment } from "../experiments/hnsw-linucb-reranking-simulation.mjs";
import { runExperiment as runFuzzingSchedulerExperiment } from "../experiments/linucb-fuzzing-scheduler-simulation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(...segments) {
  return JSON.parse(fs.readFileSync(path.join(root, ...segments), "utf8"));
}

function readSource(...segments) {
  return fs.readFileSync(path.join(root, ...segments), "utf8");
}

function scalarConstant(source, name) {
  const match = source.match(new RegExp(`^const ${name} = ([0-9.]+);$`, "m"));
  assert.ok(match, `Could not resolve numeric simulator constant ${name}`);
  return Number(match[1]);
}

function arrayConstant(source, name) {
  const prefix = `const ${name} = `;
  const start = source.indexOf(prefix);
  assert.notEqual(start, -1, `Could not resolve simulator array ${name}`);
  const valueStart = start + prefix.length;
  const end = source.indexOf(";\n", valueStart);
  assert.notEqual(end, -1, `Could not resolve end of simulator array ${name}`);

  const jsonCompatible = source
    .slice(valueStart, end)
    .replace(/,\s*]/g, "]");
  return JSON.parse(jsonCompatible);
}

function verifyRerankingPilot() {
  const recorded = readJson("experiments", "results", "hnsw-linucb-reranking-drift-pilot.json");
  const manifest = readJson("experiments", "manifests", "hnsw-linucb-reranking-drift-pilot.json");
  const source = readSource("experiments", "hnsw-linucb-reranking-simulation.mjs");
  const reproduced = runRerankingExperiment();

  assert.deepEqual(
    reproduced,
    recorded,
    "Deterministic reranking experiment artifact drifted. Re-run the simulator, inspect the new result, and update the artifact intentionally.",
  );

  assert.equal(recorded.experimentId, "hnsw-linucb-reranking-drift-pilot");
  assert.equal(recorded.configuration.runs, 30);
  assert.equal(recorded.configuration.baseSeed, 20260930);
  assert.ok(recorded.interpretation.linucbRewardLiftVsGreedy > 0);
  assert.ok(recorded.interpretation.linucbPostDriftLiftVsGreedy > 0);
  assert.ok(recorded.interpretation.linucbRegretReductionVsGreedy > 0);

  assert.equal(manifest.experimentId, recorded.experimentId);
  assert.equal(manifest.seedPlan.baseSeed, recorded.configuration.baseSeed);
  assert.equal(manifest.seedPlan.runs, recorded.configuration.runs);
  assert.equal(manifest.seedPlan.lastSeed, manifest.seedPlan.baseSeed + manifest.seedPlan.runs - 1);
  assert.equal(manifest.timeline.historicalInteractions, recorded.configuration.historicalInteractions);
  assert.equal(manifest.timeline.evaluationHorizon, recorded.configuration.horizon);
  assert.equal(manifest.timeline.driftAt, recorded.configuration.driftAt);
  assert.equal(manifest.candidateSpace.actions, recorded.configuration.actions);
  assert.equal(manifest.candidateSpace.contextFeatures, recorded.configuration.contextDimensions);
  assert.equal(manifest.policyParameters.linucbAlpha, recorded.configuration.linucbAlpha);
  assert.equal(manifest.policyParameters.ridgeLambda, recorded.configuration.ridgeLambda);

  assert.equal(manifest.seedPlan.baseSeed, scalarConstant(source, "BASE_SEED"));
  assert.equal(manifest.seedPlan.runs, scalarConstant(source, "RUNS"));
  assert.equal(manifest.timeline.historicalInteractions, scalarConstant(source, "HISTORY"));
  assert.equal(manifest.timeline.evaluationHorizon, scalarConstant(source, "HORIZON"));
  assert.equal(manifest.timeline.driftAt, scalarConstant(source, "HORIZON") / 2);
  assert.equal(manifest.policyParameters.linucbAlpha, scalarConstant(source, "ALPHA"));
  assert.equal(manifest.candidateSpace.actions, scalarConstant(source, "ACTIONS"));
  assert.equal(manifest.candidateSpace.modelDimensionsIncludingIntercept, scalarConstant(source, "DIMENSIONS"));
  assert.deepEqual(manifest.rewardModel.preDriftTheta, arrayConstant(source, "THETA_PRE"));
  assert.deepEqual(manifest.rewardModel.postDriftTheta, arrayConstant(source, "THETA_POST"));
  assert.deepEqual(manifest.policyParameters.policies, ["similarity", "staticLinear", "greedyOnline", "linucb"]);

  return `${recorded.experimentId}: reward lift ${recorded.interpretation.linucbRewardLiftVsGreedy}`;
}

function verifyFuzzingSchedulerPilot() {
  const recorded = readJson("experiments", "results", "linucb-fuzzing-scheduler-drift-pilot.json");
  const manifest = readJson("experiments", "manifests", "linucb-fuzzing-scheduler-drift-pilot.json");
  const source = readSource("experiments", "linucb-fuzzing-scheduler-simulation.mjs");
  const reproduced = runFuzzingSchedulerExperiment();

  assert.deepEqual(
    reproduced,
    recorded,
    "Deterministic fuzzing-scheduler experiment artifact drifted. Re-run the simulator, inspect the new result, and update the artifact intentionally.",
  );

  assert.equal(recorded.experimentId, "linucb-fuzzing-scheduler-drift-pilot");
  assert.equal(recorded.configuration.runs, 40);
  assert.equal(recorded.configuration.baseSeed, 20261002);
  assert.ok(recorded.interpretation.linucbRewardLiftVsUcb1 > 0);
  assert.ok(recorded.interpretation.linucbRewardLiftVsThompson > 0);
  assert.ok(recorded.interpretation.linucbRegretReductionVsUcb1 > 0);
  assert.ok(recorded.interpretation.linucbRegretReductionVsThompson > 0);
  assert.ok(
    recorded.interpretation.linucbPostDriftLiftVsUcb1 < 0,
    "This exploratory pilot intentionally records the observed post-drift LinUCB regression versus UCB1; review any sign change rather than silently overwriting it.",
  );
  assert.ok(
    recorded.interpretation.linucbPostDriftLiftVsThompson < 0,
    "This exploratory pilot intentionally records the observed post-drift LinUCB regression versus Thompson Sampling; review any sign change rather than silently overwriting it.",
  );

  assert.equal(manifest.experimentId, recorded.experimentId);
  assert.equal(manifest.seedPlan.baseSeed, recorded.configuration.baseSeed);
  assert.equal(manifest.seedPlan.runs, recorded.configuration.runs);
  assert.equal(manifest.seedPlan.lastSeed, manifest.seedPlan.baseSeed + manifest.seedPlan.runs - 1);
  assert.equal(manifest.timeline.evaluationHorizon, recorded.configuration.horizon);
  assert.equal(manifest.timeline.driftAt, recorded.configuration.driftAt);
  assert.equal(manifest.actionSpace.actions, recorded.configuration.actions);
  assert.equal(manifest.actionSpace.contextDimensionsIncludingIntercept, recorded.configuration.contextDimensions);
  assert.equal(manifest.policyParameters.linucbAlpha, recorded.configuration.linucbAlpha);
  assert.equal(manifest.policyParameters.ridgeLambda, recorded.configuration.ridgeLambda);

  assert.equal(manifest.seedPlan.baseSeed, scalarConstant(source, "BASE_SEED"));
  assert.equal(manifest.seedPlan.runs, scalarConstant(source, "RUNS"));
  assert.equal(manifest.timeline.evaluationHorizon, scalarConstant(source, "HORIZON"));
  assert.equal(manifest.timeline.driftAt, scalarConstant(source, "DRIFT_AT"));
  assert.equal(manifest.policyParameters.linucbAlpha, scalarConstant(source, "ALPHA"));
  assert.equal(manifest.policyParameters.ridgeLambda, scalarConstant(source, "RIDGE"));
  assert.equal(manifest.actionSpace.actions, scalarConstant(source, "ACTIONS"));
  assert.equal(manifest.actionSpace.contextDimensionsIncludingIntercept, scalarConstant(source, "DIMENSIONS"));
  assert.deepEqual(manifest.rewardModel.preDriftTheta, arrayConstant(source, "THETA_PRE"));
  assert.deepEqual(manifest.rewardModel.postDriftTheta, arrayConstant(source, "THETA_POST"));
  assert.deepEqual(manifest.policyParameters.policies, ["uniform", "ucb1", "thompson", "greedyLinear", "linucb"]);

  return `${recorded.experimentId}: overall lift vs UCB1 ${recorded.interpretation.linucbRewardLiftVsUcb1}; post-drift lift ${recorded.interpretation.linucbPostDriftLiftVsUcb1}`;
}

const summaries = [verifyRerankingPilot(), verifyFuzzingSchedulerPilot()];
console.log(`Experiment artifacts verified:\n- ${summaries.join("\n- ")}`);
