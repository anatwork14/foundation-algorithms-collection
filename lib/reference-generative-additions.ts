import type { ReferenceEntity } from "./references-core.ts";

/** Primary generative-model references kept modular from the historical catalog. */
export const generativeReferenceAdditions: ReferenceEntity[] = [
  {
    id: "ho-2020-ddpm",
    title: "Denoising Diffusion Probabilistic Models",
    authors: ["Jonathan Ho", "Ajay Jain", "Pieter Abbeel"],
    year: 2020,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "NeurIPS 2020",
    url: "https://papers.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html",
    algorithmIds: ["diffusion-models"],
    combinationIds: [],
    chapterSlugs: ["12-generative-models-diffusion-flow-autoregressive"],
    citations: [],
    notices: [],
    summary: "Presents denoising diffusion probabilistic models, coupling a gradual forward noising process with a learned reverse process that generates samples through iterative denoising.",
    significance: "Primary source for the DDPM formulation represented by the archive's diffusion-model family, including the forward corruption schedule, learned reverse transitions, and denoising-based generation loop.",
    tags: ["diffusion", "ddpm", "denoising", "generative-modeling", "probabilistic-model"],
  },
  {
    id: "lipman-2023-flow-matching",
    title: "Flow Matching for Generative Modeling",
    authors: ["Yaron Lipman", "Ricky T. Q. Chen", "Heli Ben-Hamu", "Maximilian Nickel", "Matt Le"],
    year: 2023,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "ICLR 2023",
    url: "https://arxiv.org/abs/2210.02747",
    algorithmIds: ["flow-matching", "diffusion-models"],
    combinationIds: [],
    chapterSlugs: ["12-generative-models-diffusion-flow-autoregressive"],
    citations: [
      {
        targetId: "ho-2020-ddpm",
        note: "Lipman et al. position Flow Matching against diffusion-based generative modeling and show that their probability-path framework includes diffusion paths as specific instances while also supporting non-diffusion transport paths.",
        verificationUrl: "https://arxiv.org/pdf/2210.02747",
        verifiedAt: "2026-10-06",
      },
    ],
    notices: [],
    summary: "Introduces Flow Matching, a simulation-free objective for training continuous normalizing flows by regressing vector fields associated with chosen conditional probability paths.",
    significance: "Primary source for the archive's flow-matching family and for its direct relationship to diffusion: diffusion probability paths are covered as a special choice, while Flow Matching also supports alternative non-diffusion transport paths.",
    tags: ["flow-matching", "continuous-normalizing-flow", "generative-modeling", "optimal-transport", "diffusion", "ode"],
  },
];
