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
];
