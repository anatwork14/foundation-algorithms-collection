import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, FlaskConical, Network, ScrollText, ShieldCheck } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { claimsForReference } from "@/lib/claims";
import { combinations } from "@/lib/combination-catalog";
import { getAllDocuments } from "@/lib/content";
import { formatReferenceAuthors, getCitation, getCitedReferences, getCitingReferences, getReference, references } from "@/lib/references";
import { relationProvenanceForReference } from "@/lib/relation-provenance";

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
  const claimRecords = claimsForReference(reference.id);
  const relationEvidenceRecords = relationProvenanceForReference(reference.id).map((record) => ({
    record,
    source: getAlgorithm(record.sourceId),
    target: getAlgorithm(record.targetId),
  }));
  const citedReferences = getCitedReferences(reference);
  const citingReferences = getCitingReferences(reference.id);

  return (
    <main className="reference-detail-page">
      <div className="shell reference-breadcrumbs">
        <Link href="/references"><ArrowLeft size={14} /> References</Link>
        <span>/</span>
        <span>{reference.year}</span>
      </div>

      <header className="shell reference-detail-hero">
        <div>
          <span className="reference-detail-kind">{reference.evidenceRole} · {reference.kind}{reference.venue ? ` · ${reference.venue}` : ""}</span>
          <h1>{reference.title}</h1>
          <p className="reference-detail-authors">{formatReferenceAuthors(reference, 12)}</p>
          <p>{reference.summary}</p>
        </div>
        <aside className="reference-detail-meta">
          <div><span>Year</span><strong>{reference.year}</strong></div>
          <div><span>Evidence role</span><strong>{reference.evidenceRole}</strong></div>
          <div><span>Algorithms</span><strong>{reference.algorithmIds.length}</strong></div>
          <div><span>Curated claims</span><strong>{claimRecords.length}</strong></div>
          <div><span>Atlas edges supported</span><strong>{relationEvidenceRecords.length}</strong></div>
          <div><span>Lab records</span><strong>{reference.combinationIds.length}</strong></div>
          <div><span>Curated citations</span><strong>{citedReferences.length}</strong></div>
          <div><span>Curated citing sources</span><strong>{citingReferences.length}</strong></div>
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

          {(citedReferences.length > 0 || citingReferences.length > 0) && (
            <section className="research-block">
              <div className="research-block-label">03 · Citation neighborhood</div>
              <h2>How this curated source connects to other sources</h2>
              <p>These are explicit citation edges verified inside the current curated reference set. The graph is intentionally incomplete rather than inferred.</p>
              <div className="reference-citation-list">
                {citedReferences.map((cited) => {
                  const citation = getCitation(reference, cited.id);
                  if (!citation) return null;
                  return (
                    <div key={`cites-${cited.id}`} className="reference-citation-entry">
                      <Link href={`/references/${cited.id}`} className="reference-citation-link">
                        <span>Cites · {cited.year}</span>
                        <strong>{cited.title}</strong>
                        <small>{cited.evidenceRole}</small>
                        <ArrowRight size={13} />
                      </Link>
                      <p>{citation.note}</p>
                      <a href={citation.verificationUrl} target="_blank" rel="noreferrer">Verification source · checked {citation.verifiedAt} ↗</a>
                    </div>
                  );
                })}
                {citingReferences.map((citing) => {
                  const citation = getCitation(citing, reference.id);
                  if (!citation) return null;
                  return (
                    <div key={`cited-by-${citing.id}`} className="reference-citation-entry">
                      <Link href={`/references/${citing.id}`} className="reference-citation-link">
                        <span>Cited by · {citing.year}</span>
                        <strong>{citing.title}</strong>
                        <small>{citing.evidenceRole}</small>
                        <ArrowRight size={13} />
                      </Link>
                      <p>{citation.note}</p>
                      <a href={citation.verificationUrl} target="_blank" rel="noreferrer">Verification source · checked {citation.verifiedAt} ↗</a>
                    </div>
                  );
                })}
              </div>
              <Link href="/references/graph" className="reference-graph-link"><Network size={14} /> Explore focused citation graph <ArrowRight size={13} /></Link>
            </section>
          )}

          <section className="research-block">
            <div className="research-block-label">04 · Research connections</div>
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
          {claimRecords.length > 0 && (
            <div className="entity-side-card">
              <div className="entity-side-title"><ShieldCheck size={14} /> Curated claims using this source</div>
              {claimRecords.map((claim) => (
                <Link key={claim.id} href={`/claims#${claim.id}`} className="entity-reference-link">
                  <span>{claim.kind}</span>
                  <strong>{claim.statement}</strong>
                  <small>Unique passage + reference assertion</small>
                </Link>
              ))}
            </div>
          )}

          {relationEvidenceRecords.length > 0 && (
            <div className="entity-side-card relation-evidence-card">
              <div className="entity-side-title"><Network size={14} /> Atlas relations using this source</div>
              {relationEvidenceRecords.map(({ record, source, target }) => (
                <Link
                  key={`${record.sourceId}-${record.relationType}-${record.targetId}`}
                  href={`/algorithms/${record.sourceId}`}
                  className="entity-reference-link"
                >
                  <span>{record.relationType.replaceAll("-", " ")} · verified {record.verifiedAt}</span>
                  <strong>{source?.name ?? record.sourceId} → {target?.name ?? record.targetId}</strong>
                  <small>{record.evidenceNote}</small>
                </Link>
              ))}
            </div>
          )}

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
