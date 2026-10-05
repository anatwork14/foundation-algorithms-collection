"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Github, Menu, Search, X } from "lucide-react";
import { FoundationMark } from "@/components/logo";
import { algorithms, algorithmSearchText } from "@/lib/algorithm-catalog";
import { algorithmVariants, variantSearchText } from "@/lib/algorithm-variants";
import { claims, claimSearchText } from "@/lib/claims";
import type { DocSummary } from "@/lib/content";
import { getAlgorithmEvidenceProfile } from "@/lib/evidence-profile";
import { experiments, experimentSearchText } from "@/lib/experiments";
import { implementationUpstreamReviewSearchText, implementationUpstreamReviews } from "@/lib/implementation-upstream-reviews";
import { implementations, implementationSearchText } from "@/lib/implementations";
import { references, referenceSearchText } from "@/lib/references";
import { replications, replicationSearchText } from "@/lib/replications";
import { findPassageMatches } from "@/lib/search-passages";
import { fieldKey, type ResearchField } from "@/lib/taxonomy";

type SearchResult = {
  id: string;
  title: string;
  field: ResearchField;
  meta: string;
  context?: string;
  href: string;
  marker: string;
  score: number;
  kind: "algorithm" | "variant" | "chapter" | "reference" | "implementation" | "implementation-review" | "experiment" | "claim" | "replication";
};

function linkedField(algorithmIds: string[]): ResearchField {
  const linked = algorithms.find((algorithm) => algorithmIds.includes(algorithm.id));
  return linked?.fields[0] ?? "Cross-field";
}

function algorithmMeta(algorithmId: string, family: string, maturity: string) {
  const profile = getAlgorithmEvidenceProfile(algorithmId);
  return `${family} · ${maturity} · ${profile.stage}`;
}

