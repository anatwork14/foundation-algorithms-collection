import type { AlgorithmEntity } from "./algorithms.ts";

/**
 * Additional classical foundation entities promoted from long-form chapters into
 * the first-class algorithm index as evidence coverage expands.
 */
export const foundationAlgorithmAdditions: AlgorithmEntity[] = [
  {
    id: "kalman-filter",
    name: "Kalman Filter",
    aliases: ["Kalman filtering", "Linear Gaussian state estimator"],
    fields: ["Foundations", "AI / ML"],
    families: ["State estimation", "Probabilistic inference", "Control"],
    chapterSlugs: ["05-probabilistic-control-reinforcement-learning"],
    summary: "Recursive state estimator for linear dynamical systems with Gaussian process and observation noise, represented by a mean and covariance.",
    motivation: "Sequential systems need to combine an uncertain dynamics model with noisy measurements without re-solving the full inference problem from scratch after every observation.",
    contribution: "The Kalman filter provides an efficient predict-correct recursion that propagates a Gaussian state belief through linear dynamics and then conditions that belief on each new measurement.",
    assumptions: [
      "State dynamics and observation models are linear in the classical formulation",
      "Process and measurement noise are modeled as Gaussian with specified covariance",
      "The state uncertainty is adequately summarized by a mean and covariance",
    ],
    complexity: {
      note: "Per-step cost is dominated by matrix multiplications and the innovation-covariance solve/inversion; exact complexity depends on state and observation dimensions.",
    },
    maturity: "Production-proven",
    implementation: [
      "Maintain state mean and covariance rather than a full trajectory posterior",
      "Run a prediction step using the transition model and process-noise covariance",
      "Compute innovation and Kalman gain from the observation model and measurement covariance",
      "Apply the measurement correction and update covariance with numerically stable linear algebra",
    ],
    failureModes: [
      "Strongly nonlinear dynamics or observations can make the linear-Gaussian approximation poor",
      "Misspecified process or measurement covariance produces overconfident or noisy estimates",
      "Poor conditioning or naive covariance updates can create numerical instability",
      "Unmodeled bias and nonstationary sensor behavior can accumulate systematic estimation error",
    ],
    relations: [],
    tags: ["kalman", "state-estimation", "filtering", "gaussian", "control"],
    openQuestions: [
      "How should learned dynamics and uncertainty estimators be combined with Kalman-style structure without losing calibration or stability?",
      "Which robust filtering variants best preserve useful uncertainty under heavy-tailed noise and abrupt model mismatch?",
    ],
  },
];
