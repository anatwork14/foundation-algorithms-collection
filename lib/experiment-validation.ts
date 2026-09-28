import type { AlgorithmEntity } from "@/lib/algorithms";
import type { ResearchCombination } from "@/lib/combinations";
import type { ExperimentRecord } from "@/lib/experiments";

export function validateExperiments(
  experiments: ExperimentRecord[],
  algorithms: AlgorithmEntity[],
  combinations: ResearchCombination[],
) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const algorithmIds = new Set(algorithms.map((algorithm) => algorithm.id));
  const combinationIds = new Set(combinations.map((combination) => combination.id));

  for (const experiment of experiments) {
    if (!experiment.id || !/^[a-z0-9-]+$/.test(experiment.id)) errors.push(`Invalid experiment id: ${experiment.id || "<empty>"}`);
    if (ids.has(experiment.id)) errors.push(`Duplicate experiment id: ${experiment.id}`);
    ids.add(experiment.id);
    if (!experiment.title.trim()) errors.push(`${experiment.id}: title is required`);
    if (!combinationIds.has(experiment.combinationId)) errors.push(`${experiment.id}: unknown combination ${experiment.combinationId}`);
    if (!experiment.algorithmIds.length) errors.push(`${experiment.id}: at least one algorithm is required`);
    for (const algorithmId of experiment.algorithmIds) if (!algorithmIds.has(algorithmId)) errors.push(`${experiment.id}: unknown algorithm ${algorithmId}`);
    if (!experiment.objective.trim()) errors.push(`${experiment.id}: objective is required`);
    if (!experiment.hypothesis.trim()) errors.push(`${experiment.id}: hypothesis is required`);
    if (!experiment.baselines.length) errors.push(`${experiment.id}: at least one baseline is required`);
    if (!experiment.datasets.length) errors.push(`${experiment.id}: at least one dataset/benchmark description is required`);
    if (!experiment.metrics.length) errors.push(`${experiment.id}: metrics are required`);
    if (!experiment.environment.length) errors.push(`${experiment.id}: environment controls are required`);
    if (!experiment.procedure.length) errors.push(`${experiment.id}: procedure is required`);
    if (!experiment.successCriteria.length) errors.push(`${experiment.id}: success criteria are required`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(experiment.lastUpdated)) errors.push(`${experiment.id}: lastUpdated must use YYYY-MM-DD`);
    if (experiment.status === "Completed" && !experiment.result) errors.push(`${experiment.id}: completed experiment requires a result`);
    if (experiment.result && !experiment.result.summary.trim()) errors.push(`${experiment.id}: result summary is required when result exists`);
  }

  return errors;
}

export function assertValidExperiments(
  experiments: ExperimentRecord[],
  algorithms: AlgorithmEntity[],
  combinations: ResearchCombination[],
) {
  const errors = validateExperiments(experiments, algorithms, combinations);
  if (errors.length) throw new Error(`Experiment validation failed:\n- ${errors.join("\n- ")}`);
}
