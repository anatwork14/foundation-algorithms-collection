import fs from "node:fs";
import path from "node:path";
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
};

export type DocRecord = DocSummary & {
  content: string;
  body: string;
  toc: Array<{ id: string; label: string; level: number }>;
};

function cleanInlineMarkdown(value: string) {
  return value
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

export function slugifyHeading(input: string) {
  return cleanInlineMarkdown(input)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function headingsFrom(content: string) {
  return [...content.matchAll(/^##\s+(.+)$/gm)]
    .map((match) => cleanInlineMarkdown(match[1]))
    .slice(0, 8);
}

function tocFrom(content: string) {
  return [...content.matchAll(/^(##|###)\s+(.+)$/gm)].map((match) => ({
    id: slugifyHeading(match[2]),
    label: cleanInlineMarkdown(match[2]),
    level: match[1].length,
  }));
}

function toSummary(filename: string, content: string): DocSummary {
  const slug = filename.replace(/\.md$/, "");
  const words = content.split(/\s+/).filter(Boolean).length;
  const title = titleFrom(content, slug);
  const headings = headingsFrom(content);
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
  const body = content.replace(/^#\s+.+\n+/, "");

  return {
    ...summary,
    content,
    body,
    toc: tocFrom(body),
  };
}
