import { assertValidAlgorithmEntities } from "@/lib/algorithm-validation";
import { algorithms } from "@/lib/algorithm-catalog";
import { combinations } from "@/lib/combination-catalog";
import { assertValidResearchCombinations } from "@/lib/combination-validation";
import type { DocSummary } from "@/lib/content";
import { assertValidExperiments } from "@/lib/experiment-validation";
import { experiments } from "@/lib/experiments";
import { assertValidImplementations } from "@/lib/implementation-validation";
import { implementations } from "@/lib/implementations";
import { assertValidReferences } from "@/lib/reference-validation";
import { references } from "@/lib/references";

export function assertResearchIntegrity(documents: DocSummary[]) {
  const chapterSlugs = documents.map((document) => document.slug);

  assertValidAlgorithmEntities(algorithms, chapterSlugs);
  assertValidResearchCombinations(combinations, algorithms, chapterSlugs);
  assertValidReferences(references, algorithms, combinations, chapterSlugs);
  assertValidImplementations(implementations, algorithms);
  assertValidExperiments(experiments, algorithms, combinations);

  return {
    chapters: chapterSlugs.length,
    algorithms: algorithms.length,
    combinations: combinations.length,
    references: references.length,
    implementations: implementations.length,
    experiments: experiments.length,
  };
}
