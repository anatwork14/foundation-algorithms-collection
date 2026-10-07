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
  {
    id: "circ-shared-smt-r1cs-constraint-compilation",
    kind: "Mechanism",
    statement: "A shared constraint compiler can reuse program-lowering and optimization infrastructure while targeting SMT constraints for software verification and R1CS constraints for proof systems.",
    algorithmIds: ["sat-smt-solving", "zero-knowledge-proofs"],
    chapterSlug: "32-zero-knowledge-verifiable-computation",
    passageContains: "Shared compiler infrastructure can lower a common constraint-oriented intermediate representation to SMT for software verification or to R1CS for proof systems, reusing program-to-constraint transformations across both domains.",
    referenceIds: ["ozdemir-2022-circ"],
    note: "This claim is scoped to shared compiler infrastructure such as CirC. SMT satisfiability, R1CS generation, and end-to-end zero-knowledge soundness remain distinct stages with different semantics, solver/proof-system assumptions, and trusted components.",
  },
];
