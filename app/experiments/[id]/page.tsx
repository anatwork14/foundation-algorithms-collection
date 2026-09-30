import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Beaker, CheckCircle2, Clock3, Database, FlaskConical, Gauge, TriangleAlert } from "lucide-react";
import { getAlgorithm } from "@/lib/algorithm-catalog";
import { combinations } from "@/lib/combination-catalog";
import { historyForExperiment } from "@/lib/experiment-history";
import { experiments, getExperiment } from "@/lib/experiments";

export function generateStaticParams() {
  return experiments.map((experiment) => ({ id: experiment.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const experiment = getExperiment(id);
  if (!experiment) return { title: "Experiment" };
  return { title: experiment.title, description: experiment.objective };
}

export default async function ExperimentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const experiment = getExperiment(id);
  if (!experiment) notFound();

  const combination = combinations.find((item) => item.id === experiment.combinationId) ?? null;
  const linkedAlgorithms = experiment.algorithmIds.map(getAlgorithm).filter((item) => Boolean(item));
  const history = historyForExperiment(experiment.id);

  return (
    <main className="experiment-detail-page">
      <div className="shell reference-breadcrumbs">
        <Link href="/experiments"><ArrowLeft size={14} aria-hidden="true" /> Experiments</Link>
        <span>/</span>
        <span>{experiment.status}</span>
      </div>

      <header className="shell experiment-detail-hero">
        <div>
          <span className={`experiment-status status-${experiment.status.toLowerCase()}`}>{experiment.status}</span>
          <h1>{experiment.title}</h1>
          <p>{experiment.objective}</p>
        </div>
        <aside className="reference-detail-meta" aria-label="Experiment metadata">
          <div><span>Algorithms</span><strong>{experiment.algorithmIds.length}</strong></div>
          <div><span>Baselines</span><strong>{experiment.baselines.length}</strong></div>
          <div><span>Metrics</span><strong>{experiment.metrics.length}</strong></div>
          <div><span>Revisions</span><strong>{history.length}</strong></div>
          <div><span>Updated</span><strong>{experiment.lastUpdated}</strong></div>
        </aside>
      </header>

      <div className="shell experiment-detail-layout">
        <article>
          <section className="research-block">
            <div className="research-block-label">01 · Hypothesis</div>
            <h2>What this experiment is trying to falsify</h2>
            <p>{experiment.hypothesis}</p>
          </section>

          <section className="research-block">
            <div className="research-block-label">02 · Baselines</div>
            <h2>What the proposed method is compared against</h2>
            <ul>{experiment.baselines.map((baseline) => <li key={baseline}>{baseline}</li>)}</ul>
          </section>

          <section className="research-block">
            <div className="research-block-label">03 · Data / benchmarks</div>
            <h2>What is measured</h2>
            <div className="experiment-dataset-list">
              {experiment.datasets.map((dataset) => (
                <div key={dataset.name}>
                  <Database size={15} aria-hidden="true" />
                  <div><strong>{dataset.name}</strong><p>{dataset.purpose}</p></div>
                  {dataset.url && <a href={dataset.url} target="_blank" rel="noreferrer">Source ↗</a>}
                </div>
              ))}
            </div>
          </section>

          <section className="research-block">
            <div className="research-block-label">04 · Metrics</div>
            <h2>What counts as evidence</h2>
            <div className="experiment-metric-grid">
              {experiment.metrics.map((metric) => <span key={metric}><Gauge size={14} aria-hidden="true" /> {metric}</span>)}
            </div>
          </section>

          <section className="research-block">
            <div className="research-block-label">05 · Environment controls</div>
            <h2>What must stay controlled</h2>
            <ul>{experiment.environment.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className="research-block">
            <div className="research-block-label">06 · Procedure</div>
            <h2>Reproduction plan</h2>
            <ol>{experiment.procedure.map((step) => <li key={step}>{step}</li>)}</ol>
          </section>

          <section className="research-block">
            <div className="research-block-label">07 · Interpretation criteria</div>
            <h2>How this record should be interpreted</h2>
            <ul>{experiment.successCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>
          </section>

          <section className="research-block">
            <div className="research-block-label">08 · Result</div>
            <h2>{experiment.result ? `${experiment.result.outcome} outcome` : "No result yet"}</h2>
            {experiment.result ? (
              <div className="experiment-result-card">
                <p>{experiment.result.summary}</p>
                <div className="experiment-result-metrics">
                  {experiment.result.metricResults.map((metric) => (
                    <div key={metric.metric}><span>{metric.metric}</span><strong>{metric.value}</strong></div>
                  ))}
                </div>
                {experiment.result.limitations.length > 0 && (
                  <div><h3>Limitations</h3><ul>{experiment.result.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
                )}
              </div>
            ) : (
              <div className="experiment-no-result"><TriangleAlert size={17} aria-hidden="true" /><p>This is a planned research record. No empirical result is claimed yet.</p></div>
            )}
          </section>

          <section className="research-block">
            <div className="research-block-label">09 · Revision history</div>
            <h2>How this experiment record changed over time</h2>
            <p className="experiment-history-intro">History is append-only research provenance: revisions preserve protocol, status, artifact, and result milestones instead of replacing earlier states.</p>
            <ol className="experiment-history" aria-label="Experiment revision history">
              {history.map((entry) => (
                <li key={entry.revision}>
                  <div className="experiment-history-marker" aria-hidden="true"><Clock3 size={13} /></div>
                  <div className="experiment-history-content">
                    <div className="experiment-history-meta">
                      <span>r{entry.revision}</span>
                      <time dateTime={entry.date}>{entry.date}</time>
                      <span>{entry.kind}</span>
                      <span className={`experiment-status status-${entry.status.toLowerCase()}`}>{entry.status}</span>
                    </div>
                    <strong>{entry.title}</strong>
                    <p>{entry.note}</p>
                    {entry.artifactLabels?.length ? (
                      <div className="experiment-history-artifacts" aria-label="Artifacts referenced by this revision">
                        {entry.artifactLabels.map((label) => <span key={label}>{label}</span>)}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </article>

        <aside className="reference-detail-side">
          {combination && (
            <div className="entity-side-card">
              <div className="entity-side-title"><FlaskConical size={14} aria-hidden="true" /> Parent hypothesis</div>
              <Link href={`/lab#${combination.id}`} className="relation-link">
                <span>{combination.status}</span>
                <strong>{combination.title}</strong>
                <small>{combination.hypothesis}</small>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="entity-side-card">
            <div className="entity-side-title"><Beaker size={14} aria-hidden="true" /> Algorithms under test</div>
            {linkedAlgorithms.map((algorithm) => algorithm && (
              <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`} className="relation-link">
                <span>{algorithm.fields[0]}</span>
                <strong>{algorithm.name}</strong>
                <small>{algorithm.families[0]}</small>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>

          <div className="entity-side-card">
            <div className="entity-side-title"><CheckCircle2 size={14} aria-hidden="true" /> Artifacts</div>
            {experiment.artifacts.map((artifact) => artifact.url ? (
              <a key={artifact.label} href={artifact.url} target="_blank" rel="noreferrer" className="entity-reference-link">
                <span>Available</span><strong>{artifact.label}</strong><small>Open artifact ↗</small>
              </a>
            ) : (
              <div key={artifact.label} className="entity-reference-link experiment-artifact-pending">
                <span>Pending</span><strong>{artifact.label}</strong><small>Not committed yet</small>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
