import { attentionImplementationVerificationAdditions } from "./implementation-verification-attention-additions.ts";
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
  {
    implementationId: "microsoft-graphormer",
    revision: 1,
    verifiedAt: "2026-10-05",
    verifiedRef: "main",
    verifiedCommit: "59c0decffcade9df81d29dcc178a489b31958bab",
    sourcePaths: [
      { label: "Graph structural encodings", url: "https://github.com/microsoft/Graphormer/blob/59c0decffcade9df81d29dcc178a489b31958bab/graphormer/modules/graphormer_layers.py" },
      { label: "Graphormer encoder", url: "https://github.com/microsoft/Graphormer/blob/59c0decffcade9df81d29dcc178a489b31958bab/graphormer/modules/graphormer_graph_encoder.py" },
      { label: "Pretrained-model tests", url: "https://github.com/microsoft/Graphormer/blob/59c0decffcade9df81d29dcc178a489b31958bab/tests/test_pretrained_model.py" },
      { label: "Repository README", url: "https://github.com/microsoft/Graphormer/blob/59c0decffcade9df81d29dcc178a489b31958bab/README.md" },
      { label: "Repository license", url: "https://github.com/microsoft/Graphormer/blob/59c0decffcade9df81d29dcc178a489b31958bab/LICENSE" },
    ],
    note: "Initial Microsoft Graphormer evidence snapshot. Direct inspection confirms degree-augmented node features, a learned graph token, spatial-position attention bias, graph-token virtual distance, edge encodings including multi-hop distance conditioning, and propagation of those biases through stacked Transformer encoder layers before graph-token readout. The repository's pinned test file validates pretrained/local checkpoint loading rather than the full graph encoder numerically, so this snapshot records source-level executable mechanism evidence without claiming broad model-behavior test coverage. The same immutable revision documents a reproducibility-oriented legacy Python 3.9/PyTorch 1.9.1/Fairseq environment and preserves the MIT license.",
  },
  {
    implementationId: "deepcubea-learned-astar",
    revision: 1,
    verifiedAt: "2026-10-07",
    verifiedRef: "master",
    verifiedCommit: "919489f14ecbbc80dc1bf1539ac0a462ffaca7c5",
    sourcePaths: [
      { label: "Weighted A* search", url: "https://github.com/forestagostinelli/DeepCubeA/blob/919489f14ecbbc80dc1bf1539ac0a462ffaca7c5/search_methods/astar.py" },
      { label: "Cost-to-go training", url: "https://github.com/forestagostinelli/DeepCubeA/blob/919489f14ecbbc80dc1bf1539ac0a462ffaca7c5/ctg_approx/avi.py" },
      { label: "Repository README", url: "https://github.com/forestagostinelli/DeepCubeA/blob/919489f14ecbbc80dc1bf1539ac0a462ffaca7c5/README.md" },
      { label: "Timing/basic-path test", url: "https://github.com/forestagostinelli/DeepCubeA/blob/919489f14ecbbc80dc1bf1539ac0a462ffaca7c5/tests/timing_test.py" },
      { label: "Repository license", url: "https://github.com/forestagostinelli/DeepCubeA/blob/919489f14ecbbc80dc1bf1539ac0a462ffaca7c5/LICENSE" },
    ],
    note: "Initial DeepCubeA executable-evidence snapshot. The pinned author code keeps path cost and learned neural heuristic separate, scores the A* open set with a weighted path-cost plus heuristic expression, explicitly expands successor states, and trains the cost-to-go network through approximate value iteration with optional search-generated update states. The README supplies training/search commands and notes that some maintained hyperparameters differ slightly from the paper. The available timing test checks basic environment, heuristic-inference, and multiprocessing paths rather than search optimality or published benchmark reproduction, so the snapshot remains Research/prototyping evidence and does not inherit the paper's empirical solve-rate or path-quality claims.",
  },
  ...attentionImplementationVerificationAdditions,
];