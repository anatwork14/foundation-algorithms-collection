"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Network, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import type { ReferenceEntity, ReferenceEvidenceRole, ReferenceKind } from "@/lib/references";
import { referenceSearchText } from "@/lib/references";

const kinds: Array<ReferenceKind | "All"> = ["All", "Paper", "Standard", "Book"];
const roles: Array<ReferenceEvidenceRole | "All"> = [
  "All",
  "Primary method",
  "Primary extension",
  "Normative standard",
  "Survey / synthesis",
  "Replication / evaluation",
];

export function ReferenceExplorer({ references }: { references: ReferenceEntity[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ReferenceKind | "All">("All");
  const [role, setRole] = useState<ReferenceEvidenceRole | "All">("All");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return references
      .filter((reference) => (
        (kind === "All" || reference.kind === kind)
        && (role === "All" || reference.evidenceRole === role)
        && (!needle || referenceSearchText(reference).includes(needle))
      ))
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }, [kind, query, references, role]);

  return (
    <main className="reference-page shell">
      <header className="reference-hero">
        <span className="eyebrow"><span className="live-dot" /> Evidence layer</span>
        <h1>Primary sources should be as navigable as algorithms.</h1>
        <p>Papers, standards, and books become first-class records linked back to the mechanisms and research hypotheses they support.</p>
        <EvidenceNav current="references" />
        <Link href="/references/graph" className="reference-graph-link"><Network size={14} /> Explore citation graph <ArrowRight size={13} /></Link>
      </header>

      <section className="reference-controls" aria-label="Reference filters">
        <label>
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search papers, authors, standards, algorithms…" />
        </label>
        <select value={kind} onChange={(event) => setKind(event.target.value as ReferenceKind | "All")} aria-label="Filter references by type">
          {kinds.map((item) => <option key={item} value={item}>{item === "All" ? "All reference types" : item}</option>)}
        </select>
        <select value={role} onChange={(event) => setRole(event.target.value as ReferenceEvidenceRole | "All")} aria-label="Filter references by evidence role">
          {roles.map((item) => <option key={item} value={item}>{item === "All" ? "All evidence roles" : item}</option>)}
        </select>
      </section>

      <div className="reference-result-count">{results.length} references</div>

      <section className="reference-list" aria-live="polite">
        {results.map((reference) => (
          <article key={reference.id} className="reference-row">
            <div className="reference-year">{reference.year}</div>
            <div className="reference-main">
              <div className="reference-overline">{reference.evidenceRole} · {reference.kind}{reference.venue ? ` · ${reference.venue}` : ""}</div>
              <h2><Link href={`/references/${reference.id}`}>{reference.title}</Link></h2>
              <p className="reference-authors">{reference.authors.join(", ")}</p>
              <p>{reference.summary}</p>
              <div className="reference-tags">{reference.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="reference-actions">
              <Link href={`/references/${reference.id}`}>Evidence record <ArrowRight size={13} /></Link>
              <a href={reference.url} target="_blank" rel="noreferrer">Primary source <ArrowUpRight size={13} /></a>
              <span>{reference.algorithmIds.length} algorithms · {reference.combinationIds.length} Lab records · {reference.citesReferenceIds.length} curated citations</span>
            </div>
          </article>
        ))}
        {!results.length && (
          <div className="reference-empty">
            <Search size={20} />
            <strong>No matching reference.</strong>
            <span>Try an author, algorithm, standard, evidence role, venue, or broader keyword.</span>
          </div>
        )}
      </section>
    </main>
  );
}
