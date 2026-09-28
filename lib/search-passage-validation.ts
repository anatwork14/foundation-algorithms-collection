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

    for (const [index, passage] of document.passages.entries()) {
      if (!passage.text.trim()) errors.push(`${document.slug}: passage ${index} has empty text`);
      if (!passage.searchText.trim()) errors.push(`${document.slug}: passage ${index} has empty search text`);
      if (passage.searchText !== passage.text.toLowerCase()) errors.push(`${document.slug}: passage ${index} search text is not normalized`);
      if (!passage.heading.trim()) errors.push(`${document.slug}: passage ${index} has no heading label`);
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
