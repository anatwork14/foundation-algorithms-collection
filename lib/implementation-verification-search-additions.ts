import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification history for search/planning implementations. */
export const searchImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "transpath-transformer-heuristic",
    revision: 1,
    verifiedAt: "2026-10-07",
    verifiedRef: "main",
    verifiedCommit: "7e471c8981ac96996eb5806083b9539477c631a0",
    sourcePaths: [
      { label: "Transformer heuristic predictor", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/models/autoencoder.py" },
      { label: "Transformer attention blocks", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/modules/attention.py" },
      { label: "Differentiable A* planner", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/modules/planners.py" },
      { label: "Evaluation script", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/eval.py" },
      { label: "Repository scope and pretrained artifacts", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/README.md" },
      { label: "Repository license", url: "https://github.com/AIRI-Institute/TransPath/blob/7e471c8981ac96996eb5806083b9539477c631a0/LICENSE" },
    ],
    note: "Initial TransPath evidence snapshot. Direct inspection confirms a convolutional encoder/decoder with SpatialTransformer attention blocks, heuristic/focal prediction modes, and a DifferentiableDiagAstar planner that performs explicit grid search using those learned predictions. eval.py compares learned and vanilla planners using expansion and path-cost ratios. The repository ships pretrained weights/examples but no standalone automated test suite at this pin, so this verification records executable structure and evaluation tooling rather than an independent reproduction of the AAAI paper's performance results or guarantee claims.",
  },
];
