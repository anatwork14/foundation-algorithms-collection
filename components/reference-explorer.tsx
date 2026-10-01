"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Network, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import type { ReferenceEntity, ReferenceEvidenceRole, ReferenceKind, ReferenceNoticeKind } from "@/lib/references";
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
const noticeKinds: Array<ReferenceNoticeKind | "All" | "Any"> = [
  "All",
  "Any",
  "Version",
  "Errata",
  "Correction",
  "Superseded",
  "Withdrawn",
  "Retraction",
];

export function ReferenceExplorer({ references }: { references: ReferenceEntity[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ReferenceKind | "All">("All");
  const [role, setRole] = useState<ReferenceEvidenceRole | "All">("All");
  const [noticeKind, setNoticeKind] = useState<ReferenceNoticeKind | "All" | "Any">("All");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return references
      .filter((reference) => {
        const noticeMatch = noticeKind === "All"
          || (noticeKind === "Any" ? reference.notices.length > 0 : reference.notices.some((notice) => notice.kind === noticeKind));
        return (
          (kind === "All" || reference.kind === kind)
          && (role === "All" || reference.evidenceRole === role)
          && noticeMatch
          && (!needle || referenceSearchText(reference).includes(needle))
        );
      })
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }, [kind, noticeKind, query, references, role]);

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
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search papers, authors, standards, algorithms, errata…" />
        </label>
        <div className="reference-filter-selects">
          <select value={kind} onChange={(event) => setKind(event.target.value as ReferenceKind | "All")} aria-label="Filter references by type">
            {kinds.map((item) => <option key={item} value={item}>{item === "All" ? "All reference types" : item}</option>)}
          </select>
          <select value={role} onChange={(event) => setRole(event.target.value as ReferenceEvidenceRole | "All")} aria-label="Filter references by evidence role">
            {roles.map((item) => <option key={item} value={item}>{item === "All" ? "All evidence roles" : item}</option>)}
          </select>
          <select value={noticeKind} onChange={(event) => setNoticeKind(event.target.value as ReferenceNoticeKind | "All" | "Any")} aria-label="Filter references by source notice">
            {noticeKinds.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All source notices" : item === "Any" ? "Has source notice" : item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className="reference-result-count">{results.length} {results.length === 1 ? "reference" : "references"}</div>

      <section className="reference-list" aria-live="polite">
        {results.map((reference) => (
          <article key={reference.id} className="reference-row">
            <div className="reference-year">{reference.year}</div>
            <div className="reference-main">
              <div className="reference-overline">
                {reference.evidenceRole} · {reference.kind}{reference.venue ? ` · ${reference.venue}` : ""}
                {reference.notices.length > 0 ? ` · ${reference.notices.length} source notice${reference.notices.length === 1 ? "" : "s"}` : ""}
              </div>
              <h2><Link href={`/references/${reference.id}`}>{reference.title}</Link></h2>
              <p className="reference-authors">{reference.authors.join(", ")}</p>
              <p>{reference.summary}</p>
              {reference.notices.length > 0 && (
                <div className="reference-tags reference-notice-row" aria-label="Source notices">
                  {reference.notices.map((notice) => <span key={`${notice.kind}-${notice.verifiedAt}`}>{notice.kind}</span>)}
                </div>
              )}
              <div className="reference-tags">{reference.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="reference-actions">
              <Link href={`/references/${reference.id}`}>Evidence record <ArrowRight size={13} /></Link>
              <a href={reference.url} target="_blank" rel="noreferrer">Primary source <ArrowUpRight size={13} /></a>
              <span>{reference.algorithmIds.length} algorithms · {reference.combinationIds.length} Lab records · {reference.citations.length} verified citations</span>
            </div>
          </article>
        ))}
        {!results.length && (
          <div className="reference-empty">
            <Search size={20} />
            <strong>No matching reference.</strong>
            <span>Try an author, algorithm, standard, evidence role, notice type, or broader keyword.</span>
          </div>
        )}
      </section>
    </main>
  );
}
