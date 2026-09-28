"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Github, Menu, Search, X } from "lucide-react";
import { FoundationMark } from "@/components/logo";
import { algorithms, algorithmSearchText } from "@/lib/algorithm-catalog";
import type { DocSummary } from "@/lib/content";
import { fieldKey, type ResearchField } from "@/lib/taxonomy";

type SearchResult = {
  id: string;
  title: string;
  field: ResearchField;
  meta: string;
  href: string;
  marker: string;
  score: number;
  kind: "algorithm" | "chapter";
};

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
      if (event.key === "Escape") setSearchOpen(false);
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
        ...algorithms.slice(0, 4).map((algorithm) => ({
          id: `algorithm-${algorithm.id}`,
          title: algorithm.name,
          field: algorithm.fields[0],
          meta: `${algorithm.families[0]} · ${algorithm.maturity}`,
          href: `/algorithms/${algorithm.id}`,
          marker: "ALG",
          score: 1,
          kind: "algorithm" as const,
        })),
        ...documents.slice(0, 4).map((doc) => ({
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
      const exactName = algorithm.name.toLowerCase() === needle ? 12 : 0;
      const titleHit = algorithm.name.toLowerCase().includes(needle) ? 7 : 0;
      const aliasHit = algorithm.aliases.some((alias) => alias.toLowerCase().includes(needle)) ? 5 : 0;
      const bodyHit = algorithmSearchText(algorithm).includes(needle) ? 2 : 0;
      return {
        id: `algorithm-${algorithm.id}`,
        title: algorithm.name,
        field: algorithm.fields[0],
        meta: `${algorithm.families[0]} · ${algorithm.maturity}`,
        href: `/algorithms/${algorithm.id}`,
        marker: "ALG",
        score: exactName + titleHit + aliasHit + bodyHit,
        kind: "algorithm",
      };
    });

    const chapterResults: SearchResult[] = documents.map((doc) => {
      const titleHit = doc.title.toLowerCase().includes(needle) ? 6 : 0;
      const summaryHit = doc.summary.toLowerCase().includes(needle) ? 3 : 0;
      const bodyHit = doc.searchText.includes(needle) ? 1 : 0;
      return {
        id: `chapter-${doc.slug}`,
        title: doc.title,
        field: doc.field,
        meta: `Chapter ${doc.number} · ${doc.minutes} min read`,
        href: `/archive/${doc.slug}`,
        marker: doc.number,
        score: titleHit + summaryHit + bodyHit,
        kind: "chapter",
      };
    });

    return [...algorithmResults, ...chapterResults]
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 10);
  }, [documents, query]);

  const nav = [
    { href: "/archive", label: "Archive" },
    { href: "/algorithms", label: "Algorithms" },
    { href: "/atlas", label: "Atlas" },
    { href: "/lab", label: "Lab" },
  ];

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

          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className={active ? "is-active" : ""} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search research">
              <Search size={16} />
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
              <Github size={18} />
            </a>
            <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="palette-backdrop" role="presentation" onMouseDown={() => setSearchOpen(false)}>
          <div className="command-palette" role="dialog" aria-modal="true" aria-label="Search the research hub" onMouseDown={(event) => event.stopPropagation()}>
            <div className="palette-input-row">
              <Search size={19} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search algorithms, chapters, mechanisms…"
                aria-label="Search research"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search">Esc</button>
            </div>
            <div className="palette-label">{query ? `Results for “${query}”` : "Jump into the research map"}</div>
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
                  <span className={`result-index field-${fieldKey(result.field)} ${result.kind === "algorithm" ? "algorithm-result-index" : ""}`}>{result.marker}</span>
                  <span className="result-copy">
                    <strong>{result.title}</strong>
                    <small>{result.kind === "algorithm" ? "Algorithm" : "Research chapter"} · {result.meta}</small>
                  </span>
                  <span className="result-arrow">↗</span>
                </button>
              )) : <div className="empty-search">No algorithm or chapter matches that phrase yet.</div>}
            </div>
            <div className="palette-footer">
              <span>Algorithm entities + full chapter corpus</span>
              <span>Use Archive for chapter-only filtering</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
