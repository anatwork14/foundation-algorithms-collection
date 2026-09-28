import { experimentsForAlgorithm, type ExperimentRecord } from "@/lib/experiments";
import { implementationsForAlgorithm } from "@/lib/implementations";
import { referencesForAlgorithm } from "@/lib/references";

export type EvidenceStage =
  | "Concept only"
  | "Source-backed"
  | "Inspectable implementation"
  | "Experiment protocol"
  | "Empirical result"
  | "Replicated";

export type EvidenceDimension = {
  key: "literature" | "implementation" | "experiment" | "replication";
  label: string;
  state: string;
  present: boolean;
  count: number;
};

export type AlgorithmEvidenceProfile = {
  algorithmId: string;
  stage: EvidenceStage;
  references: number;
  implementations: number;
  experiments: number;
  completedExperiments: number;
  resultExperiments: number;
  replicatedResults: number;
  dimensions: EvidenceDimension[];
};

function hasResult(experiment: ExperimentRecord) {
  return Boolean(experiment.result);
}

/**
 * Evidence stage is a descriptive archive state, not a scientific quality score.
 * It answers "which evidence layers are present?", not "how true is this algorithm?".
 */
export function getAlgorithmEvidenceProfile(algorithmId: string): AlgorithmEvidenceProfile {
  const references = referencesForAlgorithm(algorithmId);
  const implementations = implementationsForAlgorithm(algorithmId);
  const experiments = experimentsForAlgorithm(algorithmId);
  const completedExperiments = experiments.filter((experiment) => experiment.status === "Completed").length;
  const resultExperiments = experiments.filter(hasResult).length;

  // Independent replication is intentionally zero until explicit replication records exist.
  const replicatedResults = 0;

  let stage: EvidenceStage = "Concept only";
  if (references.length > 0) stage = "Source-backed";
  if (implementations.length > 0) stage = "Inspectable implementation";
  if (experiments.length > 0) stage = "Experiment protocol";
  if (resultExperiments > 0) stage = "Empirical result";
  if (replicatedResults > 0) stage = "Replicated";

  const experimentState = resultExperiments > 0
    ? `${resultExperiments} result${resultExperiments === 1 ? "" : "s"}`
    : experiments.length > 0
      ? `${experiments.length} protocol${experiments.length === 1 ? "" : "s"}`
      : "No project experiment";

  return {
    algorithmId,
    stage,
    references: references.length,
    implementations: implementations.length,
    experiments: experiments.length,
    completedExperiments,
    resultExperiments,
    replicatedResults,
    dimensions: [
      {
        key: "literature",
        label: "Primary literature",
        state: references.length > 0 ? `${references.length} curated source${references.length === 1 ? "" : "s"}` : "Not yet curated",
        present: references.length > 0,
        count: references.length,
      },
      {
        key: "implementation",
        label: "Inspectable code",
        state: implementations.length > 0 ? `${implementations.length} verified record${implementations.length === 1 ? "" : "s"}` : "No verified implementation record",
        present: implementations.length > 0,
        count: implementations.length,
      },
      {
        key: "experiment",
        label: "Project experiments",
        state: experimentState,
        present: experiments.length > 0,
        count: experiments.length,
      },
      {
        key: "replication",
        label: "Independent replication",
        state: replicatedResults > 0 ? `${replicatedResults} replication${replicatedResults === 1 ? "" : "s"}` : "Not yet recorded",
        present: replicatedResults > 0,
        count: replicatedResults,
      },
    ],
  };
}
