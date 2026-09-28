import { algorithmAdditions } from "@/lib/algorithm-additions";
import {
  algorithms as coreAlgorithms,
  type AlgorithmEntity,
  type AlgorithmRelation,
} from "@/lib/algorithms";

export const algorithms: AlgorithmEntity[] = [...coreAlgorithms, ...algorithmAdditions];

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
  ]
    .join(" ")
    .toLowerCase();
}
