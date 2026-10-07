import type { ReferenceEntity } from "./references-core.ts";

/** Security/fuzzing references kept modular from the historical catalog. */
export const securityReferenceAdditions: ReferenceEntity[] = [
  {
    id: "wang-2021-cmfuzz",
    title: "CMFuzz: context-aware adaptive mutation for fuzzers",
    authors: ["Xiajing Wang", "Changzhen Hu", "Rui Ma", "Donghai Tian", "Jinyuan He"],
    year: 2021,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "Empirical Software Engineering 26(1), Article 10",
    url: "https://doi.org/10.1007/s10664-020-09927-3",
    doi: "10.1007/s10664-020-09927-3",
    algorithmIds: ["linucb", "coverage-guided-fuzzing"],
    combinationIds: [],
    chapterSlugs: ["34-security-analysis-symbolic-execution-fuzzing"],
    citations: [
      {
        targetId: "li-2010-contextual-bandit-news",
        note: "CMFuzz adopts the LinUCB contextual-bandit family to select mutation operators using seed-file context and observed fuzzing feedback.",
        verificationUrl: "https://doi.org/10.1007/s10664-020-09927-3",
        verifiedAt: "2026-10-07",
      },
    ],
    notices: [],
    summary: "Introduces a context-aware adaptive mutation scheme that encodes seed-file characteristics and uses LinUCB to choose mutation operators in mutation-based greybox fuzzers.",
    significance: "Direct primary-extension support for combining contextual bandits with coverage-guided fuzzing: mutation operators are treated as actions, seed/file features provide context, and fuzzing outcomes provide online feedback for adapting the mutation policy.",
    tags: ["fuzzing", "coverage-guided-fuzzing", "linucb", "contextual-bandit", "mutation-scheduling", "adaptive-mutation"],
  },
];
