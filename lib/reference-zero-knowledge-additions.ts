import type { ReferenceEntity } from "./references-core.ts";

/** Foundational primary sources for zero-knowledge proof systems. */
export const zeroKnowledgeReferenceAdditions: ReferenceEntity[] = [
  {
    id: "goldwasser-micali-rackoff-1989-knowledge-complexity",
    title: "The Knowledge Complexity of Interactive Proof Systems",
    authors: ["Shafi Goldwasser", "Silvio Micali", "Charles Rackoff"],
    year: 1989,
    kind: "Paper",
    evidenceRole: "Primary method",
    venue: "SIAM Journal on Computing 18(1)",
    url: "https://doi.org/10.1137/0218012",
    doi: "10.1137/0218012",
    algorithmIds: ["zero-knowledge-proofs"],
    combinationIds: [],
    chapterSlugs: ["32-zero-knowledge-verifiable-computation"],
    citations: [],
    notices: [],
    summary: "Develops knowledge complexity for interactive proof systems, formally defines zero-knowledge proofs as revealing no additional knowledge beyond proposition correctness, and gives foundational examples.",
    significance: "Foundational primary source for the zero-knowledge notion represented by the archive, providing the formal disclosure boundary that later proof systems and cryptographic protocol compositions build on.",
    tags: ["zero-knowledge", "interactive-proofs", "knowledge-complexity", "cryptographic-proofs"],
  },
];
