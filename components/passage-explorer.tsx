"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import type { DocSummary } from "@/lib/content";
import { passageSourceUrl } from "@/lib/search-passages";
import { fields, type ResearchField } from "@/lib/taxonomy";

type PassageEntry = {
  chapter: DocSummary;
  passage: DocSummary["passages"][number];
};

export function PassageExplorer({ documents }: { documents: DocSummary[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<ResearchField | "All">("All");
  const [limit, setLimit] = useState(80);

  const entries = useMemo<PassageEntry[]>(() => documents.flatMap((chapter) =>
    chapter.passages.map((passage) => ({ chapter, passage }))), [documents]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries.filter(({ chapter, passage }) => {
      const fieldMatch = field === "All" || chapter.field === field;
      const queryMatch = !needle
        || chapter.title.toLowerCase().includes(needle)
        || passage.heading.toLowerCase().includes(needle)
        || passage.text.toLowerCase().includes(needle)
        || passage.id.toLowerCase().includes(needle);
      return fieldMatch && queryMatch;
    });
  }, [entries, field, query]);

  const visible = filtered.slice(0, limit);

  function updateQuery(value: string) {
    setQuery(value);
    setLimit(80);
  }

  function updateField(value: ResearchField | "All") {
    setField(value);
    setLimit(80);
  }

  return (
    <main className="passage-page shell">
      <header className="passage-hero">
        <span className="eyebrow"><Search size={13} /> Passage provenance</span>
        <h1>Inspect the source unit behind a search match.</h1>
        <p>
          Passages are deterministic lexical units derived from the Markdown corpus. Each record keeps its chapter section, source-line range, and stable content-derived ID so later claim citations can point to an inspectable source unit.
        </p>
        <EvidenceNav current="passages" />
      </header>

      <section className="passage-summary" aria-label="Passage index summary">
        <div><strong>{entries.length}</strong><span>indexed passages</span></div>
        <div><strong>{documents.length}</strong><span>source chapters</span></div>
        <div><strong>{filtered.length}</strong><span>current matches</span></div>
      </section>

      <section className="passage-controls" aria-label="Passage filters">
        <label>
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search exact concepts, section names, or passage IDs…"
          />
        </label>
        <select value={field} onChange={(event) => updateField(event.target.value as ResearchField | "All")} aria-label="Filter passages by field">
          <option value="All">All fields</option>
          {fields.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
      </section>

      <div className="passage-result-meta">
        <span>Showing {visible.length} of {filtered.length} matching passages</span>
        <span>Lexical index · source-backed · no semantic inference</span>
      </div>

      <section className="passage-list" aria-live="polite">
        {visible.map(({ chapter, passage }) => {
          const readHref = passage.anchor ? `/archive/${chapter.slug}#${passage.anchor}` : `/archive/${chapter.slug}`;
          return (
            <article key={`${chapter.slug}-${passage.id}`} className="passage-row" id={`${chapter.slug}-${passage.id}`}>
              <div className="passage-source-meta">
                <span>{chapter.number}</span>
                <span>{chapter.field}</span>
              </div>
              <div className="passage-main">
                <div className="passage-overline">{passage.heading}</div>
                <h2>{chapter.title}</h2>
                <p>{passage.text}</p>
                <div className="passage-identifiers">
                  <code>{passage.id}</code>
                  <span>Markdown lines {passage.startLine}{passage.endLine !== passage.startLine ? `–${passage.endLine}` : ""}</span>
                </div>
              </div>
              <div className="passage-actions">
                <Link href={readHref}>Read section <ArrowRight size={13} /></Link>
                <a href={passageSourceUrl(chapter.slug, passage)} target="_blank" rel="noreferrer">Source lines <ArrowUpRight size={13} /></a>
              </div>
            </article>
          );
        })}

        {!visible.length && (
          <div className="passage-empty">
            <Search size={20} />
            <strong>No matching passage.</strong>
            <span>Try a literal phrase, chapter concept, section heading, or a broader field.</span>
          </div>
        )}
      </section>

      {visible.length < filtered.length && (
        <div className="passage-more">
          <button onClick={() => setLimit((current) => current + 80)}>Show 80 more passages</button>
        </div>
      )}
    </main>
  );
}
