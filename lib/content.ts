import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { cleanInlineMarkdown, normalizeMathForRendering, tocFrom } from "./markdown-processing.ts";
import type { SearchPassage } from "./search-passages.ts";
import { fieldForSlug, type ResearchField } from "./taxonomy.ts";

const DOCS_DIR = path.join(process.cwd(), "docs");

export type DocSummary = {
  slug: string;
  title: string;
  summary: string;
  field: ResearchField;
  number: string;
  words: number;
  minutes: number;
  headings: string[];
  searchText: string;
  passages: SearchPassage[];
};

export type DocRecord = DocSummary & {
  content: string;
  body: string;
  toc: Array<{ id: string; label: string; level: number }>;
};

function titleFrom(content: string, slug: string) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return cleanInlineMarkdown(match[1]);
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function summaryFrom(content: string) {
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  const blocks = withoutCode.split(/\n\s*\n/);

  for (const block of blocks) {
    const candidate = block.trim();
    if (!candidate) continue;
    if (/^#{1,6}\s/.test(candidate)) continue;
    if (/^[>|*-]\s/.test(candidate)) continue;
    if (/^\|/.test(candidate)) continue;
    if (/^\d+\.\s/.test(candidate)) continue;
    const cleaned = cleanInlineMarkdown(candidate.replace(/\n/g, " "));
    if (cleaned.length > 70) {
      return cleaned.length > 220 ? `${cleaned.slice(0, 217)}…` : cleaned;
    }
  }

  return "A research chapter in the Foundation Algorithms Collection.";
}

function documentTitleLineOffset(content: string) {
  const match = content.match(/^#\s+.+\n+/);
  return match ? match[0].split("\n").length - 1 : 0;
}

function contentWithoutDocumentTitle(content: string) {
  return content.replace(/^#\s+.+\n+/, "");
}

function headingsFrom(content: string) {
  const body = contentWithoutDocumentTitle(content);
  return [...body.matchAll(/^(#|##)\s+(.+)$/gm)]
    .map((match) => cleanInlineMarkdown(match[2]))
    .slice(0, 8);
}

function plainPassageText(lines: string[]) {
  return cleanInlineMarkdown(
    lines
      .map((line) => line.replace(/^\s*(?:[-*+] |\d+\. |> )/, ""))
      .join(" ")
      .replace(/\\\(|\\\)|\\\[|\\\]/g, " ")
      .replace(/\s+/g, " "),
  );
}

function passagesFrom(content: string): SearchPassage[] {
  const body = contentWithoutDocumentTitle(content);
  const lineOffset = documentTitleLineOffset(content);
  const slugger = new GithubSlugger();
  const passages: SearchPassage[] = [];
  const passageIdCounts = new Map<string, number>();
  let heading = "Document overview";
  let anchor = "";
  let buffer: string[] = [];
  let bufferStartLine = 0;
  let bufferEndLine = 0;
  let inFence = false;

  const flush = () => {
    if (!buffer.length) return;
    const text = plainPassageText(buffer);
    buffer = [];
    if (text.length < 35) return;

    const digest = createHash("sha1").update(`${heading}\n${text}`).digest("hex").slice(0, 12);
    const occurrence = (passageIdCounts.get(digest) ?? 0) + 1;
    passageIdCounts.set(digest, occurrence);

    passages.push({
      id: occurrence === 1 ? `p-${digest}` : `p-${digest}-${occurrence}`,
      heading,
      anchor,
      text,
      startLine: bufferStartLine,
      endLine: bufferEndLine,
    });
  };

  for (const [index, line] of body.split("\n").entries()) {
    const sourceLine = lineOffset + index + 1;

    if (/^\s*(```|~~~)/.test(line)) {
      flush();
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const headingMatch = line.match(/^(#|##|###)\s+(.+)$/);
    if (headingMatch) {
      flush();
      heading = cleanInlineMarkdown(headingMatch[2]);
      anchor = slugger.slug(heading);
      continue;
    }

    if (!line.trim()) {
      flush();
      continue;
    }

    if (/^\s*\|/.test(line) || /^\s*[-:| ]{3,}\s*$/.test(line)) continue;
    if (!buffer.length) bufferStartLine = sourceLine;
    bufferEndLine = sourceLine;
    buffer.push(line);
  }
  flush();

  return passages.slice(0, 100);
}

export function summarizeDocumentContent(filename: string, content: string): DocSummary {
  const slug = filename.replace(/\.md$/, "");
  const words = content.split(/\s+/).filter(Boolean).length;
  const title = titleFrom(content, slug);
  const headings = headingsFrom(content);
  const passages = passagesFrom(content);
  const numberMatch = slug.match(/^(\d+)/);
  const searchText = cleanInlineMarkdown(
    content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>|{}\[\]()]/g, " ")
      .replace(/\s+/g, " "),
  ).toLowerCase();

  return {
    slug,
    title,
    summary: summaryFrom(content),
    field: fieldForSlug(slug),
    number: numberMatch?.[1] ?? "--",
    words,
    minutes: Math.max(1, Math.ceil(words / 220)),
    headings,
    searchText,
    passages,
  };
}

export function getAllDocuments(): DocSummary[] {
  if (!fs.existsSync(DOCS_DIR)) return [];

  return fs
    .readdirSync(DOCS_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((filename) => {
      const content = fs.readFileSync(path.join(DOCS_DIR, filename), "utf8");
      return summarizeDocumentContent(filename, content);
    });
}

export function getDocument(slug: string): DocRecord | null {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, "");
  const file = path.join(DOCS_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(file)) return null;

  const content = fs.readFileSync(file, "utf8");
  const summary = summarizeDocumentContent(`${safeSlug}.md`, content);
  const rawBody = contentWithoutDocumentTitle(content);

  return {
    ...summary,
    content,
    body: normalizeMathForRendering(rawBody),
    toc: tocFrom(rawBody),
  };
}
