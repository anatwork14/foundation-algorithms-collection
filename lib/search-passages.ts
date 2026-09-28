export type SearchPassage = {
  heading: string;
  anchor: string;
  text: string;
  searchText: string;
};

export type PassageMatch = {
  heading: string;
  anchor: string;
  text: string;
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
 * Finds the most useful indexed passage for a literal query. This intentionally
 * stays lexical and inspectable; semantic retrieval can be layered on later.
 */
export function findPassageMatch(passages: SearchPassage[], query: string): PassageMatch | null {
  const needle = normalizeQuery(query);
  if (!needle) return null;

  const exact = passages.find((passage) => passage.searchText.includes(needle));
  if (!exact) return null;

  return {
    heading: exact.heading,
    anchor: exact.anchor,
    text: snippetAround(exact.text, needle),
  };
}

export function passageSearchText(passages: SearchPassage[]) {
  return passages.map((passage) => passage.searchText).join(" ");
}
