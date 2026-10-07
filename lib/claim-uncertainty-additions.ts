import type { ClaimRecord } from "./claims-base.ts";

/** Uncertainty-comparison Claims kept modular from the historical Claim catalog. */
export const uncertaintyClaimAdditions: ClaimRecord[] = [
  {
    id: "conformal-vs-bayesian-ridge-efficiency",
    kind: "Guarantee",
    statement: "For ridge-regression prediction under standard Bayesian assumptions, conformalized prediction sets provide a calibration-based alternative whose asymptotic efficiency can approach that of standard Bayesian prediction intervals.",
    algorithmIds: ["conformal-prediction", "bayesian-inference"],
    chapterSlug: "14-uncertainty-causal-active-continual-meta-learning",
    passageContains: "In Bayesian ridge-regression settings, conformalized prediction sets can provide a calibration-based alternative whose asymptotic efficiency approaches standard Bayesian prediction intervals when the Bayesian assumptions hold.",
    referenceIds: ["burnaev-2014-conformalized-ridge-efficiency"],
    note: "This is a setting-specific asymptotic efficiency statement, not a universal ranking of conformal and Bayesian uncertainty. Finite-sample set size, coverage behavior, misspecification, exchangeability, model class, and computational cost can differ materially.",
  },
];
