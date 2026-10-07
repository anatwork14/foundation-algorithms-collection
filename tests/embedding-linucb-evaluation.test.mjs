import assert from "node:assert/strict";
import test from "node:test";

import { getReference } from "../lib/references.ts";
import {
  getReplication,
  replicationsForAlgorithm,
} from "../lib/replications.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("retrieval-trained embedding study is preserved as an inconclusive independent LinUCB evaluation", () => {
  const reference = getReference("canim-2026-embedding-linucb-evaluation");
  const replication = getReplication("canim-2026-embedding-linucb-evaluation");

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Replication / evaluation");
  assert.equal(reference.doi, "10.3390/math14162874");
  assert.deepEqual(reference.algorithmIds, ["linucb", "embedding-models"]);
  assert.ok(reference.citations.some((citation) => citation.targetId === "li-2010-contextual-bandit-news"));

  assert.ok(replication);
  assert.deepEqual(replication.algorithmIds, ["linucb"]);
  assert.deepEqual(replication.originalReferenceIds, ["li-2010-contextual-bandit-news"]);
  assert.equal(replication.outcome, "Inconclusive");
  assert.match(replication.summary, /no universal LinUCB advantage|does not yield a universal/i);
  assert.match(replication.summary, /does not reproduce the original Yahoo/i);
  assert.match(replication.independenceNote, /no author overlap/i);
  assert.ok(replicationsForAlgorithm("linucb").some((record) => record.id === replication.id));

  const relation = getRelationProvenance(
    "embedding-models",
    "combines-with",
    "linucb",
  );
  assert.ok(relation);
  assert.deepEqual(relation.referenceIds, [reference.id]);
  assert.equal(relation.verifiedAt, "2026-10-07");
  assert.match(relation.evidenceNote, /mixed results|dataset/i);
});
