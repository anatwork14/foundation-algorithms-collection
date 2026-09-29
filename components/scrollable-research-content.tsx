"use client";

import { useEffect } from "react";

const selectors = [
  ".markdown-body .katex-display",
  ".markdown-body pre",
  ".markdown-body .table-scroll",
].join(",");

function labelFor(element: HTMLElement) {
  if (element.classList.contains("katex-display")) return "Scrollable mathematical expression";
  if (element.classList.contains("table-scroll")) return "Scrollable table";
  return "Scrollable code example";
}

function syncElement(element: HTMLElement) {
  const overflows = element.scrollWidth > element.clientWidth + 1;
  const managed = element.dataset.scrollAccessibility === "managed";

  if (overflows) {
    if (!element.hasAttribute("tabindex")) {
      element.tabIndex = 0;
      element.dataset.scrollAccessibility = "managed";
    }
    if (!element.hasAttribute("aria-label")) {
      element.setAttribute("aria-label", labelFor(element));
      element.dataset.scrollAccessibilityLabel = "managed";
    }
    return;
  }

  if (managed) {
    element.removeAttribute("tabindex");
    delete element.dataset.scrollAccessibility;
  }
  if (element.dataset.scrollAccessibilityLabel === "managed") {
    element.removeAttribute("aria-label");
    delete element.dataset.scrollAccessibilityLabel;
  }
}

/**
 * Long equations, tables, and code samples intentionally scroll locally rather
 * than widening the document. When one actually overflows, make that region a
 * keyboard stop as required by WCAG/Safari scroll-region behavior. Non-
 * overflowing regions stay out of the tab order.
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
        if (element.dataset.scrollAccessibilityLabel === "managed") element.removeAttribute("aria-label");
        delete element.dataset.scrollAccessibility;
        delete element.dataset.scrollAccessibilityLabel;
      }
    };
  }, []);

  return null;
}
