"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { ArrowRight, BookOpen, Code2, Network, ScrollText, Search } from "lucide-react";
import type { AlgorithmEntity, RelationType } from "@/lib/algorithms";
import {
  atlasEvidenceParam,
  atlasRelationTypes as relationTypes,
  parseAtlasState,
  updateAtlasSearch,
  type RelationEvidenceFilter,
} from "@/lib/atlas-state";
import { implementationsForAlgorithm } from "@/lib/implementations";
import { getReference, referencesForAlgorithm } from "@/lib/references";
import { getRelationProvenance, type RelationProvenanceRecord } from "@/lib/relation-provenance";
import { fieldKey, fields, type ResearchField } from "@/lib/taxonomy";

type UrlHistoryMode = "push" | "replace";

type VisibleRelationProvenance = {
  source: AlgorithmEntity;
  target: AlgorithmEntity;
  relation: AlgorithmEntity["relations"][number];
  record: RelationProvenanceRecord;
};

function evidenceState(record: RelationProvenanceRecord | null) {
  return record ? "Source-backed" : "Conceptual";
}

export function AtlasExplorer({ algorithms }: { algorithms: AlgorithmEntity[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("linucb");
  const [field, setField] = useState<ResearchField | "All">("All");
  const [relationType, setRelationType] = useState<RelationType | "All">("All");
  const [relationEvidence, setRelationEvidence] = useState<RelationEvidenceFilter>("All");

  const selected = algorithms.find((algorithm) => algorithm.id === selectedId) ?? algorithms[0];
  const byId = useMemo(() => new Map(algorithms.map((algorithm) => [algorithm.id, algorithm])), [algorithms]);
  const researchFields = useMemo(() => fields.map((item) => item.name), []);

  useEffect(() => {
    const syncFromUrl = () => {
      const state = parseAtlasState(window.location.search, {
        algorithmIds: byId.keys(),
        fields: researchFields,
      });
      setSelectedId(state.algorithmId);
      setField(state.field);
      setRelationType(state.relationType);
      setRelationEvidence(state.relationEvidence);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [byId, researchFields]);

  function writeAtlasParam(name: string, value: string | null, mode: UrlHistoryMode) {
    const search = updateAtlasSearch(window.location.search, name, value);
    const next = `${window.location.pathname}${search}${window.location.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next === current) return;
    if (mode === "push") window.history.pushState({}, "", next);
    else window.history.replaceState({}, "", next);
  }

  function selectAlgorithm(id: string, mode: UrlHistoryMode = "push") {
    setSelectedId(id);
    writeAtlasParam("algorithm", id === "linucb" ? null : id, mode);
  }

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
  const activePickerId = matches.some((algorithm) => algorithm.id === selected.id)
    ? selected.id
    : matches[0]?.id;

  function movePickerFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!matches.length) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") nextIndex = (index + 1) % matches.length;
    if (event.key === "ArrowUp") nextIndex = (index - 1 + matches.length) % matches.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = matches.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const next = matches[nextIndex];
    selectAlgorithm(next.id, "replace");
    requestAnimationFrame(() => {
      document.getElementById(`atlas-picker-${next.id}`)?.focus();
    });
  }

  const outgoingAll = selected.relations
    .map((relation) => ({ relation, target: byId.get(relation.target) }))
    .filter((item): item is { relation: AlgorithmEntity["relations"][number]; target: AlgorithmEntity } => Boolean(item.target));

  const incomingAll = algorithms.flatMap((algorithm) =>
    algorithm.relations
      .filter((relation) => relation.target === selected.id)
      .map((relation) => ({ relation, source: algorithm })),
  );

  const outgoing = outgoingAll.filter(({ relation, target }) => {
    const record = getRelationProvenance(selected.id, relation.type, target.id);
    return (
      (relationType === "All" || relation.type === relationType) &&
      (field === "All" || target.fields.includes(field)) &&
      (relationEvidence === "All" || evidenceState(record) === relationEvidence)
    );
  });
  const incoming = incomingAll.filter(({ relation, source }) => {
    const record = getRelationProvenance(source.id, relation.type, selected.id);
    return (
      (relationType === "All" || relation.type === relationType) &&
      (field === "All" || source.fields.includes(field)) &&
      (relationEvidence === "All" || evidenceState(record) === relationEvidence)
    );
  });

  const neighbors = [...outgoing.map((item) => item.target), ...incoming.map((item) => item.source)]
    .filter((algorithm, index, all) => all.findIndex((item) => item.id === algorithm.id) === index);
  const referenceNeighbors = referencesForAlgorithm(selected.id);
  const implementationNeighbors = implementationsForAlgorithm(selected.id);

  const visibleProvenance = [
    ...outgoing.map(({ relation, target }) => ({
      source: selected,
      target,
      relation,
      record: getRelationProvenance(selected.id, relation.type, target.id),
    })),
    ...incoming.map(({ relation, source }) => ({
      source,
      target: selected,
      relation,
      record: getRelationProvenance(source.id, relation.type, selected.id),
    })),
  ].filter((item): item is VisibleRelationProvenance => Boolean(item.record));

  const visibleRelationCount = outgoing.length + incoming.length;
  const visibleSourceBackedCount = visibleProvenance.length;
  const visibleConceptualCount = visibleRelationCount - visibleSourceBackedCount;

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
            <select
              value={field}
              onChange={(event) => {
                const next = event.target.value as ResearchField | "All";
                setField(next);
                writeAtlasParam("field", next === "All" ? null : next, "replace");
              }}
              aria-label="Filter Atlas by field"
            >
              <option value="All">All fields</option>
              {fields.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
            <select
              value={relationType}
              onChange={(event) => {
                const next = event.target.value as RelationType | "All";
                setRelationType(next);
                writeAtlasParam("relation", next === "All" ? null : next, "replace");
              }}
              aria-label="Filter Atlas by relationship type"
            >
              {relationTypes.map((item) => <option key={item} value={item}>{item === "All" ? "All relations" : item.replaceAll("-", " ")}</option>)}
            </select>
            <select
              value={relationEvidence}
              onChange={(event) => {
                const next = event.target.value as RelationEvidenceFilter;
                setRelationEvidence(next);
                writeAtlasParam("evidence", atlasEvidenceParam(next), "replace");
              }}
              aria-label="Filter Atlas by relation evidence"
            >
              <option value="All">All evidence states</option>
              <option value="Source-backed">Source-backed only</option>
              <option value="Conceptual">Conceptual only</option>
            </select>
          </div>
          <div className="atlas-picker-list" role="group" aria-label="Atlas algorithms">
            {matches.map((algorithm, index) => (
              <button
                id={`atlas-picker-${algorithm.id}`}
                key={algorithm.id}
                className={algorithm.id === selected.id ? "is-active" : ""}
                onClick={() => selectAlgorithm(algorithm.id)}
                onKeyDown={(event) => movePickerFocus(event, index)}
                aria-pressed={algorithm.id === selected.id}
                tabIndex={algorithm.id === activePickerId ? 0 : -1}
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

          <div className="atlas-edge-coverage" aria-label={`Visible relation evidence coverage for ${selected.name}`}>
            <span><strong>{visibleRelationCount}</strong> visible edges</span>
            <span><strong>{visibleSourceBackedCount}</strong> source-backed</span>
            <span><strong>{visibleConceptualCount}</strong> conceptual</span>
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
                const record = outgoingRelation
                  ? getRelationProvenance(selected.id, outgoingRelation.type, neighbor.id)
                  : incomingRelation
                    ? getRelationProvenance(neighbor.id, incomingRelation.type, selected.id)
                    : null;
                const state = evidenceState(record);
                return (
                  <button key={neighbor.id} className="atlas-neighbor" onClick={() => selectAlgorithm(neighbor.id)}>
                    <span className={`entity-field-dot field-dot-${fieldKey(neighbor.fields[0])}`} aria-hidden="true" />
                    <small>{direction === "out" ? relation?.type.replaceAll("-", " ") : `referenced by · ${relation?.type.replaceAll("-", " ")}`}</small>
                    <strong>{neighbor.name}</strong>
                    <span className={`atlas-edge-evidence ${record ? "is-source-backed" : "is-conceptual"}`}>{state}</span>
                    <p>{relation?.note}</p>
                  </button>
                );
              })}
              {!neighbors.length && (
                <div className="atlas-no-relations">
                  No curated relationships match the current field, relation, and evidence filters.
                </div>
              )}
            </div>
          </div>

          <div className="atlas-relation-table" role="region" aria-label={`Relationship details for ${selected.name}`}>
            <div className="atlas-table-head"><span>Direction</span><span>Relation</span><span>Algorithm</span><span>Research meaning</span></div>
            {outgoing.map(({ relation, target }) => {
              const record = getRelationProvenance(selected.id, relation.type, target.id);
              return (
                <Link key={`out-${relation.type}-${target.id}`} href={`/algorithms/${target.id}`} className="atlas-table-row">
                  <span>→</span>
                  <span className="atlas-relation-kind"><span>{relation.type.replaceAll("-", " ")}</span><small className={record ? "is-source-backed" : "is-conceptual"}>{evidenceState(record)}</small></span>
                  <strong>{target.name}</strong><p>{relation.note}</p>
                </Link>
              );
            })}
            {incoming.map(({ relation, source }) => {
              const record = getRelationProvenance(source.id, relation.type, selected.id);
              return (
                <Link key={`in-${relation.type}-${source.id}`} href={`/algorithms/${source.id}`} className="atlas-table-row">
                  <span>←</span>
                  <span className="atlas-relation-kind"><span>{relation.type.replaceAll("-", " ")}</span><small className={record ? "is-source-backed" : "is-conceptual"}>{evidenceState(record)}</small></span>
                  <strong>{source.name}</strong><p>{relation.note}</p>
                </Link>
              );
            })}
          </div>

          <div className="atlas-evidence-neighbors" role="region" aria-label={`Evidence neighbors for ${selected.name}`}>
            <div className="atlas-evidence-heading">
              <div>
                <span className="research-block-label">Evidence neighbors</span>
                <strong>Sources and executable implementations linked to the focused algorithm.</strong>
              </div>
            </div>
            <div className="atlas-evidence-grid">
              <section aria-labelledby="atlas-reference-neighbors">
                <div className="atlas-evidence-column-heading">
                  <BookOpen size={15} aria-hidden="true" />
                  <strong id="atlas-reference-neighbors">References</strong>
                  <span>{referenceNeighbors.length}</span>
                </div>
                <div className="atlas-evidence-list">
                  {referenceNeighbors.map((reference) => (
                    <Link key={reference.id} href={`/references/${reference.id}`}>
                      <span>{reference.evidenceRole} · {reference.year}</span>
                      <strong>{reference.title}</strong>
                    </Link>
                  ))}
                  {!referenceNeighbors.length && <p>No curated Reference node is linked yet.</p>}
                </div>
              </section>
              <section aria-labelledby="atlas-implementation-neighbors">
                <div className="atlas-evidence-column-heading">
                  <Code2 size={15} aria-hidden="true" />
                  <strong id="atlas-implementation-neighbors">Implementations</strong>
                  <span>{implementationNeighbors.length}</span>
                </div>
                <div className="atlas-evidence-list">
                  {implementationNeighbors.map((implementation) => (
                    <Link key={implementation.id} href={`/implementations/${implementation.id}`}>
                      <span>{implementation.language} · {implementation.maturity}</span>
                      <strong>{implementation.name}</strong>
                    </Link>
                  ))}
                  {!implementationNeighbors.length && <p>No curated Implementation node is linked yet.</p>}
                </div>
              </section>
            </div>
          </div>

          <div className="atlas-provenance" role="region" aria-label={`Curated relationship evidence for ${selected.name}`}>
            <div className="atlas-provenance-heading">
              <div>
                <span className="research-block-label">Relation provenance</span>
                <strong>{visibleProvenance.length} source-backed visible edge{visibleProvenance.length === 1 ? "" : "s"}</strong>
              </div>
              <ScrollText size={18} aria-hidden="true" />
            </div>

            {visibleProvenance.length ? visibleProvenance.map(({ source, target, relation, record }) => (
              <div className="atlas-provenance-row" key={`${source.id}-${relation.type}-${target.id}`}>
                <div className="atlas-provenance-edge">
                  <span>{source.name} → {target.name}</span>
                  <strong>{relation.type.replaceAll("-", " ")}</strong>
                </div>
                <p>{record.evidenceNote}</p>
                <div className="atlas-provenance-references">
                  {record.referenceIds.map((referenceId) => {
                    const reference = getReference(referenceId);
                    if (!reference) return null;
                    return (
                      <Link key={reference.id} href={`/references/${reference.id}`}>
                        <span>{reference.year}</span>
                        <strong>{reference.title}</strong>
                      </Link>
                    );
                  })}
                </div>
                <small>Verified {record.verifiedAt}</small>
              </div>
            )) : (
              <p className="atlas-provenance-empty">No relation-level source has been curated for the currently visible edges. The relationship notes remain conceptual archive metadata until a source is explicitly attached.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
