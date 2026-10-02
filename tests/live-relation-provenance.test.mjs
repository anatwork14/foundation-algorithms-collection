import test from "node:test";
import assert from "node:assert/strict";
import { algorithms } from "../lib/algorithm-catalog.ts";
import { references } from "../lib/references.ts";
import { relationProvenance } from "../lib/relation-provenance.ts";
import { validateRelationProvenance } from "../lib/relation-provenance-validation.ts";

test("every curated relation-provenance record resolves against the live Atlas graph", () => {
  assert.deepEqual(validateRelationProvenance(relationProvenance, algorithms, references), []);
});

test("every sourced Atlas edge points to at least one curated reference touching the edge", () => {
  const referencesById = new Map(references.map((reference) => [reference.id, reference]));

  for (const record of relationProvenance) {
    assert.ok(record.referenceIds.length > 0, `${record.sourceId} → ${record.targetId} must cite a source`);
    assert.ok(record.evidenceNote.trim().length > 20, `${record.sourceId} → ${record.targetId} needs a substantive evidence note`);

    for (const referenceId of record.referenceIds) {
      const reference = referencesById.get(referenceId);
      assert.ok(reference, `${record.sourceId} → ${record.targetId}: missing reference ${referenceId}`);
      assert.ok(
        reference.algorithmIds.includes(record.sourceId) || reference.algorithmIds.includes(record.targetId),
        `${record.sourceId} → ${record.targetId}: ${referenceId} must touch an edge endpoint`,
      );
    }
  }
});
