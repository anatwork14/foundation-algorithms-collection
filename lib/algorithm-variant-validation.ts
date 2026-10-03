import type { AlgorithmEntity } from "@/lib/algorithms";
import type { AlgorithmVariantRecord } from "@/lib/algorithm-variants";

export type VariantSourceDocument = {
  slug: string;
  toc: Array<{ id: string; label: string; level: number }>;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function validateAlgorithmVariants(
  variants: AlgorithmVariantRecord[],
  algorithms: AlgorithmEntity[],
  documents?: VariantSourceDocument[],
) {
  const errors: string[] = [];
  const algorithmIds = new Set(algorithms.map((algorithm) => algorithm.id));
  const byDocument = documents ? new Map(documents.map((document) => [document.slug, document])) : null;
  const ids = new Set<string>();
  const searchableNames = new Map<string, string>();

  for (const variant of variants) {
    if (!variant.id || !/^[a-z0-9-]+$/.test(variant.id)) {
      errors.push(`Invalid variant id: ${variant.id || "<empty>"}`);
    }
    if (ids.has(variant.id)) errors.push(`Duplicate variant id: ${variant.id}`);
    ids.add(variant.id);

    if (!algorithmIds.has(variant.parentAlgorithmId)) {
      errors.push(`${variant.id}: parent algorithm does not exist: ${variant.parentAlgorithmId}`);
    }

    for (const label of [variant.name, ...variant.aliases]) {
      const key = normalize(label);
      if (!key) {
        errors.push(`${variant.id}: empty name/alias is not allowed`);
        continue;
      }
      const previous = searchableNames.get(key);
      if (previous && previous !== variant.id) {
        errors.push(`Ambiguous variant name/alias “${label}” shared by ${previous} and ${variant.id}`);
      } else {
        searchableNames.set(key, variant.id);
      }
    }

    if (!variant.summary.trim()) errors.push(`${variant.id}: summary is required`);
    if (!variant.distinction.trim()) errors.push(`${variant.id}: distinction is required`);
    if (!variant.assumptions.length) errors.push(`${variant.id}: at least one assumption is required`);
    if (!variant.tradeoffs.length) errors.push(`${variant.id}: at least one tradeoff is required`);
    if (!variant.implementationNotes.length) errors.push(`${variant.id}: implementation notes are required`);
    if (!variant.sourceLinks.length) errors.push(`${variant.id}: at least one source link is required`);

    const sourceKeys = new Set<string>();
    for (const source of variant.sourceLinks) {
      const sourceKey = `${source.chapterSlug}#${source.anchor}`;
      if (sourceKeys.has(sourceKey)) errors.push(`${variant.id}: duplicate source link ${sourceKey}`);
      sourceKeys.add(sourceKey);

      if (!source.label.trim()) errors.push(`${variant.id}: source ${sourceKey} requires a label`);
      if (!/^[a-z0-9][a-z0-9-]*$/.test(source.anchor)) {
        errors.push(`${variant.id}: invalid source anchor: ${source.anchor}`);
      }

      if (byDocument) {
        const document = byDocument.get(source.chapterSlug);
        if (!document) {
          errors.push(`${variant.id}: source chapter does not exist: ${source.chapterSlug}`);
          continue;
        }
        if (!document.toc.some((entry) => entry.id === source.anchor)) {
          errors.push(`${variant.id}: source anchor does not exist: ${sourceKey}`);
        }
      }
    }
  }

  return errors;
}

export function assertValidAlgorithmVariants(
  variants: AlgorithmVariantRecord[],
  algorithms: AlgorithmEntity[],
  documents?: VariantSourceDocument[],
) {
  const errors = validateAlgorithmVariants(variants, algorithms, documents);
  if (errors.length) {
    throw new Error(`Algorithm variant validation failed:\n- ${errors.join("\n- ")}`);
  }
}
