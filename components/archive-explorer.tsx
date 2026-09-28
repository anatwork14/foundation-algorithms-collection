"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Filter, Network, ScrollText, Search, ShieldCheck, Sigma, SlidersHorizontal } from "lucide-react";
import type { DocSummary } from "@/lib/content";
import type { ChapterDiscoveryMetadata, EvidenceAvailability } from "@/lib/discovery";
import type { EvidenceStage } from "@/lib/evidence-profile";
import { fieldKey, fields, type ResearchField } from "@/lib/taxonomy";

type SortMode = "number" | "title" | "length";
type EvidenceFilter = EvidenceAvailability | "All";
type EvidenceStageFilter = EvidenceStage | "All";

type ArchiveExplorerProps = {
  documents: DocSummary[];
  discovery: ChapterDiscoveryMetadata[];
  initialQuery?: string;
  initialField?: string;
  initialFamily?: string;
  initialAlgorithm?: string;
  initialEvidence?: string;
  initialStage?: string;
  initialSort?: string;
};

const fieldNames = new Set(fields.map((item) => item.name));
const evidenceValues = new Set<EvidenceAvailability>(["References", "Implementations", "Experiments"]);
const evidenceStages: EvidenceStage[] = [
  "Concept only",
  "Source-backed",
  "Inspectable implementation",
  "Experiment protocol",
  "Empirical result",
  "Replicated",
];
const evidenceStageValues = new Set<EvidenceStage>(evidenceStages);

function normalizeField(value?: string): ResearchField | "All" {
  return value && fieldNames.has(value as ResearchField) ? value as ResearchField : "All";
}

function normalizeEvidence(value?: string): EvidenceFilter {
  return value && evidenceValues.has(value as EvidenceAvailability) ? value as EvidenceAvailability : "All";
}

function normalizeStage(value?: string): EvidenceStageFilter {
  return value && evidenceStageValues.has(value as EvidenceStage) ? value as EvidenceStage : "All";
}

function normalizeSort(value?: string): SortMode {
  return value === "title" || value === "length" ? value : "number";
}

