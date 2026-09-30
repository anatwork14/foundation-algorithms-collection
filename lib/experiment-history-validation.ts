import type { ExperimentRecord } from "./experiments.ts";
import type { ExperimentHistoryEntry } from "./experiment-history.ts";

const terminalStatuses = new Set(["Completed", "Inconclusive", "Failed"]);

export function validateExperimentHistory(
  history: ExperimentHistoryEntry[],
  experiments: ExperimentRecord[],
) {
  const errors: string[] = [];
  const experimentById = new Map(experiments.map((experiment) => [experiment.id, experiment]));
  const grouped = new Map<string, ExperimentHistoryEntry[]>();

  for (const entry of history) {
    if (!experimentById.has(entry.experimentId)) {
      errors.push(`Experiment history references unknown experiment ${entry.experimentId}`);
      continue;
    }
    if (!Number.isInteger(entry.revision) || entry.revision < 1) {
      errors.push(`${entry.experimentId}: history revision must be a positive integer`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
      errors.push(`${entry.experimentId} r${entry.revision}: history date must use YYYY-MM-DD`);
    }
    if (!entry.title.trim()) errors.push(`${entry.experimentId} r${entry.revision}: history title is required`);
    if (!entry.note.trim()) errors.push(`${entry.experimentId} r${entry.revision}: history note is required`);

    const experiment = experimentById.get(entry.experimentId);
    if (experiment && entry.artifactLabels) {
      const knownLabels = new Set(experiment.artifacts.map((artifact) => artifact.label));
      for (const label of entry.artifactLabels) {
        if (!knownLabels.has(label)) {
          errors.push(`${entry.experimentId} r${entry.revision}: unknown artifact label ${label}`);
        }
      }
    }

    const entries = grouped.get(entry.experimentId) ?? [];
    entries.push(entry);
    grouped.set(entry.experimentId, entries);
  }

  for (const experiment of experiments) {
    const entries = (grouped.get(experiment.id) ?? []).sort((a, b) => a.revision - b.revision);
    if (!entries.length) {
      errors.push(`${experiment.id}: at least one history entry is required`);
      continue;
    }

    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const expectedRevision = index + 1;
      if (entry.revision !== expectedRevision) {
        errors.push(`${experiment.id}: history revisions must be contiguous from 1; expected ${expectedRevision}, found ${entry.revision}`);
      }
      if (index > 0 && entries[index - 1].date > entry.date) {
        errors.push(`${experiment.id}: history dates must be nondecreasing by revision`);
      }
    }

    const latest = entries.at(-1)!;
    if (latest.status !== experiment.status) {
      errors.push(`${experiment.id}: final history status ${latest.status} does not match current status ${experiment.status}`);
    }
    if (latest.date !== experiment.lastUpdated) {
      errors.push(`${experiment.id}: final history date ${latest.date} does not match lastUpdated ${experiment.lastUpdated}`);
    }

    const resultEntries = entries.filter((entry) => entry.kind === "Result");
    if (experiment.result && resultEntries.length === 0) {
      errors.push(`${experiment.id}: result-bearing experiment requires a Result history entry`);
    }
    if (!experiment.result && resultEntries.length > 0) {
      errors.push(`${experiment.id}: Result history entry exists but experiment has no result`);
    }
    for (const entry of resultEntries) {
      if (!terminalStatuses.has(entry.status)) {
        errors.push(`${experiment.id} r${entry.revision}: Result history entry must use a terminal experiment status`);
      }
    }
  }

  return errors;
}

export function assertValidExperimentHistory(
  history: ExperimentHistoryEntry[],
  experiments: ExperimentRecord[],
) {
  const errors = validateExperimentHistory(history, experiments);
  if (errors.length) throw new Error(`Experiment history validation failed:\n- ${errors.join("\n- ")}`);
}
