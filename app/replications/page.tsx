import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, RefreshCcw, Search } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { getReference } from "@/lib/references";
import { replications } from "@/lib/replications";

export const metadata: Metadata = {
  title: "Independent Replications",
  description: "Inspect independently authored replication and evaluation records linked to curated algorithms and original sources.",
};

export default function ReplicationsPage() {
  return (
    <main className="evidence-hub shell">
      <header className="evidence-hub-hero">
        <span className="eyebrow"><RefreshCcw size={13} aria-hidden="true" /> Independent replication</span>
        <h1>Replication is an evidence layer, not a badge.</h1>
        <p>
          This surface records independently authored replication or evaluation evidence only after direct source verification. A record may support, contradict, partially support, or leave the original finding inconclusive.
        </p>
        <EvidenceNav current="replications" />
      </header>

      <section className="evidence-summary" aria-label="Replication coverage">
        <div><strong>{replications.length}</strong><span>replication records</span></div>
        <div><strong>{new Set(replications.flatMap((record) => record.algorithmIds)).size}</strong><span>algorithms independently evaluated</span></div>
        <div><strong>{new Set(replications.map((record) => record.replicationReferenceId)).size}</strong><span>independent sources</span></div>
      </section>

      {replications.length ? (
        <section className="implementation-list" aria-label="Independent replication records">
          {replications.map((record) => {
            const source = getReference(record.replicationReferenceId);
            const algorithms = record.algorithmIds.map(getAlgorithm).filter((item) => Boolean(item));
            return (
              <article key={record.id} id={record.id} className="implementation-row">
                <div className="implementation-language">REP</div>
                <div>
                  <div className="implementation-overline">{record.outcome} · verified {record.verifiedAt}</div>
                  <h2><Link href={`/replications/${record.id}`}>{record.title}</Link></h2>
                  <p>{record.summary}</p>
                  <p>{record.independenceNote}</p>
                  <div className="implementation-tags">
                    {algorithms.map((algorithm) => algorithm && <span key={algorithm.id}>{algorithm.name}</span>)}
                  </div>
                </div>
                <div className="implementation-row-meta">
                  <Link href={`/replications/${record.id}`}>Inspect record <ArrowRight size={13} aria-hidden="true" /></Link>
                  {source && <Link href={`/references/${source.id}`}>Independent source <ArrowRight size={13} aria-hidden="true" /></Link>}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="reference-empty" aria-live="polite">
          <Search size={22} aria-hidden="true" />
          <strong>No independent replication record is curated yet.</strong>
          <span>The archive intentionally shows zero rather than inferring replication from a second implementation, a related paper, or this project&apos;s own experiment.</span>
        </section>
      )}
    </main>
  );
}
