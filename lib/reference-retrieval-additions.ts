import type { ReferenceEntity } from "./references-core.ts";

/** Retrieval-system references kept modular from the historical catalog. */
export const retrievalReferenceAdditions: ReferenceEntity[] = [
  {
    id: "ma-2023-anserini-hnsw",
    title: "Anserini Gets Dense Retrieval: Integration of Lucene's HNSW Indexes",
    authors: ["Xueguang Ma", "Tommaso Teofili", "Jimmy Lin"],
    year: 2023,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "CIKM 2023",
    url: "https://doi.org/10.1145/3583780.3615112",
    doi: "10.1145/3583780.3615112",
    algorithmIds: ["hnsw", "transformer-attention", "embedding-models"],
    combinationIds: [],
    chapterSlugs: [
      "06-representation-similarity-compression-parsing",
      "11-neural-architectures-attention-ssm-moe-gnn",
    ],
    citations: [
      {
        targetId: "malkov-2018-hnsw",
        note: "Ma, Teofili, and Lin build and evaluate dense-retrieval indexes using HNSW and explicitly trace the index design to Malkov and Yashunin.",
        verificationUrl: "https://arxiv.org/pdf/2304.12139",
        verifiedAt: "2026-10-07",
      },
      {
        targetId: "vaswani-2017-attention",
        note: "The paper states that modern dense retrievers typically use pretrained Transformers to encode queries and documents into dense vectors before nearest-neighbor search.",
        verificationUrl: "https://arxiv.org/pdf/2304.12139",
        verifiedAt: "2026-10-07",
      },
    ],
    notices: [],
    summary: "Integrates Lucene HNSW indexing into Anserini for dense retrieval and evaluates HNSW search over learned dense text representations on MS MARCO and BEIR.",
    significance: "Direct systems evidence for the archive's Transformer/HNSW combination: pretrained Transformer encoders produce dense retrieval vectors and HNSW provides approximate-nearest-neighbor indexing/search over those representations.",
    tags: ["dense-retrieval", "transformer", "hnsw", "approximate-nearest-neighbor", "lucene", "anserini"],
  },
];
