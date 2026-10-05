import type { ReferenceEntity } from "./references-core.ts";

/** Primary attention-systems references kept modular from the historical catalog. */
export const attentionReferenceAdditions: ReferenceEntity[] = [
  {
    id: "dao-2022-flashattention",
    title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
    authors: ["Tri Dao", "Daniel Y. Fu", "Stefano Ermon", "Atri Rudra", "Christopher Ré"],
    year: 2022,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "NeurIPS 2022",
    url: "https://papers.nips.cc/paper_files/paper/2022/hash/67d57c32e20fd0a7a302cb81d36e40d5-Abstract-Conference.html",
    doi: "10.52202/068431-1189",
    algorithmIds: ["transformer-attention"],
    combinationIds: [],
    chapterSlugs: ["11-neural-architectures-attention-ssm-moe-gnn"],
    citations: [
      {
        targetId: "vaswani-2017-attention",
        note: "FlashAttention preserves exact scaled-dot-product attention semantics while reorganizing computation around GPU memory hierarchy and tiling rather than replacing the Transformer attention operator with an approximation.",
        verificationUrl: "https://papers.nips.cc/paper_files/paper/2022/file/67d57c32e20fd0a7a302cb81d36e40d5-Paper-Conference.pdf",
        verifiedAt: "2026-10-05",
      },
    ],
    notices: [],
    summary: "Introduces an IO-aware exact attention algorithm that tiles attention computation to reduce reads and writes between GPU high-bandwidth memory and on-chip SRAM.",
    significance: "Primary source for the systems insight that preserving exact attention semantics can still yield major runtime and memory improvements by optimizing data movement rather than only arithmetic complexity.",
    tags: ["flashattention", "attention", "transformer", "io-awareness", "tiling", "gpu-memory", "exact-attention"],
  },
  {
    id: "dao-2024-flashattention-2",
    title: "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning",
    authors: ["Tri Dao"],
    year: 2024,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "ICLR 2024",
    url: "https://openreview.net/forum?id=mZn2Xyh9Ec",
    algorithmIds: ["transformer-attention"],
    combinationIds: [],
    chapterSlugs: ["11-neural-architectures-attention-ssm-moe-gnn"],
    citations: [
      {
        targetId: "dao-2022-flashattention",
        note: "FlashAttention-2 explicitly extends FlashAttention with improved work partitioning across thread blocks and warps while retaining exact attention semantics.",
        verificationUrl: "https://openreview.net/forum?id=mZn2Xyh9Ec",
        verifiedAt: "2026-10-05",
      },
    ],
    notices: [],
    summary: "Extends FlashAttention by reducing non-matmul work and improving thread-block and warp-level work partitioning to raise GPU occupancy and reduce shared-memory communication.",
    significance: "Primary extension for the FlashAttention-2 implementation family represented by the archive's executable snapshot; it refines parallel execution rather than changing the underlying exact-attention objective.",
    tags: ["flashattention-2", "attention", "transformer", "gpu", "parallelism", "work-partitioning", "exact-attention"],
  },
];