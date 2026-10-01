import { algorithms } from "@/lib/algorithm-catalog";
import { claimsForAlgorithm } from "@/lib/claims";
import {
  deriveEvidenceGapKeys,
  suggestedEvidenceGapTask,
  type EvidenceGapKey,
} from "@/lib/evidence-gap-state";
import { getAlgorithmEvidenceProfile, type EvidenceStage } from "@/lib/evidence-profile";
import { experimentsForAlgorithm } from "@/lib/experiments";
import { implementationsForAlgorithm } from "@/lib/implementations";
import { referencesForAlgorithm } from "@/lib/references";
import { replicationsForAlgorithm } from "@/lib/replications";
import type { ResearchField } from "@/lib/taxonomy";

export type { EvidenceGapKey } from "@/lib/evidence-gap-state";

export type EvidenceGap = {
  key: EvidenceGapKey;
  label: string;
};

export type AlgorithmEvidenceGaps = {
  algorithmId: string;
  name: string;
  field: ResearchField;
  family: string;
  stage: EvidenceStage;
  gaps: EvidenceGap[];
  suggestedTask: string | null;
};

const gapLabels: Record<EvidenceGapKey, string> = {
  "primary-source": "Primary source",
  "curated-claim": "Curated claim",
  implementation: "Inspectable code",
  experiment: "Experiment protocol",
  result: "Project result",
  "independent-evaluation": "Independent evaluation",
};

export function evidenceGapLabel(key: EvidenceGapKey) {
  return gapLabels[key];
}

function primarySourceCount(algorithmId: string) {
  return referencesForAlgorithm(algorithmId).filter((reference) =>
    reference.evidenceRole === "Primary method" ||
    reference.evidenceRole === "Primary extension" ||
    reference.evidenceRole === "Normative standard",
  ).length;
}

export function getAlgorithmEvidenceGaps(algorithmId: string): AlgorithmEvidenceGaps | null {
  const algorithm = algorithms.find((item) => item.id === algorithmId);
  if (!algorithm) return null;

  const profile = getAlgorithmEvidenceProfile(algorithmId);
  const claims = claimsForAlgorithm(algorithmId);
  const implementations = implementationsForAlgorithm(algorithmId);
  const experiments = experimentsForAlgorithm(algorithmId);
  const resultExperiments = experiments.filter((experiment) => Boolean(experiment.result));
  const replications = replicationsForAlgorithm(algorithmId);
  const gapKeys = deriveEvidenceGapKeys({
    primarySources: primarySourceCount(algorithmId),
    claims: claims.length,
    implementations: implementations.length,
    experiments: experiments.length,
    resultExperiments: resultExperiments.length,
    independentEvaluations: replications.length,
  });
  const gaps = gapKeys.map((key) => ({ key, label: gapLabels[key] }));

  return {
    algorithmId,
    name: algorithm.name,
    field: algorithm.fields[0],
    family: algorithm.families[0],
    stage: profile.stage,
    gaps,
    suggestedTask: suggestedEvidenceGapTask(gapKeys),
  };
}

export function getEvidenceGapCatalog() {
  return algorithms
    .map((algorithm) => getAlgorithmEvidenceGaps(algorithm.id))
    .filter((item): item is AlgorithmEvidenceGaps => Boolean(item));
}

export function evidenceGapCounts(items = getEvidenceGapCatalog()) {
  const counts = new Map<EvidenceGapKey, number>(
    (Object.keys(gapLabels) as EvidenceGapKey[]).map((key) => [key, 0]),
  );

  for (const item of items) {
    for (const gap of item.gaps) counts.set(gap.key, (counts.get(gap.key) ?? 0) + 1);
  }

  return counts;
}
