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
    sourceId: "thompson-sampling",
    targetId: "bayesian-inference",
    relationType: "depends-on",
    referenceIds: ["chapelle-2011-thompson-evaluation"],
    evidenceNote: "Chapelle and Li describe Thompson Sampling in a Bayesian setting: a prior and observed data define a posterior over reward-model parameters, and randomized action selection is driven by that posterior uncertainty. This directly grounds the archive's Bayesian-inference dependency edge.",
    verifiedAt: "2026-10-02",
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
  {
    sourceId: "qsvt",
    targetId: "quantum-phase-estimation",
    relationType: "alternative-to",
    referenceIds: ["gilyen-2018-qsvt"],
    evidenceNote: "The primary QSVT paper explicitly develops singular-value-transformation-based alternatives to phase-estimation-based procedures for spectral/singular-value tasks, including an alternative singular-value-estimation construction. This grounds the archive's alternative-method edge without implying that QPE is obsolete or interchangeable for every application.",
    verifiedAt: "2026-10-02",
  },
  {
    sourceId: "state-space-models",
    targetId: "transformer-attention",
    relationType: "alternative-to",
    referenceIds: ["gu-2023-mamba"],
    evidenceNote: "The Mamba primary paper explicitly positions selective state-space models as a linear-scaling sequence-modeling alternative to Transformer attention, while retaining a distinct recurrent/state-space computation and memory structure.",
    verifiedAt: "2026-10-02",
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

export function relationProvenanceForReference(referenceId: string) {
  return relationProvenance.filter((record) => record.referenceIds.includes(referenceId));
}
