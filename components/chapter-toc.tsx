"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; label: string; level: number };

export function ChapterToc({ items }: { items: TocItem[] }) {
  const visibleItems = items.slice(0, 30);
  const [activeId, setActiveId] = useState(visibleItems[0]?.id ?? "");

  useEffect(() => {
    const headings = visibleItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [visibleItems]);

  return (
    <nav aria-label="On this page">
      {visibleItems.map((item, index) => (
        <a
          key={`${item.id}-${index}`}
          href={`#${item.id}`}
          aria-current={activeId === item.id ? "location" : undefined}
          className={`${item.level === 3 ? "toc-nested" : ""} ${activeId === item.id ? "is-current" : ""}`.trim()}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
