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
    sourceId: "bayesian-inference",
    targetId: "thompson-sampling",
    relationType: "used-by",
    referenceIds: ["chapelle-2011-thompson-evaluation"],
    evidenceNote: "Chapelle and Li formulate Thompson Sampling through a Bayesian posterior over reward-model parameters and choose actions by sampling from that posterior, directly supporting the archive's Bayesian-inference-to-Thompson relationship.",
    verifiedAt: "2026-10-02",
  },
  {
    sourceId: "ucb1",
    targetId: "thompson-sampling",
    relationType: "alternative-to",
    referenceIds: ["chapelle-2011-thompson-evaluation"],
    evidenceNote: "The independent empirical study evaluates Thompson Sampling against established UCB-style alternatives on simulated and real-world bandit tasks, directly grounding this alternative-exploration-strategy relationship without asserting a universal winner.",
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
    sourceId: "embedding-models",
    targetId: "transformer-attention",
    relationType: "used-by",
    referenceIds: ["vaswani-2017-attention"],
    evidenceNote: "The Transformer paper explicitly uses learned input/output embeddings as the representation layer consumed by its attention-based encoder/decoder stacks, directly grounding the archive's embedding-to-Transformer relationship.",
    verifiedAt: "2026-10-02",
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
  {
    sourceId: "a-star",
    targetId: "dijkstra",
    relationType: "generalizes",
    referenceIds: ["hart-1968-a-star", "dijkstra-1959-shortest-paths"],
    evidenceNote: "This edge is a mathematical synthesis of the two primary methods: Hart, Nilsson, and Raphael formalize cost-plus-heuristic minimum-cost search, while Dijkstra formalizes path-cost-driven shortest-path selection. Setting the A* heuristic term to zero leaves path-cost ordering, yielding the Dijkstra/uniform-cost special case represented by the archive.",
    verifiedAt: "2026-10-02",
  },
  {
    sourceId: "dijkstra",
    targetId: "a-star",
    relationType: "special-case-of",
    referenceIds: ["dijkstra-1959-shortest-paths", "hart-1968-a-star"],
    evidenceNote: "This inverse edge records the same derivation in the opposite direction: Dijkstra's nonnegative shortest-path selection is recovered from the A* evaluation rule when the heuristic contribution is zero. The record links both primary method papers and treats the relationship as an archive synthesis rather than a verbatim historical claim.",
    verifiedAt: "2026-10-02",
  },
  {
    sourceId: "q-learning",
    targetId: "dynamic-programming",
    relationType: "derived-from",
    referenceIds: ["watkins-dayan-1992-q-learning"],
    evidenceNote: "Watkins and Dayan formulate Q-learning around the optimal action-value recursion and prove convergence toward optimal action values under the paper's tabular stochastic-process conditions. This directly grounds the archive's view of Q-learning as a sampled Bellman/dynamic-programming lineage rather than an unrelated control rule.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "dynamic-programming",
    targetId: "q-learning",
    relationType: "used-by",
    referenceIds: ["watkins-dayan-1992-q-learning"],
    evidenceNote: "The Q-learning primary paper's recursive optimal-value target is the dynamic-programming/Bellman structure consumed by the incremental learning rule. This inverse provenance record grounds the existing Dynamic Programming → Q-learning `used-by` edge without claiming that all dynamic programming is reinforcement learning.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "bayesian-optimization",
    targetId: "bayesian-inference",
    relationType: "depends-on",
    referenceIds: ["jones-1998-efficient-global-optimization"],
    evidenceNote: "Jones, Schonlau, and Welch model the expensive objective with an uncertainty-bearing stochastic surrogate and use its predictive distribution to compute expected improvement. This directly grounds the archive's Bayesian/probabilistic-inference dependency for classical Bayesian optimization while leaving room for non-Gaussian and modern surrogate variants.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "bayesian-inference",
    targetId: "bayesian-optimization",
    relationType: "used-by",
    referenceIds: ["jones-1998-efficient-global-optimization"],
    evidenceNote: "The EGO primary paper uses posterior/predictive uncertainty from its stochastic surrogate to decide where to evaluate the expensive black-box objective next, supporting the inverse Bayesian-inference → Bayesian-optimization edge without implying that all Bayesian inference is optimization.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "learned-heuristics",
    targetId: "branch-and-bound",
    relationType: "combines-with",
    referenceIds: ["khalil-2016-learning-to-branch"],
    evidenceNote: "Khalil et al. learn an inexpensive ranking surrogate from strong-branching decisions and then use that learned policy for variable selection inside a branch-and-bound MIP solver. This directly grounds the archive's learned-heuristic combination edge while leaving exact pruning and incumbent/bound logic outside the learned model.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "branch-and-bound",
    targetId: "learned-heuristics",
    relationType: "combines-with",
    referenceIds: ["khalil-2016-learning-to-branch"],
    evidenceNote: "The AAAI 2016 primary extension integrates a learned variable-ranking heuristic into branch-and-bound, supporting the inverse combination edge without implying that learned branching alone provides branch-and-bound's exactness guarantee.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "sat-smt-solving",
    targetId: "symbolic-execution",
    relationType: "used-by",
    referenceIds: ["cadar-2008-klee"],
    evidenceNote: "KLEE accumulates symbolic path conditions and invokes its constraint solver to determine whether branch directions are feasible and to construct concrete satisfying inputs. This directly grounds the archive's SAT/SMT-to-symbolic-execution `used-by` edge without implying that every symbolic executor uses the same solver or theory stack.",
    verifiedAt: "2026-10-03",
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
