import type { ClaimRecord } from "@/lib/claims";
import type { DocRecord, DocSummary } from "@/lib/content";
import type { SearchPassage } from "@/lib/search-passages";

export type ResolvedClaimPassage = {
  chapter: Pick<DocSummary, "slug" | "title" | "number" | "field">;
  passage: SearchPassage;
};

export function claimPassageMatches(claim: ClaimRecord, document: DocRecord | DocSummary | null | undefined) {
  if (!document) return [];
  const needle = claim.passageContains.trim().toLowerCase();
  if (!needle) return [];
  return document.passages.filter((passage) => passage.text.toLowerCase().includes(needle));
}

export function resolveClaimPassage(
  claim: ClaimRecord,
  document: DocRecord | DocSummary | null | undefined,
): ResolvedClaimPassage | null {
  if (!document) return null;
  const matches = claimPassageMatches(claim, document);
  if (matches.length !== 1) return null;
  return {
    chapter: {
      slug: document.slug,
      title: document.title,
      number: document.number,
      field: document.field,
    },
    passage: matches[0],
  };
}
