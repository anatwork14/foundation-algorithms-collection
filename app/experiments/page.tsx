import type { Metadata } from "next";
import { ExperimentExplorer } from "@/components/experiment-explorer";
import { algorithms } from "@/lib/algorithm-catalog";
import { combinations } from "@/lib/combination-catalog";
import { assertValidExperiments } from "@/lib/experiment-validation";
import { experiments } from "@/lib/experiments";

export const metadata: Metadata = {
  title: "Experiments",
  description: "Browse reproducible experiment plans and results linked to Foundation Algorithms research hypotheses.",
};

export default function ExperimentsPage() {
  assertValidExperiments(experiments, algorithms, combinations);
  return <ExperimentExplorer records={experiments} />;
}
