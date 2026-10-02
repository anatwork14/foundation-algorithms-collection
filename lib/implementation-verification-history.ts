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
    implementationId: "faiss-hnsw",
    revision: 2,
    verifiedAt: "2026-10-01",
    verifiedRef: "main",
    verifiedCommit: "88a28bcd80aa4469bd15520c510186c98f51d985",
    sourcePaths: [
      { label: "IndexHNSW interface", url: "https://github.com/facebookresearch/faiss/blob/88a28bcd80aa4469bd15520c510186c98f51d985/faiss/IndexHNSW.h" },
      { label: "HNSW implementation", url: "https://github.com/facebookresearch/faiss/blob/88a28bcd80aa4469bd15520c510186c98f51d985/faiss/IndexHNSW.cpp" },
    ],
    note: "Freshness re-review of current Faiss main. Direct inspection confirmed the HNSW link-structure/storage-index abstraction and implementation remain present at the new immutable revision; newer specialized variants do not change this registry record's scope.",
  },
  {
    implementationId: "faiss-hnsw",
    revision: 3,
    verifiedAt: "2026-10-02",
    verifiedRef: "main",
    verifiedCommit: "0db2f3088643c2b2d0bc1c3afdba1dc0c40fee1a",
    sourcePaths: [
      { label: "IndexHNSW interface", url: "https://github.com/facebookresearch/faiss/blob/0db2f3088643c2b2d0bc1c3afdba1dc0c40fee1a/faiss/IndexHNSW.h" },
      { label: "HNSW implementation", url: "https://github.com/facebookresearch/faiss/blob/0db2f3088643c2b2d0bc1c3afdba1dc0c40fee1a/faiss/IndexHNSW.cpp" },
    ],
    note: "Freshness re-review after Faiss main advanced. The compare set changed IndexHNSW.cpp only minimally while IndexHNSW.h remained unchanged; direct inspection confirms the HNSW implementation and storage-index structure remain present at this immutable revision.",
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
    implementationId: "qiskit-phase-estimation",
    revision: 2,
    verifiedAt: "2026-10-01",
    verifiedRef: "main",
    verifiedCommit: "649763bbb0c7b7967d46aea5c6971bc4e5d1311a",
    sourcePaths: [
      { label: "Phase estimation circuit", url: "https://github.com/Qiskit/qiskit/blob/649763bbb0c7b7967d46aea5c6971bc4e5d1311a/qiskit/circuit/library/phase_estimation.py" },
      { label: "Phase estimation tests", url: "https://github.com/Qiskit/qiskit/blob/649763bbb0c7b7967d46aea5c6971bc4e5d1311a/test/python/circuit/library/test_phase_estimation.py" },
    ],
    note: "Freshness re-review of Qiskit main. The phase-estimation implementation and tests remain present; the functional phase_estimation API is current while the PhaseEstimation class is explicitly deprecated for future removal.",
  },
  {
    implementationId: "qiskit-phase-estimation",
    revision: 3,
    verifiedAt: "2026-10-02",
    verifiedRef: "main",
    verifiedCommit: "f6924453021a254624d01a0bedc3b917c3d3ed0c",
    sourcePaths: [
      { label: "Phase estimation circuit", url: "https://github.com/Qiskit/qiskit/blob/f6924453021a254624d01a0bedc3b917c3d3ed0c/qiskit/circuit/library/phase_estimation.py" },
      { label: "Phase estimation tests", url: "https://github.com/Qiskit/qiskit/blob/f6924453021a254624d01a0bedc3b917c3d3ed0c/test/python/circuit/library/test_phase_estimation.py" },
    ],
    note: "Freshness re-review after Qiskit main advanced by two commits outside the phase-estimation implementation/tests. Direct inspection confirms the functional phase_estimation circuit and test coverage remain present; the PhaseEstimation class remains explicitly deprecated for Qiskit 3.0 removal.",
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
    implementationId: "liboqs-ml-kem",
    revision: 2,
    verifiedAt: "2026-10-01",
    verifiedRef: "main",
    verifiedCommit: "e6b9e783747536f34700aab4bd10718c2fecab3f",
    sourcePaths: [
      { label: "ML-KEM sources", url: "https://github.com/open-quantum-safe/liboqs/tree/e6b9e783747536f34700aab4bd10718c2fecab3f/src/kem/ml_kem" },
    ],
    note: "Freshness re-review of liboqs main. The inspected ML-KEM tree still contains the ML-KEM-512, ML-KEM-768, and ML-KEM-1024 implementation families, including multiple optimized backends; FIPS 203 remains the normative specification record.",
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
    implementationId: "pytorch-adamw",
    revision: 3,
    verifiedAt: "2026-10-01",
    verifiedRef: "main",
    verifiedCommit: "1d40e77c093f371f28fa9caa18ba2ff3bd1c8eff",
    sourcePaths: [
      { label: "AdamW optimizer", url: "https://github.com/pytorch/pytorch/blob/1d40e77c093f371f28fa9caa18ba2ff3bd1c8eff/torch/optim/adamw.py" },
    ],
    note: "Second freshness re-review on current PyTorch main. Direct inspection confirms both the AdamW constructor and functional adamw path still enforce decoupled_weight_decay=True at this immutable revision.",
  },
  {
    implementationId: "pytorch-adamw",
    revision: 4,
    verifiedAt: "2026-10-02",
    verifiedRef: "main",
    verifiedCommit: "c4a196f8671e1f743175dfe27002830d449ed82c",
    sourcePaths: [
      { label: "AdamW optimizer", url: "https://github.com/pytorch/pytorch/blob/c4a196f8671e1f743175dfe27002830d449ed82c/torch/optim/adamw.py" },
    ],
    note: "Freshness re-review after PyTorch main advanced. The target AdamW file was absent from the compare set; direct inspection at the new head confirms both the class constructor and functional path still set decoupled_weight_decay=True.",
  },
  {
    implementationId: "pytorch-adamw",
    revision: 5,
    verifiedAt: "2026-10-02",
    verifiedRef: "main",
    verifiedCommit: "ce42d088103272f0a90317697749d2069c815959",
    sourcePaths: [
      { label: "AdamW optimizer", url: "https://github.com/pytorch/pytorch/blob/ce42d088103272f0a90317697749d2069c815959/torch/optim/adamw.py" },
    ],
    note: "Freshness re-review after PyTorch main advanced by two commits limited to test/test_sparse_semi_structured.py and test/test_transformers.py. Direct inspection confirms AdamW still sets decoupled_weight_decay=True in both the constructor and functional path.",
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
    implementationId: "pytorch-multihead-attention",
    revision: 3,
    verifiedAt: "2026-10-01",
    verifiedRef: "main",
    verifiedCommit: "1d40e77c093f371f28fa9caa18ba2ff3bd1c8eff",
    sourcePaths: [
      { label: "MultiheadAttention module", url: "https://github.com/pytorch/pytorch/blob/1d40e77c093f371f28fa9caa18ba2ff3bd1c8eff/torch/nn/modules/activation.py" },
    ],
    note: "Second freshness re-review on current PyTorch main. Direct inspection confirms torch.nn.MultiheadAttention remains the original Transformer-style multi-head attention module with query/key/value inputs and learned projections.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 4,
    verifiedAt: "2026-10-02",
    verifiedRef: "main",
    verifiedCommit: "c4a196f8671e1f743175dfe27002830d449ed82c",
    sourcePaths: [
      { label: "MultiheadAttention module", url: "https://github.com/pytorch/pytorch/blob/c4a196f8671e1f743175dfe27002830d449ed82c/torch/nn/modules/activation.py" },
    ],
    note: "Freshness re-review after PyTorch main advanced. The target activation module was absent from the compare set; direct inspection confirms MultiheadAttention still implements the original Transformer-style Q/K/V multi-head mechanism and can use scaled-dot-product-attention optimized paths when possible.",
  },
  {
    implementationId: "pytorch-multihead-attention",
    revision: 5,
    verifiedAt: "2026-10-02",
    verifiedRef: "main",
    verifiedCommit: "ce42d088103272f0a90317697749d2069c815959",
    sourcePaths: [
      { label: "MultiheadAttention module", url: "https://github.com/pytorch/pytorch/blob/ce42d088103272f0a90317697749d2069c815959/torch/nn/modules/activation.py" },
    ],
    note: "Freshness re-review after two upstream test-only commits. Direct inspection confirms MultiheadAttention remains the original Transformer-style Q/K/V multi-head architecture and retains scaled_dot_product_attention optimized paths when possible.",
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
  {
    implementationId: "z3-sat-smt",
    revision: 2,
    verifiedAt: "2026-10-01",
    verifiedRef: "master",
    verifiedCommit: "36828e144e0802a1e936031b6efa2dbe89fde9a5",
    sourcePaths: [
      { label: "Solver interface implementation", url: "https://github.com/Z3Prover/z3/blob/36828e144e0802a1e936031b6efa2dbe89fde9a5/src/solver/solver.cpp" },
      { label: "Core source tree", url: "https://github.com/Z3Prover/z3/tree/36828e144e0802a1e936031b6efa2dbe89fde9a5/src" },
    ],
    note: "Freshness re-review of Z3 master. Direct inspection confirms src/solver/solver.cpp remains the abstract solver interface supporting assertion access, satisfiability checks, models, unsat cores, and assumption-based queries.",
  },
  {
    implementationId: "z3-sat-smt",
    revision: 3,
    verifiedAt: "2026-10-02",
    verifiedRef: "master",
    verifiedCommit: "378a8e8bb1cfd96c24c4c2a49ca236b72142d2ff",
    sourcePaths: [
      { label: "Solver interface implementation", url: "https://github.com/Z3Prover/z3/blob/378a8e8bb1cfd96c24c4c2a49ca236b72142d2ff/src/solver/solver.cpp" },
      { label: "Core source tree", url: "https://github.com/Z3Prover/z3/tree/378a8e8bb1cfd96c24c4c2a49ca236b72142d2ff/src" },
    ],
    note: "Freshness re-review after Z3 master advanced by three commits limited to CI/examples/JavaScript dependency metadata. Direct inspection confirms src/solver/solver.cpp remains the abstract solver interface and the registry scope is unchanged.",
  },
];

export function verificationHistoryForImplementation(implementationId: string) {
  return implementationVerificationHistory
    .filter((entry) => entry.implementationId === implementationId)
    .sort((a, b) => a.revision - b.revision);
}
