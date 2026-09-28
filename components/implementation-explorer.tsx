"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Code2, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import type { ImplementationMaturity, ImplementationRecord } from "@/lib/implementations";
import { implementationSearchText } from "@/lib/implementations";

const maturityOptions: Array<ImplementationMaturity | "All"> = [
  "All",
  "Production-proven",
  "Established open-source",
  "Research/prototyping",
];

export function ImplementationExplorer({ records }: { records: ImplementationRecord[] }) {
  const [query, setQuery] = useState("");
  const [maturity, setMaturity] = useState<ImplementationMaturity | "All">("All");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return records.filter((record) => {
      const maturityMatch = maturity === "All" || record.maturity === maturity;
      const queryMatch = !needle || implementationSearchText(record).includes(needle);
      return maturityMatch && queryMatch;
    });
  }, [maturity, query, records]);

  return (
    <main className="implementation-page shell">
      <header className="implementation-hero">
        <span className="eyebrow"><Code2 size={13} /> Implementation registry</span>
        <h1>Move from theory to inspectable code.</h1>
        <p>Curated repositories connect algorithm entities to maintained implementations, source paths, interfaces, license metadata, and verification dates.</p>
        <EvidenceNav current="implementations" />
      </header>

      <section className="implementation-controls" aria-label="Implementation filters">
        <label>
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search HNSW, Qiskit, ML-KEM, C++, Python…" />
        </label>
        <select value={maturity} onChange={(event) => setMaturity(event.target.value as ImplementationMaturity | "All")} aria-label="Filter implementations by maturity">
          {maturityOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All maturity levels" : item}</option>)}
        </select>
      </section>

      <div className="implementation-result-count">{results.length} implementation records</div>

      <section className="implementation-list" aria-live="polite">
        {results.map((record) => (
          <Link key={record.id} href={`/implementations/${record.id}`} className="implementation-row">
            <div className="implementation-language">{record.language}</div>
            <div>
              <div className="implementation-overline">{record.maturity} · {record.license}</div>
              <h2>{record.name}</h2>
              <p>{record.summary}</p>
              <div className="implementation-tags">
                {record.interfaces.map((item) => <span key={item}>{item}</span>)}
                {record.algorithmIds.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
            <div className="implementation-row-meta">
              <span>Verified {record.lastVerified}</span>
              <ArrowRight size={15} />
            </div>
          </Link>
        ))}
        {!results.length && (
          <div className="reference-empty">
            <Search size={20} />
            <strong>No matching implementation.</strong>
            <span>Try a language, framework, repository, algorithm, or broader term.</span>
          </div>
        )}
      </section>
    </main>
  );
}
