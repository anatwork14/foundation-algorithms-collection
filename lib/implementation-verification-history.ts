import type { ImplementationRecord } from "./implementations.ts";

export type ImplementationVerificationEntry = {
  implementationId: string;
  revision: number;
  verifiedAt: string;
  verifiedRef: string;
  verifiedCommit: string;
  sourcePaths: ImplementationRecord["sourcePaths"];
  note: string;
};

export const implementationVerificationHistory: ImplementationVerificationEntry[] = [
  {
    implementationId: "faiss-hnsw",
    revision: 1,
    verifiedAt: "2026-09-28",
    verifiedRef: "main",
    verifiedCommit: "fdb9535c15b1b2990fd28f76f0641e65b95162f8",
    sourcePaths: [
      { label: "IndexHNSW interface", url: "https://github.com/facebookresearch/faiss/blob/fdb9535c15b1b2990fd28f76f0641e65b95162f8/faiss/IndexHNSW.h" },
      { label: "HNSW implementation", url: "https://github.com/facebookresearch/faiss/blob/fdb9535c15b1b2990fd28f76f0641e65b95162f8/faiss/IndexHNSW.cpp" },
    ],
    note: "Initial Faiss HNSW evidence snapshot: interface and implementation paths were inspected at this exact main-branch commit.",
  },
  {
    implementationId: "hnswlib",
    revision: 1,
    verifiedAt: "2026-09-28",
    verifiedRef: "master",
    verifiedCommit: "ca426729609b3221563047ceb269cc1213e0d376",
    sourcePaths: [
      { label: "Repository source", url: "https://github.com/nmslib/hnswlib/tree/ca426729609b3221563047ceb269cc1213e0d376/hnswlib" },
    ],
    note: "Initial hnswlib evidence snapshot at the directly inspected master revision.",
  },
  {
    implementationId: "qiskit-phase-estimation",
    revision: 1,
    verifiedAt: "2026-09-28",
    verifiedRef: "main",
    verifiedCommit: "8d4d380cd1dc50cc1b6b2e5cb8d31390d037d133",
    sourcePaths: [
      { label: "Phase estimation circuit", url: "https://github.com/Qiskit/qiskit/blob/8d4d380cd1dc50cc1b6b2e5cb8d31390d037d133/qiskit/circuit/library/phase_estimation.py" },
      { label: "Phase estimation tests", url: "https://github.com/Qiskit/qiskit/blob/8d4d380cd1dc50cc1b6b2e5cb8d31390d037d133/test/python/circuit/library/test_phase_estimation.py" },
    ],
    note: "Initial Qiskit QPE snapshot covering the circuit implementation and its corresponding tests.",
  },
  {
    implementationId: "liboqs-ml-kem",
    revision: 1,
    verifiedAt: "2026-09-28",
    verifiedRef: "main",
    verifiedCommit: "b196b57aa615c84d62cbf6a59a8bfc294e6747dd",
    sourcePaths: [
      { label: "ML-KEM sources", url: "https://github.com/open-quantum-safe/liboqs/tree/b196b57aa615c84d62cbf6a59a8bfc294e6747dd/src/kem/ml_kem" },
    ],
    note: "Initial liboqs ML-KEM executable-evidence snapshot; specification authority remains the separate FIPS 203 Reference record.",
  },
  {
    implementationId: "pytorch-adamw",
    revision: 1,
    verifiedAt: "2026-09-29",
    verifiedRef: "main",
    verifiedCommit: "c8532b3e7f0e3aec4bb518524c3ca041e17665aa",
    sourcePaths: [
      { label: "AdamW optimizer", url: "https://github.com/pytorch/pytorch/blob/c8532b3e7f0e3aec4bb518524c3ca041e17665aa/torch/optim/adamw.py" },
    ],
    note: "Initial PyTorch AdamW snapshot where decoupled weight decay was directly inspected in the pinned optimizer implementation.",
  },
  {
    implementationId: "pytorch-adamw",
    revision: 2,
    verifiedAt: "2026-10-01",
    verifiedRef: "main",
    verifiedCommit: "38cca96300da024842405ecefa081e4761254922",
    sourcePaths: [
      { label: "AdamW optimizer", url: "https://github.com/pytorch/pytorch/blob/38cca96300da024842405ecefa081e4761254922/torch/optim/adamw.py" },
    ],
    note: "Freshness re-review after main advanced by 146 commits. The targeted AdamW file and repository LICENSE were unchanged in the compare set; direct inspection at the new head still shows decoupled_weight_decay=True in the AdamW implementation.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 1,
    verifiedAt: "2026-09-29",
    verifiedRef: "main",
    verifiedCommit: "c8532b3e7f0e3aec4bb518524c3ca041e17665aa",
    sourcePaths: [
      { label: "MultiheadAttention module", url: "https://github.com/pytorch/pytorch/blob/c8532b3e7f0e3aec4bb518524c3ca041e17665aa/torch/nn/modules/activation.py" },
    ],
    note: "Initial PyTorch MultiheadAttention snapshot linked to the archive's Transformer-attention concept record.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 2,
    verifiedAt: "2026-10-01",
    verifiedRef: "main",
    verifiedCommit: "38cca96300da024842405ecefa081e4761254922",
    sourcePaths: [
      { label: "MultiheadAttention module", url: "https://github.com/pytorch/pytorch/blob/38cca96300da024842405ecefa081e4761254922/torch/nn/modules/activation.py" },
    ],
    note: "Freshness re-review after main advanced by 146 commits. The targeted MultiheadAttention file and repository LICENSE were unchanged in the compare set; direct inspection at the new head still identifies the module as the original multi-head attention architecture and exposes its query/key/value projection structure.",
  },
  {
    implementationId: "z3-sat-smt",
    revision: 1,
    verifiedAt: "2026-09-29",
    verifiedRef: "master",
    verifiedCommit: "d799f787d6fc9c16eb4a3ebbe63e6593e9b23a98",
    sourcePaths: [
      { label: "Solver interface implementation", url: "https://github.com/Z3Prover/z3/blob/d799f787d6fc9c16eb4a3ebbe63e6593e9b23a98/src/solver/solver.cpp" },
      { label: "Core source tree", url: "https://github.com/Z3Prover/z3/tree/d799f787d6fc9c16eb4a3ebbe63e6593e9b23a98/src" },
    ],
    note: "Initial Z3 SAT/SMT evidence snapshot covering the solver interface and core source tree at the verified master revision.",
  },
];

export function verificationHistoryForImplementation(implementationId: string) {
  return implementationVerificationHistory
    .filter((entry) => entry.implementationId === implementationId)
    .sort((a, b) => a.revision - b.revision);
}
