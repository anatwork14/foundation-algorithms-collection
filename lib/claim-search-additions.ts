import type { ClaimRecord } from "./claims-base.ts";

/** Learned-search Claims kept modular from the historical Claim catalog. */
export const searchClaimAdditions: ClaimRecord[] = [
  {
    id: "learned-cost-to-go-guides-a-star",
    kind: "Mechanism",
    statement: "A learned distance or cost-to-go estimate can be used as a heuristic inside A* variants so a learned model guides which states are expanded while the outer search procedure still performs explicit structured exploration.",
    algorithmIds: ["learned-heuristics", "a-star"],
    chapterSlug: "02-search-graphs-ordering-indexing",
    passageContains: "Use machine learning to estimate distance/value and A* or beam search to enforce structured exploration.",
    referenceIds: ["agostinelli-2019-deepcubea"],
    note: "DeepCubeA is a weighted-A* example. A learned heuristic is not automatically admissible or consistent, so classical A* optimality guarantees do not automatically transfer; inference cost and distribution shift can also erase search savings.",
  },
];
