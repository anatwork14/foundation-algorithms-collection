import type { ReferenceEntity } from "./references-core.ts";

/** Search/planning references kept modular from the historical catalog. */
export const searchReferenceAdditions: ReferenceEntity[] = [
  {
    id: "kirilenko-2023-transpath",
    title: "TransPath: Learning Heuristics for Grid-Based Pathfinding via Transformers",
    authors: ["Daniil Kirilenko", "Anton Andreychuk", "Aleksandr Panov", "Konstantin Yakovlev"],
    year: 2023,
    kind: "Paper",
    evidenceRole: "Primary extension",
    venue: "AAAI 2023",
    url: "https://doi.org/10.1609/aaai.v37i10.26465",
    doi: "10.1609/aaai.v37i10.26465",
    algorithmIds: ["a-star", "learned-heuristics", "transformer-attention"],
    combinationIds: [],
    chapterSlugs: [
      "02-search-graphs-ordering-indexing",
      "11-neural-architectures-attention-ssm-moe-gnn",
      "13-ai-reasoning-alignment-agents",
    ],
    citations: [
      {
        targetId: "hart-1968-a-star",
        note: "Kirilenko et al. formulate their learned heuristic proxies explicitly around A* and cite Hart, Nilsson, and Raphael while measuring search-effort and solution-cost effects.",
        verificationUrl: "https://ojs.aaai.org/index.php/AAAI/article/download/26465/26237",
        verifiedAt: "2026-10-07",
      },
      {
        targetId: "vaswani-2017-attention",
        note: "The TransPath neural architecture contains Transformer attention blocks and explicitly cites Vaswani et al. for the self-attention mechanism used to model global relations in grid features.",
        verificationUrl: "https://ojs.aaai.org/index.php/AAAI/article/download/26465/26237",
        verifiedAt: "2026-10-07",
      },
    ],
    notices: [],
    summary: "Learns instance-dependent correction-factor and path-probability heuristic proxies with a convolutional encoder/decoder containing Transformer attention blocks, then uses those predictions to guide A* or Focal Search on grid pathfinding tasks.",
    significance: "Direct primary-extension evidence for combining Transformer models with explicit heuristic search: learned attention-based predictors supply search guidance while A*/Focal Search retains the outer state-expansion procedure and its own guarantee conditions.",
    tags: ["a-star", "learned-heuristic", "transformer", "pathfinding", "focal-search", "planning"],
  },
];
