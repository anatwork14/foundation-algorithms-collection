export type CombinationStatus = "Hypothesis" | "Prototype candidate" | "Evidence gathering";

export type ResearchCombination = {
  id: string;
  title: string;
  kicker: string;
  algorithmIds: string[];
  motivation: string;
  hypothesis: string;
  compatibility: string[];
  tensions: string[];
  expectedBenefits: string[];
  risks: string[];
  metrics: string[];
  experimentPlan: string[];
  sourceChapters: string[];
  status: CombinationStatus;
};

export const combinations: ResearchCombination[] = [
  {
    id: "linucb-adaptive-fuzzing",
    title: "LinUCB × coverage-guided fuzzing",
    kicker: "Adaptive security",
    algorithmIds: ["linucb", "coverage-guided-fuzzing"],
    motivation: "Fuzzers repeatedly choose among mutation operators, seed classes, and scheduling strategies, but their value changes with program state and campaign history.",
    hypothesis: "A contextual bandit can allocate mutation effort more efficiently than static or context-free schedules by learning which operator families produce coverage or fault discoveries under the current target state.",
    compatibility: ["Fuzzing naturally exposes repeated action/reward rounds", "Coverage and crash novelty provide observable rewards", "Program/corpus features can form context vectors"],
    tensions: ["Rewards are delayed and sparse", "The target distribution changes as the corpus grows", "Aggressive exploitation may reduce exploration diversity"],
    expectedBenefits: ["Faster coverage growth", "Higher useful executions per CPU hour", "Adaptive operator specialization across target phases"],
    risks: ["Bandit overhead exceeds gains on very fast targets", "Reward shaping over-optimizes shallow coverage", "Context leakage or high-dimensional instability"],
    metrics: ["Unique edge/branch coverage over time", "Unique reproducible faults", "Executions to first fault", "CPU overhead", "Operator entropy"],
    experimentPlan: ["Select benchmark targets with existing AFL++/libFuzzer baselines", "Define mutation families as actions and compact campaign features as context", "Compare static scheduling, UCB, Thompson Sampling, and LinUCB", "Run repeated seeded campaigns", "Report confidence intervals and failure cases"],
    sourceChapters: ["08-bandits-contextual-bandits-linucb", "34-security-analysis-symbolic-execution-fuzzing", "40-ai-quantum-cybersecurity-combination-map"],
    status: "Prototype candidate",
  },
  {
    id: "learned-quantum-decoder",
    title: "GNN / SSM × quantum error decoding",
    kicker: "Fault-tolerant intelligence",
    algorithmIds: ["graph-neural-networks", "state-space-models", "surface-code-decoding"],
    motivation: "Real quantum hardware produces structured spatial and temporal syndrome patterns that exact decoders may not model perfectly under correlated noise.",
    hypothesis: "A learned graph or sequential model can estimate priors, edge weights, or candidate corrections from telemetry while a constrained decoder remains the correctness/safety boundary.",
    compatibility: ["Syndrome/check structure is naturally graphical", "Repeated rounds create temporal sequences", "Existing decoders already consume weighted error models"],
    tensions: ["Decoder latency is safety critical", "Training noise may differ from deployment noise", "Opaque learned corrections complicate verification"],
    expectedBenefits: ["Better correlated-noise modeling", "Adaptive decoder weights", "Potential latency/accuracy gains on hardware-specific regimes"],
    risks: ["Out-of-distribution logical failures", "Inference latency spikes", "Uncalibrated model confidence"],
    metrics: ["Logical error rate", "Decoder wall-clock latency", "Tail latency", "Performance under injected noise shift", "Fallback rate"],
    experimentPlan: ["Generate/simulate syndrome streams across calibrated and shifted noise models", "Train GNN and SSM prior estimators", "Feed learned priors into an established constrained decoder", "Compare against decoder-only baselines", "Stress-test under correlation and calibration drift"],
    sourceChapters: ["11-neural-architectures-attention-ssm-moe-gnn", "24-quantum-error-correction-decoding", "40-ai-quantum-cybersecurity-combination-map"],
    status: "Hypothesis",
  },
  {
    id: "bayesian-quantum-calibration",
    title: "Bayesian optimization × quantum calibration × QEC",
    kicker: "Adaptive quantum systems",
    algorithmIds: ["bayesian-optimization", "surface-code-decoding"],
    motivation: "Quantum devices require repeated calibration under noisy, drifting hardware conditions, while each calibration experiment consumes scarce device time.",
    hypothesis: "Uncertainty-aware sequential experiment design can reduce calibration evaluations while optimizing logical-level metrics rather than only physical gate metrics.",
    compatibility: ["Calibration evaluations are expensive black-box observations", "Bayesian optimization explicitly trades information gain against predicted quality", "QEC metrics provide system-level objectives"],
    tensions: ["Hardware drift violates static objective assumptions", "Multi-objective calibration may be high dimensional", "Noisy evaluations complicate acquisition functions"],
    expectedBenefits: ["Fewer calibration shots", "Faster recovery after drift", "Optimization aligned with logical error rate"],
    risks: ["Surrogate misspecification", "Unsafe exploration regions", "Slow optimizer overhead"],
    metrics: ["Device evaluations to target fidelity", "Logical error rate after calibration", "Recovery time after induced drift", "Calibration stability"],
    experimentPlan: ["Start with simulator or hardware-in-the-loop surrogate", "Define safe parameter bounds", "Compare random/grid/CMA-style and Bayesian strategies", "Introduce controlled drift", "Measure calibration cost and logical outcome"],
    sourceChapters: ["03-optimization-randomization-constraints", "14-uncertainty-causal-active-continual-meta-learning", "25-fault-tolerance-error-mitigation-compilation"],
    status: "Hypothesis",
  },
  {
    id: "verifiable-agent-planning",
    title: "LLM planning × symbolic execution × proof constraints",
    kicker: "Verifiable agents",
    algorithmIds: ["transformer-attention", "symbolic-execution", "zero-knowledge-proofs"],
    motivation: "Learned agents can propose flexible plans but do not inherently guarantee that generated actions satisfy hard program, policy, or safety constraints.",
    hypothesis: "Separate proposal from verification: use learned models to generate plans, formal/symbolic systems to validate reachable consequences, and proof artifacts for externally verifiable high-impact actions.",
    compatibility: ["Learned models are strong proposal generators", "Symbolic execution/SMT provide exact constraint checks within modeled semantics", "Proof systems can attest to selected computations without exposing private witnesses"],
    tensions: ["Formal models cover only part of real-world semantics", "Proof generation can be expensive", "Agent plans may be hard to translate into solver-friendly constraints"],
    expectedBenefits: ["Fewer policy-violating actions", "Inspectable rejection reasons", "Cryptographically verifiable execution boundaries"],
    risks: ["False confidence from incomplete models", "Verifier/proof specification bugs", "Latency incompatible with interactive workloads"],
    metrics: ["Constraint violation rate", "False rejection rate", "Verification/proving latency", "Coverage of action classes", "Human auditability"],
    experimentPlan: ["Choose a bounded code/tool domain", "Define explicit pre/post-conditions", "Generate plans with a language model", "Symbolically verify or reject candidate actions", "Optionally produce proof artifacts for accepted executions", "Compare against prompt-only guardrails"],
    sourceChapters: ["13-ai-reasoning-alignment-agents", "32-zero-knowledge-verifiable-computation", "34-security-analysis-symbolic-execution-fuzzing", "40-ai-quantum-cybersecurity-combination-map"],
    status: "Hypothesis",
  },
  {
    id: "private-adaptive-learning",
    title: "FHE × uncertainty-aware learning",
    kicker: "Private intelligence",
    algorithmIds: ["fhe", "conformal-prediction"],
    motivation: "Sensitive inference workloads increasingly require both privacy of inputs and meaningful uncertainty about predictions.",
    hypothesis: "For bounded model classes, encrypted inference can be paired with conformal calibration performed over privacy-compatible scores to return both protected predictions and empirically calibrated prediction sets.",
    compatibility: ["Conformal wrappers can sit around arbitrary predictive models", "FHE evaluates arithmetic on encrypted values", "Both can be tested independently for correctness/privacy properties"],
    tensions: ["Prediction-set logic and ranking/quantiles are expensive under encryption", "Calibration data governance remains separate from ciphertext privacy", "Distribution shift still breaks exchangeability"],
    expectedBenefits: ["Privacy-preserving inference with explicit uncertainty", "Clear separation of cryptographic and statistical guarantees"],
    risks: ["Unacceptable latency", "Approximation error changes conformity scores", "Misinterpretation of marginal coverage"],
    metrics: ["Encrypted inference latency", "Ciphertext memory", "Coverage", "Prediction-set width", "Approximation-induced coverage drift"],
    experimentPlan: ["Choose a compact numeric model", "Implement plaintext conformal baseline", "Port inference and score computation to CKKS/BFV-style encrypted arithmetic", "Compare coverage and latency", "Stress-test approximate arithmetic error"],
    sourceChapters: ["14-uncertainty-causal-active-continual-meta-learning", "33-mpc-homomorphic-encryption-differential-privacy", "40-ai-quantum-cybersecurity-combination-map"],
    status: "Hypothesis",
  },
  {
    id: "retrieval-bandit-routing",
    title: "HNSW retrieval × LinUCB reranking",
    kicker: "Adaptive retrieval",
    algorithmIds: ["hnsw", "linucb"],
    motivation: "Vector retrieval is good at finding semantically close candidates but does not automatically optimize downstream utility for each user/task context.",
    hypothesis: "Use HNSW for high-recall candidate generation and a contextual bandit for online utility-aware reranking among retrieved candidates.",
    compatibility: ["HNSW separates candidate generation from ranking", "LinUCB operates efficiently on a bounded action set", "Online rewards can update reranking without rebuilding the vector index"],
    tensions: ["Bandit only learns over candidates the retriever exposes", "Delayed or biased feedback affects learning", "Candidate identity can make disjoint models too large"],
    expectedBenefits: ["Personalized utility beyond semantic similarity", "Online adaptation", "Bounded exploration cost"],
    risks: ["Filter bubble/exploration harms", "Retriever blind spots", "Feedback loops"],
    metrics: ["Recall@K before reranking", "Reward/click/success rate", "Regret proxy", "Latency", "Exploration exposure"],
    experimentPlan: ["Build HNSW candidate baseline", "Define contextual features and action representation", "Compare static similarity ranking versus linear reranker and LinUCB", "Evaluate offline with logged propensities when available", "Run bounded online simulation"],
    sourceChapters: ["06-representation-similarity-compression-parsing", "08-bandits-contextual-bandits-linucb", "09-combination-research-map"],
    status: "Prototype candidate",
  },
];
