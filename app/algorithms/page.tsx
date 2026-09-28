import type { Metadata } from "next";
import { AlgorithmExplorer } from "@/components/algorithm-explorer";
import { assertValidAlgorithmEntities } from "@/lib/algorithm-validation";
import { algorithms } from "@/lib/algorithm-catalog";
import { getAlgorithmEvidenceProfile } from "@/lib/evidence-profile";

export const metadata: Metadata = {
  title: "Algorithms",
  description: "Browse curated algorithm entities across foundations, AI/ML, quantum computing, and cybersecurity.",
};

export default function AlgorithmsPage() {
  assertValidAlgorithmEntities(algorithms);
  const evidenceProfiles = algorithms.map((algorithm) => {
    const profile = getAlgorithmEvidenceProfile(algorithm.id);
    return { algorithmId: algorithm.id, stage: profile.stage };
  });
  return <AlgorithmExplorer algorithms={algorithms} evidenceProfiles={evidenceProfiles} />;
}
