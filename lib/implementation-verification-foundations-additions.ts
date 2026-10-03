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
  {
    implementationId: "qiskit-qft",
    revision: 1,
    verifiedAt: "2026-10-03",
    verifiedRef: "main",
    verifiedCommit: "a1c2c2e796ff265c59a916c49d09942b27eb0e28",
    sourcePaths: [
      { label: "QFT circuit and QFTGate", url: "https://github.com/Qiskit/qiskit/blob/a1c2c2e796ff265c59a916c49d09942b27eb0e28/qiskit/circuit/library/basis_change/qft.py" },
    ],
    note: "Initial Qiskit QFT evidence snapshot. Direct inspection confirms QFTGate, inverse-QFT behavior, synthesis through qiskit.synthesis.qft.synth_qft_full, and configurable approximate-QFT rotation dropping at the same immutable Qiskit revision already used by the archive's phase-estimation implementation record. The older QFT BlueprintCircuit wrapper is explicitly deprecated, so the registry records the retained gate/synthesis direction rather than treating that wrapper as the future API.",
  },
  {
    implementationId: "botorch-bayesian-optimization",
    revision: 1,
    verifiedAt: "2026-10-03",
    verifiedRef: "main",
    verifiedCommit: "bda063ae5c6d2bbe058a7d1566818ae2e14a673e",
    sourcePaths: [
      { label: "Analytic acquisition functions", url: "https://github.com/meta-pytorch/botorch/blob/bda063ae5c6d2bbe058a7d1566818ae2e14a673e/botorch/acquisition/analytic.py" },
      { label: "Repository license", url: "https://github.com/meta-pytorch/botorch/blob/bda063ae5c6d2bbe058a7d1566818ae2e14a673e/LICENSE" },
    ],
    note: "Initial BoTorch Bayesian-optimization evidence snapshot. Direct inspection confirms posterior-based analytic Probability of Improvement, Expected Improvement, and Log Expected Improvement acquisition functions at this immutable main-branch revision. The repository LICENSE records MIT terms; the archive keeps Jones–Schonlau–Welch 1998 as the method-authority Reference rather than treating library code as the theoretical source.",
  },
  {
    implementationId: "pymatching-surface-code-decoder",
    revision: 1,
    verifiedAt: "2026-10-03",
    verifiedRef: "master",
    verifiedCommit: "6f63b2b9474ba0fa7e511fe52bffdce858a06984",
    sourcePaths: [
      { label: "Matching Python API", url: "https://github.com/oscarhiggott/PyMatching/blob/6f63b2b9474ba0fa7e511fe52bffdce858a06984/src/pymatching/matching.py" },
      { label: "Sparse-blossom MWPM decoder", url: "https://github.com/oscarhiggott/PyMatching/blob/6f63b2b9474ba0fa7e511fe52bffdce858a06984/src/pymatching/sparse_blossom/driver/mwpm_decoding.cc" },
      { label: "Surface-code benchmarks", url: "https://github.com/oscarhiggott/PyMatching/blob/6f63b2b9474ba0fa7e511fe52bffdce858a06984/benchmarks/surface_codes/README.md" },
      { label: "Repository license", url: "https://github.com/oscarhiggott/PyMatching/blob/6f63b2b9474ba0fa7e511fe52bffdce858a06984/LICENSE" },
    ],
    note: "Initial PyMatching surface-code decoding evidence snapshot. Direct inspection confirms the Matching API's minimum-weight-perfect-matching decoder, repeated-measurement/timelike-edge controls, Stim detector-error-model support, the sparse-blossom C++ decoding driver, and committed surface-code benchmark assets at this immutable master-branch revision. The repository LICENSE records Apache-2.0 terms.",
  },
];
