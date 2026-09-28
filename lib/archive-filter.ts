import type { DocSummary } from "@/lib/content";
import type { ChapterDiscoveryMetadata, EvidenceAvailability } from "@/lib/discovery";
import type { EvidenceStage } from "@/lib/evidence-stage";
import type { ResearchField } from "@/lib/taxonomy";

export type ArchiveSortMode = "number" | "title" | "length";
export type ArchiveEvidenceFilter = EvidenceAvailability | "All";
export type ArchiveEvidenceStageFilter = EvidenceStage | "All";

export type ArchiveFilterState = {
  query: string;
  field: ResearchField | "All";
  family: string;
  algorithm: string;
  evidence: ArchiveEvidenceFilter;
  stage: ArchiveEvidenceStageFilter;
  sort: ArchiveSortMode;
};

export function filterArchiveDocuments(
  documents: DocSummary[],
  discovery: ChapterDiscoveryMetadata[],
  state: ArchiveFilterState,
) {
  const metadataBySlug = new Map(discovery.map((item) => [item.slug, item]));
  const needle = state.query.trim().toLowerCase();

  const filtered = documents.filter((doc) => {
    const meta = metadataBySlug.get(doc.slug);
    const fieldMatch = state.field === "All" || doc.field === state.field;
    const familyMatch = state.family === "All" || meta?.families.includes(state.family);
    const algorithmMatch = state.algorithm === "All" || meta?.algorithmIds.includes(state.algorithm);
    const evidenceMatch = state.evidence === "All" || meta?.evidence.includes(state.evidence);
    const stageMatch = state.stage === "All" || meta?.evidenceStages.includes(state.stage);
    const queryMatch =
      !needle ||
      doc.title.toLowerCase().includes(needle) ||
      doc.summary.toLowerCase().includes(needle) ||
      doc.searchText.includes(needle) ||
      meta?.algorithms.some((item) => item.name.toLowerCase().includes(needle)) ||
      meta?.families.some((item) => item.toLowerCase().includes(needle)) ||
      meta?.evidenceStages.some((item) => item.toLowerCase().includes(needle));

    return fieldMatch && familyMatch && algorithmMatch && evidenceMatch && stageMatch && Boolean(queryMatch);
  });

  return [...filtered].sort((a, b) => {
    if (state.sort === "title") return a.title.localeCompare(b.title);
    if (state.sort === "length") return b.words - a.words;
    return a.number.localeCompare(b.number, undefined, { numeric: true });
  });
}
