import type { AlgorithmEntity } from "@/lib/algorithms";
import type { ResearchCombination } from "@/lib/combinations";

export function validateResearchCombinations(combinations: ResearchCombination[], algorithms: AlgorithmEntity[]) {
  const errors: string[] = [];
  const algorithmIds = new Set(algorithms.map((algorithm) => algorithm.id));
  const ids = new Set<string>();

  for (const combination of combinations) {
    if (!combination.id || !/^[a-z0-9-]+$/.test(combination.id)) errors.push(`Invalid combination id: ${combination.id || "<empty>"}`);
    if (ids.has(combination.id)) errors.push(`Duplicate combination id: ${combination.id}`);
    ids.add(combination.id);

    if (combination.algorithmIds.length < 2) errors.push(`${combination.id}: at least two algorithm components are required`);
    if (new Set(combination.algorithmIds).size !== combination.algorithmIds.length) errors.push(`${combination.id}: duplicate algorithm component`);
    for (const id of combination.algorithmIds) {
      if (!algorithmIds.has(id)) errors.push(`${combination.id}: unknown algorithm component ${id}`);
    }

    if (!combination.motivation.trim()) errors.push(`${combination.id}: motivation is required`);
    if (!combination.hypothesis.trim()) errors.push(`${combination.id}: hypothesis is required`);
    if (!combination.compatibility.length) errors.push(`${combination.id}: compatibility analysis is required`);
    if (!combination.tensions.length) errors.push(`${combination.id}: tensions/conflicts are required`);
    if (!combination.expectedBenefits.length) errors.push(`${combination.id}: expected benefits are required`);
    if (!combination.risks.length) errors.push(`${combination.id}: risks are required`);
    if (!combination.metrics.length) errors.push(`${combination.id}: measurable metrics are required`);
    if (!combination.experimentPlan.length) errors.push(`${combination.id}: experiment plan is required`);
    if (!combination.sourceChapters.length) errors.push(`${combination.id}: source chapters are required`);
  }

  return errors;
}

export function assertValidResearchCombinations(combinations: ResearchCombination[], algorithms: AlgorithmEntity[]) {
  const errors = validateResearchCombinations(combinations, algorithms);
  if (errors.length) throw new Error(`Research combination validation failed:\n- ${errors.join("\n- ")}`);
}
