import type { Metadata } from "next";
import { AlgorithmExplorer } from "@/components/algorithm-explorer";
import { assertValidAlgorithmEntities } from "@/lib/algorithm-validation";
import { algorithms } from "@/lib/algorithms";

export const metadata: Metadata = {
  title: "Algorithms",
  description: "Browse curated algorithm entities across foundations, AI/ML, quantum computing, and cybersecurity.",
};

export default function AlgorithmsPage() {
  assertValidAlgorithmEntities(algorithms);
  return <AlgorithmExplorer algorithms={algorithms} />;
}
