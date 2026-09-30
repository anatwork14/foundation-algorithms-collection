import test from "node:test";
import assert from "node:assert/strict";
import { algorithms } from "../lib/algorithm-catalog.ts";
import { getAlgorithmEvidenceProfile } from "../lib/evidence-profile.ts";
import { references } from "../lib/references.ts";
import { replications, replicationsForAlgorithm } from "../lib/replications.ts";
import { validateReplications } from "../lib/replication-validation.ts";

test("curated replication catalog validates against live algorithms and references", () => {
  assert.deepEqual(validateReplications(replications, algorithms, references), []);
});

test("HNSW has the independently authored ANN-Benchmarks evaluation", () => {
  const records = replicationsForAlgorithm("hnsw");
  assert.equal(records.length, 1);

  const record = records[0];
  assert.equal(record.id, "aumuller-2020-hnsw-evaluation");
  assert.equal(record.replicationReferenceId, "aumuller-2020-ann-benchmarks");
  assert.deepEqual(record.originalReferenceIds, ["malkov-2018-hnsw"]);
  assert.equal(record.outcome, "Partially supports");

  const evaluation = references.find((reference) => reference.id === record.replicationReferenceId);
  assert.ok(evaluation);
  assert.equal(evaluation.evidenceRole, "Replication / evaluation");
  assert.ok(evaluation.algorithmIds.includes("hnsw"));

  const original = references.find((reference) => reference.id === "malkov-2018-hnsw");
  assert.ok(original);
  assert.equal(original.evidenceRole, "Primary method");
});

test("an independent HNSW evaluation advances evidence coverage to Replicated", () => {
  const profile = getAlgorithmEvidenceProfile("hnsw");
  assert.equal(profile.stage, "Replicated");
  assert.equal(profile.replicatedResults, 1);

  const replicationDimension = profile.dimensions.find((dimension) => dimension.key === "replication");
  assert.ok(replicationDimension);
  assert.equal(replicationDimension.present, true);
  assert.equal(replicationDimension.count, 1);
  assert.equal(replicationDimension.state, "1 independent record");
});
