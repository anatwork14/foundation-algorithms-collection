import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification history for foundational Claim implementation anchors. */
export const foundationalClaimImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "gensim-word2vec",
    revision: 1,
    verifiedAt: "2026-10-07",
    verifiedRef: "develop",
    verifiedCommit: "37f90ec121eb7cd401448a947e80953e0c53ccdc",
    sourcePaths: [
      { label: "Word2Vec model", url: "https://github.com/piskvorky/gensim/blob/37f90ec121eb7cd401448a947e80953e0c53ccdc/gensim/models/word2vec.py" },
      { label: "Word2Vec Cython training kernels", url: "https://github.com/piskvorky/gensim/blob/37f90ec121eb7cd401448a947e80953e0c53ccdc/gensim/models/word2vec_inner.pyx" },
      { label: "Word2Vec tests", url: "https://github.com/piskvorky/gensim/blob/37f90ec121eb7cd401448a947e80953e0c53ccdc/gensim/test/test_word2vec.py" },
      { label: "Repository license", url: "https://github.com/piskvorky/gensim/blob/37f90ec121eb7cd401448a947e80953e0c53ccdc/COPYING" },
    ],
    note: "Initial Gensim Word2Vec evidence snapshot. Direct inspection of the pinned Python model and optimized Cython inner routines confirms skip-gram/CBOW training, hierarchical-softmax or negative-sampling configuration, streaming-corpus support, and trained-vector access. Dedicated Word2Vec tests cover vocabulary, training, persistence, seed/configuration, vector behavior, and loss paths. The snapshot is scoped to Word2Vec rather than every embedding family in Gensim or the archive.",
  },
  {
    implementationId: "pymc-posterior-sampling",
    revision: 1,
    verifiedAt: "2026-10-07",
    verifiedRef: "main",
    verifiedCommit: "19a783ff4564fcda6340477415b8efdd0f245871",
    sourcePaths: [
      { label: "Posterior sampling entry point", url: "https://github.com/pymc-devs/pymc/blob/19a783ff4564fcda6340477415b8efdd0f245871/pymc/sampling/mcmc.py" },
      { label: "Native NUTS sampler", url: "https://github.com/pymc-devs/pymc/blob/19a783ff4564fcda6340477415b8efdd0f245871/pymc/step_methods/hmc/nuts.py" },
      { label: "MCMC sampling tests", url: "https://github.com/pymc-devs/pymc/blob/19a783ff4564fcda6340477415b8efdd0f245871/tests/sampling/test_mcmc.py" },
      { label: "Repository license", url: "https://github.com/pymc-devs/pymc/blob/19a783ff4564fcda6340477415b8efdd0f245871/LICENSE" },
    ],
    note: "Initial PyMC posterior-inference evidence snapshot. The pinned sampling entry point draws posterior samples, auto-assigns step methods where appropriate, and supports multiple chains/backends; the pinned native NUTS implementation exposes adaptive Hamiltonian Monte Carlo behavior and diagnostics. Dedicated MCMC tests exercise initialization, step assignment, execution, reproducibility, parallel chains, tuning, and invalid-argument paths. The snapshot corroborates executable posterior computation without treating arbitrary model specification or convergence as automatically valid.",
  },
];
