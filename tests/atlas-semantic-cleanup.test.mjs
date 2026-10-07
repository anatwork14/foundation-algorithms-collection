import assert from "node:assert/strict";
import test from "node:test";

import { algorithms } from "../lib/algorithm-catalog.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("Atlas avoids direct edges when algorithms only share a foundation or are distinct primitives", () => {
  const mlKem = algorithms.find((algorithm) => algorithm.id === "ml-kem");
  const fhe = algorithms.find((algorithm) => algorithm.id === "fhe");
  const grover = algorithms.find((algorithm) => algorithm.id === "grover-search");
  const amplitude = algorithms.find((algorithm) => algorithm.id === "amplitude-estimation");

  assert.ok(mlKem);
  assert.ok(fhe);
  assert.ok(grover);
  assert.ok(amplitude);

  assert.ok(!mlKem.relations.some((relation) => relation.target === "fhe"));
  assert.ok(!fhe.relations.some((relation) => relation.target === "ml-kem"));
  assert.ok(!grover.relations.some((relation) => relation.target === "quantum-phase-estimation"));

  assert.ok(getRelationProvenance("lattice-problems", "depends-on", "ml-kem"));
  assert.ok(getRelationProvenance("lattice-problems", "depends-on", "fhe"));
  assert.ok(getRelationProvenance("amplitude-estimation", "depends-on", "grover-search"));
  assert.ok(getRelationProvenance("amplitude-estimation", "depends-on", "quantum-phase-estimation"));
});
