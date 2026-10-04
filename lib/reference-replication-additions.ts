import type { ReferenceEntity } from "./references-core.ts";

/** Independently authored evaluations that explicitly cite curated primary work. */
export const replicationReferenceAdditions: ReferenceEntity[] = [
  {
    id: "dewolf-2023-valid-prediction-intervals",
    title: "Valid prediction intervals for regression problems",
    authors: ["Nicolas Dewolf", "Bernard De Baets", "Willem Waegeman"],
    year: 2023,
    kind: "Paper",
    evidenceRole: "Replication / evaluation",
    venue: "Artificial Intelligence Review 56",
    url: "https://doi.org/10.1007/s10462-022-10178-5",
    doi: "10.1007/s10462-022-10178-5",
    algorithmIds: ["conformal-prediction"],
    combinationIds: [],
    chapterSlugs: ["14-uncertainty-causal-active-continual-meta-learning"],
    citations: [
      {
        targetId: "romano-2019-cqr",
        note: "Dewolf, De Baets, and Waegeman explicitly attribute the conformal prediction-interval nonconformity construction for quantile regression to Romano, Patterson, and Candès and independently compare interval-estimation and calibration methods on benchmark regression datasets.",
        verificationUrl: "https://arxiv.org/html/2107.00363",
        verifiedAt: "2026-10-04",
      },
    ],
    notices: [],
    summary: "Reviews Bayesian, ensemble, direct interval, and conformal prediction methods from conceptual and experimental perspectives, comparing calibration and interval width across benchmark regression datasets and illustrating conformal prediction as a general calibration procedure.",
    significance: "Provides an independently authored comparative evaluation touching Conformalized Quantile Regression directly. Its benchmark results support conformal calibration as a useful validity mechanism while also documenting substantial dataset-to-dataset performance variation, so the archive treats it as partial rather than universal support.",
    tags: ["conformal-prediction", "conformalized-quantile-regression", "prediction-interval", "calibration", "independent-evaluation", "benchmark"],
  },
];
