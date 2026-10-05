import assert from "node:assert/strict";
import test from "node:test";
import { getReference } from "../lib/references.ts";
import { getReplication } from "../lib/replications.ts";

test("GNN benchmark cites GAT while independent replication remains scoped to GCN and GraphSAGE", () => {
  const evaluation = getReference("dwivedi-2023-gnn-benchmark");
  const replication = getReplication("dwivedi-2023-gnn-benchmark");

  assert.ok(evaluation);
  assert.equal(evaluation.evidenceRole, "Replication / evaluation");
  assert.equal(evaluation.year, 2023);
  assert.deepEqual(
    evaluation.citations.map((citation) => citation.targetId).sort(),
    ["hamilton-2017-graphsage", "kipf-welling-2017-gcn", "velickovic-2018-gat"],
  );
  assert.match(evaluation.significance, /Yoshua Bengio/i);
  assert.match(evaluation.significance, /excluded.*independent-replication/i);

  assert.ok(replication);
  assert.equal(replication.outcome, "Partially supports");
  assert.deepEqual(replication.algorithmIds, ["graph-neural-networks"]);
  assert.deepEqual(
    replication.originalReferenceIds.sort(),
    ["hamilton-2017-graphsage", "kipf-welling-2017-gcn"],
  );
  assert.equal(replication.originalReferenceIds.includes("velickovic-2018-gat"), false);
  assert.match(replication.independenceNote, /no author overlap/i);
});