import type { ClaimRecord } from "./claims-base.ts";

/** Security/fuzzing Claims kept modular from the historical Claim catalog. */
export const securityClaimAdditions: ClaimRecord[] = [
  {
    id: "linucb-context-aware-fuzz-mutation",
    kind: "Mechanism",
    statement: "Contextual-bandit fuzzing can use seed or file features as context and apply LinUCB-style online learning to adapt which mutation operator is selected from coverage/crash feedback.",
    algorithmIds: ["linucb", "coverage-guided-fuzzing"],
    chapterSlug: "34-security-analysis-symbolic-execution-fuzzing",
    passageContains: "LinUCB or Thompson-sampling variants can adapt mutation policy online while preserving exploration.",
    referenceIds: ["wang-2021-cmfuzz"],
    note: "This claim is scoped to contextual adaptive mutation schemes such as CMFuzz. Transfer across targets, reward design, context features, runtime overhead, and vulnerability/coverage gains remain program-, fuzzer-, budget-, and benchmark-dependent.",
  },
];
