# 10 — AI Optimization and Learning Theory Foundations

This chapter collects the optimization and statistical learning foundations underneath modern AI systems. The objective is not to catalog model brands; it is to identify reusable mechanisms that explain why learning works, when it fails, and how to combine optimization, uncertainty, regularization, generalization, and efficient adaptation.

## 1. Problem template

Most supervised learning can be written as empirical risk minimization:

\[
\hat\theta = \arg\min_\theta \frac{1}{n}\sum_{i=1}^n \ell(f_\theta(x_i), y_i) + \lambda R(\theta).
\]

The same template recurs in self-supervised learning, reward modeling, generative modeling, representation learning, and many control problems. The details change, but the reusable ingredients are:

- a parameterized model \(f_\theta\),
- an objective or loss \(\ell\),
- a data distribution,
- an optimizer,
- regularization or inductive bias,
- an evaluation distribution,
- and assumptions about stationarity, noise, causality, and feedback.

## 2. Gradient Descent

### Motivation

When the objective is differentiable but direct minimization is expensive, use local slope information to iteratively improve parameters.

### Contribution

Gradient descent converts optimization into repeated first-order updates:

\[
\theta_{t+1}=\theta_t-\eta_t\nabla L(\theta_t).
\]

The contribution is conceptual as much as computational: a difficult global optimization problem is turned into a sequence of cheap local steps.

### Implementation

```python
for step in range(T):
    loss = objective(theta)
    grad = gradient(loss, theta)
    theta = theta - lr * grad
```

Key engineering variables:

- learning-rate schedule,
- gradient scale,
- batch size,
- normalization,
- clipping,
- parameter initialization,
- optimizer state,
- numerical precision.

### Complexity

One update usually costs approximately one forward and backward pass. Total cost is dominated by number of steps × batch cost.

### Failure modes

- learning rate too large: divergence;
- too small: slow convergence;
- ill-conditioned curvature: zig-zagging;
- saddle points and plateaus;
- exploding/vanishing gradients;
- training objective misaligned with deployment objective.

## 3. Stochastic Gradient Descent

### Motivation

Computing the exact gradient over a large dataset is expensive. Use a random mini-batch as an unbiased or approximately unbiased estimate.

\[
g_t = \frac{1}{|B_t|}\sum_{i\in B_t} \nabla_\theta \ell_i(\theta_t).
\]

### Contribution

SGD trades gradient precision for cheap updates and often provides useful implicit regularization.

### Implementation

```python
for batch in loader:
    optimizer.zero_grad()
    loss = model.loss(batch)
    loss.backward()
    optimizer.step()
```

Research variables include batch size, sampling scheme, data order, gradient accumulation, and learning-rate scaling.

## 4. Momentum and Nesterov acceleration

Momentum introduces velocity:

\[
v_t = \beta v_{t-1} + g_t,
\qquad
\theta_{t+1}=\theta_t-\eta v_t.
\]

It suppresses oscillation and accumulates consistent directions. Nesterov methods evaluate gradients with a look-ahead idea and have strong convex-optimization theory.

Combination idea: momentum + adaptive scaling + schedule + clipping is the practical template behind many modern optimizers.

## 5. AdaGrad, RMSProp, Adam, AdamW

### AdaGrad

Tracks accumulated squared gradients:

\[
G_t=G_{t-1}+g_t^2,
\qquad
\theta_{t+1}=\theta_t-\eta\frac{g_t}{\sqrt{G_t}+\epsilon}.
\]

Useful for sparse features but its effective learning rate can decay too aggressively.

### RMSProp

Uses an exponential moving average of squared gradients instead of an ever-growing sum.

### Adam

Tracks first and second moments:

\[
m_t=\beta_1m_{t-1}+(1-\beta_1)g_t,
\]

\[
v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2.
\]

Bias-corrected estimates are used to scale updates.

### AdamW

Decouples weight decay from the adaptive gradient update. This distinction is important because L2 regularization and multiplicative parameter decay are not equivalent under adaptive scaling.

