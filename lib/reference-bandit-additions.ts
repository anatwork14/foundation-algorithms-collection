import type { ReferenceEntity } from "./references-core.ts";

/** Primary-source additions for contextual-bandit methods and extensions. */
export const banditReferenceAdditions: ReferenceEntity[] = [
  {
    id: "agrawal-goyal-2013-contextual-thompson",
    title: "Thompson Sampling for Contextual Bandits with Linear Payoffs",
    authors: ["Shipra Agrawal", "Navin Goyal"],
    year: 2013,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "ICML 2013 / PMLR 28(3)",
    url: "https://proceedings.mlr.press/v28/agrawal13.html",
    algorithmIds: ["thompson-sampling"],
    combinationIds: [],
    chapterSlugs: ["08-bandits-contextual-bandits-linucb"],
    citations: [
      {
        targetId: "thompson-1933-probability-matching",
        note: "Agrawal and Goyal extend Thompson Sampling from its probability-matching lineage to stochastic contextual bandits with linear payoff functions.",
        verificationUrl: "https://proceedings.mlr.press/v28/agrawal13.html",
        verifiedAt: "2026-10-04",
      },
      {
        targetId: "chapelle-2011-thompson-evaluation",
        note: "Agrawal and Goyal explicitly cite Chapelle and Li's empirical evaluation when motivating renewed interest in Thompson Sampling and summarize its competitive performance against UCB-style methods in contextual applications.",
        verificationUrl: "https://proceedings.mlr.press/v28/agrawal13.pdf",
        verifiedAt: "2026-10-04",
      },
    ],
    notices: [],
    summary: "Designs and analyzes Thompson Sampling for stochastic contextual multi-armed bandits with linear payoff functions, providing theoretical guarantees in the linear contextual setting.",
    significance: "Primary extension source showing that posterior-sampling exploration can address the same linear contextual-bandit problem family as confidence-bound methods such as LinUCB, while preserving distinct Bayesian/randomized and optimistic/UCB decision rules.",
    tags: ["thompson-sampling", "contextual-bandit", "linear-bandit", "posterior-sampling", "regret"],
  },
];
