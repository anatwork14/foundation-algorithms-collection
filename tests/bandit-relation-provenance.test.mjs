import assert from "node:assert/strict";
import test from "node:test";
import { references } from "../lib/references.ts";
import { relationProvenance } from "../lib/relation-provenance.ts";

const referenceById = new Map(references.map((reference) => [reference.id, reference]));

function relationKey(sourceId, relationType, targetId) {
  return `${sourceId}:${relationType}:${targetId}`;
}

const relationByKey = new Map(
  relationProvenance.map((record) => [relationKey(record.sourceId, record.relationType, record.targetId), record]),
);

test("linear contextual Thompson extension is curated as a primary source", () => {
  const reference = referenceById.get("agrawal-goyal-2013-contextual-thompson");
  assert.ok(reference, "missing Agrawal-Goyal contextual Thompson source");
  assert.equal(reference.evidenceRole, "Primary extension");
  assert.ok(reference.algorithmIds.includes("thompson-sampling"));
  assert.ok(reference.citations.some((citation) => citation.targetId === "thompson-1933-probability-matching"));
});

test("LinUCB and Thompson Sampling keep both alternative directions source-backed", () => {
  const expectedRelations = [
    ["linucb", "alternative-to", "thompson-sampling"],
    ["thompson-sampling", "alternative-to", "linucb"],
  ];

  for (const [sourceId, relationType, targetId] of expectedRelations) {
    const relation = relationByKey.get(relationKey(sourceId, relationType, targetId));
    assert.ok(relation, `missing source-backed relation ${sourceId} ${relationType} ${targetId}`);
    assert.ok(
      relation.referenceIds.includes("li-2010-contextual-bandit-news"),
      `${sourceId} ${relationType} ${targetId} must cite the LinUCB primary source`,
    );
    assert.ok(
      relation.referenceIds.includes("agrawal-goyal-2013-contextual-thompson"),
      `${sourceId} ${relationType} ${targetId} must cite the contextual Thompson primary extension`,
    );
  }
});
