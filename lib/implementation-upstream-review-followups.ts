import type { ImplementationUpstreamReview } from "./implementation-upstream-reviews-base.ts";

/** Follow-up upstream reviews kept modular from the historical review ledger. */
export const implementationUpstreamReviewFollowups: ImplementationUpstreamReview[] = [
  {
    implementationId: "pytorch-adamw",
    revision: 3,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "cf2cd3d06f8381f5503ccba4afbae7386f6d4e70",
    pinnedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "torch/optim/adamw.py",
        pinnedBlob: "031f8540357d2c62c82b7111cd8b0924e6041510",
        upstreamBlob: "031f8540357d2c62c82b7111cd8b0924e6041510",
        changed: false,
      },
    ],
    note: "Reviewed PyTorch main after the NVGEMM benchmark-layout change advanced the branch beyond the prior review head. Direct blob comparison confirms torch/optim/adamw.py remains byte-identical to the immutable AdamW evidence pin. Retain the existing archive pin because the observed upstream movement is unrelated to the tracked optimizer source.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 3,
    reviewedAt: "2026-10-05",
    observedRef: "main",
    observedCommit: "cf2cd3d06f8381f5503ccba4afbae7386f6d4e70",
    pinnedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "torch/nn/modules/activation.py",
        pinnedBlob: "533de4fa590109fe189f05747ee8f8f744819192",
        upstreamBlob: "533de4fa590109fe189f05747ee8f8f744819192",
        changed: false,
      },
    ],
    note: "Reviewed PyTorch main after the NVGEMM benchmark-layout change advanced the branch beyond the prior review head. Direct blob comparison confirms torch/nn/modules/activation.py remains byte-identical to the immutable MultiheadAttention evidence pin. Retain the existing archive pin because the observed upstream movement is unrelated to the tracked attention source.",
  },
,
  {
    implementationId: "pytorch-adamw",
    revision: 4,
    reviewedAt: "2026-10-06",
    observedRef: "main",
    observedCommit: "6b3607efa40bd0093e58fb887c87cf724a057491",
    pinnedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "torch/optim/adamw.py",
        pinnedBlob: "031f8540357d2c62c82b7111cd8b0924e6041510",
        upstreamBlob: "031f8540357d2c62c82b7111cd8b0924e6041510",
        changed: false,
      },
    ],
    note: "Reviewed PyTorch main after the branch advanced beyond the previous review head. Direct blob comparison at 6b3607efa40bd0093e58fb887c87cf724a057491 confirms torch/optim/adamw.py remains byte-identical to the immutable AdamW evidence pin, so the archive retains the existing pin rather than rewriting evidence for unrelated upstream movement.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 4,
    reviewedAt: "2026-10-06",
    observedRef: "main",
    observedCommit: "6b3607efa40bd0093e58fb887c87cf724a057491",
    pinnedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    decision: "Retain pin",
    materialChange: false,
    inspectedPaths: [
      {
        path: "torch/nn/modules/activation.py",
        pinnedBlob: "533de4fa590109fe189f05747ee8f8f744819192",
        upstreamBlob: "533de4fa590109fe189f05747ee8f8f744819192",
        changed: false,
      },
    ],
    note: "Reviewed PyTorch main after the branch advanced beyond the previous review head. Direct blob comparison at 6b3607efa40bd0093e58fb887c87cf724a057491 confirms torch/nn/modules/activation.py remains byte-identical to the immutable MultiheadAttention evidence pin, so the archive retains the existing pin rather than rewriting evidence for unrelated upstream movement.",
  }
];
