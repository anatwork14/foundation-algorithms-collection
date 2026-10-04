import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runExperiment } from "../experiments/linucb-fuzzing-framed-record-target.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(...segments) {
  return JSON.parse(fs.readFileSync(path.join(root, ...segments), "utf8"));
}

const recorded = readJson("experiments", "results", "linucb-fuzzing-framed-record-target-pilot.json");
const manifest = readJson("experiments", "manifests", "linucb-fuzzing-framed-record-target-pilot.json");
const reproduced = runExperiment();

assert.deepEqual(
  reproduced,
  recorded,
  "Executed-target fuzzing experiment drifted. Re-run the campaign, inspect the result, and update the artifact intentionally.",
);

assert.equal(recorded.experimentId, "linucb-fuzzing-framed-record-target-pilot");
assert.equal(recorded.configuration.baseSeed, 20261004);
assert.equal(recorded.configuration.runs, 30);
assert.equal(recorded.configuration.horizon, 1500);
assert.deepEqual(recorded.configuration.actionNames, [
  "bit-flip",
  "random-byte-overwrite",
  "dictionary-insert",
  "delete-range",
]);

assert.ok(recorded.interpretation.linucbUniqueFeatureDeltaVsUniform < 0);
assert.ok(recorded.interpretation.linucbUniqueFeatureDeltaVsUcb1 < 0);
assert.ok(recorded.interpretation.linucbAcceptedInputDeltaVsUniform < 0);
assert.ok(recorded.interpretation.linucbAcceptedInputDeltaVsUcb1 < 0);

assert.equal(manifest.experimentId, recorded.experimentId);
assert.equal(manifest.seedPlan.baseSeed, recorded.configuration.baseSeed);
assert.equal(manifest.seedPlan.runs, recorded.configuration.runs);
assert.equal(manifest.seedPlan.lastSeed, manifest.seedPlan.baseSeed + manifest.seedPlan.runs - 1);
assert.equal(manifest.campaign.executionsPerPolicyPerRun, recorded.configuration.horizon);
assert.equal(manifest.campaign.maxCorpusSize, recorded.configuration.maxCorpusSize);
assert.equal(manifest.actionSpace.actions, recorded.configuration.actions);
assert.equal(manifest.actionSpace.contextDimensionsIncludingIntercept, recorded.configuration.contextDimensions);
assert.deepEqual(manifest.actionSpace.names, recorded.configuration.actionNames);
assert.equal(manifest.policyParameters.linucbAlpha, recorded.configuration.linucbAlpha);
assert.equal(manifest.policyParameters.ridgeLambda, recorded.configuration.ridgeLambda);
assert.equal(manifest.target.path, "experiments/targets/framed-record-parser.mjs");
assert.ok(manifest.interpretationBoundary.some((item) => item.includes("external benchmark")));
assert.ok(manifest.interpretationBoundary.some((item) => item.includes("AFL++")));

const targetSource = fs.readFileSync(path.join(root, manifest.target.path), "utf8");
const campaignSource = fs.readFileSync(path.join(root, "experiments", "linucb-fuzzing-framed-record-target.mjs"), "utf8");
assert.ok(targetSource.includes("traceFramedRecord"));
assert.ok(campaignSource.includes('./targets/framed-record-parser.mjs'));

console.log(
  `Executed-target experiment verified: LinUCB feature delta vs uniform ${recorded.interpretation.linucbUniqueFeatureDeltaVsUniform}; vs UCB1 ${recorded.interpretation.linucbUniqueFeatureDeltaVsUcb1}`,
);
