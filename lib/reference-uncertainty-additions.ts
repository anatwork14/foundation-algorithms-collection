import type { ReferenceEntity } from "./references-core.ts";

/** Uncertainty/inference comparison references kept modular from the historical catalog. */
export const uncertaintyReferenceAdditions: ReferenceEntity[] = [
  {
    id: "burnaev-2014-conformalized-ridge-efficiency",
    title: "Efficiency of conformalized ridge regression",
    authors: ["Evgeny Burnaev", "Vladimir Vovk"],
    year: 2014,
    kind: "Paper",
    evidenceRole: "Replication / evaluation",
    venue: "COLT 2014, PMLR 35",
    url: "https://proceedings.mlr.press/v35/burnaev14.html",
    algorithmIds: ["conformal-prediction", "bayesian-inference"],
    combinationIds: [],
    chapterSlugs: ["14-uncertainty-causal-active-continual-meta-learning"],
    citations: [],
    notices: [],
    summary: "Analyzes conformalized ridge-regression prediction sets against standard Bayesian ridge-regression prediction intervals, with particular attention to efficiency when the Bayesian model assumptions hold.",
    significance: "Direct comparative support for treating conformal prediction as an alternative uncertainty-quantification route to Bayesian prediction intervals in a specific regression setting, while showing that their asymptotic efficiency can become close under compatible Bayesian assumptions.",
    tags: ["conformal-prediction", "bayesian-inference", "ridge-regression", "prediction-interval", "efficiency", "uncertainty"],
  },
];
