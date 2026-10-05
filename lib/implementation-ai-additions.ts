import type { ImplementationRecord } from "./implementations.ts";

/** AI/ML implementation records kept modular from the historical registry. */
export const aiImplementationAdditions: ImplementationRecord[] = [
  {
    id: "pyg-gcn",
    name: "PyTorch Geometric GCN",
    repository: "https://github.com/pyg-team/pytorch_geometric",
    homepage: "https://pytorch-geometric.readthedocs.io/",
    algorithmIds: ["graph-neural-networks"],
    language: "Python",
    interfaces: ["Python API", "torch_geometric.nn.GCNConv", "Dense/Sparse adjacency", "MessagePassing"],
    license: "MIT",
    maturity: "Production-proven",
    summary: "PyTorch Geometric provides a production-grade GCNConv layer implementing normalized graph convolution with self-loops, optional edge weights, sparse adjacency support, and transductive caching controls.",
    implementationNotes: [
      "The pinned GCNConv source computes the Kipf-Welling symmetric normalization D^(-1/2)(A+I)D^(-1/2), with optional weighted edges and an improved A+2I mode.",
      "The layer applies a learned linear transform before message propagation, weights neighbor messages by normalized edge coefficients, supports dense and sparse adjacency representations, and can cache normalized graph structure for transductive workloads.",
      "The pinned tests cover dense/sparse adjacency equivalence, weighted edges, caching, sparse input features, message flow, normalization error handling, and TorchScript. These are capabilities of this implementation snapshot rather than universal properties of every graph convolutional network.",
      "This executable snapshot is scoped to PyG GCNConv at the immutable master commit; Kipf-Welling remains the primary method source and the independent JMLR benchmark remains separate empirical evidence.",
    ],
    sourcePaths: [
      { label: "GCNConv implementation", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/torch_geometric/nn/conv/gcn_conv.py" },
      { label: "GCNConv tests", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/test/nn/conv/test_gcn_conv.py" },
      { label: "Repository license", url: "https://github.com/pyg-team/pytorch_geometric/blob/79d33965a40b7fa83616a9f598a0f8619f25d939/LICENSE" },
    ],
    verifiedRef: "master",
    verifiedCommit: "79d33965a40b7fa83616a9f598a0f8619f25d939",
    lastVerified: "2026-10-05",
  },
];
