import type { Metadata } from "next";
import { ClaimExplorer, type ClaimExplorerEntry } from "@/components/claim-explorer";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { resolveClaimPassage } from "@/lib/claim-provenance";
import { claims } from "@/lib/claims";
import { getDocument } from "@/lib/content";
import { getReference } from "@/lib/references";
import { passageSourceUrl } from "@/lib/search-passages";

export const metadata: Metadata = {
  title: "Claims",
  description: "Inspect curated claim-to-passage-to-reference provenance records in Foundation Algorithms.",
};

export default function ClaimsPage() {
  const entries: ClaimExplorerEntry[] = claims.map((claim) => {
    const document = getDocument(claim.chapterSlug);
    const resolved = resolveClaimPassage(claim, document);
    if (!resolved) throw new Error(`Claim ${claim.id} did not resolve to exactly one passage.`);

    const algorithms = claim.algorithmIds.map(getAlgorithm).filter((item) => Boolean(item));
    const references = claim.referenceIds.map(getReference).filter((item) => Boolean(item));

    return {
      id: claim.id,
      kind: claim.kind,
      statement: claim.statement,
      note: claim.note,
      algorithms: algorithms.map((algorithm) => ({ id: algorithm!.id, name: algorithm!.name })),
      references: references.map((reference) => ({
        id: reference!.id,
        title: reference!.title,
        year: reference!.year,
        role: reference!.evidenceRole,
      })),
      chapter: {
        slug: resolved.chapter.slug,
        number: resolved.chapter.number,
        title: resolved.chapter.title,
      },
      passage: {
        ...resolved.passage,
        sourceUrl: passageSourceUrl(resolved.chapter.slug, resolved.passage),
      },
    };
  });

  return <ClaimExplorer entries={entries} />;
}
