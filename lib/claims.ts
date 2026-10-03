export type ClaimKind = "Mechanism" | "Assumption" | "Guarantee" | "Standard" | "Empirical";

export type ClaimRecord = {
  id: string;
  kind: ClaimKind;
  statement: string;
  algorithmIds: string[];
  chapterSlug: string;
  passageContains: string;
  referenceIds: string[];
  note: string;
};

/**
 * Claims are deliberately curated. `passageContains` is a unique literal
 * selector into the generated passage index; build validation rejects selectors
 * that match zero or multiple passages.
 */
export const claims: ClaimRecord[] = [
  {
    id: "linucb-optimistic-contextual-score",
    kind: "Mechanism",
    statement: "LinUCB combines a linear predicted reward with an uncertainty bonus and selects the candidate with the highest optimistic score.",
    algorithmIds: ["linucb"],
    chapterSlug: "08-bandits-contextual-bandits-linucb",
    passageContains: "The algorithm therefore selects actions that have either",
    referenceIds: ["li-2010-contextual-bandit-news"],
    note: "This record describes the mechanism summarized in the collection; the linked paper is the primary LinUCB application/source curated by the archive.",
  },
  {
    id: "ucb1-count-based-confidence-bonus",
    kind: "Mechanism",
    statement: "UCB1 adds a confidence bonus that is larger for rarely sampled arms and shrinks as an arm accumulates observations, targeting exploration toward uncertainty.",
    algorithmIds: ["ucb1"],
    chapterSlug: "08-bandits-contextual-bandits-linucb",
    passageContains: "The second term is large for rarely tried arms and shrinks as evidence accumulates",
    referenceIds: ["auer-2002-ucb1"],
    note: "This claim describes the defining count-based optimism mechanism of UCB1. Its textbook confidence interpretation assumes the bounded stationary stochastic setting analyzed by the primary source.",
  },
  {
    id: "thompson-probability-matching",
    kind: "Mechanism",
    statement: "Thompson Sampling turns uncertainty into randomized action selection by sampling a plausible reward model and acting greedily under that sample, yielding probability-matching behavior.",
    algorithmIds: ["thompson-sampling"],
    chapterSlug: "08-bandits-contextual-bandits-linucb",
    passageContains: "This is probability matching: actions are selected roughly according to posterior plausibility that they are optimal",
    referenceIds: ["thompson-1933-probability-matching"],
    note: "The archive uses the 1933 Thompson paper for the historical probability-matching lineage. Modern posterior-sampling formulations and contextual/generalized variants add modeling machinery beyond that original setting.",
  },
  {
    id: "hnsw-hierarchical-navigation",
    kind: "Mechanism",
    statement: "HNSW organizes proximity search into multiple graph layers, using sparse upper layers for long-range navigation and denser lower layers for local refinement.",
    algorithmIds: ["hnsw"],
    chapterSlug: "06-representation-similarity-compression-parsing",
    passageContains: "HNSW builds multiple graph layers. Higher layers contain progressively fewer nodes",
    referenceIds: ["malkov-2018-hnsw"],
    note: "The claim is limited to the hierarchy/navigation mechanism; recall/latency performance remains workload- and parameter-dependent.",
  },
  {
    id: "a-star-cost-plus-heuristic",
    kind: "Mechanism",
    statement: "A* combines accumulated path cost with an estimate of remaining cost, using their sum to prioritize which search state to expand next.",
    algorithmIds: ["a-star"],
    chapterSlug: "02-search-graphs-ordering-indexing",
    passageContains: "known path cost with estimated remaining cost",
    referenceIds: ["hart-1968-a-star"],
    note: "This record captures A*'s cost-plus-heuristic mechanism. Optimality depends on the heuristic and graph-search conditions described separately in the chapter and primary paper.",
  },
  {
    id: "dijkstra-smallest-tentative-distance",
    kind: "Mechanism",
    statement: "Dijkstra's algorithm repeatedly finalizes the unsettled vertex with the smallest tentative distance and relaxes outgoing edges to improve neighboring path estimates.",
    algorithmIds: ["dijkstra"],
    chapterSlug: "02-search-graphs-ordering-indexing",
    passageContains: "Dijkstra maintains tentative distances and repeatedly finalizes the unsettled node with smallest known distance",
    referenceIds: ["dijkstra-1959-shortest-paths"],
    note: "This claim is limited to the greedy settled-node mechanism in the nonnegative-edge setting; negative edge weights require a different correctness argument and algorithm family.",
  },
  {
    id: "ml-kem-fips203-parameter-sets",
    kind: "Standard",
    statement: "NIST FIPS 203 specifies the standardized ML-KEM-512, ML-KEM-768, and ML-KEM-1024 parameter sets.",
    algorithmIds: ["ml-kem"],
    chapterSlug: "31-post-quantum-cryptography",
    passageContains: "NIST FIPS 203 defines ML-KEM-512, ML-KEM-768, and ML-KEM-1024 parameter sets",
    referenceIds: ["nist-2024-fips203"],
    note: "This is a normative-standard claim and should track FIPS 203 rather than an implementation repository.",
  },
  {
    id: "ml-kem-module-lattice-foundation",
    kind: "Assumption",
    statement: "ML-KEM is a module-lattice construction whose security foundation is tied to structured module-lattice hardness rather than classical factoring or discrete-log assumptions.",
    algorithmIds: ["ml-kem", "lattice-problems"],
    chapterSlug: "31-post-quantum-cryptography",
    passageContains: "ML-KEM and ML-DSA are based on module-lattice problems",
    referenceIds: ["nist-2024-fips203"],
    note: "This claim identifies ML-KEM's construction/assumption family only. It does not restate a concrete security level or claim that every lattice problem is equivalent to the standardized ML-KEM security definition.",
  },
  {
    id: "adamw-decoupled-weight-decay",
    kind: "Mechanism",
    statement: "AdamW applies weight decay separately from the adaptive gradient update rather than treating L2 regularization as equivalent under adaptive scaling.",
    algorithmIds: ["adamw"],
    chapterSlug: "10-ai-optimization-learning-theory",
    passageContains: "Decouples weight decay from the adaptive gradient update",
    referenceIds: ["loshchilov-2019-adamw"],
    note: "The claim is limited to the defining decoupling mechanism; optimizer performance depends on task, schedule, and hyperparameters.",
  },
  {
    id: "attention-content-addressable-communication",
    kind: "Mechanism",
    statement: "Scaled dot-product attention uses query-key similarity to compute content-dependent weights over values, making communication content-addressable.",
    algorithmIds: ["transformer-attention"],
    chapterSlug: "11-neural-architectures-attention-ssm-moe-gnn",
    passageContains: "Attention makes communication content-addressable. A query determines which keys are relevant",
    referenceIds: ["vaswani-2017-attention"],
    note: "This record describes the core attention communication mechanism, not a claim that attention is uniquely optimal for sequence modeling.",
  },
  {
    id: "transformer-nonrecurrent-parallelism",
    kind: "Mechanism",
    statement: "Transformer blocks remove mandatory recurrent dependence and permit broad parallel computation across sequence positions during training.",
    algorithmIds: ["transformer-attention"],
    chapterSlug: "11-neural-architectures-attention-ssm-moe-gnn",
    passageContains: "Transformers remove mandatory recurrent dependence and allow broad parallel computation over sequence positions during training",
    referenceIds: ["vaswani-2017-attention"],
    note: "This claim describes the architectural parallelism enabled by the Transformer design. It does not imply that every Transformer operation or autoregressive inference step is fully parallel.",
  },
  {
    id: "transformer-dense-attention-quadratic-scores",
    kind: "Mechanism",
    statement: "Dense self-attention forms pairwise attention scores across sequence positions, giving quadratic score-count scaling with sequence length.",
    algorithmIds: ["transformer-attention"],
    chapterSlug: "11-neural-architectures-attention-ssm-moe-gnn",
    passageContains: "Dense self-attention over sequence length",
    referenceIds: ["vaswani-2017-attention"],
    note: "The claim concerns the dense pairwise attention-score structure. Kernel, sparse, local, compressed, FlashAttention-style, and other implementations can change memory traffic or connectivity without making this statement apply unchanged to every variant.",
  },
  {
    id: "selective-ssm-input-dependent-state-update",
    kind: "Mechanism",
    statement: "Selective state-space models make parts of the recurrent state update input-dependent so the model can adapt what information it retains or discards.",
    algorithmIds: ["state-space-models"],
    chapterSlug: "11-neural-architectures-attention-ssm-moe-gnn",
    passageContains: "Selective SSMs make parts of the state update input-dependent rather than fixed",
    referenceIds: ["gu-2023-mamba"],
    note: "The claim describes selectivity as a mechanism. It does not assert universal superiority over attention or other sequence architectures.",
  },
  {
    id: "qpe-controlled-eigenphase-estimation",
    kind: "Mechanism",
    statement: "Quantum Phase Estimation uses controlled powers of a unitary and an inverse Fourier-style readout to convert an eigenstate's accumulated phase into an estimate of its eigenphase.",
    algorithmIds: ["quantum-phase-estimation"],
    chapterSlug: "21-quantum-search-fourier-phase-estimation",
    passageContains: "QPE turns access to controlled time evolution into eigenvalue information",
    referenceIds: ["kitaev-1995-eigenvalue-measurement"],
    note: "This record captures the archive's core QPE mechanism. Precision and end-to-end cost still depend on controlled-unitary access, coherent evolution time, readout strategy, and fault-tolerant resources.",
  },
  {
    id: "qsvt-singular-value-polynomial-transform",
    kind: "Mechanism",
    statement: "QSVT applies a suitably bounded polynomial transformation to the singular values of a block-encoded matrix, turning polynomial approximation into a reusable quantum operator-transformation pattern.",
    algorithmIds: ["qsvt"],
    chapterSlug: "22-quantum-simulation-qsp-qsvt-linear-algebra",
    passageContains: "QSVT generalizes QSP to block-encoded matrices and transforms singular values",
    referenceIds: ["gilyen-2018-qsvt"],
    note: "This claim is limited to QSVT's core transformation mechanism; end-to-end algorithmic advantage still depends on block-encoding access, normalization, precision, and readout costs.",
  },
  {
    id: "vqe-hybrid-variational-loop",
    kind: "Mechanism",
    statement: "VQE replaces deep phase-estimation-style coherent evolution with a hybrid variational loop built from shallower parameterized circuits and classical optimization.",
    algorithmIds: ["vqe"],
    chapterSlug: "23-quantum-optimization-vqe-qaoa",
    passageContains: "Deep phase-estimation circuits may exceed noisy-device capabilities",
    referenceIds: ["peruzzo-2014-vqe"],
    note: "This claim captures the hybrid architectural motivation of VQE. It does not imply that shallow circuits guarantee useful accuracy, easy optimization, or an end-to-end quantum advantage.",
  },
  {
    id: "qaoa-alternating-cost-mixer",
    kind: "Mechanism",
    statement: "QAOA encodes an objective in a cost Hamiltonian, chooses a mixer, alternates their parameterized evolutions, and classically optimizes the associated angles.",
    algorithmIds: ["qaoa"],
    chapterSlug: "23-quantum-optimization-vqe-qaoa",
    passageContains: "Encode cost function in Hamiltonian",
    referenceIds: ["farhi-2014-qaoa"],
    note: "This record describes the defining alternating cost/mixer construction. Approximation quality, optimization difficulty, and resource requirements depend on depth, instance structure, measurement budget, and implementation details.",
  },
  {
    id: "conformal-finite-sample-marginal-coverage",
    kind: "Guarantee",
    statement: "Conformal prediction constructs prediction sets with finite-sample marginal coverage under exchangeability, while conditional coverage and robustness under shift require additional assumptions or methods.",
    algorithmIds: ["conformal-prediction"],
    chapterSlug: "14-uncertainty-causal-active-continual-meta-learning",
    passageContains: "Conformal methods create prediction sets with finite-sample marginal coverage under exchangeability",
    referenceIds: ["romano-2019-cqr"],
    note: "The archive states the standard marginal-coverage guarantee conservatively and keeps the chapter's documented distribution-shift and conditional-coverage limitations attached to the concept.",
  },
  {
    id: "neuralucb-neural-gradient-uncertainty",
    kind: "Mechanism",
    statement: "NeuralUCB combines neural reward prediction with an upper-confidence exploration signal constructed from neural gradient or tangent-feature geometry.",
    algorithmIds: ["neural-ucb"],
    chapterSlug: "08-bandits-contextual-bandits-linucb",
    passageContains: "NeuralUCB uses a neural network for reward representation",
    referenceIds: ["zhou-2020-neuralucb"],
    note: "This record is limited to the defining NeuralUCB prediction-plus-uncertainty mechanism. It does not imply that practical deep-network uncertainty is automatically calibrated or that NeuralUCB universally improves on linear contextual bandits.",
  },
  {
    id: "grover-reflection-amplitude-rotation",
    kind: "Mechanism",
    statement: "Grover search alternates an oracle phase flip with diffusion/reflection operations that rotate amplitude toward the marked subspace.",
    algorithmIds: ["grover-search"],
    chapterSlug: "21-quantum-search-fourier-phase-estimation",
    passageContains: "These reflections rotate the state toward the marked subspace",
    referenceIds: ["grover-1996-database-search"],
    note: "This claim records the geometric search mechanism. The linked primary paper also establishes the characteristic quadratic oracle-query improvement in the black-box search setting, while end-to-end advantage still depends on oracle construction and fault-tolerant resources.",
  },
  {
    id: "q-learning-off-policy-td-control",
    kind: "Mechanism",
    statement: "Q-learning is an off-policy temporal-difference control method that updates an action value toward immediate reward plus the maximum estimated value of the next state's actions.",
    algorithmIds: ["q-learning"],
    chapterSlug: "05-probabilistic-control-reinforcement-learning",
    passageContains: "It learns toward the greedy target policy while behavior can still explore",
    referenceIds: ["watkins-dayan-1992-q-learning"],
    note: "The claim is limited to the defining off-policy TD target. Convergence statements require the visitation, step-size, and stationary finite-MDP conditions analyzed by the primary literature rather than being inferred from the update alone.",
  },
  {
    id: "kalman-recursive-gaussian-belief",
    kind: "Mechanism",
    statement: "The Kalman filter recursively maintains a Gaussian state belief summarized by a mean and covariance, alternating model-based prediction with measurement correction.",
    algorithmIds: ["kalman-filter"],
    chapterSlug: "05-probabilistic-control-reinforcement-learning",
    passageContains: "The Kalman filter recursively maintains a Gaussian belief summarized by",
    referenceIds: ["kalman-1960-linear-filtering"],
    note: "This claim describes the classical linear-Gaussian recursion. Extended, unscented, ensemble, robust, and learned filtering variants relax or replace parts of those assumptions and should not inherit the same guarantee automatically.",
  },
  {
    id: "differential-privacy-laplace-sensitivity",
    kind: "Mechanism",
    statement: "The Laplace mechanism adds noise calibrated to query sensitivity and the privacy parameter epsilon, linking bounded individual influence to a randomized differential-privacy release.",
    algorithmIds: ["differential-privacy"],
    chapterSlug: "33-mpc-homomorphic-encryption-differential-privacy",
    passageContains: "For scalar/vector numeric queries, add Laplace noise proportional to",
    referenceIds: ["dwork-2006-calibrating-noise"],
    note: "This claim is scoped to sensitivity-calibrated Laplace release under the neighboring-dataset model. Privacy accounting, approximate-DP mechanisms, iterative training, and side channels require additional analysis.",
  },
  {
    id: "branch-and-bound-valid-bound-pruning",
    kind: "Mechanism",
    statement: "Branch and bound partitions an exact optimization problem into subproblems and safely prunes a branch when its valid bound proves that branch cannot improve the incumbent solution.",
    algorithmIds: ["branch-and-bound"],
    chapterSlug: "03-optimization-randomization-constraints",
    passageContains: "that branch cannot improve the incumbent and can be discarded",
    referenceIds: ["land-doig-1960-branch-bound"],
    note: "This claim is scoped to bound-based exact pruning. Correctness depends on bounds being valid for the represented subproblems and on numerical tolerances not invalidating the pruning decision.",
  },
  {
    id: "bayesian-optimization-surrogate-acquisition",
    kind: "Mechanism",
    statement: "Bayesian optimization maintains an uncertainty-aware probabilistic surrogate for an expensive black-box objective and uses an acquisition function to choose the next evaluation.",
    algorithmIds: ["bayesian-optimization"],
    chapterSlug: "03-optimization-randomization-constraints",
    passageContains: "maintains a surrogate model with uncertainty and chooses the next evaluation by an acquisition function",
    referenceIds: ["jones-1998-efficient-global-optimization"],
    note: "This claim captures the surrogate-plus-acquisition pattern. Practical behavior depends on the surrogate, acquisition function, observation-noise model, and the optimization used to select acquisition maxima.",
  },
  {
    id: "symbolic-execution-solver-concretization",
    kind: "Mechanism",
    statement: "Symbolic execution accumulates path constraints over symbolic inputs and uses a constraint solver to produce concrete inputs that satisfy feasible path conditions.",
    algorithmIds: ["symbolic-execution", "sat-smt-solving"],
    chapterSlug: "34-security-analysis-symbolic-execution-fuzzing",
    passageContains: "An SMT solver finds a satisfying concrete input if one exists",
    referenceIds: ["cadar-2008-klee"],
    note: "This claim captures the solver-backed path-concretization mechanism exemplified by KLEE. Solver theory support, environment modeling, and path-explosion behavior vary across symbolic-execution systems.",
  },
  {
    id: "smt-theory-aware-satisfiability",
    kind: "Mechanism",
    statement: "Satisfiability Modulo Theories extends Boolean satisfiability with theory-aware reasoning over domains such as arithmetic, bit-vectors, arrays, and uninterpreted functions.",
    algorithmIds: ["sat-smt-solving"],
    chapterSlug: "34-security-analysis-symbolic-execution-fuzzing",
    passageContains: "Satisfiability Modulo Theories extends SAT with domains such as",
    referenceIds: ["de-moura-bjorner-2008-z3"],
    note: "This claim captures the theory-aware satisfiability role represented by the archive's SAT/SMT entity. Individual solvers differ in supported theories, combination architecture, preprocessing, search, and model/proof capabilities, so the statement is not a claim that all SMT systems behave identically.",
  },
  {
    id: "surface-code-repeated-syndrome-spacetime-decoding",
    kind: "Mechanism",
    statement: "With noisy syndrome measurements, surface-code decoding is performed across repeated rounds so detection events are inferred from changes through space and time rather than from one isolated syndrome snapshot.",
    algorithmIds: ["surface-code-decoding", "error-correcting-codes"],
    chapterSlug: "24-quantum-error-correction-decoding",
    passageContains: "Surface-code decoding is often performed in spacetime",
    referenceIds: ["dennis-2002-topological-quantum-memory"],
    note: "This claim is scoped to repeated-syndrome recovery under noisy measurement. The exact decoding graph, threshold, and logical-error behavior remain dependent on code geometry, circuit/noise assumptions, and decoder choice.",
  },
  {
    id: "secure-mpc-private-input-computation",
    kind: "Mechanism",
    statement: "Secure multi-party computation lets multiple parties jointly evaluate a functionality while limiting what participants learn about one another's private inputs beyond the protocol's specified outputs and security guarantees.",
    algorithmIds: ["secure-multiparty-computation"],
    chapterSlug: "33-mpc-homomorphic-encryption-differential-privacy",
    passageContains: "without revealing their private inputs beyond what follows from output and protocol security definition",
    referenceIds: ["goldreich-micali-wigderson-1987-mental-game"],
    note: "This claim is scoped to the security model actually proved by the supporting protocol family. GMW's original completeness result uses an honest-majority setting for its strongest no-partial-information guarantee; modern MPC spans additional adversary, corruption, setup, fairness, and abort models.",
  },
];

const byId = new Map(claims.map((claim) => [claim.id, claim]));

export function getClaim(id: string) {
  return byId.get(id) ?? null;
}

export function claimsForAlgorithm(algorithmId: string) {
  return claims.filter((claim) => claim.algorithmIds.includes(algorithmId));
}

export function claimsForReference(referenceId: string) {
  return claims.filter((claim) => claim.referenceIds.includes(referenceId));
}

export function claimSearchText(claim: ClaimRecord) {
  return [claim.statement, claim.kind, claim.note, ...claim.algorithmIds, ...claim.referenceIds].join(" ").toLowerCase();
}