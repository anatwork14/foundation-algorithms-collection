import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification snapshots for conformal-prediction implementations. */
export const conformalImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "mapie-conformalized-quantile-regression",
    revision: 1,
    verifiedAt: "2026-10-04",
    verifiedRef: "master",
    verifiedCommit: "3b84b8212db2bba452ef5a09ae06a0dd545869ae",
    sourcePaths: [
      { label: "MAPIE scope and conformal-prediction interfaces", url: "https://github.com/scikit-learn-contrib/MAPIE/blob/3b84b8212db2bba452ef5a09ae06a0dd545869ae/README.md" },
      { label: "Conformalized Quantile Regression implementation", url: "https://github.com/scikit-learn-contrib/MAPIE/blob/3b84b8212db2bba452ef5a09ae06a0dd545869ae/mapie/regression/quantile_regression.py" },
      { label: "Repository license", url: "https://github.com/scikit-learn-contrib/MAPIE/blob/3b84b8212db2bba452ef5a09ae06a0dd545869ae/LICENSE" },
    ],
    note: "Initial MAPIE CQR evidence snapshot. The pinned README identifies MAPIE as a conformal-prediction and distribution-free-inference library. quantile_regression.py exposes ConformalizedQuantileRegressor with distinct fitting, held-out conformalization, conformity-score calibration, and prediction-interval stages. This snapshot documents the executable CQR path while keeping Romano, Patterson, and Candès 2019 as the theoretical authority; it does not treat implementation behavior as proof of finite-sample coverage, infer conditional coverage, or claim robustness under distribution shift. LICENSE records BSD-3-Clause terms.",
  },
];
