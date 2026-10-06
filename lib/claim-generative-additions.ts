import type { ClaimRecord } from "./claims-base.ts";

/** Generative-model Claims kept modular from the historical Claim catalog. */
export const generativeClaimAdditions: ClaimRecord[] = [
  {
    id: "ddpm-forward-noise-reverse-denoising",
    kind: "Mechanism",
    statement: "Diffusion models define a forward process that gradually corrupts data with noise and learn a reverse process that generates samples through iterative denoising from a simple noise distribution.",
    algorithmIds: ["diffusion-models"],
    chapterSlug: "12-generative-models-diffusion-flow-autoregressive",
    passageContains: "Generation becomes iterative denoising from a simple noise distribution toward the data distribution.",
    referenceIds: ["ho-2020-ddpm"],
    note: "This claim is scoped to the canonical DDPM forward-noise/reverse-denoising mechanism. Noise schedules, parameterizations, samplers, conditioning, and accelerated or deterministic variants can differ substantially.",
  },
  {
    id: "flow-matching-vector-field-regression",
    kind: "Mechanism",
    statement: "Flow Matching trains a generative vector field by regressing toward target velocities along a chosen probability path instead of requiring stochastic diffusion simulation during training.",
    algorithmIds: ["flow-matching"],
    chapterSlug: "12-generative-models-diffusion-flow-autoregressive",
    passageContains: "Instead of simulating stochastic diffusion during training, directly learn a vector field that transports samples along a chosen probability path.",
    referenceIds: ["lipman-2023-flow-matching"],
    note: "This claim is limited to the Flow Matching training objective and path-based vector-field construction. Sampling cost, path choice, ODE integration, and empirical quality remain model- and workload-dependent.",
  },
];
