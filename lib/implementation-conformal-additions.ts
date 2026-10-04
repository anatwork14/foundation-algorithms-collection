import type { ImplementationRecord } from "./implementations.ts";

/** Executable conformal-prediction evidence kept modular from the historical
 * registry so new records retain explicit scope and immutable provenance. */
export const conformalImplementationAdditions: ImplementationRecord[] = [
  {
    id: "mapie-conformalized-quantile-regression",
    name: "MAPIE Conformalized Quantile Regression",
    repository: "https://github.com/scikit-learn-contrib/MAPIE",
    homepage: "https://mapie.readthedocs.io/",
    algorithmIds: ["conformal-prediction"],
    language: "Python",
    interfaces: ["Python API", "ConformalizedQuantileRegressor", "conformalize", "predict_interval"],
    license: "BSD-3-Clause",
    maturity: "Established open-source",
    summary: "MAPIE provides an executable Conformalized Quantile Regression workflow that fits quantile models, calibrates conformity information on held-out data, and returns corrected prediction intervals.",
    implementationNotes: [
      "The pinned README identifies MAPIE as a conformal-prediction and distribution-free-inference library and explicitly lists prediction intervals and prediction sets built from a conformalization dataset; this record narrows that broader package to its Conformalized Quantile Regression path.",
      "In quantile_regression.py, ConformalizedQuantileRegressor fits lower and upper quantile estimators, stores conformity scores during conformalization, and exposes predict_interval for the calibrated interval output. The fit, conformalize, and prediction stages remain distinct in the current API.",
      "Romano, Patterson, and Candès 2019 remains the archive's theoretical authority for CQR. This implementation record is executable evidence only and does not treat package behavior, examples, or tests as a proof of the finite-sample coverage guarantee.",
      "The archive's conformal Claim remains conditional on exchangeability and explicitly does not infer conditional coverage or robustness under distribution shift from this implementation. MAPIE also contains other conformal, conditional, adaptive, and risk-control methods that are outside this CQR-specific snapshot.",
    ],
    sourcePaths: [
      { label: "MAPIE scope and conformal-prediction interfaces", url: "https://github.com/scikit-learn-contrib/MAPIE/blob/3b84b8212db2bba452ef5a09ae06a0dd545869ae/README.md" },
      { label: "Conformalized Quantile Regression implementation", url: "https://github.com/scikit-learn-contrib/MAPIE/blob/3b84b8212db2bba452ef5a09ae06a0dd545869ae/mapie/regression/quantile_regression.py" },
      { label: "Repository license", url: "https://github.com/scikit-learn-contrib/MAPIE/blob/3b84b8212db2bba452ef5a09ae06a0dd545869ae/LICENSE" },
    ],
    verifiedRef: "master",
    verifiedCommit: "3b84b8212db2bba452ef5a09ae06a0dd545869ae",
    lastVerified: "2026-10-04",
  },
];
