import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, ExternalLink, GitBranch, ShieldCheck } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { upstreamReviewsForImplementation } from "@/lib/implementation-upstream-reviews";
import { verificationHistoryForImplementation } from "@/lib/implementation-verification-catalog";
import { getImplementation, implementationCommitUrl, implementations } from "@/lib/implementations";

export function generateStaticParams() {
  return implementations.map((implementation) => ({ id: implementation.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const implementation = getImplementation(id);
  if (!implementation) return { title: "Implementation" };
  return { title: implementation.name, description: implementation.summary };
}

export default async function ImplementationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const implementation = getImplementation(id);
  if (!implementation) notFound();

  const linkedAlgorithms = implementation.algorithmIds.map(getAlgorithm).filter((item) => Boolean(item));
  const commitUrl = implementationCommitUrl(implementation);
  const verificationHistory = verificationHistoryForImplementation(implementation.id);
  const upstreamReviews = upstreamReviewsForImplementation(implementation.id);

  return (
    <main className="implementation-detail-page">
      <div className="shell reference-breadcrumbs">
        <Link href="/implementations"><ArrowLeft size={14} aria-hidden="true" /> Implementations</Link>
        <span>/</span>
        <span>{implementation.language}</span>
      </div>

      <header className="shell implementation-detail-hero">
        <div>
          <span className="reference-detail-kind">{implementation.maturity} · {implementation.language}</span>
          <h1>{implementation.name}</h1>
          <p>{implementation.summary}</p>
        </div>
        <aside className="reference-detail-meta" aria-label="Implementation metadata">
          <div><span>License</span><strong>{implementation.license}</strong></div>
          <div><span>Interfaces</span><strong>{implementation.interfaces.join(" · ")}</strong></div>
          <div><span>Algorithms</span><strong>{implementation.algorithmIds.length}</strong></div>
          <div><span>Verified ref</span><strong>{implementation.verifiedRef}</strong></div>
          <div><span>Verified commit</span><strong><code>{implementation.verifiedCommit.slice(0, 12)}</code></strong></div>
          <div><span>Verification revisions</span><strong>{verificationHistory.length}</strong></div>
          <div><span>Upstream reviews</span><strong>{upstreamReviews.length}</strong></div>
          <div><span>Verified</span><strong>{implementation.lastVerified}</strong></div>
        </aside>
      </header>

      <div className="shell implementation-detail-layout">
        <article>
          <section className="research-block">
            <div className="research-block-label">01 · Implementation notes</div>
            <h2>What to inspect</h2>
            <ul>{implementation.implementationNotes.map((note) => <li key={note}>{note}</li>)}</ul>
          </section>

          <section className="research-block">
            <div className="research-block-label">02 · Source locations</div>
            <h2>Jump into the pinned code</h2>
            <p>These links are immutable snapshots at the verified commit, not floating branch URLs.</p>
            <div className="implementation-source-list">
              {implementation.sourcePaths.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                  <GitBranch size={14} aria-hidden="true" />
                  <span>{source.label}</span>
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

          <section className="research-block">
            <div className="research-block-label">03 · Repository revision</div>
            <h2>Reproduce the inspected code state</h2>
            <div className="implementation-repository-links">
              <a href={commitUrl} target="_blank" rel="noreferrer"><GitBranch size={15} aria-hidden="true" /> Commit {implementation.verifiedCommit.slice(0, 12)} <ExternalLink size={13} aria-hidden="true" /></a>
              <a href={implementation.repository} target="_blank" rel="noreferrer"><Code2 size={15} aria-hidden="true" /> Open repository <ExternalLink size={13} aria-hidden="true" /></a>
              {implementation.homepage && <a href={implementation.homepage} target="_blank" rel="noreferrer">Project homepage <ExternalLink size={13} aria-hidden="true" /></a>}
            </div>
          </section>

          <section className="research-block">
            <div className="research-block-label">04 · Verification history</div>
            <h2>Preserve each inspected code snapshot</h2>
            <p className="implementation-verification-intro">Verification history is append-only provenance. A newer review may become the current pin, but earlier inspected commits and source paths remain visible instead of being overwritten.</p>
            <ol className="implementation-verification-history" aria-label="Implementation verification history">
              {verificationHistory.map((entry) => (
                <li key={entry.revision}>
                  <div className="implementation-verification-marker" aria-hidden="true">r{entry.revision}</div>
                  <div className="implementation-verification-content">
                    <div className="implementation-verification-meta">
                      <time dateTime={entry.verifiedAt}>{entry.verifiedAt}</time>
                      <span>{entry.verifiedRef}</span>
                      <a href={`${implementation.repository}/commit/${entry.verifiedCommit}`} target="_blank" rel="noreferrer"><code>{entry.verifiedCommit.slice(0, 12)}</code> <ExternalLink size={11} aria-hidden="true" /></a>
                    </div>
                    <p>{entry.note}</p>
                    <div className="implementation-verification-sources" aria-label={`Source paths for verification revision ${entry.revision}`}>
                      {entry.sourcePaths.map((source) => (
                        <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={11} aria-hidden="true" /></a>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {upstreamReviews.length > 0 && (
            <section className="research-block">
              <div className="research-block-label">05 · Upstream review history</div>
              <h2>Upstream review ledger</h2>
              <p className="implementation-verification-intro">Upstream reviews are append-only decisions about branch movement. They do not rewrite the immutable evidence pin unless a separate verification revision deliberately advances the snapshot.</p>
              <ol className="implementation-verification-history" aria-label="Implementation upstream review history">
                {upstreamReviews.map((review) => (
                  <li key={review.revision}>
                    <div className="implementation-verification-marker" aria-hidden="true">u{review.revision}</div>
                    <div className="implementation-verification-content">
                      <div className="implementation-verification-meta">
                        <time dateTime={review.reviewedAt}>{review.reviewedAt}</time>
                        <span>{review.observedRef}</span>
                        <a href={`${implementation.repository}/commit/${review.observedCommit}`} target="_blank" rel="noreferrer"><code>{review.observedCommit.slice(0, 12)}</code> <ExternalLink size={11} aria-hidden="true" /></a>
                      </div>
                      <p><strong>{review.decision}</strong> · {review.materialChange ? "Material change observed in the inspected implementation paths." : "No material change observed in the inspected implementation paths."}</p>
                      <p>{review.note}</p>
                      <div className="implementation-repository-links">
                        <a href={`${implementation.repository}/compare/${review.pinnedCommit}...${review.observedCommit}`} target="_blank" rel="noreferrer"><GitBranch size={15} aria-hidden="true" /> Compare pinned → observed <ExternalLink size={13} aria-hidden="true" /></a>
                      </div>
                      <div className="implementation-verification-sources" aria-label={`Inspected paths for upstream review ${review.revision}`}>
                        {review.inspectedPaths.flatMap((source) => [
                          <a key={`${source.path}-pinned`} href={`${implementation.repository}/blob/${review.pinnedCommit}/${source.path}`} target="_blank" rel="noreferrer">Pinned {source.path} · <code>{source.pinnedBlob.slice(0, 10)}</code> <ExternalLink size={11} aria-hidden="true" /></a>,
                          <a key={`${source.path}-observed`} href={`${implementation.repository}/blob/${review.observedCommit}/${source.path}`} target="_blank" rel="noreferrer">Observed {source.path} · <code>{source.upstreamBlob.slice(0, 10)}</code>{source.changed ? " · changed" : " · unchanged"} <ExternalLink size={11} aria-hidden="true" /></a>,
                        ])}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>

        <aside className="reference-detail-side">
          <div className="entity-side-card">
            <div className="entity-side-title"><Code2 size={14} aria-hidden="true" /> Implements</div>
            {linkedAlgorithms.map((algorithm) => algorithm && (
              <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`} className="relation-link">
                <span>{algorithm.fields[0]}</span>
                <strong>{algorithm.name}</strong>
                <small>{algorithm.summary}</small>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="entity-side-card provenance-card">
            <div className="entity-side-title"><ShieldCheck size={14} aria-hidden="true" /> Registry provenance</div>
            <p>Repository metadata and implementation paths are curated records. The current inspected revision is pinned to <code>{implementation.verifiedCommit}</code> from <strong>{implementation.verifiedRef}</strong>, verified {implementation.lastVerified}. {verificationHistory.length} verification revision{verificationHistory.length === 1 ? " is" : "s are"} preserved. {upstreamReviews.length} upstream review revision{upstreamReviews.length === 1 ? " is" : "s are"} preserved separately from the evidence pin.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}