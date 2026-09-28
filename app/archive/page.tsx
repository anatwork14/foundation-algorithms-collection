import type { Metadata } from "next";
import { ArchiveExplorer } from "@/components/archive-explorer";
import { getAllDocuments } from "@/lib/content";

export const metadata: Metadata = {
  title: "Archive",
  description: "Search and browse every chapter in the Foundation Algorithms research collection.",
};

type ArchiveSearchParams = {
  q?: string | string[];
  field?: string | string[];
  sort?: string | string[];
};

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ArchivePage({ searchParams }: { searchParams: Promise<ArchiveSearchParams> }) {
  const params = await searchParams;
  return (
    <ArchiveExplorer
      documents={getAllDocuments()}
      initialQuery={first(params.q) ?? ""}
      initialField={first(params.field)}
      initialSort={first(params.sort)}
    />
  );
}
