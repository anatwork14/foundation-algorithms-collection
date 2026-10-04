import type { ExperimentStatus } from "./experiments.ts";
import { realTargetExperimentHistoryAdditions } from "./experiment-history-real-target-additions.ts";

export type ExperimentHistoryKind = "Protocol" | "Status" | "Artifact" | "Result";

export type ExperimentHistoryEntry = {
  experimentId: string;
  revision: number;
  date: string;
  kind: ExperimentHistoryKind;
  status: ExperimentStatus;
  title: string;
  note: string;
  artifactLabels?: string[];
};

export const experimentHistory: ExperimentHistoryEntry[] = [
  {
    experimentId: "linucb-fuzzing-scheduler-ablation",
    revision: 1,
    date: "2026-09-28",
    kind: "Protocol",
    status: "Planned",
    title: "Protocol registered",
    note: "Initial contextual-fuzzing protocol recorded with explicit baselines, campaign controls, metrics, and interpretation criteria before any empirical result is attached.",
  },
  {
    experimentId: "linucb-fuzzing-scheduler-drift-pilot",
    revision: 1,
    date: "2026-10-02",
    kind: "Protocol",
    status: "Planned",
    title: "Synthetic drift pilot defined",
    note: "A bounded contextual mutation-scheduler simulation was split from the broader live-fuzzing protocol so adaptation and nonstationarity could be studied without implying evidence from AFL++, libFuzzer, real target binaries, coverage, or fault discovery.",
  },
  {
    experimentId: "linucb-fuzzing-scheduler-drift-pilot",
    revision: 2,
    date: "2026-10-02",
    kind: "Artifact",
    status: "Running",
    title: "Deterministic scheduler simulator committed",
    note: "The seeded contextual scheduler simulator was committed with common per-action potential rewards so UCB1, Thompson Sampling, greedy linear prediction, and LinUCB can be compared on identical stochastic outcome realizations.",
    artifactLabels: ["Deterministic simulation harness"],
  },
  {
    experimentId: "linucb-fuzzing-scheduler-drift-pilot",
    revision: 3,
    date: "2026-10-02",
    kind: "Result",
    status: "Completed",
    title: "Mixed drift result accepted",
    note: "The deterministic aggregate result was accepted after exact CI reproduction. LinUCB had the strongest full-horizon reward/regret signal but underperformed context-free UCB1 and Thompson Sampling after the abrupt reward-model shift, so the archive preserves the result as Mixed and treats stale-evidence adaptation as a follow-up research question.",
    artifactLabels: ["Recorded aggregate result"],
  },
  {
    experimentId: "linucb-fuzzing-scheduler-drift-pilot",
    revision: 4,
    date: "2026-10-02",
    kind: "Artifact",
    status: "Completed",
    title: "Inspectable drift manifest attached",
    note: "A machine-readable manifest records seed range, horizon and drift point, action/context dimensions, LinUCB parameters, pre/post drift reward models, shared-randomness policy, and explicit interpretation boundaries. CI verifies the manifest against simulator constants and the recorded aggregate result.",
    artifactLabels: ["Verified run manifest"],
  },
  {
    experimentId: "hnsw-linucb-reranking-ablation",
    revision: 1,
    date: "2026-09-28",
    kind: "Protocol",
    status: "Planned",
    title: "Protocol registered",
    note: "Initial retrieval-plus-bandit ablation protocol recorded with fixed candidate-generation controls, ranking baselines, latency measures, and drift evaluation requirements.",
  },
  {
    experimentId: "hnsw-linucb-reranking-drift-pilot",
    revision: 1,
    date: "2026-09-28",
    kind: "Protocol",
    status: "Planned",
    title: "Controlled drift pilot defined",
    note: "A bounded synthetic sequential simulation was separated from the broader HNSW protocol so adaptation could be evaluated without implying real retrieval, user, or latency evidence.",
  },
  {
    experimentId: "hnsw-linucb-reranking-drift-pilot",
    revision: 2,
    date: "2026-09-30",
    kind: "Artifact",
    status: "Running",
    title: "Deterministic simulator committed",
    note: "The seeded simulator and exact configuration were committed so the aggregate result could be regenerated inside CI rather than recorded as an opaque number.",
    artifactLabels: ["Deterministic simulation harness"],
  },
  {
    experimentId: "hnsw-linucb-reranking-drift-pilot",
    revision: 3,
    date: "2026-09-30",
    kind: "Result",
    status: "Completed",
    title: "First reproducible result accepted",
    note: "The committed result artifact was accepted after deterministic CI reproduction. The archive records the outcome as Mixed because the simulation supports only the adaptation layer and does not establish HNSW recall, real-user validity, or production latency.",
    artifactLabels: ["Recorded aggregate result"],
  },
  {
    experimentId: "hnsw-linucb-reranking-drift-pilot",
    revision: 4,
    date: "2026-10-01",
    kind: "Artifact",
    status: "Completed",
    title: "Inspectable run manifest attached",
    note: "A machine-readable manifest now records the deterministic seed range, horizon and drift point, candidate/model dimensions, policy parameters, reward regimes, and interpretation boundaries. CI verifies the manifest against both the simulator constants and recorded aggregate result.",
    artifactLabels: ["Verified run manifest"],
  },
  {
    experimentId: "learned-qec-prior-ablation",
    revision: 1,
    date: "2026-09-28",
    kind: "Protocol",
    status: "Planned",
    title: "Protocol registered",
    note: "Initial learned-decoder-prior protocol recorded with logical-error, latency-tail, drift, calibration, and fallback criteria before implementation artifacts are available.",
  },
  ...realTargetExperimentHistoryAdditions,
];

export function historyForExperiment(experimentId: string) {
  return experimentHistory
    .filter((entry) => entry.experimentId === experimentId)
    .sort((a, b) => a.revision - b.revision);
}
