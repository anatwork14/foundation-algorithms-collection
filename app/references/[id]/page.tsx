import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, FlaskConical, Network, ScrollText } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { combinations } from "@/lib/combination-catalog";
import { getAllDocuments } from "@/lib/content";
import { formatReferenceAuthors, getReference, references } from "@/lib/references";

export function generateStaticParams() {
  return references.map((reference) => ({ id: reference.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const reference = getReference(id);
  if (!reference) return { title: "Reference" };
  return {
    title: reference.title,
    description: reference.summary,
  };
}

export default async function ReferenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reference = getReference(id);
  if (!reference) notFound();

  const documents = getAllDocuments();
  const linkedAlgorithms = reference.algorithmIds.map(getAlgorithm).filter((item) => Boolean(item));
  const linkedCombinations = reference.combinationIds
    .map((combinationId) => combinations.find((combination) => combination.id === combinationId))
    .filter((item) => Boolean(item));
  const linkedChapters = reference.chapterSlugs
    .map((slug) => documents.find((document) => document.slug === slug))
    .filter((item) => Boolean(item));

  return (
    <main className="reference-detail-page">
      <div className="shell reference-breadcrumbs">
        <Link href="/references"><ArrowLeft size={14} /> References</Link>
        <span>/</span>
        <span>{reference.year}</span>
      </div>

      <header className="shell reference-detail-hero">
        <div>
          <span className="reference-detail-kind">{reference.kind}{reference.venue ? ` · ${reference.venue}` : ""}</span>
          <h1>{reference.title}</h1>
          <p className="reference-detail-authors">{formatReferenceAuthors(reference, 12)}</p>
          <p>{reference.summary}</p>
        </div>
        <aside className="reference-detail-meta">
          <div><span>Year</span><strong>{reference.year}</strong></div>
          <div><span>Algorithms</span><strong>{reference.algorithmIds.length}</strong></div>
          <div><span>Lab records</span><strong>{reference.combinationIds.length}</strong></div>
          <div><span>Chapters</span><strong>{reference.chapterSlugs.length}</strong></div>
        </aside>
      </header>

      <div className="shell reference-detail-layout">
        <article className="reference-detail-main">
          <section className="research-block">
            <div className="research-block-label">01 · Why this source matters</div>
            <h2>Research significance</h2>
            <p>{reference.significance}</p>
          </section>

          <section className="research-block">
            <div className="research-block-label">02 · Primary source</div>
            <h2>Follow the evidence</h2>
            <div className="reference-source-box">
              <a href={reference.url} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> Open primary source
              </a>
              {reference.doi && <code>DOI {reference.doi}</code>}
            </div>
          </section>

          <section className="research-block">
            <div className="research-block-label">03 · Research connections</div>
            <h2>Where this source enters the knowledge graph</h2>
            <div className="reference-connection-grid">
              {linkedAlgorithms.map((algorithm) => algorithm && (
                <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`}>
                  <span><Network size={13} /> Algorithm</span>
                  <strong>{algorithm.name}</strong>
                  <p>{algorithm.summary}</p>
                  <ArrowRight size={14} />
                </Link>
              ))}
              {linkedCombinations.map((combination) => combination && (
                <Link key={combination.id} href={`/lab#${combination.id}`}>
                  <span><FlaskConical size={13} /> Lab hypothesis</span>
                  <strong>{combination.title}</strong>
                  <p>{combination.hypothesis}</p>
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </section>
        </article>

        <aside className="reference-detail-side">
          <div className="entity-side-card">
            <div className="entity-side-title"><BookOpen size={14} /> Source chapters</div>
            {linkedChapters.map((chapter) => chapter && (
              <Link key={chapter.slug} href={`/archive/${chapter.slug}`} className="source-chapter-link">
                <span>{chapter.number}</span>
                <strong>{chapter.title}</strong>
                <small>{chapter.minutes} min read</small>
              </Link>
            ))}
          </div>

          <div className="entity-side-card entity-tags-card">
            <div className="entity-side-title"><ScrollText size={14} /> Evidence tags</div>
            <div className="entity-tags">{reference.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
