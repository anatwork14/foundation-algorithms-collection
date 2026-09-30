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
 * Independent evaluation records remain distinct from this project's own
 * experiments and from additional implementations. A record is only added
 * when an independently authored evaluation source is directly verified.
 */
export const replications: ReplicationRecord[] = [
  {
    id: "aumuller-2020-hnsw-evaluation",
    title: "Independent ANN-Benchmarks evaluation of HNSW",
    algorithmIds: ["hnsw"],
    replicationReferenceId: "aumuller-2020-ann-benchmarks",
    originalReferenceIds: ["malkov-2018-hnsw"],
    outcome: "Partially supports",
    summary: "ANN-Benchmarks evaluates HNSW independently within a standardized multi-algorithm benchmark. Its reported results support HNSW's strong practical high-recall performance relative to other ANN methods, while also documenting benchmark settings where graph-based approaches can be tripped up. This is therefore curated as partial support rather than a blanket reproduction of every claim in the original HNSW paper.",
    independenceNote: "The evaluation is authored by Martin Aumüller, Erik Bernhardsson, and Alexander Faithfull, a different author group from HNSW authors Yu A. Malkov and D. A. Yashunin, and uses the independently developed ANN-Benchmarks framework across multiple algorithms and datasets.",
    verifiedAt: "2026-09-30",
  },
];

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
