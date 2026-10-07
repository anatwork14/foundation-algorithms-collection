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
];
