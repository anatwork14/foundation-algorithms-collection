import type { ReferenceEntity } from "./references-core.ts";

/** Coding/inference references kept modular from the historical catalog. */
export const codingReferenceAdditions: ReferenceEntity[] = [
  {
    id: "olding-2014-bayesian-error-correction",
    title: "Applying Bayesian networks and belief propagation to error correction coding",
    authors: ["Willem Clifford Olding", "Jan Olivier", "Brian Salmon"],
    year: 2014,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "ANZIAM Journal 55",
    url: "https://journal.austms.org.au/ojs/index.php/anziamj/article/view/7817",
    doi: "10.21914/anziamj.v55i0.7817",
    algorithmIds: ["error-correcting-codes", "bayesian-inference"],
    combinationIds: [],
    chapterSlugs: ["24-quantum-error-correction-decoding"],
    citations: [],
    notices: [],
    summary: "Investigates Bayesian-network and belief-propagation decoding as a general probabilistic decoder for major algebraic error-correcting-code families.",
    significance: "Direct support for the archive's coding-to-Bayesian-inference relation: decoding is represented as probabilistic inference over hidden transmitted/error variables conditioned on observed channel evidence rather than as a purely algebraic hard-decision procedure.",
    tags: ["error-correcting-codes", "bayesian-inference", "bayesian-network", "belief-propagation", "decoding", "posterior"],
  },
];
