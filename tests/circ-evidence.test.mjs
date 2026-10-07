import assert from "node:assert/strict";
import test from "node:test";

import { getClaim } from "../lib/claims.ts";
import { verificationHistoryForImplementation } from "../lib/implementation-verification-catalog.ts";
import { getImplementation } from "../lib/implementations.ts";
import { getReference } from "../lib/references.ts";
import { getRelationProvenance } from "../lib/relation-provenance.ts";

test("CirC connects SMT verification and R1CS proof compilation with pinned executable evidence", () => {
  const reference = getReference("ozdemir-2022-circ");
  const claim = getClaim("circ-shared-smt-r1cs-constraint-compilation");
  const implementation = getImplementation("circ-compiler");
  const relation = getRelationProvenance(
    "sat-smt-solving",
    "combines-with",
    "zero-knowledge-proofs",
  );

  assert.ok(reference);
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.equal(reference.doi, "10.1109/SP46214.2022.9833782");
  assert.deepEqual(reference.algorithmIds, ["sat-smt-solving", "zero-knowledge-proofs"]);

  assert.ok(claim);
  assert.deepEqual(claim.referenceIds, [reference.id]);
  assert.equal(
    claim.passageContains,
    "Shared compiler infrastructure can lower a common constraint-oriented intermediate representation to SMT for software verification or to R1CS for proof systems, reusing program-to-constraint transformations across both domains.",
  );

  assert.ok(relation);
  assert.deepEqual(relation.referenceIds, [reference.id]);
  assert.equal(relation.verifiedAt, "2026-10-08");
  assert.match(relation.evidenceNote, /SMT and R1CS backends/i);

  assert.ok(implementation);
  assert.equal(implementation.verifiedCommit, "271f911bab2c8ab15f12f599fd7abf89c4561093");
  assert.equal(implementation.verifiedRef, "master");
  assert.equal(implementation.license, "MIT OR Apache-2.0");
  assert.equal(implementation.maturity, "Research/prototyping");
  assert.deepEqual(implementation.algorithmIds, ["sat-smt-solving", "zero-knowledge-proofs"]);
  assert.deepEqual(
    implementation.sourcePaths.map((item) => item.label),
    [
      "Repository architecture and backend scope",
      "SMT backend",
      "R1CS backend",
      "ZKP proving/verification runner",
      "Build and test workflow",
      "MIT license",
      "Apache-2.0 license",
    ],
  );

  const history = verificationHistoryForImplementation(implementation.id);
  assert.equal(history.length, 1);
  assert.equal(history[0].revision, 1);
  assert.equal(history[0].verifiedCommit, implementation.verifiedCommit);
  assert.deepEqual(history[0].sourcePaths, implementation.sourcePaths);
});
