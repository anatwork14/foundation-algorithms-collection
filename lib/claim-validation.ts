import type { AlgorithmEntity } from "@/lib/algorithms";
import { claimPassageMatches } from "@/lib/claim-provenance";
import type { ClaimRecord } from "@/lib/claims";
import type { DocRecord } from "@/lib/content";
import type { ReferenceEntity } from "@/lib/references";

const claimKinds = new Set(["Mechanism", "Assumption", "Guarantee", "Standard", "Empirical"]);

export function validateClaims(
  claims: ClaimRecord[],
  algorithms: AlgorithmEntity[],
  references: ReferenceEntity[],
  documents: Map<string, DocRecord>,
) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const algorithmIds = new Set(algorithms.map((algorithm) => algorithm.id));
  const referenceById = new Map(references.map((reference) => [reference.id, reference]));

  for (const claim of claims) {
    if (!claim.id || !/^[a-z0-9-]+$/.test(claim.id)) errors.push(`Invalid claim id: ${claim.id || "<empty>"}`);
    if (ids.has(claim.id)) errors.push(`Duplicate claim id: ${claim.id}`);
    ids.add(claim.id);
    if (!claimKinds.has(claim.kind)) errors.push(`${claim.id}: invalid claim kind ${claim.kind}`);
    if (!claim.statement.trim()) errors.push(`${claim.id}: statement is required`);
    if (!claim.note.trim()) errors.push(`${claim.id}: note is required`);
    if (!claim.algorithmIds.length) errors.push(`${claim.id}: at least one Algorithm is required`);
    if (!claim.referenceIds.length) errors.push(`${claim.id}: at least one Reference is required`);
    if (!claim.passageContains.trim()) errors.push(`${claim.id}: passage selector is required`);

    for (const algorithmId of claim.algorithmIds) {
      if (!algorithmIds.has(algorithmId)) errors.push(`${claim.id}: unknown Algorithm ${algorithmId}`);
    }

    const document = documents.get(claim.chapterSlug);
    if (!document) {
      errors.push(`${claim.id}: unknown chapter ${claim.chapterSlug}`);
    } else {
      const passageMatches = claimPassageMatches(claim, document);
      if (passageMatches.length !== 1) {
        errors.push(`${claim.id}: passage selector must match exactly one passage, found ${passageMatches.length}`);
      }
    }

    for (const referenceId of claim.referenceIds) {
      const reference = referenceById.get(referenceId);
      if (!reference) {
        errors.push(`${claim.id}: unknown Reference ${referenceId}`);
        continue;
      }
      if (!reference.chapterSlugs.includes(claim.chapterSlug)) {
        errors.push(`${claim.id}: Reference ${referenceId} is not linked to chapter ${claim.chapterSlug}`);
      }
      if (!claim.algorithmIds.some((algorithmId) => reference.algorithmIds.includes(algorithmId))) {
        errors.push(`${claim.id}: Reference ${referenceId} does not overlap a claimed Algorithm`);
      }
    }
  }

  return errors;
}

export function assertValidClaims(
  claims: ClaimRecord[],
  algorithms: AlgorithmEntity[],
  references: ReferenceEntity[],
  documents: Map<string, DocRecord>,
) {
  const errors = validateClaims(claims, algorithms, references, documents);
  if (errors.length) throw new Error(`Claim validation failed:\n- ${errors.join("\n- ")}`);
}
