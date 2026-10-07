import assert from "node:assert/strict";
import test from "node:test";

import { getAlgorithm } from "../lib/algorithm-catalog.ts";
import { getClaim } from "../lib/claims.ts";
import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation } from "../lib/implementations.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("Amplitude Estimation is a first-class source-backed algorithm with executable evidence", () => {
  const algorithm = getAlgorithm("amplitude-estimation");
  const reference = getReference("brassard-2002-amplitude-amplification-estimation");
  const claim = getClaim("amplitude-estimation-amplification-phase-composition");
  const implementation = getImplementation("qiskit-amplitude-estimation");

  assert.ok(algorithm);
  assert.equal(algorithm.name, "Quantum Amplitude Estimation");
  assert.deepEqual(
    algorithm.relations.map((relation) => [relation.target, relation.type]).sort(),
    [
      ["grover-search", "depends-on"],
      ["quantum-phase-estimation", "depends-on"],
    ],
  );

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary method");
  assert.equal(reference.doi, "10.1090/conm/305/05215");
  assert.deepEqual(reference.algorithmIds, ["amplitude-estimation"]);
  assert.ok(reference.citations.some((citation) => citation.targetId === "grover-1996-database-search"));

  assert.ok(claim);
  assert.deepEqual(claim.algorithmIds, ["amplitude-estimation"]);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "Canonical amplitude estimation combines amplitude amplification operators with phase estimation.",
  );

  const toGrover = getRelationProvenance("amplitude-estimation", "depends-on", "grover-search");
  const toQpe = getRelationProvenance("amplitude-estimation", "depends-on", "quantum-phase-estimation");
  assert.ok(toGrover);
  assert.ok(toQpe);
  assert.deepEqual(toGrover.referenceIds, [reference.id]);
  assert.deepEqual(toQpe.referenceIds, [reference.id]);
  assert.equal(toGrover.verifiedAt, "2026-10-07");
  assert.equal(toQpe.verifiedAt, "2026-10-07");

  assert.ok(implementation);
  assert.equal(implementation.verifiedCommit, "bcb7ded3594dac02e14acce7f59f05976916d39d");
  assert.equal(implementation.lastVerified, "2026-10-07");
  assert.equal(implementation.license, "Apache-2.0");
  assert.deepEqual(implementation.algorithmIds, ["amplitude-estimation"]);
  assert.match(implementation.implementationNotes.join(" "), /PhaseEstimation/i);
  assert.match(implementation.implementationNotes.join(" "), /inverse QFT/i);

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedAt, "2026-10-07");
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);
});
