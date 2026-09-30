import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Network, RefreshCcw, ShieldCheck } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { getReference } from "@/lib/references";
import { getReplication, replications } from "@/lib/replications";

export function generateStaticParams() {
  return replications.map((record) => ({ id: record.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const record = getReplication(id);
  if (!record) return { title: "Independent Replication" };
  return {
    title: record.title,
    description: record.summary,
  };
}

export default async function ReplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getReplication(id);
  if (!record) notFound();

  const evaluation = getReference(record.replicationReferenceId);
  const originals = record.originalReferenceIds
    .map(getReference)
    .filter((reference) => Boolean(reference));
  const algorithms = record.algorithmIds
    .map(getAlgorithm)
    .filter((algorithm) => Boolean(algorithm));

  return (
    <main className="reference-detail-page">
      <div className="shell reference-breadcrumbs">
        <Link href="/replications"><ArrowLeft size={14} aria-hidden="true" /> Independent replications</Link>
        <span>/</span>
        <span>{record.id}</span>
      </div>

      <header className="shell reference-detail-hero">
        <div>
          <span className="reference-detail-kind">Independent evaluation · {record.outcome}</span>
          <h1>{record.title}</h1>
          <p>{record.summary}</p>
        </div>
        <aside className="reference-detail-meta" aria-label="Replication metadata">
          <div><span>Outcome</span><strong>{record.outcome}</strong></div>
          <div><span>Verified</span><strong>{record.verifiedAt}</strong></div>
          <div><span>Algorithms</span><strong>{record.algorithmIds.length}</strong></div>
          <div><span>Independent sources</span><strong>{evaluation ? 1 : 0}</strong></div>
          <div><span>Original sources</span><strong>{originals.length}</strong></div>
        </aside>
      </header>

      <div className="shell reference-detail-layout">
        <article className="reference-detail-main">
          <section className="research-block">
            <div className="research-block-label">01 · Interpretation</div>
            <h2>What this record says—and what it does not</h2>
            <p>{record.summary}</p>
            <p>
              The outcome is stored separately from the archive&apos;s `Replicated` evidence stage. A replicated stage means an explicit independent evaluation record exists; it does not convert the result into a truth score or imply that every original claim was reproduced.
            </p>
          </section>

          <section className="research-block">
            <div className="research-block-label">02 · Independence</div>
            <h2>Why this counts as independent evaluation</h2>
            <p>{record.independenceNote}</p>
          </section>

          <section className="research-block">
            <div className="research-block-label">03 · Evaluation source</div>
            <h2>Follow the independently authored evidence</h2>
            {evaluation ? (
              <div className="reference-source-box">
                <Link href={`/references/${evaluation.id}`}>
                  <BookOpen size={15} aria-hidden="true" /> Inspect curated source record
                </Link>
                <a href={evaluation.url} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} aria-hidden="true" /> Open primary publication
                </a>
              </div>
            ) : (
              <p>The independently authored source is not available in the curated Reference catalog.</p>
            )}
          </section>

          <section className="research-block">
            <div className="research-block-label">04 · Original sources</div>
            <h2>What is being independently evaluated</h2>
            <div className="reference-connection-grid">
              {originals.map((reference) => reference && (
                <Link key={reference.id} href={`/references/${reference.id}`}>
                  <span><ShieldCheck size={13} aria-hidden="true" /> {reference.evidenceRole}</span>
                  <strong>{reference.title}</strong>
                  <p>{reference.summary}</p>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </article>

        <aside className="reference-detail-side">
          <div className="entity-side-card">
            <div className="entity-side-title"><Network size={14} aria-hidden="true" /> Algorithms evaluated</div>
            {algorithms.map((algorithm) => algorithm && (
              <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`} className="entity-reference-link">
                <span>{algorithm.maturity}</span>
                <strong>{algorithm.name}</strong>
                <small>{algorithm.summary}</small>
              </Link>
            ))}
          </div>

          {evaluation && (
            <div className="entity-side-card">
              <div className="entity-side-title"><RefreshCcw size={14} aria-hidden="true" /> Independent evaluation</div>
              <Link href={`/references/${evaluation.id}`} className="entity-reference-link">
                <span>{evaluation.year} · {evaluation.evidenceRole}</span>
                <strong>{evaluation.title}</strong>
                <small>{evaluation.venue ?? evaluation.authors[0]}</small>
              </Link>
            </div>
          )}

          <div className="entity-side-card provenance-card">
            <div className="entity-side-title"><ShieldCheck size={14} aria-hidden="true" /> Evidence discipline</div>
            <p>
              This record links a distinct independent evaluation source to explicit original sources and preserves the evaluation outcome separately from evidence-stage coverage.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
