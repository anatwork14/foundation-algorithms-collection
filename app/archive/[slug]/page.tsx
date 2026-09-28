import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, Github, Network, ScrollText, Sigma } from "lucide-react";
import { ChapterToc } from "@/components/chapter-toc";
import { algorithmsForChapter } from "@/lib/algorithm-catalog";
import { getAllDocuments, getDocument } from "@/lib/content";
import { referencesForChapter } from "@/lib/references";
import { fieldKey } from "@/lib/taxonomy";

export function generateStaticParams() {
  return getAllDocuments().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocument(slug);
  if (!doc) return { title: "Research chapter" };
  return { title: doc.title, description: doc.summary };
}

const markdownComponents: Components = {
  h1({ node: _node, children, ...props }) {
    return <h2 {...props}>{children}</h2>;
  },
  a({ href, children, ...props }) {
    const external = Boolean(href?.startsWith("http"));
    return (
      <a href={href} {...props} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {children}
      </a>
    );
  },
  table({ children }) {
    return <div className="table-scroll"><table>{children}</table></div>;
  },
};

export default async function ResearchChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocument(slug);
  if (!doc) notFound();

  const all = getAllDocuments();
  const currentIndex = all.findIndex((item) => item.slug === doc.slug);
  const previous = currentIndex > 0 ? all[currentIndex - 1] : null;
  const next = currentIndex < all.length - 1 ? all[currentIndex + 1] : null;
  const related = all.filter((item) => item.field === doc.field && item.slug !== doc.slug).slice(0, 3);
  const chapterAlgorithms = algorithmsForChapter(doc.slug);
  const chapterReferences = referencesForChapter(doc.slug);

  return (
    <main className="detail-page">
      <div className="shell detail-breadcrumbs">
        <Link href="/archive"><ArrowLeft size={14} /> Archive</Link>
        <span>/</span>
        <span>{doc.number}</span>
      </div>

      <header className="detail-hero shell">
        <div className="detail-hero-main">
          <div className={`detail-field field-${fieldKey(doc.field)}`}>{doc.field}</div>
          <h1>{doc.title}</h1>
          <p>{doc.summary}</p>
          <div className="detail-meta">
            <span><BookOpen size={15} /> {doc.words.toLocaleString()} words</span>
            <span><Clock3 size={15} /> {doc.minutes} min read</span>
            <span><Sigma size={15} /> Chapter {doc.number}</span>
          </div>
        </div>
        <a
          className="source-button"
          href={`https://github.com/anatwork14/foundation-algorithms-collection/blob/main/docs/${doc.slug}.md`}
          target="_blank"
          rel="noreferrer"
        >
          <Github size={16} /> View source
        </a>
      </header>

      <div className="shell detail-layout">
        <article className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeSlug, rehypeKatex]}
            components={markdownComponents}
          >
            {doc.body}
          </ReactMarkdown>
        </article>

        <aside className="detail-aside">
          <div className="toc-card">
            <div className="toc-title">On this page</div>
            <ChapterToc items={doc.toc} />
          </div>

          {chapterAlgorithms.length > 0 && (
            <div className="related-card algorithm-entity-card">
              <div className="toc-title"><Sigma size={14} /> Algorithm entities</div>
              {chapterAlgorithms.slice(0, 6).map((algorithm) => (
                <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`}>
                  <span>ALG</span>
                  <strong>{algorithm.name}</strong>
                </Link>
              ))}
            </div>
          )}

          {chapterReferences.length > 0 && (
            <div className="related-card chapter-reference-card">
              <div className="toc-title"><ScrollText size={14} /> Primary references</div>
              {chapterReferences.slice(0, 6).map((reference) => (
                <Link key={reference.id} href={`/references/${reference.id}`}>
                  <span>{reference.year}</span>
                  <strong>{reference.title}</strong>
                </Link>
              ))}
            </div>
          )}

          {related.length > 0 && (
            <div className="related-card">
              <div className="toc-title"><Network size={14} /> Continue this thread</div>
              {related.map((item) => (
                <Link key={item.slug} href={`/archive/${item.slug}`}>
                  <span>{item.number}</span>
                  <strong>{item.title}</strong>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>

      <section className="shell chapter-navigation">
        {previous ? (
          <Link href={`/archive/${previous.slug}`} className="chapter-nav-card previous">
            <span><ArrowLeft size={15} /> Previous</span>
            <strong>{previous.title}</strong>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/archive/${next.slug}`} className="chapter-nav-card next">
            <span>Next <ArrowRight size={15} /></span>
            <strong>{next.title}</strong>
          </Link>
        ) : <div />}
      </section>
    </main>
  );
}
