import type { AlgorithmEntity } from "@/lib/algorithms";
import type { ResearchCombination } from "@/lib/combinations";
import type { ReferenceEntity } from "@/lib/references";

export function validateReferences(
  references: ReferenceEntity[],
  algorithms: AlgorithmEntity[],
  combinations: ResearchCombination[],
) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const algorithmIds = new Set(algorithms.map((item) => item.id));
  const combinationIds = new Set(combinations.map((item) => item.id));

  for (const reference of references) {
    if (!reference.id || !/^[a-z0-9-]+$/.test(reference.id)) errors.push(`Invalid reference id: ${reference.id || "<empty>"}`);
    if (ids.has(reference.id)) errors.push(`Duplicate reference id: ${reference.id}`);
    ids.add(reference.id);
    if (!reference.title.trim()) errors.push(`${reference.id}: title is required`);
    if (!reference.authors.length) errors.push(`${reference.id}: authors are required`);
    if (!Number.isInteger(reference.year)) errors.push(`${reference.id}: integer publication year is required`);
    if (!/^https:\/\//.test(reference.url)) errors.push(`${reference.id}: HTTPS URL is required`);
    if (!reference.algorithmIds.length && !reference.combinationIds.length) errors.push(`${reference.id}: must link to an algorithm or combination`);
    for (const id of reference.algorithmIds) if (!algorithmIds.has(id)) errors.push(`${reference.id}: unknown algorithm ${id}`);
    for (const id of reference.combinationIds) if (!combinationIds.has(id)) errors.push(`${reference.id}: unknown combination ${id}`);
    if (!reference.chapterSlugs.length) errors.push(`${reference.id}: at least one source chapter is required`);
    if (!reference.summary.trim()) errors.push(`${reference.id}: summary is required`);
    if (!reference.significance.trim()) errors.push(`${reference.id}: significance is required`);
  }
  return errors;
}

export function assertValidReferences(
  references: ReferenceEntity[],
  algorithms: AlgorithmEntity[],
  combinations: ResearchCombination[],
) {
  const errors = validateReferences(references, algorithms, combinations);
  if (errors.length) throw new Error(`Reference validation failed:\n- ${errors.join("\n- ")}`);
}
