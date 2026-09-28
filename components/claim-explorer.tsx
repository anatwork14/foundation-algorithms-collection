"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Search, ShieldCheck } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import type { ClaimKind } from "@/lib/claims";

export type ClaimExplorerEntry = {
  id: string;
  kind: ClaimKind;
  statement: string;
  note: string;
  algorithms: Array<{ id: string; name: string }>;
  references: Array<{ id: string; title: string; year: number; role: string }>;
  chapter: { slug: string; number: string; title: string };
  passage: {
    id: string;
    heading: string;
    anchor: string;
    text: string;
    startLine: number;
    endLine: number;
    sourceUrl: string;
  };
};

const kinds: Array<ClaimKind | "All"> = ["All", "Mechanism", "Assumption", "Guarantee", "Standard", "Empirical"];

export function ClaimExplorer({ entries }: { entries: ClaimExplorerEntry[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ClaimKind | "All">("All");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const kindMatch = kind === "All" || entry.kind === kind;
      const text = [
        entry.statement,
        entry.note,
        entry.passage.heading,
        entry.passage.text,
        entry.chapter.title,
        ...entry.algorithms.map((item) => item.name),
        ...entry.references.map((item) => item.title),
      ].join(" ").toLowerCase();
      return kindMatch && (!needle || text.includes(needle));
    });
  }, [entries, kind, query]);

  return (
    <main className="claim-page shell">
      <header className="claim-hero">
        <span className="eyebrow"><ShieldCheck size={13} /> Curated claims</span>
        <h1>Make the support path explicit.</h1>
        <p>
          A Claim record connects one precise archive statement to a unique Markdown passage and one or more curated primary or normative references. These links are reviewed assertions—not automatically generated conclusions.
        </p>
        <EvidenceNav current="claims" />
      </header>

      <section className="claim-controls" aria-label="Claim filters">
        <label>
          <Search size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search claims, algorithms, passages, references…" />
        </label>
        <select value={kind} onChange={(event) => setKind(event.target.value as ClaimKind | "All")} aria-label="Filter claims by kind">
          {kinds.map((item) => <option key={item} value={item}>{item === "All" ? "All claim types" : item}</option>)}
        </select>
      </section>

      <div className="claim-result-meta">{results.length} curated claims · every record must resolve to exactly one source passage</div>

      <section className="claim-list" aria-live="polite">
        {results.map((entry) => (
          <article key={entry.id} className="claim-record" id={entry.id}>
            <header>
              <div>
                <span className="claim-kind">{entry.kind}</span>
                <h2>{entry.statement}</h2>
              </div>
              <code>{entry.id}</code>
            </header>

            <p className="claim-note">{entry.note}</p>

            <div className="claim-provenance-grid">
              <section>
                <span>Algorithms</span>
                {entry.algorithms.map((algorithm) => (
                  <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`}>{algorithm.name} <ArrowRight size={12} /></Link>
                ))}
              </section>
              <section>
                <span>Primary / normative evidence</span>
                {entry.references.map((reference) => (
                  <Link key={reference.id} href={`/references/${reference.id}`}>
                    {reference.year} · {reference.title} <ArrowRight size={12} />
                  </Link>
                ))}
              </section>
            </div>

            <section className="claim-passage">
              <div className="claim-passage-meta">
                <span>{entry.chapter.number} · {entry.passage.heading}</span>
                <code>{entry.passage.id}</code>
                <span>lines {entry.passage.startLine}{entry.passage.endLine !== entry.passage.startLine ? `–${entry.passage.endLine}` : ""}</span>
              </div>
              <p>{entry.passage.text}</p>
              <div className="claim-passage-actions">
                <Link href={`/archive/${entry.chapter.slug}${entry.passage.anchor ? `#${entry.passage.anchor}` : ""}`}>Read in chapter <ArrowRight size={13} /></Link>
                <a href={entry.passage.sourceUrl} target="_blank" rel="noreferrer">Open source lines <ArrowUpRight size={13} /></a>
              </div>
            </section>
          </article>
        ))}

        {!results.length && (
          <div className="claim-empty">
            <Search size={20} />
            <strong>No matching curated claim.</strong>
            <span>Try a mechanism, standard, algorithm, source, or broader phrase.</span>
          </div>
        )}
      </section>
    </main>
  );
}
