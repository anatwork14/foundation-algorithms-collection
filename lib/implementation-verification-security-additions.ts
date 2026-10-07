import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification history for formal-methods / proof-system implementations. */
export const securityImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "circ-compiler",
    revision: 1,
    verifiedAt: "2026-10-08",
    verifiedRef: "master",
    verifiedCommit: "271f911bab2c8ab15f12f599fd7abf89c4561093",
    sourcePaths: [
      { label: "Repository architecture and backend scope", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/README.md" },
      { label: "SMT backend", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/src/target/smt/mod.rs" },
      { label: "R1CS backend", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/src/target/r1cs/mod.rs" },
      { label: "ZKP proving/verification runner", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/examples/zk.rs" },
      { label: "Build and test workflow", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/.github/workflows/ci.yml" },
      { label: "MIT license", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/LICENSE-MIT" },
      { label: "Apache-2.0 license", url: "https://github.com/circify/circ/blob/271f911bab2c8ab15f12f599fd7abf89c4561093/LICENSE-APACHE" },
    ],
    note: "Initial CirC evidence snapshot. Direct inspection confirms a shared compiler architecture with SMT and R1CS backends, an SMT-LIB/rsmt2 serialization path, an R1CS representation for proof-system integration, and a ZKP runner exposing Groth16, Mirage, and Spartan paths behind feature flags. Upstream CI enables all features and runs formatting/check/lint/docs/build/tests with external CVC4 and CBC dependencies. This records executable compiler structure and project tests, not an independent proof of compiler correctness, solver correctness, or cryptographic security.",
  },
];
