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
    venue: "Theory of Cryptography Conference (TCC 2006)",
    url: "https://doi.org/10.1007/11681878_14",
    doi: "10.1007/11681878_14",
    algorithmIds: ["differential-privacy"],
    combinationIds: ["federated-secure-private-learning"],
    chapterSlugs: ["33-mpc-homomorphic-encryption-differential-privacy", "40-ai-quantum-cybersecurity-combination-map"],
    citations: [],
    notices: [],
    summary: "Introduces sensitivity-calibrated noise mechanisms and foundational formal privacy guarantees that became central to differential privacy.",
    significance: "Primary early source for the archive's differential-privacy mechanism and its sensitivity/noise foundation.",
    tags: ["differential-privacy", "laplace-mechanism", "sensitivity", "privacy"],
  },
  {
    id: "abadi-2016-deep-learning-dp",
    title: "Deep Learning with Differential Privacy",
    authors: ["Martin Abadi", "Andy Chu", "Ian Goodfellow", "H. Brendan McMahan", "Ilya Mironov", "Kunal Talwar", "Li Zhang"],
    year: 2016,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "ACM CCS 2016",
    url: "https://doi.org/10.1145/2976749.2978318",
    doi: "10.1145/2976749.2978318",
    algorithmIds: ["differential-privacy", "gradient-descent"],
    combinationIds: ["federated-secure-private-learning"],
    chapterSlugs: ["33-mpc-homomorphic-encryption-differential-privacy", "40-ai-quantum-cybersecurity-combination-map"],
    citations: [
      {
        targetId: "dwork-2006-calibrating-noise",
        note: "The DP-SGD paper builds on differential privacy's established sensitivity/noise framework while adapting privacy accounting and clipped noisy gradients to deep learning.",
        verificationUrl: "https://doi.org/10.1145/2976749.2978318",
        verifiedAt: "2026-10-01",
      },
    ],
    notices: [],
    summary: "Develops differentially private stochastic-gradient training using per-example gradient clipping, Gaussian noise, and a moments accountant for privacy loss.",
    significance: "Grounds the archive's DP-SGD bridge between differential privacy and gradient-based machine learning.",
    tags: ["dp-sgd", "differential-privacy", "gradient-descent", "privacy-accounting"],
  },
];
