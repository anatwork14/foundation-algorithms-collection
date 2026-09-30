import assert from "node:assert/strict";
import test from "node:test";
import { atlasEvidenceParam, parseAtlasState, updateAtlasSearch } from "../lib/atlas-state.ts";

const options = {
  algorithmIds: ["linucb", "hnsw", "a-star"],
  fields: ["Foundations", "AI / ML", "Quantum", "Cybersecurity", "Cross-field"],
};

test("Atlas state parses valid deep-link parameters", () => {
  assert.deepEqual(
    parseAtlasState("?algorithm=hnsw&field=AI+%2F+ML&relation=used-by&evidence=source-backed", options),
    {
      algorithmId: "hnsw",
      field: "AI / ML",
      relationType: "used-by",
      relationEvidence: "Source-backed",
    },
  );
});

test("Atlas state falls back conservatively for unknown parameters", () => {
  assert.deepEqual(
    parseAtlasState("?algorithm=missing&field=Unknown&relation=invented&evidence=maybe", options),
    {
      algorithmId: "linucb",
      field: "All",
      relationType: "All",
      relationEvidence: "All",
    },
  );
});

test("Atlas evidence filter uses stable human-readable URL values", () => {
  assert.equal(atlasEvidenceParam("All"), null);
  assert.equal(atlasEvidenceParam("Source-backed"), "source-backed");
  assert.equal(atlasEvidenceParam("Conceptual"), "conceptual");
});

test("Atlas query mutation preserves unrelated state and removes defaults cleanly", () => {
  assert.equal(
    updateAtlasSearch("?field=Quantum&evidence=conceptual", "algorithm", "hnsw"),
    "?field=Quantum&evidence=conceptual&algorithm=hnsw",
  );
  assert.equal(updateAtlasSearch("?algorithm=hnsw", "algorithm", null), "");
});
