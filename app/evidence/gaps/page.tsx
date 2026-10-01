import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDashed } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import {
  evidenceGapCounts,
  evidenceGapLabel,
  getEvidenceGapCatalog,
  type EvidenceGapKey,
} from "@/lib/evidence-gaps";

export const metadata: Metadata = {
  title: "Evidence Gaps",
  description: "Inspect which evidence layers are not yet recorded for indexed Foundation Algorithms and identify possible curation work without turning coverage into a quality score.",
};

const gapOrder: EvidenceGapKey[] = [
  "primary-source",
  "curated-claim",
  "implementation",
  "experiment",
  "result",
  "independent-evaluation",
];

export default function EvidenceGapsPage() {
  const catalog = getEvidenceGapCatalog();
  const withGaps = catalog
    .filter((item) => item.gaps.length > 0)
    .sort((a, b) => a.field.localeCompare(b.field) || a.name.localeCompare(b.name));
  const counts = evidenceGapCounts(catalog);
  const fullyTracked = catalog.length - withGaps.length;

  return (
    <main className="evidence-hub evidence-gap-page shell">
      <header className="evidence-hub-hero">
        <span className="eyebrow"><CircleDashed size={13} aria-hidden="true" /> Research planning</span>
        <h1>See what the archive does not yet record.</h1>
        <p>
          Evidence gaps describe missing archive layers, not weak algorithms. Not every method needs code, a project experiment, or an independent replication record. Use this view to find concrete curation opportunities while preserving that distinction.
        </p>
        <EvidenceNav current="gaps" />
      </header>

      <section className="evidence-gap-summary" aria-label="Evidence gap coverage">
        {gapOrder.map((key) => (
          <div key={key}>
            <strong>{counts.get(key) ?? 0}</strong>
            <span>{evidenceGapLabel(key)} gaps</span>
          </div>
        ))}
      </section>

      <section className="evidence-gap-section" aria-labelledby="evidence-gap-heading">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Coverage map</span>
            <h2 id="evidence-gap-heading">Missing layers, not quality scores.</h2>
            <p>
              {withGaps.length} of {catalog.length} indexed algorithms currently have at least one unrecorded evidence layer. {fullyTracked > 0 ? `${fullyTracked} currently have records across every tracked layer.` : "No algorithm currently has records across every tracked layer, which is expected for a research archive of this breadth."}
            </p>
          </div>
        </div>

        <div className="evidence-gap-list">
          {withGaps.map((item) => (
            <article key={item.algorithmId} className="evidence-gap-row">
              <div className="evidence-gap-identity">
                <span className="research-block-label">{item.field} · {item.family}</span>
                <h3><Link href={`/algorithms/${item.algorithmId}`}>{item.name}</Link></h3>
              </div>

              <div className="evidence-gap-stage">
                <span>Current evidence stage</span>
                <strong>{item.stage}</strong>
              </div>

              <div className="evidence-gap-missing">
                <span>Not yet recorded</span>
                <div>
                  {item.gaps.map((gap) => <em key={gap.key}>{gap.label}</em>)}
                </div>
              </div>

              <div className="evidence-gap-next">
                <span>Possible next curation step</span>
                <p>{item.suggestedTask}</p>
                <Link href={`/algorithms/${item.algorithmId}`}>Inspect algorithm <ArrowRight size={13} aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