export function ArchiveExplorer({
  documents,
  discovery,
  initialQuery = "",
  initialField,
  initialFamily,
  initialAlgorithm,
  initialEvidence,
  initialStage,
  initialSort,
}: ArchiveExplorerProps) {
  const metadataBySlug = useMemo(() => new Map(discovery.map((item) => [item.slug, item])), [discovery]);
  const familyOptions = useMemo(
    () => [...new Set(discovery.flatMap((item) => item.families))].sort((a, b) => a.localeCompare(b)),
    [discovery],
  );
  const algorithmOptions = useMemo(() => {
    const byId = new Map<string, string>();
    for (const item of discovery) for (const algorithm of item.algorithms) byId.set(algorithm.id, algorithm.name);
    return [...byId.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [discovery]);
  const algorithmIds = useMemo(() => new Set(algorithmOptions.map((item) => item.id)), [algorithmOptions]);

  const [query, setQuery] = useState(initialQuery);
  const [field, setField] = useState<ResearchField | "All">(() => normalizeField(initialField));
  const [family, setFamily] = useState(() => initialFamily && familyOptions.includes(initialFamily) ? initialFamily : "All");
  const [algorithm, setAlgorithm] = useState(() => initialAlgorithm && algorithmIds.has(initialAlgorithm) ? initialAlgorithm : "All");
  const [evidence, setEvidence] = useState<EvidenceFilter>(() => normalizeEvidence(initialEvidence));
  const [stage, setStage] = useState<EvidenceStageFilter>(() => normalizeStage(initialStage));
  const [sort, setSort] = useState<SortMode>(() => normalizeSort(initialSort));

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextFamily = params.get("family") ?? "All";
      const nextAlgorithm = params.get("algorithm") ?? "All";
      setQuery(params.get("q") ?? "");
      setField(normalizeField(params.get("field") ?? undefined));
      setFamily(nextFamily === "All" || familyOptions.includes(nextFamily) ? nextFamily : "All");
      setAlgorithm(nextAlgorithm === "All" || algorithmIds.has(nextAlgorithm) ? nextAlgorithm : "All");
      setEvidence(normalizeEvidence(params.get("evidence") ?? undefined));
      setStage(normalizeStage(params.get("stage") ?? undefined));
      setSort(normalizeSort(params.get("sort") ?? undefined));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [algorithmIds, familyOptions]);

  function writeUrl(
    nextQuery: string,
    nextField: ResearchField | "All",
    nextFamily: string,
    nextAlgorithm: string,
    nextEvidence: EvidenceFilter,
    nextStage: EvidenceStageFilter,
    nextSort: SortMode,
  ) {
    const params = new URLSearchParams();
    const cleanQuery = nextQuery.trim();
    if (cleanQuery) params.set("q", cleanQuery);
    if (nextField !== "All") params.set("field", nextField);
    if (nextFamily !== "All") params.set("family", nextFamily);
    if (nextAlgorithm !== "All") params.set("algorithm", nextAlgorithm);
    if (nextEvidence !== "All") params.set("evidence", nextEvidence);
    if (nextStage !== "All") params.set("stage", nextStage);
    if (nextSort !== "number") params.set("sort", nextSort);
    const search = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`);
  }

  function syncUrl(overrides: Partial<{
    query: string;
    field: ResearchField | "All";
    family: string;
    algorithm: string;
    evidence: EvidenceFilter;
    stage: EvidenceStageFilter;
    sort: SortMode;
  }>) {
    writeUrl(
      overrides.query ?? query,
      overrides.field ?? field,
      overrides.family ?? family,
      overrides.algorithm ?? algorithm,
      overrides.evidence ?? evidence,
      overrides.stage ?? stage,
      overrides.sort ?? sort,
    );
  }

  function clearFilters() {
    setQuery("");
    setField("All");
    setFamily("All");
    setAlgorithm("All");
    setEvidence("All");
    setStage("All");
    writeUrl("", "All", "All", "All", "All", "All", sort);
  }

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = documents.filter((doc) => {
      const meta = metadataBySlug.get(doc.slug);
      const fieldMatch = field === "All" || doc.field === field;
      const familyMatch = family === "All" || meta?.families.includes(family);
      const algorithmMatch = algorithm === "All" || meta?.algorithmIds.includes(algorithm);
      const evidenceMatch = evidence === "All" || meta?.evidence.includes(evidence);
      const stageMatch = stage === "All" || meta?.evidenceStages.includes(stage);
      const queryMatch =
        !needle ||
        doc.title.toLowerCase().includes(needle) ||
        doc.summary.toLowerCase().includes(needle) ||
        doc.searchText.includes(needle) ||
        meta?.algorithms.some((item) => item.name.toLowerCase().includes(needle)) ||
        meta?.families.some((item) => item.toLowerCase().includes(needle)) ||
        meta?.evidenceStages.some((item) => item.toLowerCase().includes(needle));
      return fieldMatch && familyMatch && algorithmMatch && evidenceMatch && stageMatch && Boolean(queryMatch);
    });

    return [...next].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "length") return b.words - a.words;
      return a.number.localeCompare(b.number, undefined, { numeric: true });
    });
  }, [algorithm, documents, evidence, family, field, metadataBySlug, query, sort, stage]);

  const hasFilters = Boolean(query) || field !== "All" || family !== "All" || algorithm !== "All" || evidence !== "All" || stage !== "All";

  return (
    <main className="archive-page shell">
      <section className="archive-hero">
        <div>
          <span className="eyebrow"><span className="live-dot" /> Research archive</span>
          <h1>Every chapter, one searchable map.</h1>
          <p>Browse the collection as a library. Search chapter text or move structurally through fields, algorithm families, individual algorithms, available evidence, and algorithm evidence stages.</p>
        </div>
        <div className="archive-summary-card">
          <span>Collection state</span>
          <strong>{documents.length}</strong>
          <p>long-form research chapters stored in Markdown and rendered directly by the site.</p>
        </div>
      </section>

      <section className="archive-toolbar" aria-label="Archive controls">
        <label className="archive-search">
          <Search size={18} />
          <input value={query} onChange={(event) => { const next = event.target.value; setQuery(next); syncUrl({ query: next }); }} placeholder="Search chapters, algorithms, families, evidence stages…" />
        </label>
        <label className="select-control">
          <Filter size={16} />
          <select value={field} onChange={(event) => { const next = event.target.value as ResearchField | "All"; setField(next); syncUrl({ field: next }); }}>
            <option value="All">All fields</option>
            {fields.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <label className="select-control">
          <SlidersHorizontal size={16} />
          <select value={sort} onChange={(event) => { const next = event.target.value as SortMode; setSort(next); syncUrl({ sort: next }); }}>
            <option value="number">Collection order</option>
            <option value="title">Title A–Z</option>
            <option value="length">Longest first</option>
          </select>
        </label>
      </section>

      <section className="archive-discovery-filters" aria-label="Research structure filters">
        <label>
          <Network size={15} />
          <select value={family} onChange={(event) => { const next = event.target.value; setFamily(next); syncUrl({ family: next }); }}>
            <option value="All">All algorithm families</option>
            {familyOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <Sigma size={15} />
          <select value={algorithm} onChange={(event) => { const next = event.target.value; setAlgorithm(next); syncUrl({ algorithm: next }); }}>
            <option value="All">All indexed algorithms</option>
            {algorithmOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label>
          <ScrollText size={15} />
          <select value={evidence} onChange={(event) => { const next = event.target.value as EvidenceFilter; setEvidence(next); syncUrl({ evidence: next }); }}>
            <option value="All">Any evidence availability</option>
            <option value="References">Has primary references</option>
            <option value="Implementations">Has implementations</option>
            <option value="Experiments">Has experiment records</option>
          </select>
        </label>
        <label>
          <ShieldCheck size={15} />
          <select value={stage} onChange={(event) => { const next = event.target.value as EvidenceStageFilter; setStage(next); syncUrl({ stage: next }); }}>
            <option value="All">Any algorithm evidence stage</option>
            {evidenceStages.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </section>

      <div className="archive-result-meta">
        <span>{results.length} chapters</span>
        {hasFilters && <button onClick={clearFilters}>Clear filters</button>}
      </div>

      <section className="archive-list" aria-live="polite">
        {results.map((doc) => {
          const meta = metadataBySlug.get(doc.slug);
          return (
            <Link key={doc.slug} href={`/archive/${doc.slug}`} className="archive-row">
              <div className={`archive-row-index field-${fieldKey(doc.field)}`}>{doc.number}</div>
              <div className="archive-row-main">
                <div className="archive-row-label">{doc.field}</div>
                <h2>{doc.title}</h2>
                <p>{doc.summary}</p>
                <div className="archive-row-headings">
                  {(meta?.algorithms.slice(0, 2).map((item) => item.name) ?? doc.headings.slice(0, 2)).map((label) => <span key={label}>{label}</span>)}
                  {meta?.evidence.slice(0, 2).map((item) => <span key={item} className="evidence-tag">{item}</span>)}
                  {meta?.evidenceStages.slice(0, 2).map((item) => <span key={item} className="evidence-stage-tag">{item}</span>)}
                </div>
              </div>
              <div className="archive-row-meta">
                <span>{doc.minutes} min</span>
                <span>{doc.words.toLocaleString()} words</span>
                <ArrowUpRight size={18} />
              </div>
            </Link>
          );
        })}
        {!results.length && (
          <div className="empty-state archive-empty">
            <Search size={24} />
            <h3>No matching research chapter.</h3>
            <p>Broaden the search or remove one of the structural/evidence filters.</p>
          </div>
        )}
      </section>
    </main>
  );
}
