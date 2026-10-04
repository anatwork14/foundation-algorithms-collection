import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification snapshots for bandit implementations. */
export const banditImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "mabwiser-bandit-core",
    revision: 1,
    verifiedAt: "2026-10-04",
    verifiedRef: "master",
    verifiedCommit: "b104071351d532aae977955d19b83872a9c1b1e3",
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
    note: "Initial MABWiser bandit-core evidence snapshot. The inspected linear policy keeps one ridge-regression model per arm and computes LinUCB as a linear prediction plus an alpha-scaled sqrt(x A^-1 x) uncertainty term. The UCB1 path tracks total and per-arm counts and applies mean + alpha * sqrt(2 log(N) / n_i). The Thompson path updates Beta success/failure counts from binary rewards, samples each posterior, and selects the largest draw, with an explicit binarizer for non-binary rewards. This snapshot preserves the disjoint LinUCB, configurable-UCB-width, and Beta-Bernoulli Thompson scopes and does not infer shared/hybrid LinUCB behavior, arbitrary-likelihood Thompson Sampling, universal performance superiority, or theoretical guarantees for every tuning choice. LICENSE records Apache-2.0 terms.",
  },
];
