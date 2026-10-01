import type { AlgorithmEntity } from "@/lib/algorithms";
import type { ResearchCombination } from "@/lib/combinations";
import type { ReferenceEntity, ReferenceEvidenceRole, ReferenceNoticeKind } from "@/lib/references";

const evidenceRoles = new Set<ReferenceEvidenceRole>([
  "Primary method",
  "Primary extension",
  "Normative standard",
  "Survey / synthesis",
  "Replication / evaluation",
]);

const noticeKinds = new Set<ReferenceNoticeKind>([
  "Version",
  "Errata",
  "Correction",
  "Superseded",
  "Withdrawn",
  "Retraction",
]);

export function validateReferences(
  references: ReferenceEntity[],
  algorithms: AlgorithmEntity[],
  combinations: ResearchCombination[],
  chapterSlugs: string[],
) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const algorithmIds = new Set(algorithms.map((item) => item.id));
  const combinationIds = new Set(combinations.map((item) => item.id));
  const chapterIds = new Set(chapterSlugs);

  for (const reference of references) {
    if (!reference.id || !/^[a-z0-9-]+$/.test(reference.id)) errors.push(`Invalid reference id: ${reference.id || "<empty>"}`);
    if (ids.has(reference.id)) errors.push(`Duplicate reference id: ${reference.id}`);
    ids.add(reference.id);
    if (!reference.title.trim()) errors.push(`${reference.id}: title is required`);
    if (!reference.authors.length) errors.push(`${reference.id}: authors are required`);
    if (!Number.isInteger(reference.year) || reference.year < 1900 || reference.year > 2100) errors.push(`${reference.id}: valid publication year is required`);
    if (!evidenceRoles.has(reference.evidenceRole)) errors.push(`${reference.id}: invalid evidence role ${reference.evidenceRole}`);
    if (!/^https:\/\//.test(reference.url)) errors.push(`${reference.id}: HTTPS URL is required`);
    if (!reference.algorithmIds.length && !reference.combinationIds.length) errors.push(`${reference.id}: must link to an algorithm or combination`);
    for (const id of reference.algorithmIds) if (!algorithmIds.has(id)) errors.push(`${reference.id}: unknown algorithm ${id}`);
    for (const id of reference.combinationIds) if (!combinationIds.has(id)) errors.push(`${reference.id}: unknown combination ${id}`);
    if (!reference.chapterSlugs.length) errors.push(`${reference.id}: at least one source chapter is required`);
    for (const slug of reference.chapterSlugs) if (!chapterIds.has(slug)) errors.push(`${reference.id}: unknown source chapter ${slug}`);
    if (!Array.isArray(reference.notices)) errors.push(`${reference.id}: notices must be an array`);
    if (!reference.summary.trim()) errors.push(`${reference.id}: summary is required`);
    if (!reference.significance.trim()) errors.push(`${reference.id}: significance is required`);
    if (!reference.tags.length) errors.push(`${reference.id}: at least one tag is required`);

    for (const notice of reference.notices ?? []) {
      if (!noticeKinds.has(notice.kind)) errors.push(`${reference.id}: invalid reference notice kind ${notice.kind}`);
      if (!notice.note.trim()) errors.push(`${reference.id}: ${notice.kind} notice requires a note`);
      if (!/^https:\/\//.test(notice.url)) errors.push(`${reference.id}: ${notice.kind} notice requires an HTTPS verification URL`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(notice.verifiedAt)) errors.push(`${reference.id}: ${notice.kind} notice verifiedAt must use YYYY-MM-DD`);
    }

    const targets = reference.citations.map((citation) => citation.targetId);
    const uniqueCitations = new Set(targets);
    if (uniqueCitations.size !== targets.length) errors.push(`${reference.id}: duplicate cited reference id`);
    if (targets.includes(reference.id)) errors.push(`${reference.id}: reference cannot cite itself`);

    for (const citation of reference.citations) {
      if (!citation.note.trim()) errors.push(`${reference.id} -> ${citation.targetId}: citation verification note is required`);
      if (!/^https:\/\//.test(citation.verificationUrl)) errors.push(`${reference.id} -> ${citation.targetId}: HTTPS verification URL is required`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(citation.verifiedAt)) errors.push(`${reference.id} -> ${citation.targetId}: verifiedAt must use YYYY-MM-DD`);
    }
  }

  for (const reference of references) {
    for (const citation of reference.citations) {
      if (!ids.has(citation.targetId)) errors.push(`${reference.id}: unknown cited reference ${citation.targetId}`);
    }
  }

  return errors;
}

export function assertValidReferences(
  references: ReferenceEntity[],
  algorithms: AlgorithmEntity[],
  combinations: ResearchCombination[],
  chapterSlugs: string[],
) {
  const errors = validateReferences(references, algorithms, combinations, chapterSlugs);
  if (errors.length) throw new Error(`Reference validation failed:\n- ${errors.join("\n- ")}`);
}
