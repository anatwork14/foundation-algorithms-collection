"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";

type RegistryToolbarProps = {
  className: string;
  ariaLabel: string;
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  searchAriaLabel: string;
  children?: ReactNode;
};

/**
 * Canonical search/filter shell for Evidence registry indexes.
 *
 * Route-specific explorers own their state and select options, while this
 * component keeps the shared search geometry, labeling, and DOM structure in
 * one place so References, Implementations, and Experiments cannot drift.
 */
export function RegistryToolbar({
  className,
  ariaLabel,
  query,
  onQueryChange,
  placeholder,
  searchAriaLabel,
  children,
}: RegistryToolbarProps) {
  return (
    <section className={className} aria-label={ariaLabel}>
      <label>
        <Search size={17} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          aria-label={searchAriaLabel}
        />
      </label>
      {children}
    </section>
  );
}
