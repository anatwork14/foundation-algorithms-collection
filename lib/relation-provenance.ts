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
    sourceId: "ucb1",
    targetId: "linucb",
    relationType: "generalizes",
    referenceIds: ["auer-2002-ucb1", "li-2010-contextual-bandit-news"],
    evidenceNote: "Auer, Cesa-Bianchi, and Fischer establish confidence-bound exploration for stochastic multi-armed bandits, while Li et al. extend the optimism principle to context-dependent linear reward models. Together these primary sources ground the archive's UCB1-to-LinUCB generalization edge without claiming that LinUCB is the only contextual generalization of UCB.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "linucb",
    targetId: "thompson-sampling",
    relationType: "alternative-to",
    referenceIds: ["li-2010-contextual-bandit-news", "agrawal-goyal-2013-contextual-thompson"],
    evidenceNote: "Li et al. provide the archive's primary LinUCB source for confidence-bound action selection with contextual linear reward structure, while Agrawal and Goyal design and analyze Thompson Sampling for stochastic contextual bandits with linear payoffs and explicitly compare posterior sampling with UCB-family approaches to the same problem class. Together they ground this alternative-method edge without claiming identical assumptions, priors, confidence construction, regret constants, or empirical behavior.",
    verifiedAt: "2026-10-04",
  },
  {
    sourceId: "thompson-sampling",
    targetId: "linucb",
    relationType: "alternative-to",
    referenceIds: ["agrawal-goyal-2013-contextual-thompson", "li-2010-contextual-bandit-news"],
    evidenceNote: "Agrawal and Goyal establish a linear-contextual Thompson Sampling method based on randomized posterior-style parameter sampling, while Li et al. provide LinUCB's optimistic confidence-bound construction for contextual recommendation. These primary sources justify the inverse alternative edge while preserving the distinct exploration mechanisms and source-specific assumptions of the two methods.",
    verifiedAt: "2026-10-04",
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
    sourceId: "thompson-sampling",
    targetId: "ucb1",
    relationType: "alternative-to",
    referenceIds: ["chapelle-2011-thompson-evaluation"],
    evidenceNote: "Chapelle and Li empirically evaluate Thompson Sampling against UCB-family baselines across simulated and real-world bandit tasks. That direct comparison grounds the inverse Thompson-Sampling-to-UCB1 alternative edge while preserving differences in posterior sampling, confidence-bound optimism, assumptions, and workload-dependent outcomes rather than asserting a universal winner.",
    verifiedAt: "2026-10-04",
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
    sourceId: "lattice-problems",
    targetId: "fhe",
    relationType: "used-by",
    referenceIds: ["gentry-2009-fully-homomorphic-encryption"],
    evidenceNote: "Gentry's STOC 2009 construction uses ideal lattices and bootstrapping to obtain fully homomorphic encryption, directly grounding the archive's lattice-foundation-to-FHE edge. This provenance supports the historical lattice lineage without implying that every modern FHE construction uses exactly Gentry's ideal-lattice scheme or identical assumptions.",
    verifiedAt: "2026-10-03",
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
    sourceId: "transformer-attention",
    targetId: "state-space-models",
    relationType: "alternative-to",
    referenceIds: ["gu-2023-mamba"],
    evidenceNote: "Gu and Dao motivate selective state-space models by contrasting their linear-time recurrent sequence computation with the quadratic sequence-length cost of Transformer attention. The primary Mamba paper therefore directly supports the inverse Transformer-to-SSM alternative edge while preserving the architectures' different memory, routing, and content-interaction mechanisms.",
    verifiedAt: "2026-10-05",
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
    referenceIds: ["de-moura-bjorner-2008-z3", "cadar-2008-klee"],
    evidenceNote: "de Moura and Bjørner provide the primary SMT-solver source for theory-aware satisfiability, while KLEE demonstrates symbolic execution consuming solver-backed path constraints to determine feasible branches and construct concrete inputs. Together they ground the archive's SAT/SMT-to-symbolic-execution `used-by` edge without implying that every symbolic executor uses Z3 or the same theory stack.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "error-correcting-codes",
    targetId: "surface-code-decoding",
    relationType: "used-by",
    referenceIds: ["dennis-2002-topological-quantum-memory"],
    evidenceNote: "Dennis et al. analyze surface codes explicitly as quantum error-correcting codes and formulate recovery protocols for identifying/correcting error chains from syndrome information. This grounds the archive's coding-theory-to-surface-code-decoding edge without collapsing classical and quantum decoding assumptions into one model.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "symbolic-execution",
    targetId: "coverage-guided-fuzzing",
    relationType: "combines-with",
    referenceIds: ["stephens-2016-driller"],
    evidenceNote: "Driller uses fuzzing for inexpensive broad exploration and selectively invokes concolic execution to generate inputs for complex conditions the fuzzer cannot satisfy, directly grounding the archive's symbolic-execution/fuzzing combination edge.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "coverage-guided-fuzzing",
    targetId: "symbolic-execution",
    relationType: "combines-with",
    referenceIds: ["stephens-2016-driller"],
    evidenceNote: "Driller's hybrid design lets the instrumented fuzzer identify stalled compartments and uses selective concolic execution to solve blocking predicates and return new inputs, grounding the inverse fuzzing/symbolic-execution combination edge without claiming either technique subsumes the other.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "secure-multiparty-computation",
    targetId: "fhe",
    relationType: "alternative-to",
    referenceIds: ["goldreich-micali-wigderson-1987-mental-game", "gentry-2009-fully-homomorphic-encryption"],
    evidenceNote: "GMW gives a general interactive multiparty-computation model under explicit adversary assumptions, while Gentry gives encrypted circuit evaluation through fully homomorphic encryption. Together they source the archive's alternative private-computation models without asserting equivalent trust, interaction, assumptions, or performance.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "secure-multiparty-computation",
    targetId: "zero-knowledge-proofs",
    relationType: "combines-with",
    referenceIds: ["goldreich-micali-wigderson-1987-mental-game", "goldwasser-micali-rackoff-1989-knowledge-complexity"],
    evidenceNote: "Goldwasser, Micali, and Rackoff provide the foundational zero-knowledge definition, while GMW uses zero-knowledge subprotocols to enforce correct behavior against malicious deviation in its secure-computation construction. Together they ground this combination edge without implying that every MPC protocol requires zero knowledge or that zero-knowledge proofs are specific to MPC.",
    verifiedAt: "2026-10-03",
  },
  {
    sourceId: "transformer-attention",
    targetId: "graph-neural-networks",
    relationType: "combines-with",
    referenceIds: ["ying-2021-graphormer"],
    evidenceNote: "Ying et al. build Graphormer directly on the standard Transformer architecture while injecting graph-structural encodings into node representations and self-attention. This primary graph-Transformer construction grounds the Transformer-to-GNN combination edge without implying that every graph neural network uses Transformer attention or the same structural encodings.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "graph-neural-networks",
    targetId: "transformer-attention",
    relationType: "combines-with",
    referenceIds: ["ying-2021-graphormer"],
    evidenceNote: "Graphormer combines graph-specific centrality, spatial, and edge encodings with a Transformer attention backbone for graph representation learning. That primary method directly grounds the inverse GNN-to-Transformer combination edge while keeping local message-passing GNNs, graph Transformers, and other graph architectures conceptually distinct.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "transformer-attention",
    targetId: "mixture-of-experts",
    relationType: "combines-with",
    referenceIds: ["fedus-2022-switch-transformer"],
    evidenceNote: "Fedus, Zoph, and Shazeer construct Switch Transformer from Transformer/T5 models and replace dense feed-forward capacity with sparsely activated experts selected by a router. This directly grounds the Transformer-to-MoE combination edge while preserving that Transformer attention and expert routing remain distinct architectural mechanisms.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "mixture-of-experts",
    targetId: "transformer-attention",
    relationType: "combines-with",
    referenceIds: ["fedus-2022-switch-transformer"],
    evidenceNote: "Switch Transformer is a primary sparse-MoE extension of Transformer language models: token-level routing activates selected experts within an otherwise Transformer-based architecture. This grounds the inverse MoE-to-Transformer combination edge without implying that every MoE system is a Transformer or uses Switch's single-expert routing.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "diffusion-models",
    targetId: "flow-matching",
    relationType: "alternative-to",
    referenceIds: ["ho-2020-ddpm", "lipman-2023-flow-matching"],
    evidenceNote: "Ho, Jain, and Abbeel provide the canonical DDPM forward-noise/reverse-denoising formulation, while Lipman et al. introduce Flow Matching and explicitly show that diffusion probability paths are one supported path family alongside non-diffusion transport paths. Together these primary sources ground the diffusion-to-flow alternative edge without treating the methods as disjoint or universally superior to one another.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "flow-matching",
    targetId: "diffusion-models",
    relationType: "alternative-to",
    referenceIds: ["lipman-2023-flow-matching", "ho-2020-ddpm"],
    evidenceNote: "Flow Matching directly compares its simulation-free vector-field regression framework with diffusion-based generative modeling, supports diffusion paths as specific instances, and also permits non-diffusion paths such as optimal-transport interpolations. Paired with the DDPM primary source, this grounds the inverse flow-to-diffusion alternative edge while preserving their distinct training and sampling formulations.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "quantum-fourier-transform",
    targetId: "quantum-phase-estimation",
    relationType: "used-by",
    referenceIds: ["cleve-1998-quantum-algorithms-revisited"],
    evidenceNote: "Cleve et al. construct phase estimation by coherently accumulating powers of an eigenphase and applying inverse QFT to recover an m-bit estimator. This directly grounds the QFT-to-QPE used-by edge while preserving that iterative and Kitaev-style phase-estimation variants need not execute the same full inverse-QFT circuit.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "quantum-phase-estimation",
    targetId: "quantum-fourier-transform",
    relationType: "depends-on",
    referenceIds: ["cleve-1998-quantum-algorithms-revisited"],
    evidenceNote: "In the canonical Fourier-based phase-estimation construction of Cleve et al., controlled unitary powers encode phase in the control register and inverse QFT turns the resulting Fourier structure into a measurable phase estimate. This grounds the QPE-to-QFT dependency edge only for that canonical formulation, not for all phase-estimation variants.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "quantum-phase-estimation",
    targetId: "qsvt",
    relationType: "alternative-to",
    referenceIds: ["gilyen-2018-qsvt"],
    evidenceNote: "Gilyén et al. explicitly develop singular-value-transformation-based procedures that replace phase-estimation-based spectral transformations in important matrix-algorithm settings. This grounds the reciprocal QPE-to-QSVT alternative edge while preserving that QPE remains appropriate for direct eigenphase estimation and is not universally interchangeable with QSVT.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "graph-neural-networks",
    targetId: "surface-code-decoding",
    relationType: "combines-with",
    referenceIds: ["lange-2025-gnn-qec-decoder"],
    evidenceNote: "Lange et al. formulate quantum-error-correction decoding as graph classification: stabilizer measurements become an annotated detector graph and a GNN predicts the most likely logical-error class, with evaluation on circuit-level surface-code noise. This directly grounds the GNN-to-surface-decoding combination edge without implying universal superiority over matching or other decoders.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "surface-code-decoding",
    targetId: "graph-neural-networks",
    relationType: "combines-with",
    referenceIds: ["lange-2025-gnn-qec-decoder"],
    evidenceNote: "The same primary study applies a graph-neural-network decoder to surface-code syndrome data by constructing detector graphs from stabilizer measurements and predicting logical-error classes. This grounds the reciprocal surface-decoding-to-GNN combination edge while keeping performance claims specific to the studied codes, noise models, and datasets.",
    verifiedAt: "2026-10-06",
  },
  {
    sourceId: "amplitude-estimation",
    targetId: "grover-search",
    relationType: "depends-on",
    referenceIds: ["brassard-2002-amplitude-amplification-estimation"],
    evidenceNote: "Brassard et al. define amplitude estimation around the amplitude-amplification/Grover operator built from state preparation and the good-state reflection. This directly grounds the canonical Amplitude-Estimation-to-Grover dependency while preserving that modern amplitude-estimation variants may realize the amplification/query structure differently.",
    verifiedAt: "2026-10-07",
  },
  {
    sourceId: "amplitude-estimation",
    targetId: "quantum-phase-estimation",
    relationType: "depends-on",
    referenceIds: ["brassard-2002-amplitude-amplification-estimation"],
    evidenceNote: "Canonical amplitude estimation applies phase estimation to the amplitude-amplification operator and converts the recovered phase into an amplitude estimate. This grounds the QAE-to-QPE dependency specifically for the canonical construction, not for iterative or likelihood-based variants that avoid the same full phase-estimation circuit.",
    verifiedAt: "2026-10-07",
  },
  {
    sourceId: "learned-heuristics",
    targetId: "a-star",
    relationType: "combines-with",
    referenceIds: ["agostinelli-2019-deepcubea"],
    evidenceNote: "Agostinelli et al. learn a neural cost-to-go function and use it to guide a weighted A* search over puzzle states. This directly grounds the Learned-Heuristics-to-A* combination edge while preserving that learned estimates can violate admissibility or consistency and therefore do not inherit classical A* optimality guarantees automatically.",
    verifiedAt: "2026-10-07",
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
