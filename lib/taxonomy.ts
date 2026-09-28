export type ResearchField =
  | "Foundations"
  | "AI / ML"
  | "Quantum"
  | "Cybersecurity"
  | "Cross-field";

export const fields: Array<{
  name: ResearchField;
  short: string;
  description: string;
}> = [
  {
    name: "Foundations",
    short: "Core",
    description: "Search, optimization, graphs, systems, probability, control, representation, and online decisions.",
  },
  {
    name: "AI / ML",
    short: "AI",
    description: "Learning theory, neural architectures, generative models, reasoning, uncertainty, causality, and adaptation.",
  },
  {
    name: "Quantum",
    short: "Quantum",
    description: "Quantum primitives, search, phase estimation, QSVT, variational methods, QEC, and fault tolerance.",
  },
  {
    name: "Cybersecurity",
    short: "Security",
    description: "Cryptography, post-quantum security, ZK, private computation, program analysis, and cryptanalysis.",
  },
  {
    name: "Cross-field",
    short: "Synthesis",
    description: "Combination maps, research hypotheses, hybrid architectures, and an emerging-algorithm watchlist.",
  },
];

export function fieldForSlug(slug: string): ResearchField {
  const prefix = Number.parseInt(slug.slice(0, 2), 10);
  if (prefix >= 40) return "Cross-field";
  if (prefix >= 30) return "Cybersecurity";
  if (prefix >= 20) return "Quantum";
  if (prefix >= 10) return "AI / ML";
  return "Foundations";
}

export function fieldKey(field: ResearchField) {
  switch (field) {
    case "AI / ML":
      return "ai";
    case "Quantum":
      return "quantum";
    case "Cybersecurity":
      return "security";
    case "Cross-field":
      return "cross";
    default:
      return "foundation";
  }
}

export const inspirationThreads = [
  {
    kicker: "Adaptive security",
    title: "Contextual bandits × coverage-guided fuzzing",
    description:
      "Treat mutation strategies as actions, program state as context, and newly discovered coverage or bugs as reward.",
    href: "/archive/40-ai-quantum-cybersecurity-combination-map",
    fields: ["AI / ML", "Cybersecurity"],
  },
  {
    kicker: "Fault-tolerant intelligence",
    title: "Graph learning × quantum error decoding",
    description:
      "Represent syndrome structure as a graph, learn priors from hardware telemetry, then retain an exact or constrained decoder as the safety boundary.",
    href: "/archive/24-quantum-error-correction-decoding",
    fields: ["AI / ML", "Quantum"],
  },
  {
    kicker: "Verifiable agents",
    title: "LLM planning × SMT × proof-carrying execution",
    description:
      "Use learned models for proposal and decomposition while formal solvers verify constraints before high-impact actions execute.",
    href: "/archive/40-ai-quantum-cybersecurity-combination-map",
    fields: ["AI / ML", "Cybersecurity"],
  },
  {
    kicker: "Private learning",
    title: "Federated learning × secure aggregation × differential privacy",
    description:
      "Combine decentralized optimization with cryptographic aggregation and explicit privacy accounting for distributed learning systems.",
    href: "/archive/33-mpc-homomorphic-encryption-differential-privacy",
    fields: ["AI / ML", "Cybersecurity"],
  },
  {
    kicker: "Adaptive quantum systems",
    title: "Bayesian optimization × hardware calibration × QEC",
    description:
      "Close the loop between noisy device telemetry, calibration experiments, decoder performance, and resource-aware control.",
    href: "/archive/25-fault-tolerance-error-mitigation-compilation",
    fields: ["AI / ML", "Quantum"],
  },
  {
    kicker: "Migration intelligence",
    title: "Dependency graphs × PQC migration planning",
    description:
      "Model cryptographic dependencies as a graph, identify high-risk cut points, and optimize migration order under compatibility constraints.",
    href: "/archive/31-post-quantum-cryptography",
    fields: ["Foundations", "Cybersecurity"],
  },
];
