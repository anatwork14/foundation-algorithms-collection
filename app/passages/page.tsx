import type { Metadata } from "next";
import { PassageExplorer } from "@/components/passage-explorer";
import { getAllDocuments } from "@/lib/content";

export const metadata: Metadata = {
  title: "Passages",
  description: "Inspect source-backed passage records derived from the Foundation Algorithms Markdown corpus.",
};

export default function PassagesPage() {
  return <PassageExplorer documents={getAllDocuments()} />;
}
