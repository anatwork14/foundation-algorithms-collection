import type { Metadata } from "next";
import { ArchiveExplorer } from "@/components/archive-explorer";
import { getAllDocuments } from "@/lib/content";

export const metadata: Metadata = {
  title: "Archive",
  description: "Search and browse every chapter in the Foundation Algorithms research collection.",
};

export default function ArchivePage() {
  return <ArchiveExplorer documents={getAllDocuments()} />;
}
