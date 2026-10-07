import type { ImplementationRecord } from "./implementations.ts";

/** Quantum error-correction implementation records. */
export const quantumImplementationAdditions: ImplementationRecord[] = [
  {
    id: "lange-gnn-surface-code-decoder",
    name: "Lange GNN Surface-Code Decoder",
    repository: "https://github.com/LangeMoritz/GNN_decoder",
    homepage: "https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.7.023181",
    algorithmIds: ["graph-neural-networks", "surface-code-decoding"],
    language: "Python / PyTorch Geometric",
    interfaces: ["Python script", "Decoder", "GNN_7", "YAML configs", "PyTorch checkpoints"],
    license: "MIT",
    maturity: "Research/prototyping",
    summary: "The authors' research code for detector-graph graph-neural-network decoding of rotated surface codes, including Stim circuit sampling, graph construction, GNN training/testing, and published model checkpoints.",
    implementationNotes: [
      "The pinned Decoder generates rotated-memory-Z surface-code circuits with Stim under circuit-level depolarizing/reset/measurement noise, compiles detector samplers, and converts detector coordinates plus syndrome events into graph inputs.",
      "get_batch_of_graphs encodes violated X/Z stabilizers and space-time coordinates as node features, builds per-sample k-nearest-neighbor graphs with PyTorch Geometric, and assigns inverse-distance edge weights before passing each graph to the learned decoder.",
      "GNN_7 applies a stack of GraphConv layers, global mean pooling, and a dense classifier whose binary output represents the two logical equivalence classes used by the decoder.",
      "The training/testing path samples fresh syndromes, trains with BCEWithLogitsLoss, evaluates held-out/test batches, and can persist or reload model/optimizer state. The repository also ships circuit-level surface-code checkpoints across several distances and time depths, including distance-3 and distance-9 models.",
      "The pinned repository does not expose a standalone automated unit/integration test suite. Verification is therefore limited to direct source/config/checkpoint inspection and the executable training/testing paths; published decoder performance remains evidence from the associated paper rather than a result reproduced by this archive.",
    ],
    sourcePaths: [
      { label: "Decoder training and simulation", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/src/decoder.py" },
      { label: "GNN model", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/src/gnn_models.py" },
      { label: "Syndrome sampling", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/src/graph_representation.py" },
      { label: "Distance-3 surface-code config", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/config_surface_codes_3_3.yaml" },
      { label: "Distance-9 surface-code config", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/config_surface_codes_9_3.yaml" },
      { label: "Training entrypoint", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/train_nn.py" },
      { label: "Circuit-level distance-3 checkpoint", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/models/circuit_level_noise/d3/d3_d_t_3.pt" },
      { label: "Repository README", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/README.md" },
      { label: "Repository license", url: "https://github.com/LangeMoritz/GNN_decoder/blob/15d8443bedf7862ef72ec1b5239ecd01163eb8d6/LICENSE" },
    ],
    verifiedRef: "main",
    verifiedCommit: "15d8443bedf7862ef72ec1b5239ecd01163eb8d6",
    lastVerified: "2026-10-07",
  },
];
