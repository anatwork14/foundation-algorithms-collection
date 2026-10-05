import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CircleDashed, Code2, FlaskConical, GitBranch, Network, RefreshCcw, ScrollText, Search, ShieldCheck } from "lucide-react";
import { EvidenceNav } from "@/components/evidence-nav";
import { algorithms } from "@/lib/algorithm-catalog";
import { claims } from "@/lib/claims";
import { getAllDocuments } from "@/lib/content";
import { getEvidenceGapCatalog } from "@/lib/evidence-gaps";
import { getAlgorithmEvidenceProfile, type EvidenceStage } from "@/lib/evidence-profile";
import { experiments } from "@/lib/experiments";
import { implementationUpstreamReviews } from "@/lib/implementation-upstream-reviews";
import { implementations } from "@/lib/implementations";
import { references } from "@/lib/references";
import { relationProvenance } from "@/lib/relation-provenance";
import { getRelationProvenanceCoverage } from "@/lib/relation-provenance-coverage";
import { replications } from "@/lib/replications";

export const metadata: Metadata = {
  title: "Evidence",
  description: "Trace Foundation Algorithms research from source passages and primary references to implementations, experiments, and independent replication.",
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
  const documents = getAllDocuments();
  const passageCount = documents.reduce((sum, document) => sum + document.passages.length, 0);
  const algorithmsWithReferences = new Set(references.flatMap((reference) => reference.algorithmIds)).size;
  const algorithmsWithImplementations = new Set(implementations.flatMap((implementation) => implementation.algorithmIds)).size;
  const algorithmsWithExperiments = new Set(experiments.flatMap((experiment) => experiment.algorithmIds)).size;
  const algorithmsWithReplications = new Set(replications.flatMap((replication) => replication.algorithmIds)).size;
  const implementationsWithUpstreamReviews = new Set(implementationUpstreamReviews.map((review) => review.implementationId)).size;
  const profiles = algorithms.map((algorithm) => getAlgorithmEvidenceProfile(algorithm.id));
  const stageCounts = new Map<EvidenceStage, number>(evidenceStages.map((stage) => [stage, 0]));
  for (const profile of profiles) stageCounts.set(profile.stage, (stageCounts.get(profile.stage) ?? 0) + 1);
  const curatedCitationEdges = references.reduce((sum, reference) => sum + reference.citations.length, 0);
  const relationCoverage = getRelationProvenanceCoverage(algorithms, relationProvenance);
  const gapCatalog = getEvidenceGapCatalog();
  const algorithmsWithGaps = gapCatalog.filter((item) => item.gaps.length > 0).length;

  return (
    <main className="evidence-hub shell">
      <header className="evidence-hub-hero">
        <span className="eyebrow"><GitBranch size={13} /> Research evidence</span>
        <h1>Trace an idea from source to code to experiment.</h1>
        <p>
          Evidence is kept separate from conceptual descriptions so the archive can distinguish source passages, primary literature and standards, executable code, curated claim assertions, upstream implementation review, project experiments, and independently authored replication evidence.
        </p>
        <EvidenceNav current="overview" />
      </header>

      <section className="evidence-summary" aria-label="Evidence coverage">
        <div><strong>{references.length}</strong><span>curated references</span></div>
        <div><strong>{claims.length}</strong><span>curated claims</span></div>
        <div><strong>{implementations.length}</strong><span>implementation records</span></div>
        <div><strong>{implementationUpstreamReviews.length}</strong><span>upstream reviews</span></div>
        <div><strong>{experiments.length}</strong><span>experiment records</span></div>
        <div><strong>{replications.length}</strong><span>independent replications</span></div>
      </section>

      <section className="evidence-stage-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Evidence profile</span>
            <h2>Coverage stages, not truth scores.</h2>
            <p>An algorithm advances through this archive only when another evidence layer is actually present. A `Replicated` stage means an explicit independent evaluation record exists; it does not imply that evaluation agreed with the original result.</p>
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
        <Link href="/evidence/gaps" className="evidence-hub-card">
          <div className="evidence-hub-icon"><CircleDashed size={19} /></div>
          <span className="research-block-label">Research planning</span>
          <h2>Evidence Gaps</h2>
          <p>Inspect which archive layers are not yet recorded for each indexed algorithm without interpreting missing coverage as weak research.</p>
          <div className="evidence-card-stats"><span>{algorithmsWithGaps} algorithms with gaps</span><span>{gapCatalog.length} indexed algorithms</span></div>
          <strong>Inspect coverage gaps <ArrowRight size={14} /></strong>
        </Link>

        <Link href="/passages" className="evidence-hub-card">
          <div className="evidence-hub-icon"><Search size={19} /></div>
          <span className="research-block-label">Source units</span>
          <h2>Passages</h2>
          <p>Deterministic Markdown-derived prose units with section anchors, stable content IDs, and exact source-line ranges.</p>
          <div className="evidence-card-stats"><span>{passageCount} passages</span><span>{documents.length} source chapters</span></div>
          <strong>Inspect passages <ArrowRight size={14} /></strong>
        </Link>

        <Link href="/claims" className="evidence-hub-card">
          <div className="evidence-hub-icon"><ShieldCheck size={19} /></div>
          <span className="research-block-label">Curated assertions</span>
          <h2>Claims</h2>
          <p>Reviewed statements that explicitly connect an Algorithm to one unique source passage and one or more curated references.</p>
          <div className="evidence-card-stats"><span>{claims.length} records</span><span>validated provenance</span></div>
          <strong>Inspect claims <ArrowRight size={14} /></strong>
        </Link>

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
          <p>Curated repositories with immutable source snapshots, interfaces, license metadata, and exact verification revisions.</p>
          <div className="evidence-card-stats"><span>{implementations.length} records</span><span>{algorithmsWithImplementations} algorithms covered</span></div>
          <strong>Inspect implementations <ArrowRight size={14} /></strong>
        </Link>

        <Link href="/implementations/reviews" className="evidence-hub-card">
          <div className="evidence-hub-icon"><RefreshCcw size={19} /></div>
          <span className="research-block-label">Operational provenance</span>
          <h2>Upstream Reviews</h2>
          <p>Append-only decisions that compare immutable implementation pins with later upstream commits without treating branch movement as permission to rewrite evidence.</p>
          <div className="evidence-card-stats"><span>{implementationUpstreamReviews.length} review revisions</span><span>{implementationsWithUpstreamReviews} implementations reviewed</span></div>
          <strong>Inspect upstream reviews <ArrowRight size={14} /></strong>
        </Link>

        <Link href="/experiments" className="evidence-hub-card">
          <div className="evidence-hub-icon"><FlaskConical size={19} /></div>
          <span className="research-block-label">Project empirical knowledge</span>
          <h2>Experiments</h2>
          <p>Reproducible plans and results preserving baselines, datasets/benchmarks, metrics, environment controls, success criteria, and negative findings.</p>
          <div className="evidence-card-stats"><span>{experiments.length} records</span><span>{algorithmsWithExperiments} algorithms under study</span></div>
          <strong>Browse experiments <ArrowRight size={14} /></strong>
        </Link>

        <Link href="/replications" className="evidence-hub-card">
          <div className="evidence-hub-icon"><RefreshCcw size={19} /></div>
          <span className="research-block-label">Independent evaluation</span>
          <h2>Replications</h2>
          <p>Independently authored replication/evaluation sources with explicit links to original references, outcomes, and independence notes.</p>
          <div className="evidence-card-stats"><span>{replications.length} records</span><span>{algorithmsWithReplications} algorithms independently evaluated</span></div>
          <strong>Inspect replications <ArrowRight size={14} /></strong>
        </Link>
      </section>

      <section className="evidence-flow atlas-provenance-summary" aria-label="Atlas relation provenance coverage">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Atlas provenance</span>
            <h2 id="atlas-provenance-heading">Keep structural relations distinct from sourced relations.</h2>
            <p>
              Atlas edges can be useful conceptual structure before a relation-level source is curated. These counts describe provenance coverage only; they are not confidence, quality, or truth scores.
            </p>
          </div>
          <Link href="/atlas?evidence=source-backed" className="reference-graph-link"><Network size={14} /> Inspect source-backed Atlas edges <ArrowRight size={13} /></Link>
        </div>
        <div className="evidence-relation-summary">
          <div><strong>{relationCoverage.typedEdges}</strong><span>typed Atlas edges</span></div>
          <div><strong>{relationCoverage.sourceBackedEdges}</strong><span>source-backed edges</span></div>
          <div><strong>{relationCoverage.conceptualEdges}</strong><span>conceptual edges</span></div>
          <div><strong>{relationCoverage.algorithmsWithSourceBackedEdges}</strong><span>algorithms touching sourced edges</span></div>
        </div>
      </section>

      <section className="evidence-flow">
        <div className="section-heading">
          <div><span className="section-kicker">Evidence discipline</span><h2>Keep claims and evidence types distinct.</h2></div>
        </div>
        <div className="evidence-flow-grid">
          <div><span>01</span><BookOpen size={17} /><strong>Concept</strong><p>Algorithm cards summarize mechanisms, assumptions, failure modes, and open questions.</p></div>
          <div><span>02</span><Search size={17} /><strong>Passage</strong><p>Passage records identify the exact place in the Markdown corpus where an archive statement is grounded.</p></div>
          <div><span>03</span><ScrollText size={17} /><strong>Source</strong><p>References establish where the mechanism, guarantee, standard, or empirical result comes from.</p></div>
          <div><span>04</span><ShieldCheck size={17} /><strong>Claim</strong><p>Curated claims join a precise archive statement to a unique passage and explicit supporting references.</p></div>
          <div><span>05</span><Code2 size={17} /><strong>Implementation</strong><p>Registry records identify exact inspected code revisions without treating an implementation as proof of correctness.</p></div>
          <div><span>06</span><RefreshCcw size={17} /><strong>Upstream review</strong><p>Append-only review records preserve what changed upstream and whether the archive should retain, advance, or investigate an immutable implementation pin.</p></div>
          <div><span>07</span><FlaskConical size={17} /><strong>Experiment</strong><p>Project experiment records state what was tested, against which baselines, and how outcomes should be interpreted.</p></div>
          <div><span>08</span><RefreshCcw size={17} /><strong>Replication</strong><p>Independent records preserve agreement, disagreement, partial reproduction, or inconclusive evaluation without converting any outcome into a truth score.</p></div>
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