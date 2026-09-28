"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, GitMerge, TriangleAlert } from "lucide-react";
import type { AlgorithmEntity } from "@/lib/algorithms";
import type { ResearchCombination } from "@/lib/combinations";

export function CombinationBuilder({ algorithms, combinations }: { algorithms: AlgorithmEntity[]; combinations: ResearchCombination[] }) {
  const [leftId, setLeftId] = useState("linucb");
  const [rightId, setRightId] = useState("coverage-guided-fuzzing");

  const left = algorithms.find((algorithm) => algorithm.id === leftId) ?? algorithms[0];
  const right = algorithms.find((algorithm) => algorithm.id === rightId) ?? algorithms[1];

  const analysis = useMemo(() => {
    const sharedFields = left.fields.filter((field) => right.fields.includes(field));
    const sharedFamilies = left.families.filter((family) => right.families.includes(family));
    const leftToRight = left.relations.filter((relation) => relation.target === right.id);
    const rightToLeft = right.relations.filter((relation) => relation.target === left.id);
    const known = combinations.filter((combination) =>
      combination.algorithmIds.includes(left.id) && combination.algorithmIds.includes(right.id),
    );
    return { sharedFields, sharedFamilies, directRelations: [...leftToRight, ...rightToLeft], known };
  }, [combinations, left, right]);

  return (
    <section className="combination-builder" aria-label="Algorithm combination builder">
      <div className="combination-builder-heading">
        <div>
          <span className="research-block-label">Pair explorer</span>
          <h2>What happens if these mechanisms meet?</h2>
        </div>
        <GitMerge size={22} />
      </div>

      <div className="combination-selectors">
        <label>
          <span>Algorithm A</span>
          <select value={leftId} onChange={(event) => setLeftId(event.target.value)}>
            {algorithms.map((algorithm) => <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>)}
          </select>
        </label>
        <span className="combination-times">×</span>
        <label>
          <span>Algorithm B</span>
          <select value={rightId} onChange={(event) => setRightId(event.target.value)}>
            {algorithms.map((algorithm) => <option key={algorithm.id} value={algorithm.id}>{algorithm.name}</option>)}
          </select>
        </label>
      </div>

      {left.id === right.id ? (
        <div className="combination-builder-empty"><TriangleAlert size={16} /> Choose two different algorithms to inspect a combination.</div>
      ) : (
        <div className="combination-analysis">
          <div className="combination-pair-summary">
            <div>
              <span>{left.families[0]}</span>
              <strong>{left.name}</strong>
              <p>{left.summary}</p>
              <Link href={`/algorithms/${left.id}`}>Open card <ArrowRight size={12} /></Link>
            </div>
            <div>
              <span>{right.families[0]}</span>
              <strong>{right.name}</strong>
              <p>{right.summary}</p>
              <Link href={`/algorithms/${right.id}`}>Open card <ArrowRight size={12} /></Link>
            </div>
          </div>

          <div className="combination-signals">
            <div>
              <span>Shared fields</span>
              <strong>{analysis.sharedFields.length ? analysis.sharedFields.join(" · ") : "No exact field overlap"}</strong>
            </div>
            <div>
              <span>Shared families</span>
              <strong>{analysis.sharedFamilies.length ? analysis.sharedFamilies.join(" · ") : "No exact family overlap"}</strong>
            </div>
            <div>
              <span>Direct Atlas relation</span>
              <strong>{analysis.directRelations.length ? analysis.directRelations.map((relation) => relation.type.replaceAll("-", " ")).join(" · ") : "Not yet curated"}</strong>
            </div>
            <div>
              <span>Structured Lab record</span>
              <strong>{analysis.known.length ? `${analysis.known.length} existing` : "Not yet"}</strong>
            </div>
          </div>

          {analysis.known.length > 0 ? (
            <div className="combination-known-records">
              {analysis.known.map((combination) => (
                <a key={combination.id} href={`#${combination.id}`}>
                  <span>{combination.status}</span>
                  <strong>{combination.title}</strong>
                  <p>{combination.hypothesis}</p>
                  <ArrowRight size={14} />
                </a>
              ))}
            </div>
          ) : (
            <div className="combination-builder-empty">
              No structured hypothesis exists for this pair yet. Use their assumptions, interfaces, and failure modes as the starting material rather than assuming the combination is useful.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
