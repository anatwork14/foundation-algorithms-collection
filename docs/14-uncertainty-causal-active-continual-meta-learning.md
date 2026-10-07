# 14 — Uncertainty, Causal Inference, Active Learning, Continual Learning, Meta-Learning, and Distribution Shift

Modern AI systems increasingly operate under conditions where the training distribution is incomplete, changing, strategically selected, or causally misleading. This chapter focuses on algorithms for **knowing what is unknown, deciding what information to acquire, distinguishing correlation from intervention, adapting over time, and learning how to learn**.

## 1. Types of uncertainty

A useful first distinction is:

### Aleatoric uncertainty

Irreducible uncertainty in the data-generating process.

Example: noisy sensor measurements or inherently stochastic outcomes.

### Epistemic uncertainty

Uncertainty caused by limited knowledge, limited data, or uncertain parameters.

Epistemic uncertainty can often be reduced by collecting informative observations.

### Model uncertainty

The hypothesis class itself may omit important structure.

### Distributional uncertainty

Deployment inputs may come from a different distribution than training data.

These categories matter because different algorithms address different uncertainty sources.

## 2. Bayesian decision theory

A rational decision under uncertainty minimizes expected loss:

\[
a^*=\arg\min_a \mathbb E_{\theta\sim p(\theta|D)}[L(a,\theta)].
\]

### Contribution

Prediction uncertainty becomes decision-relevant rather than an auxiliary confidence score.

This foundation connects:

- Bayesian inference;
- contextual bandits;
- active learning;
- Bayesian optimization;
- experimental design;
- safe control.

## 3. Deep Ensembles

Train multiple models independently and aggregate predictions.

### Motivation

Different training runs can converge to different plausible functions.

### Contribution

Variation across models provides a practical proxy for epistemic uncertainty.

### Limitations

- expensive training/inference;
- members may still be highly correlated;
- no universal calibration guarantee;
- ensemble diversity depends on data and optimization choices.

## 4. Monte Carlo Dropout

Keep dropout active at inference and sample multiple predictions.

This can be interpreted as an approximate Bayesian method under particular assumptions.

Practical value: cheap uncertainty proxy for models already trained with dropout.

## 5. Evidential and Distributional Prediction

Instead of predicting a point probability, predict parameters of a distribution over distributions or outcome distributions directly.

Examples:

- Dirichlet evidential classification;
- heteroscedastic regression predicting mean and variance;
- quantile regression;
- distributional RL.

The central caution is calibration: a richer output parameterization does not automatically produce trustworthy uncertainty.

## 6. Conformal Prediction

Conformal methods create prediction sets with finite-sample marginal coverage under exchangeability.

In Bayesian ridge-regression settings, conformalized prediction sets can provide a calibration-based alternative whose asymptotic efficiency approaches standard Bayesian prediction intervals when the Bayesian assumptions hold.

For calibration scores \(s_i\), choose a quantile \(q\) and return a set:

\[
C(x)=\{y:s(x,y)\le q\}.
\]

### Contribution

Provides a wrapper around arbitrary predictive models with explicit empirical coverage semantics.

### Extensions

- split conformal;
- cross-conformal;
- conformalized quantile regression;
- adaptive/online conformal;
- group-conditional variants;
- conformal risk control.

### Failure modes

- distribution shift;
- conditional coverage can be poor even when marginal coverage holds;
- large sets may be operationally useless;
- feedback loops violate naive exchangeability.

## 7. Out-of-Distribution Detection

Goal: detect whether input \(x\) differs materially from the training distribution.

Methods:

- maximum softmax probability baselines;
- energy scores;
- Mahalanobis distance in representation space;
- density estimation;
- nearest-neighbor distance;
- ensemble disagreement;
- reconstruction error;
- specialized OOD classifiers.

No single OOD score works universally because “out-of-distribution” depends on which shift matters for the downstream task.

## 8. Distribution Shift Taxonomy

### Covariate shift

\[
p_{train}(x)\ne p_{test}(x),\quad p(y|x)\text{ stable}.
\]

### Label shift

\[
p_{train}(y)\ne p_{test}(y),\quad p(x|y)\text{ stable}.
\]

### Concept shift

\[
p_{train}(y|x)\ne p_{test}(y|x).
\]

### Domain shift

Broader structural change between environments.

Correct diagnosis determines which adaptation algorithm makes sense.

## 9. Importance Weighting

Under covariate shift:

\[
R_{test}(f)=\mathbb E_{train}\left[\frac{p_{test}(x)}{p_{train}(x)}\ell(f(x),y)\right].
\]

Estimate density ratios and reweight training samples.

### Risk

Large importance weights create high variance.

## 10. Domain Adaptation

Methods:

- feature alignment;
- discrepancy minimization;
- adversarial domain confusion;
- pseudo-labeling;
- self-training;
- source-target reweighting.

The central assumption is that useful structure transfers between source and target domains.

## 11. Causal Inference

Correlation asks:

\[
P(Y|X=x).
\]

Causal inference asks:

