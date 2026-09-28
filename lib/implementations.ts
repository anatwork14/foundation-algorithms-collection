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
      { label: "IndexHNSW interface", url: "https://github.com/facebookresearch/faiss/blob/main/faiss/IndexHNSW.h" },
      { label: "HNSW implementation", url: "https://github.com/facebookresearch/faiss/blob/main/faiss/IndexHNSW.cpp" },
    ],
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
      { label: "Repository source", url: "https://github.com/nmslib/hnswlib/tree/master/hnswlib" },
    ],
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
      { label: "Phase estimation circuit", url: "https://github.com/Qiskit/qiskit/blob/main/qiskit/circuit/library/phase_estimation.py" },
      { label: "Phase estimation tests", url: "https://github.com/Qiskit/qiskit/blob/main/test/python/circuit/library/test_phase_estimation.py" },
    ],
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
      { label: "ML-KEM sources", url: "https://github.com/open-quantum-safe/liboqs/tree/main/src/kem/ml_kem" },
    ],
    lastVerified: "2026-09-28",
  },
];

const byId = new Map(implementations.map((implementation) => [implementation.id, implementation]));

export function getImplementation(id: string) {
  return byId.get(id) ?? null;
}

export function implementationsForAlgorithm(algorithmId: string) {
  return implementations.filter((implementation) => implementation.algorithmIds.includes(algorithmId));
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
  ].join(" ").toLowerCase();
}
