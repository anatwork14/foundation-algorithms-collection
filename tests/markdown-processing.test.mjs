import test from "node:test";
import assert from "node:assert/strict";
import { cleanInlineMarkdown, normalizeMathForRendering, tocFrom } from "../lib/markdown-processing.ts";

test("TOC slugs follow GitHub duplicate-heading behavior", () => {
  const toc = tocFrom("## LinUCB\n### Details\n## LinUCB\n## **HNSW**\n");
  assert.deepEqual(toc, [
    { id: "linucb", label: "LinUCB", level: 2 },
    { id: "details", label: "Details", level: 3 },
    { id: "linucb-1", label: "LinUCB", level: 2 },
    { id: "hnsw", label: "HNSW", level: 2 },
  ]);
});

test("inline Markdown formatting is removed before heading/prose indexing", () => {
  assert.equal(cleanInlineMarkdown("**Bold** [link](https://example.org) `code`"), "Bold link code");
});

test("math delimiters normalize in prose but stay literal inside fenced code", () => {
  const markdown = [
    "Inline \\(x+y\\).",
    "",
    "Display:",
    "\\[x^2\\]",
    "",
    "```python",
    "value = r\"\\(literal\\)\"",
    "```",
    "",
    "~~~text",
    "\\[also literal\\]",
    "~~~",
  ].join("\n");

  const rendered = normalizeMathForRendering(markdown);
  assert.match(rendered, /Inline \$x\+y\$\./);
  assert.match(rendered, /\$\$x\^2\$\$/);
  assert.ok(rendered.includes('value = r"\\(literal\\)"'));
  assert.ok(rendered.includes("\\[also literal\\]"));
});
