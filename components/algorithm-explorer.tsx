"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, ShieldCheck } from "lucide-react";
import type { AlgorithmEntity, MaturityLevel } from "@/lib/algorithms";
import { algorithmSearchText } from "@/lib/algorithm-catalog";
import { algorithmVariants, variantsForAlgorithm } from "@/lib/algorithm-variants";
import type { EvidenceStage } from "@/lib/evidence-profile";
import { fieldKey, fields, type ResearchField } from "@/lib/taxonomy";

const maturityOptions: Array<MaturityLevel | "All"> = [
  "All",
  "Established foundation",
  "Production-proven",
  "Active research",
  "Emerging",
];

const evidenceStageOptions: Array<EvidenceStage | "All"> = [
  "All",
  "Concept only",
  "Source-backed",
  "Inspectable implementation",
  "Experiment protocol",
  "Empirical result",
  "Replicated",
];

type EvidenceProfileSummary = {
  algorithmId: string;
  stage: EvidenceStage;
};

export function AlgorithmExplorer({ algorithms, evidenceProfiles }: { algorithms: AlgorithmEntity[]; evidenceProfiles: EvidenceProfileSummary[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<ResearchField | "All">("All");
  const [maturity, setMaturity] = useState<MaturityLevel | "All">("All");
  const [evidenceStage, setEvidenceStage] = useState<EvidenceStage | "All">("All");
  const profileByAlgorithm = useMemo(() => new Map(evidenceProfiles.map((profile) => [profile.algorithmId, profile])), [evidenceProfiles]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return algorithms.filter((algorithm) => {
      const fieldMatch = field === "All" || algorithm.fields.includes(field);
      const maturityMatch = maturity === "All" || algorithm.maturity === maturity;
      const stage = profileByAlgorithm.get(algorithm.id)?.stage ?? "Concept only";
      const evidenceMatch = evidenceStage === "All" || stage === evidenceStage;
      const queryMatch = !needle || algorithmSearchText(algorithm).includes(needle) || stage.toLowerCase().includes(needle);
      return fieldMatch && maturityMatch && evidenceMatch && queryMatch;
    });
  }, [algorithms, evidenceStage, field, maturity, profileByAlgorithm, query]);

  return (
    <main className="entity-index-page shell">
      <header className="entity-index-hero">
        <div>
          <span className="eyebrow"><span className="live-dot" /> Algorithm index</span>
          <h1>Study the mechanisms, not only the chapters.</h1>
          <p>
            Curated algorithm entities connect names, assumptions, complexity, maturity, evidence coverage, source chapters, variants, and research relationships.
          </p>
        </div>
        <div className="entity-index-count">
          <strong>{algorithms.length}</strong>
          <span>curated entities</span>
          <Link href="/variants" className="source-button">
            {algorithmVariants.length} variants <ArrowUpRight size={13} />
          </Link>
        </div>
      </header>

      <section className="entity-controls algorithm-evidence-controls" aria-label="Algorithm filters">
        <label className="entity-search">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search LinUCB, QSVT, fuzzing, uncertainty…" />
        </label>
        <select value={field} onChange={(event) => setField(event.target.value as ResearchField | "All")} aria-label="Filter by field">
          <option value="All">All fields</option>
          {fields.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
        </select>
        <select value={maturity} onChange={(event) => setMaturity(event.target.value as MaturityLevel | "All")} aria-label="Filter by maturity">
          {maturityOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All maturity levels" : item}</option>)}
        </select>
        <select value={evidenceStage} onChange={(event) => setEvidenceStage(event.target.value as EvidenceStage | "All")} aria-label="Filter by evidence stage">
          {evidenceStageOptions.map((item) => <option key={item} value={item}>{item === "All" ? "All evidence stages" : item}</option>)}
        </select>
      </section>

      <div className="entity-result-count">{results.length} matching algorithms</div>

      <section className="entity-list" aria-live="polite">
        {results.map((algorithm) => {
          const primaryField = algorithm.fields[0];
          const evidenceProfile = profileByAlgorithm.get(algorithm.id);
          const variantCount = variantsForAlgorithm(algorithm.id).length;
          return (
            <Link key={algorithm.id} href={`/algorithms/${algorithm.id}`} className="entity-row">
              <span className={`entity-field-dot field-dot-${fieldKey(primaryField)}`} aria-hidden="true" />
              <div className="entity-row-main">
                <div className="entity-row-overline">
                  <span>{algorithm.families[0]}</span>
                  <span>·</span>
                  <span>{algorithm.maturity}</span>
                </div>
                <h2>{algorithm.name}</h2>
                <p>{algorithm.summary}</p>
                <div className="entity-tags">
                  {algorithm.aliases.slice(0, 2).map((alias) => <span key={alias}>{alias}</span>)}
                  {algorithm.fields.map((item) => <span key={item}>{item}</span>)}
                  {evidenceProfile && <span className="entity-evidence-stage"><ShieldCheck size={11} /> {evidenceProfile.stage}</span>}
                </div>
              </div>
              <div className="entity-row-meta">
                <span>{algorithm.relations.length} relations</span>
                {variantCount > 0 && <span>{variantCount} variant{variantCount === 1 ? "" : "s"}</span>}
                <span>{algorithm.chapterSlugs.length} sources</span>
                <ArrowUpRight size={17} />
              </div>
            </Link>
          );
        })}
        {!results.length && (
          <div className="entity-empty">
            <Search size={22} />
            <strong>No matching algorithm entity.</strong>
            <span>Try a broader mechanism, field, maturity, or evidence stage.</span>
          </div>
        )}
      </section>
    </main>
  );
}
