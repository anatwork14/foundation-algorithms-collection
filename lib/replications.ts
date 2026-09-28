import type { ReferenceEntity } from "@/lib/references";

export type ReplicationOutcome =
  | "Supports original finding"
  | "Partially supports"
  | "Does not reproduce"
  | "Inconclusive";

export type ReplicationRecord = {
  id: string;
  title: string;
  algorithmIds: string[];
  replicationReferenceId: string;
  originalReferenceIds: string[];
  outcome: ReplicationOutcome;
  summary: string;
  independenceNote: string;
  verifiedAt: string;
};

/**
 * Intentionally empty until an independently authored replication/evaluation
 * source is directly verified and curated. Do not infer replication from a
 * second implementation or from this project's own experiments.
 */
export const replications: ReplicationRecord[] = [];

export function replicationsForAlgorithm(algorithmId: string) {
  return replications.filter((record) => record.algorithmIds.includes(algorithmId));
}

export function replicationSearchText(record: ReplicationRecord, references: ReferenceEntity[]) {
  const referenceTitles = [record.replicationReferenceId, ...record.originalReferenceIds]
    .map((id) => references.find((reference) => reference.id === id)?.title ?? id);
  return [
    record.title,
    record.outcome,
    record.summary,
    record.independenceNote,
    ...record.algorithmIds,
    ...referenceTitles,
  ].join(" ").toLowerCase();
}
