import type { ReferenceEntity } from "./references-core.ts";

/** Domain additions kept separate so evidence expansion does not rewrite the
 * historical core reference catalog. */
export const privacyReferenceAdditions: ReferenceEntity[] = [
  {
    id: "dwork-2006-calibrating-noise",
    title: "Calibrating Noise to Sensitivity in Private Data Analysis",
    authors: ["Cynthia Dwork", "Frank McSherry", "Kobbi Nissim", "Adam Smith"],
    year: 2006,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "TCC 2006",
    url: "https://doi.org/10.1007/11681878_14",
    doi: "10.1007/11681878_14",
    algorithmIds: ["differential-privacy"],
    combinationIds: [],
    chapterSlugs: ["33-mpc-homomorphic-encryption-differential-privacy"],
    citations: [],
    notices: [],
    summary: "Develops the neighboring-database privacy formulation for general statistical queries and calibrates randomized noise to query sensitivity, including the Laplace-mechanism foundation used throughout differential privacy.",
    significance: "A foundational primary source for differential privacy's sensitivity-based mechanism design and the connection between individual contribution bounds and calibrated randomized release.",
    tags: ["differential-privacy", "sensitivity", "laplace-mechanism", "privacy"],
  },
];
