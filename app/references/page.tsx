import type { Metadata } from "next";
import { ReferenceExplorer } from "@/components/reference-explorer";
import { algorithms } from "@/lib/algorithm-catalog";
import { combinations } from "@/lib/combination-catalog";
import { getAllDocuments } from "@/lib/content";
import { assertValidReferences } from "@/lib/reference-validation";
import { references } from "@/lib/references";

export const metadata: Metadata = {
  title: "References",
  description: "Browse primary papers, standards, and books linked to Foundation Algorithms research entities.",
};

export default function ReferencesPage() {
  const chapterSlugs = getAllDocuments().map((document) => document.slug);
  assertValidReferences(references, algorithms, combinations, chapterSlugs);
  return <ReferenceExplorer references={references} />;
}
