import type { Metadata } from "next";
import { ArchiveExplorer } from "@/components/archive-explorer";
import { getAllDocuments } from "@/lib/content";
import { buildChapterDiscoveryMetadata } from "@/lib/discovery";

export const metadata: Metadata = {
  title: "Archive",
  description: "Search and browse every chapter in the Foundation Algorithms research collection.",
};

type ArchiveSearchParams = {
  q?: string | string[];
  field?: string | string[];
  family?: string | string[];
  algorithm?: string | string[];
  evidence?: string | string[];
  stage?: string | string[];
  sort?: string | string[];
};

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ArchivePage({ searchParams }: { searchParams: Promise<ArchiveSearchParams> }) {
  const params = await searchParams;
  const documents = getAllDocuments();
  return (
    <ArchiveExplorer
      documents={documents}
      discovery={buildChapterDiscoveryMetadata(documents)}
      initialQuery={first(params.q) ?? ""}
      initialField={first(params.field)}
      initialFamily={first(params.family)}
      initialAlgorithm={first(params.algorithm)}
      initialEvidence={first(params.evidence)}
      initialStage={first(params.stage)}
      initialSort={first(params.sort)}
    />
  );
}
