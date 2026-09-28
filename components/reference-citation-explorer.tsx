"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search, ScrollText } from "lucide-react";
import type { ReferenceEntity } from "@/lib/references";
import { formatReferenceAuthors, referenceSearchText } from "@/lib/references";

export function ReferenceCitationExplorer({ references }: { references: ReferenceEntity[] }) {
  const [query, setQuery] = useState("");
  const [focusId, setFocusId] = useState(references[0]?.id ?? "");

  const byId = useMemo(() => new Map(references.map((reference) => [reference.id, reference])), [references]);
  const focus = byId.get(focusId) ?? references[0] ?? null;

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return references;
    return references.filter((reference) => referenceSearchText(reference).includes(needle));
  }, [query, references]);

  const outgoing = useMemo(() => {
    if (!focus) return [];
    return focus.citesReferenceIds
      .map((id) => byId.get(id))
      .filter((item): item is ReferenceEntity => Boolean(item));
  }, [byId, focus]);

  const incoming = useMemo(() => {
    if (!focus) return [];
    return references.filter((reference) => reference.citesReferenceIds.includes(focus.id));
  }, [focus, references]);

  const edges = useMemo(() => references.flatMap((source) => source.citesReferenceIds
    .map((targetId) => {
      const target = byId.get(targetId);
      return target ? { source, target } : null;
    })
    .filter((item): item is { source: ReferenceEntity; target: ReferenceEntity } => Boolean(item))), [byId, references]);

  if (!focus) {
    return <main className="citation-page shell"><p>No references are available yet.</p></main>;
  }

  return (
    <main className="citation-page shell">
      <header className="citation-hero">
        <span className="eyebrow"><ScrollText size={13} /> Citation graph</span>
        <h1>Follow how curated sources build on one another.</h1>
        <p>Only explicit citation edges that have been verified are shown. Missing edges mean “not curated yet,” not “no relationship.”</p>
        <Link href="/references" className="citation-back-link"><ArrowLeft size={13} /> Reference index</Link>
      </header>

      <div className="citation-layout">
        <aside className="citation-picker">
          <label>
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a source…" />
          </label>
          <div className="citation-picker-list">
            {matches.map((reference) => (
              <button key={reference.id} className={reference.id === focus.id ? "is-active" : ""} onClick={() => setFocusId(reference.id)}>
                <span>{reference.year}</span>
                <strong>{reference.title}</strong>
                <small>{reference.evidenceRole}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="citation-neighborhood" aria-live="polite">
          <div className="citation-column">
            <div className="citation-column-title">Cited by this source</div>
            {outgoing.length ? outgoing.map((reference) => (
              <button key={reference.id} className="citation-neighbor" onClick={() => setFocusId(reference.id)}>
                <span>{reference.year}</span>
                <strong>{reference.title}</strong>
                <small>{reference.evidenceRole}</small>
                <ArrowLeft size={13} />
              </button>
            )) : <div className="citation-empty">No curated outgoing citation edge.</div>}
          </div>

          <article className="citation-focus-card">
            <span className="reference-detail-kind">{focus.evidenceRole}</span>
            <h2>{focus.title}</h2>
            <p className="citation-authors">{formatReferenceAuthors(focus, 6)} · {focus.year}</p>
            <p>{focus.summary}</p>
            <div className="citation-focus-stats">
              <span>{outgoing.length} curated citations</span>
              <span>{incoming.length} curated citing sources</span>
            </div>
            <Link href={`/references/${focus.id}`}>Open evidence record <ArrowRight size={13} /></Link>
          </article>

          <div className="citation-column">
            <div className="citation-column-title">Sources citing this source</div>
            {incoming.length ? incoming.map((reference) => (
              <button key={reference.id} className="citation-neighbor" onClick={() => setFocusId(reference.id)}>
                <span>{reference.year}</span>
                <strong>{reference.title}</strong>
                <small>{reference.evidenceRole}</small>
                <ArrowRight size={13} />
              </button>
            )) : <div className="citation-empty">No curated incoming citation edge.</div>}
          </div>
        </section>
      </div>

      <section className="citation-edge-table">
        <div className="section-heading">
          <div><span className="section-kicker">Curated edges</span><h2>{edges.length} verified citation relationships</h2></div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Source</th><th>Year</th><th>Cites</th><th>Year</th></tr></thead>
            <tbody>
              {edges.map(({ source, target }) => (
                <tr key={`${source.id}-${target.id}`}>
                  <td><button onClick={() => setFocusId(source.id)}>{source.title}</button></td>
                  <td>{source.year}</td>
                  <td><button onClick={() => setFocusId(target.id)}>{target.title}</button></td>
                  <td>{target.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
