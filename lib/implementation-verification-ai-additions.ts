import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification entries for AI/ML implementations added after the
 * historical implementation registry was established. */
export const aiImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "pyg-graphsage",
    revision: 1,
    verifiedAt: "2026-10-05",
    verifiedRef: "master",
    verifiedCommit: "79d33965a40b7fa83616a9f598a0f8619f25d939",
    sourcePaths: [
      { label: "SAGEConv implementation", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/torch_geometric/nn/conv/sage_conv.py" },
      { label: "SAGEConv tests", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/test/nn/conv/test_sage_conv.py" },
      { label: "Repository license", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/LICENSE" },
    ],
    note: "Initial PyTorch Geometric GraphSAGE evidence snapshot. Direct inspection confirms SAGEConv neighborhood aggregation with mean as the default aggregator, optional pre-aggregation projection, transformed root-node contribution, optional output normalization, and sparse-adjacency message-and-aggregate support. The pinned tests cover mean/sum aggregation, dense and sparse adjacency, bipartite message passing, projection, lazy inputs, LSTM/MLP/multi-aggregation variants, JIT behavior, and torch.compile. The MIT license is preserved at the same immutable master-branch revision.",
  },
  {
    implementationId: "pyg-gcn",
    revision: 1,
    verifiedAt: "2026-10-05",
    verifiedRef: "master",
    verifiedCommit: "79d33965a40b7fa83616a9f598a0f8619f25d939",
    sourcePaths: [
      { label: "GCNConv implementation", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/torch_geometric/nn/conv/gcn_conv.py" },
      { label: "GCNConv tests", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/test/nn/conv/test_gcn_conv.py" },
      { label: "Repository license", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/LICENSE" },
    ],
    note: "Initial PyTorch Geometric GCN evidence snapshot. Direct inspection confirms GCNConv symmetric degree normalization with self-loops, optional weighted edges, learned linear feature transformation, normalized message propagation, dense/sparse adjacency handling, and optional transductive caching. The pinned tests cover dense and sparse equivalence, edge weights, caching, sparse input features, flow direction, normalization constraints, gradient behavior for sparse layouts, and TorchScript. The MIT license is preserved at the same immutable master-branch revision.",
  },
  {
    implementationId: "pyg-gat",
    revision: 1,
    verifiedAt: "2026-10-05",
    verifiedRef: "master",
    verifiedCommit: "79d33965a40b7fa83616a9f598a0f8619f25d939",
    sourcePaths: [
      { label: "GATConv implementation", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/torch_geometric/nn/conv/gat_conv.py" },
      { label: "GATConv tests", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/test/nn/conv/test_gat_conv.py" },
      { label: "Repository license", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/LICENSE" },
    ],
    note: "Initial PyTorch Geometric GAT evidence snapshot. Direct inspection confirms learned source/destination neighborhood-attention coefficients, multi-head concatenation or averaging, self-loop insertion, attention dropout, residual projection, bipartite inputs, edge-feature-aware attention, and returned attention weights. The pinned tests cover dense/sparse adjacency, attention-weight outputs, bipartite propagation, residuals, TorchScript, edge features, and empty graphs; they also explicitly preserve the SparseTensor edge-attribute/self-loop NotImplementedError limitation. The MIT license is preserved at the same immutable master-branch revision.",
  },
];