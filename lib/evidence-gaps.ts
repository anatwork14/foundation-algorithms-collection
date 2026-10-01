import { algorithms } from "@/lib/algorithm-catalog";
import { claimsForAlgorithm } from "@/lib/claims";
import { getAlgorithmEvidenceProfile, type EvidenceStage } from "@/lib/evidence-profile";
import { experimentsForAlgorithm } from "@/lib/experiments";
import { implementationsForAlgorithm } from "@/lib/implementations";
import { referencesForAlgorithm } from "@/lib/references";
import { replicationsForAlgorithm } from "@/lib/replications";
import type { ResearchField } from "@/lib/taxonomy";

export type EvidenceGapKey =
  | "primary-source"
  | "curated-claim"
  | "implementation"
  | "experiment"
  | "result"
  | "independent-evaluation";

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
  const gaps: EvidenceGap[] = [];

  if (primarySourceCount(algorithmId) === 0) gaps.push({ key: "primary-source", label: gapLabels["primary-source"] });
  if (claims.length === 0) gaps.push({ key: "curated-claim", label: gapLabels["curated-claim"] });
  if (implementations.length === 0) gaps.push({ key: "implementation", label: gapLabels.implementation });
  if (experiments.length === 0) gaps.push({ key: "experiment", label: gapLabels.experiment });
  if (experiments.length > 0 && resultExperiments.length === 0) gaps.push({ key: "result", label: gapLabels.result });
  if (replications.length === 0) gaps.push({ key: "independent-evaluation", label: gapLabels["independent-evaluation"] });

  const suggestedTask =
    gaps.some((gap) => gap.key === "primary-source")
      ? "Curate a primary paper or normative standard before adding stronger archive assertions."
      : gaps.some((gap) => gap.key === "curated-claim")
        ? "Ground one useful archive statement in a unique Markdown passage and an explicit source."
        : gaps.some((gap) => gap.key === "implementation")
          ? "Verify an inspectable implementation at an immutable upstream revision, when implementation evidence is useful."
          : gaps.some((gap) => gap.key === "experiment")
            ? "Design a reproducible project experiment if empirical evaluation would answer a meaningful research question."
            : gaps.some((gap) => gap.key === "result")
              ? "Run or record the existing experiment protocol while preserving limitations and negative findings."
              : gaps.some((gap) => gap.key === "independent-evaluation")
                ? "Look for an independently authored evaluation or replication that explicitly covers this algorithm."
                : null;

  return {
    algorithmId,
    name: algorithm.name,
    field: algorithm.fields[0],
    family: algorithm.families[0],
    stage: profile.stage,
    gaps,
    suggestedTask,
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
