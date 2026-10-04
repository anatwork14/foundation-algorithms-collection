import type { ExperimentRecord } from "./experiments.ts";

export const realTargetExperimentAdditions: ExperimentRecord[] = [
  {
    id: "linucb-fuzzing-framed-record-target-pilot",
    title: "LinUCB mutation scheduling on an executed framed-record parser target",
    combinationId: "linucb-adaptive-fuzzing",
    algorithmIds: ["linucb", "ucb1", "coverage-guided-fuzzing"],
    status: "Completed",
    objective: "Test mutation-family scheduling against an actually executed deterministic parser target and evolving corpus, replacing the earlier synthetic reward model with novelty derived from target trace features.",
    hypothesis: "A stationary LinUCB scheduler using parent-input and recent-campaign context will discover more unique parser trace features under a fixed execution budget than uniform mutation selection or context-free UCB1.",
    baselines: [
      "Uniform mutation-family sampling",
      "Context-free UCB1 mutation-family scheduling",
    ],
    datasets: [
      {
        name: "Deterministic framed-record parser campaign corpus",
        purpose: "Three committed seed inputs evolved by bit flips, random byte overwrites, dictionary insertion, and deletion while every child is executed by the committed parser target",
      },
    ],
    metrics: [
      "Unique target trace features discovered",
      "Novelty-producing inputs accepted into the corpus",
      "Novelty rate per target execution",
      "Final retained corpus size",
      "Mutation-family action entropy",
    ],
    environment: [
      "Pure deterministic Node.js target and campaign harness with no network or external runtime dependency",
      "30 seeds starting at 20261004",
      "1,500 target executions per policy per seed",
      "Four mutation families and a maximum retained corpus size of 128",
      "LinUCB context: intercept, normalized parent length, parent ASCII ratio, and a combined magic-prefix/recent-novelty feature",
      "Ridge lambda 1 and LinUCB alpha 0.8",
    ],
    procedure: [
      "Initialize each policy run from the same three seed inputs and collect the target's initial trace features",
      "Select a retained parent input, choose one mutation family, execute the mutated child against the parser target, and reward the scheduler only when at least one previously unseen trace feature appears",
      "Retain novelty-producing children so future campaign state depends on earlier scheduling decisions",
      "Compare uniform scheduling, context-free UCB1, and stationary LinUCB under identical run counts and execution budgets",
      "Repeat for 30 deterministic seeds and aggregate means plus sample standard deviations",
      "Re-run the committed campaign in CI and require byte-for-byte equality with the committed result artifact plus manifest consistency",
    ],
    successCriteria: [
      "Exploratory target pilot only: preserve a negative or null result instead of tuning the target or policy after inspection",
      "The committed aggregate result must be exactly reproducible from the committed target and campaign harness",
      "Do not label explicit target trace features as AFL++ edge coverage or generalize this single in-repository target to real-world fuzzing performance",
    ],
    artifacts: [
      {
        label: "Executed parser target",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/targets/framed-record-parser.mjs",
      },
      {
        label: "Deterministic target campaign harness",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/linucb-fuzzing-framed-record-target.mjs",
      },
      {
        label: "Recorded target-campaign result",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/results/linucb-fuzzing-framed-record-target-pilot.json",
      },
      {
        label: "Verified target-campaign manifest",
        url: "https://github.com/anatwork14/foundation-algorithms-collection/blob/main/experiments/manifests/linucb-fuzzing-framed-record-target-pilot.json",
      },
    ],
    result: {
      outcome: "Negative",
      summary: "On this executed parser target, the hypothesized LinUCB advantage did not appear. Across 30 deterministic campaigns, LinUCB discovered 95.500000 unique trace features on average versus 96.466667 for uniform scheduling and 95.633333 for UCB1. It also accepted fewer novelty-producing inputs than both baselines and showed lower mutation-family action entropy. The result therefore rejects the directional improvement hypothesis for this target/configuration while remaining too narrow to establish that contextual scheduling is generally inferior in fuzzing.",
      metricResults: [
        { metric: "Unique trace features — LinUCB", value: "95.500000 ± 1.279817 SD" },
        { metric: "Unique trace features — uniform", value: "96.466667 ± 0.973204 SD" },
        { metric: "Unique trace features — UCB1", value: "95.633333 ± 1.188547 SD" },
        { metric: "LinUCB unique-feature delta vs uniform", value: "-0.966667" },
        { metric: "LinUCB unique-feature delta vs UCB1", value: "-0.133333" },
        { metric: "Novelty-producing inputs — LinUCB", value: "54.533333 ± 2.528913 SD" },
        { metric: "Novelty-producing inputs — uniform", value: "56.600000 ± 3.035423 SD" },
        { metric: "Novelty-producing inputs — UCB1", value: "55.100000 ± 2.106640 SD" },
        { metric: "LinUCB accepted-input delta vs uniform", value: "-2.066667" },
        { metric: "LinUCB accepted-input delta vs UCB1", value: "-0.566667" },
        { metric: "Action entropy — LinUCB", value: "1.328695 ± 0.035130 SD" },
      ],
      limitations: [
        "This executes a committed parser target and evolves a corpus, but the target is an in-repository research harness rather than an external production or benchmark program.",
        "Trace features are explicit target branch/state markers, not compiler-instrumented AFL++ edge coverage.",
        "The campaign does not use AFL++ instrumentation, sanitizers, crash discovery, or fault triage.",
        "Only one target, one seed corpus, four mutation families, and one LinUCB parameterization were evaluated.",
        "Policy-specific corpus evolution means later target inputs differ across schedulers even though run counts, seeds, and execution budgets are matched.",
        "No inferential significance test is claimed; the archive preserves the negative point estimates as exploratory evidence.",
      ],
    },
    lastUpdated: "2026-10-04",
  },
];
