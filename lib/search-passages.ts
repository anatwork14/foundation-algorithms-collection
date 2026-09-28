export type SearchPassage = {
  id: string;
  heading: string;
  anchor: string;
  text: string;
  startLine: number;
  endLine: number;
};

export type PassageMatch = SearchPassage & {
  snippet: string;
  score: number;
  occurrences: number;
};

function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function snippetAround(text: string, query: string) {
  const lower = text.toLowerCase();
  const index = lower.indexOf(query);
  if (index < 0 || text.length <= 280) return text;

  const start = Math.max(0, index - 90);
  const end = Math.min(text.length, index + query.length + 170);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

function countLiteralOccurrences(text: string, needle: string) {
  let count = 0;
  let index = 0;
  while (index < text.length) {
    const found = text.indexOf(needle, index);
    if (found < 0) break;
    count += 1;
    index = found + Math.max(needle.length, 1);
  }
  return count;
}

function lexicalScore(passage: SearchPassage, needle: string) {
  const text = passage.text.toLowerCase();
  const heading = passage.heading.toLowerCase();
  const firstIndex = text.indexOf(needle);
  if (firstIndex < 0) return null;

  const occurrences = countLiteralOccurrences(text, needle);
  const headingScore = heading === needle ? 100 : heading.includes(needle) ? 50 : 0;
  const occurrenceScore = Math.min(30, occurrences * 10);
  const positionScore = Math.max(0, 20 - Math.floor(firstIndex / 20));

  return {
    score: headingScore + occurrenceScore + positionScore,
    occurrences,
  };
}

/**
 * Ranks inspectable literal passage matches without semantic inference.
 * Ranking uses only heading overlap, literal frequency, phrase position, and
 * deterministic source order for ties.
 */
export function findPassageMatches(passages: SearchPassage[], query: string, limit = Number.POSITIVE_INFINITY): PassageMatch[] {
  const needle = normalizeQuery(query);
  if (!needle || limit <= 0) return [];

  return passages
    .map((passage, sourceIndex) => {
      const ranked = lexicalScore(passage, needle);
      if (!ranked) return null;
      return {
        ...passage,
        snippet: snippetAround(passage.text, needle),
        score: ranked.score,
        occurrences: ranked.occurrences,
        sourceIndex,
      };
    })
    .filter((match): match is PassageMatch & { sourceIndex: number } => Boolean(match))
    .sort((a, b) => b.score - a.score || a.sourceIndex - b.sourceIndex || a.id.localeCompare(b.id))
    .slice(0, limit)
    .map(({ sourceIndex: _sourceIndex, ...match }) => match);
}

export function findPassageMatch(passages: SearchPassage[], query: string): PassageMatch | null {
  return findPassageMatches(passages, query, 1)[0] ?? null;
}

export function passageSearchText(passages: SearchPassage[]) {
  return passages.map((passage) => passage.text.toLowerCase()).join(" ");
}

export function passageSourceUrl(chapterSlug: string, passage: Pick<SearchPassage, "startLine" | "endLine">) {
  const lines = passage.startLine === passage.endLine
    ? `#L${passage.startLine}`
    : `#L${passage.startLine}-L${passage.endLine}`;
  return `https://github.com/anatwork14/foundation-algorithms-collection/blob/main/docs/${chapterSlug}.md${lines}`;
}
