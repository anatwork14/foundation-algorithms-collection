"use client";

import { useEffect } from "react";

function activePalette() {
  return document.querySelector<HTMLElement>('.command-palette[role="dialog"][aria-modal="true"]');
}

function paletteResults(dialog: HTMLElement) {
  return [...dialog.querySelectorAll<HTMLButtonElement>(".palette-result:not([disabled])")]
    .filter((button) => button.getClientRects().length > 0);
}

/**
 * Adds command-palette style arrow navigation without replacing native Tab
 * order. The search input and result actions remain ordinary accessible
 * controls; arrow keys are a convenience layer for faster research lookup.
 */
export function CommandPaletteKeyboardManager() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

      const dialog = activePalette();
      if (!dialog) return;

      const input = dialog.querySelector<HTMLInputElement>('input[aria-label="Search research"]');
      const results = paletteResults(dialog);
      if (!input || !results.length) return;

      const target = event.target;
      const resultIndex = target instanceof HTMLButtonElement ? results.indexOf(target) : -1;

      if (target === input) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          results[0].focus();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          results[results.length - 1].focus();
        }
        return;
      }

      if (resultIndex < 0) return;

      if (event.key === "Home") {
        event.preventDefault();
        results[0].focus();
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        results[results.length - 1].focus();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (resultIndex === results.length - 1) input.focus();
        else results[resultIndex + 1].focus();
        return;
      }

      event.preventDefault();
      if (resultIndex === 0) input.focus();
      else results[resultIndex - 1].focus();
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, []);

  return null;
}
