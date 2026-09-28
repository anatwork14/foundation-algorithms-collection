export function SearchSnippet({ heading, text, query }: { heading: string; text: string; query: string }) {
  const needle = query.trim().replace(/\s+/g, " ");
  if (!needle || !text) return null;

  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));

  return (
    <div className="search-passage-snippet">
      <span>Match in {heading}</span>
      <p>
        {parts.map((part, index) => part.toLowerCase() === needle.toLowerCase()
          ? <mark key={`${part}-${index}`}>{part}</mark>
          : part)}
      </p>
    </div>
  );
}
