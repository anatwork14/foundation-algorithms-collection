import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";
import type { ImplementationRecord } from "./implementations.ts";

function sameSourcePaths(
  left: ImplementationRecord["sourcePaths"],
  right: ImplementationRecord["sourcePaths"],
) {
  if (left.length !== right.length) return false;
  return left.every((source, index) =>
    source.label === right[index]?.label && source.url === right[index]?.url,
  );
}

export function validateImplementationVerificationHistory(
  history: ImplementationVerificationEntry[],
  implementations: ImplementationRecord[],
) {
  const errors: string[] = [];
  const byId = new Map(implementations.map((record) => [record.id, record]));
  const grouped = new Map<string, ImplementationVerificationEntry[]>();

  for (const entry of history) {
    const record = byId.get(entry.implementationId);
    if (!record) {
      errors.push(`Implementation verification history references unknown implementation ${entry.implementationId}`);
      continue;
    }
    if (!Number.isInteger(entry.revision) || entry.revision < 1) {
      errors.push(`${entry.implementationId}: verification revision must be a positive integer`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.verifiedAt)) {
      errors.push(`${entry.implementationId} r${entry.revision}: verifiedAt must use YYYY-MM-DD`);
    }
    if (!entry.verifiedRef.trim()) {
      errors.push(`${entry.implementationId} r${entry.revision}: verifiedRef is required`);
    }
    if (!/^[0-9a-f]{40}$/i.test(entry.verifiedCommit)) {
      errors.push(`${entry.implementationId} r${entry.revision}: verifiedCommit must be a full 40-character Git SHA`);
    }
    if (!entry.note.trim()) {
      errors.push(`${entry.implementationId} r${entry.revision}: verification note is required`);
    }
    if (!entry.sourcePaths.length) {
      errors.push(`${entry.implementationId} r${entry.revision}: at least one source path is required`);
    }
    for (const source of entry.sourcePaths) {
      if (!source.label.trim()) errors.push(`${entry.implementationId} r${entry.revision}: source label is required`);
      if (!source.url.startsWith("https://")) errors.push(`${entry.implementationId} r${entry.revision}: source URL must use HTTPS`);
      if (!source.url.includes(entry.verifiedCommit)) {
        errors.push(`${entry.implementationId} r${entry.revision}: source URL must contain its verified commit ${entry.verifiedCommit}`);
      }
    }

    const entries = grouped.get(entry.implementationId) ?? [];
    entries.push(entry);
    grouped.set(entry.implementationId, entries);
  }

  for (const record of implementations) {
    const entries = (grouped.get(record.id) ?? []).sort((a, b) => a.revision - b.revision);
    if (!entries.length) {
      errors.push(`${record.id}: at least one implementation verification revision is required`);
      continue;
    }

    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      const expectedRevision = index + 1;
      if (entry.revision !== expectedRevision) {
        errors.push(`${record.id}: verification revisions must be contiguous from 1; expected ${expectedRevision}, found ${entry.revision}`);
      }
      if (index > 0 && entries[index - 1].verifiedAt > entry.verifiedAt) {
        errors.push(`${record.id}: verification dates must be nondecreasing by revision`);
      }
    }

    const latest = entries.at(-1)!;
    if (latest.verifiedRef !== record.verifiedRef) {
      errors.push(`${record.id}: latest verification ref ${latest.verifiedRef} does not match current record ref ${record.verifiedRef}`);
    }
    if (latest.verifiedCommit.toLowerCase() !== record.verifiedCommit.toLowerCase()) {
      errors.push(`${record.id}: latest verification commit ${latest.verifiedCommit} does not match current record commit ${record.verifiedCommit}`);
    }
    if (latest.verifiedAt !== record.lastVerified) {
      errors.push(`${record.id}: latest verification date ${latest.verifiedAt} does not match current lastVerified ${record.lastVerified}`);
    }
    if (!sameSourcePaths(latest.sourcePaths, record.sourcePaths)) {
      errors.push(`${record.id}: current source paths must exactly match the latest verification snapshot`);
    }
  }

  return errors;
}

export function assertValidImplementationVerificationHistory(
  history: ImplementationVerificationEntry[],
  implementations: ImplementationRecord[],
) {
  const errors = validateImplementationVerificationHistory(history, implementations);
  if (errors.length) {
    throw new Error(`Implementation verification history validation failed:\n- ${errors.join("\n- ")}`);
  }
}
