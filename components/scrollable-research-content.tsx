"use client";

import { useEffect } from "react";

const selectors = [
  ".markdown-body .katex-display",
  ".markdown-body :not(.katex-display) > .katex",
  ".markdown-body pre",
  ".markdown-body .table-scroll",
].join(",");

function syncElement(element: HTMLElement) {
  const overflows = element.scrollWidth > element.clientWidth + 1;
  const managed = element.dataset.scrollAccessibility === "managed";

  if (overflows) {
    if (!element.hasAttribute("tabindex")) {
      element.tabIndex = 0;
      element.dataset.scrollAccessibility = "managed";
    }
    return;
  }

  if (managed) {
    element.removeAttribute("tabindex");
    delete element.dataset.scrollAccessibility;
  }
}

/**
 * Long equations, tables, and code samples intentionally scroll locally rather
 * than widening the document. When one actually overflows, make that region a
 * keyboard stop as required by WCAG/Safari scroll-region behavior. Non-
 * overflowing regions stay out of the tab order. We intentionally do not add
 * ARIA naming to generated KaTeX spans because a focusable generic span already
 * exposes its mathematical descendants and aria-label is prohibited there.
 */
export function ScrollableResearchContent() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".markdown-body");
    if (!root) return;

    const observed = new Set<HTMLElement>();
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) syncElement(entry.target as HTMLElement);
    });

    const discover = () => {
      for (const element of root.querySelectorAll<HTMLElement>(selectors)) {
        syncElement(element);
        if (!observed.has(element)) {
          observed.add(element);
          resizeObserver.observe(element);
        }
      }
    };

    const mutationObserver = new MutationObserver(discover);
    mutationObserver.observe(root, { childList: true, subtree: true });
    discover();

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      for (const element of observed) {
        if (element.dataset.scrollAccessibility === "managed") element.removeAttribute("tabindex");
        delete element.dataset.scrollAccessibility;
      }
    };
  }, []);

  return null;
}
