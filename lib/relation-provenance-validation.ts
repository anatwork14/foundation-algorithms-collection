import type { AlgorithmEntity } from "@/lib/algorithms";
import type { ReferenceEntity } from "@/lib/references";
import { relationProvenanceKey, type RelationProvenanceRecord } from "./relation-provenance.ts";

export function validateRelationProvenance(
  records: RelationProvenanceRecord[],
  algorithms: AlgorithmEntity[],
  references: ReferenceEntity[],
) {
  const errors: string[] = [];
  const algorithmsById = new Map(algorithms.map((algorithm) => [algorithm.id, algorithm]));
  const referencesById = new Map(references.map((reference) => [reference.id, reference]));
  const seen = new Set<string>();

  for (const record of records) {
    const key = relationProvenanceKey(record.sourceId, record.relationType, record.targetId);
    if (seen.has(key)) errors.push(`Duplicate relation provenance record: ${key}`);
    seen.add(key);

    const source = algorithmsById.get(record.sourceId);
    const target = algorithmsById.get(record.targetId);
    if (!source) errors.push(`${key}: source algorithm does not exist`);
    if (!target) errors.push(`${key}: target algorithm does not exist`);

    if (source && !source.relations.some((relation) => relation.target === record.targetId && relation.type === record.relationType)) {
      errors.push(`${key}: provenance does not match an existing source relation`);
    }

    if (!record.referenceIds.length) errors.push(`${key}: at least one reference is required`);
    if (new Set(record.referenceIds).size !== record.referenceIds.length) errors.push(`${key}: duplicate reference id`);

    for (const referenceId of record.referenceIds) {
      const reference = referencesById.get(referenceId);
      if (!reference) {
        errors.push(`${key}: reference does not exist: ${referenceId}`);
        continue;
      }
      const overlapsEdge = reference.algorithmIds.includes(record.sourceId) || reference.algorithmIds.includes(record.targetId);
      if (!overlapsEdge) errors.push(`${key}: reference ${referenceId} is not linked to either edge endpoint`);
    }

    if (!record.evidenceNote.trim()) errors.push(`${key}: evidence note is required`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.verifiedAt)) errors.push(`${key}: verifiedAt must use YYYY-MM-DD`);
  }

  return errors;
}

export function assertValidRelationProvenance(
  records: RelationProvenanceRecord[],
  algorithms: AlgorithmEntity[],
  references: ReferenceEntity[],
) {
  const errors = validateRelationProvenance(records, algorithms, references);
  if (errors.length) {
    throw new Error(`Relation provenance validation failed:\n- ${errors.join("\n- ")}`);
  }
}
