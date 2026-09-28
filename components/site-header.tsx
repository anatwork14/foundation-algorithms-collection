"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Github, Menu, Search, X } from "lucide-react";
import { FoundationMark } from "@/components/logo";
import type { DocSummary } from "@/lib/content";
import { fieldKey } from "@/lib/taxonomy";

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

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return documents.slice(0, 8);
    return documents
      .map((doc) => {
        const titleHit = doc.title.toLowerCase().includes(needle) ? 4 : 0;
        const summaryHit = doc.summary.toLowerCase().includes(needle) ? 2 : 0;
        const bodyHit = doc.searchText.includes(needle) ? 1 : 0;
        return { doc, score: titleHit + summaryHit + bodyHit };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.doc.number.localeCompare(b.doc.number))
      .slice(0, 9)
      .map((entry) => entry.doc);
  }, [documents, query]);

  const nav = [
    { href: "/", label: "Overview" },
    { href: "/archive", label: "Archive" },
    { href: "/archive/40-ai-quantum-cybersecurity-combination-map", label: "Combinations" },
    { href: "/archive/41-emerging-algorithms-research-watchlist", label: "Watchlist" },
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
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? "is-active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
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
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="palette-backdrop" role="presentation" onMouseDown={() => setSearchOpen(false)}>
          <div className="command-palette" role="dialog" aria-modal="true" aria-label="Search the archive" onMouseDown={(event) => event.stopPropagation()}>
            <div className="palette-input-row">
              <Search size={19} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search algorithms, concepts, combinations…"
                aria-label="Search algorithms"
              />
              <button onClick={() => setSearchOpen(false)} aria-label="Close search">Esc</button>
            </div>
            <div className="palette-label">{query ? `Results for “${query}”` : "Jump into the collection"}</div>
            <div className="palette-results">
              {results.length ? (
                results.map((doc) => (
                  <button
                    key={doc.slug}
                    className="palette-result"
                    onClick={() => {
                      setSearchOpen(false);
                      setQuery("");
                      router.push(`/archive/${doc.slug}`);
                    }}
                  >
                    <span className={`result-index field-${fieldKey(doc.field)}`}>{doc.number}</span>
                    <span className="result-copy">
                      <strong>{doc.title}</strong>
                      <small>{doc.field} · {doc.minutes} min read</small>
                    </span>
                    <span className="result-arrow">↗</span>
                  </button>
                ))
              ) : (
                <div className="empty-search">No chapter matches that phrase yet.</div>
              )}
            </div>
            <div className="palette-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> scan</span>
              <span>Searches titles, summaries, and chapter text</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
