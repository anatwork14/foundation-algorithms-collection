export type ReferenceKind = "Paper" | "Standard" | "Book";
export type ReferenceEvidenceRole =
  | "Primary method"
  | "Primary extension"
  | "Normative standard"
  | "Survey / synthesis"
  | "Replication / evaluation";

export type ReferenceNoticeKind =
  | "Version"
  | "Errata"
  | "Correction"
  | "Superseded"
  | "Withdrawn"
  | "Retraction";

export type ReferenceNotice = {
  kind: ReferenceNoticeKind;
  note: string;
  url: string;
  verifiedAt: string;
};

export type ReferenceCitation = {
  targetId: string;
  note: string;
  verificationUrl: string;
  verifiedAt: string;
};

export type ReferenceEntity = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  kind: ReferenceKind;
  evidenceRole: ReferenceEvidenceRole;
  venue?: string;
  url: string;
  doi?: string;
  algorithmIds: string[];
  combinationIds: string[];
  chapterSlugs: string[];
  citations: ReferenceCitation[];
  notices: ReferenceNotice[];
  summary: string;
  significance: string;
  tags: string[];
};

export const references: ReferenceEntity[] = [
  {
    id: "li-2010-contextual-bandit-news",
    title: "A Contextual-Bandit Approach to Personalized News Article Recommendation",
    authors: ["Lihong Li", "Wei Chu", "John Langford", "Robert E. Schapire"],
    year: 2010,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "WWW 2010",
    url: "https://arxiv.org/abs/1003.0146",
    doi: "10.1145/1772690.1772758",
    algorithmIds: ["linucb"],
    combinationIds: ["linucb-adaptive-fuzzing", "retrieval-bandit-routing"],
    chapterSlugs: ["08-bandits-contextual-bandits-linucb"],
    citations: [],
    notices: [],
    summary: "Introduces the contextual-bandit formulation and LinUCB-style algorithm for personalized news recommendation, together with offline replay evaluation on logged randomized traffic.",
    significance: "Primary source for LinUCB in the collection and an important bridge between contextual-bandit theory and large-scale online recommendation.",
    tags: ["contextual-bandit", "linucb", "offline-evaluation"],
  },
  {
    id: "vaswani-2017-attention",
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Lukasz Kaiser", "Illia Polosukhin"],
    year: 2017,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "NeurIPS 2017",
    url: "https://arxiv.org/abs/1706.03762",
    algorithmIds: ["transformer-attention", "embedding-models"],
    combinationIds: ["verifiable-agent-planning", "private-verifiable-ai"],
    chapterSlugs: ["11-neural-architectures-attention-ssm-moe-gnn", "13-ai-reasoning-alignment-agents"],
    citations: [],
    notices: [],
    summary: "Introduces the Transformer architecture based on attention mechanisms without recurrent or convolutional sequence layers.",
    significance: "Foundational source for modern Transformer attention and many representation, generative, retrieval, and agent systems built on top of it.",
    tags: ["transformer", "attention", "sequence-modeling"],
  },
  {
    id: "malkov-2018-hnsw",
    title: "Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs",
    authors: ["Yu A. Malkov", "D. A. Yashunin"],
    year: 2018,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "IEEE TPAMI",
    url: "https://doi.org/10.1109/TPAMI.2018.2889473",
    doi: "10.1109/TPAMI.2018.2889473",
    algorithmIds: ["hnsw", "embedding-models"],
    combinationIds: ["retrieval-bandit-routing"],
    chapterSlugs: ["06-representation-similarity-compression-parsing", "09-combination-research-map"],
    citations: [],
    notices: [],
    summary: "Presents the hierarchical navigable small-world graph index for approximate nearest-neighbor search with controllable hierarchy and high-recall practical performance.",
    significance: "Primary source for one of the most widely used graph-based ANN indexing mechanisms in modern vector retrieval systems.",
    tags: ["ann", "hnsw", "vector-search"],
  },
  {
    id: "aumuller-2020-ann-benchmarks",
    title: "ANN-Benchmarks: A Benchmarking Tool for Approximate Nearest Neighbor Algorithms",
    authors: ["Martin Aumüller", "Erik Bernhardsson", "Alexander Faithfull"],
    year: 2020,
    kind: "Paper",
    evidenceRole: "Replication / evaluation",
    venue: "Information Systems 87",
    url: "https://doi.org/10.1016/j.is.2019.02.006",
    doi: "10.1016/j.is.2019.02.006",
    algorithmIds: ["hnsw"],
    combinationIds: [],
    chapterSlugs: ["06-representation-similarity-compression-parsing"],
    citations: [
      {
        targetId: "malkov-2018-hnsw",
        note: "ANN-Benchmarks independently evaluates HNSW among multiple approximate-nearest-neighbor methods and reports graph-based methods such as HNSW among the strongest approaches at very high recall, while also documenting cases where they can be tripped up.",
        verificationUrl: "https://doi.org/10.1016/j.is.2019.02.006",
        verifiedAt: "2026-09-30",
      },
    ],
    notices: [],
    summary: "Introduces a reproducible benchmarking framework for in-memory approximate nearest-neighbor algorithms and evaluates multiple implementations and datasets, including HNSW.",
    significance: "Provides an independently authored evaluation of HNSW within a common benchmark framework, useful for checking whether the method's strong high-recall practical behavior generalizes beyond its original paper and implementation context.",
    tags: ["ann", "benchmark", "hnsw", "independent-evaluation", "reproducibility"],
  },
  {
    id: "loshchilov-2019-adamw",
    title: "Decoupled Weight Decay Regularization",
    authors: ["Ilya Loshchilov", "Frank Hutter"],
    year: 2019,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "ICLR 2019",
    url: "https://arxiv.org/abs/1711.05101",
    algorithmIds: ["adamw"],
    combinationIds: [],
    chapterSlugs: ["10-ai-optimization-learning-theory"],
    citations: [],
    notices: [],
    summary: "Shows that L2 regularization and weight decay are not equivalent for adaptive optimizers such as Adam and proposes decoupling weight decay from the gradient update.",
    significance: "Primary source for AdamW, now a standard optimizer choice across Transformer and large-model training pipelines.",
    tags: ["optimization", "adamw", "regularization"],
  },
  {
    id: "zhou-2020-neuralucb",
    title: "Neural Contextual Bandits with UCB-based Exploration",
    authors: ["Dongruo Zhou", "Lihong Li", "Quanquan Gu"],
    year: 2020,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "ICML 2020",
    url: "https://arxiv.org/abs/1911.04462",
    algorithmIds: ["neural-ucb", "linucb", "ucb1"],
    combinationIds: [],
    chapterSlugs: ["08-bandits-contextual-bandits-linucb", "14-uncertainty-causal-active-continual-meta-learning"],
    citations: [
      {
        targetId: "li-2010-contextual-bandit-news",
        note: "The NeuralUCB introduction explicitly cites Li et al. (2010) while discussing the theoretical and practical success of linear contextual bandits.",
        verificationUrl: "https://proceedings.mlr.press/v119/zhou20a/zhou20a.pdf",
        verifiedAt: "2026-09-28",
      },
    ],
    notices: [],
    summary: "Introduces NeuralUCB, using a neural network representation and confidence construction for UCB-style exploration in nonlinear contextual bandits.",
    significance: "Important research bridge from linear contextual bandits toward nonlinear learned representations while retaining an explicit exploration mechanism.",
    tags: ["neuralucb", "contextual-bandit", "uncertainty"],
  },
  {
    id: "kitaev-1995-eigenvalue-measurement",
    title: "Quantum measurements and the Abelian Stabilizer Problem",
    authors: ["A. Yu. Kitaev"],
    year: 1995,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "arXiv:quant-ph/9511026",
    url: "https://arxiv.org/abs/quant-ph/9511026",
    algorithmIds: ["quantum-phase-estimation"],
    combinationIds: [],
    chapterSlugs: ["21-quantum-search-fourier-phase-estimation"],
    citations: [],
    notices: [],
    summary: "Introduces a procedure for measuring an eigenvalue of a unitary operator and applies it within quantum algorithms for Abelian stabilizer problems, including factoring and discrete logarithms.",
    significance: "Primary historical source for the eigenvalue/eigenphase-measurement idea underlying quantum phase-estimation methods.",
    tags: ["quantum", "phase-estimation", "eigenvalue"],
  },
  {
    id: "gilyen-2018-qsvt",
    title: "Quantum Singular Value Transformation and Beyond: Exponential Improvements for Quantum Matrix Arithmetics",
    authors: ["András Gilyén", "Yuan Su", "Guang Hao Low", "Nathan Wiebe"],
    year: 2018,
    kind: "Paper",
    evidenceRole: "Primary method",
    url: "https://arxiv.org/abs/1806.01838",
    algorithmIds: ["qsvt", "quantum-phase-estimation"],
    combinationIds: [],
    chapterSlugs: ["22-quantum-simulation-qsp-qsvt-linear-algebra"],
    citations: [],
    notices: [],
    summary: "Develops singular-value transformation of block-encoded operators and shows how the framework unifies and improves a wide range of quantum matrix algorithms.",
    significance: "Core source for QSVT as a reusable polynomial-transformation framework rather than a single isolated quantum algorithm.",
    tags: ["qsvt", "quantum-linear-algebra", "block-encoding"],
  },
  {
    id: "romano-2019-cqr",
    title: "Conformalized Quantile Regression",
    authors: ["Yaniv Romano", "Evan Patterson", "Emmanuel J. Candès"],
    year: 2019,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "NeurIPS 2019",
    url: "https://arxiv.org/abs/1905.03222",
    algorithmIds: ["conformal-prediction"],
    combinationIds: ["private-adaptive-learning"],
    chapterSlugs: ["14-uncertainty-causal-active-continual-meta-learning"],
    citations: [],
    notices: [],
    summary: "Combines conformal calibration with quantile regression to produce adaptive prediction intervals with finite-sample marginal coverage under the standard conformal assumptions.",
    significance: "A practical modern conformal method that makes uncertainty intervals adaptive to heteroscedasticity while preserving finite-sample coverage guarantees.",
    tags: ["conformal", "uncertainty", "calibration"],
  },
  {
    id: "gu-2023-mamba",
    title: "Mamba: Linear-Time Sequence Modeling with Selective State Spaces",
    authors: ["Albert Gu", "Tri Dao"],
    year: 2023,
    kind: "Paper",
    evidenceRole: "Primary method",
    url: "https://arxiv.org/abs/2312.00752",
    algorithmIds: ["state-space-models"],
    combinationIds: ["learned-quantum-decoder"],
    chapterSlugs: ["11-neural-architectures-attention-ssm-moe-gnn"],
    citations: [
      {
        targetId: "vaswani-2017-attention",
        note: "The Mamba introduction explicitly identifies the Transformer (Vaswani et al., 2017) as the predominant modern foundation-model sequence architecture.",
        verificationUrl: "https://arxiv.org/html/2312.00752",
        verifiedAt: "2026-09-28",
      },
    ],
    notices: [],
    summary: "Introduces input-dependent selective state-space updates and a hardware-aware parallel recurrent algorithm for linear-scaling sequence modeling.",
    significance: "A major modern reference for selective state-space models as an alternative/complement to dense attention on long sequences.",
    tags: ["ssm", "mamba", "sequence-modeling"],
  },
  {
    id: "nist-2024-fips203",
    title: "FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard",
    authors: ["National Institute of Standards and Technology"],
    year: 2024,
    kind: "Standard",
    evidenceRole: "Normative standard",
    venue: "NIST FIPS 203",
    url: "https://csrc.nist.gov/pubs/fips/203/final",
    doi: "10.6028/NIST.FIPS.203",
    algorithmIds: ["ml-kem", "lattice-problems"],
    combinationIds: [],
    chapterSlugs: ["31-post-quantum-cryptography"],
    citations: [],
    notices: [
      {
        kind: "Version",
        note: "NIST's document history identifies the 2024-08-13 publication as the final FIPS 203 release, following the 2023 initial public draft.",
        url: "https://csrc.nist.gov/pubs/fips/203/final",
        verifiedAt: "2026-10-01",
      },
      {
        kind: "Errata",
        note: "NIST's planning note dated 2025-11-17 says an issue has been identified and will be corrected in a future update/revision; implementers should review the potential-updates spreadsheet.",
        url: "https://csrc.nist.gov/files/pubs/fips/203/final/docs/fips-203-potential-updates.xlsx",
        verifiedAt: "2026-10-01",
      },
    ],
    summary: "The final NIST standard specifying ML-KEM key generation, encapsulation, decapsulation, and the ML-KEM-512/768/1024 parameter sets.",
    significance: "Normative implementation source for standardized ML-KEM and a critical reference for post-quantum migration work.",
    tags: ["ml-kem", "pqc", "standard"],
  },
];

