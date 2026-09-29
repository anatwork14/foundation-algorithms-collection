"use client";

import { useEffect } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function visibleFocusableElements(dialog: HTMLElement) {
  return [...dialog.querySelectorAll<HTMLElement>(focusableSelector)].filter((element) => {
    if (element.getAttribute("aria-hidden") === "true") return false;
    return element.getClientRects().length > 0;
  });
}

/**
 * Applies the keyboard/focus behavior expected from aria-modal dialogs without
 * coupling it to one feature. The search palette is currently the only modal,
 * but future research dialogs inherit the same focus contract automatically.
 */
export function DialogFocusManager() {
  useEffect(() => {
    let activeDialog: HTMLElement | null = null;
    let previousFocus: HTMLElement | null = null;
    let previousOverflow = "";

    const findDialog = () => document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');

    const syncDialog = () => {
      const nextDialog = findDialog();

      if (nextDialog && !activeDialog) {
        previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        activeDialog = nextDialog;

        requestAnimationFrame(() => {
          if (!activeDialog) return;
          if (activeDialog.contains(document.activeElement)) return;
          visibleFocusableElements(activeDialog)[0]?.focus();
        });
        return;
      }

      if (!nextDialog && activeDialog) {
        const restoreTarget = previousFocus;
        activeDialog = null;
        previousFocus = null;
        document.body.style.overflow = previousOverflow;

        requestAnimationFrame(() => {
          if (restoreTarget?.isConnected) restoreTarget.focus();
        });
        return;
      }

      activeDialog = nextDialog;
    };

    const observer = new MutationObserver(syncDialog);
    observer.observe(document.body, { childList: true, subtree: true });
    syncDialog();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const dialog = findDialog();
      if (!dialog) return;

      const focusable = visibleFocusableElements(dialog);
      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (!dialog.contains(current)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", onKeyDown, true);
      if (activeDialog) document.body.style.overflow = previousOverflow;
    };
  }, []);

  return null;
}
