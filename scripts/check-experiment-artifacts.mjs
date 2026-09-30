import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runExperiment } from "../experiments/hnsw-linucb-reranking-simulation.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactPath = path.join(root, "experiments", "results", "hnsw-linucb-reranking-drift-pilot.json");
const recorded = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
const reproduced = runExperiment();

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

console.log(
  `Experiment artifact verified: ${recorded.experimentId} (${recorded.configuration.runs} deterministic seeds; reward lift ${recorded.interpretation.linucbRewardLiftVsGreedy}).`,
);
