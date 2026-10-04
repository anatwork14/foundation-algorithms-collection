import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runExperiment as runSingleTargetExperiment } from "../experiments/linucb-fuzzing-framed-record-target.mjs";
import { runExperiment as runMultiTargetExperiment } from "../experiments/linucb-fuzzing-multitarget.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(...segments) {
  return JSON.parse(fs.readFileSync(path.join(root, ...segments), "utf8"));
}

function verifySingleTargetExperiment() {
  const recorded = readJson("experiments", "results", "linucb-fuzzing-framed-record-target-pilot.json");
  const manifest = readJson("experiments", "manifests", "linucb-fuzzing-framed-record-target-pilot.json");
  const reproduced = runSingleTargetExperiment();

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

  return `single-target delta vs uniform ${recorded.interpretation.linucbUniqueFeatureDeltaVsUniform}; vs UCB1 ${recorded.interpretation.linucbUniqueFeatureDeltaVsUcb1}`;
}

function verifyMultiTargetExperiment() {
  const recorded = readJson("experiments", "results", "linucb-fuzzing-multitarget-executed-pilot.json");
  const manifest = readJson("experiments", "manifests", "linucb-fuzzing-multitarget-executed-pilot.json");
  const reproduced = runMultiTargetExperiment();

  assert.deepEqual(
    reproduced,
    recorded,
    "Multi-target executed fuzzing experiment drifted. Re-run both targets, inspect the result, and update the artifact intentionally.",
  );

  assert.equal(recorded.experimentId, "linucb-fuzzing-multitarget-executed-pilot");
  assert.equal(recorded.configuration.baseSeed, 20261005);
  assert.equal(recorded.configuration.runs, 30);
  assert.equal(recorded.configuration.horizonPerTarget, 1200);
  assert.deepEqual(recorded.configuration.targets, ["framed-record-parser", "command-script-parser"]);
  assert.deepEqual(recorded.configuration.actionNames, [
    "bit-flip",
    "random-byte-overwrite",
    "dictionary-insert",
    "delete-range",
  ]);

  const framed = recorded.interpretation.perTarget["framed-record-parser"];
  const command = recorded.interpretation.perTarget["command-script-parser"];
  assert.ok(framed.linucbUniqueFeatureDeltaVsUniform > 0);
  assert.ok(framed.linucbUniqueFeatureDeltaVsUcb1 > 0);
  assert.ok(command.linucbUniqueFeatureDeltaVsUniform > 0);
  assert.ok(command.linucbUniqueFeatureDeltaVsUcb1 < 0);
  assert.equal(recorded.interpretation.targetsWithLinucbFeatureLeadVsUniform, 2);
  assert.equal(recorded.interpretation.targetsWithLinucbFeatureLeadVsUcb1, 1);

  assert.equal(manifest.experimentId, recorded.experimentId);
  assert.equal(manifest.seedPlan.baseSeed, recorded.configuration.baseSeed);
  assert.equal(manifest.seedPlan.runs, recorded.configuration.runs);
  assert.equal(manifest.seedPlan.lastSeed, manifest.seedPlan.baseSeed + manifest.seedPlan.runs - 1);
  assert.equal(manifest.campaign.executionsPerPolicyPerTargetPerRun, recorded.configuration.horizonPerTarget);
  assert.equal(manifest.campaign.maxCorpusSize, recorded.configuration.maxCorpusSize);
  assert.equal(manifest.campaign.targetCount, recorded.configuration.targets.length);
  assert.equal(
    manifest.campaign.totalTargetExecutions,
    recorded.configuration.runs * recorded.configuration.targets.length * manifest.campaign.policiesPerTarget * recorded.configuration.horizonPerTarget,
  );
  assert.equal(manifest.actionSpace.actions, recorded.configuration.actions);
  assert.equal(manifest.actionSpace.contextDimensionsIncludingIntercept, recorded.configuration.contextDimensions);
  assert.deepEqual(manifest.actionSpace.names, recorded.configuration.actionNames);
  assert.equal(manifest.policyParameters.linucbAlpha, recorded.configuration.linucbAlpha);
  assert.equal(manifest.policyParameters.ridgeLambda, recorded.configuration.ridgeLambda);
  assert.deepEqual(manifest.targets.map((target) => target.id), recorded.configuration.targets);
  assert.ok(manifest.interpretationBoundary.some((item) => item.includes("no pooled raw feature-count winner")));
  assert.ok(manifest.interpretationBoundary.some((item) => item.includes("AFL++")));

  for (const target of manifest.targets) {
    const targetSource = fs.readFileSync(path.join(root, target.path), "utf8");
    assert.ok(targetSource.includes("export function trace"));
  }
  const campaignSource = fs.readFileSync(path.join(root, "experiments", "linucb-fuzzing-multitarget.mjs"), "utf8");
  assert.ok(campaignSource.includes('./targets/framed-record-parser.mjs'));
  assert.ok(campaignSource.includes('./targets/command-script-parser.mjs'));

  return `multi-target leads vs uniform ${recorded.interpretation.targetsWithLinucbFeatureLeadVsUniform}/2; vs UCB1 ${recorded.interpretation.targetsWithLinucbFeatureLeadVsUcb1}/2`;
}

console.log(`Executed-target experiments verified:\n- ${verifySingleTargetExperiment()}\n- ${verifyMultiTargetExperiment()}`);
