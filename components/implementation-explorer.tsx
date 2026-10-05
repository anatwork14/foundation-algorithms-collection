"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Code2, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import { RegistryToolbar } from "@/components/registry-toolbar";
import { ResearchPageHeader } from "@/components/research-page-header";
import type { ImplementationMaturity, ImplementationRecord } from "@/lib/implementations";
import { implementationSearchText } from "@/lib/implementations";
import type { ImplementationUpstreamReviewDecision } from "@/lib/implementation-upstream-reviews";
import { latestUpstreamReviewForImplementation } from "@/lib/implementation-upstream-reviews";

const maturityOptions: Array<ImplementationMaturity | "All"> = [
  "All",
  "Production-proven",
  "Established open-source",
  "Research/prototyping",
];

type ReviewFilter = "All" | "Reviewed" | "No review" | ImplementationUpstreamReviewDecision;

const reviewOptions: Array<{ value: ReviewFilter; label: string }> = [
  { value: "All", label: "All upstream-review states" },
  { value: "Reviewed", label: "Has upstream review" },
  { value: "No review", label: "No upstream review" },
  { value: "Retain pin", label: "Decision: retain pin" },
  { value: "Advance pin", label: "Decision: advance pin" },
  { value: "Needs follow-up", label: "Decision: needs follow-up" },
];

export function ImplementationExplorer({ records }: { records: ImplementationRecord[] }) {
  const [query, setQuery] = useState("");
  const [maturity, setMaturity] = useState<ImplementationMaturity | "All">("All");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("All");

  const reviewedCount = useMemo(
    () => records.filter((record) => Boolean(latestUpstreamReviewForImplementation(record.id))).length,
    [records],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return records.filter((record) => {
      const review = latestUpstreamReviewForImplementation(record.id);
      const maturityMatch = maturity === "All" || record.maturity === maturity;
      const reviewMatch = reviewFilter === "All"
        || (reviewFilter === "Reviewed" && Boolean(review))
        || (reviewFilter === "No review" && !review)
        || review?.decision === reviewFilter;
      const reviewSearchText = review
        ? [review.decision, review.reviewedAt, review.observedRef, review.note, ...review.inspectedPaths.map((item) => item.path)].join(" ").toLowerCase()
        : "";
      const queryMatch = !needle || implementationSearchText(record).includes(needle) || reviewSearchText.includes(needle);
      return maturityMatch && reviewMatch && queryMatch;
    });
  }, [maturity, query, records, reviewFilter]);

  return (
    <main className="implementation-page shell">
      <ResearchPageHeader
        className="implementation-hero"
        eyebrow={<><Code2 size={13} aria-hidden="true" /> Implementation registry</>}
        title="Move from theory to inspectable code."
        description="Curated repositories connect algorithm entities to immutable source snapshots, interfaces, license metadata, exact verification revisions, and explicit upstream-review decisions."
      >
        <EvidenceNav current="implementations" />
      </ResearchPageHeader>

      <RegistryToolbar
        className="implementation-controls"
        ariaLabel="Implementation filters"
        query={query}
        onQueryChange={setQuery}
        placeholder="Search HNSW, review notes, source paths, C++, Python…"
        searchAriaLabel="Search implementations"
      >
        <select value={maturity} onChange={(event) => setMaturity(event.target.value as ImplementationMaturity | "All")} aria-label="Filter implementations by maturity">
          {maturityOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All maturity levels" : item}</option>)}
        </select>
        <select value={reviewFilter} onChange={(event) => setReviewFilter(event.target.value as ReviewFilter)} aria-label="Filter implementations by upstream review">
          {reviewOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </RegistryToolbar>

      <div className="implementation-result-count">{results.length} of {records.length} implementation records · {reviewedCount} with upstream review</div>

      <section className="implementation-list" aria-live="polite">
        {results.map((record) => {
          const review = latestUpstreamReviewForImplementation(record.id);
          return (
            <Link key={record.id} href={`/implementations/${record.id}`} className="implementation-row">
              <div className="implementation-language">{record.language}</div>
              <div>
                <div className="implementation-overline">{record.maturity} · {record.license}</div>
                <h2>{record.name}</h2>
                <p>{record.summary}</p>
                <div className="implementation-tags">
                  {record.interfaces.map((item) => <span key={item}>{item}</span>)}
                  {record.algorithmIds.map((item) => <span key={item}>{item}</span>)}
                  {review && <span>Upstream: {review.decision}</span>}
                </div>
              </div>
              <div className="implementation-row-meta">
                <span>{record.verifiedRef} · <code>{record.verifiedCommit.slice(0, 12)}</code></span>
                <span>Verified {record.lastVerified}</span>
                <span>{review ? `Upstream review ${review.reviewedAt} · ${review.decision}` : "No upstream review recorded"}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </div>
            </Link>
          );
        })}
        {!results.length && (
          <div className="reference-empty">
            <Search size={20} aria-hidden="true" />
            <strong>No matching implementation.</strong>
            <span>Try a language, framework, repository, review decision, source path, algorithm, or broader term.</span>
          </div>
        )}
      </section>
    </main>
  );
}