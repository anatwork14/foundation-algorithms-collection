import type { DocRecord, DocSummary } from "@/lib/content";

export function validateSearchPassages(documents: DocSummary[], records: Map<string, DocRecord>) {
  const errors: string[] = [];

  for (const document of documents) {
    if (!document.passages.length) {
      errors.push(`${document.slug}: no searchable passages were indexed`);
      continue;
    }

    const record = records.get(document.slug);
    if (!record) {
      errors.push(`${document.slug}: document record unavailable for passage validation`);
      continue;
    }
    const tocAnchors = new Set(record.toc.map((item) => item.id));
    const passageIds = new Set<string>();

    for (const [index, passage] of document.passages.entries()) {
      if (!/^p-[a-f0-9]{12}(?:-\d+)?$/.test(passage.id)) errors.push(`${document.slug}: passage ${index} has invalid id ${passage.id}`);
      if (passageIds.has(passage.id)) errors.push(`${document.slug}: duplicate passage id ${passage.id}`);
      passageIds.add(passage.id);
      if (!passage.text.trim()) errors.push(`${document.slug}: passage ${index} has empty text`);
      if (!passage.heading.trim()) errors.push(`${document.slug}: passage ${index} has no heading label`);
      if (!Number.isInteger(passage.startLine) || passage.startLine < 1) errors.push(`${document.slug}: passage ${index} has invalid start line`);
      if (!Number.isInteger(passage.endLine) || passage.endLine < passage.startLine) errors.push(`${document.slug}: passage ${index} has invalid end line`);
      if (passage.anchor && !tocAnchors.has(passage.anchor)) {
        errors.push(`${document.slug}: passage ${index} points to unknown heading anchor ${passage.anchor}`);
      }
    }
  }

  return errors;
}

export function assertValidSearchPassages(documents: DocSummary[], records: Map<string, DocRecord>) {
  const errors = validateSearchPassages(documents, records);
  if (errors.length) throw new Error(`Search passage validation failed:\n- ${errors.join("\n- ")}`);
}
