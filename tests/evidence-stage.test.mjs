import test from "node:test";
import assert from "node:assert/strict";
import { deriveEvidenceStage } from "../lib/evidence-stage.ts";

const empty = {
  references: 0,
  implementations: 0,
  experiments: 0,
  resultExperiments: 0,
  replicatedResults: 0,
};

test("evidence stage starts at concept only", () => {
  assert.equal(deriveEvidenceStage(empty), "Concept only");
});

test("evidence stage advances by evidence-layer presence", () => {
  assert.equal(deriveEvidenceStage({ ...empty, references: 1 }), "Source-backed");
  assert.equal(deriveEvidenceStage({ ...empty, references: 1, implementations: 1 }), "Inspectable implementation");
  assert.equal(deriveEvidenceStage({ ...empty, references: 1, implementations: 1, experiments: 1 }), "Experiment protocol");
  assert.equal(deriveEvidenceStage({ ...empty, references: 1, implementations: 1, experiments: 1, resultExperiments: 1 }), "Empirical result");
  assert.equal(deriveEvidenceStage({ ...empty, references: 1, implementations: 1, experiments: 1, resultExperiments: 1, replicatedResults: 1 }), "Replicated");
});

test("later evidence layers dominate without inventing prerequisite counts", () => {
  assert.equal(deriveEvidenceStage({ ...empty, resultExperiments: 1 }), "Empirical result");
  assert.equal(deriveEvidenceStage({ ...empty, replicatedResults: 1 }), "Replicated");
});
