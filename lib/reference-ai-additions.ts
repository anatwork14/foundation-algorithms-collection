import type { ReferenceEntity } from "./references-core.ts";

/** Primary AI/ML references added without rewriting the historical core catalog. */
export const aiReferenceAdditions: ReferenceEntity[] = [
  {
    id: "shazeer-2017-sparsely-gated-moe",
    title: "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer",
    authors: ["Noam Shazeer", "Azalia Mirhoseini", "Krzysztof Maziarz", "Andy Davis", "Quoc V. Le", "Geoffrey Hinton", "Jeff Dean"],
    year: 2017,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "ICLR 2017",
    url: "https://arxiv.org/abs/1701.06538",
    algorithmIds: ["mixture-of-experts"],
    combinationIds: [],
    chapterSlugs: ["11-neural-architectures-attention-ssm-moe-gnn"],
    citations: [],
    notices: [],
    summary: "Introduces a sparsely gated mixture-of-experts layer in which a trainable gating network selects a sparse combination from many feed-forward expert subnetworks for each example.",
    significance: "Primary source for modern sparse expert routing and conditional computation that expands model capacity without activating every parameter for every input.",
    tags: ["mixture-of-experts", "moe", "conditional-computation", "sparse-routing", "expert-routing"],
  },
];