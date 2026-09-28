"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Filter, Search, SlidersHorizontal } from "lucide-react";
import type { DocSummary } from "@/lib/content";
import { fieldKey, fields, type ResearchField } from "@/lib/taxonomy";

type SortMode = "number" | "title" | "length";

export function ArchiveExplorer({ documents }: { documents: DocSummary[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<ResearchField | "All">("All");
  const [sort, setSort] = useState<SortMode>("number");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = documents.filter((doc) => {
      const fieldMatch = field === "All" || doc.field === field;
      const queryMatch =
        !needle ||
        doc.title.toLowerCase().includes(needle) ||
        doc.summary.toLowerCase().includes(needle) ||
        doc.searchText.includes(needle);
      return fieldMatch && queryMatch;
    });

    return [...next].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "length") return b.words - a.words;
      return a.number.localeCompare(b.number, undefined, { numeric: true });
    });
  }, [documents, field, query, sort]);

  return (
    <main className="archive-page shell">
      <section className="archive-hero">
        <div>
          <span className="eyebrow"><span className="live-dot" /> Research archive</span>
          <h1>Every chapter, one searchable map.</h1>
          <p>Browse the collection as a library. Search across chapter text, narrow by research field, then follow related concepts from each detail page.</p>
        </div>
        <div className="archive-summary-card">
          <span>Collection state</span>
          <strong>{documents.length}</strong>
          <p>long-form research chapters stored in Markdown and rendered directly by the site.</p>
        </div>
      </section>

      <section className="archive-toolbar" aria-label="Archive controls">
        <label className="archive-search">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the full archive…" />
        </label>
        <label className="select-control">
          <Filter size={16} />
          <select value={field} onChange={(event) => setField(event.target.value as ResearchField | "All")}>
            <option value="All">All fields</option>
            {fields.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <label className="select-control">
          <SlidersHorizontal size={16} />
          <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
            <option value="number">Collection order</option>
            <option value="title">Title A–Z</option>
            <option value="length">Longest first</option>
          </select>
        </label>
      </section>

      <div className="archive-result-meta">
        <span>{results.length} chapters</span>
        {(query || field !== "All") && <button onClick={() => { setQuery(""); setField("All"); }}>Clear filters</button>}
      </div>

      <section className="archive-list" aria-live="polite">
        {results.map((doc) => (
          <Link key={doc.slug} href={`/archive/${doc.slug}`} className="archive-row">
            <div className={`archive-row-index field-${fieldKey(doc.field)}`}>{doc.number}</div>
            <div className="archive-row-main">
              <div className="archive-row-label">{doc.field}</div>
              <h2>{doc.title}</h2>
              <p>{doc.summary}</p>
              <div className="archive-row-headings">
                {doc.headings.slice(0, 3).map((heading) => <span key={heading}>{heading}</span>)}
              </div>
            </div>
            <div className="archive-row-meta">
              <span>{doc.minutes} min</span>
              <span>{doc.words.toLocaleString()} words</span>
              <ArrowUpRight size={18} />
            </div>
          </Link>
        ))}
        {!results.length && (
          <div className="empty-state archive-empty">
            <Search size={24} />
            <h3>No matching research chapter.</h3>
            <p>Search for a broader mechanism, algorithm family, or field.</p>
          </div>
        )}
      </section>
    </main>
  );
}
