export type ExperimentStatus = "Planned" | "Running" | "Completed" | "Inconclusive" | "Failed";
export type ExperimentOutcome = "Positive" | "Negative" | "Mixed" | "Inconclusive";

export type ExperimentDataset = {
  name: string;
  purpose: string;
  url?: string;
};

export type ExperimentResult = {
  outcome: ExperimentOutcome;
  summary: string;
  metricResults: Array<{ metric: string; value: string }>;
  limitations: string[];
};

export type ExperimentRecord = {
  id: string;
  title: string;
  combinationId: string;
  algorithmIds: string[];
  status: ExperimentStatus;
  objective: string;
  hypothesis: string;
  baselines: string[];
  datasets: ExperimentDataset[];
  metrics: string[];
  environment: string[];
  procedure: string[];
  successCriteria: string[];
  artifacts: Array<{ label: string; url?: string }>;
  result?: ExperimentResult;
  lastUpdated: string;
};

export const experiments: ExperimentRecord[] = [
  {
    id: "linucb-fuzzing-scheduler-ablation",
    title: "Contextual mutation scheduling for coverage-guided fuzzing",
    combinationId: "linucb-adaptive-fuzzing",
    algorithmIds: ["linucb", "coverage-guided-fuzzing"],
    status: "Planned",
    objective: "Measure whether contextual mutation-operator scheduling improves useful coverage and fault discovery per unit compute relative to static and context-free schedulers.",
    hypothesis: "A compact LinUCB policy using campaign-state context can allocate mutation families more efficiently than static probabilities or context-free UCB when target/corpus state changes over time.",
    baselines: [
      "Existing fuzzer mutation schedule",
      "Uniform mutation-family sampling",
      "Context-free UCB scheduler",
      "Context-free Thompson Sampling scheduler",
    ],
    datasets: [
      { name: "Seeded fuzzing campaign logs", purpose: "Offline replay and feature/reward debugging before live campaigns" },
      { name: "Multi-target fuzzing benchmark corpus", purpose: "Repeated end-to-end campaigns across heterogeneous parser/program targets" },
    ],
    metrics: [
      "Unique edge/branch coverage over wall-clock time",
      "Unique reproducible faults",
      "Executions to first fault",
      "Scheduler CPU overhead",
      "Mutation-family action entropy",
    ],
    environment: [
      "Pinned CPU core allocation and deterministic target builds where possible",
      "Identical seed corpora and campaign budgets across scheduler variants",
      "Multiple independent random seeds per target",
      "Structured event log containing context, chosen action, reward, and timestamp",
    ],
    procedure: [
      "Instrument mutation-family choices and coverage/fault rewards in the baseline fuzzer",
      "Define a compact context vector from corpus size, recent coverage slope, target features, and mutation history",
      "Run offline replay to reject unstable feature/reward definitions",
      "Run repeated live campaigns for each scheduler with matched compute budgets",
      "Report per-target distributions rather than only pooled averages",
      "Stress-test nonstationarity by changing seeds or target configuration mid-campaign",
    ],
    successCriteria: [
      "Improves median coverage-time curve or fault discovery on multiple targets rather than one benchmark",
      "Scheduler overhead remains small relative to target execution time",
      "Benefits survive held-out targets or campaign-state shifts",
    ],
    artifacts: [
      { label: "Experiment harness — not yet committed" },
      { label: "Raw event log schema — planned" },
    ],
    lastUpdated: "2026-09-28",
  },
  {
    id: "hnsw-linucb-reranking-ablation",
    title: "HNSW candidate retrieval with contextual-bandit reranking",
    combinationId: "retrieval-bandit-routing",
    algorithmIds: ["hnsw", "linucb"],
    status: "Planned",
    objective: "Separate retrieval recall from downstream utility and test whether LinUCB reranking improves contextual reward without unacceptable latency or exploration cost.",
    hypothesis: "Given a high-recall HNSW candidate set, contextual-bandit reranking can outperform static vector similarity and a fitted linear scorer when rewards vary systematically with context.",
    baselines: [
      "Raw vector similarity order",
      "Supervised linear reranker trained on historical rewards",
      "Greedy online linear predictor without exploration",
    ],
    datasets: [
      { name: "Logged retrieval/recommendation interactions", purpose: "Offline counterfactual evaluation when action propensities are available" },
      { name: "Controlled user/task simulator", purpose: "Bounded online evaluation before any real-user experimentation" },
    ],
    metrics: [
      "Candidate recall@K before reranking",
      "Contextual reward / success rate",
      "Regret proxy",
      "P50/P95 reranking latency",
      "Exploration exposure rate",
      "Diversity of selected candidates",
    ],
    environment: [
      "Fixed embedding model and frozen HNSW index during each comparison",
      "Logged candidate sets retained so ranking methods see identical actions",
      "Separate reward-generation simulator from ranking policy implementation",
    ],
    procedure: [
      "Establish HNSW recall/latency operating points",
      "Freeze candidate generation and record identical candidate sets for all rerankers",
      "Train/evaluate static linear and greedy online baselines",
      "Add LinUCB with bounded exploration coefficient sweep",
      "Evaluate offline with propensity-aware estimators when valid logs exist",
      "Run controlled sequential simulation to measure adaptation under preference drift",
    ],
    successCriteria: [
      "Improves downstream reward over similarity and greedy baselines at matched candidate recall",
      "Keeps additional reranking latency within the target service budget",
      "Maintains acceptable exploration exposure under drift",
    ],
    artifacts: [
      { label: "Evaluation notebook — planned" },
      { label: "Candidate/reward event schema — planned" },
    ],
    lastUpdated: "2026-09-28",
  },
  {
    id: "learned-qec-prior-ablation",
    title: "Learned priors for constrained surface-code decoding",
    combinationId: "learned-quantum-decoder",
    algorithmIds: ["graph-neural-networks", "state-space-models", "surface-code-decoding"],
    status: "Planned",
    objective: "Test whether learned spatial/temporal priors improve a constrained decoder under correlated and drifting noise without compromising latency tails or safe fallback behavior.",
    hypothesis: "A GNN or selective state-space model can estimate decoder weights/priors from syndrome history and hardware telemetry while the classical constrained decoder remains responsible for producing the final correction.",
    baselines: [
      "Decoder with static calibrated weights",
      "Decoder with oracle simulator noise parameters",
      "Simple exponential-moving-average weight adaptation",
    ],
    datasets: [
      { name: "Simulated surface-code syndrome streams", purpose: "Controlled training and evaluation across known noise models" },
      { name: "Shifted/correlated noise suites", purpose: "Out-of-distribution and drift stress testing" },
    ],
    metrics: [
      "Logical error rate",
      "Mean decoder latency",
      "P99 decoder latency",
      "Performance under correlation/noise shift",
      "Fallback rate",
      "Calibration error of learned priors",
    ],
    environment: [
      "Fixed surface-code distances and syndrome-round budgets per experiment block",
      "Deterministic simulator seeds recorded for reproduction",
      "Strict inference time budget for learned prior model",
      "Fallback decoder enabled whenever model confidence/latency policy is violated",
    ],
    procedure: [
      "Generate syndrome streams across independent, correlated, and drifting noise regimes",
      "Train GNN and SSM prior estimators on matched training regimes",
      "Inject learned priors into the same constrained decoder implementation",
      "Compare logical error and latency against static and oracle-weight baselines",
      "Evaluate abrupt and gradual distribution shifts",
      "Measure whether fallback policies cap worst-case degradation",
    ],
    successCriteria: [
      "Improves logical error rate in at least one correlated-noise regime without material regression in matched regimes",
      "Meets strict P99 latency budget",
      "Falls back safely under out-of-distribution stress rather than silently degrading",
    ],
    artifacts: [
      { label: "Noise configuration manifest — planned" },
      { label: "Decoder benchmark harness — planned" },
    ],
    lastUpdated: "2026-09-28",
  },
];

const byId = new Map(experiments.map((experiment) => [experiment.id, experiment]));

export function getExperiment(id: string) {
  return byId.get(id) ?? null;
}

export function experimentsForCombination(combinationId: string) {
  return experiments.filter((experiment) => experiment.combinationId === combinationId);
}

export function experimentsForAlgorithm(algorithmId: string) {
  return experiments.filter((experiment) => experiment.algorithmIds.includes(algorithmId));
}

export function experimentSearchText(experiment: ExperimentRecord) {
  return [
    experiment.title,
    experiment.status,
    experiment.objective,
    experiment.hypothesis,
    ...experiment.algorithmIds,
    ...experiment.baselines,
    ...experiment.metrics,
    ...experiment.environment,
    ...experiment.successCriteria,
  ].join(" ").toLowerCase();
}
