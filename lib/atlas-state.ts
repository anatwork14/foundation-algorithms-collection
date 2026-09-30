import type { RelationType } from "@/lib/algorithms";
import type { ResearchField } from "@/lib/taxonomy";

export const atlasRelationTypes = [
  "All",
  "derived-from",
  "generalizes",
  "special-case-of",
  "alternative-to",
  "combines-with",
  "depends-on",
  "used-by",
  "approximates",
  "secures",
  "accelerates",
] as const satisfies ReadonlyArray<RelationType | "All">;

export type RelationEvidenceFilter = "All" | "Source-backed" | "Conceptual";

export type AtlasState = {
  algorithmId: string;
  field: ResearchField | "All";
  relationType: RelationType | "All";
  relationEvidence: RelationEvidenceFilter;
};

export type AtlasStateOptions = {
  algorithmIds: Iterable<string>;
  fields: ReadonlyArray<ResearchField>;
  defaultAlgorithmId?: string;
};

export function atlasEvidenceParam(value: RelationEvidenceFilter) {
  if (value === "Source-backed") return "source-backed";
  if (value === "Conceptual") return "conceptual";
  return null;
}

export function parseAtlasState(search: string, options: AtlasStateOptions): AtlasState {
  const defaultAlgorithmId = options.defaultAlgorithmId ?? "linucb";
  const algorithmIds = new Set(options.algorithmIds);
  const params = new URLSearchParams(search);
  const algorithmParam = params.get("algorithm");
  const fieldParam = params.get("field");
  const relationParam = params.get("relation");
  const evidenceParam = params.get("evidence");

  return {
    algorithmId: algorithmParam && algorithmIds.has(algorithmParam) ? algorithmParam : defaultAlgorithmId,
    field: options.fields.includes(fieldParam as ResearchField) ? fieldParam as ResearchField : "All",
    relationType: atlasRelationTypes.includes(relationParam as RelationType) ? relationParam as RelationType : "All",
    relationEvidence:
      evidenceParam === "source-backed"
        ? "Source-backed"
        : evidenceParam === "conceptual"
          ? "Conceptual"
          : "All",
  };
}

export function updateAtlasSearch(search: string, name: string, value: string | null) {
  const params = new URLSearchParams(search);
  if (value) params.set(name, value);
  else params.delete(name);
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
