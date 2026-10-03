import type { ImplementationVerificationEntry } from "./implementation-verification-history.ts";

/** Append-only verification entries for foundational-algorithm implementations
 * added after the historical implementation registry was established. */
export const foundationsImplementationVerificationAdditions: ImplementationVerificationEntry[] = [
  {
    implementationId: "networkx-shortest-path-search",
    revision: 1,
    verifiedAt: "2026-10-02",
    verifiedRef: "main",
    verifiedCommit: "31b74e96903d7f873b30c8ff36d71a4c9252b107",
    sourcePaths: [
      { label: "A* implementation", url: "https://github.com/networkx/networkx/blob/31b74e96903d7f873b30c8ff36d71a4c9252b107/networkx/algorithms/shortest_paths/astar.py" },
      { label: "Dijkstra implementation", url: "https://github.com/networkx/networkx/blob/31b74e96903d7f873b30c8ff36d71a4c9252b107/networkx/algorithms/shortest_paths/weighted.py" },
    ],
    note: "Initial NetworkX shortest-path evidence snapshot. Direct inspection confirms A* priority-queue search with h=0 explicitly reducing to Dijkstra behavior, plus the weighted shortest-path Dijkstra implementation at this immutable main-branch revision.",
  },
  {
    implementationId: "statsmodels-kalman-filter",
    revision: 1,
    verifiedAt: "2026-10-03",
    verifiedRef: "main",
    verifiedCommit: "cc001c25997351ecbd0b04d2968a08106a04a71f",
    sourcePaths: [
      { label: "KalmanFilter state-space implementation", url: "https://github.com/statsmodels/statsmodels/blob/cc001c25997351ecbd0b04d2968a08106a04a71f/statsmodels/tsa/statespace/kalman_filter.py" },
      { label: "Repository license", url: "https://github.com/statsmodels/statsmodels/blob/cc001c25997351ecbd0b04d2968a08106a04a71f/LICENSE.txt" },
    ],
    note: "Initial statsmodels Kalman-filter evidence snapshot. Direct inspection confirms the state-space KalmanFilter class, conventional filtering option, configurable inversion/stability/timing/memory controls, and recursive filtered/predicted state covariance outputs at this immutable main-branch revision; the repository LICENSE.txt provides the BSD-style redistribution terms recorded by the registry.",
  },
  {
    implementationId: "diffprivlib-laplace",
    revision: 1,
    verifiedAt: "2026-10-03",
    verifiedRef: "main",
    verifiedCommit: "f9a37dd74b18108d46a421e66321635a3d774eab",
    sourcePaths: [
      { label: "Laplace mechanism implementation", url: "https://github.com/IBM/differential-privacy-library/blob/f9a37dd74b18108d46a421e66321635a3d774eab/diffprivlib/mechanisms/laplace.py" },
      { label: "Repository license", url: "https://github.com/IBM/differential-privacy-library/blob/f9a37dd74b18108d46a421e66321635a3d774eab/LICENSE.md" },
    ],
    note: "Initial IBM diffprivlib Laplace-mechanism evidence snapshot. Direct inspection confirms explicit epsilon/delta/sensitivity parameters, sensitivity-calibrated Laplace randomization, and the source's citation of the Dwork–McSherry–Nissim–Smith mechanism at this immutable main-branch revision. The repository LICENSE.md records MIT licensing.",
  },
];
