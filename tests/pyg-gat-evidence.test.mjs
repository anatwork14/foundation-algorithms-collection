import assert from "node:assert/strict";
import test from "node:test";

import { claimsForAlgorithm, getClaim } from "../lib/claims.ts";
import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation, implementationsForAlgorithm } from "../lib/implementations.ts";
import { getReference, referencesForAlgorithm } from "../lib/references.ts";

test("GAT has primary-source and passage-backed mechanism provenance", () => {
  const reference = getReference("velickovic-2018-gat");
  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.venue, "ICLR 2018");
  assert.deepEqual(reference.algorithmIds, ["graph-neural-networks"]);

  const claim = getClaim("gat-learned-neighbor-attention");
  assert.ok(claim);
  assert.equal(claim.kind, "Mechanism");
  assert.equal(claim.chapterSlug, "11-neural-architectures-attention-ssm-moe-gnn");
  assert.equal(claim.passageContains, "GAT learns neighbor weights using attention rather than fixed normalized adjacency weights");
  assert.deepEqual(claim.referenceIds, [reference.id]);
});

test("PyG GAT is a commit-pinned executable record with matching verification history", () => {
  const implementation = getImplementation("pyg-gat");
  assert.ok(implementation);
  assert.equal(implementation.verifiedRef, "master");
  assert.equal(implementation.verifiedCommit, "79d33965a40b7fa83616a9f598a0f8619f25d939");
  assert.equal(implementation.license, "MIT");
  assert.deepEqual(implementation.algorithmIds, ["graph-neural-networks"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    ["GATConv implementation", "GATConv tests", "Repository license"],
  );

  const history = verificationHistoryForImplementation("pyg-gat");
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);
});

test("GNN evidence coverage now includes GCN, GraphSAGE, and GAT", () => {
  const implementationIds = implementationsForAlgorithm("graph-neural-networks").map((item) => item.id).sort();
  assert.deepEqual(implementationIds, ["pyg-gat", "pyg-gcn", "pyg-graphsage"]);

  const claimIds = claimsForAlgorithm("graph-neural-networks").map((item) => item.id).sort();
  assert.deepEqual(claimIds, ["gat-learned-neighbor-attention", "gcn-normalized-neighbor-aggregation", "graphsage-sampled-inductive-aggregation"]);

  const referenceIds = referencesForAlgorithm("graph-neural-networks").map((item) => item.id);
  assert.ok(referenceIds.includes("velickovic-2018-gat"));
});
