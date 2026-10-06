import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification history for generative-model implementations. */
export const generativeImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "diffusers-ddpm",
    revision: 1,
    verifiedAt: "2026-10-06",
    verifiedRef: "main",
    verifiedCommit: "899c9f3fd0e64f3206781c00c71c28249eff9ca5",
    sourcePaths: [
      { label: "DDPM scheduler", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/src/diffusers/schedulers/scheduling_ddpm.py" },
      { label: "DDPM pipeline", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/src/diffusers/pipelines/ddpm/pipeline_ddpm.py" },
      { label: "DDPM scheduler tests", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/tests/schedulers/test_scheduler_ddpm.py" },
      { label: "DDPM pipeline tests", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/tests/pipelines/ddpm/test_ddpm.py" },
      { label: "Repository license", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/LICENSE" },
    ],
    note: "Initial Hugging Face Diffusers DDPM evidence snapshot. Direct inspection of the pinned scheduler confirms explicit forward add_noise and reverse step mechanics; the pinned DDPMPipeline starts from Gaussian noise and iteratively applies a UNet prediction followed by scheduler.step across inference timesteps. Canonical scheduler tests exercise schedule/variance configuration, deterministic reverse loops, and multiple prediction parameterizations, while pipeline tests cover deterministic inference, alternate sample prediction, memory-oriented behavior, and an accelerator-gated CIFAR-10 integration path. The snapshot is scoped to DDPM scheduler/pipeline mechanics and preserves the Apache-2.0 license; other Diffusers schedulers, models, conditioning paths, and accelerated samplers are outside this record.",
  },
];
