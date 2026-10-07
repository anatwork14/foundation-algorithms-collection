import type { ClaimRecord } from "./claims-base.ts";

/** Quantum-algorithm Claims kept modular from the historical catalog. */
export const quantumClaimAdditions: ClaimRecord[] = [
  {
    id: "qft-based-phase-estimation-readout",
    kind: "Mechanism",
    statement: "Canonical QFT-based phase estimation converts coherently accumulated eigenphase information into measurable binary phase estimates by applying an inverse quantum Fourier transform to the phase register.",
    algorithmIds: ["quantum-fourier-transform", "quantum-phase-estimation"],
    chapterSlug: "21-quantum-search-fourier-phase-estimation",
    passageContains: "The inverse Fourier transform is central to converting accumulated quantum phases into measurable binary information.",
    referenceIds: ["cleve-1998-quantum-algorithms-revisited"],
    note: "This claim is scoped to the canonical inverse-QFT readout formulation. Iterative, Kitaev-style, Bayesian, and other phase-estimation variants can recover phase information without executing the same full inverse-QFT circuit.",
  },
  {
    id: "gnn-surface-code-detector-graph-decoding",
    kind: "Mechanism",
    statement: "Graph-neural-network quantum decoders can represent stabilizer measurement outcomes as a detector graph and learn to predict logical-error classes from that graph-structured syndrome information.",
    algorithmIds: ["graph-neural-networks", "surface-code-decoding"],
    chapterSlug: "24-quantum-error-correction-decoding",
    passageContains: "Graph neural network decoders can encode stabilizer measurements as detector graphs and predict logical-error classes from the resulting structured syndrome data.",
    referenceIds: ["lange-2025-gnn-qec-decoder"],
    note: "This claim is scoped to detector-graph GNN decoding. Logical-error rates, training cost, inference latency, code generalization, and robustness to real hardware drift remain code-, noise-, dataset-, and implementation-dependent.",
  },
  {
    id: "amplitude-estimation-amplification-phase-composition",
    kind: "Mechanism",
    statement: "Canonical quantum amplitude estimation estimates a success probability by applying phase estimation to an amplitude-amplification operator whose eigenphase encodes the target amplitude.",
    algorithmIds: ["amplitude-estimation"],
    chapterSlug: "21-quantum-search-fourier-phase-estimation",
    passageContains: "Canonical amplitude estimation combines amplitude amplification operators with phase estimation.",
    referenceIds: ["brassard-2002-amplitude-amplification-estimation"],
    note: "This Claim is scoped to canonical phase-estimation-based QAE. Iterative, maximum-likelihood, and other modern amplitude-estimation variants can avoid the same full QPE/inverse-QFT circuit and have different depth, shot, and noise tradeoffs.",
  },
  {
    id: "bayesian-optimization-variational-quantum-outer-loop",
    kind: "Mechanism",
    statement: "Bayesian optimization can act as the classical outer-loop optimizer for variational quantum algorithms such as VQE and QAOA, using a surrogate and acquisition rule to choose expensive noisy circuit evaluations.",
    algorithmIds: ["bayesian-optimization", "vqe", "qaoa"],
    chapterSlug: "23-quantum-optimization-vqe-qaoa",
    passageContains: "For expensive noisy variational objectives, Bayesian optimization can serve as the classical outer-loop optimizer for VQE or QAOA.",
    referenceIds: ["tibaldi-2023-bo-qaoa", "iannelli-2022-noisy-bo-vqe"],
    note: "This Claim records a valid optimizer architecture, not a universal performance ranking. BO effectiveness depends on parameter dimension, shot/device noise, surrogate assumptions, acquisition optimization, evaluation budget, and the specific variational landscape.",
  },
];
