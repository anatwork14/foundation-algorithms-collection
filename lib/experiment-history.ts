import type { ExperimentStatus } from "./experiments.ts";

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
];

export function historyForExperiment(experimentId: string) {
  return experimentHistory
    .filter((entry) => entry.experimentId === experimentId)
    .sort((a, b) => a.revision - b.revision);
}
