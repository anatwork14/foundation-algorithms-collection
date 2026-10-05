import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, GitBranch, RefreshCcw } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import { implementationUpstreamReviews } from "@/lib/implementation-upstream-reviews";
import { getImplementation } from "@/lib/implementations";

export const metadata: Metadata = {
  title: "Implementation Upstream Reviews",
  description: "Inspect append-only decisions about upstream implementation movement without changing immutable evidence pins automatically.",
};

export default function ImplementationReviewsPage() {
  const reviews = [...implementationUpstreamReviews].sort((a, b) => {
    if (a.reviewedAt !== b.reviewedAt) return b.reviewedAt.localeCompare(a.reviewedAt);
    if (a.implementationId !== b.implementationId) return a.implementationId.localeCompare(b.implementationId);
    return b.revision - a.revision;
  });
  const retainCount = reviews.filter((review) => review.decision === "Retain pin").length;
  const advanceCount = reviews.filter((review) => review.decision === "Advance pin").length;
  const followUpCount = reviews.filter((review) => review.decision === "Needs follow-up").length;

  return (
    <main className="evidence-hub shell">
      <header className="evidence-hub-hero">
        <span className="eyebrow"><RefreshCcw size={13} aria-hidden="true" /> Upstream implementation review</span>
        <h1>Review branch movement without rewriting evidence history.</h1>
        <p>
          Each record preserves a human-reviewed comparison between an immutable implementation pin and a later upstream commit. Review decisions remain separate from verification history so branch movement never advances an evidence snapshot automatically.
        </p>
        <EvidenceNav current="implementation-reviews" />
      </header>

      <section className="evidence-summary" aria-label="Upstream review coverage">
        <div><strong>{reviews.length}</strong><span>review revisions</span></div>
        <div><strong>{retainCount}</strong><span>retain-pin decisions</span></div>
        <div><strong>{advanceCount}</strong><span>advance-pin decisions</span></div>
        <div><strong>{followUpCount}</strong><span>needs-follow-up decisions</span></div>
      </section>

      <section className="implementation-list" aria-label="Implementation upstream review records">
        {reviews.map((review) => {
          const implementation = getImplementation(review.implementationId);
          if (!implementation) return null;
          return (
            <article key={`${review.implementationId}-${review.revision}`} className="implementation-row">
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
              </div>
              <div className="implementation-row-meta">
                <span>Pinned <code>{review.pinnedCommit.slice(0, 12)}</code></span>
                <span>Observed <code>{review.observedCommit.slice(0, 12)}</code></span>
                <Link href={`/implementations/${implementation.id}`}>Inspect implementation <ArrowRight size={13} aria-hidden="true" /></Link>
                <a href={`${implementation.repository}/compare/${review.pinnedCommit}...${review.observedCommit}`} target="_blank" rel="noreferrer"><GitBranch size={13} aria-hidden="true" /> Compare commits <ExternalLink size={11} aria-hidden="true" /></a>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}