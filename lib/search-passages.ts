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

/**
 * Finds the first inspectable lexical passage match. Semantic retrieval can be
 * layered on later without replacing this deterministic source-backed path.
 */
export function findPassageMatch(passages: SearchPassage[], query: string): PassageMatch | null {
  const needle = normalizeQuery(query);
  if (!needle) return null;

  const exact = passages.find((passage) => passage.text.toLowerCase().includes(needle));
  if (!exact) return null;

  return {
    ...exact,
    snippet: snippetAround(exact.text, needle),
  };
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
