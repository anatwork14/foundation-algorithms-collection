"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, FlaskConical, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import { historyForExperiment } from "@/lib/experiment-history";
import type { ExperimentRecord, ExperimentStatus } from "@/lib/experiments";
import { experimentSearchText } from "@/lib/experiments";

const statuses: Array<ExperimentStatus | "All"> = ["All", "Planned", "Running", "Completed", "Inconclusive", "Failed"];

export function ExperimentExplorer({ records }: { records: ExperimentRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ExperimentStatus | "All">("All");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return records.filter((record) => {
      const statusMatch = status === "All" || record.status === status;
      const queryMatch = !needle || experimentSearchText(record).includes(needle);
      return statusMatch && queryMatch;
    });
  }, [query, records, status]);

  return (
    <main className="experiment-page shell">
      <header className="experiment-hero">
        <span className="eyebrow"><FlaskConical size={13} /> Experiment registry</span>
        <h1>Turn research hypotheses into reproducible study plans.</h1>
        <p>Experiment records preserve baselines, datasets, metrics, environment controls, procedures, success criteria, artifacts, revision history, and eventual outcomes—even when the result is negative or inconclusive.</p>
        <EvidenceNav current="experiments" />
      </header>

      <section className="experiment-controls" aria-label="Experiment filters">
        <label>
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search fuzzing, reranking, QEC, baselines, metrics…" />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value as ExperimentStatus | "All")} aria-label="Filter experiments by status">
          {statuses.map((item) => <option key={item} value={item}>{item === "All" ? "All experiment states" : item}</option>)}
        </select>
      </section>

      <div className="experiment-result-count">{results.length} experiment records</div>

      <section className="experiment-list" aria-live="polite">
        {results.map((record) => {
          const history = historyForExperiment(record.id);
          const latest = history.at(-1);
          return (
            <Link key={record.id} href={`/experiments/${record.id}`} className="experiment-row">
              <div className={`experiment-status status-${record.status.toLowerCase()}`}>{record.status}</div>
              <div>
                <div className="experiment-overline">{record.algorithmIds.join(" × ")}</div>
                <h2>{record.title}</h2>
                <p>{record.objective}</p>
                <div className="experiment-tags">
                  {record.metrics.slice(0, 3).map((metric) => <span key={metric}>{metric}</span>)}
                </div>
              </div>
              <div className="experiment-row-meta">
                <span>r{latest?.revision ?? 0} · {history.length} revision{history.length === 1 ? "" : "s"}</span>
                <span>Updated {record.lastUpdated}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </div>
            </Link>
          );
        })}
        {!results.length && (
          <div className="reference-empty">
            <Search size={20} />
            <strong>No matching experiment.</strong>
            <span>Try a metric, algorithm, baseline, status, or broader research term.</span>
          </div>
        )}
      </section>
    </main>
  );
}
