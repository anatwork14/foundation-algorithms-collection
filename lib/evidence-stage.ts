export type EvidenceStage =
  | "Concept only"
  | "Source-backed"
  | "Inspectable implementation"
  | "Experiment protocol"
  | "Empirical result"
  | "Replicated";

export type EvidenceStageInput = {
  references: number;
  implementations: number;
  experiments: number;
  resultExperiments: number;
  replicatedResults: number;
};

/**
 * Derive the archive's descriptive evidence stage from independently counted
 * evidence layers. This is not a quality score: later stages only mean that
 * additional inspectable evidence types are present.
 */
export function deriveEvidenceStage(input: EvidenceStageInput): EvidenceStage {
  if (input.replicatedResults > 0) return "Replicated";
  if (input.resultExperiments > 0) return "Empirical result";
  if (input.experiments > 0) return "Experiment protocol";
  if (input.implementations > 0) return "Inspectable implementation";
  if (input.references > 0) return "Source-backed";
  return "Concept only";
}