const byId = new Map(references.map((reference) => [reference.id, reference]));

export function getReference(id: string) {
  return byId.get(id) ?? null;
}

export function referencesForAlgorithm(algorithmId: string) {
  return references.filter((reference) => reference.algorithmIds.includes(algorithmId));
}

export function referencesForCombination(combinationId: string) {
  return references.filter((reference) => reference.combinationIds.includes(combinationId));
}

export function referencesForChapter(chapterSlug: string) {
  return references.filter((reference) => reference.chapterSlugs.includes(chapterSlug));
}

export function citedReferenceIds(reference: ReferenceEntity) {
  return reference.citations.map((citation) => citation.targetId);
}

export function getCitedReferences(reference: ReferenceEntity) {
  return reference.citations
    .map((citation) => byId.get(citation.targetId))
    .filter((item): item is ReferenceEntity => Boolean(item));
}

export function getCitingReferences(referenceId: string) {
  return references.filter((reference) => reference.citations.some((citation) => citation.targetId === referenceId));
}

export function getCitation(reference: ReferenceEntity, targetId: string) {
  return reference.citations.find((citation) => citation.targetId === targetId) ?? null;
}

export function formatReferenceAuthors(reference: ReferenceEntity, maxAuthors = 4) {
  if (reference.authors.length <= maxAuthors) return reference.authors.join(", ");
  return `${reference.authors.slice(0, maxAuthors).join(", ")} et al.`;
}

export function referenceSearchText(reference: ReferenceEntity) {
  return [
    reference.title,
    ...reference.authors,
    reference.year.toString(),
    reference.kind,
    reference.evidenceRole,
    reference.venue ?? "",
    reference.doi ?? "",
    reference.summary,
    reference.significance,
    ...reference.notices.flatMap((notice) => [notice.kind, notice.note]),
    ...reference.tags,
  ].join(" ").toLowerCase();
}