export function SiteHeader({ documents }: { documents: DocSummary[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) requestAnimationFrame(() => inputRef.current?.focus());
  }, [searchOpen]);

  const results = useMemo<SearchResult[]>(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return [
        ...algorithms.slice(0, 2).map((algorithm) => ({
          id: `algorithm-${algorithm.id}`,
          title: algorithm.name,
          field: algorithm.fields[0],
          meta: algorithmMeta(algorithm.id, algorithm.families[0], algorithm.maturity),
          href: `/algorithms/${algorithm.id}`,
          marker: "ALG",
          score: 1,
          kind: "algorithm" as const,
        })),
        ...claims.slice(0, 1).map((claim) => ({
          id: `claim-${claim.id}`,
          title: claim.statement,
          field: linkedField(claim.algorithmIds),
          meta: `${claim.kind} · curated passage/reference assertion`,
          href: `/claims#${claim.id}`,
          marker: "CLM",
          score: 1,
          kind: "claim" as const,
        })),
        ...replications.slice(0, 1).map((replication) => ({
          id: `replication-${replication.id}`,
          title: replication.title,
          field: linkedField(replication.algorithmIds),
          meta: `${replication.outcome} · independent evaluation`,
          href: `/replications#${replication.id}`,
          marker: "REP",
          score: 1,
          kind: "replication" as const,
        })),
        ...references.slice(0, 2).map((reference) => ({
          id: `reference-${reference.id}`,
          title: reference.title,
          field: linkedField(reference.algorithmIds),
          meta: `${reference.evidenceRole} · ${reference.year}${reference.venue ? ` · ${reference.venue}` : ""}`,
          href: `/references/${reference.id}`,
          marker: "REF",
          score: 1,
          kind: "reference" as const,
        })),
        ...implementations.slice(0, 2).map((implementation) => ({
          id: `implementation-${implementation.id}`,
          title: implementation.name,
          field: linkedField(implementation.algorithmIds),
          meta: `${implementation.language} · ${implementation.maturity}`,
          href: `/implementations/${implementation.id}`,
          marker: "CODE",
          score: 1,
          kind: "implementation" as const,
        })),
        ...implementationUpstreamReviews.slice(0, 1).map((review) => {
          const implementation = implementations.find((item) => item.id === review.implementationId);
          return {
            id: `implementation-review-${review.implementationId}-${review.revision}`,
            title: `${implementation?.name ?? review.implementationId} upstream review`,
            field: linkedField(implementation?.algorithmIds ?? []),
            meta: `${review.decision} · ${review.reviewedAt} · observed ${review.observedRef}`,
            href: `/implementations/reviews#${review.implementationId}-r${review.revision}`,
            marker: "REV",
            score: 1,
            kind: "implementation-review" as const,
          };
        }),
        ...experiments.slice(0, 2).map((experiment) => ({
          id: `experiment-${experiment.id}`,
          title: experiment.title,
          field: linkedField(experiment.algorithmIds),
          meta: `${experiment.status} · ${experiment.metrics.length} metrics`,
          href: `/experiments/${experiment.id}`,
          marker: "EXP",
          score: 1,
          kind: "experiment" as const,
        })),
        ...documents.slice(0, 2).map((doc) => ({
          id: `chapter-${doc.slug}`,
          title: doc.title,
          field: doc.field,
          meta: `Chapter ${doc.number} · ${doc.minutes} min read`,
          href: `/archive/${doc.slug}`,
          marker: doc.number,
          score: 1,
          kind: "chapter" as const,
        })),
      ];
    }

    const algorithmResults: SearchResult[] = algorithms.map((algorithm) => {
      const profile = getAlgorithmEvidenceProfile(algorithm.id);
      const exactName = algorithm.name.toLowerCase() === needle ? 12 : 0;
      const titleHit = algorithm.name.toLowerCase().includes(needle) ? 7 : 0;
      const aliasHit = algorithm.aliases.some((alias) => alias.toLowerCase().includes(needle)) ? 5 : 0;
      const stageHit = profile.stage.toLowerCase().includes(needle) ? 4 : 0;
      const bodyHit = algorithmSearchText(algorithm).includes(needle) ? 2 : 0;
      return {
        id: `algorithm-${algorithm.id}`,
        title: algorithm.name,
        field: algorithm.fields[0],
        meta: `${algorithm.families[0]} · ${algorithm.maturity} · ${profile.stage}`,
        href: `/algorithms/${algorithm.id}`,
        marker: "ALG",
        score: exactName + titleHit + aliasHit + stageHit + bodyHit,
        kind: "algorithm",
      };
    });

    const variantResults: SearchResult[] = algorithmVariants.map((variant) => {
      const parent = algorithms.find((algorithm) => algorithm.id === variant.parentAlgorithmId);
      const exactName = variant.name.toLowerCase() === needle ? 13 : 0;
      const titleHit = variant.name.toLowerCase().includes(needle) ? 9 : 0;
      const aliasHit = variant.aliases.some((alias) => alias.toLowerCase().includes(needle)) ? 6 : 0;
      const bodyHit = variantSearchText(variant).includes(needle) ? 3 : 0;
      return {
        id: `variant-${variant.id}`,
        title: variant.name,
        field: parent?.fields[0] ?? "Cross-field",
        meta: `${parent?.name ?? variant.parentAlgorithmId} · algorithm variant`,
        href: `/algorithms/${variant.parentAlgorithmId}/variants/${variant.id}`,
        marker: "VAR",
        score: exactName + titleHit + aliasHit + bodyHit,
        kind: "variant",
      };
    });

    const claimResults: SearchResult[] = claims.map((claim) => {
      const statementHit = claim.statement.toLowerCase().includes(needle) ? 9 : 0;
      const bodyHit = claimSearchText(claim).includes(needle) ? 4 : 0;
      return {
        id: `claim-${claim.id}`,
        title: claim.statement,
        field: linkedField(claim.algorithmIds),
        meta: `${claim.kind} · ${claim.referenceIds.length} curated source${claim.referenceIds.length === 1 ? "" : "s"}`,
        href: `/claims#${claim.id}`,
        marker: "CLM",
        score: statementHit + bodyHit,
        kind: "claim",
      };
    });

    const replicationResults: SearchResult[] = replications.map((replication) => {
      const titleHit = replication.title.toLowerCase().includes(needle) ? 9 : 0;
      const bodyHit = replicationSearchText(replication, references).includes(needle) ? 4 : 0;
      return {
        id: `replication-${replication.id}`,
        title: replication.title,
        field: linkedField(replication.algorithmIds),
        meta: `${replication.outcome} · independent evaluation`,
        href: `/replications#${replication.id}`,
        marker: "REP",
        score: titleHit + bodyHit,
        kind: "replication",
      };
    });

    const referenceResults: SearchResult[] = references.map((reference) => {
      const exactTitle = reference.title.toLowerCase() === needle ? 12 : 0;
      const titleHit = reference.title.toLowerCase().includes(needle) ? 8 : 0;
      const authorHit = reference.authors.some((author) => author.toLowerCase().includes(needle)) ? 5 : 0;
      const bodyHit = referenceSearchText(reference).includes(needle) ? 2 : 0;
      return {
        id: `reference-${reference.id}`,
        title: reference.title,
        field: linkedField(reference.algorithmIds),
        meta: `${reference.evidenceRole} · ${reference.year}${reference.venue ? ` · ${reference.venue}` : ""}`,
        href: `/references/${reference.id}`,
        marker: "REF",
        score: exactTitle + titleHit + authorHit + bodyHit,
        kind: "reference",
      };
    });

    const implementationResults: SearchResult[] = implementations.map((implementation) => {
      const exactName = implementation.name.toLowerCase() === needle ? 12 : 0;
      const titleHit = implementation.name.toLowerCase().includes(needle) ? 8 : 0;
      const bodyHit = implementationSearchText(implementation).includes(needle) ? 3 : 0;
      return {
        id: `implementation-${implementation.id}`,
        title: implementation.name,
        field: linkedField(implementation.algorithmIds),
        meta: `${implementation.language} · ${implementation.maturity}`,
        href: `/implementations/${implementation.id}`,
        marker: "CODE",
        score: exactName + titleHit + bodyHit,
        kind: "implementation",
      };
    });

    const implementationReviewResults: SearchResult[] = implementationUpstreamReviews.map((review) => {
      const implementation = implementations.find((item) => item.id === review.implementationId);
      const title = `${implementation?.name ?? review.implementationId} upstream review`;
      const exactTitle = title.toLowerCase() === needle ? 12 : 0;
      const titleHit = title.toLowerCase().includes(needle) ? 8 : 0;
      const bodyHit = implementationUpstreamReviewSearchText(review, implementation?.name).includes(needle) ? 4 : 0;
      return {
        id: `implementation-review-${review.implementationId}-${review.revision}`,
        title,
        field: linkedField(implementation?.algorithmIds ?? []),
        meta: `${review.decision} · ${review.reviewedAt} · observed ${review.observedRef}`,
        context: review.note,
        href: `/implementations/reviews#${review.implementationId}-r${review.revision}`,
        marker: "REV",
        score: exactTitle + titleHit + bodyHit,
        kind: "implementation-review",
      };
    });

    const experimentResults: SearchResult[] = experiments.map((experiment) => {
      const exactTitle = experiment.title.toLowerCase() === needle ? 12 : 0;
      const titleHit = experiment.title.toLowerCase().includes(needle) ? 8 : 0;
      const bodyHit = experimentSearchText(experiment).includes(needle) ? 3 : 0;
      return {
        id: `experiment-${experiment.id}`,
        title: experiment.title,
        field: linkedField(experiment.algorithmIds),
        meta: `${experiment.status} · ${experiment.metrics.length} metrics`,
        href: `/experiments/${experiment.id}`,
        marker: "EXP",
        score: exactTitle + titleHit + bodyHit,
        kind: "experiment",
      };
    });

    const chapterResults: SearchResult[] = documents.map((doc) => {
      const passages = findPassageMatches(doc.passages, query);
      const passage = passages[0];
      const titleHit = doc.title.toLowerCase().includes(needle) ? 6 : 0;
      const summaryHit = doc.summary.toLowerCase().includes(needle) ? 3 : 0;
      const passageHit = passage ? 2 : 0;
      const bodyHit = doc.searchText.includes(needle) ? 1 : 0;
      return {
        id: `chapter-${doc.slug}`,
        title: doc.title,
        field: doc.field,
        meta: passage
          ? `Chapter ${doc.number} · ${passages.length} passage match${passages.length === 1 ? "" : "es"} · top in ${passage.heading} · lines ${passage.startLine}${passage.endLine !== passage.startLine ? `–${passage.endLine}` : ""}`
          : `Chapter ${doc.number} · ${doc.minutes} min read`,
        context: passage?.snippet,
        href: passage?.anchor ? `/archive/${doc.slug}#${passage.anchor}` : `/archive/${doc.slug}`,
        marker: doc.number,
        score: titleHit + summaryHit + passageHit + bodyHit,
        kind: "chapter",
      };
    });

    return [...algorithmResults, ...variantResults, ...claimResults, ...replicationResults, ...referenceResults, ...implementationResults, ...implementationReviewResults, ...experimentResults, ...chapterResults]
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 10);
  }, [documents, query]);

  const nav = [
    { href: "/archive", label: "Archive", matches: ["/archive"] },
    { href: "/algorithms", label: "Algorithms", matches: ["/algorithms", "/variants"] },
    { href: "/atlas", label: "Atlas", matches: ["/atlas"] },
    { href: "/lab", label: "Lab", matches: ["/lab"] },
    { href: "/evidence", label: "Evidence", matches: ["/evidence", "/references", "/implementations", "/experiments", "/passages", "/claims", "/replications"] },
  ];

  function resultKindLabel(kind: SearchResult["kind"]) {
    if (kind === "algorithm") return "Algorithm";
    if (kind === "variant") return "Algorithm variant";
    if (kind === "claim") return "Curated claim";
    if (kind === "replication") return "Independent replication";
    if (kind === "reference") return "Reference";
    if (kind === "implementation") return "Implementation";
    if (kind === "implementation-review") return "Implementation upstream review";
    if (kind === "experiment") return "Experiment";
    return "Research chapter";
  }

  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <Link href="/" className="brand-link" aria-label="Foundation Algorithms home">
            <FoundationMark />
            <span>
              <strong>Foundation Algorithms</strong>
              <small>Research archive</small>
            </span>
          </Link>

          <nav id="primary-navigation" className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            {nav.map((item) => {
              const active = item.matches.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "is-active" : ""}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search research" aria-haspopup="dialog">
              <Search size={16} aria-hidden="true" />
              <span>Search</span>
              <kbd>⌘ K</kbd>
            </button>
            <a
              className="icon-button"
              href="https://github.com/anatwork14/foundation-algorithms-collection"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub repository"
            >
              <Github size={18} aria-hidden="true" />
            </a>
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="primary-navigation"
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="palette-backdrop" role="presentation" onMouseDown={() => setSearchOpen(false)}>
          <div className="command-palette" role="dialog" aria-modal="true" aria-label="Search the research hub" onMouseDown={(event) => event.stopPropagation()}>
            <div className="palette-input-row">
              <Search size={19} aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search algorithms, variants, claims, reviews, replications, papers, code, experiments, chapters…"
                aria-label="Search research"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search">Esc</button>
            </div>
            <div className="palette-label" aria-live="polite">
              {query ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”` : "Jump into the research map"}
            </div>
            <div className="palette-results">
              {results.length ? results.map((result) => (
                <button
                  key={result.id}
                  className="palette-result"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                    router.push(result.href);
                  }}
                >
                  <span className={`result-index field-${fieldKey(result.field)} ${result.kind !== "chapter" ? "algorithm-result-index" : ""}`}>{result.marker}</span>
                  <span className="result-copy">
                    <strong>{result.title}</strong>
                    <small>{resultKindLabel(result.kind)} · {result.meta}</small>
                    {result.context && <em>{result.context}</em>}
                  </span>
                  <span className="result-arrow" aria-hidden="true">↗</span>
                </button>
              )) : <div className="empty-search">No research entity matches that phrase yet.</div>}
            </div>
            <div className="palette-footer">
              <span>Algorithms + variants + claims + reviews + replications + sources + code + experiments + chapters</span>
              <span>Chapter body matches rank inspectable passages and jump to the top section</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}