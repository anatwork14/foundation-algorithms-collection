import test from "node:test";
import assert from "node:assert/strict";
import { summarizeDocumentContent } from "../lib/content.ts";

const source = `# Demo **Research** Chapter

This introductory paragraph is deliberately long enough to become the document summary while preserving inline Markdown cleanup for the parser contract.

## Alpha section
The first source-backed paragraph spans two lines and contains a literal searchable concept.
The continuation remains part of the same deterministic passage record.

\`\`\`ts
const hiddenFromSearch = "fenced implementation detail";
\`\`\`

## Alpha section
A second paragraph under the duplicate heading is long enough to become another passage and should receive the duplicate GitHub-style anchor.

| Column | Value |
| --- | --- |
| hidden table row | ignored passage content |
`;

test("document summary derives stable metadata from Markdown", () => {
  const summary = summarizeDocumentContent("12-demo-research.md", source);

  assert.equal(summary.slug, "12-demo-research");
  assert.equal(summary.number, "12");
  assert.equal(summary.field, "AI / ML");
  assert.equal(summary.title, "Demo Research Chapter");
  assert.match(summary.summary, /^This introductory paragraph is deliberately long enough/);
  assert.equal(summary.minutes, Math.max(1, Math.ceil(summary.words / 220)));
  assert.deepEqual(summary.headings, ["Alpha section", "Alpha section"]);
});

test("search text excludes fenced code while retaining prose", () => {
  const summary = summarizeDocumentContent("12-demo-research.md", source);

  assert.match(summary.searchText, /literal searchable concept/);
  assert.doesNotMatch(summary.searchText, /hiddenfromsearch/);
  assert.doesNotMatch(summary.searchText, /fenced implementation detail/);
});

test("passages preserve source lines, duplicate heading anchors, and exclude code/tables", () => {
  const summary = summarizeDocumentContent("12-demo-research.md", source);

  assert.equal(summary.passages.length, 3);
  assert.deepEqual(
    summary.passages.map(({ heading, anchor, startLine, endLine }) => ({ heading, anchor, startLine, endLine })),
    [
      { heading: "Document overview", anchor: "", startLine: 3, endLine: 3 },
      { heading: "Alpha section", anchor: "alpha-section", startLine: 6, endLine: 7 },
      { heading: "Alpha section", anchor: "alpha-section-1", startLine: 14, endLine: 14 },
    ],
  );
  assert.ok(summary.passages.every((passage) => !passage.text.includes("hiddenFromSearch")));
  assert.ok(summary.passages.every((passage) => !passage.text.includes("hidden table row")));
});

test("passage IDs are deterministic for identical source content", () => {
  const first = summarizeDocumentContent("12-demo-research.md", source);
  const second = summarizeDocumentContent("12-demo-research.md", source);

  assert.deepEqual(first.passages.map((passage) => passage.id), second.passages.map((passage) => passage.id));
  assert.ok(first.passages.every((passage) => /^p-[0-9a-f]{12}(?:-\d+)?$/.test(passage.id)));
});
