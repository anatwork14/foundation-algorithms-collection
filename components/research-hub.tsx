"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Boxes, FlaskConical, Search, Sparkles } from "lucide-react";
import { SearchSnippet } from "@/components/search-snippet";
import type { DocSummary } from "@/lib/content";
import { findPassageMatch } from "@/lib/search-passages";
import { fieldKey, fields, inspirationThreads, type ResearchField } from "@/lib/taxonomy";

const filterOptions: Array<ResearchField | "All"> = [
  "All",
  "Foundations",
  "AI / ML",
  "Quantum",
  "Cybersecurity",
  "Cross-field",
];

export function ResearchHub({ documents }: { documents: DocSummary[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<ResearchField | "All">("All");

  const totalWords = documents.reduce((sum, doc) => sum + doc.words, 0);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return documents.filter((doc) => {
      const fieldMatch = field === "All" || doc.field === field;
      const textMatch =
        !needle ||
        doc.title.toLowerCase().includes(needle) ||
        doc.summary.toLowerCase().includes(needle) ||
        doc.searchText.includes(needle);
      return fieldMatch && textMatch;
    });
  }, [documents, field, query]);

  return (
    <main>
      <section className="hero-section shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> Living research collection</div>
            <h1>Know the foundations.<br /><span>Find the next combination.</span></h1>
            <p className="hero-lede">
              An open archive of the algorithms underneath modern computing—built to be read as a reference,
              explored as a map, and recombined into future research directions.
            </p>

            <div className="hero-search-wrap">
              <Search size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “LinUCB”, “quantum decoding”, “symbolic execution”…"
                aria-label="Search the research collection"
              />
              <span className="search-count">{filtered.length}</span>
            </div>

            <div className="quick-filters" aria-label="Research field filters">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  className={field === option ? "is-active" : ""}
                  onClick={() => setField(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-atlas" aria-label="Collection overview">
            <div className="atlas-topline">
              <span>Algorithm atlas</span>
              <span>{documents.length} chapters</span>
            </div>
            <div className="atlas-orbit">
              <div className="atlas-center">
                <strong>FOUNDATION</strong>
                <span>algorithms</span>
              </div>
              <span className="atlas-node node-a">AI</span>
              <span className="atlas-node node-b">Q</span>
              <span className="atlas-node node-c">SEC</span>
              <span className="atlas-node node-d">CORE</span>
            </div>
            <div className="atlas-stats">
              <div><strong>{documents.length}</strong><span>research chapters</span></div>
              <div><strong>{Math.round(totalWords / 1000)}k</strong><span>words indexed</span></div>
              <div><strong>5</strong><span>research fields</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="domain-section shell section-block">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Research fields</span>
            <h2>Five lenses on the same computational universe.</h2>
          </div>
          <Link href="/archive" className="text-link">Browse everything <ArrowRight size={15} /></Link>
        </div>

        <div className="domain-grid">
          {fields.map((item, index) => {
            const count = documents.filter((doc) => doc.field === item.name).length;
            return (
              <button
                key={item.name}
                className={`domain-card field-${fieldKey(item.name)} ${field === item.name ? "is-selected" : ""}`}
                onClick={() => setField(item.name)}
              >
                <div className="domain-card-top"><span>0{index + 1}</span><span>{count} chapters</span></div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="domain-arrow">Explore →</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="archive-preview shell section-block" id="archive">
        <div className="section-heading">
          <div>
            <span className="section-kicker">The archive</span>
            <h2>{query || field !== "All" ? `${filtered.length} matching chapters` : "A library built from first principles."}</h2>
          </div>
          <div className="archive-meta"><BookOpen size={16} /> Markdown remains the source of truth</div>
        </div>

        {filtered.length ? (
          <div className="home-archive-list">
            {filtered.slice(0, 8).map((doc) => {
              const passage = findPassageMatch(doc.passages, query);
              const href = passage?.anchor ? `/archive/${doc.slug}#${passage.anchor}` : `/archive/${doc.slug}`;
              return (
                <Link key={doc.slug} href={href} className="home-archive-row">
                  <span className={`chapter-number field-${fieldKey(doc.field)}`}>{doc.number}</span>
                  <div className="home-archive-copy">
                    <div className="archive-row-label">{doc.field}</div>
                    <h3>{doc.title}</h3>
                    <p>{doc.summary}</p>
                    {passage && <SearchSnippet heading={passage.heading} text={passage.snippet} query={query} />}
                  </div>
                  <div className="home-archive-meta">
                    <span>{doc.minutes} min</span>
                    <span>{doc.words.toLocaleString()} words</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={24} />
            <h3>No chapter matches yet.</h3>
            <p>Try a broader concept or switch research fields.</p>
            <button onClick={() => { setQuery(""); setField("All"); }}>Reset search</button>
          </div>
        )}

        {filtered.length > 8 && (
          <div className="section-cta">
            <Link href={`/archive${query ? `?q=${encodeURIComponent(query)}` : ""}`} className="primary-button">Open full archive <ArrowRight size={16} /></Link>
          </div>
        )}
      </section>

      <section className="inspiration-section section-block">
        <div className="shell">
          <div className="section-heading inverse">
            <div>
              <span className="section-kicker">Combination lab</span>
              <h2>The collection becomes more valuable when the boundaries disappear.</h2>
            </div>
            <Sparkles size={28} />
          </div>

          <div className="inspiration-grid">
            {inspirationThreads.map((thread, index) => (
              <Link href={thread.href} key={thread.title} className={`inspiration-card inspiration-${index + 1}`}>
                <div className="inspiration-kicker"><FlaskConical size={14} /> {thread.kicker}</div>
                <h3>{thread.title}</h3>
                <p>{thread.description}</p>
                <div className="inspiration-footer">
                  <span>{thread.fields.join(" × ")}</span>
                  <ArrowRight size={17} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="principles-section shell section-block">
        <div className="principles-grid">
          <div className="principles-intro">
            <span className="section-kicker">How to use this hub</span>
            <h2>Archive. Understand. Combine. Test.</h2>
            <p>The site is intentionally designed around research behavior rather than endless content consumption.</p>
          </div>
          <div className="principle-list">
            <div><span><BookOpen size={17} /></span><strong>Read from motivation</strong><p>Start with the problem an algorithm exists to solve before implementation details.</p></div>
            <div><span><Boxes size={17} /></span><strong>Trace reusable mechanisms</strong><p>Notice shared patterns such as confidence bounds, message passing, search, and approximation.</p></div>
            <div><span><FlaskConical size={17} /></span><strong>Turn combinations into experiments</strong><p>Define interfaces, hypotheses, baselines, failure modes, and measurable outcomes.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}
