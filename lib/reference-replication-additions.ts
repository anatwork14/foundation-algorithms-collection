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
  {
    id: "dwivedi-2023-gnn-benchmark",
    title: "Benchmarking Graph Neural Networks",
    authors: ["Vijay Prakash Dwivedi", "Chaitanya K. Joshi", "Anh Tuan Luu", "Thomas Laurent", "Yoshua Bengio", "Xavier Bresson"],
    year: 2023,
    kind: "Paper",
    evidenceRole: "Replication / evaluation",
    venue: "Journal of Machine Learning Research 24(43)",
    url: "https://www.jmlr.org/papers/v24/22-0567.html",
    algorithmIds: ["graph-neural-networks"],
    combinationIds: [],
    chapterSlugs: ["11-neural-architectures-attention-ssm-moe-gnn"],
    citations: [
      {
        targetId: "kipf-welling-2017-gcn",
        note: "Dwivedi et al. include GCN in a controlled multi-architecture benchmark with common parameter-budget and training-protocol constraints across graph datasets.",
        verificationUrl: "https://www.jmlr.org/papers/volume24/22-0567/22-0567.pdf",
        verifiedAt: "2026-10-05",
      },
      {
        targetId: "hamilton-2017-graphsage",
        note: "Dwivedi et al. include GraphSAGE in the same controlled benchmark and report task-dependent results alongside GCN and other graph architectures rather than asserting one universal winner.",
        verificationUrl: "https://www.jmlr.org/papers/volume24/22-0567/22-0567.pdf",
        verifiedAt: "2026-10-05",
      },
    ],
    notices: [],
    summary: "Presents a reproducible graph-learning benchmark designed for fair comparison under common parameter budgets and evaluates multiple GNN architectures, including GCN and GraphSAGE, across mathematical and real-world graph tasks.",
    significance: "Provides an independently authored evaluation of two curated GNN mechanisms under a shared experimental framework. Results vary by dataset and task, so the archive records partial support for practical usefulness rather than a universal ranking or reproduction of every claim in the original papers.",
    tags: ["graph-neural-network", "gcn", "graphsage", "benchmark", "independent-evaluation", "reproducibility"],
  },
];