### Implementation concerns

- epsilon placement matters;
- mixed precision can underflow optimizer state;
- optimizer-state memory can exceed parameter memory;
- fused kernels change throughput but not the mathematical objective;
- weight decay should usually exclude some bias/normalization parameters depending on architecture.

## 6. Second-order and quasi-Newton methods

Newton's method uses curvature:

\[
\theta_{t+1}=\theta_t-H^{-1}\nabla L(\theta_t),
\]

where \(H\) is the Hessian.

Exact Hessians are usually too expensive for large neural networks. Quasi-Newton methods such as BFGS and L-BFGS approximate inverse-curvature information.

### Contribution

First-order methods ask “which direction decreases the loss?” Second-order methods also ask “how sharply curved is the surface in that direction?”

### Combination research

- L-BFGS for small fine-tuning problems;
- Gauss-Newton / Fisher approximations;
- low-rank curvature estimates;
- preconditioners derived from model structure;
- natural-gradient approximations.

## 7. Natural Gradient

Standard gradient distance is measured in parameter coordinates. Natural gradient instead uses the geometry of distributions, typically through the Fisher information matrix \(F\):

\[
\theta_{t+1}=\theta_t-\eta F^{-1}g.
\]

### Motivation

Two parameter changes with the same Euclidean norm can produce radically different changes in model behavior.

### Contribution

Optimization becomes approximately invariant to smooth reparameterization.

### Modern connections

- trust-region policy optimization;
- second-order variational inference;
- K-FAC and block-structured approximations;
- information geometry.

## 8. Mirror Descent and Proximal Algorithms

Mirror descent performs updates in a geometry matched to the domain. Proximal methods solve:

\[
\theta_{t+1}=\arg\min_\theta \left[g_t^T\theta + \frac{1}{2\eta}\|\theta-\theta_t\|^2 + R(\theta)\right].
\]

They are foundational for sparse optimization, constrained learning, online learning, and composite objectives.

## 9. Regularization

### L2 / weight decay

Discourages large weights.

### L1

Encourages sparsity:

\[
R(\theta)=\|\theta\|_1.
\]

### Dropout

Randomly removes units during training. It can be viewed as stochastic regularization and approximate model averaging.

### Data augmentation

Injects domain invariances by transforming inputs while preserving target semantics.

### Early stopping

Optimization time itself becomes a regularizer.

### Label smoothing

Replaces hard one-hot targets with softened target distributions, reducing overconfidence in some settings.

## 10. Bias–Variance Tradeoff

Prediction error can be conceptually decomposed into approximation bias, estimation variance, and irreducible noise. Although deep-learning behavior is more complex than classical textbook decompositions, the core diagnostic remains useful:

- high bias → model cannot fit important structure;
- high variance → model is unstable to training data;
- distribution shift → neither classical category fully captures the problem.

## 11. Empirical Risk vs. Population Risk

Training minimizes empirical risk:

\[
\hat R(f)=\frac{1}{n}\sum_i \ell(f(x_i),y_i).
\]

Deployment cares about population risk:

\[
R(f)=\mathbb E_{(x,y)\sim P}[\ell(f(x),y)].
\]

Generalization is the gap between them. This distinction should appear in every AI experiment.

## 12. PAC Learning and Capacity

Probably Approximately Correct learning formalizes how much data is needed for a hypothesis class to generalize with high probability.

Key concepts:

- hypothesis class;
- sample complexity;
- confidence \(1-\delta\);
- accuracy \(\epsilon\);
- VC dimension;
- Rademacher complexity;
- uniform convergence.

Deep learning often operates outside the simplest PAC assumptions, but the framework is still valuable for thinking about complexity and data requirements.

## 13. Maximum Likelihood and Cross-Entropy

For probabilistic models:

\[
\hat\theta = \arg\max_\theta \sum_i \log p_\theta(y_i|x_i).
\]

