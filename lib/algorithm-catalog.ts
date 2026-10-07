import { algorithmAdditions } from "@/lib/algorithm-additions";
import { foundationAlgorithmAdditions } from "@/lib/algorithm-foundations-additions";
import { privacyAlgorithmAdditions } from "@/lib/algorithm-privacy-additions";
import { quantumAlgorithmAdditions } from "@/lib/algorithm-quantum-additions";
import { variantsForAlgorithm } from "@/lib/algorithm-variants";
import {
  algorithms as coreAlgorithms,
  type AlgorithmEntity,
  type AlgorithmRelation,
} from "@/lib/algorithms";

export const algorithms: AlgorithmEntity[] = [
  ...coreAlgorithms,
  ...algorithmAdditions,
  ...foundationAlgorithmAdditions,
  ...privacyAlgorithmAdditions,
  ...quantumAlgorithmAdditions,
];

const byId = new Map(algorithms.map((algorithm) => [algorithm.id, algorithm]));

export function getAlgorithm(id: string) {
  return byId.get(id) ?? null;
}

export function getRelatedAlgorithms(algorithm: AlgorithmEntity) {
  return algorithm.relations
    .map((relation) => ({ relation, algorithm: byId.get(relation.target) }))
    .filter((item): item is { relation: AlgorithmRelation; algorithm: AlgorithmEntity } => Boolean(item.algorithm));
}

export function algorithmsForChapter(slug: string) {
  return algorithms.filter((algorithm) => algorithm.chapterSlugs.includes(slug));
}

export function algorithmSearchText(algorithm: AlgorithmEntity) {
  const variants = variantsForAlgorithm(algorithm.id);
  return [
    algorithm.name,
    ...algorithm.aliases,
    ...algorithm.fields,
    ...algorithm.families,
    algorithm.summary,
    algorithm.motivation,
    algorithm.contribution,
    ...algorithm.assumptions,
    ...algorithm.tags,
    ...variants.flatMap((variant) => [
      variant.name,
      ...variant.aliases,
      variant.summary,
      variant.distinction,
      ...variant.tags,
    ]),
  ]
    .join(" ")
    .toLowerCase();
}
