"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { AlgorithmEntity, MaturityLevel } from "@/lib/algorithms";
import { algorithmSearchText } from "@/lib/algorithm-catalog";
import { fieldKey, fields, type ResearchField } from "@/lib/taxonomy";

const maturityOptions: Array<MaturityLevel | "All"> = [
  "All",
  "Established foundation",
  "Production-proven",
  "Active research",
  "Emerging",
];

export function AlgorithmExplorer({ algorithms }: { algorithms: AlgorithmEntity[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<ResearchField | "All">("All");
  const [maturity, setMaturity] = useState<MaturityLevel | "All">("All");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return algorithms.filter((algorithm) => {
      const fieldMatch = field === "All" || algorithm.fields.includes(field);
      const maturityMatch = maturity === "All" || algorithm.maturity === maturity;
      const queryMatch = !needle || algorithmSearchText(algorithm).includes(needle);
      return fieldMatch && maturityMatch && queryMatch;
    });
  }, [algorithms, field, maturity, query]);

  return (
    <main className="entity-index-page shell">
      <header className="entity-index-hero">
        <div>
          <span className="eyebrow"><span className="live-dot" /> Algorithm index</span>
          <h1>Study the mechanisms, not only the chapters.</h1>
          <p>
            Curated algorithm entities connect names, assumptions, complexity, maturity, source chapters, variants, and research relationships.
          </p>
        </div>
        <div className="entity-index-count">
          <strong>{algorithms.length}</strong>
          <span>curated entities</span>
        </div>
      </header>

      <section className="entity-controls" aria-label="Algorithm filters">
        <label className="entity-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search LinUCB, QSVT, fuzzing, uncertainty…" />
        </label>
        <select value={field} onChange={(event) => setField(event.target.value as ResearchField | "All")} aria-label="Filter by field">
          <option value="All">All fields</option>
          {fields.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
        <select value={maturity} onChange={(event) => setMaturity(event.target.value as MaturityLevel | "All")} aria-label="Filter by maturity">
          {maturityOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All maturity levels" : item}</option>)}
        </select>
      </section>

      <div className="entity-result-count">{results.length} matching algorithms</div>

      <section className="entity-list" aria-live="polite">
        {results.map((algorithm) => {
          const primaryField = algorithm.fields[0];
          return (
            <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`} className="entity-row">
              <span className={`entity-field-dot field-dot-${fieldKey(primaryField)}`} aria-hidden="true" />
              <div className="entity-row-main">
                <div className="entity-row-overline">
                  <span>{algorithm.families[0]}</span>
                  <span>·</span>
                  <span>{algorithm.maturity}</span>
                </div>
                <h2>{algorithm.name}</h2>
                <p>{algorithm.summary}</p>
                <div className="entity-tags">
                  {algorithm.aliases.slice(0, 2).map((alias) => <span key={alias}>{alias}</span>)}
                  {algorithm.fields.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <div className="entity-row-meta">
                <span>{algorithm.relations.length} relations</span>
                <span>{algorithm.chapterSlugs.length} sources</span>
                <ArrowUpRight size={17} />
              </div>
            </Link>
          );
        })}
        {!results.length && (
          <div className="entity-empty">
            <Search size={22} />
            <strong>No matching algorithm entity.</strong>
            <span>Try a broader mechanism, field, or maturity level.</span>
          </div>
        )}
      </section>
    </main>
  );
}
