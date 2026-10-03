import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { algorithmVariants, getAlgorithmVariant, variantsForAlgorithm } from "@/lib/algorithm-variants";
import { fieldKey } from "@/lib/taxonomy";

export function generateStaticParams() {
  return algorithmVariants.map((variant) => ({
    id: variant.parentAlgorithmId,
    variantId: variant.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}): Promise<Metadata> {
  const { id, variantId } = await params;
  const parent = getAlgorithm(id);
  const variant = getAlgorithmVariant(variantId);
  if (!parent || !variant || variant.parentAlgorithmId !== parent.id) return { title: "Algorithm variant" };

  return {
    title: `${variant.name} — ${parent.name}`,
    description: variant.summary,
  };
}

export default async function AlgorithmVariantPage({
  params,
}: {
  params: Promise<{ id: string; variantId: string }>;
}) {
  const { id, variantId } = await params;
  const parent = getAlgorithm(id);
  const variant = getAlgorithmVariant(variantId);

  if (!parent || !variant || variant.parentAlgorithmId !== parent.id) notFound();

  const siblings = variantsForAlgorithm(parent.id).filter((candidate) => candidate.id !== variant.id);
  const maturity = variant.maturity ?? parent.maturity;

  return (
    <main className="algorithm-detail-page">
      <div className="shell entity-breadcrumbs">
        <Link href="/algorithms"><ArrowLeft size={14} /> Algorithms</Link>
        <span>/</span>
        <Link href={`/algorithms/${parent.id}`}>{parent.name}</Link>
        <span>/</span>
        <span>{variant.name}</span>
      </div>

      <header className="shell algorithm-hero">
        <div className="algorithm-hero-main">
          <div className="algorithm-field-line">
            {parent.fields.map((field) => (
              <span key={field} className={`algorithm-field field-outline-${fieldKey(field)}`}>{field}</span>
            ))}
            <span className="algorithm-field">Variant</span>
          </div>
          <h1>{variant.name}</h1>
          {variant.aliases.length > 0 && <div className="algorithm-aliases">{variant.aliases.join(" · ")}</div>}
          <p>{variant.summary}</p>
        </div>

        <aside className="algorithm-summary-panel">
          <div><span>Parent algorithm</span><strong>{parent.name}</strong></div>
          <div><span>Maturity</span><strong>{maturity}</strong></div>
          <div><span>Source sections</span><strong>{variant.sourceLinks.length}</strong></div>
          <div><span>Sibling variants</span><strong>{siblings.length}</strong></div>
        </aside>
      </header>

      <div className="shell algorithm-layout">
        <article className="algorithm-main">
          <section className="research-block" id="distinction">
            <div className="research-block-label">01 · Distinction</div>
            <h2>What changes from {parent.name}</h2>
            <p>{variant.distinction}</p>
          </section>

          <section className="research-block" id="assumptions">
            <div className="research-block-label">02 · Assumptions</div>
            <h2>What this formulation relies on</h2>
            <ul>{variant.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className="research-block" id="tradeoffs">
            <div className="research-block-label">03 · Tradeoffs</div>
            <h2>What you gain and pay for</h2>
            <ul>{variant.tradeoffs.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          {variant.complexityNote && (
            <section className="research-block" id="complexity">
              <div className="research-block-label">04 · Complexity</div>
              <h2>How the cost model changes</h2>
              <div className="complexity-grid">
                <div className="complexity-note"><span>Variant note</span><p>{variant.complexityNote}</p></div>
              </div>
            </section>
          )}

          <section className="research-block" id="implementation">
            <div className="research-block-label">05 · Implementation</div>
            <h2>How to build this variant</h2>
            <ol>{variant.implementationNotes.map((item) => <li key={item}>{item}</li>)}</ol>
          </section>
        </article>

        <aside className="algorithm-side">
          <div className="entity-side-card">
            <div className="entity-side-title"><Layers3 size={14} /> Parent algorithm</div>
            <Link href={`/algorithms/${parent.id}`} className="relation-link">
              <span>parent mechanism</span>
              <strong>{parent.name}</strong>
              <small>{parent.summary}</small>
              <ArrowRight size={14} />
            </Link>
          </div>

          {siblings.length > 0 && (
            <div className="entity-side-card">
              <div className="entity-side-title"><Layers3 size={14} /> Sibling variants</div>
              {siblings.map((sibling) => (
                <Link
                  key={sibling.id}
                  href={`/algorithms/${parent.id}/variants/${sibling.id}`}
                  className="relation-link"
                >
                  <span>same parent</span>
                  <strong>{sibling.name}</strong>
                  <small>{sibling.summary}</small>
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          )}

          <div className="entity-side-card">
            <div className="entity-side-title"><BookOpen size={14} /> Source sections</div>
            {variant.sourceLinks.map((source) => (
              <Link
                key={`${source.chapterSlug}-${source.anchor}`}
                href={`/archive/${source.chapterSlug}#${source.anchor}`}
                className="source-section-link"
              >
                <span>chapter source</span>
                <strong>{source.label}</strong>
                <small>{source.chapterSlug}</small>
                <ArrowRight size={13} />
              </Link>
            ))}
          </div>

          <div className="entity-side-card entity-tags-card">
            <div className="entity-side-title"><Layers3 size={14} /> Variant tags</div>
            <div className="entity-tags">{variant.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>

          <div className="entity-side-card provenance-card">
            <div className="entity-side-title"><BookOpen size={14} /> Provenance</div>
            <p>Variant metadata is subordinate to the parent Algorithm and must resolve to explicit chapter headings. A variant is not promoted to a separate Algorithm unless it develops its own independent conceptual identity, evidence graph, or research lineage.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
