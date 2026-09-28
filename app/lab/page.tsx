import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Beaker, BookOpen, CheckCircle2, FlaskConical, TriangleAlert } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithms";
import { combinations } from "@/lib/combinations";
import { getAllDocuments } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lab",
  description: "Turn algorithm combinations into explicit research hypotheses, risks, metrics, and experiment plans.",
};

export default function LabPage() {
  const documents = getAllDocuments();

  return (
    <main className="lab-page shell">
      <header className="lab-hero">
        <span className="eyebrow"><FlaskConical size={13} /> Combination lab</span>
        <h1>Move from interesting pairings to testable research.</h1>
        <p>
          Every Lab record makes the proposed interfaces, conflicts, risks, metrics, and experiment steps explicit. Ideas remain hypotheses until evidence says otherwise.
        </p>
      </header>

      <section className="lab-principles" aria-label="Lab principles">
        <div><span>01</span><strong>Compatibility first</strong><p>Identify what the algorithms can actually exchange: state, candidates, priors, rewards, constraints, or proofs.</p></div>
        <div><span>02</span><strong>Expose tensions</strong><p>Write down mismatched assumptions before designing the experiment.</p></div>
        <div><span>03</span><strong>Measure against baselines</strong><p>A combination is useful only if it beats simpler alternatives on explicit metrics.</p></div>
      </section>

      <section className="lab-records">
        {combinations.map((combination, index) => {
          const components = combination.algorithmIds.map(getAlgorithm).filter((item) => Boolean(item));
          const sourceDocs = combination.sourceChapters
            .map((slug) => documents.find((doc) => doc.slug === slug))
            .filter((doc) => Boolean(doc));

          return (
            <article key={combination.id} className="lab-record" id={combination.id}>
              <header className="lab-record-header">
                <div>
                  <div className="lab-record-kicker"><span>{String(index + 1).padStart(2, "0")}</span>{combination.kicker}</div>
                  <h2>{combination.title}</h2>
                  <div className="lab-component-links">
                    {components.map((algorithm) => algorithm && (
                      <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`}>{algorithm.name}<ArrowRight size={12} /></Link>
                    ))}
                  </div>
                </div>
                <span className="lab-status">{combination.status}</span>
              </header>

              <div className="lab-hypothesis">
                <span>Research hypothesis</span>
                <p>{combination.hypothesis}</p>
              </div>

              <div className="lab-record-grid">
                <section>
                  <h3><CheckCircle2 size={15} /> Compatibility</h3>
                  <ul>{combination.compatibility.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section>
                  <h3><TriangleAlert size={15} /> Tensions</h3>
                  <ul>{combination.tensions.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section>
                  <h3><Beaker size={15} /> Expected benefit</h3>
                  <ul>{combination.expectedBenefits.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section>
                  <h3><TriangleAlert size={15} /> Risks</h3>
                  <ul>{combination.risks.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              </div>

              <div className="lab-experiment">
                <div className="lab-experiment-metrics">
                  <span className="research-block-label">Metrics</span>
                  <div>{combination.metrics.map((metric) => <span key={metric}>{metric}</span>)}</div>
                </div>
                <div className="lab-experiment-plan">
                  <span className="research-block-label">Experiment plan</span>
                  <ol>{combination.experimentPlan.map((step) => <li key={step}>{step}</li>)}</ol>
                </div>
              </div>

              <footer className="lab-record-footer">
                <div><BookOpen size={14} /><span>Research sources</span></div>
                <div className="lab-source-links">
                  {sourceDocs.map((doc) => doc && <Link key={doc.slug} href={`/archive/${doc.slug}`}>{doc.number} · {doc.title}</Link>)}
                </div>
              </footer>
            </article>
          );
        })}
      </section>
    </main>
  );
}
