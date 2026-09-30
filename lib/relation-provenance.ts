import type { RelationType } from "@/lib/algorithms";

export type RelationProvenanceRecord = {
  sourceId: string;
  targetId: string;
  relationType: RelationType;
  referenceIds: string[];
  evidenceNote: string;
  verifiedAt: string;
};

export const relationProvenance: RelationProvenanceRecord[] = [
  {
    sourceId: "linucb",
    targetId: "ucb1",
    relationType: "derived-from",
    referenceIds: ["li-2010-contextual-bandit-news"],
    evidenceNote: "The primary LinUCB paper formulates contextual action selection with upper-confidence-bound optimism, supporting the UCB lineage represented by this edge.",
    verifiedAt: "2026-09-30",
  },
  {
    sourceId: "neural-ucb",
    targetId: "linucb",
    relationType: "derived-from",
    referenceIds: ["zhou-2020-neuralucb"],
    evidenceNote: "The NeuralUCB paper explicitly positions nonlinear neural confidence-bound exploration as an extension beyond successful linear contextual-bandit methods.",
    verifiedAt: "2026-09-30",
  },
  {
    sourceId: "embedding-models",
    targetId: "hnsw",
    relationType: "used-by",
    referenceIds: ["malkov-2018-hnsw"],
    evidenceNote: "The HNSW primary source establishes hierarchical graph indexing for high-dimensional approximate nearest-neighbor vectors, which is the retrieval role represented by this edge.",
    verifiedAt: "2026-09-30",
  },
  {
    sourceId: "lattice-problems",
    targetId: "ml-kem",
    relationType: "used-by",
    referenceIds: ["nist-2024-fips203"],
    evidenceNote: "FIPS 203 specifies ML-KEM as a module-lattice-based key-encapsulation mechanism, directly grounding this lattice-foundation relationship.",
    verifiedAt: "2026-09-30",
  },
];

export function relationProvenanceKey(sourceId: string, relationType: RelationType, targetId: string) {
  return `${sourceId}:${relationType}:${targetId}`;
}

const byRelation = new Map(
  relationProvenance.map((record) => [
    relationProvenanceKey(record.sourceId, record.relationType, record.targetId),
    record,
  ]),
);

export function getRelationProvenance(sourceId: string, relationType: RelationType, targetId: string) {
  return byRelation.get(relationProvenanceKey(sourceId, relationType, targetId)) ?? null;
}

export function relationProvenanceForAlgorithm(algorithmId: string) {
  return relationProvenance.filter((record) => record.sourceId === algorithmId || record.targetId === algorithmId);
}
