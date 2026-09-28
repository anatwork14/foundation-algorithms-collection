import test from "node:test";
import assert from "node:assert/strict";
import { filterArchiveDocuments } from "../lib/archive-filter.ts";

const documents = [
  {
    slug: "02-beta",
    title: "Beta Decisions",
    summary: "Adaptive decisions with partial feedback.",
    field: "AI / ML",
    number: "2",
    words: 220,
    minutes: 1,
    headings: [],
    searchText: "contextual decision making and exploration",
    passages: [],
  },
  {
    slug: "10-alpha",
    title: "Alpha Foundations",
    summary: "Core optimization foundations.",
    field: "Foundations",
    number: "10",
    words: 520,
    minutes: 3,
    headings: [],
    searchText: "gradient methods and optimization",
    passages: [],
  },
  {
    slug: "03-gamma",
    title: "Gamma Retrieval",
    summary: "Approximate vector retrieval systems.",
    field: "Foundations",
    number: "3",
    words: 340,
    minutes: 2,
    headings: [],
    searchText: "nearest neighbor retrieval graph",
    passages: [],
  },
];

const discovery = [
  {
    slug: "02-beta",
    algorithmIds: ["linucb"],
    algorithms: [{ id: "linucb", name: "LinUCB" }],
    families: ["Bandits"],
    evidence: ["References", "Experiments"],
    evidenceStages: ["Experiment protocol"],
  },
  {
    slug: "10-alpha",
    algorithmIds: ["adamw"],
    algorithms: [{ id: "adamw", name: "AdamW" }],
    families: ["Optimization"],
    evidence: ["References"],
    evidenceStages: ["Source-backed"],
  },
  {
    slug: "03-gamma",
    algorithmIds: ["hnsw"],
    algorithms: [{ id: "hnsw", name: "HNSW" }],
    families: ["Approximate nearest neighbor"],
    evidence: ["References", "Implementations"],
    evidenceStages: ["Inspectable implementation"],
  },
];

const base = {
  query: "",
  field: "All",
  family: "All",
  algorithm: "All",
  evidence: "All",
  stage: "All",
  sort: "number",
};

function slugs(state = {}) {
  return filterArchiveDocuments(documents, discovery, { ...base, ...state }).map((doc) => doc.slug);
}

test("collection-order sorting is numeric rather than lexical", () => {
  assert.deepEqual(slugs(), ["02-beta", "03-gamma", "10-alpha"]);
});

test("query search spans chapter body, algorithm names, families, and evidence stages", () => {
  assert.deepEqual(slugs({ query: "exploration" }), ["02-beta"]);
  assert.deepEqual(slugs({ query: "linucb" }), ["02-beta"]);
  assert.deepEqual(slugs({ query: "approximate nearest neighbor" }), ["03-gamma"]);
  assert.deepEqual(slugs({ query: "source-backed" }), ["10-alpha"]);
});

test("structural filters combine with AND semantics", () => {
  assert.deepEqual(slugs({ field: "Foundations", family: "Optimization", algorithm: "adamw", evidence: "References", stage: "Source-backed" }), ["10-alpha"]);
  assert.deepEqual(slugs({ field: "Foundations", family: "Optimization", evidence: "Implementations" }), []);
});

test("evidence and evidence-stage filters remain distinct", () => {
  assert.deepEqual(slugs({ evidence: "Implementations" }), ["03-gamma"]);
  assert.deepEqual(slugs({ stage: "Experiment protocol" }), ["02-beta"]);
});

test("title and length sort modes are deterministic", () => {
  assert.deepEqual(slugs({ sort: "title" }), ["10-alpha", "02-beta", "03-gamma"]);
  assert.deepEqual(slugs({ sort: "length" }), ["10-alpha", "03-gamma", "02-beta"]);
});

test("documents without discovery metadata still support chapter-text filtering", () => {
  const orphan = {
    slug: "04-orphan",
    title: "Orphan Chapter",
    summary: "Standalone text.",
    field: "Cross-field",
    number: "4",
    words: 100,
    minutes: 1,
    headings: [],
    searchText: "standalone searchable phrase",
    passages: [],
  };
  const results = filterArchiveDocuments([...documents, orphan], discovery, { ...base, query: "standalone searchable phrase" });
  assert.deepEqual(results.map((doc) => doc.slug), ["04-orphan"]);
});
