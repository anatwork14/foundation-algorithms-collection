import type { ImplementationRecord } from "./implementations.ts";

/** Executable bandit evidence kept modular from the historical implementation
 * registry so each learning policy retains its own mechanism and assumptions. */
export const banditImplementationAdditions: ImplementationRecord[] = [
  {
    id: "mabwiser-bandit-core",
    name: "MABWiser LinUCB + UCB1 + Thompson Sampling",
    repository: "https://github.com/fidelity/mabwiser",
    algorithmIds: ["linucb", "ucb1", "thompson-sampling"],
    language: "Python",
    interfaces: [
      "Python API",
      "LearningPolicy.LinUCB",
      "LearningPolicy.UCB1",
      "LearningPolicy.ThompsonSampling",
    ],
    license: "Apache-2.0",
    maturity: "Established open-source",
    summary: "MABWiser provides executable LinUCB, UCB1, and Thompson Sampling learning policies with separate implementations for contextual linear confidence bounds, count-based optimism, and Beta-posterior sampling.",
    implementationNotes: [
      "At the pinned revision, LinUCB maintains a separate ridge-regression model per arm and scores a context with its linear prediction plus alpha times sqrt(x A^-1 x). This is executable evidence for the disjoint/per-arm LinUCB mechanism and should not be read as the shared or hybrid LinUCB variants.",
      "The UCB1 implementation tracks total trials plus each arm's reward sum, count, and mean, then scores an observed arm as mean + alpha * sqrt(2 log(N) / n_i). Because alpha is configurable, this registry record documents the implemented count-based confidence rule rather than inheriting the canonical UCB1 regret guarantee for every parameterization.",
      "The Thompson Sampling implementation starts each arm with Beta(1,1)-style success/failure counts, updates those counts from binary rewards, samples each arm's Beta distribution at prediction time, and chooses the largest draw. Non-binary rewards require the library's explicit binarizer hook, so this path is not generalized to arbitrary reward likelihoods or contextual linear Thompson Sampling.",
      "Pinned public-policy definitions and dedicated LinUCB, UCB1, and Thompson tests corroborate the executable behavior. The archive's primary References remain the theoretical authority, and implementation presence does not establish universal superiority, calibrated uncertainty outside the documented models, or theoretical guarantees under arbitrary data and tuning choices.",
    ],
    sourcePaths: [
      { label: "Public learning-policy definitions", url: "https://github.com/fidelity/mabwiser/blob/b104071351d532aae977955d19b83872a9c1b1e3/mabwiser/mab.py" },
      { label: "LinUCB linear confidence implementation", url: "https://github.com/fidelity/mabwiser/blob/b104071351d532aae977955d19b83872a9c1b1e3/mabwiser/linear.py" },
      { label: "UCB1 implementation", url: "https://github.com/fidelity/mabwiser/blob/b104071351d532aae977955d19b83872a9c1b1e3/mabwiser/ucb.py" },
      { label: "Thompson Sampling implementation", url: "https://github.com/fidelity/mabwiser/blob/b104071351d532aae977955d19b83872a9c1b1e3/mabwiser/thompson.py" },
      { label: "LinUCB tests", url: "https://github.com/fidelity/mabwiser/blob/b104071351d532aae977955d19b83872a9c1b1e3/tests/test_linucb.py" },
      { label: "UCB1 tests", url: "https://github.com/fidelity/mabwiser/blob/b104071351d532aae977955d19b83872a9c1b1e3/tests/test_ucb.py" },
      { label: "Thompson Sampling tests", url: "https://github.com/fidelity/mabwiser/blob/b104071351d532aae977955d19b83872a9c1b1e3/tests/test_thompson.py" },
      { label: "Repository license", url: "https://github.com/fidelity/mabwiser/blob/b104071351d532aae977955d19b83872a9c1b1e3/LICENSE" },
    ],
    verifiedRef: "master",
    verifiedCommit: "b104071351d532aae977955d19b83872a9c1b1e3",
    lastVerified: "2026-10-04",
  },
];
