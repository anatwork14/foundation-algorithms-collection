import type { Metadata } from "next";
import { ReferenceCitationExplorer } from "@/components/reference-citation-explorer";
import { algorithms } from "@/lib/algorithm-catalog";
import { combinations } from "@/lib/combination-catalog";
import { getAllDocuments } from "@/lib/content";
import { assertValidReferences } from "@/lib/reference-validation";
import { references } from "@/lib/references";

export const metadata: Metadata = {
  title: "Reference Citation Graph",
  description: "Explore verified citation relationships among curated Foundation Algorithms sources.",
};

export default function ReferenceCitationGraphPage() {
  assertValidReferences(references, algorithms, combinations, getAllDocuments().map((document) => document.slug));
  return <ReferenceCitationExplorer references={references} />;
}
