export type AssumptionTension = {
  id: string;
  label: string;
  leftEvidence: string;
  rightEvidence: string;
};

export type AssumptionCompatibility = {
  sharedConcepts: string[];
  tensions: AssumptionTension[];
};

type Pattern = RegExp;

type ConceptRule = {
  label: string;
  patterns: Pattern[];
};

type TensionRule = {
  id: string;
  label: string;
  a: Pattern[];
  b: Pattern[];
};

const concepts: ConceptRule[] = [
  { label: "stationarity", patterns: [/stationar/i, /drift/i, /changing distribution/i] },
  { label: "noise", patterns: [/noise/i, /error model/i] },
  { label: "uncertainty", patterns: [/uncert/i, /confidence/i, /posterior/i] },
  { label: "linearity", patterns: [/linear/i] },
  { label: "convexity", patterns: [/convex/i] },
  { label: "observability", patterns: [/observ/i, /hidden state/i] },
  { label: "trust/adversary", patterns: [/trust/i, /adversar/i, /malicious/i] },
  { label: "privacy/data access", patterns: [/plaintext/i, /private/i, /encrypted/i, /secret[- ]shar/i, /sensitive data/i] },
  { label: "feedback", patterns: [/feedback/i, /reward/i, /outcome/i] },
  { label: "constraints", patterns: [/constraint/i, /feasible/i, /bound/i] },
  { label: "distribution", patterns: [/distribution/i, /iid/i, /independent/i, /correlated/i] },
  { label: "model knowledge", patterns: [/known model/i, /transition model/i, /model[- ]free/i, /unknown model/i] },
  { label: "synchrony", patterns: [/synchron/i, /asynchron/i] },
  { label: "differentiability", patterns: [/differentiab/i, /non[- ]differentiab/i] },
];

const tensions: TensionRule[] = [
  {
    id: "stationary-vs-drift",
    label: "Stationary assumptions vs. changing/drifting environment",
    a: [/(?<!non-)(?<!non )\bstationary\b/i, /(?<!non-)(?<!non )stationary distribution/i, /(?<!non-)(?<!non )stationary reward/i],
    b: [/non[- ]?stationary/i, /concept drift/i, /distribution drift/i, /changing distribution/i, /changing reward/i],
  },
  {
    id: "independent-vs-correlated",
    label: "Independent-error/data assumptions vs. correlated structure",
    a: [/\bindependent\b/i, /\biid\b/i, /i\.i\.d\./i],
    b: [/correlated/i, /dependent noise/i, /correlated error/i],
  },
  {
    id: "full-vs-partial-observation",
    label: "Full observability vs. partial/hidden state",
    a: [/fully observable/i, /complete state/i, /full state/i],
    b: [/partially observable/i, /partial observation/i, /hidden state/i],
  },
  {
    id: "linear-vs-nonlinear",
    label: "Linear-model requirement vs. explicitly nonlinear structure",
    a: [/approximately linear/i, /(?<!non-)(?<!non )\blinear reward\b/i, /(?<!non-)(?<!non )\blinear model\b/i, /linearity assumption/i],
    b: [/non[- ]?linear/i, /strongly nonlinear/i],
  },
  {
    id: "convex-vs-nonconvex",
    label: "Convexity requirement vs. non-convex objective",
    a: [/(?<!non-)(?<!non )\bconvex\b/i, /(?<!non-)(?<!non )convex objective/i, /(?<!non-)(?<!non )convex loss/i],
    b: [/non[- ]?convex/i, /nonconvex/i],
  },
  {
    id: "trusted-vs-adversarial",
    label: "Trusted-participant/environment assumptions vs. adversarial behavior",
    a: [/\btrusted\b/i, /honest participant/i, /honest server/i],
    b: [/\buntrusted\b/i, /adversarial/i, /malicious/i, /byzantine/i],
  },
  {
    id: "plaintext-vs-private",
    label: "Plaintext/raw-data access vs. privacy-preserving data constraints",
    a: [/plaintext access/i, /raw data available/i, /centralized raw data/i],
    b: [/cannot be pooled in plaintext/i, /encrypted data/i, /secret[- ]shared/i, /private data cannot/i],
  },
  {
    id: "sync-vs-async",
    label: "Synchronous coordination vs. asynchronous operation",
    a: [/\bsynchronous\b/i, /synchronized rounds/i],
    b: [/\basynchronous\b/i, /unbounded delay/i],
  },
  {
    id: "known-vs-unknown-model",
    label: "Known-model requirement vs. model-free/unknown dynamics",
    a: [/\bknown transition/i, /\bknown model/i, /model is known/i],
    b: [/\bunknown transition/i, /\bunknown model/i, /model[- ]free/i],
  },
];

function firstMatch(assumptions: string[], patterns: Pattern[]) {
  return assumptions.find((assumption) => patterns.some((pattern) => pattern.test(assumption))) ?? null;
}

function hasConcept(assumptions: string[], rule: ConceptRule) {
  return assumptions.some((assumption) => rule.patterns.some((pattern) => pattern.test(assumption)));
}

export function analyzeAssumptionCompatibility(leftAssumptions: string[], rightAssumptions: string[]): AssumptionCompatibility {
  const sharedConcepts = concepts
    .filter((rule) => hasConcept(leftAssumptions, rule) && hasConcept(rightAssumptions, rule))
    .map((rule) => rule.label);

  const foundTensions: AssumptionTension[] = [];

  for (const rule of tensions) {
    const leftA = firstMatch(leftAssumptions, rule.a);
    const leftB = firstMatch(leftAssumptions, rule.b);
    const rightA = firstMatch(rightAssumptions, rule.a);
    const rightB = firstMatch(rightAssumptions, rule.b);

    if (leftA && rightB) {
      foundTensions.push({ id: rule.id, label: rule.label, leftEvidence: leftA, rightEvidence: rightB });
    } else if (leftB && rightA) {
      foundTensions.push({ id: rule.id, label: rule.label, leftEvidence: leftB, rightEvidence: rightA });
    }
  }

  return { sharedConcepts, tensions: foundTensions };
}
