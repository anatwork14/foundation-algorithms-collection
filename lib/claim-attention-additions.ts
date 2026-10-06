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
  {
    id: "switch-transformer-conditional-capacity",
    kind: "Mechanism",
    statement: "Combining sparse mixture-of-experts routing with a Transformer stack provides conditional model capacity: different tokens activate selected expert parameters instead of executing the same dense feed-forward parameters for every token.",
    algorithmIds: ["mixture-of-experts", "transformer-attention"],
    chapterSlug: "11-neural-architectures-attention-ssm-moe-gnn",
    passageContains: "Transformer variants such as Switch Transformer place sparse expert routing in feed-forward sublayers, turning added parameter capacity into conditional capacity rather than activating every expert for every token.",
    referenceIds: ["fedus-2022-switch-transformer"],
    note: "This claim is scoped to the conditional-capacity pattern exemplified by Switch Transformer. Expert count, routing policy, capacity factors, communication cost, stability, and quality gains remain architecture-, hardware-, and workload-dependent.",
  },
];
