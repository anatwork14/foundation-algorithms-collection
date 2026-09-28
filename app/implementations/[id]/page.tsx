import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, ExternalLink, GitBranch, ShieldCheck } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { getImplementation, implementations } from "@/lib/implementations";

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

  return (
    <main className="implementation-detail-page">
      <div className="shell reference-breadcrumbs">
        <Link href="/implementations"><ArrowLeft size={14} /> Implementations</Link>
        <span>/</span>
        <span>{implementation.language}</span>
      </div>

      <header className="shell implementation-detail-hero">
        <div>
          <span className="reference-detail-kind">{implementation.maturity} · {implementation.language}</span>
          <h1>{implementation.name}</h1>
          <p>{implementation.summary}</p>
        </div>
        <aside className="reference-detail-meta">
          <div><span>License</span><strong>{implementation.license}</strong></div>
          <div><span>Interfaces</span><strong>{implementation.interfaces.join(" · ")}</strong></div>
          <div><span>Algorithms</span><strong>{implementation.algorithmIds.length}</strong></div>
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
            <h2>Jump into the code</h2>
            <div className="implementation-source-list">
              {implementation.sourcePaths.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                  <GitBranch size={14} />
                  <span>{source.label}</span>
                  <ExternalLink size={13} />
                </a>
              ))}
            </div>
          </section>

          <section className="research-block">
            <div className="research-block-label">03 · Repository</div>
            <h2>Project context</h2>
            <div className="implementation-repository-links">
              <a href={implementation.repository} target="_blank" rel="noreferrer"><Code2 size={15} /> Open repository <ExternalLink size={13} /></a>
              {implementation.homepage && <a href={implementation.homepage} target="_blank" rel="noreferrer">Project homepage <ExternalLink size={13} /></a>}
            </div>
          </section>
        </article>

        <aside className="reference-detail-side">
          <div className="entity-side-card">
            <div className="entity-side-title"><Code2 size={14} /> Implements</div>
            {linkedAlgorithms.map((algorithm) => algorithm && (
              <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`} className="relation-link">
                <span>{algorithm.fields[0]}</span>
                <strong>{algorithm.name}</strong>
                <small>{algorithm.summary}</small>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>

          <div className="entity-side-card provenance-card">
            <div className="entity-side-title"><ShieldCheck size={14} /> Registry provenance</div>
            <p>Repository metadata and implementation paths are curated records. Verification date: {implementation.lastVerified}.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
