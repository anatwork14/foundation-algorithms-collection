import Link from "next/link";
import { BookOpen, Code2, FlaskConical, GitBranch, Search } from "lucide-react";

type EvidenceSection = "overview" | "references" | "implementations" | "experiments" | "passages";

const items: Array<{ id: EvidenceSection; href: string; label: string; icon: typeof GitBranch }> = [
  { id: "overview", href: "/evidence", label: "Overview", icon: GitBranch },
  { id: "references", href: "/references", label: "References", icon: BookOpen },
  { id: "implementations", href: "/implementations", label: "Implementations", icon: Code2 },
  { id: "experiments", href: "/experiments", label: "Experiments", icon: FlaskConical },
  { id: "passages", href: "/passages", label: "Passages", icon: Search },
];

export function EvidenceNav({ current }: { current: EvidenceSection }) {
  return (
    <nav className="evidence-subnav" aria-label="Evidence sections">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.id} href={item.href} className={item.id === current ? "is-active" : ""} aria-current={item.id === current ? "page" : undefined}>
            <Icon size={13} /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