\[
P(Y|do(X=x)).
\]

The intervention operator breaks the natural mechanism assigning \(X\).

## 12. Structural Causal Models

Represent variables through structural equations:

\[
X_i=f_i(PA_i,U_i),
\]

where \(PA_i\) are causal parents and \(U_i\) are exogenous variables.

A causal graph encodes assumptions about which variables directly influence others.

## 13. Confounding

A variable \(Z\) is a confounder when it causally influences both treatment \(X\) and outcome \(Y\), creating non-causal association.

The back-door criterion provides graphical conditions for adjustment.

If \(Z\) is sufficient:

\[
P(Y|do(X=x))=\sum_z P(Y|X=x,Z=z)P(Z=z).
\]

## 14. Propensity Scores

Define treatment propensity:

\[
e(x)=P(T=1|X=x).
\]

Methods:

- propensity matching;
- inverse probability weighting;
- stratification;
- doubly robust estimators.

### Assumptions

- no unmeasured confounding / conditional ignorability;
- positivity;
- consistency.

Violating these assumptions can invalidate causal claims even if predictive performance is excellent.

## 15. Doubly Robust Estimation

Combine an outcome model and propensity model so the estimator remains consistent if one of the two nuisance models is correctly specified under standard assumptions.

This principle also appears in contextual-bandit off-policy evaluation.

## 16. Instrumental Variables

An instrument affects treatment but influences outcome only through treatment, under strong assumptions.

Useful when treatment is confounded by unobserved variables and a valid instrument exists.

The hard part is not the estimator; it is defending instrument validity.

## 17. Regression Discontinuity

When treatment assignment changes sharply at a threshold, compare observations near that threshold to estimate a local causal effect.

This is an example of exploiting quasi-randomness created by institutional rules.

## 18. Difference-in-Differences

Estimate treatment effects using before/after differences between treated and comparison groups.

A core assumption is parallel trends in the absence of treatment.

## 19. Causal Discovery

Goal: infer aspects of causal structure from observational/interventional data.

Families:

- constraint-based methods such as PC;
- score-based search such as GES;
- continuous optimization approaches;
- additive-noise methods;
- invariant causal prediction;
- interventional discovery.

### Limitation

Causal discovery necessarily depends on assumptions that should be written explicitly.

## 20. Counterfactual Reasoning

Counterfactuals ask what would have happened to the same unit under a different intervention.

Three levels often distinguished:

1. association;
2. intervention;
3. counterfactual.

This hierarchy is useful for separating predictive systems from causal decision systems.

## 21. Active Learning

Active learning decides which examples should be labeled.

### Uncertainty sampling

Query examples with highest predictive uncertainty.

### Margin sampling

For classification, query cases where the top classes are close.

### Query by Committee

Train a committee and query examples with strongest disagreement.

### Expected information gain

Choose observations expected to reduce posterior uncertainty the most.

### Diversity-aware acquisition

Avoid querying many redundant points by combining informativeness and coverage.

## 22. Bayesian Experimental Design

Choose experiment \(a\) maximizing expected information gain:

\[
a^*=\arg\max_a I(\theta;Y|a,D).
\]

This generalizes active learning beyond labels to interventions and experiments.

## 23. Value of Information

The value of acquiring information is the improvement in expected decision utility after observing it minus acquisition cost.

This is a foundational concept for deciding:

- whether an agent should search the web;
- call a tool;
- run another test;
- request a human label;
- perform a quantum measurement;
- trigger a security scan.

## 24. Continual Learning

A continual learner receives a stream of tasks/distributions:

\[
D_1,D_2,\ldots,D_T.
\]

It should learn new tasks while preserving useful older knowledge.

### Catastrophic forgetting

Gradient updates for new data can overwrite parameters important for previous tasks.

## 25. Replay Methods

Store examples or compressed memories from previous tasks and interleave them with new training.

Variants:

- reservoir sampling;
- prioritized replay;
- class-balanced memory;
- generative replay;
- latent replay.

### Trade-off

Memory footprint vs retained performance.

## 26. Elastic Weight Consolidation

Penalize changing parameters estimated to be important for previous tasks:

\[
L_{new}(\theta)+\frac{\lambda}{2}\sum_i F_i(\theta_i-\theta_i^*)^2.
\]

The Fisher-related importance estimate approximates which parameters old tasks depend on.

## 27. Parameter Isolation

Give different tasks partially separate parameters:

- adapters;
- masks;
- progressive networks;
- expert routing;
- dynamically expanding modules.

This reduces interference at the cost of growing capacity.

## 28. Meta-Learning

Meta-learning trains across tasks to improve future adaptation.

### Optimization-based

MAML-style methods optimize an initialization that becomes useful after a few gradient steps.

### Metric-based

Learn a representation where new classes/tasks can be solved by nearest-prototype or similarity methods.

### Model-based

Use recurrent/external-memory models that implement a learned adaptation algorithm.

## 29. Prototypical Networks

Represent each class by a prototype:

