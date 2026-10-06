import type { ImplementationRecord } from "./implementations.ts";

/** Generative-model implementation records kept modular from the historical registry. */
export const generativeImplementationAdditions: ImplementationRecord[] = [
  {
    id: "diffusers-ddpm",
    name: "Hugging Face Diffusers DDPM",
    repository: "https://github.com/huggingface/diffusers",
    homepage: "https://huggingface.co/docs/diffusers/",
    algorithmIds: ["diffusion-models"],
    language: "Python",
    interfaces: ["Python API", "DDPMScheduler", "DDPMPipeline", "UNet2DModel"],
    license: "Apache-2.0",
    maturity: "Production-proven",
    summary: "Hugging Face Diffusers provides an executable DDPM scheduler and unconditional image-generation pipeline implementing forward noising and iterative reverse denoising with a learned UNet.",
    implementationNotes: [
      "The pinned DDPMScheduler explicitly implements add_noise for the forward diffusion process and step for reverse-time propagation from learned model outputs, including epsilon-, sample-, and velocity-style prediction parameterizations supported by the scheduler.",
      "The pinned DDPMPipeline initializes from Gaussian noise, iterates over scheduler timesteps, predicts model output with UNet2DModel, and repeatedly calls scheduler.step to produce the previous sample until a generated image is obtained.",
      "The canonical scheduler tests exercise schedules, variance modes, deterministic full reverse loops, prediction parameterizations, and scheduler configuration behavior. The pipeline tests exercise deterministic inference output, alternate sample prediction, memory-oriented mixins, and an accelerator-gated CIFAR-10 integration path.",
      "This archive record is deliberately scoped to the DDPM scheduler/pipeline surface. Diffusers also implements many non-DDPM schedulers, conditioning systems, model architectures, and accelerated samplers that are not evidence for the canonical DDPM mechanism represented here.",
      "Ho, Jain, and Abbeel 2020 remains the primary method source. This executable snapshot corroborates implementation mechanics and tests; it does not convert library test results into claims about universal sample quality, training stability, or sampling efficiency.",
    ],
    sourcePaths: [
      { label: "DDPM scheduler", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/src/diffusers/schedulers/scheduling_ddpm.py" },
      { label: "DDPM pipeline", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/src/diffusers/pipelines/ddpm/pipeline_ddpm.py" },
      { label: "DDPM scheduler tests", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/tests/schedulers/test_scheduler_ddpm.py" },
      { label: "DDPM pipeline tests", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/tests/pipelines/ddpm/test_ddpm.py" },
      { label: "Repository license", url: "https://github.com/huggingface/diffusers/blob/899c9f3fd0e64f3206781c00c71c28249eff9ca5/LICENSE" },
    ],
    verifiedRef: "main",
    verifiedCommit: "899c9f3fd0e64f3206781c00c71c28249eff9ca5",
    lastVerified: "2026-10-06",
  },
];
