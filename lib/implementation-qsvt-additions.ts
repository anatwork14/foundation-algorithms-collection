import type { ImplementationRecord } from "./implementations.ts";

/** Executable QSVT evidence kept modular from the historical implementation
 * registry so the archive can preserve exact mechanism scope and provenance. */
export const qsvtImplementationAdditions: ImplementationRecord[] = [
  {
    id: "pennylane-qsvt",
    name: "PennyLane QSVT",
    repository: "https://github.com/PennyLaneAI/pennylane",
    homepage: "https://pennylane.ai/",
    algorithmIds: ["qsvt"],
    language: "Python",
    interfaces: ["Python API", "qml.qsvt", "qml.QSVT", "poly_to_angles", "Block-encoding templates"],
    license: "Apache-2.0",
    maturity: "Established open-source",
    summary: "PennyLane provides a high-level QSVT construction and a lower-level QSVT circuit template that combine block encodings with polynomial-derived projector phase sequences.",
    implementationNotes: [
      "At the pinned revision, qsvt.py exposes qsvt(A, poly, encoding_wires, ...): it converts the requested polynomial into QSVT phase angles, selects a supported matrix or Hamiltonian block encoding, constructs projector-controlled phase operations, and returns a QSVT operator.",
      "The QSVT template represents the alternating block-encoding, adjoint, and projector-phase sequence used to apply a polynomial transformation to singular values of the encoded matrix. This record is scoped to that executable transformation mechanism rather than to every QSP/QSVT-derived algorithm.",
      "The wrapper supports different encoding paths with distinct constraints, including BlockEncode/FABLE for matrices and PrepSelPrep/Qubitization for Hamiltonians; the inspected documentation also records matrix-input and FABLE normalization restrictions. Those implementation constraints are preserved instead of being generalized into the abstract QSVT theorem.",
      "The pinned upstream QSVT tests exercise operator validity, decomposition, and numerical matrix behavior. They corroborate executable behavior but do not establish asymptotic quantum advantage, efficient state preparation, efficient block encoding, or favorable end-to-end readout cost; the curated Gilyén et al. primary Reference remains the theoretical authority.",
    ],
    sourcePaths: [
      { label: "QSVT wrapper, phase construction, and circuit template", url: "https://github.com/PennyLaneAI/pennylane/blob/04a3038c02ec15874947bfed85cf28ebe84f75be/pennylane/templates/subroutines/qsvt.py" },
      { label: "QSVT implementation tests", url: "https://github.com/PennyLaneAI/pennylane/blob/04a3038c02ec15874947bfed85cf28ebe84f75be/tests/templates/subroutines/test_qsvt.py" },
      { label: "Repository license", url: "https://github.com/PennyLaneAI/pennylane/blob/04a3038c02ec15874947bfed85cf28ebe84f75be/LICENSE" },
    ],
    verifiedRef: "main",
    verifiedCommit: "04a3038c02ec15874947bfed85cf28ebe84f75be",
    lastVerified: "2026-10-04",
  },
];
