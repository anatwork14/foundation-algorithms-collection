import { assertValidAlgorithmEntities } from "@/lib/algorithm-validation";
import { algorithms } from "@/lib/algorithm-catalog";
import { assertValidClaims } from "@/lib/claim-validation";
import { claims } from "@/lib/claims";
import { combinations } from "@/lib/combination-catalog";
import { assertValidResearchCombinations } from "@/lib/combination-validation";
import { getDocument, type DocSummary } from "@/lib/content";
import { experimentHistory } from "@/lib/experiment-history";
import { assertValidExperimentHistory } from "@/lib/experiment-history-validation";
import { assertValidExperiments } from "@/lib/experiment-validation";
import { experiments } from "@/lib/experiments";
import { assertValidImplementations } from "@/lib/implementation-validation";
import { implementations } from "@/lib/implementations";
import { assertValidReferences } from "@/lib/reference-validation";
import { references } from "@/lib/references";
import { relationProvenance } from "@/lib/relation-provenance";
import { assertValidRelationProvenance } from "@/lib/relation-provenance-validation";
import { assertValidReplications } from "@/lib/replication-validation";
import { replications } from "@/lib/replications";
import { assertValidSearchPassages } from "@/lib/search-passage-validation";

export function assertResearchIntegrity(documents: DocSummary[]) {
  const chapterSlugs = documents.map((document) => document.slug);
  const records = new Map(
    chapterSlugs
      .map((slug) => [slug, getDocument(slug)] as const)
      .filter((entry): entry is readonly [string, NonNullable<ReturnType<typeof getDocument>>] => Boolean(entry[1])),
  );

  assertValidAlgorithmEntities(algorithms, chapterSlugs);
  assertValidResearchCombinations(combinations, algorithms, chapterSlugs);
  assertValidReferences(references, algorithms, combinations, chapterSlugs);
  assertValidRelationProvenance(relationProvenance, algorithms, references);
  assertValidReplications(replications, algorithms, references);
  assertValidImplementations(implementations, algorithms);
  assertValidExperiments(experiments, algorithms, combinations);
  assertValidExperimentHistory(experimentHistory, experiments);
  assertValidSearchPassages(documents, records);
  assertValidClaims(claims, algorithms, references, records);

  return {
    chapters: chapterSlugs.length,
    algorithms: algorithms.length,
    combinations: combinations.length,
    references: references.length,
    relationProvenance: relationProvenance.length,
    replications: replications.length,
    implementations: implementations.length,
    experiments: experiments.length,
    experimentHistory: experimentHistory.length,
    claims: claims.length,
    passages: documents.reduce((sum, document) => sum + document.passages.length, 0),
  };
}
