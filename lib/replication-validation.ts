import type { AlgorithmEntity } from "@/lib/algorithms";
import type { ReferenceEntity } from "@/lib/references";
import type { ReplicationRecord } from "@/lib/replications";

export function validateReplications(
  records: ReplicationRecord[],
  algorithms: AlgorithmEntity[],
  references: ReferenceEntity[],
) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const algorithmIds = new Set(algorithms.map((algorithm) => algorithm.id));
  const referenceById = new Map(references.map((reference) => [reference.id, reference]));

  for (const record of records) {
    if (!record.id || !/^[a-z0-9-]+$/.test(record.id)) errors.push(`Invalid replication id: ${record.id || "<empty>"}`);
    if (ids.has(record.id)) errors.push(`Duplicate replication id: ${record.id}`);
    ids.add(record.id);

    if (!record.title.trim()) errors.push(`${record.id}: title is required`);
    if (!record.algorithmIds.length) errors.push(`${record.id}: at least one algorithm is required`);
    for (const algorithmId of record.algorithmIds) {
      if (!algorithmIds.has(algorithmId)) errors.push(`${record.id}: unknown algorithm ${algorithmId}`);
    }

    const replicationReference = referenceById.get(record.replicationReferenceId);
    if (!replicationReference) {
      errors.push(`${record.id}: unknown replication reference ${record.replicationReferenceId}`);
    } else {
      if (replicationReference.evidenceRole !== "Replication / evaluation") {
        errors.push(`${record.id}: replication source ${record.replicationReferenceId} must use evidence role Replication / evaluation`);
      }
      for (const algorithmId of record.algorithmIds) {
        if (!replicationReference.algorithmIds.includes(algorithmId)) {
          errors.push(`${record.id}: replication source ${record.replicationReferenceId} does not link algorithm ${algorithmId}`);
        }
      }
    }

    if (!record.originalReferenceIds.length) errors.push(`${record.id}: at least one original reference is required`);
    const originalIds = new Set<string>();
    for (const referenceId of record.originalReferenceIds) {
      if (originalIds.has(referenceId)) errors.push(`${record.id}: duplicate original reference ${referenceId}`);
      originalIds.add(referenceId);
      if (referenceId === record.replicationReferenceId) errors.push(`${record.id}: replication source cannot also be an original reference`);
      const original = referenceById.get(referenceId);
      if (!original) {
        errors.push(`${record.id}: unknown original reference ${referenceId}`);
        continue;
      }
      for (const algorithmId of record.algorithmIds) {
        if (!original.algorithmIds.includes(algorithmId)) {
          errors.push(`${record.id}: original reference ${referenceId} does not link algorithm ${algorithmId}`);
        }
      }
      if (replicationReference && !replicationReference.citations.some((citation) => citation.targetId === referenceId)) {
        errors.push(`${record.id}: replication source ${record.replicationReferenceId} must explicitly cite original reference ${referenceId}`);
      }
    }

    if (!record.summary.trim()) errors.push(`${record.id}: summary is required`);
    if (!record.independenceNote.trim()) errors.push(`${record.id}: independence note is required`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.verifiedAt)) errors.push(`${record.id}: verifiedAt must use YYYY-MM-DD`);
  }

  return errors;
}

export function assertValidReplications(
  records: ReplicationRecord[],
  algorithms: AlgorithmEntity[],
  references: ReferenceEntity[],
) {
  const errors = validateReplications(records, algorithms, references);
  if (errors.length) throw new Error(`Replication validation failed:\n- ${errors.join("\n- ")}`);
}
