import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification snapshots for QSVT implementations. */
export const qsvtImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "pennylane-qsvt",
    revision: 1,
    verifiedAt: "2026-10-04",
    verifiedRef: "main",
    verifiedCommit: "04a3038c02ec15874947bfed85cf28ebe84f75be",
    sourcePaths: [
      { label: "QSVT wrapper, phase construction, and circuit template", url: "https://github.com/PennyLaneAI/pennylane/blob/04a3038c02ec15874947bfed85cf28ebe84f75be/pennylane/templates/subroutines/qsvt.py" },
      { label: "QSVT implementation tests", url: "https://github.com/PennyLaneAI/pennylane/blob/04a3038c02ec15874947bfed85cf28ebe84f75be/tests/templates/subroutines/test_qsvt.py" },
      { label: "Repository license", url: "https://github.com/PennyLaneAI/pennylane/blob/04a3038c02ec15874947bfed85cf28ebe84f75be/LICENSE" },
    ],
    note: "Initial PennyLane QSVT evidence snapshot. qsvt.py computes QSVT phase angles from a requested polynomial, selects supported block-encoding paths for matrix or Hamiltonian inputs, constructs projector-controlled phases, and returns the QSVT operator. The QSVT template exposes the alternating encoded-operator/adjoint/projector-phase circuit, while the pinned test module exercises validity, decomposition, and numerical behavior. This snapshot documents executable polynomial singular-value transformation only: it preserves wrapper-specific encoding and normalization constraints and does not infer efficient data access, favorable readout, asymptotic advantage, or applicability of one implementation path to every QSVT-derived algorithm. LICENSE records Apache-2.0 terms.",
  },
];
