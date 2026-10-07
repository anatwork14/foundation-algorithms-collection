import type { ImplementationRecord } from "./implementations.ts";

/** Search/planning implementation records kept modular from the historical registry. */
export const searchImplementationAdditions: ImplementationRecord[] = [
  {
    id: "transpath-transformer-heuristic",
    name: "TransPath Transformer Heuristic Search",
    repository: "https://github.com/AIRI-Institute/TransPath",
    homepage: "https://airi-institute.github.io/TransPath/",
    algorithmIds: ["a-star", "learned-heuristics", "transformer-attention"],
    language: "Python / PyTorch",
    interfaces: ["Python scripts", "SpatialTransformer", "DifferentiableDiagAstar", "PyTorch Lightning"],
    license: "MIT",
    maturity: "Research/prototyping",
    summary: "The TransPath author repository combines a convolutional encoder/decoder with Transformer attention to predict heuristic proxies that guide an explicit differentiable A* planner on grid pathfinding tasks.",
    implementationNotes: [
      "The pinned Autoencoder encodes the grid, applies positional embeddings and a SpatialTransformer attention stack, and decodes heuristic or focal-map predictions used by search.",
      "The pinned attention module implements multi-head self/cross-attention and Transformer blocks, while DifferentiableDiagAstar in planners.py performs explicit grid expansion with learned heuristic, correction-factor, or focal-map modes.",
      "The pinned eval.py compares a learned planner against a vanilla planner through expansion-count and path-cost ratios on the repository test data; pretrained weights and example maps are also shipped in the repository.",
      "The repository does not expose a standalone automated unit/integration test suite at this pin. The archive therefore treats eval.py and shipped examples/weights as executable inspection evidence only and does not present the paper's reported search-effort or solution-quality results as independently reproduced.",
      "This record is scoped to the TransPath grid-pathfinding implementation at the immutable main commit. Transformer prediction cost, generalization outside the released data regimes, heuristic admissibility, and bounded-suboptimality conditions remain task- and search-mode-specific.",
    ],
    sourcePaths: [
      { label: "Transformer heuristic predictor", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/models/autoencoder.py" },
      { label: "Transformer attention blocks", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/modules/attention.py" },
      { label: "Differentiable A* planner", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/modules/planners.py" },
      { label: "Evaluation script", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/eval.py" },
      { label: "Repository scope and pretrained artifacts", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/README.md" },
      { label: "Repository license", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/LICENSE" },
    ],
    verifiedRef: "main",
    verifiedCommit: "7e471c8981ac96996eb5806083b9539477c631a0",
    lastVerified: "2026-10-07",
  },
];
