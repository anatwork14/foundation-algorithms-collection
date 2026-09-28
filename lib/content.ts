import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { SearchPassage } from "@/lib/search-passages";
import { fieldForSlug, type ResearchField } from "@/lib/taxonomy";

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

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

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

function contentWithoutDocumentTitle(content: string) {
  return content.replace(/^#\s+.+\n+/, "");
}

function headingsFrom(content: string) {
  const body = contentWithoutDocumentTitle(content);
  return [...body.matchAll(/^(#|##)\s+(.+)$/gm)]
    .map((match) => cleanInlineMarkdown(match[2]))
    .slice(0, 8);
}

function tocFrom(content: string) {
  const slugger = new GithubSlugger();
  return [...content.matchAll(/^(#|##|###)\s+(.+)$/gm)].map((match) => {
    const label = cleanInlineMarkdown(match[2]);
    return {
      id: slugger.slug(label),
      label,
      level: match[1].length,
    };
  });
}

function plainPassageText(lines: string[]) {
  return cleanInlineMarkdown(
    lines
      .join(" ")
      .replace(/^\s*(?:[-*+] |\d+\. |> )/gm, "")
      .replace(/\\\(|\\\)|\\\[|\\\]/g, " ")
      .replace(/\s+/g, " "),
  );
}

function passagesFrom(content: string): SearchPassage[] {
  const body = contentWithoutDocumentTitle(content);
  const slugger = new GithubSlugger();
  const passages: SearchPassage[] = [];
  let heading = "Document overview";
  let anchor = "";
  let buffer: string[] = [];
  let inFence = false;

  const flush = () => {
    if (!buffer.length) return;
    const text = plainPassageText(buffer);
    buffer = [];
    if (text.length < 35) return;
    passages.push({
      heading,
      anchor,
      text,
      searchText: text.toLowerCase(),
    });
  };

  for (const line of body.split("\n")) {
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
    buffer.push(line);
  }
  flush();

  return passages.slice(0, 100);
}

/**
 * The corpus intentionally stores familiar LaTeX delimiters (\(...\) and
 * \[...\]). remark-math expects dollar delimiters, so normalize only the
 * rendered copy and leave fenced code blocks untouched. The Markdown source
 * on GitHub therefore remains canonical and human-friendly.
 */
function normalizeMathForRendering(markdown: string) {
  return markdown
    .split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g)
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return part
        .replace(/\\\[/g, () => "$$")
        .replace(/\\\]/g, () => "$$")
        .replace(/\\\(/g, () => "$")
        .replace(/\\\)/g, () => "$");
    })
    .join("");
}

function toSummary(filename: string, content: string): DocSummary {
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
      return toSummary(filename, content);
    });
}

export function getDocument(slug: string): DocRecord | null {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, "");
  const file = path.join(DOCS_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(file)) return null;

  const content = fs.readFileSync(file, "utf8");
  const summary = toSummary(`${safeSlug}.md`, content);
  const rawBody = contentWithoutDocumentTitle(content);

  return {
    ...summary,
    content,
    body: normalizeMathForRendering(rawBody),
    toc: tocFrom(rawBody),
  };
}
