import type { ImplementationRecord } from "./implementations.ts";

/**
 * Foundational implementation records added after the original monolithic
 * registry was established. Keeping new records modular avoids growing the
 * historical catalog indefinitely while preserving one exported registry.
 */
export const foundationImplementationAdditions: ImplementationRecord[] = [
  {
    id: "statsmodels-kalman-filter",
    name: "statsmodels Kalman Filter",
    repository: "https://github.com/statsmodels/statsmodels",
    homepage: "https://www.statsmodels.org/",
    algorithmIds: ["kalman-filter"],
    language: "Python / Cython",
    interfaces: ["Python API", "statsmodels.tsa.statespace.KalmanFilter", "State-space models"],
    license: "BSD-style (3-clause form in repository LICENSE.txt)",
    maturity: "Production-proven",
    summary: "statsmodels exposes a configurable KalmanFilter for linear state-space time-series models, backed by optimized state-space filtering machinery.",
    implementationNotes: [
      "The inspected Python state-space filter defines conventional Kalman filtering together with configurable inversion, stability, timing, and memory modes.",
      "The implementation explicitly tracks predicted and filtered state means/covariances, forecast-error covariance, and Kalman gain outputs used by the recursive estimator.",
      "This executable record demonstrates a mature state-space implementation; the separate Kalman 1960 Reference remains the primary method source.",
    ],
    sourcePaths: [
      { label: "KalmanFilter state-space implementation", url: "https://github.com/statsmodels/statsmodels/blob/cc001c25997351ecbd0b04d2968a08106a04a71f/statsmodels/tsa/statespace/kalman_filter.py" },
      { label: "Repository license", url: "https://github.com/statsmodels/statsmodels/blob/cc001c25997351ecbd0b04d2968a08106a04a71f/LICENSE.txt" },
    ],
    verifiedRef: "main",
    verifiedCommit: "cc001c25997351ecbd0b04d2968a08106a04a71f",
    lastVerified: "2026-10-03",
  },
  {
    id: "diffprivlib-laplace",
    name: "IBM diffprivlib Laplace mechanism",
    repository: "https://github.com/IBM/differential-privacy-library",
    homepage: "https://diffprivlib.readthedocs.io/",
    algorithmIds: ["differential-privacy"],
    language: "Python",
    interfaces: ["Python API", "diffprivlib.mechanisms.Laplace"],
    license: "MIT",
    maturity: "Established open-source",
    summary: "IBM diffprivlib provides an executable classical Laplace mechanism and related bounded/truncated variants for differential-privacy workflows.",
    implementationNotes: [
      "The inspected Laplace mechanism accepts epsilon, delta, and sensitivity explicitly and derives the randomization scale from those privacy/sensitivity parameters.",
      "The source directly cites the Dwork–McSherry–Nissim–Smith sensitivity-calibration work curated separately as the archive's primary differential-privacy reference.",
      "The implementation uses a multi-uniform Laplace sampler intended to reduce floating-point reconstruction risks; that implementation detail is evidence about this library, not part of the archive's generic Laplace-mechanism claim.",
    ],
    sourcePaths: [
      { label: "Laplace mechanism implementation", url: "https://github.com/IBM/differential-privacy-library/blob/f9a37dd74b18108d46a421e66321635a3d774eab/diffprivlib/mechanisms/laplace.py" },
      { label: "Repository license", url: "https://github.com/IBM/differential-privacy-library/blob/f9a37dd74b18108d46a421e66321635a3d774eab/LICENSE.md" },
    ],
    verifiedRef: "main",
    verifiedCommit: "f9a37dd74b18108d46a421e66321635a3d774eab",
    lastVerified: "2026-10-03",
  },
  {
    id: "qiskit-qft",
    name: "Qiskit Quantum Fourier Transform",
    repository: "https://github.com/Qiskit/qiskit",
    homepage: "https://www.ibm.com/quantum/qiskit",
    algorithmIds: ["quantum-fourier-transform"],
    language: "Python",
    interfaces: ["Python SDK", "QFTGate", "synth_qft_full"],
    license: "Apache-2.0",
    maturity: "Established open-source",
    summary: "Qiskit's circuit library provides a Quantum Fourier Transform gate/circuit together with exact, inverse, and approximate synthesis controls.",
    implementationNotes: [
      "The inspected source defines the QFT unitary, QFTGate, inverse-QFT behavior, and synthesis through Hadamard/controlled-phase/swap structure.",
      "Approximate QFT support drops the smallest controlled-phase rotations through an explicit approximation degree, making the implementation useful for studying depth/accuracy tradeoffs.",
      "The legacy QFT BlueprintCircuit class is marked for Qiskit 3.0 removal in favor of QFTGate or synth_qft_full, so this record points to the source that exposes both the deprecated wrapper and the retained gate/synthesis direction rather than presenting the deprecated class as the long-term API.",
    ],
    sourcePaths: [
      { label: "QFT circuit and QFTGate", url: "https://github.com/Qiskit/qiskit/blob/a1c2c2e796ff265c59a916c49d09942b27eb0e28/qiskit/circuit/library/basis_change/qft.py" },
    ],
    verifiedRef: "main",
    verifiedCommit: "a1c2c2e796ff265c59a916c49d09942b27eb0e28",
    lastVerified: "2026-10-03",
  },
];