\[
c_k=\frac{1}{|S_k|}\sum_{(x_i,y_i=k)}f_\theta(x_i).
\]

Classify query examples by distance to prototypes.

The foundation is **learn an embedding where simple nonparametric adaptation works**.

## 30. Learned Optimizers

An optimizer itself can be parameterized and trained across tasks:

\[
\Delta\theta_t=g_\phi(g_t,h_t,\ldots).
\]

This turns optimization algorithm design into a learning problem.

The challenge is generalization beyond the training distribution of optimization tasks.

## 31. Online Learning

An online learner repeatedly:

1. predicts/acts;
2. observes loss;
3. updates.

Regret against comparator \(u\):

\[
R_T=\sum_{t=1}^T\ell_t(w_t)-\sum_{t=1}^T\ell_t(u).
\]

Online convex optimization provides foundations for adaptive systems, bandits, and adversarial data streams.

## 32. Drift Detection

Detect when data-generating behavior changes.

Methods:

- CUSUM;
- Page-Hinkley;
- sequential probability ratio tests;
- ADWIN-like adaptive windows;
- two-sample tests;
- representation-distribution monitoring.

Detection should trigger an explicit response policy: retrain, reset, discount old data, escalate, or switch models.

## 33. Change-Point Detection

Estimate time \(\tau\) where statistical properties shift.

Bayesian and frequentist approaches can detect abrupt regime changes and are important for:

- nonstationary bandits;
- cybersecurity anomaly streams;
- financial regimes;
- sensor degradation;
- model monitoring.

## 34. Robust Learning

Robust optimization minimizes worst-case or uncertainty-set loss:

\[
\min_\theta\max_{Q\in\mathcal U} \mathbb E_Q[\ell_\theta].
\]

Approaches:

- distributionally robust optimization;
- adversarial training;
- robust statistics;
- trimmed estimators;
- median-of-means;
- contamination models.

## 35. Adversarial Examples

A small perturbation \(\delta\) is chosen to increase loss:

\[
\max_{\|\delta\|\le \epsilon}\ell(f_\theta(x+\delta),y).
\]

### Algorithms

- FGSM;
- projected gradient descent;
- optimization-based attacks.

### Defensive foundation

Adversarial training solves a minimax problem over perturbations.

This area forms a bridge between AI robustness and cybersecurity.

## 36. Selective Prediction / Abstention

A model may refuse to predict when confidence is insufficient.

Optimize coverage vs risk:

- coverage = fraction of examples answered;
- selective risk = error among answered examples.

This is often safer than forcing a prediction on every input.

## 37. Human-in-the-Loop Decision Algorithms

Human review can be treated as an expensive action.

A controller decides:

\[
\text{auto-act} \quad \text{vs}\quad \text{request human input}.
\]

Useful formulations:

- cost-sensitive classification;
- contextual bandits;
- value of information;
- selective prediction;
- active learning.

## 38. Combination research map

```text
Conformal prediction + selective prediction
  -> calibrated abstention

Change-point detection + LinUCB
  -> nonstationary contextual decision making

Causal model + bandit
  -> exploration informed by interventions

Active learning + causal discovery
  -> choose experiments that resolve causal ambiguity

OOD detector + agent controller
  -> detect unfamiliar tasks and escalate

Meta-learning + continual learning
  -> fast adaptation while reducing forgetting

Deep ensembles + MPC
  -> uncertainty-aware model-based control

Robust optimization + adversarial training
  -> min-max learning under bounded perturbations
```

## 39. Implementation and evaluation checklist

Record:

- uncertainty type targeted;
- assumptions required for guarantees;
- calibration method;
- shift detection method;
- intervention vs observation distinction;
- label acquisition policy;
- adaptation frequency;
- forgetting metrics;
- false alarm rate for drift detection;
- decision utility, not only prediction accuracy;
- human escalation cost;
- robustness under adversarial inputs.

## 40. Primary references

- Pearl, *Causality*.
- Hernán & Robins, *Causal Inference: What If*.
- Settles, *Active Learning Literature Survey*.
- Finn et al., *Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks*.
- Snell et al., *Prototypical Networks for Few-shot Learning*.
- Kirkpatrick et al., *Overcoming Catastrophic Forgetting in Neural Networks*.
- Vovk, Gammerman & Shafer, *Algorithmic Learning in a Random World*.
- Lakshminarayanan et al., *Simple and Scalable Predictive Uncertainty Estimation using Deep Ensembles*.
- Ben-David et al., domain-adaptation theory.
- Shalev-Shwartz, *Online Learning and Online Convex Optimization*.

## 41. Research questions

- Can causal structure improve contextual-bandit sample efficiency without unsafe assumptions?
- How can conformal methods retain meaningful guarantees under feedback loops?
- Can continual learners detect when to create new modules instead of overwriting old ones?
- How should an agent price the value of another observation or tool call?
- Can OOD detection be defined relative to decision risk rather than visual/statistical novelty?
- How can learned optimizers generalize to architectures and objectives never seen during meta-training?