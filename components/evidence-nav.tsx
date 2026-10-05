import Link from "next/link";
import { BookOpen, CircleDashed, Code2, FlaskConical, GitBranch, RefreshCcw, Search, ShieldCheck } from "lucide-react";

type EvidenceSection = "overview" | "gaps" | "references" | "implementations" | "implementation-reviews" | "experiments" | "passages" | "claims" | "replications";

const items: Array<{ id: EvidenceSection; href: string; label: string; icon: typeof GitBranch }> = [
  { id: "overview", href: "/evidence", label: "Overview", icon: GitBranch },
  { id: "gaps", href: "/evidence/gaps", label: "Gaps", icon: CircleDashed },
  { id: "references", href: "/references", label: "References", icon: BookOpen },
  { id: "implementations", href: "/implementations", label: "Implementations", icon: Code2 },
  { id: "implementation-reviews", href: "/implementations/reviews", label: "Reviews", icon: RefreshCcw },
  { id: "experiments", href: "/experiments", label: "Experiments", icon: FlaskConical },
  { id: "claims", href: "/claims", label: "Claims", icon: ShieldCheck },
  { id: "replications", href: "/replications", label: "Replications", icon: RefreshCcw },
  { id: "passages", href: "/passages", label: "Passages", icon: Search },
];

export function EvidenceNav({ current }: { current: EvidenceSection }) {
  return (
    <nav className="evidence-subnav" aria-label="Evidence sections">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.id} href={item.href} className={item.id === current ? "is-active" : ""} aria-current={item.id === current ? "page" : undefined}>
            <Icon size={13} aria-hidden="true" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}