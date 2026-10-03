"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { AlgorithmEntity } from "@/lib/algorithms";
import type { AlgorithmVariantRecord } from "@/lib/algorithm-variants";
import { variantSearchText } from "@/lib/algorithm-variants";
import { fieldKey, fields, type ResearchField } from "@/lib/taxonomy";

export function VariantExplorer({
  variants,
  algorithms,
}: {
  variants: AlgorithmVariantRecord[];
  algorithms: AlgorithmEntity[];
}) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<ResearchField | "All">("All");
  const parentById = useMemo(() => new Map(algorithms.map((algorithm) => [algorithm.id, algorithm])), [algorithms]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return variants.filter((variant) => {
      const parent = parentById.get(variant.parentAlgorithmId);
      if (!parent) return false;
      const fieldMatch = field === "All" || parent.fields.includes(field);
      const queryMatch = !needle || variantSearchText(variant).includes(needle) || parent.name.toLowerCase().includes(needle);
      return fieldMatch && queryMatch;
    });
  }, [field, parentById, query, variants]);

  return (
    <main className="entity-index-page variant-index-page shell">
      <header className="entity-index-hero">
        <div>
          <span className="eyebrow"><span className="live-dot" /> Algorithm variants</span>
          <h1>Compare formulations without fragmenting the algorithm map.</h1>
          <p>
            Variant records capture materially different formulations of one parent mechanism while preserving the shared conceptual identity, source lineage, and evidence graph.
          </p>
        </div>
        <div className="entity-index-count">
          <strong>{variants.length}</strong>
          <span>curated variants</span>
        </div>
      </header>

      <section className="entity-controls variant-controls" aria-label="Variant filters">
        <label className="entity-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search disjoint, shared, hybrid, feature sharing…"
            aria-label="Search algorithm variants"
          />
        </label>
        <select value={field} onChange={(event) => setField(event.target.value as ResearchField | "All")} aria-label="Filter variants by field">
          <option value="All">All fields</option>
          {fields.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
      </section>

      <div className="entity-result-count">{results.length} matching variants</div>

      <section className="entity-list" aria-live="polite">
        {results.map((variant) => {
          const parent = parentById.get(variant.parentAlgorithmId);
          if (!parent) return null;
          const primaryField = parent.fields[0];
          return (
            <Link
              key={variant.id}
              href={`/algorithms/${parent.id}/variants/${variant.id}`}
              className="entity-row variant-row"
            >
              <span className={`entity-field-dot field-dot-${fieldKey(primaryField)}`} aria-hidden="true" />
              <div className="entity-row-main">
                <div className="entity-row-overline">
                  <span>{parent.name}</span>
                  <span>·</span>
                  <span>variant</span>
                </div>
                <h2>{variant.name}</h2>
                <p>{variant.summary}</p>
                <div className="entity-tags">
                  {variant.aliases.slice(0, 2).map((alias) => <span key={alias}>{alias}</span>)}
                  {variant.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <div className="entity-row-meta">
                <span>{variant.sourceLinks.length} source section{variant.sourceLinks.length === 1 ? "" : "s"}</span>
                <span>{parent.maturity}</span>
                <ArrowUpRight size={17} />
              </div>
            </Link>
          );
        })}
        {!results.length && (
          <div className="entity-empty">
            <Search size={22} />
            <strong>No matching variant record.</strong>
            <span>Try a broader formulation, parent algorithm, or research field.</span>
          </div>
        )}
      </section>
    </main>
  );
}
