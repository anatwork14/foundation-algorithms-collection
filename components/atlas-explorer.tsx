"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Network, Search } from "lucide-react";
import type { AlgorithmEntity, RelationType } from "@/lib/algorithms";
import { fieldKey, fields, type ResearchField } from "@/lib/taxonomy";

const relationTypes: Array<RelationType | "All"> = [
  "All",
  "derived-from",
  "generalizes",
  "special-case-of",
  "alternative-to",
  "combines-with",
  "depends-on",
  "used-by",
  "approximates",
  "secures",
  "accelerates",
];

export function AtlasExplorer({ algorithms }: { algorithms: AlgorithmEntity[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("linucb");
  const [field, setField] = useState<ResearchField | "All">("All");
  const [relationType, setRelationType] = useState<RelationType | "All">("All");

  const selected = algorithms.find((algorithm) => algorithm.id === selectedId) ?? algorithms[0];
  const byId = useMemo(() => new Map(algorithms.map((algorithm) => [algorithm.id, algorithm])), [algorithms]);
  const needle = query.trim().toLowerCase();
  const matches = algorithms.filter((algorithm) => {
    const fieldMatch = field === "All" || algorithm.fields.includes(field);
    const queryMatch =
      !needle ||
      algorithm.name.toLowerCase().includes(needle) ||
      algorithm.aliases.some((alias) => alias.toLowerCase().includes(needle)) ||
      algorithm.tags.some((tag) => tag.includes(needle));
    return fieldMatch && queryMatch;
  });

  const outgoingAll = selected.relations
    .map((relation) => ({ relation, target: byId.get(relation.target) }))
    .filter((item): item is { relation: AlgorithmEntity["relations"][number]; target: AlgorithmEntity } => Boolean(item.target));

  const incomingAll = algorithms.flatMap((algorithm) =>
    algorithm.relations
      .filter((relation) => relation.target === selected.id)
      .map((relation) => ({ relation, source: algorithm })),
  );

  const outgoing = outgoingAll.filter(({ relation, target }) =>
    (relationType === "All" || relation.type === relationType) &&
    (field === "All" || target.fields.includes(field)),
  );
  const incoming = incomingAll.filter(({ relation, source }) =>
    (relationType === "All" || relation.type === relationType) &&
    (field === "All" || source.fields.includes(field)),
  );

  const neighbors = [...outgoing.map((item) => item.target), ...incoming.map((item) => item.source)]
    .filter((algorithm, index, all) => all.findIndex((item) => item.id === algorithm.id) === index);

  return (
    <main className="atlas-page shell">
      <header className="atlas-page-hero">
        <span className="eyebrow"><Network size={13} /> Relationship atlas</span>
        <h1>Trace how foundational ideas become new systems.</h1>
        <p>Focus on one algorithm at a time. The Atlas shows typed, curated relationships rather than an undifferentiated graph of co-occurring words.</p>
      </header>

      <div className="atlas-workspace">
        <aside className="atlas-picker">
          <label className="atlas-search">
            <Search size={16} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find an algorithm…"
              aria-label="Search algorithms in Atlas"
            />
          </label>
          <div className="atlas-filter-row">
            <select value={field} onChange={(event) => setField(event.target.value as ResearchField | "All")} aria-label="Filter Atlas by field">
              <option value="All">All fields</option>
              {fields.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
            <select value={relationType} onChange={(event) => setRelationType(event.target.value as RelationType | "All")} aria-label="Filter Atlas by relationship type">
              {relationTypes.map((item) => <option key={item} value={item}>{item === "All" ? "All relations" : item.replaceAll("-", " ")}</option>)}
            </select>
          </div>
          <div className="atlas-picker-list" aria-label="Atlas algorithms">
            {matches.map((algorithm) => (
              <button
                key={algorithm.id}
                className={algorithm.id === selected.id ? "is-active" : ""}
                onClick={() => setSelectedId(algorithm.id)}
                aria-pressed={algorithm.id === selected.id}
              >
                <span className={`entity-field-dot field-dot-${fieldKey(algorithm.fields[0])}`} aria-hidden="true" />
                <span><strong>{algorithm.name}</strong><small>{algorithm.families[0]}</small></span>
              </button>
            ))}
          </div>
        </aside>

        <section className="atlas-focus" aria-live="polite" aria-atomic="false">
          <div className="atlas-focus-header">
            <div>
              <span className="research-block-label">Focused entity</span>
              <h2>{selected.name}</h2>
              <p>{selected.summary}</p>
            </div>
            <Link href={`/algorithms/${selected.id}`} className="atlas-open-link">Open research card <ArrowRight size={14} aria-hidden="true" /></Link>
          </div>

          <div className="atlas-neighborhood" role="region" aria-label={`Relationships around ${selected.name}`}>
            <div className="atlas-core-node">
              <span>{selected.fields[0]}</span>
              <strong>{selected.name}</strong>
              <small>{selected.maturity}</small>
            </div>
            <div className="atlas-neighbor-grid">
              {neighbors.map((neighbor) => {
                const outgoingRelation = outgoing.find((item) => item.target.id === neighbor.id)?.relation;
                const incomingRelation = incoming.find((item) => item.source.id === neighbor.id)?.relation;
                const relation = outgoingRelation ?? incomingRelation;
                const direction = outgoingRelation ? "out" : "in";
                return (
                  <button key={neighbor.id} className="atlas-neighbor" onClick={() => setSelectedId(neighbor.id)}>
                    <span className={`entity-field-dot field-dot-${fieldKey(neighbor.fields[0])}`} aria-hidden="true" />
                    <small>{direction === "out" ? relation?.type.replaceAll("-", " ") : `referenced by · ${relation?.type.replaceAll("-", " ")}`}</small>
                    <strong>{neighbor.name}</strong>
                    <p>{relation?.note}</p>
                  </button>
                );
              })}
              {!neighbors.length && (
                <div className="atlas-no-relations">
                  No curated relationships match the current field/relation filters.
                </div>
              )}
            </div>
          </div>

          <div className="atlas-relation-table" role="region" aria-label={`Relationship details for ${selected.name}`}>
            <div className="atlas-table-head"><span>Direction</span><span>Relation</span><span>Algorithm</span><span>Research meaning</span></div>
            {outgoing.map(({ relation, target }) => (
              <Link key={`out-${relation.type}-${target.id}`} href={`/algorithms/${target.id}`} className="atlas-table-row">
                <span>→</span><span>{relation.type.replaceAll("-", " ")}</span><strong>{target.name}</strong><p>{relation.note}</p>
              </Link>
            ))}
            {incoming.map(({ relation, source }) => (
              <Link key={`in-${relation.type}-${source.id}`} href={`/algorithms/${source.id}`} className="atlas-table-row">
                <span>←</span><span>{relation.type.replaceAll("-", " ")}</span><strong>{source.name}</strong><p>{relation.note}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
