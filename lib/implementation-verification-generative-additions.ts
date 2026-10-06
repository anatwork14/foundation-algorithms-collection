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
  {
    implementationId: "meta-flow-matching",
    revision: 1,
    verifiedAt: "2026-10-06",
    verifiedRef: "main",
    verifiedCommit: "11568d37f8d5a080e12aa7b5305d9c35ae07d136",
    sourcePaths: [
      { label: "Probability-path abstraction", url: "https://github.com/facebookresearch/flow_matching/blob/11568d37f8d5a080e12aa7b5305d9c35ae07d136/flow_matching/path/path.py" },
      { label: "Affine probability path", url: "https://github.com/facebookresearch/flow_matching/blob/11568d37f8d5a080e12aa7b5305d9c35ae07d136/flow_matching/path/affine.py" },
      { label: "Path sample and velocity target", url: "https://github.com/facebookresearch/flow_matching/blob/11568d37f8d5a080e12aa7b5305d9c35ae07d136/flow_matching/path/path_sample.py" },
      { label: "ODE solver", url: "https://github.com/facebookresearch/flow_matching/blob/11568d37f8d5a080e12aa7b5305d9c35ae07d136/flow_matching/solver/ode_solver.py" },
      { label: "Probability-path tests", url: "https://github.com/facebookresearch/flow_matching/blob/11568d37f8d5a080e12aa7b5305d9c35ae07d136/tests/path/test_path.py" },
      { label: "ODE-solver tests", url: "https://github.com/facebookresearch/flow_matching/blob/11568d37f8d5a080e12aa7b5305d9c35ae07d136/tests/solver/test_ode_solver.py" },
      { label: "Repository README", url: "https://github.com/facebookresearch/flow_matching/blob/11568d37f8d5a080e12aa7b5305d9c35ae07d136/README.md" },
      { label: "Repository license", url: "https://github.com/facebookresearch/flow_matching/blob/11568d37f8d5a080e12aa7b5305d9c35ae07d136/LICENSE" },
    ],
    note: "Initial Meta flow_matching evidence snapshot. Direct inspection of the pinned probability-path abstractions confirms source-to-target path sampling and conditional velocity targets; AffineProbPath demonstrates training by regressing a model against dx_t, and ODESolver integrates a learned velocity field over time for generation. Pinned path and solver tests cover path sampling, shape invariants, objective conversions, multiple numerical integration methods, intermediate trajectories, and gradient-enabled solver behavior. The repository is CC BY-NC 4.0 and accompanies a later Flow Matching guide/codebase, so this archive records it as research/prototyping executable evidence rather than a permissively licensed production implementation or the primary method authority.",
  },
];
