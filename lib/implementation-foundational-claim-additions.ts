import type { ImplementationRecord } from "./implementations.ts";

/** Executable anchors for foundational algorithms closed at the Claim layer in 2026-10-07. */
export const foundationalClaimImplementationAdditions: ImplementationRecord[] = [
  {
    id: "gensim-word2vec",
    name: "Gensim Word2Vec",
    repository: "https://github.com/piskvorky/gensim",
    homepage: "https://radimrehurek.com/gensim/",
    algorithmIds: ["embedding-models"],
    language: "Python / Cython",
    interfaces: ["Python API", "Word2Vec", "KeyedVectors"],
    license: "LGPL-2.1",
    maturity: "Established open-source",
    summary: "Gensim provides a mature Word2Vec implementation with skip-gram and CBOW training, hierarchical softmax or negative sampling, streaming corpora, and dedicated vector-model tests.",
    implementationNotes: [
      "The pinned Word2Vec module explicitly implements the word2vec family, cites Mikolov et al., exposes skip-gram versus CBOW selection, hierarchical softmax versus negative sampling, vocabulary construction, streaming-corpus training, model persistence, and vector access through KeyedVectors.",
      "The pinned Cython inner module contains optimized Word2Vec training kernels used by the Python model, making the snapshot an executable implementation anchor rather than only a wrapper or model-loading surface.",
      "Dedicated Word2Vec tests exercise vocabulary construction and updates, training configuration, persistence, vector behavior, loss paths, deterministic seeds, and multiple training modes. These tests corroborate implementation mechanics rather than universal semantic quality on arbitrary corpora.",
      "The record is scoped to Gensim's Word2Vec family. Doc2Vec, FastText, transformer embeddings, multimodal encoders, and downstream ANN retrieval are separate mechanisms and are not inferred from this snapshot.",
    ],
    sourcePaths: [
      { label: "Word2Vec model", url: "https://github.com/piskvorky/gensim/blob/37f90ec121eb7cd401448a947e80953e0c53ccdc/gensim/models/word2vec.py" },
      { label: "Word2Vec Cython training kernels", url: "https://github.com/piskvorky/gensim/blob/37f90ec121eb7cd401448a947e80953e0c53ccdc/gensim/models/word2vec_inner.pyx" },
      { label: "Word2Vec tests", url: "https://github.com/piskvorky/gensim/blob/37f90ec121eb7cd401448a947e80953e0c53ccdc/gensim/test/test_word2vec.py" },
      { label: "Repository license", url: "https://github.com/piskvorky/gensim/blob/37f90ec121eb7cd401448a947e80953e0c53ccdc/COPYING" },
    ],
    verifiedRef: "develop",
    verifiedCommit: "37f90ec121eb7cd401448a947e80953e0c53ccdc",
    lastVerified: "2026-10-07",
  },
  {
    id: "pymc-posterior-sampling",
    name: "PyMC posterior sampling",
    repository: "https://github.com/pymc-devs/pymc",
    homepage: "https://www.pymc.io/",
    algorithmIds: ["bayesian-inference"],
    language: "Python",
    interfaces: ["Python API", "Model", "sample", "NUTS", "InferenceData"],
    license: "Apache-2.0",
    maturity: "Established open-source",
    summary: "PyMC provides executable Bayesian posterior inference through automatic step-method assignment and MCMC sampling, including its native No-U-Turn Sampler for differentiable continuous models.",
    implementationNotes: [
      "The pinned sampling module exposes sample() as a posterior-sampling entry point, supports multiple step methods, can auto-assign samplers from model-variable characteristics, and returns posterior draws through InferenceData or trace backends.",
      "The pinned NUTS implementation provides adaptive Hamiltonian Monte Carlo for continuous variables, including automatic step-size/tree-depth behavior and diagnostics such as divergences, acceptance statistics, energy, and tree depth.",
      "Pinned sampling tests exercise step-method selection, initialization strategies, multiple chains/cores, reproducibility and random-seed behavior, invalid arguments, tuning, trace outputs, and sampling execution paths.",
      "This record is scoped to posterior computation in PyMC. Model specification, priors, likelihood correctness, posterior calibration, convergence, and scientific validity remain user/model responsibilities; the implementation does not make arbitrary Bayesian models correct merely by sampling them.",
    ],
    sourcePaths: [
      { label: "Posterior sampling entry point", url: "https://github.com/pymc-devs/pymc/blob/19a783ff4564fcda6340477415b8efdd0f245871/pymc/sampling/mcmc.py" },
      { label: "Native NUTS sampler", url: "https://github.com/pymc-devs/pymc/blob/19a783ff4564fcda6340477415b8efdd0f245871/pymc/step_methods/hmc/nuts.py" },
      { label: "MCMC sampling tests", url: "https://github.com/pymc-devs/pymc/blob/19a783ff4564fcda6340477415b8efdd0f245871/tests/sampling/test_mcmc.py" },
      { label: "Repository license", url: "https://github.com/pymc-devs/pymc/blob/19a783ff4564fcda6340477415b8efdd0f245871/LICENSE" },
    ],
    verifiedRef: "main",
    verifiedCommit: "19a783ff4564fcda6340477415b8efdd0f245871",
    lastVerified: "2026-10-07",
  },
];
