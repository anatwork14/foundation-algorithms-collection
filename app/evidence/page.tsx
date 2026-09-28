import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, FlaskConical, GitBranch, Network, ScrollText } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import { algorithms } from "@/lib/algorithm-catalog";
import { getAlgorithmEvidenceProfile, type EvidenceStage } from "@/lib/evidence-profile";
import { experiments } from "@/lib/experiments";
import { implementations } from "@/lib/implementations";
import { references } from "@/lib/references";

export const metadata: Metadata = {
  title: "Evidence",
  description: "Trace Foundation Algorithms research from primary sources to implementations and reproducible experiments.",
};

const evidenceStages: EvidenceStage[] = [
  "Concept only",
  "Source-backed",
  "Inspectable implementation",
  "Experiment protocol",
  "Empirical result",
  "Replicated",
];

export default function EvidencePage() {
  const algorithmsWithReferences = new Set(references.flatMap((reference) => reference.algorithmIds)).size;
  const algorithmsWithImplementations = new Set(implementations.flatMap((implementation) => implementation.algorithmIds)).size;
  const algorithmsWithExperiments = new Set(experiments.flatMap((experiment) => experiment.algorithmIds)).size;
  const profiles = algorithms.map((algorithm) => getAlgorithmEvidenceProfile(algorithm.id));
  const stageCounts = new Map<EvidenceStage, number>(evidenceStages.map((stage) => [stage, 0]));
  for (const profile of profiles) stageCounts.set(profile.stage, (stageCounts.get(profile.stage) ?? 0) + 1);
  const curatedCitationEdges = references.reduce((sum, reference) => sum + reference.citesReferenceIds.length, 0);

  return (
    <main className="evidence-hub shell">
      <header className="evidence-hub-hero">
        <span className="eyebrow"><GitBranch size={13} /> Research evidence</span>
        <h1>Trace an idea from source to code to experiment.</h1>
        <p>
          Evidence is kept separate from conceptual descriptions so the archive can distinguish what a paper or standard establishes, what executable code exists, and what this project has actually tested.
        </p>
        <EvidenceNav current="overview" />
      </header>

      <section className="evidence-summary" aria-label="Evidence coverage">
        <div><strong>{references.length}</strong><span>curated references</span></div>
        <div><strong>{implementations.length}</strong><span>implementation records</span></div>
        <div><strong>{experiments.length}</strong><span>experiment records</span></div>
        <div><strong>{algorithms.length}</strong><span>algorithm entities total</span></div>
      </section>

      <section className="evidence-stage-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Evidence profile</span>
            <h2>Coverage stages, not truth scores.</h2>
            <p>An algorithm advances through this archive only when another evidence layer is actually present. The stage does not rank scientific quality or correctness.</p>
          </div>
        </div>
        <div className="evidence-coverage-grid">
          {evidenceStages.map((stage) => (
            <div key={stage}>
              <strong>{stageCounts.get(stage) ?? 0}</strong>
              <span>{stage}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="evidence-hub-grid">
        <Link href="/references" className="evidence-hub-card">
          <div className="evidence-hub-icon"><ScrollText size={19} /></div>
          <span className="research-block-label">Primary knowledge</span>
          <h2>References</h2>
          <p>Papers, standards, and books with explicit roles and links to the algorithms, chapters, and research hypotheses they support.</p>
          <div className="evidence-card-stats"><span>{references.length} records</span><span>{algorithmsWithReferences} algorithms covered</span></div>
          <strong>Browse references <ArrowRight size={14} /></strong>
        </Link>

        <Link href="/implementations" className="evidence-hub-card">
          <div className="evidence-hub-icon"><Code2 size={19} /></div>
          <span className="research-block-label">Executable knowledge</span>
          <h2>Implementations</h2>
          <p>Curated repositories with language, interface, license, maturity, source paths, and verification metadata.</p>
          <div className="evidence-card-stats"><span>{implementations.length} records</span><span>{algorithmsWithImplementations} algorithms covered</span></div>
          <strong>Inspect implementations <ArrowRight size={14} /></strong>
        </Link>

        <Link href="/experiments" className="evidence-hub-card">
          <div className="evidence-hub-icon"><FlaskConical size={19} /></div>
          <span className="research-block-label">Empirical knowledge</span>
          <h2>Experiments</h2>
          <p>Reproducible plans and results preserving baselines, datasets, metrics, environment controls, success criteria, and negative findings.</p>
          <div className="evidence-card-stats"><span>{experiments.length} records</span><span>{algorithmsWithExperiments} algorithms under study</span></div>
          <strong>Browse experiments <ArrowRight size={14} /></strong>
        </Link>
      </section>

      <section className="evidence-flow">
        <div className="section-heading">
          <div><span className="section-kicker">Evidence discipline</span><h2>Keep claims and evidence types distinct.</h2></div>
        </div>
        <div className="evidence-flow-grid">
          <div><span>01</span><BookOpen size={17} /><strong>Concept</strong><p>Algorithm cards summarize mechanisms, assumptions, failure modes, and open questions.</p></div>
          <div><span>02</span><ScrollText size={17} /><strong>Source</strong><p>References establish where the mechanism, guarantee, standard, or empirical result comes from.</p></div>
          <div><span>03</span><Code2 size={17} /><strong>Implementation</strong><p>Registry records identify inspectable code without treating an implementation as proof of correctness.</p></div>
          <div><span>04</span><FlaskConical size={17} /><strong>Experiment</strong><p>Experiment records state what was tested, against which baselines, and how outcomes should be interpreted.</p></div>
        </div>
      </section>

      <section className="evidence-flow citation-summary-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Citation provenance</span>
            <h2>Curated source-to-source edges stay explicit.</h2>
            <p>{curatedCitationEdges} citation edges are currently verified inside the curated reference set. The graph remains intentionally sparse rather than guessing unverified relationships.</p>
          </div>
          <Link href="/references/graph" className="reference-graph-link"><Network size={14} /> Open citation graph <ArrowRight size={13} /></Link>
        </div>
      </section>
    </main>
  );
}
