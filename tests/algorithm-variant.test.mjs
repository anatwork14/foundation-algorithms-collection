import test from "node:test";
import assert from "node:assert/strict";
import { validateAlgorithmVariants } from "../lib/algorithm-variant-validation.ts";

function algorithm(id = "linucb") {
  return {
    id,
    name: "LinUCB",
    aliases: [],
    fields: ["AI / ML"],
    families: ["Contextual bandit"],
    chapterSlugs: ["08-bandits-contextual-bandits-linucb"],
    summary: "Summary",
    motivation: "Motivation",
    contribution: "Contribution",
    assumptions: ["Assumption"],
    maturity: "Established foundation",
    implementation: ["Implement"],
    failureModes: ["Failure"],
    relations: [],
    tags: [],
    openQuestions: [],
  };
}

function variant(overrides = {}) {
  return {
    id: "shared-linucb",
    parentAlgorithmId: "linucb",
    name: "Shared LinUCB",
    aliases: [],
    summary: "Shared model",
    distinction: "One global model over action-context features.",
    assumptions: ["Useful shared features"],
    tradeoffs: ["Transfers evidence but depends on representation quality"],
    implementationNotes: ["Maintain one global covariance state"],
    sourceLinks: [
      {
        chapterSlug: "08-bandits-contextual-bandits-linucb",
        anchor: "16-shared-linear-model",
        label: "16. Shared Linear Model",
      },
    ],
    tags: ["linucb"],
    ...overrides,
  };
}

const documents = [
  {
    slug: "08-bandits-contextual-bandits-linucb",
    toc: [
      { id: "15-disjoint-linucb", label: "15. Disjoint LinUCB", level: 2 },
      { id: "16-shared-linear-model", label: "16. Shared Linear Model", level: 2 },
      { id: "17-hybrid-linucb", label: "17. Hybrid LinUCB", level: 2 },
    ],
  },
];

test("algorithm variant validates against a real parent and source heading", () => {
  assert.deepEqual(validateAlgorithmVariants([variant()], [algorithm()], documents), []);
});

test("variant validation rejects unknown parent and broken source anchor", () => {
  const errors = validateAlgorithmVariants([
    variant({ parentAlgorithmId: "missing", sourceLinks: [{ chapterSlug: "08-bandits-contextual-bandits-linucb", anchor: "missing-anchor", label: "Missing" }] }),
  ], [algorithm()], documents);

  assert.ok(errors.some((error) => error.includes("parent algorithm does not exist")));
  assert.ok(errors.some((error) => error.includes("source anchor does not exist")));
});

test("variant validation rejects duplicate ids", () => {
  const errors = validateAlgorithmVariants([
    variant(),
    variant({ name: "Duplicate identity" }),
  ], [algorithm()], documents);

  assert.ok(errors.some((error) => error.includes("Duplicate variant id")));
});

test("variant validation rejects ambiguous aliases across distinct variant ids", () => {
  const errors = validateAlgorithmVariants([
    variant({ aliases: ["Global model"] }),
    variant({ id: "alternate-linucb", name: "Alternate LinUCB", aliases: ["Global model"] }),
  ], [algorithm()], documents);

  assert.ok(errors.some((error) => error.includes("Ambiguous variant name/alias")));
});
