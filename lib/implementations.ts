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
      "The verified revision still exposes HNSW as a link structure over a storage-index abstraction; current sources also include newer specialized HNSW variants without changing this core registry role.",
    ],
    sourcePaths: [
      { label: "IndexHNSW interface", url: "https://github.com/facebookresearch/faiss/blob/0db2f3088643c2b2d0bc1c3afdba1dc0c40fee1a/faiss/IndexHNSW.h" },
      { label: "HNSW implementation", url: "https://github.com/facebookresearch/faiss/blob/0db2f3088643c2b2d0bc1c3afdba1dc0c40fee1a/faiss/IndexHNSW.cpp" },
    ],
    verifiedRef: "main",
    verifiedCommit: "0db2f3088643c2b2d0bc1c3afdba1dc0c40fee1a",
    lastVerified: "2026-10-02",
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
      "At the verified revision, the functional phase_estimation circuit is the forward-looking API while the PhaseEstimation class remains present but deprecated for Qiskit 3.0 removal.",
    ],
    sourcePaths: [
      { label: "Phase estimation circuit", url: "https://github.com/Qiskit/qiskit/blob/f6924453021a254624d01a0bedc3b917c3d3ed0c/qiskit/circuit/library/phase_estimation.py" },
      { label: "Phase estimation tests", url: "https://github.com/Qiskit/qiskit/blob/f6924453021a254624d01a0bedc3b917c3d3ed0c/test/python/circuit/library/test_phase_estimation.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "f6924453021a254624d01a0bedc3b917c3d3ed0c",
    lastVerified: "2026-10-02",
  },
  {
    id: "qiskit-vqe-qaoa",
    name: "Qiskit Algorithms VQE + QAOA",
    repository: "https://github.com/qiskit-community/qiskit-algorithms",
    homepage: "https://qiskit-community.github.io/qiskit-algorithms/",
    algorithmIds: ["vqe", "qaoa"],
    language: "Python",
    interfaces: ["Python API", "Estimator/Sampler primitives", "VQE", "QAOA"],
    license: "Apache-2.0",
    maturity: "Established open-source",
    summary: "Qiskit Algorithms provides executable VQE and QAOA minimum-eigensolver implementations built on Qiskit primitives and classical optimizers.",
    implementationNotes: [
      "The verified VQE class uses an estimator primitive, parameterized ansatz, and classical optimizer to minimize Hamiltonian expectation values.",
      "The verified QAOA class extends SamplingVQE, builds a QAOA ansatz from the problem operator, exposes depth through reps, and supports custom mixer Hamiltonians or circuits.",
      "The implementation sources cite the Peruzzo VQE and Farhi–Goldstone–Gutmann QAOA papers that are separately curated as primary Reference records in the archive.",
    ],
    sourcePaths: [
      { label: "VQE implementation", url: "https://github.com/qiskit-community/qiskit-algorithms/blob/bcb7ded3594dac02e14acce7f59f05976916d39d/qiskit_algorithms/minimum_eigensolvers/vqe.py" },
      { label: "QAOA implementation", url: "https://github.com/qiskit-community/qiskit-algorithms/blob/bcb7ded3594dac02e14acce7f59f05976916d39d/qiskit_algorithms/minimum_eigensolvers/qaoa.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "bcb7ded3594dac02e14acce7f59f05976916d39d",
    lastVerified: "2026-10-02",
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
      "The verified ML-KEM source tree still includes ML-KEM-512, ML-KEM-768, and ML-KEM-1024 implementation families, including multiple optimized backends.",
      "Use the normative FIPS 203 record in References for specification authority; this record is about executable implementation study.",
    ],
    sourcePaths: [
      { label: "ML-KEM sources", url: "https://github.com/open-quantum-safe/liboqs/tree/e6b9e783747536f34700aab4bd10718c2fecab3f/src/kem/ml_kem" },
    ],
    verifiedRef: "main",
    verifiedCommit: "e6b9e783747536f34700aab4bd10718c2fecab3f",
    lastVerified: "2026-10-01",
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
      "The functional adamw path also forwards decoupled_weight_decay=True, making the defining mechanism inspectable at the verified revision.",
    ],
    sourcePaths: [
      { label: "AdamW optimizer", url: "https://github.com/pytorch/pytorch/blob/ce42d088103272f0a90317697749d2069c815959/torch/optim/adamw.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "ce42d088103272f0a90317697749d2069c815959",
    lastVerified: "2026-10-02",
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
      "At the verified revision, PyTorch still describes this module as an implementation of the original Attention Is All You Need architecture; the Vaswani et al. reference remains the primary conceptual source in the archive.",
    ],
    sourcePaths: [
      { label: "MultiheadAttention module", url: "https://github.com/pytorch/pytorch/blob/ce42d088103272f0a90317697749d2069c815959/torch/nn/modules/activation.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "ce42d088103272f0a90317697749d2069c815959",
    lastVerified: "2026-10-02",
  },
  {
    id: "z3-sat-smt",
    name: "Z3 Theorem Prover",
    repository: "https://github.com/Z3Prover/z3",
    homepage: "https://microsoft.github.io/z3guide/",
    algorithmIds: ["sat-smt-solving"],
    language: "C++",
    interfaces: ["C++ core", "C API", "Python", "SMT-LIB"],
    license: "MIT",
    maturity: "Production-proven",
    summary: "Z3 is an SMT theorem prover with solver interfaces and theory reasoning used in verification, symbolic execution, synthesis, and constraint solving.",
    implementationNotes: [
      "The verified solver layer still exposes the abstract solver interface used for assertions, satisfiability checks, models, unsat cores, and assumption-based queries.",
      "Z3 supports multiple theories and APIs; this record is linked to the collection's broad SAT/SMT solving entity rather than claiming one internal solving strategy represents the entire system.",
    ],
    sourcePaths: [
      { label: "Solver interface implementation", url: "https://github.com/Z3Prover/z3/blob/378a8e8bb1cfd96c24c4c2a49ca236b72142d2ff/src/solver/solver.cpp" },
      { label: "Core source tree", url: "https://github.com/Z3Prover/z3/tree/378a8e8bb1cfd96c24c4c2a49ca236b72142d2ff/src" },
    ],
    verifiedRef: "master",
    verifiedCommit: "378a8e8bb1cfd96c24c4c2a49ca236b72142d2ff",
    lastVerified: "2026-10-02",
  },
  {
    id: "networkx-shortest-path-search",
    name: "NetworkX A* + Dijkstra shortest paths",
    repository: "https://github.com/networkx/networkx",
    homepage: "https://networkx.org/",
    algorithmIds: ["a-star", "dijkstra"],
    language: "Python",
    interfaces: ["Python API", "astar_path", "Dijkstra single-source/multi-source shortest paths"],
    license: "BSD-3-Clause",
    maturity: "Production-proven",
    summary: "NetworkX provides executable A* and Dijkstra shortest-path implementations in its graph algorithms package.",
    implementationNotes: [
      "The verified A* implementation uses a priority queue keyed by accumulated path cost plus heuristic estimate and explicitly defaults h=0 to Dijkstra behavior.",
      "The verified weighted shortest-path module contains the Dijkstra single-/multi-source implementation and documents the negative-weight limitation central to the algorithm's assumptions.",
    ],
    sourcePaths: [
      { label: "A* implementation", url: "https://github.com/networkx/networkx/blob/31b74e96903d7f873b30c8ff36d71a4c9252b107/networkx/algorithms/shortest_paths/astar.py" },
      { label: "Dijkstra implementation", url: "https://github.com/networkx/networkx/blob/31b74e96903d7f873b30c8ff36d71a4c9252b107/networkx/algorithms/shortest_paths/weighted.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "31b74e96903d7f873b30c8ff36d71a4c9252b107",
    lastVerified: "2026-10-02",
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
