import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Beaker, BookOpen, Code2, FlaskConical, GitBranch, Layers3, ScrollText, ShieldCheck } from "lucide-react";
import { algorithms, getAlgorithm, getRelatedAlgorithms } from "@/lib/algorithm-catalog";
import { combinations } from "@/lib/combination-catalog";
import { getAllDocuments } from "@/lib/content";
import { experimentsForAlgorithm } from "@/lib/experiments";
import { implementationsForAlgorithm } from "@/lib/implementations";
import { referencesForAlgorithm } from "@/lib/references";
import { getAlgorithmSourceSections } from "@/lib/source-provenance";
import { fieldKey } from "@/lib/taxonomy";

export function generateStaticParams() {
  return algorithms.map((algorithm) => ({ id: algorithm.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const algorithm = getAlgorithm(id);
  if (!algorithm) return { title: "Algorithm" };
  return { title: algorithm.name, description: algorithm.summary };
}

export default async function AlgorithmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const algorithm = getAlgorithm(id);
  if (!algorithm) notFound();

  const documents = getAllDocuments();
  const sources = algorithm.chapterSlugs
    .map((slug) => documents.find((doc) => doc.slug === slug))
    .filter((doc) => Boolean(doc));
  const sourceSections = getAlgorithmSourceSections(algorithm);
  const related = getRelatedAlgorithms(algorithm);
  const inbound = algorithms
    .flatMap((candidate) => candidate.relations
      .filter((relation) => relation.target === algorithm.id)
      .map((relation) => ({ algorithm: candidate, relation })))
    .filter((item) => !related.some((direct) => direct.algorithm.id === item.algorithm.id));
  const labMatches = combinations.filter((combination) => combination.algorithmIds.includes(algorithm.id));
  const primaryReferences = referencesForAlgorithm(algorithm.id);
  const implementationRecords = implementationsForAlgorithm(algorithm.id);
  const experimentRecords = experimentsForAlgorithm(algorithm.id);

  return (
    <main className="algorithm-detail-page">
      <div className="shell entity-breadcrumbs">
        <Link href="/algorithms"><ArrowLeft size={14} /> Algorithms</Link>
        <span>/</span>
        <span>{algorithm.name}</span>
      </div>

      <header className="shell algorithm-hero">
        <div className="algorithm-hero-main">
          <div className="algorithm-field-line">
            {algorithm.fields.map((field) => (
              <span key={field} className={`algorithm-field field-outline-${fieldKey(field)}`}>{field}</span>
            ))}
          </div>
          <h1>{algorithm.name}</h1>
          {algorithm.aliases.length > 0 && <div className="algorithm-aliases">{algorithm.aliases.join(" · ")}</div>}
          <p>{algorithm.summary}</p>
        </div>
        <aside className="algorithm-summary-panel">
          <div><span>Maturity</span><strong>{algorithm.maturity}</strong></div>
          <div><span>Families</span><strong>{algorithm.families.join(" · ")}</strong></div>
          <div><span>Relations</span><strong>{algorithm.relations.length + inbound.length}</strong></div>
          <div><span>Source sections</span><strong>{sourceSections.length}</strong></div>
          <div><span>References</span><strong>{primaryReferences.length}</strong></div>
          <div><span>Implementations</span><strong>{implementationRecords.length}</strong></div>
          <div><span>Experiments</span><strong>{experimentRecords.length}</strong></div>
          <div><span>Lab hypotheses</span><strong>{labMatches.length}</strong></div>
          <div><span>Source chapters</span><strong>{algorithm.chapterSlugs.length}</strong></div>
        </aside>
      </header>

      <div className="shell algorithm-layout">
        <article className="algorithm-main">
          <section className="research-block" id="motivation">
            <div className="research-block-label">01 · Motivation</div>
            <h2>Why this exists</h2>
            <p>{algorithm.motivation}</p>
          </section>

          <section className="research-block" id="contribution">
            <div className="research-block-label">02 · Contribution</div>
            <h2>What it adds</h2>
            <p>{algorithm.contribution}</p>
          </section>

          <section className="research-block" id="assumptions">
            <div className="research-block-label">03 · Assumptions</div>
            <h2>What must be true</h2>
            <ul>{algorithm.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          {algorithm.complexity && (
            <section className="research-block" id="complexity">
              <div className="research-block-label">04 · Complexity</div>
              <h2>Cost model</h2>
              <div className="complexity-grid">
                {algorithm.complexity.time && <div><span>Time</span><code>{algorithm.complexity.time}</code></div>}
                {algorithm.complexity.space && <div><span>Space</span><code>{algorithm.complexity.space}</code></div>}
                {algorithm.complexity.sample && <div><span>Sample</span><code>{algorithm.complexity.sample}</code></div>}
                {algorithm.complexity.note && <div className="complexity-note"><span>Notes</span><p>{algorithm.complexity.note}</p></div>}
              </div>
            </section>
          )}

          <section className="research-block" id="implementation">
            <div className="research-block-label">05 · Implementation</div>
            <h2>How to build it</h2>
            <ol>{algorithm.implementation.map((item) => <li key={item}>{item}</li>)}</ol>
          </section>

          <section className="research-block" id="failure-modes">
            <div className="research-block-label">06 · Failure modes</div>
            <h2>Where it breaks down</h2>
            <ul>{algorithm.failureModes.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className="research-block" id="open-questions">
            <div className="research-block-label">07 · Research frontier</div>
            <h2>Questions worth carrying forward</h2>
            <div className="open-question-list">
              {algorithm.openQuestions.map((question, index) => (
                <div key={question}><span>{String(index + 1).padStart(2, "0")}</span><p>{question}</p></div>
              ))}
            </div>
          </section>
        </article>

        <aside className="algorithm-side">
          <div className="entity-side-card">
            <div className="entity-side-title"><GitBranch size={14} /> Relationships</div>
            {related.map(({ relation, algorithm: target }) => (
              <Link key={`${relation.type}-${target.id}`} href={`/algorithms/${target.id}`} className="relation-link">
                <span>{relation.type.replaceAll("-", " ")}</span>
                <strong>{target.name}</strong>
                <small>{relation.note}</small>
                <ArrowRight size={14} />
              </Link>
            ))}
            {inbound.map(({ relation, algorithm: source }) => (
              <Link key={`inbound-${source.id}-${relation.type}`} href={`/algorithms/${source.id}`} className="relation-link relation-inbound">
                <span>referenced by · {relation.type.replaceAll("-", " ")}</span>
                <strong>{source.name}</strong>
                <small>{relation.note}</small>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>

          {sourceSections.length > 0 && (
            <div className="entity-side-card">
              <div className="entity-side-title"><BookOpen size={14} /> Source sections</div>
              {sourceSections.slice(0, 10).map((section) => (
                <Link key={`${section.chapterSlug}-${section.anchor}`} href={`/archive/${section.chapterSlug}#${section.anchor}`} className="source-section-link">
                  <span>{section.chapterNumber} · heading match</span>
                  <strong>{section.heading}</strong>
                  <small>{section.chapterTitle}</small>
                  <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          )}

          {primaryReferences.length > 0 && (
            <div className="entity-side-card">
              <div className="entity-side-title"><ScrollText size={14} /> Primary references</div>
              {primaryReferences.map((reference) => (
                <Link key={reference.id} href={`/references/${reference.id}`} className="entity-reference-link">
                  <span>{reference.kind} · {reference.year}</span>
                  <strong>{reference.title}</strong>
                  <small>{reference.venue ?? reference.authors[0]}</small>
                </Link>
              ))}
            </div>
          )}

          {implementationRecords.length > 0 && (
            <div className="entity-side-card">
              <div className="entity-side-title"><Code2 size={14} /> Implementations</div>
              {implementationRecords.map((record) => (
                <Link key={record.id} href={`/implementations/${record.id}`} className="algorithm-implementation-link">
                  <span>{record.language} · {record.maturity}</span>
                  <strong>{record.name}</strong>
                  <small>{record.license}</small>
                </Link>
              ))}
            </div>
          )}

          {experimentRecords.length > 0 && (
            <div className="entity-side-card">
              <div className="entity-side-title"><Beaker size={14} /> Experiments</div>
              {experimentRecords.map((experiment) => (
                <Link key={experiment.id} href={`/experiments/${experiment.id}`} className="algorithm-experiment-link">
                  <span>{experiment.status}</span>
                  <strong>{experiment.title}</strong>
                  <small>{experiment.metrics.length} metrics · {experiment.lastUpdated}</small>
                </Link>
              ))}
            </div>
          )}

          {labMatches.length > 0 && (
            <div className="entity-side-card">
              <div className="entity-side-title"><FlaskConical size={14} /> Lab hypotheses</div>
              {labMatches.map((combination) => (
                <Link key={combination.id} href={`/lab#${combination.id}`} className="relation-link">
                  <span>{combination.status}</span>
                  <strong>{combination.title}</strong>
                  <small>{combination.hypothesis}</small>
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          )}

          <div className="entity-side-card">
            <div className="entity-side-title"><Layers3 size={14} /> Chapter context</div>
            {sources.map((source) => source && (
              <Link key={source.slug} href={`/archive/${source.slug}`} className="source-chapter-link">
                <span>{source.number}</span>
                <strong>{source.title}</strong>
                <small>{source.minutes} min read</small>
              </Link>
            ))}
          </div>

          <div className="entity-side-card entity-tags-card">
            <div className="entity-side-title"><Layers3 size={14} /> Research tags</div>
            <div className="entity-tags">{algorithm.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>

          <div className="entity-side-card provenance-card">
            <div className="entity-side-title"><ShieldCheck size={14} /> Provenance</div>
            <p>Entity metadata indexes the Markdown corpus. Heading-level source links are resolved from the live chapter TOC; references, implementations, experiments, and source chapters provide the wider evidence trail.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
