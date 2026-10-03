import type { MaturityLevel } from "@/lib/algorithms";

export type AlgorithmVariantSource = {
  chapterSlug: string;
  anchor: string;
  label: string;
};

export type AlgorithmVariantRecord = {
  id: string;
  parentAlgorithmId: string;
  name: string;
  aliases: string[];
  summary: string;
  distinction: string;
  maturity?: MaturityLevel;
  assumptions: string[];
  tradeoffs: string[];
  implementationNotes: string[];
  complexityNote?: string;
  sourceLinks: AlgorithmVariantSource[];
  tags: string[];
};

/**
 * Variants are subordinate research records rather than standalone Algorithms.
 * They represent materially different formulations of one parent mechanism
 * while preserving the parent's conceptual identity.
 */
export const algorithmVariants: AlgorithmVariantRecord[] = [
  {
    id: "disjoint-linucb",
    parentAlgorithmId: "linucb",
    name: "Disjoint LinUCB",
    aliases: ["Per-arm LinUCB"],
    summary: "Maintains a separate linear reward model and confidence geometry for each action.",
    distinction: "Each arm receives its own parameter vector and covariance state instead of sharing one global linear model across the action set.",
    assumptions: [
      "Actions recur often enough to estimate separate per-arm parameters.",
      "A linear reward model is reasonable within each action-specific context space.",
    ],
    tradeoffs: [
      "Simple action-specific modeling, but no statistical sharing between arms.",
      "Cold start becomes expensive when the action catalog is large or changes frequently.",
      "Dense state requires roughly O(K d²) matrix storage for K actions with d-dimensional features.",
    ],
    implementationNotes: [
      "Maintain one A_a and b_a pair per action.",
      "Score each candidate with its own fitted parameter and confidence bonus.",
      "Update only the state belonging to the chosen action after observing reward.",
    ],
    complexityNote: "Per-action dense state scales with the number of arms; scoring all K actions also requires evaluating K confidence terms.",
    sourceLinks: [
      {
        chapterSlug: "08-bandits-contextual-bandits-linucb",
        anchor: "15-disjoint-linucb",
        label: "15. Disjoint LinUCB",
      },
    ],
    tags: ["linucb", "contextual-bandit", "per-arm-model", "uncertainty"],
  },
  {
    id: "shared-linucb",
    parentAlgorithmId: "linucb",
    name: "Shared LinUCB",
    aliases: ["Shared linear contextual bandit", "Global LinUCB"],
    summary: "Uses one global linear model over action-context features so experience can transfer across actions.",
    distinction: "Actions are represented inside a shared feature map φ(x,a), allowing one parameter vector and one confidence geometry to generalize across the catalog.",
    assumptions: [
      "The feature representation captures the action differences and interactions that matter for reward.",
      "A shared linear parameterization is a useful approximation across actions.",
    ],
    tradeoffs: [
      "Transfers statistical strength across actions and handles large or changing catalogs more naturally than disjoint models.",
      "Misspecified shared features can blur action-specific effects and produce biased confidence geometry.",
    ],
    implementationNotes: [
      "Encode context and action jointly in a single feature vector φ(x,a).",
      "Maintain one global A and b pair.",
      "Use the shared confidence geometry when scoring every candidate action.",
    ],
    complexityNote: "Model state is independent of the number of arms, although candidate scoring still scales with how many actions are considered per decision.",
    sourceLinks: [
      {
        chapterSlug: "08-bandits-contextual-bandits-linucb",
        anchor: "16-shared-linear-model",
        label: "16. Shared Linear Model",
      },
    ],
    tags: ["linucb", "contextual-bandit", "shared-model", "feature-design"],
  },
  {
    id: "hybrid-linucb",
    parentAlgorithmId: "linucb",
    name: "Hybrid LinUCB",
    aliases: ["Hybrid contextual LinUCB"],
    summary: "Combines globally shared features with action-specific features so the policy can transfer information without erasing arm-specific effects.",
    distinction: "Expected reward is decomposed into a shared component zᵀβ and an action-specific component xᵀθ_a, coupling global and per-arm uncertainty structures.",
    assumptions: [
      "The problem admits a meaningful decomposition into shared and action-specific features.",
      "The additional covariance bookkeeping is justified by enough repeated feedback to estimate both components.",
    ],
    tradeoffs: [
      "Balances cross-action transfer with action-specific specialization.",
      "Bookkeeping and covariance updates are more complex than either purely shared or disjoint LinUCB.",
      "Poor feature decomposition can add complexity without improving decisions.",
    ],
    implementationNotes: [
      "Maintain global shared-parameter statistics together with per-action statistics.",
      "Include covariance cross-terms required by the shared/action-specific decomposition.",
      "Start from a shared or disjoint baseline and adopt the hybrid form only when the data-generating structure justifies it.",
    ],
    complexityNote: "Requires both global and per-action state plus cross-term updates; practical cost is higher than shared or disjoint baselines.",
    sourceLinks: [
      {
        chapterSlug: "08-bandits-contextual-bandits-linucb",
        anchor: "17-hybrid-linucb",
        label: "17. Hybrid LinUCB",
      },
    ],
    tags: ["linucb", "contextual-bandit", "hybrid-model", "feature-sharing"],
  },
];

const byId = new Map(algorithmVariants.map((variant) => [variant.id, variant]));

export function getAlgorithmVariant(id: string) {
  return byId.get(id) ?? null;
}

export function variantsForAlgorithm(parentAlgorithmId: string) {
  return algorithmVariants.filter((variant) => variant.parentAlgorithmId === parentAlgorithmId);
}

export function variantSearchText(variant: AlgorithmVariantRecord) {
  return [
    variant.name,
    ...variant.aliases,
    variant.summary,
    variant.distinction,
    ...variant.assumptions,
    ...variant.tradeoffs,
    ...variant.implementationNotes,
    variant.complexityNote ?? "",
    ...variant.tags,
  ]
    .join(" ")
    .toLowerCase();
}
