import type { Metadata } from "next";
import { VariantExplorer } from "@/components/variant-explorer";
import { algorithms } from "@/lib/algorithm-catalog";
import { algorithmVariants } from "@/lib/algorithm-variants";

export const metadata: Metadata = {
  title: "Algorithm Variants",
  description: "Browse source-linked formulations of curated Foundation Algorithms without fragmenting the parent algorithm graph.",
};

export default function VariantsPage() {
  return <VariantExplorer variants={algorithmVariants} algorithms={algorithms} />;
}
