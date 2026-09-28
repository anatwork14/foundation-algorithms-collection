import type { Metadata } from "next";
import { AlgorithmExplorer } from "@/components/algorithm-explorer";
import { algorithms } from "@/lib/algorithms";

export const metadata: Metadata = {
  title: "Algorithms",
  description: "Browse curated algorithm entities across foundations, AI/ML, quantum computing, and cybersecurity.",
};

export default function AlgorithmsPage() {
  return <AlgorithmExplorer algorithms={algorithms} />;
}
