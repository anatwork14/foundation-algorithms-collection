"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Code2, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import { RegistryToolbar } from "@/components/registry-toolbar";
import { ResearchPageHeader } from "@/components/research-page-header";
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
      <ResearchPageHeader
        className="implementation-hero"
        eyebrow={<><Code2 size={13} aria-hidden="true" /> Implementation registry</>}
        title="Move from theory to inspectable code."
        description="Curated repositories connect algorithm entities to immutable source snapshots, interfaces, license metadata, and exact verification revisions."
      >
        <EvidenceNav current="implementations" />
      </ResearchPageHeader>

      <RegistryToolbar
        className="implementation-controls"
        ariaLabel="Implementation filters"
        query={query}
        onQueryChange={setQuery}
        placeholder="Search HNSW, Qiskit, ML-KEM, C++, Python…"
        searchAriaLabel="Search implementations"
      >
        <select value={maturity} onChange={(event) => setMaturity(event.target.value as ImplementationMaturity | "All")} aria-label="Filter implementations by maturity">
          {maturityOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All maturity levels" : item}</option>)}
        </select>
      </RegistryToolbar>

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
              <span>{record.verifiedRef} · <code>{record.verifiedCommit.slice(0, 12)}</code></span>
              <span>Verified {record.lastVerified}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </div>
          </Link>
        ))}
        {!results.length && (
          <div className="reference-empty">
            <Search size={20} aria-hidden="true" />
            <strong>No matching implementation.</strong>
            <span>Try a language, framework, repository, algorithm, or broader term.</span>
          </div>
        )}
      </section>
    </main>
  );
}
