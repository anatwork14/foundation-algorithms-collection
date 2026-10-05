"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, GitBranch, RefreshCcw, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import { RegistryToolbar } from "@/components/registry-toolbar";
import { ResearchPageHeader } from "@/components/research-page-header";
import {
  implementationUpstreamReviewSearchText,
  type ImplementationUpstreamReview,
  type ImplementationUpstreamReviewDecision,
} from "@/lib/implementation-upstream-reviews";
import type { ImplementationRecord } from "@/lib/implementations";

type DecisionFilter = "All" | ImplementationUpstreamReviewDecision;
type MaterialFilter = "All" | "Changed" | "Unchanged";

const decisionOptions: Array<{ value: DecisionFilter; label: string }> = [
  { value: "All", label: "All review decisions" },
  { value: "Retain pin", label: "Retain pin" },
  { value: "Advance pin", label: "Advance pin" },
  { value: "Needs follow-up", label: "Needs follow-up" },
];

const materialOptions: Array<{ value: MaterialFilter; label: string }> = [
  { value: "All", label: "All material-change states" },
  { value: "Changed", label: "Material path change" },
  { value: "Unchanged", label: "No material path change" },
];

export function ImplementationReviewExplorer({
  reviews,
  implementations,
}: {
  reviews: ImplementationUpstreamReview[];
  implementations: ImplementationRecord[];
}) {
  const [query, setQuery] = useState("");
  const [decision, setDecision] = useState<DecisionFilter>("All");
  const [material, setMaterial] = useState<MaterialFilter>("All");

  const implementationsById = useMemo(
    () => new Map(implementations.map((implementation) => [implementation.id, implementation])),
    [implementations],
  );
  const orderedReviews = useMemo(
    () => [...reviews].sort((a, b) => {
      if (a.reviewedAt !== b.reviewedAt) return b.reviewedAt.localeCompare(a.reviewedAt);
      if (a.implementationId !== b.implementationId) return a.implementationId.localeCompare(b.implementationId);
      return b.revision - a.revision;
    }),
    [reviews],
  );
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orderedReviews.filter((review) => {
      const implementation = implementationsById.get(review.implementationId);
      const decisionMatch = decision === "All" || review.decision === decision;
      const materialMatch = material === "All"
        || (material === "Changed" && review.materialChange)
        || (material === "Unchanged" && !review.materialChange);
      const queryMatch = !needle || implementationUpstreamReviewSearchText(review, implementation?.name).includes(needle);
      return decisionMatch && materialMatch && queryMatch;
    });
  }, [decision, implementationsById, material, orderedReviews, query]);

  const retainCount = reviews.filter((review) => review.decision === "Retain pin").length;
  const advanceCount = reviews.filter((review) => review.decision === "Advance pin").length;
  const followUpCount = reviews.filter((review) => review.decision === "Needs follow-up").length;

  return (
    <main className="evidence-hub shell">
      <ResearchPageHeader
        className="evidence-hub-hero"
        eyebrow={<><RefreshCcw size={13} aria-hidden="true" /> Upstream implementation review</>}
        title="Review branch movement without rewriting evidence history."
        description="Each record preserves a human-reviewed comparison between an immutable implementation pin and a later upstream commit. Review decisions remain separate from verification history so branch movement never advances an evidence snapshot automatically."
      >
        <EvidenceNav current="implementation-reviews" />
      </ResearchPageHeader>

      <section className="evidence-summary" aria-label="Upstream review coverage">
        <div><strong>{reviews.length}</strong><span>review revisions</span></div>
        <div><strong>{retainCount}</strong><span>retain-pin decisions</span></div>
        <div><strong>{advanceCount}</strong><span>advance-pin decisions</span></div>
        <div><strong>{followUpCount}</strong><span>needs-follow-up decisions</span></div>
      </section>

      <RegistryToolbar
        className="implementation-controls"
        ariaLabel="Upstream review filters"
        query={query}
        onQueryChange={setQuery}
        placeholder="Search implementation, review note, commit, or source path…"
        searchAriaLabel="Search upstream implementation reviews"
      >
        <select value={decision} onChange={(event) => setDecision(event.target.value as DecisionFilter)} aria-label="Filter upstream reviews by decision">
          {decisionOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
        <select value={material} onChange={(event) => setMaterial(event.target.value as MaterialFilter)} aria-label="Filter upstream reviews by material change">
          {materialOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </RegistryToolbar>

      <div className="implementation-result-count">{results.length} of {reviews.length} review revisions</div>

      <section className="implementation-list" aria-label="Implementation upstream review records" aria-live="polite">
        {results.map((review) => {
          const implementation = implementationsById.get(review.implementationId);
          if (!implementation) return null;
          const anchor = `${review.implementationId}-r${review.revision}`;
          return (
            <article id={anchor} key={`${review.implementationId}-${review.revision}`} className="implementation-row">
              <div className="implementation-language">U{review.revision}</div>
              <div>
                <div className="implementation-overline">{review.decision} · reviewed {review.reviewedAt}</div>
                <h2><Link href={`/implementations/${implementation.id}`}>{implementation.name}</Link></h2>
                <p>{review.note}</p>
                <div className="implementation-tags">
                  <span>{review.observedRef}</span>
                  <span>{review.materialChange ? "Material change" : "No material path change"}</span>
                  {review.inspectedPaths.map((item) => <span key={item.path}>{item.path} · {item.changed ? "changed" : "unchanged"}</span>)}
                </div>
                <div className="implementation-verification-sources" aria-label={`Reviewed source blobs for ${implementation.name} upstream review ${review.revision}`}>
                  {review.inspectedPaths.flatMap((item) => [
                    <a key={`${item.path}-pinned`} href={`${implementation.repository}/blob/${review.pinnedCommit}/${item.path}`} target="_blank" rel="noreferrer">Pinned {item.path} · <code>{item.pinnedBlob.slice(0, 10)}</code> <ExternalLink size={11} aria-hidden="true" /></a>,
                    <a key={`${item.path}-observed`} href={`${implementation.repository}/blob/${review.observedCommit}/${item.path}`} target="_blank" rel="noreferrer">Observed {item.path} · <code>{item.upstreamBlob.slice(0, 10)}</code>{item.changed ? " · changed" : " · unchanged"} <ExternalLink size={11} aria-hidden="true" /></a>,
                  ])}
                </div>
              </div>
              <div className="implementation-row-meta">
                <span>Pinned <code>{review.pinnedCommit.slice(0, 12)}</code></span>
                <span>Observed <code>{review.observedCommit.slice(0, 12)}</code></span>
                <Link href={`/implementations/${implementation.id}`}>Inspect implementation <ArrowRight size={13} aria-hidden="true" /></Link>
                <a href={`${implementation.repository}/compare/${review.pinnedCommit}...${review.observedCommit}`} target="_blank" rel="noreferrer"><GitBranch size={13} aria-hidden="true" /> Compare commits <ExternalLink size={11} aria-hidden="true" /></a>
                <Link href={`/implementations/reviews#${anchor}`}>Permalink <ArrowRight size={13} aria-hidden="true" /></Link>
              </div>
            </article>
          );
        })}
        {!results.length && (
          <div className="reference-empty">
            <Search size={20} aria-hidden="true" />
            <strong>No matching upstream review.</strong>
            <span>Try a broader query, another review decision, or a different material-change state.</span>
          </div>
        )}
      </section>
    </main>
  );
}