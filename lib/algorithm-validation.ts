import type { AlgorithmEntity } from "@/lib/algorithms";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function validateAlgorithmEntities(algorithms: AlgorithmEntity[], chapterSlugs?: string[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const names = new Map<string, string>();
  const searchableNames = new Map<string, string>();
  const knownChapters = chapterSlugs ? new Set(chapterSlugs) : null;

  for (const algorithm of algorithms) {
    if (!algorithm.id || !/^[a-z0-9-]+$/.test(algorithm.id)) {
      errors.push(`Invalid algorithm id: ${algorithm.id || "<empty>"}`);
    }
    if (ids.has(algorithm.id)) errors.push(`Duplicate algorithm id: ${algorithm.id}`);
    ids.add(algorithm.id);

    const normalizedName = normalize(algorithm.name);
    const previousName = names.get(normalizedName);
    if (previousName) errors.push(`Duplicate algorithm name: ${algorithm.name} (${previousName}, ${algorithm.id})`);
    names.set(normalizedName, algorithm.id);

    for (const label of [algorithm.name, ...algorithm.aliases]) {
      const key = normalize(label);
      const existing = searchableNames.get(key);
      if (existing && existing !== algorithm.id) {
        errors.push(`Ambiguous name/alias “${label}” shared by ${existing} and ${algorithm.id}`);
      } else {
        searchableNames.set(key, algorithm.id);
      }
    }

    if (!algorithm.fields.length) errors.push(`${algorithm.id}: at least one research field is required`);
    if (!algorithm.families.length) errors.push(`${algorithm.id}: at least one family is required`);
    if (!algorithm.chapterSlugs.length) errors.push(`${algorithm.id}: at least one source chapter is required`);
    if (new Set(algorithm.chapterSlugs).size !== algorithm.chapterSlugs.length) errors.push(`${algorithm.id}: duplicate source chapter link`);
    if (knownChapters) {
      for (const slug of algorithm.chapterSlugs) {
        if (!knownChapters.has(slug)) errors.push(`${algorithm.id}: source chapter does not exist: ${slug}`);
      }
    }
    if (!algorithm.summary.trim()) errors.push(`${algorithm.id}: summary is required`);
    if (!algorithm.motivation.trim()) errors.push(`${algorithm.id}: motivation is required`);
    if (!algorithm.contribution.trim()) errors.push(`${algorithm.id}: contribution is required`);
    if (!algorithm.implementation.length) errors.push(`${algorithm.id}: implementation guidance is required`);
    if (!algorithm.failureModes.length) errors.push(`${algorithm.id}: failure modes are required`);
  }

  for (const algorithm of algorithms) {
    const relationKeys = new Set<string>();
    for (const relation of algorithm.relations) {
      if (!ids.has(relation.target)) errors.push(`${algorithm.id}: relation target does not exist: ${relation.target}`);
      if (relation.target === algorithm.id) errors.push(`${algorithm.id}: self relation is not allowed (${relation.type})`);
      const key = `${relation.type}:${relation.target}`;
      if (relationKeys.has(key)) errors.push(`${algorithm.id}: duplicate relation ${key}`);
      relationKeys.add(key);
      if (!relation.note.trim()) errors.push(`${algorithm.id}: relation ${key} requires a research note`);
    }
  }

  return errors;
}

export function assertValidAlgorithmEntities(algorithms: AlgorithmEntity[], chapterSlugs?: string[]) {
  const errors = validateAlgorithmEntities(algorithms, chapterSlugs);
  if (errors.length) {
    throw new Error(`Algorithm entity validation failed:\n- ${errors.join("\n- ")}`);
  }
}
