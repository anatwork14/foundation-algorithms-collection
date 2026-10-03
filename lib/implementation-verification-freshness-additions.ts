import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/**
 * Append-only freshness re-verifications performed on 2026-10-03 after the
 * upstream default branches moved beyond the previous immutable snapshots.
 */
export const implementationVerificationFreshnessAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "faiss-hnsw",
    revision: 4,
    verifiedAt: "2026-10-03",
    verifiedRef: "main",
    verifiedCommit: "e7c44eb000bebb16f84be38a115caa5d333a8229",
    sourcePaths: [
      { label: "IndexHNSW interface", url: "https://github.com/facebookresearch/faiss/blob/e7c44eb000bebb16f84be38a115caa5d333a8229/faiss/IndexHNSW.h" },
      { label: "HNSW implementation", url: "https://github.com/facebookresearch/faiss/blob/e7c44eb000bebb16f84be38a115caa5d333a8229/faiss/IndexHNSW.cpp" },
    ],
    note: "Freshness re-review after Faiss main advanced by five commits. The compare set did not modify IndexHNSW.h or IndexHNSW.cpp; direct inspection at the new immutable head confirms the HNSW link structure over a storage index remains present and within the registry record's scope.",
  },
  {
    implementationId: "qiskit-phase-estimation",
    revision: 4,
    verifiedAt: "2026-10-03",
    verifiedRef: "main",
    verifiedCommit: "a1c2c2e796ff265c59a916c49d09942b27eb0e28",
    sourcePaths: [
      { label: "Phase estimation circuit", url: "https://github.com/Qiskit/qiskit/blob/a1c2c2e796ff265c59a916c49d09942b27eb0e28/qiskit/circuit/library/phase_estimation.py" },
      { label: "Phase estimation tests", url: "https://github.com/Qiskit/qiskit/blob/a1c2c2e796ff265c59a916c49d09942b27eb0e28/test/python/circuit/library/test_phase_estimation.py" },
    ],
    note: "Freshness re-review after Qiskit main advanced into 2.7 development. The compare set did not modify the phase-estimation implementation/tests; direct inspection confirms the functional phase_estimation circuit and tests remain present while the PhaseEstimation class remains explicitly deprecated for Qiskit 3.0 removal.",
  },
  {
    implementationId: "pytorch-adamw",
    revision: 6,
    verifiedAt: "2026-10-03",
    verifiedRef: "main",
    verifiedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    sourcePaths: [
      { label: "AdamW optimizer", url: "https://github.com/pytorch/pytorch/blob/68d62895fad677a8497f83eef2e0e348d7c7f1ab/torch/optim/adamw.py" },
    ],
    note: "Freshness re-review after PyTorch main advanced by 116 commits. The target torch/optim/adamw.py file was not part of the compare set; direct inspection confirms the constructor still sets decoupled_weight_decay=True and state restoration preserves that defining AdamW behavior.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 6,
    verifiedAt: "2026-10-03",
    verifiedRef: "main",
    verifiedCommit: "68d62895fad677a8497f83eef2e0e348d7c7f1ab",
    sourcePaths: [
      { label: "MultiheadAttention module", url: "https://github.com/pytorch/pytorch/blob/68d62895fad677a8497f83eef2e0e348d7c7f1ab/torch/nn/modules/activation.py" },
    ],
    note: "Freshness re-review at the same current PyTorch head. Direct inspection confirms torch.nn.MultiheadAttention still documents and implements the original Transformer-style Q/K/V multi-head architecture and retains optimized scaled-dot-product-attention paths when possible.",
  },
  {
    implementationId: "z3-sat-smt",
    revision: 4,
    verifiedAt: "2026-10-03",
    verifiedRef: "master",
    verifiedCommit: "ce305e38247a7b9c75953a47e5683ab7bd2bce87",
    sourcePaths: [
      { label: "Solver interface implementation", url: "https://github.com/Z3Prover/z3/blob/ce305e38247a7b9c75953a47e5683ab7bd2bce87/src/solver/solver.cpp" },
      { label: "Core source tree", url: "https://github.com/Z3Prover/z3/tree/ce305e38247a7b9c75953a47e5683ab7bd2bce87/src" },
    ],
    note: "Freshness re-review after Z3 master advanced by nine commits. The target solver.cpp was not changed by the compare set; direct inspection at the new immutable revision confirms it remains the abstract solver interface used for assertions, satisfiability checks, models, assumptions, and consequences.",
  },
];
