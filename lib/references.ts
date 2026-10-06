import { aiReferenceAdditions } from "./reference-ai-additions.ts";
import { attentionReferenceAdditions } from "./reference-attention-additions.ts";
import { banditReferenceAdditions } from "./reference-bandit-additions.ts";
import { foundationReferenceAdditions } from "./reference-foundations-additions.ts";
import { generativeReferenceAdditions } from "./reference-generative-additions.ts";
import { privacyReferenceAdditions } from "./reference-privacy-additions.ts";
import { replicationReferenceAdditions } from "./reference-replication-additions.ts";
import { zeroKnowledgeReferenceAdditions } from "./reference-zero-knowledge-additions.ts";
import { references as coreReferences, type ReferenceEntity } from "./references-core.ts";

export type {
  ReferenceKind,
  ReferenceEvidenceRole,
  ReferenceNoticeKind,
  ReferenceNotice,
  ReferenceCitation,
  ReferenceEntity,
} from "./references-core.ts";

export const references: ReferenceEntity[] = [
  ...coreReferences,
  ...aiReferenceAdditions,
  ...attentionReferenceAdditions,
  ...banditReferenceAdditions,
  ...foundationReferenceAdditions,
  ...generativeReferenceAdditions,
  ...privacyReferenceAdditions,
  ...replicationReferenceAdditions,
  ...zeroKnowledgeReferenceAdditions,
];

const byId = new Map(references.map((reference) => [reference.id, reference]));

export function getReference(id: string) {
  return byId.get(id) ?? null;
}

export function referencesForAlgorithm(algorithmId: string) {
  return references.filter((reference) => reference.algorithmIds.includes(algorithmId));
}

export function referencesForCombination(combinationId: string) {
  return references.filter((reference) => reference.combinationIds.includes(combinationId));
}

export function referencesForChapter(chapterSlug: string) {
  return references.filter((reference) => reference.chapterSlugs.includes(chapterSlug));
}

export function citedReferenceIds(reference: ReferenceEntity) {
  return reference.citations.map((citation) => citation.targetId);
}

export function getCitedReferences(reference: ReferenceEntity) {
  return reference.citations
    .map((citation) => byId.get(citation.targetId))
    .filter((item): item is ReferenceEntity => Boolean(item));
}

export function getCitingReferences(referenceId: string) {
  return references.filter((reference) => reference.citations.some((citation) => citation.targetId === referenceId));
}

export function getCitation(reference: ReferenceEntity, targetId: string) {
  return reference.citations.find((citation) => citation.targetId === targetId) ?? null;
}

export function formatReferenceAuthors(reference: ReferenceEntity, maxAuthors = 4) {
  if (reference.authors.length <= maxAuthors) return reference.authors.join(", ");
  return `${reference.authors.slice(0, maxAuthors).join(", ")} et al.`;
}

export function referenceSearchText(reference: ReferenceEntity) {
  return [
    reference.title,
    ...reference.authors,
    reference.year.toString(),
    reference.kind,
    reference.evidenceRole,
    reference.venue ?? "",
    reference.doi ?? "",
    reference.summary,
    reference.significance,
    ...reference.notices.flatMap((notice) => [notice.kind, notice.note]),
    ...reference.tags,
  ].join(" ").toLowerCase();
}