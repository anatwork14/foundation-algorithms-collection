import assert from "node:assert/strict";
import test from "node:test";

import { algorithms } from "../lib/algorithm-catalog.ts";
import { getClaim } from "../lib/claims.ts";
import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation } from "../lib/implementations.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("DeepCubeA source-backs learned cost-to-go guidance for A* with executable provenance", () => {
  const reference = getReference("agostinelli-2019-deepcubea");
  const claim = getClaim("learned-cost-to-go-guides-a-star");
  const relation = getRelationProvenance("learned-heuristics", "combines-with", "a-star");
  const implementation = getImplementation("deepcubea-learned-astar");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.doi, "10.1038/s42256-019-0070-z");
  assert.deepEqual(reference.algorithmIds, ["learned-heuristics", "a-star"]);
  assert.ok(reference.citations.some((citation) => citation.targetId === "hart-1968-a-star"));

  assert.ok(claim);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "A learned cost-to-go estimate can be inserted into A* as the heuristic term while the search procedure continues to perform explicit state-space exploration.",
  );

  assert.ok(relation);
  assert.deepEqual(relation.referenceIds, [reference.id]);
  assert.equal(relation.verifiedAt, "2026-10-07");
  assert.match(relation.evidenceNote, /weighted A\*|admissibility/i);

  assert.ok(implementation);
  assert.equal(implementation.verifiedCommit, "919489f14ecbbc80dc1bf1539ac0a462ffaca7c5");
  assert.equal(implementation.license, "MIT");
  assert.equal(implementation.maturity, "Research/prototyping");
  assert.deepEqual(implementation.algorithmIds, ["learned-heuristics", "a-star"]);
  assert.match(implementation.implementationNotes.join(" "), /weighted A\*/i);
  assert.match(implementation.implementationNotes.join(" "), /not a comprehensive behavioral or optimality test suite/i);

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);

  const learned = algorithms.find((algorithm) => algorithm.id === "learned-heuristics");
  assert.ok(learned);
  assert.ok(learned.relations.some((item) => item.target === "a-star" && item.type === "combines-with"));
  assert.ok(learned.relations.some((item) => item.target === "transformer-attention" && item.type === "combines-with"));
  assert.ok(!learned.relations.some((item) => item.target === "transformer-attention" && item.type === "depends-on"));
});
