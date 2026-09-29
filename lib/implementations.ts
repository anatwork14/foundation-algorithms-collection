export type ImplementationMaturity =
  | "Established open-source"
  | "Production-proven"
  | "Research/prototyping";

export type ImplementationRecord = {
  id: string;
  name: string;
  repository: string;
  homepage?: string;
  algorithmIds: string[];
  language: string;
  interfaces: string[];
  license: string;
  maturity: ImplementationMaturity;
  summary: string;
  implementationNotes: string[];
  sourcePaths: Array<{ label: string; url: string }>;
  verifiedRef: string;
  verifiedCommit: string;
  lastVerified: string;
};

export const implementations: ImplementationRecord[] = [
  {
    id: "faiss-hnsw",
    name: "Faiss HNSW",
    repository: "https://github.com/facebookresearch/faiss",
    homepage: "https://faiss.ai",
    algorithmIds: ["hnsw"],
    language: "C++",
    interfaces: ["C++", "Python", "C API"],
    license: "MIT",
    maturity: "Production-proven",
    summary: "Faiss includes an HNSW index implementation inside a broader dense-vector similarity-search library.",
    implementationNotes: [
      "Useful for studying HNSW as part of a larger ANN system with multiple index families.",
      "The implementation separates the HNSW link structure from the storage index abstraction.",
    ],
    sourcePaths: [
      { label: "IndexHNSW interface", url: "https://github.com/facebookresearch/faiss/blob/fdb9535c15b1b2990fd28f76f0641e65b95162f8/faiss/IndexHNSW.h" },
      { label: "HNSW implementation", url: "https://github.com/facebookresearch/faiss/blob/fdb9535c15b1b2990fd28f76f0641e65b95162f8/faiss/IndexHNSW.cpp" },
    ],
    verifiedRef: "main",
    verifiedCommit: "fdb9535c15b1b2990fd28f76f0641e65b95162f8",
    lastVerified: "2026-09-28",
  },
  {
    id: "hnswlib",
    name: "hnswlib",
    repository: "https://github.com/nmslib/hnswlib",
    algorithmIds: ["hnsw"],
    language: "C++",
    interfaces: ["C++", "Python"],
    license: "Apache-2.0",
    maturity: "Established open-source",
    summary: "A compact header-oriented C++/Python library focused specifically on fast approximate nearest-neighbor search with HNSW.",
    implementationNotes: [
      "A comparatively focused codebase for studying HNSW construction and query behavior.",
      "Useful as a contrast with Faiss, where HNSW is one index family inside a larger retrieval system.",
    ],
    sourcePaths: [
      { label: "Repository source", url: "https://github.com/nmslib/hnswlib/tree/ca426729609b3221563047ceb269cc1213e0d376/hnswlib" },
    ],
    verifiedRef: "master",
    verifiedCommit: "ca426729609b3221563047ceb269cc1213e0d376",
    lastVerified: "2026-09-28",
  },
  {
    id: "qiskit-phase-estimation",
    name: "Qiskit Phase Estimation circuit",
    repository: "https://github.com/Qiskit/qiskit",
    homepage: "https://www.ibm.com/quantum/qiskit",
    algorithmIds: ["quantum-phase-estimation"],
    language: "Python",
    interfaces: ["Python SDK", "QuantumCircuit"],
    license: "Apache-2.0",
    maturity: "Established open-source",
    summary: "Qiskit's circuit library includes a Quantum Phase Estimation circuit implementation and associated tests.",
    implementationNotes: [
      "Useful for connecting the abstract QPE circuit to an executable SDK representation.",
      "The circuit-library implementation exposes QPE composition while the surrounding SDK handles transpilation and execution concerns.",
    ],
    sourcePaths: [
      { label: "Phase estimation circuit", url: "https://github.com/Qiskit/qiskit/blob/8d4d380cd1dc50cc1b6b2e5cb8d31390d037d133/qiskit/circuit/library/phase_estimation.py" },
      { label: "Phase estimation tests", url: "https://github.com/Qiskit/qiskit/blob/8d4d380cd1dc50cc1b6b2e5cb8d31390d037d133/test/python/circuit/library/test_phase_estimation.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "8d4d380cd1dc50cc1b6b2e5cb8d31390d037d133",
    lastVerified: "2026-09-28",
  },
  {
    id: "liboqs-ml-kem",
    name: "liboqs ML-KEM",
    repository: "https://github.com/open-quantum-safe/liboqs",
    homepage: "https://openquantumsafe.org/",
    algorithmIds: ["ml-kem"],
    language: "C",
    interfaces: ["C library"],
    license: "Repository-defined (GitHub reports NOASSERTION)",
    maturity: "Research/prototyping",
    summary: "liboqs provides ML-KEM implementations for experimenting with and integrating post-quantum key encapsulation.",
    implementationNotes: [
      "The repository includes ML-KEM-512, ML-KEM-768, and ML-KEM-1024 implementation paths.",
      "Use the normative FIPS 203 record in References for specification authority; this record is about executable implementation study.",
    ],
    sourcePaths: [
      { label: "ML-KEM sources", url: "https://github.com/open-quantum-safe/liboqs/tree/b196b57aa615c84d62cbf6a59a8bfc294e6747dd/src/kem/ml_kem" },
    ],
    verifiedRef: "main",
    verifiedCommit: "b196b57aa615c84d62cbf6a59a8bfc294e6747dd",
    lastVerified: "2026-09-28",
  },
  {
    id: "pytorch-adamw",
    name: "PyTorch AdamW",
    repository: "https://github.com/pytorch/pytorch",
    homepage: "https://pytorch.org/",
    algorithmIds: ["adamw"],
    language: "Python",
    interfaces: ["Python API", "torch.optim.AdamW"],
    license: "BSD-style (repository LICENSE; GitHub SPDX NOASSERTION)",
    maturity: "Production-proven",
    summary: "PyTorch exposes AdamW through torch.optim with decoupled weight decay enabled explicitly in the optimizer implementation.",
    implementationNotes: [
      "The AdamW constructor delegates to the shared Adam implementation with decoupled_weight_decay enabled.",
      "The functional adamw path also forwards decoupled_weight_decay=True, making the defining mechanism inspectable at the pinned revision.",
    ],
    sourcePaths: [
      { label: "AdamW optimizer", url: "https://github.com/pytorch/pytorch/blob/c8532b3e7f0e3aec4bb518524c3ca041e17665aa/torch/optim/adamw.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "c8532b3e7f0e3aec4bb518524c3ca041e17665aa",
    lastVerified: "2026-09-29",
  },
  {
    id: "pytorch-multihead-attention",
    name: "PyTorch MultiheadAttention",
    repository: "https://github.com/pytorch/pytorch",
    homepage: "https://pytorch.org/",
    algorithmIds: ["transformer-attention"],
    language: "Python",
    interfaces: ["Python API", "torch.nn.MultiheadAttention"],
    license: "BSD-style (repository LICENSE; GitHub SPDX NOASSERTION)",
    maturity: "Production-proven",
    summary: "PyTorch provides a MultiheadAttention module implementing the multi-head attention architecture used by Transformer-style models.",
    implementationNotes: [
      "The module exposes query, key, and value inputs with learned projections and multi-head attention behavior.",
      "This record documents executable attention code; the Vaswani et al. reference remains the primary conceptual source in the archive.",
    ],
    sourcePaths: [
      { label: "MultiheadAttention module", url: "https://github.com/pytorch/pytorch/blob/c8532b3e7f0e3aec4bb518524c3ca041e17665aa/torch/nn/modules/activation.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "c8532b3e7f0e3aec4bb518524c3ca041e17665aa",
    lastVerified: "2026-09-29",
  },
];

const byId = new Map(implementations.map((implementation) => [implementation.id, implementation]));

export function getImplementation(id: string) {
  return byId.get(id) ?? null;
}

export function implementationsForAlgorithm(algorithmId: string) {
  return implementations.filter((implementation) => implementation.algorithmIds.includes(algorithmId));
}

export function implementationCommitUrl(implementation: ImplementationRecord) {
  return `${implementation.repository}/commit/${implementation.verifiedCommit}`;
}

export function implementationSearchText(implementation: ImplementationRecord) {
  return [
    implementation.name,
    implementation.repository,
    implementation.homepage ?? "",
    ...implementation.algorithmIds,
    implementation.language,
    ...implementation.interfaces,
    implementation.license,
    implementation.maturity,
    implementation.summary,
    ...implementation.implementationNotes,
    implementation.verifiedRef,
    implementation.verifiedCommit,
  ].join(" ").toLowerCase();
}
