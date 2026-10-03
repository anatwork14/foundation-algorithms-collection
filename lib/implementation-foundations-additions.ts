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
];
