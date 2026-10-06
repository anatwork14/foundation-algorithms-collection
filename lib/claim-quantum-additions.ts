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
];
