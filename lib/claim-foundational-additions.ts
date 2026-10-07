import type { ClaimRecord } from "./claims-base.ts";

/** Passage-backed Claims for foundational algorithms that previously had no Claim-layer coverage. */
export const foundationalClaimAdditions: ClaimRecord[] = [
  {
    id: "dynamic-programming-state-reuse",
    kind: "Mechanism",
    statement: "Dynamic programming avoids repeated recursive work by defining reusable subproblem states, solving each state once, and composing stored results through an ordered dependency structure.",
    algorithmIds: ["dynamic-programming"],
    chapterSlug: "01-core-problem-solving-paradigms",
    passageContains: "Dynamic programming converts repeated recursive work into a directed acyclic dependency computation whenever the state transitions can be ordered.",
    referenceIds: ["bellman-1952-dynamic-programming"],
    note: "This claim describes the reusable-state/recurrence mechanism of dynamic programming. Concrete state spaces, transition costs, acyclicity, and complexity remain problem-specific, and some dynamic programs operate over cyclic Bellman equations through iterative solution methods.",
  },
  {
    id: "bayesian-inference-prior-evidence-posterior",
    kind: "Mechanism",
    statement: "Bayesian inference updates prior uncertainty after observing evidence by combining the prior with a likelihood and normalizing the result into a posterior distribution.",
    algorithmIds: ["bayesian-inference"],
    chapterSlug: "05-probabilistic-control-reinforcement-learning",
    passageContains: "We need a principled way to update prior beliefs after observing evidence.",
    referenceIds: ["gelman-2013-bayesian-data-analysis"],
    note: "This record captures the canonical prior/likelihood/posterior updating pattern. Gelman et al. provide a modern synthesis; exact and approximate Bayesian computation, model checking, and decision analysis extend substantially beyond the elementary Bayes-rule identity.",
  },
  {
    id: "embedding-models-continuous-vector-representations",
    kind: "Mechanism",
    statement: "Learned embedding models map discrete objects into continuous vectors so geometric relationships in the representation space can encode useful syntactic, semantic, or task-relevant similarity.",
    algorithmIds: ["embedding-models"],
    chapterSlug: "06-representation-similarity-compression-parsing",
    passageContains: "The word2vec work demonstrated efficient learning of continuous word representations at large scale.",
    referenceIds: ["mikolov-2013-word-representations"],
    note: "Mikolov et al. provide a primary learned-word-vector example. The archive's broader Embedding Models entity also covers documents, images, graph nodes, users/items, and modern contextual embeddings whose objectives and geometries can differ substantially.",
  },
];
