import type { ReferenceEntity } from "@/lib/references-core";

/** Foundational computer-science additions kept separate so domain evidence
 * can expand without repeatedly rewriting the historical core catalog. */
export const foundationsReferenceAdditions: ReferenceEntity[] = [
  {
    id: "dijkstra-1959-shortest-path",
    title: "A note on two problems in connexion with graphs",
    authors: ["E. W. Dijkstra"],
    year: 1959,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "Numerische Mathematik 1",
    url: "https://doi.org/10.1007/BF01386390",
    doi: "10.1007/BF01386390",
    algorithmIds: ["dijkstra"],
    combinationIds: [],
    chapterSlugs: ["02-search-graphs-ordering-indexing"],
    citations: [],
    notices: [],
    summary: "The original short paper presenting the shortest-path method now known as Dijkstra's algorithm, alongside a minimum-spanning-tree problem.",
    significance: "Primary historical source for the archive's Dijkstra shortest-path entity and its nonnegative-cost greedy shortest-path lineage.",
    tags: ["dijkstra", "shortest-path", "graph-search", "foundations"],
  },
  {
    id: "hart-1968-a-star",
    title: "A Formal Basis for the Heuristic Determination of Minimum Cost Paths",
    authors: ["Peter E. Hart", "Nils J. Nilsson", "Bertram Raphael"],
    year: 1968,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "IEEE Transactions on Systems Science and Cybernetics 4(2)",
    url: "https://doi.org/10.1109/TSSC.1968.300136",
    doi: "10.1109/TSSC.1968.300136",
    algorithmIds: ["a-star"],
    combinationIds: [],
    chapterSlugs: ["02-search-graphs-ordering-indexing"],
    citations: [],
    notices: [],
    summary: "Formalizes heuristic minimum-cost path search using an evaluation function that combines path information with heuristic estimates of remaining cost.",
    significance: "Primary historical source for the A* heuristic-search framework represented in the archive.",
    tags: ["a-star", "heuristic-search", "shortest-path", "foundations"],
  },
];
