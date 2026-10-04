import { realTargetExperimentAdditions } from "./experiment-real-target-additions.ts";

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
    id: "linucb-fuzzing-scheduler-drift-pilot",
    title: "Contextual mutation scheduling under abrupt reward drift",
    combinationId: "linucb-adaptive-fuzzing",
    algorithmIds: ["linucb", "ucb1", "thompson-sampling", "coverage-guided-fuzzing"],
    status: "Completed",
    objective: "Run a deterministic contextual scheduling stress test before any real fuzzing campaign and measure whether stationary LinUCB remains advantageous when the mapping from campaign context to useful mutation-family reward changes abruptly.",
    hypothesis: "Contextual LinUCB should exploit context-dependent mutation-family reward structure better than context-free UCB1 and Thompson Sampling, but a stationary model may require explicit forgetting or change detection when the reward mechanism shifts abruptly.",
    baselines: [
      "Uniform mutation-family sampling",
      "Context-free UCB1",
      "Context-free Thompson Sampling with Beta-Bernoulli posteriors",
      "Greedy per-action online linear predictor without exploration bonus",
    ],
    datasets: [
      {
        name: "Deterministic synthetic contextual mutation stream",
        purpose: "Four-action mutation-family proxy with two changing contextual features, Bernoulli useful-mutation rewards, common random numbers across policies, and an abrupt contextual reward-model shift halfway through each run",
      },
    ],
    metrics: [
      "Mean realized useful-mutation reward across the full horizon",
      "Mean realized reward before and after drift",
      "First/last 500-step post-drift reward",
      "Expected regret per step against the dynamic contextual oracle",
      "Mutation-family action entropy",
    ],
    environment: [
      "Pure deterministic Node.js simulator with no external dataset/runtime dependency",
      "40 seeds starting at 20261002",
      "4,000 interactions per seed with drift at step 2,000",
      "Four synthetic mutation families, two contextual features plus intercept",
      "Ridge lambda 1 and LinUCB alpha 0.65",
      "Common potential reward vector per step so all policies face the same stochastic outcome realization for every mutation family",
    ],
    procedure: [
      "Generate the same contextual stream and per-action potential Bernoulli rewards for every policy within a seed",
      "Compare uniform, context-free UCB1, context-free Thompson Sampling, greedy contextual linear prediction, and LinUCB",
      "Reverse important context/reward associations abruptly at step 2,000",
      "Allow all adaptive policies to update only from rewards of actions they selected",
      "Repeat for 40 deterministic seeds and aggregate means plus sample standard deviations",
      "Re-run the committed simulator in CI and structurally compare its output with the committed result artifact and manifest",
    ],
    successCriteria: [
      "Exploratory pilot only: preserve directional failures rather than converting post-hoc outcomes into confirmatory thresholds",
      "The committed aggregate result must be exactly reproducible from the committed simulator and manifest",
      "Report stationary LinUCB's abrupt-drift behavior separately from its full-horizon performance",
      "Do not treat synthetic useful-mutation reward as evidence of real coverage or fault-discovery improvements",
    ],
    artifacts: [
      {
        label: "Deterministic simulation harness",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/linucb-fuzzing-scheduler-simulation.mjs",
      },
      {
        label: "Recorded aggregate result",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/results/linucb-fuzzing-scheduler-drift-pilot.json",
      },
      {
        label: "Verified run manifest",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/manifests/linucb-fuzzing-scheduler-drift-pilot.json",
      },
    ],
    result: {
      outcome: "Mixed",
      summary: "Across 40 deterministic seeds, stationary LinUCB achieved the highest full-horizon mean reward among the compared policies and the lowest expected regret per step. However, that advantage was concentrated before the abrupt reward-model shift: after drift, UCB1 and Thompson Sampling both achieved higher mean reward, and LinUCB showed a particularly weak first 500 post-drift steps. The pilot therefore exposes a concrete nonstationarity failure mode rather than validating the broader fuzzing hypothesis. A real campaign should test forgetting, discounting, sliding windows, or change-point resets before relying on stationary LinUCB under phase changes.",
      metricResults: [
        { metric: "Overall mean reward — LinUCB", value: "0.551119 ± 0.012861 SD" },
        { metric: "Overall mean reward — UCB1", value: "0.530619 ± 0.008632 SD" },
        { metric: "Overall mean reward — Thompson Sampling", value: "0.540144 ± 0.009620 SD" },
        { metric: "LinUCB overall lift vs UCB1", value: "+0.020500" },
        { metric: "LinUCB overall lift vs Thompson Sampling", value: "+0.010975" },
        { metric: "Post-drift reward — LinUCB", value: "0.511338 ± 0.026145 SD" },
        { metric: "Post-drift reward — UCB1", value: "0.546988 ± 0.011282 SD" },
        { metric: "Post-drift reward — Thompson Sampling", value: "0.549263 ± 0.011797 SD" },
        { metric: "LinUCB post-drift lift vs UCB1", value: "-0.035650" },
        { metric: "LinUCB post-drift lift vs Thompson Sampling", value: "-0.037925" },
        { metric: "Expected regret/step — LinUCB", value: "0.079033 ± 0.011708 SD" },
        { metric: "Expected regret/step — UCB1", value: "0.099766 ± 0.003537 SD" },
        { metric: "Expected regret/step — Thompson Sampling", value: "0.090927 ± 0.005022 SD" },
      ],
      limitations: [
        "This is a synthetic mutation-scheduler proxy and does not execute AFL++, libFuzzer, a parser target, or any binary-under-test.",
        "Bernoulli useful-mutation rewards do not reproduce real coverage novelty, delayed crash discovery, corpus evolution, target execution speed, or mutation-operator costs.",
        "The LinUCB policy is deliberately stationary and does not use discounting, sliding windows, explicit forgetting, or change-point detection.",
        "Context is exogenous rather than generated by the evolving fuzzer corpus, so feedback between policy choices and future campaign state is omitted.",
        "Scheduler CPU overhead and executions-per-second were not measured.",
        "The study is exploratory; success thresholds were not preregistered before inspecting the result.",
      ],
    },
    lastUpdated: "2026-10-02",
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
    id: "hnsw-linucb-reranking-drift-pilot",
    title: "Controlled LinUCB reranking adaptation under preference drift",
    combinationId: "retrieval-bandit-routing",
    algorithmIds: ["hnsw", "linucb"],
    status: "Completed",
    objective: "Run the controlled sequential-simulation portion of the broader retrieval-bandit protocol using identical fixed candidate sets, then measure whether LinUCB adapts to an abrupt reward-model shift better than similarity, static linear, and greedy-online baselines.",
    hypothesis: "Within a controlled candidate-set simulator, explicit LinUCB exploration should improve post-drift reward and expected regret relative to an online greedy linear predictor initialized from the same historical interactions.",
    baselines: [
      "Fixed raw-similarity order",
      "Frozen linear reranker fitted from pre-drift randomized historical interactions",
      "Greedy online linear predictor initialized from the same historical interactions",
    ],
    datasets: [
      {
        name: "Deterministic synthetic contextual reranking stream",
        purpose: "Four-action controlled candidate-set simulator with two contextual features, Bernoulli rewards, common random numbers across policies, and an abrupt linear reward-model shift halfway through each run",
      },
    ],
    metrics: [
      "Mean realized reward across the full horizon",
      "Mean realized reward before and after drift",
      "First/last 500-step post-drift reward",
      "Expected regret per step against the dynamic oracle",
      "Selection entropy",
      "Fraction of LinUCB actions differing from greedy online selection",
    ],
    environment: [
      "Pure deterministic Node.js simulator with no external dataset/runtime dependency",
      "30 seeds starting at 20260930",
      "800 randomized pre-drift historical interactions per seed",
      "4,000 evaluation interactions per seed with drift at step 2,000",
      "Four candidates, two contextual features plus intercept, ridge lambda 1, LinUCB alpha 0.7",
      "Common potential reward vector per step so policies face the same stochastic outcome realization for each candidate",
    ],
    procedure: [
      "Fit per-action ridge models from 800 randomized pre-drift historical interactions",
      "Initialize frozen-static, greedy-online, and LinUCB policies from the same historical sufficient statistics",
      "Evaluate fixed similarity, frozen linear, greedy online, and LinUCB policies on 4,000 shared contextual steps",
      "Change the ground-truth per-action linear reward parameters abruptly at step 2,000",
      "Update only the greedy-online and LinUCB policies from their selected rewards",
      "Repeat for 30 deterministic seeds and aggregate means plus sample standard deviations",
      "Re-run the committed simulator in CI and structurally compare its output against the committed result artifact and run manifest",
    ],
    successCriteria: [
      "Exploratory pilot only: no post-hoc result is treated as a preregistered confirmatory threshold",
      "The committed result must be exactly reproducible from the committed simulator and seed/configuration manifest",
      "Any directional reward/regret signal must be reported together with the fact that real HNSW recall, real-user validity, and production latency were not evaluated",
    ],
    artifacts: [
      {
        label: "Deterministic simulation harness",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/hnsw-linucb-reranking-simulation.mjs",
      },
      {
        label: "Recorded aggregate result",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/results/hnsw-linucb-reranking-drift-pilot.json",
      },
      {
        label: "Verified run manifest",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/manifests/hnsw-linucb-reranking-drift-pilot.json",
      },
    ],
    result: {
      outcome: "Mixed",
      summary: "Across 30 deterministic seeds, LinUCB produced higher mean simulated reward and lower expected regret than the greedy-online baseline, with a larger advantage after the abrupt preference shift. The result is directional evidence for the reranking/adaptation layer only: the pilot used fixed synthetic candidate sets and did not execute an HNSW index, estimate real candidate recall, validate counterfactual assumptions on logged users, or measure production service latency. It is therefore recorded as Mixed rather than as confirmation of the broader HNSW + LinUCB hypothesis.",
      metricResults: [
        { metric: "Overall mean reward — LinUCB", value: "0.547783 ± 0.019274 SD" },
        { metric: "Overall mean reward — greedy online", value: "0.532725 ± 0.017166 SD" },
        { metric: "LinUCB reward lift vs greedy", value: "+0.015058" },
        { metric: "Post-drift reward lift vs greedy", value: "+0.030350" },
        { metric: "Last-500 post-drift reward lift vs greedy", value: "+0.039066" },
        { metric: "Expected regret/step — LinUCB", value: "0.109826 ± 0.017492 SD" },
        { metric: "Expected regret/step — greedy online", value: "0.125565 ± 0.016230 SD" },
        { metric: "Expected-regret reduction vs greedy", value: "0.015739" },
        { metric: "LinUCB / greedy action disagreement", value: "7.1867% ± 2.3495% SD" },
      ],
      limitations: [
        "This was an exploratory simulation; confirmatory success thresholds were not preregistered before observing the result.",
        "The simulator models a fixed candidate-set interface and does not execute or benchmark an HNSW index.",
        "Candidate recall@K and HNSW retrieval latency were not measured.",
        "Synthetic linear/Bernoulli rewards do not establish effectiveness on real users, tasks, embeddings, or delayed/censored feedback.",
        "No propensity-based offline estimator was needed or validated because rewards were generated inside a controlled simulator.",
        "CPU/service latency was intentionally excluded because CI/runtime timing would not be a stable production-latency benchmark.",
      ],
    },
    lastUpdated: "2026-10-01",
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
  ...realTargetExperimentAdditions,
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
