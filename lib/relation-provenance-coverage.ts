import type { AlgorithmEntity } from "@/lib/algorithms";
import type { RelationProvenanceRecord } from "@/lib/relation-provenance";

export type RelationProvenanceCoverage = {
  typedEdges: number;
  sourceBackedEdges: number;
  conceptualEdges: number;
  algorithmsWithSourceBackedEdges: number;
};

export function getRelationProvenanceCoverage(
  algorithms: Pick<AlgorithmEntity, "id" | "relations">[],
  provenance: Pick<RelationProvenanceRecord, "sourceId" | "targetId">[],
): RelationProvenanceCoverage {
  const typedEdges = algorithms.reduce((sum, algorithm) => sum + algorithm.relations.length, 0);
  const sourceBackedEdges = provenance.length;
  const conceptualEdges = Math.max(0, typedEdges - sourceBackedEdges);
  const algorithmsWithSourceBackedEdges = new Set(
    provenance.flatMap((record) => [record.sourceId, record.targetId]),
  ).size;

  return {
    typedEdges,
    sourceBackedEdges,
    conceptualEdges,
    algorithmsWithSourceBackedEdges,
  };
}
