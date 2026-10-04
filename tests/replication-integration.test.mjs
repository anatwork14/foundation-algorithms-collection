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

test("conformal prediction has an independently authored CQR comparative evaluation", () => {
  const records = replicationsForAlgorithm("conformal-prediction");
  assert.equal(records.length, 1);

  const record = records[0];
  assert.equal(record.id, "dewolf-2023-cqr-evaluation");
  assert.equal(record.replicationReferenceId, "dewolf-2023-valid-prediction-intervals");
  assert.deepEqual(record.originalReferenceIds, ["romano-2019-cqr"]);
  assert.equal(record.outcome, "Partially supports");
  assert.match(record.independenceNote, /no author overlap/i);
  assert.match(record.summary, /performance variation/i);

  const evaluation = references.find((reference) => reference.id === record.replicationReferenceId);
  assert.ok(evaluation);
  assert.equal(evaluation.evidenceRole, "Replication / evaluation");
  assert.ok(evaluation.algorithmIds.includes("conformal-prediction"));
  assert.ok(evaluation.citations.some((citation) => citation.targetId === "romano-2019-cqr"));

  const original = references.find((reference) => reference.id === "romano-2019-cqr");
  assert.ok(original);
  assert.equal(original.evidenceRole, "Primary extension");
  assert.ok(original.algorithmIds.includes("conformal-prediction"));
});

test("independent and original references resolve back to their replication records", () => {
  const hnswFromEvaluation = replicationsForReference("aumuller-2020-ann-benchmarks");
  const hnswFromOriginal = replicationsForReference("malkov-2018-hnsw");
  assert.deepEqual(hnswFromEvaluation.map((record) => record.id), ["aumuller-2020-hnsw-evaluation"]);
  assert.deepEqual(hnswFromOriginal.map((record) => record.id), ["aumuller-2020-hnsw-evaluation"]);

  const cqrFromEvaluation = replicationsForReference("dewolf-2023-valid-prediction-intervals");
  const cqrFromOriginal = replicationsForReference("romano-2019-cqr");
  assert.deepEqual(cqrFromEvaluation.map((record) => record.id), ["dewolf-2023-cqr-evaluation"]);
  assert.deepEqual(cqrFromOriginal.map((record) => record.id), ["dewolf-2023-cqr-evaluation"]);
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
