import type { ReactNode } from "react";

type ResearchPageHeaderProps = {
  className?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
};

/**
 * Canonical structural header for top-level research surfaces.
 *
 * Route-specific classes remain supported so specialized layout CSS can stay
 * structural, while heading/eyebrow/description order is shared everywhere.
 */
export function ResearchPageHeader({
  className,
  eyebrow,
  title,
  description,
  children,
}: ResearchPageHeaderProps) {
  const classes = ["research-page-header", className].filter(Boolean).join(" ");

  return (
    <header className={classes}>
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </header>
  );
}
