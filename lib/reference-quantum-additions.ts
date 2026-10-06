import type { ReferenceEntity } from "./references-core.ts";

/** Quantum-algorithm references kept modular from the historical catalog. */
export const quantumReferenceAdditions: ReferenceEntity[] = [
  {
    id: "cleve-1998-quantum-algorithms-revisited",
    title: "Quantum Algorithms Revisited",
    authors: ["Richard Cleve", "Artur Ekert", "Chiara Macchiavello", "Michele Mosca"],
    year: 1998,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "Proceedings of the Royal Society A 454(1969)",
    url: "https://arxiv.org/abs/quant-ph/9708016",
    doi: "10.1098/rspa.1998.0164",
    algorithmIds: ["quantum-fourier-transform", "quantum-phase-estimation"],
    combinationIds: [],
    chapterSlugs: ["21-quantum-search-fourier-phase-estimation"],
    citations: [
      {
        targetId: "kitaev-1995-eigenvalue-measurement",
        note: "Cleve et al. explicitly relate their quantum-Fourier-transform phase-estimation construction to Kitaev's eigenvalue/phase-estimation work while presenting a QFT-based readout formulation.",
        verificationUrl: "https://arxiv.org/pdf/quant-ph/9708016",
        verifiedAt: "2026-10-06",
      },
    ],
    notices: [],
    summary: "Recasts several quantum algorithms through multiparticle interference and gives a quantum-Fourier-transform construction for estimating arbitrary eigenphases from controlled powers of a unitary.",
    significance: "Direct source for the archive's canonical QFT-based QPE relationship: coherent powers encode phase information and inverse-QFT readout converts that structure into an estimator, while Kitaev-style phase estimation remains a distinct alternative implementation family.",
    tags: ["quantum", "qft", "phase-estimation", "inverse-qft", "eigenphase", "interference"],
  },
  {
    id: "lange-2025-gnn-qec-decoder",
    title: "Data-driven decoding of quantum error correcting codes using graph neural networks",
    authors: ["Moritz Lange", "Pontus Havström", "Basudha Srivastava", "Isak Bengtsson", "Valdemar Bergentall", "Karl Hammar", "Olivia Heuts", "Evert van Nieuwenburg", "Mats Granath"],
    year: 2025,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "Physical Review Research 7, 023181",
    url: "https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.7.023181",
    doi: "10.1103/PhysRevResearch.7.023181",
    algorithmIds: ["graph-neural-networks", "surface-code-decoding"],
    combinationIds: [],
    chapterSlugs: ["24-quantum-error-correction-decoding"],
    citations: [
      {
        targetId: "dennis-2002-topological-quantum-memory",
        note: "Lange et al. situate their data-driven graph decoder in the established surface-code and topological-quantum-memory decoding lineage, including Dennis et al.",
        verificationUrl: "https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.7.023181",
        verifiedAt: "2026-10-06",
      },
    ],
    notices: [],
    summary: "Introduces a data-driven graph-neural-network decoder that maps stabilizer measurements to an annotated detector graph and predicts the most likely logical-error class.",
    significance: "Direct primary support for the archive's GNN-and-surface-code-decoding relationship: the method uses graph structure for QEC decoding and evaluates that decoder on circuit-level surface-code noise while preserving model-, code-, and dataset-specific performance scope.",
    tags: ["graph-neural-network", "quantum-error-correction", "surface-code", "decoder", "syndrome", "detector-graph"],
  },
];
