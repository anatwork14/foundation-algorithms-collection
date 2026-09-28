import type { AlgorithmEntity } from "@/lib/algorithms";
import type { ImplementationRecord } from "@/lib/implementations";

export function validateImplementations(records: ImplementationRecord[], algorithms: AlgorithmEntity[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const algorithmIds = new Set(algorithms.map((algorithm) => algorithm.id));

  for (const record of records) {
    if (!record.id || !/^[a-z0-9-]+$/.test(record.id)) errors.push(`Invalid implementation id: ${record.id || "<empty>"}`);
    if (ids.has(record.id)) errors.push(`Duplicate implementation id: ${record.id}`);
    ids.add(record.id);
    if (!record.name.trim()) errors.push(`${record.id}: name is required`);
    if (!/^https:\/\/github\.com\//.test(record.repository)) errors.push(`${record.id}: GitHub repository URL is required`);
    if (!record.algorithmIds.length) errors.push(`${record.id}: at least one algorithm link is required`);
    for (const algorithmId of record.algorithmIds) if (!algorithmIds.has(algorithmId)) errors.push(`${record.id}: unknown algorithm ${algorithmId}`);
    if (!record.language.trim()) errors.push(`${record.id}: primary language is required`);
    if (!record.interfaces.length) errors.push(`${record.id}: at least one interface is required`);
    if (!record.license.trim()) errors.push(`${record.id}: license metadata is required`);
    if (!record.summary.trim()) errors.push(`${record.id}: summary is required`);
    if (!record.implementationNotes.length) errors.push(`${record.id}: implementation notes are required`);
    for (const source of record.sourcePaths) {
      if (!source.label.trim() || !/^https:\/\/github\.com\//.test(source.url)) errors.push(`${record.id}: invalid source path ${source.url}`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.lastVerified)) errors.push(`${record.id}: lastVerified must use YYYY-MM-DD`);
  }

  return errors;
}

export function assertValidImplementations(records: ImplementationRecord[], algorithms: AlgorithmEntity[]) {
  const errors = validateImplementations(records, algorithms);
  if (errors.length) throw new Error(`Implementation validation failed:\n- ${errors.join("\n- ")}`);
}
