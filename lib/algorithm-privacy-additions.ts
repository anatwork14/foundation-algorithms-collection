import type { AlgorithmEntity } from "./algorithms.ts";

/**
 * Privacy-preserving algorithm entities that are substantial enough to deserve
 * first-class indexing but are still being expanded with source/evidence links.
 */
export const privacyAlgorithmAdditions: AlgorithmEntity[] = [
  {
    id: "differential-privacy",
    name: "Differential Privacy",
    aliases: ["epsilon-DP", "Approximate differential privacy"],
    fields: ["Cybersecurity", "AI / ML", "Foundations"],
    families: ["Privacy-preserving computation", "Randomized algorithms", "Statistical privacy"],
    chapterSlugs: ["33-mpc-homomorphic-encryption-differential-privacy"],
    summary: "Bound how much a randomized output distribution can change when one individual's record is added to or removed from a dataset.",
    motivation: "Aggregate statistics and learned models can leak information about individual contributors even when raw records are never published directly.",
    contribution: "Differential privacy turns individual-level disclosure risk into a composable algorithmic contract, then uses sensitivity, clipping, randomized mechanisms, and privacy accounting to control that risk across releases or training steps.",
    assumptions: [
      "Neighboring-dataset semantics match the intended individual/privacy unit",
      "Randomness is generated correctly and the released mechanism matches the analyzed mechanism",
      "Sensitivity or clipping bounds are valid for the computation being privatized",
      "Composition/accounting covers every privacy-relevant release",
    ],
    complexity: {
      note: "Runtime overhead depends on the mechanism. Query mechanisms may add little compute beyond sensitivity/noise generation, while iterative methods such as DP-SGD add per-example clipping, noise, and privacy-accounting costs.",
    },
    maturity: "Production-proven",
    implementation: [
      "Define the neighboring-dataset relation and privacy unit before choosing epsilon/delta",
      "Bound sensitivity directly or clip per-example contributions/gradients",
      "Calibrate the randomized mechanism to the chosen privacy definition",
      "Track cumulative privacy loss with an accountant across repeated releases or optimization steps",
      "Report privacy parameters together with utility and threat-model assumptions",
    ],
    failureModes: [
      "Using a privacy budget without specifying the neighboring-dataset model",
      "Incorrect sensitivity or clipping bounds invalidate the intended guarantee",
      "Repeated releases silently consume more privacy budget than reported",
      "Small formal epsilon does not repair non-private side channels or auxiliary releases",
      "Excess noise can make the released statistic/model unusable",
    ],
    relations: [
      {
        target: "secure-multiparty-computation",
        type: "combines-with",
        note: "MPC can hide parties' inputs during joint computation while differential privacy limits what the released aggregate can reveal about an individual; the guarantees protect different surfaces.",
      },
      {
        target: "fhe",
        type: "combines-with",
        note: "FHE can protect plaintext values during outsourced computation while differential privacy can constrain individual leakage in released outputs or learned models.",
      },
      {
        target: "linucb",
        type: "combines-with",
        note: "Adaptive decision systems can incorporate privacy mechanisms/accounting around observed contexts or rewards, but privacy changes the information and regret trade-offs and requires a dedicated analysis.",
      },
    ],
    tags: ["privacy", "differential-privacy", "randomization", "privacy-accounting", "dp-sgd"],
    openQuestions: [
      "How should long-lived adaptive agents allocate privacy budget across changing objectives and repeated interactions?",
      "Which privacy-accounting abstractions are understandable enough to prevent product teams from treating epsilon as a context-free quality score?",
      "How should differential privacy compose with cryptographic confidentiality when both the computation path and released result require protection?",
    ],
  },
];
