export function SearchSnippet({
  heading,
  text,
  query,
  startLine,
  endLine,
}: {
  heading: string;
  text: string;
  query: string;
  startLine?: number;
  endLine?: number;
}) {
  const needle = query.trim().replace(/\s+/g, " ");
  if (!needle || !text) return null;

  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  const lineLabel = startLine
    ? ` · source ${startLine}${endLine && endLine !== startLine ? `–${endLine}` : ""}`
    : "";

  return (
    <div className="search-passage-snippet">
      <span>Match in {heading}{lineLabel}</span>
      <p>
        {parts.map((part, index) => part.toLowerCase() === needle.toLowerCase()
          ? <mark key={`${part}-${index}`}>{part}</mark>
          : part)}
      </p>
    </div>
  );
}
