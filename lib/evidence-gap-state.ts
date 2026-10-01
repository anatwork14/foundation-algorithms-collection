export type EvidenceGapKey =
  | "primary-source"
  | "curated-claim"
  | "implementation"
  | "experiment"
  | "result"
  | "independent-evaluation";

export type EvidenceGapPresence = {
  primarySources: number;
  claims: number;
  implementations: number;
  experiments: number;
  resultExperiments: number;
  independentEvaluations: number;
};

export function deriveEvidenceGapKeys(presence: EvidenceGapPresence): EvidenceGapKey[] {
  const gaps: EvidenceGapKey[] = [];

  if (presence.primarySources === 0) gaps.push("primary-source");
  if (presence.claims === 0) gaps.push("curated-claim");
  if (presence.implementations === 0) gaps.push("implementation");
  if (presence.experiments === 0) gaps.push("experiment");
  if (presence.experiments > 0 && presence.resultExperiments === 0) gaps.push("result");
  if (presence.independentEvaluations === 0) gaps.push("independent-evaluation");

  return gaps;
}

export function suggestedEvidenceGapTask(gaps: EvidenceGapKey[]) {
  if (gaps.includes("primary-source")) {
    return "Curate a primary paper or normative standard before adding stronger archive assertions.";
  }
  if (gaps.includes("curated-claim")) {
    return "Ground one useful archive statement in a unique Markdown passage and an explicit source.";
  }
  if (gaps.includes("implementation")) {
    return "Verify an inspectable implementation at an immutable upstream revision, when implementation evidence is useful.";
  }
  if (gaps.includes("experiment")) {
    return "Design a reproducible project experiment if empirical evaluation would answer a meaningful research question.";
  }
  if (gaps.includes("result")) {
    return "Run or record the existing experiment protocol while preserving limitations and negative findings.";
  }
  if (gaps.includes("independent-evaluation")) {
    return "Look for an independently authored evaluation or replication that explicitly covers this algorithm.";
  }
  return null;
}
