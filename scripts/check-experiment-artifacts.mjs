import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runExperiment } from "../experiments/hnsw-linucb-reranking-simulation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resultPath = path.join(root, "experiments", "results", "hnsw-linucb-reranking-drift-pilot.json");
const manifestPath = path.join(root, "experiments", "manifests", "hnsw-linucb-reranking-drift-pilot.json");
const simulatorPath = path.join(root, "experiments", "hnsw-linucb-reranking-simulation.mjs");

const recorded = JSON.parse(fs.readFileSync(resultPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const simulatorSource = fs.readFileSync(simulatorPath, "utf8");
const reproduced = runExperiment();

function scalarConstant(name) {
  const match = simulatorSource.match(new RegExp(`^const ${name} = ([0-9.]+);$`, "m"));
  assert.ok(match, `Could not resolve numeric simulator constant ${name}`);
  return Number(match[1]);
}

function arrayConstant(name) {
  const prefix = `const ${name} = `;
  const start = simulatorSource.indexOf(prefix);
  assert.notEqual(start, -1, `Could not resolve simulator array ${name}`);
  const valueStart = start + prefix.length;
  const end = simulatorSource.indexOf(";\n", valueStart);
  assert.notEqual(end, -1, `Could not resolve end of simulator array ${name}`);
  return JSON.parse(simulatorSource.slice(valueStart, end));
}

assert.deepEqual(
  reproduced,
  recorded,
  "Deterministic experiment artifact drifted. Re-run the simulator, inspect the new result, and update the artifact intentionally.",
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

assert.equal(manifest.seedPlan.baseSeed, scalarConstant("BASE_SEED"));
assert.equal(manifest.seedPlan.runs, scalarConstant("RUNS"));
assert.equal(manifest.timeline.historicalInteractions, scalarConstant("HISTORY"));
assert.equal(manifest.timeline.evaluationHorizon, scalarConstant("HORIZON"));
assert.equal(manifest.timeline.driftAt, scalarConstant("HORIZON") / 2);
assert.equal(manifest.policyParameters.linucbAlpha, scalarConstant("ALPHA"));
assert.equal(manifest.candidateSpace.actions, scalarConstant("ACTIONS"));
assert.equal(manifest.candidateSpace.modelDimensionsIncludingIntercept, scalarConstant("DIMENSIONS"));
assert.deepEqual(manifest.rewardModel.preDriftTheta, arrayConstant("THETA_PRE"));
assert.deepEqual(manifest.rewardModel.postDriftTheta, arrayConstant("THETA_POST"));
assert.deepEqual(manifest.policyParameters.policies, ["similarity", "staticLinear", "greedyOnline", "linucb"]);

console.log(
  `Experiment artifacts verified: ${recorded.experimentId} (${recorded.configuration.runs} deterministic seeds; reward lift ${recorded.interpretation.linucbRewardLiftVsGreedy}; manifest v${manifest.manifestVersion}).`,
);
