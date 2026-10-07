import type { ImplementationRecord } from "./implementations.ts";

/** Formal-methods / proof-system implementation records. */
export const securityImplementationAdditions: ImplementationRecord[] = [
  {
    id: "circ-compiler",
    name: "CirC Constraint Compiler",
    repository: "https://github.com/circify/circ",
    homepage: "https://circ.zk.fyi",
    algorithmIds: ["sat-smt-solving", "zero-knowledge-proofs"],
    language: "Rust",
    interfaces: ["Rust library", "SMT backend", "R1CS backend", "ZKP runner"],
    license: "MIT OR Apache-2.0",
    maturity: "Research/prototyping",
    summary: "CirC compiles high-level programs through a shared constraint IR to backends including SMT for verification and R1CS/proof-system workflows for verifiable computation.",
    implementationNotes: [
      "The pinned README documents compilation from high-level languages such as C and ZoKrates to SMT, ILP, R1CS, and MPC targets and describes separate SMT and R1CS backends under one compiler architecture.",
      "The pinned SMT backend serializes CirC IR terms and sorts to SMT-LIB through rsmt2 and can invoke CVC4/cvc5-style solvers; this is verification/constraint-solving infrastructure, not a proof system by itself.",
      "The pinned R1CS backend defines rank-1 constraint systems with instance, witness, committed-witness, and challenge variables and exposes proof-system adapters behind feature flags.",
      "The pinned examples/zk.rs runner exposes Groth16, Mirage, and Spartan proving/verification paths when the corresponding features are enabled, demonstrating the proof-system side of the shared compiler pipeline.",
      "The upstream CI installs external solver dependencies, enables all features, then formats, checks, lints, documents, builds, and tests the project. Successful repository CI is executable-quality evidence, not an independent verification of CirC compiler correctness or cryptographic soundness.",
      "The repository is dual-licensed under MIT and Apache-2.0. This archive marks the implementation Research/prototyping because compiler correctness, solver availability, feature flags, external dependencies, and proof-system security assumptions remain critical deployment boundaries.",
    ],
    sourcePaths: [
      { label: "Repository architecture and backend scope", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/README.md" },
      { label: "SMT backend", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/src/target/smt/mod.rs" },
      { label: "R1CS backend", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/src/target/r1cs/mod.rs" },
      { label: "ZKP proving/verification runner", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/examples/zk.rs" },
      { label: "Build and test workflow", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/.github/workflows/ci.yml" },
      { label: "MIT license", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/LICENSE-MIT" },
      { label: "Apache-2.0 license", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/LICENSE-APACHE" },
    ],
    verifiedRef: "master",
    verifiedCommit: "271f911bab2c8ab15f12f599fd7abf89c4561093",
    lastVerified: "2026-10-08",
  },
];
