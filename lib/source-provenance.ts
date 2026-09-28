import type { AlgorithmEntity } from "@/lib/algorithms";
import { getDocument } from "@/lib/content";

export type AlgorithmSourceSection = {
  chapterSlug: string;
  chapterNumber: string;
  chapterTitle: string;
  heading: string;
  anchor: string;
  level: number;
  matchedBy: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9+*\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAlgorithmSourceSections(algorithm: AlgorithmEntity): AlgorithmSourceSection[] {
  const terms = [algorithm.name, ...algorithm.aliases]
    .map((term) => ({ raw: term, normalized: normalize(term) }))
    .filter((term, index, all) => term.normalized.length >= 3 && all.findIndex((candidate) => candidate.normalized === term.normalized) === index)
    .sort((a, b) => b.normalized.length - a.normalized.length);

  const results: AlgorithmSourceSection[] = [];

  for (const chapterSlug of algorithm.chapterSlugs) {
    const document = getDocument(chapterSlug);
    if (!document) continue;

    for (const item of document.toc) {
      const normalizedHeading = normalize(item.label);
      const match = terms.find((term) => normalizedHeading.includes(term.normalized));
      if (!match) continue;
      results.push({
        chapterSlug,
        chapterNumber: document.number,
        chapterTitle: document.title,
        heading: item.label,
        anchor: item.id,
        level: item.level,
        matchedBy: match.raw,
      });
    }
  }

  return results.filter((item, index, all) =>
    all.findIndex((candidate) => candidate.chapterSlug === item.chapterSlug && candidate.anchor === item.anchor) === index,
  );
}
