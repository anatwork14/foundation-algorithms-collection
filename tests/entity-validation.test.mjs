import test from "node:test";
import assert from "node:assert/strict";
import { validateAlgorithmEntities } from "../lib/algorithm-validation.ts";
import { validateResearchCombinations } from "../lib/combination-validation.ts";

function algorithm(id, overrides = {}) {
  return {
    id,
    name: id === "algorithm-a" ? "Algorithm A" : "Algorithm B",
    aliases: [],
    fields: ["Foundations"],
    families: ["Test family"],
    chapterSlugs: ["chapter-a"],
    summary: "Summary",
    motivation: "Motivation",
    contribution: "Contribution",
    implementation: ["Implement it"],
    failureModes: ["Failure mode"],
    relations: [],
    ...overrides,
  };
}

function combination(overrides = {}) {
  return {
    id: "combination-a",
    algorithmIds: ["algorithm-a", "algorithm-b"],
    motivation: "Motivation",
    hypothesis: "Hypothesis",
    compatibility: ["Compatible interface"],
    tensions: ["Potential tension"],
    expectedBenefits: ["Expected benefit"],
    risks: ["Risk"],
    metrics: ["Metric"],
    experimentPlan: ["Run experiment"],
    sourceChapters: ["chapter-a"],
    ...overrides,
  };
}

const algorithms = [algorithm("algorithm-a"), algorithm("algorithm-b")];

test("minimal algorithm graph validates", () => {
  assert.deepEqual(validateAlgorithmEntities(algorithms, ["chapter-a"]), []);
});

test("algorithm validation rejects ambiguous aliases and broken relations", () => {
  const records = [
    algorithm("algorithm-a", {
      aliases: ["Shared alias"],
      relations: [
        { type: "related", target: "missing", note: "Broken target" },
        { type: "variant-of", target: "algorithm-a", note: "Self target" },
      ],
    }),
    algorithm("algorithm-b", { aliases: ["Shared alias"] }),
  ];
  const errors = validateAlgorithmEntities(records, ["chapter-a"]);

  assert.ok(errors.some((error) => error.includes("Ambiguous name/alias")));
  assert.ok(errors.some((error) => error.includes("relation target does not exist")));
  assert.ok(errors.some((error) => error.includes("self relation is not allowed")));
});

test("minimal research combination validates", () => {
  assert.deepEqual(validateResearchCombinations([combination()], algorithms, ["chapter-a"]), []);
});

test("combination validation rejects duplicate and unknown components plus broken chapters", () => {
  const errors = validateResearchCombinations([
    combination({
      algorithmIds: ["algorithm-a", "algorithm-a", "missing"],
      sourceChapters: ["missing-chapter"],
    }),
  ], algorithms, ["chapter-a"]);

  assert.ok(errors.some((error) => error.includes("duplicate algorithm component")));
  assert.ok(errors.some((error) => error.includes("unknown algorithm component missing")));
  assert.ok(errors.some((error) => error.includes("source chapter does not exist: missing-chapter")));
});
