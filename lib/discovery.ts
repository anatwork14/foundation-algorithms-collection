import { algorithms } from "@/lib/algorithm-catalog";
import type { DocSummary } from "@/lib/content";
import { experiments } from "@/lib/experiments";
import { implementations } from "@/lib/implementations";
import { references } from "@/lib/references";

export type EvidenceAvailability = "References" | "Implementations" | "Experiments";

export type ChapterDiscoveryMetadata = {
  slug: string;
  algorithmIds: string[];
  algorithms: Array<{ id: string; name: string }>;
  families: string[];
  evidence: EvidenceAvailability[];
};

export function buildChapterDiscoveryMetadata(documents: DocSummary[]): ChapterDiscoveryMetadata[] {
  const implementationAlgorithms = new Set(implementations.flatMap((record) => record.algorithmIds));
  const experimentAlgorithms = new Set(experiments.flatMap((record) => record.algorithmIds));

  return documents.map((document) => {
    const linkedAlgorithms = algorithms.filter((algorithm) => algorithm.chapterSlugs.includes(document.slug));
    const algorithmIds = linkedAlgorithms.map((algorithm) => algorithm.id);
    const algorithmIdSet = new Set(algorithmIds);
    const families = [...new Set(linkedAlgorithms.flatMap((algorithm) => algorithm.families))].sort((a, b) => a.localeCompare(b));
    const evidence: EvidenceAvailability[] = [];

    if (references.some((reference) => reference.chapterSlugs.includes(document.slug) || reference.algorithmIds.some((id) => algorithmIdSet.has(id)))) {
      evidence.push("References");
    }
    if (algorithmIds.some((id) => implementationAlgorithms.has(id))) evidence.push("Implementations");
    if (algorithmIds.some((id) => experimentAlgorithms.has(id))) evidence.push("Experiments");

    return {
      slug: document.slug,
      algorithmIds,
      algorithms: linkedAlgorithms.map((algorithm) => ({ id: algorithm.id, name: algorithm.name })),
      families,
      evidence,
    };
  });
}
