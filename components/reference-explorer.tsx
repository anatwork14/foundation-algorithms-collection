"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { ReferenceEntity, ReferenceKind } from "@/lib/references";
import { referenceSearchText } from "@/lib/references";

const kinds: Array<ReferenceKind | "All"> = ["All", "Paper", "Standard", "Book"];

export function ReferenceExplorer({ references }: { references: ReferenceEntity[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ReferenceKind | "All">("All");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return references
      .filter((reference) => (kind === "All" || reference.kind === kind) && (!needle || referenceSearchText(reference).includes(needle)))
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }, [kind, query, references]);

  return (
    <main className="reference-page shell">
      <header className="reference-hero">
        <span className="eyebrow"><span className="live-dot" /> Evidence layer</span>
        <h1>Primary sources should be as navigable as algorithms.</h1>
        <p>Papers, standards, and books become first-class records linked back to the mechanisms and research hypotheses they support.</p>
      </header>

      <section className="reference-controls" aria-label="Reference filters">
        <label>
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search papers, authors, standards, algorithms…" />
        </label>
        <select value={kind} onChange={(event) => setKind(event.target.value as ReferenceKind | "All")} aria-label="Filter references by type">
          {kinds.map((item) => <option key={item} value={item}>{item === "All" ? "All reference types" : item}</option>)}
        </select>
      </section>

      <div className="reference-result-count">{results.length} references</div>

      <section className="reference-list" aria-live="polite">
        {results.map((reference) => (
          <article key={reference.id} className="reference-row">
            <div className="reference-year">{reference.year}</div>
            <div className="reference-main">
              <div className="reference-overline">{reference.kind}{reference.venue ? ` · ${reference.venue}` : ""}</div>
              <h2>{reference.title}</h2>
              <p className="reference-authors">{reference.authors.join(", ")}</p>
              <p>{reference.summary}</p>
              <div className="reference-tags">{reference.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="reference-actions">
              <a href={reference.url} target="_blank" rel="noreferrer">Primary source <ArrowUpRight size={13} /></a>
              {reference.algorithmIds.slice(0, 3).map((id) => <Link key={id} href={`/algorithms/${id}`}>Algorithm · {id}</Link>)}
              {reference.combinationIds.slice(0, 2).map((id) => <Link key={id} href={`/lab#${id}`}>Lab · {id}</Link>)}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