Minimizing negative log-likelihood yields cross-entropy for categorical outputs. This connects statistical estimation, information theory, and neural training.

## 14. Bayesian Learning

Bayes' rule:

\[
p(\theta|D)\propto p(D|\theta)p(\theta).
\]

### Motivation

A point estimate hides uncertainty. Bayesian learning maintains a distribution over plausible parameters or hypotheses.

### Contribution

Uncertainty becomes part of the model state and can guide decisions.

### Implementation families

- exact conjugate updates where available;
- Markov chain Monte Carlo;
- variational inference;
- Laplace approximation;
- ensembles as a practical approximation;
- Gaussian processes.

## 15. Gaussian Processes

A Gaussian process defines a distribution over functions:

\[
f(x)\sim GP(m(x), k(x,x')).
\]

### Contribution

Prediction and calibrated epistemic uncertainty are coupled through the kernel.

### Limitation

Exact inference scales poorly with dataset size, motivating sparse approximations, inducing points, random features, and structured kernels.

### Combination ideas

- Bayesian optimization;
- active learning;
- safe exploration;
- uncertainty-aware control.

## 16. Calibration

A model is calibrated when predictions assigned probability \(p\) are correct roughly fraction \(p\) of the time under the evaluation distribution.

Methods:

- temperature scaling;
- Platt scaling;
- isotonic regression;
- calibration-aware training.

Calibration is distinct from accuracy. A highly accurate classifier may still be dangerously overconfident.

## 17. Conformal Prediction

### Motivation

Provide prediction sets or intervals with finite-sample coverage guarantees under exchangeability assumptions.

### Basic split conformal pattern

1. train a predictor on a training split;
2. compute nonconformity scores on a calibration split;
3. choose a quantile corresponding to desired coverage;
4. construct prediction sets for new examples.

### Contribution

It wraps arbitrary predictive models with distribution-light uncertainty sets.

### Limitations

- exchangeability assumptions;
- coverage is usually marginal, not necessarily conditional;
- distribution shift can invalidate nominal guarantees;
- set size can be too large to be useful.

### Combination research

- conformal + retrieval systems;
- conformal + contextual bandits;
- conformal + safety filters;
- online conformal methods for drift.

## 18. Active Learning

### Motivation

Labels are expensive. Choose which unlabeled examples are most valuable to annotate.

Strategies:

- uncertainty sampling;
- margin sampling;
- query by committee;
- expected model change;
- expected error reduction;
- information gain;
- diversity-aware acquisition.

### Connection to bandits

Active learning chooses **which information to acquire**; bandits choose **which action to execute** under partial feedback. Both are sequential information-acquisition problems.

## 19. Meta-Learning

Meta-learning optimizes the learning process itself.

### MAML-style idea

Find parameters \(\theta\) such that a few gradient steps adapt well to a new task:

\[
\theta'_i=\theta-\alpha\nabla_\theta L_i^{train}(\theta),
\]

then optimize \(\theta\) for post-adaptation validation performance.

Other families:

- metric-based few-shot learning;
- learned optimizers;
- recurrent meta-learners;
- in-context meta-learning interpretations.

## 20. Continual Learning

### Motivation

A deployed system may receive tasks sequentially and must learn new information without catastrophically forgetting old capabilities.

Main approaches:

- replay buffers;
- generative replay;
- regularization such as elastic weight consolidation;
- parameter isolation;
- dynamic architecture expansion;
- adapter routing.

Research variables include task boundaries, memory budgets, drift, privacy, and evaluation across time.

## 21. Federated Learning

### FedAvg

Clients perform local training and a coordinator aggregates updates:

\[
\theta_{t+1}=\sum_k \frac{n_k}{N}\theta_{t+1}^{(k)}.
\]

### Challenges

- non-IID client data;
- unreliable clients;
- communication cost;
- secure aggregation;
- poisoning and Byzantine clients;
- privacy leakage;
- fairness across client populations.

FedProx and other variants add mechanisms to stabilize heterogeneous local optimization.

## 22. Multi-Task Learning

Train related tasks jointly so representations are shared where useful.

Patterns:

- hard parameter sharing;
- soft sharing;
- task-specific adapters;
- mixture-of-experts routing;
- gradient balancing;
- Pareto multi-objective training.

Negative transfer is the central failure mode.

## 23. Distillation

A teacher transfers information to a smaller or specialized student.

### Logit distillation

Minimize divergence between softened teacher and student distributions.

### Feature distillation

Match internal representations.

### Sequence-level distillation

Use teacher-generated outputs as training targets.

### Contribution

Distillation changes the source of supervision from labels alone to learned behavior.

## 24. Parameter-Efficient Adaptation

### Low-rank adaptation

Represent a weight update as:

\[
\Delta W = BA,
\]

where rank \(r\ll \min(d_{in},d_{out})\).

### Motivation

Full fine-tuning duplicates huge parameter states. Low-rank or adapter methods constrain the update subspace.

Other methods:

- adapters;
- prefix tuning;
- prompt tuning;
- IA3-style multiplicative adaptation;
- sparse update masks.

## 25. Quantization and Sparsification

### Quantization

Reduce numerical precision of weights/activations.

Dimensions:

- post-training vs quantization-aware training;
- per-tensor vs per-channel scaling;
- symmetric vs asymmetric quantization;
- weight-only vs activation quantization;
- static vs dynamic calibration.

### Sparsification

Remove or zero parameters/computation.

- unstructured pruning;
- structured channel/head pruning;
- N:M sparsity;
- dynamic sparsity.

The research question is not only compression ratio but **quality × latency × memory × hardware support**.

## 26. Experimental protocol

For every new learning algorithm, record:

1. exact objective;
2. optimizer and hyperparameters;
3. data sampling strategy;
4. train/validation/test split logic;
5. model capacity;
6. compute budget;
7. random seeds;
8. calibration metrics;
9. robustness to shift;
10. ablation against a simpler baseline;
11. confidence intervals;
12. failure cases.

## 27. Combination research map

Useful combinations:

```text
Conformal prediction + contextual bandits
    -> uncertainty-aware exploration

Gaussian process + Bayesian optimization
    -> sample-efficient black-box search

Meta-learning + continual learning
    -> fast adaptation without catastrophic forgetting

Federated learning + secure aggregation + differential privacy
    -> privacy-preserving distributed learning

Distillation + quantization + sparsity
    -> efficient deployment pipeline

Active learning + representation learning
    -> label-efficient feature acquisition

Natural gradient + policy optimization
    -> geometry-aware reinforcement learning
```

## 28. Primary references

- Robbins & Monro, *A Stochastic Approximation Method* (1951).
- Nesterov, *A Method for Solving the Convex Programming Problem with Convergence Rate O(1/k²)* (1983).
- Duchi et al., *Adaptive Subgradient Methods for Online Learning and Stochastic Optimization* (2011).
- Kingma & Ba, *Adam: A Method for Stochastic Optimization* (2014).
- Loshchilov & Hutter, *Decoupled Weight Decay Regularization* (2017).
- Amari, *Natural Gradient Works Efficiently in Learning* (1998).
- Vapnik, *Statistical Learning Theory*.
- Rasmussen & Williams, *Gaussian Processes for Machine Learning*.
- Vovk, Gammerman & Shafer, *Algorithmic Learning in a Random World*.
- Finn et al., *Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks* (2017).
- McMahan et al., *Communication-Efficient Learning of Deep Networks from Decentralized Data* (2017).

## 29. Research questions

- Can uncertainty calibration survive severe distribution shift?
- When does low-rank adaptation become fundamentally insufficient?
- Which optimizer state can be compressed without changing learning dynamics?
- Can conformal guarantees be made useful under online nonstationarity?
- How should systems jointly optimize accuracy, calibration, latency, energy, and memory?
- Can an adaptive system select its optimizer, batch size, precision, and regularization policy online?