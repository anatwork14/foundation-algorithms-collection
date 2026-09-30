import test from "node:test";
import assert from "node:assert/strict";
import { deriveEvidenceStage } from "../lib/evidence-stage.ts";
import { references } from "../lib/references.ts";
import { replications, replicationsForAlgorithm, replicationsForReference } from "../lib/replications.ts";
import { validateReplications } from "../lib/replication-validation.ts";

const replicationAlgorithmIds = [...new Set(replications.flatMap((record) => record.algorithmIds))];
const minimalAlgorithms = replicationAlgorithmIds.map((id) => ({ id }));

test("curated replication catalog validates against its referenced algorithms and live references", () => {
  assert.deepEqual(validateReplications(replications, minimalAlgorithms, references), []);
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
  assert.ok(evaluation.citations.some((citation) => citation.targetId === "malkov-2018-hnsw"));

  const original = references.find((reference) => reference.id === "malkov-2018-hnsw");
  assert.ok(original);
  assert.equal(original.evidenceRole, "Primary method");
  assert.ok(original.algorithmIds.includes("hnsw"));
});

test("both independent and original references resolve back to the same replication record", () => {
  const fromEvaluation = replicationsForReference("aumuller-2020-ann-benchmarks");
  const fromOriginal = replicationsForReference("malkov-2018-hnsw");

  assert.deepEqual(fromEvaluation.map((record) => record.id), ["aumuller-2020-hnsw-evaluation"]);
  assert.deepEqual(fromOriginal.map((record) => record.id), ["aumuller-2020-hnsw-evaluation"]);
});

test("an explicit independent evaluation advances descriptive coverage to Replicated", () => {
  const records = replicationsForAlgorithm("hnsw");
  const stage = deriveEvidenceStage({
    references: 1,
    implementations: 0,
    experiments: 0,
    resultExperiments: 0,
    replicatedResults: records.length,
  });

  assert.equal(stage, "Replicated");
});
