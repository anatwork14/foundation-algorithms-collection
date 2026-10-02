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
  {
    id: "chapelle-2011-thompson-evaluation",
    title: "Independent empirical evaluation of Thompson Sampling",
    algorithmIds: ["thompson-sampling"],
    replicationReferenceId: "chapelle-2011-thompson-evaluation",
    originalReferenceIds: ["thompson-1933-probability-matching"],
    outcome: "Partially supports",
    summary: "Chapelle and Li evaluate modern Thompson Sampling on simulated and real-world bandit problems, including display-ad selection and news recommendation. Their results support Thompson Sampling as a highly competitive practical baseline and sometimes show gains over UCB-style alternatives. The record is classified as partial support because this modern evaluation does not reproduce Thompson's 1933 experimental setting or every later theoretical claim attached to posterior sampling.",
    independenceNote: "The evaluation is authored by Olivier Chapelle and Lihong Li, a different author group from William R. Thompson, and evaluates a modern Bayesian formulation on new simulated and real-world datasets roughly eight decades after the original probability-matching paper.",
    verifiedAt: "2026-10-02",
  },
];

const byId = new Map(replications.map((record) => [record.id, record]));

export function getReplication(id: string) {
  return byId.get(id) ?? null;
}

export function replicationsForAlgorithm(algorithmId: string) {
  return replications.filter((record) => record.algorithmIds.includes(algorithmId));
}

export function replicationsForReference(referenceId: string) {
  return replications.filter(
    (record) => record.replicationReferenceId === referenceId || record.originalReferenceIds.includes(referenceId),
  );
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
