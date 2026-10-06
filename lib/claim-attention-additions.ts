import type { ClaimRecord } from "./claims-base.ts";

/** Attention-systems Claims kept modular from the historical Claim catalog. */
export const attentionClaimAdditions: ClaimRecord[] = [
  {
    id: "flashattention-io-aware-exact-attention",
    kind: "Mechanism",
    statement: "FlashAttention preserves exact dense-attention semantics while reducing expensive memory traffic by tiling the computation around fast on-chip memory and using online softmax.",
    algorithmIds: ["transformer-attention"],
    chapterSlug: "11-neural-architectures-attention-ssm-moe-gnn",
    passageContains: "FlashAttention preserves exact attention semantics while reorganizing computation to reduce expensive memory traffic through tiling and online softmax techniques",
    referenceIds: ["dao-2022-flashattention"],
    note: "This claim is limited to FlashAttention's IO-aware exact-attention mechanism. Concrete speedups, supported dimensions, memory savings, and hardware/backend behavior remain implementation- and workload-dependent.",
  },
  {
    id: "graphormer-structural-encoding-attention",
    kind: "Mechanism",
    statement: "Graph Transformers can generalize attention to graph-structured inputs by injecting structural encodings; Graphormer is a primary example that makes graph structure explicit in node features and attention computation.",
    algorithmIds: ["graph-neural-networks", "transformer-attention"],
    chapterSlug: "11-neural-architectures-attention-ssm-moe-gnn",
    passageContains: "Graph Transformers generalize attention to graph-structured inputs using structural encodings such as:",
    referenceIds: ["ying-2021-graphormer"],
    note: "This claim uses Graphormer as a primary graph-Transformer instance of the chapter's structural-encoding mechanism. It does not imply that every graph Transformer uses the same encodings or that structural attention universally outperforms message-passing GNNs.",
  },
];
