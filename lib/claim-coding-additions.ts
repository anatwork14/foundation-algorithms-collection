import type { ClaimRecord } from "./claims-base.ts";

/** Coding/inference Claims kept modular from the historical Claim catalog. */
export const codingClaimAdditions: ClaimRecord[] = [
  {
    id: "error-correction-posterior-decoding",
    kind: "Mechanism",
    statement: "Probabilistic error-correction decoding can be framed as posterior inference over candidate codewords, error patterns, or logical error classes conditioned on observed syndrome or channel evidence.",
    algorithmIds: ["error-correcting-codes", "bayesian-inference"],
    chapterSlug: "24-quantum-error-correction-decoding",
    passageContains: "Probabilistic decoding can be framed as posterior inference over candidate error patterns or codewords conditioned on observed syndrome or soft channel evidence.",
    referenceIds: ["olding-2014-bayesian-error-correction"],
    note: "This claim is scoped to probabilistic/Bayesian decoding formulations. Algebraic bounded-distance decoders, list decoders, matching decoders, and other code-specific procedures need not construct the same posterior representation explicitly.",
  },
];
