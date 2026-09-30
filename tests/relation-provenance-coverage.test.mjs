import assert from "node:assert/strict";
import test from "node:test";
import { getRelationProvenanceCoverage } from "../lib/relation-provenance-coverage.ts";

test("relation provenance coverage separates sourced and conceptual graph edges", () => {
  const algorithms = [
    { id: "a", relations: [{ target: "b" }, { target: "c" }] },
    { id: "b", relations: [{ target: "c" }] },
    { id: "c", relations: [] },
  ];
  const provenance = [
    { sourceId: "a", targetId: "b" },
  ];

  assert.deepEqual(getRelationProvenanceCoverage(algorithms, provenance), {
    typedEdges: 3,
    sourceBackedEdges: 1,
    conceptualEdges: 2,
    algorithmsWithSourceBackedEdges: 2,
  });
});

test("relation provenance coverage reports zero conceptual edges when every typed edge is sourced", () => {
  const algorithms = [
    { id: "a", relations: [{ target: "b" }] },
    { id: "b", relations: [] },
  ];
  const provenance = [{ sourceId: "a", targetId: "b" }];

  assert.deepEqual(getRelationProvenanceCoverage(algorithms, provenance), {
    typedEdges: 1,
    sourceBackedEdges: 1,
    conceptualEdges: 0,
    algorithmsWithSourceBackedEdges: 2,
  });
});

test("relation provenance coverage remains honest for an empty provenance registry", () => {
  const algorithms = [
    { id: "a", relations: [{ target: "b" }] },
    { id: "b", relations: [] },
  ];

  assert.deepEqual(getRelationProvenanceCoverage(algorithms, []), {
    typedEdges: 1,
    sourceBackedEdges: 0,
    conceptualEdges: 1,
    algorithmsWithSourceBackedEdges: 0,
  });
});
