# 08 — Multi-Armed Bandits, Contextual Bandits, LinUCB, Thompson Sampling, and Neural Bandits

This chapter is intentionally detailed because bandit algorithms occupy an important middle ground between static prediction and full reinforcement learning. They are especially useful for modern systems that repeatedly choose among tools, models, routes, recommendations, configurations, or strategies while learning from partial feedback.

---

# 1. Motivation: Sequential Decisions with Partial Feedback

Suppose a system repeatedly chooses one action from a set:

```text
choose model A, B, or C
choose recommendation
choose search strategy
choose worker/node
choose prompt/tool chain
choose cache policy
choose experiment variant
```

After choosing, the system observes the outcome of the **chosen action**, but usually not the counterfactual outcomes of actions it did not choose.

This creates the exploration/exploitation dilemma:

- **exploitation** — choose what currently appears best;
- **exploration** — choose uncertain alternatives to learn whether they may be better.

A static supervised learner does not solve this automatically, because the data distribution is influenced by the learner's own past choices.

---

# 2. The Multi-Armed Bandit (MAB) Model

## Problem

There are \(K\) actions/arms. At round \(t\):

1. learner chooses \(A_t\in\{1,\ldots,K\}\);
2. reward \(R_t\) for that arm is observed;
3. learner updates its decision rule.

In the basic stochastic model, arm \(a\) has an unknown reward distribution with mean \(\mu_a\).

The optimal arm is

\[
a^*=\arg\max_a \mu_a.
\]

## Objective: cumulative reward

\[
\sum_{t=1}^T R_t.
\]

Equivalent theoretical analysis often focuses on cumulative regret:

\[
Regret(T)=T\mu_{a^*}-\mathbb{E}\left[\sum_{t=1}^T R_t\right].
\]

Low regret means the learner quickly identifies and exploits high-value actions while spending only necessary effort on exploration.

---

# 3. Why Greedy Alone Fails

## Pure greedy

Estimate mean reward \(\hat\mu_a\), then always choose

\[
A_t=\arg\max_a\hat\mu_a.
\]

## Failure

Early noise can make a bad arm look good. If the system never explores again, it can permanently lock onto the wrong arm.

Example:

- true means: A = 0.60, B = 0.55;
- first sample: A gives 0, B gives 1;
- pure greedy chooses B indefinitely;
- A never gets enough evidence to recover.

This is the central reason uncertainty must enter the decision rule.

---

# 4. Epsilon-Greedy

## Motivation

Add the simplest possible exploration to greedy selection.

## Algorithm

With probability \(1-\epsilon\), choose current best arm.

With probability \(\epsilon\), choose an exploratory arm, often uniformly at random.

```python
import random

def choose_arm(estimates, epsilon):
    if random.random() < epsilon:
        return random.randrange(len(estimates))
    return max(range(len(estimates)), key=lambda a: estimates[a])
```

## Contribution

Epsilon-greedy guarantees continued exploration with almost no implementation complexity.

It is therefore an essential baseline.

## Incremental mean update

After arm \(a\) has been selected \(n_a\) times:

\[
\hat\mu_a\leftarrow\hat\mu_a+\frac{1}{n_a}(r-\hat\mu_a).
\]

No full reward history is required.

## Weakness

Exploration is **uninformed**. It spends probability on arms even when evidence already strongly indicates they are poor.

## Variants

### Decaying epsilon

Start exploratory, reduce over time:

\[
\epsilon_t\downarrow0.
\]

### Epsilon-first

Explore for initial phase, then commit. Vulnerable if environment changes.

### Contextual epsilon-greedy

Fit a reward predictor \(\hat r(x,a)\), mostly choose predicted best action, and occasionally randomize.

## Production use

Epsilon-greedy is valuable as:

- baseline;
- cold-start strategy;
- emergency fallback;
- exploration floor around a more complex policy.

---

# 5. Upper Confidence Bound (UCB)

## Motivation

Explore actions in proportion to uncertainty rather than uniformly.

Core principle:

> Choose the action with the highest plausible reward, not merely the highest estimated mean.

This is **optimism in the face of uncertainty**.

A generic score is

\[
UCB_a=\text{estimate}_a+\text{uncertainty bonus}_a.
\]

An arm that is good or insufficiently understood can receive a high score.

---

# 6. UCB1

## Motivation

For bounded stochastic rewards, use empirical means and visit counts to build an optimism bonus.

A standard UCB1-style score is

\[
UCB_a(t)=\hat\mu_a(t)+\sqrt{\frac{2\ln t}{n_a(t)}}.
\]

where:

- \(t\): total rounds;
- \(n_a(t)\): pulls of arm \(a\);
- \(\hat\mu_a(t)\): empirical mean.

## Contribution

The second term is large for rarely tried arms and shrinks as evidence accumulates.

Unlike epsilon-greedy, exploration is targeted.

## Implementation

```python
import math

def ucb1(means, counts, t):
    scores = []
    for mean, n in zip(means, counts):
        if n == 0:
            scores.append(float('inf'))
        else:
            scores.append(mean + math.sqrt(2 * math.log(t) / n))
    return max(range(len(scores)), key=scores.__getitem__)
```

## Complexity

Naively scoring all \(K\) arms is \(O(K)\) per decision.

## Failure modes

- assumes reward structure approximately stationary in the classical model;
- extreme delays can distort counts and uncertainty;
- naive application with millions of arms is expensive;
- correlated/non-i.i.d. reward noise may invalidate textbook confidence interpretation.

## Contribution to theory

Auer, Cesa-Bianchi, and Fischer provided finite-time analysis for simple bandit policies including UCB-style methods.

Reference: https://doi.org/10.1023/A:1013689704352

---

# 7. Thompson Sampling

## Motivation

UCB uses an explicit optimism bonus. Thompson Sampling instead represents uncertainty probabilistically and **samples a plausible model**, then acts optimally for that sample.

## Algorithm

Maintain posterior distribution over unknown reward parameters \(\theta\):

\[
P(\theta\mid D_t).
\]

At each round:

1. sample \(\tilde\theta\sim P(\theta\mid D_t)\);
2. choose action maximizing reward under \(\tilde\theta\);
3. observe reward;
4. update posterior.

This is probability matching: actions are selected roughly according to posterior plausibility that they are optimal.

---

# 8. Bernoulli Thompson Sampling

## Beta-Bernoulli model

For binary rewards \(r\in\{0,1\}\), use Beta prior:

\[
\theta_a\sim Beta(\alpha_a,\beta_a).
\]

After observing success:

\[
\alpha_a\leftarrow\alpha_a+1.
\]

After failure:

\[
\beta_a\leftarrow\beta_a+1.
\]

Decision:

\[
\tilde\theta_a\sim Beta(\alpha_a,\beta_a),
\qquad
A_t=\arg\max_a\tilde\theta_a.
\]

```python
import random

def beta_ts(alpha, beta):
    draws = [random.betavariate(a, b) for a, b in zip(alpha, beta)]
    return max(range(len(draws)), key=draws.__getitem__)
```

## Contribution

Exploration emerges naturally from posterior uncertainty. Arms with broad posteriors occasionally produce optimistic samples.

## Advantages

- often strong empirical performance;
- easy implementation for conjugate models;
- probabilistic uncertainty representation;
- natural extension to richer reward models.

## Weaknesses

- posterior depends on modeling assumptions/prior;
- exact posterior may be difficult;
- misspecification can create overconfidence;
- large structured action spaces need additional optimization.

Reference: Chapelle and Li, “An Empirical Evaluation of Thompson Sampling,” NIPS 2011: https://papers.nips.cc/paper/2011/hash/e53a0a2978c28872a4505bdb51db06dc-Abstract.html

---

# 9. Contextual Bandits

## Motivation

Basic MAB assumes each arm has one global expected reward. Real decisions depend on context.

Example:

- model A may be best for coding tasks;
- model B may be best for retrieval tasks;
- tool C may be best when repository size is large;
- route D may be best during a particular traffic pattern.

We therefore observe context before selecting an action.

## Model

At round \(t\):

1. observe context \(x_t\), or action-specific contexts \(x_{t,a}\);
2. choose action \(A_t\);
3. observe reward \(R_t(A_t)\) for selected action only;
4. update policy.

Objective is cumulative reward or contextual regret relative to the best policy/model in a comparison class.

## Key distinction from supervised learning

Supervised learning ideally observes labels/outcomes for examples independent of its own predictions.

Contextual bandits observe only the reward of the selected action. The policy controls which labels become visible.

## Key distinction from reinforcement learning

Standard contextual bandits model immediate reward without requiring the chosen action to influence future context/state.

If action changes future state, use MDP/RL/control reasoning.

---

# 10. Linear Contextual Bandits

## Motivation

We need contextual generalization, but want an efficient model and principled uncertainty.

Assume expected reward is approximately linear in action-context features:

\[
\mathbb{E}[r_t\mid x_{t,a}]=x_{t,a}^T\theta^*.
\]

where:

- \(x_{t,a}\in\mathbb{R}^d\);
- \(\theta^*\in\mathbb{R}^d\) is unknown.

This lets experience generalize across contexts and possibly actions.

---

# 11. Linear Regression Foundation

Given observations \((x_i,r_i)\), ridge regression estimates

\[
\hat\theta
=\arg\min_\theta
\sum_i(r_i-x_i^T\theta)^2+\lambda\|\theta\|_2^2.
\]

Closed-form normal equations:

\[
\hat\theta=A^{-1}b,
\]

where

\[
A=\lambda I+\sum_i x_ix_i^T,
\qquad
b=\sum_i r_ix_i.
\]

The matrix \(A\) encodes how much information has been collected in different feature directions.

This is the key bridge to LinUCB.

---

# 12. LinUCB — Motivation

Greedy linear regression would choose

\[
\arg\max_a x_{t,a}^T\hat\theta.
\]

But this ignores uncertainty. A feature direction with little historical data may have an inaccurate estimate.

LinUCB adds an uncertainty bonus derived from the geometry of the regression confidence region.

---

# 13. LinUCB — Core Contribution

For candidate action \(a\), define

\[
p_{t,a}
=
\underbrace{x_{t,a}^T\hat\theta}_{\text{predicted reward}}
+
\underbrace{\alpha\sqrt{x_{t,a}^TA^{-1}x_{t,a}}}_{\text{exploration bonus}}.
\]

Then choose

\[
A_t=\arg\max_a p_{t,a}.
\]

The algorithm therefore selects actions that have either:

- high predicted reward;
- high uncertainty;
- or both.

## Geometry of the uncertainty term

\[
x^TA^{-1}x
\]

is a quadratic form measuring how uncertain the estimator is in direction \(x\).

If many observations have covered a feature direction, \(A\) grows in that direction and uncertainty shrinks.

If a context lies in a poorly explored direction, uncertainty is large.

This is much richer than using only action counts.

---

# 14. Confidence Ellipsoid View

Ridge regression uncertainty can be expressed as a parameter confidence set:

\[
\mathcal{C}_t=
\{\theta:\|\theta-\hat\theta_t\|_{A_t}\le \beta_t\},
\]

where

\[
\|v\|_A=\sqrt{v^TAv}.
\]

The optimistic predicted reward for feature \(x\) is

\[
\max_{\theta\in\mathcal{C}_t}x^T\theta
=
x^T\hat\theta+\beta_t\sqrt{x^TA^{-1}x}.
\]

This derivation explains LinUCB conceptually:

> Choose the action whose reward could be highest under a statistically plausible parameter vector.

The scalar \(\alpha\) in practical LinUCB implementations often plays the role of confidence width / exploration strength.

---

# 15. Disjoint LinUCB

## Motivation

Different actions may have different reward parameters.

For each action \(a\), maintain separate model:

\[
\mathbb{E}[r\mid x,a]=x^T\theta_a.
\]

Maintain:

\[
A_a=\lambda I+\sum_{i:a_i=a}x_ix_i^T
\]

and

\[
b_a=\sum_{i:a_i=a}r_ix_i.
\]

Estimate:

\[
\hat\theta_a=A_a^{-1}b_a.
\]

Score:

\[
p_a=x^T\hat\theta_a+\alpha\sqrt{x^TA_a^{-1}x}.
\]

Update chosen action:

\[
A_a\leftarrow A_a+xx^T
\]

\[
b_a\leftarrow b_a+rx.
\]

## Advantages

- simple;
- action-specific behavior;
- easy to parallelize by arm.

## Weaknesses

- no statistical sharing between actions;
- cold start for many/new actions;
- memory \(O(Kd^2)\) if dense matrix per action;
- expensive for huge action catalogs.

---

# 16. Shared Linear Model

If actions are encoded in the feature vector, use one global parameter:

\[
\mathbb{E}[r\mid x,a]=\phi(x,a)^T\theta.
\]

Then maintain one \(A,b\) pair.

## Advantage

Experience transfers across actions through shared features.

## Requirement

Feature representation must capture meaningful action differences and interactions.

This is often more appropriate than disjoint LinUCB when actions are numerous or frequently changing.

---

# 17. Hybrid LinUCB

The original personalized-news work described disjoint and hybrid structures allowing both shared and action-specific features.

Conceptually:

\[
\mathbb{E}[r]
=
z_{t,a}^T\beta^*+x_{t,a}^T\theta_a^*,
\]

where:

- \(z_{t,a}\): shared features;
- \(\beta^*\): global parameter;
- \(x_{t,a}\): action-specific features;
- \(\theta_a^*\): arm-specific parameter.

## Contribution

Hybridization allows transfer across actions while preserving action-specific effects.

## Implementation cost

Bookkeeping and covariance algebra are more complicated than disjoint/shared models. Start with a shared or disjoint baseline unless hybrid structure is clearly needed.

Seminal application/reference: Li, Chu, Langford, Schapire, “A Contextual-Bandit Approach to Personalized News Article Recommendation,” WWW 2010: https://doi.org/10.1145/1772690.1772758

---

# 18. Basic LinUCB Implementation

A clear reference implementation should favor numerical correctness over clever optimization.

```python
import numpy as np

class LinUCB:
    def __init__(self, d, alpha=1.0, lam=1.0):
        self.d = d
        self.alpha = alpha
        self.A = lam * np.eye(d)
        self.b = np.zeros(d)

    def theta(self):
        return np.linalg.solve(self.A, self.b)

    def score(self, x):
        theta = self.theta()
        # Solve A y = x; do not explicitly form inverse.
        y = np.linalg.solve(self.A, x)
        mean = x @ theta
        uncertainty = np.sqrt(max(0.0, x @ y))
        return mean + self.alpha * uncertainty

    def choose(self, candidate_features):
        scores = [self.score(x) for x in candidate_features]
        return int(np.argmax(scores))

    def update(self, x, reward):
        self.A += np.outer(x, x)
        self.b += reward * x
```

## Important note

Calling a full linear solve for every action is inefficient. This implementation is pedagogical. Production systems should factor/reuse matrix work or maintain inverse/factorization carefully.

---

# 19. Efficient LinUCB Computation

## Shared model

For a single \(A\), compute/factor once per update, then score many candidates.

If Cholesky factorization

\[
A=LL^T
\]

is available, solve triangular systems for predictions/uncertainty.

## Batch scoring

For candidate matrix \(X\in\mathbb{R}^{K\times d}\):

Mean vector:

\[
\mu=X\hat\theta.
\]

Uncertainty can be computed from solves involving \(A^{-1}\) or factorized forms without a Python loop.

## Disjoint model

Only chosen arm's statistics change, but each candidate may require its arm-specific factorization.

## Candidate generation

If \(K\) is enormous, first retrieve a smaller set using:

- rules;
- ANN/vector index;
- search;
- cheap ranker;
- category filtering.

Then use LinUCB for final adaptive ranking.

---

# 20. Sherman-Morrison Rank-One Update

Because

\[
A_{new}=A+xx^T,
\]

if maintaining \(A^{-1}\), use Sherman-Morrison:

\[
(A+xx^T)^{-1}
=
A^{-1}
-
\frac{A^{-1}xx^TA^{-1}}
{1+x^TA^{-1}x}.
\]

## Contribution

Avoid \(O(d^3)\) recomputation of inverse after every update; rank-one inverse update is roughly \(O(d^2)\).

## Warning

Repeated floating-point inverse updates can accumulate numerical error. Periodically recompute/factor from maintained sufficient statistics, or prefer stable factor-update methods when correctness demands it.

---

# 21. LinUCB Complexity

For dense \(d\)-dimensional features:

### State

Shared model:

\[
O(d^2)
\]

matrix plus vector.

Disjoint model:

\[
O(Kd^2).
\]

### Update

Rank-one statistic update:

\[
O(d^2).
\]

### Scoring

With suitable inverse/factorization reuse, roughly \(O(Kd^2)\) in a direct dense implementation, though vectorization/diagonal approximations/structured features can reduce practical cost.

The action-count dimension is therefore critical. Candidate generation is often necessary.

---

# 22. Feature Engineering for LinUCB

LinUCB is only as good as \(x_{t,a}\).

## Good feature types

### Context features

- task category;
- time;
- user/session characteristics;
- repository size;
- current load;
- latency budget.

### Action features

- model/tool identity embedding;
- price/cost;
- capability tags;
- resource type;
- historical reliability.

### Interaction features

Reward often depends on action-context interaction. Include cross features such as:

```text
task_is_code × action_is_code_model
repo_large × tool_is_static_analyzer
latency_budget_tight × action_is_fast
```

or learn an embedding representation.

## Scaling

Feature magnitude directly affects confidence geometry. Standardize/normalize thoughtfully.

If one feature ranges near \(10^6\) and another near \(1\), both regression and uncertainty can become poorly conditioned.

## Bias/intercept

Add constant feature if a baseline intercept is required.

---

# 23. Choosing Alpha

\(\alpha\) controls exploration.

### Too small

- near-greedy behavior;
- premature lock-in;
- poor discovery of underexplored actions.

### Too large

- excessive exploration;
- noisy choices;
- immediate reward/cost degradation.

## Practical tuning

Evaluate using:

- replay/off-policy methods on appropriate randomized logs;
- simulator with known ground truth;
- controlled online experiments;
- sensitivity analysis across environments.

Do not optimize \(\alpha\) on one fixed logged dataset using an invalid counterfactual metric.

---

# 24. Regularization Lambda

Initialize

\[
A_0=\lambda I.
\]

Interpretations:

- ridge regularization;
- prior precision-like term;
- stabilizes inversion when observations are sparse/collinear.

### Too small

Ill conditioning and extreme uncertainty/parameter estimates.

### Too large

Over-shrinks coefficients and slows adaptation.

Feature scaling and \(\lambda\) interact strongly.

---

# 25. Cold Start

## New system

Initially there is no reward history.

LinUCB handles uncertainty through \(A_0=\lambda I\), but all actions may appear similar without informative action features.

## New action

Disjoint LinUCB creates a fresh model with high uncertainty, encouraging exploration. However, with thousands of new actions this may be expensive/risky.

## Strategies

- shared/hybrid model;
- metadata/action embeddings;
- prior statistics;
- safe exploration constraints;
- minimum-quality eligibility rules;
- staged traffic allocation.

---

# 26. Nonstationarity

Classical LinUCB accumulates evidence indefinitely. If reward relationships drift, old data can dominate.

## Approaches

### Sliding-window LinUCB

Use only recent observations.

### Discounted LinUCB

Decay old sufficient statistics:

\[
A_t=\gamma A_{t-1}+x_tx_t^T+(1-\gamma)\lambda I
\]

(with exact form depending on chosen regularization convention), and

\[
b_t=\gamma b_{t-1}+r_tx_t.
\]

### Change detection + reset

Detect abrupt distribution change and partially/fully reset model.

### Time/context features

Model predictable seasonality directly.

## Research trade-off

Forgetting improves adaptation but increases variance by discarding evidence.

---

# 27. Delayed Feedback

## Problem

Decision at time \(t\) may receive reward minutes/hours/days later.

Examples:

- conversion after recommendation;
- test outcome after code change;
- incident occurrence after deployment decision.

## Implementation requirements

Persist decision record:

```text
decision_id
context/features
candidate set
chosen action
policy/model version
propensity if applicable
timestamp
```

When reward arrives, update exactly once using the original decision features.

## Failure mode

Recomputing current features when delayed reward arrives introduces leakage/mismatch.

---

# 28. Reward Design for Engineering Systems

A tool-routing bandit might define

\[
r=
+w_s\cdot success
-w_l\cdot normalized\ latency
-w_c\cdot normalized\ cost
-w_e\cdot error
-w_r\cdot risk.
\]

## Important rule

Hard safety/security requirements should normally be enforced outside the reward:

```text
candidate tools
 ↓ permission/safety/capability filter
feasible tools
 ↓ bandit
selected tool
```

A reward penalty is not a reliable substitute for a hard prohibition.

---

# 29. Linear Thompson Sampling

## Motivation

Instead of an upper confidence bound, sample a plausible linear parameter and optimize for it.

Maintain estimate/posterior-like covariance. Sample

\[
\tilde\theta_t\sim \text{distribution centered near }\hat\theta_t
\]

with covariance related to \(A_t^{-1}\).

Choose

\[
A_t=\arg\max_a x_{t,a}^T\tilde\theta_t.
\]

## Contribution

Randomized exploration naturally accounts for correlations among feature directions and often behaves smoothly in large contextual problems.

Reference: Agrawal and Goyal, “Thompson Sampling for Contextual Bandits with Linear Payoffs,” ICML 2013: https://proceedings.mlr.press/v28/agrawal13.html

## LinUCB vs Linear TS

| Property | LinUCB | Linear Thompson Sampling |
|---|---|---|
| Exploration | deterministic optimism | randomized posterior/plausibility sampling |
| Score | mean + confidence bonus | reward under sampled parameter |
| Reproducibility | deterministic given data/ties | needs RNG seed |
| Tuning | confidence scale | prior/noise/posterior scale |
| Intuition | highest plausible upper value | sample plausible world and act optimally |

Neither universally dominates; environment/modeling details matter.

---

# 30. LinUCB Theory Context

The 2010 personalized-news paper introduced a practical contextual-bandit application/algorithm family. Subsequent work studied linear contextual bandits with formal regret analysis.

Chu, Li, Reyzin, and Schapire (AISTATS 2011) studied contextual bandits with linear payoff functions and provided high-probability regret analysis for an efficient UCB algorithm.

Reference: https://proceedings.mlr.press/v15/chu11a.html

For broader theory, Lattimore and Szepesvári's *Bandit Algorithms* is a central modern reference: https://tor-lattimore.com/downloads/book/book.pdf

The exact theorem applicable to your implementation depends on details such as noise assumptions, feature norm bounds, parameter norm bounds, regularization, action sets, and the precise confidence radius. Practical “LinUCB” code with a fixed arbitrary \(\alpha\) should not automatically be claimed to satisfy a theorem whose prescribed confidence schedule differs.

---

# 31. Neural Contextual Bandits

## Motivation

Linear reward models may underfit complex context-action relationships.

A neural model estimates

\[
r\approx f_\theta(x,a).
\]

The challenge is exploration: a point prediction is not enough. The policy needs a useful uncertainty signal.

---

# 32. NeuralUCB

## Contribution

NeuralUCB uses a neural network for reward representation/prediction and constructs UCB-style uncertainty from neural gradient/tangent features.

At a high level:

```text
context-action x
   ↓ neural network
predicted reward
   +
uncertainty from learned feature/gradient geometry
   ↓
UCB score
```

This extends the “prediction + uncertainty bonus” foundation beyond fixed linear features.

Reference: Zhou, Li, Gu, “Neural Contextual Bandits with UCB-based Exploration,” ICML 2020: https://proceedings.mlr.press/v119/zhou20a

## Trade-offs

- more expressive;
- substantially more computationally complex;
- uncertainty can be expensive;
- tuning/training stability matters;
- theoretical assumptions differ from ordinary deep-network practice.

---

# 33. Neural Thompson Sampling

## Contribution

Neural Thompson Sampling combines neural reward approximation with randomized uncertainty-driven action selection, using neural tangent feature structure for variance.

Reference: Zhang, Zhou, Li, Gu, “Neural Thompson Sampling”: https://arxiv.org/abs/2010.00827

## Use case

Useful research direction when linear models are clearly inadequate but exploration still must reflect model uncertainty.

---

# 34. Deep Representation + Shallow Bandit

A practical compromise is:

```text
raw context
 ↓ pretrained/frozen neural representation
embedding φ(x,a)
 ↓ linear UCB/TS head
adaptive decision
```

## Motivation

Obtain nonlinear representation power while keeping exploration in a tractable linear last layer.

## Advantages

- simpler uncertainty machinery;
- cheaper than full NeuralUCB;
- representation can be pretrained offline.

## Risk

If representation is updated online, historical covariance statistics may no longer correspond to current features.

Related research: neural contextual bandits with deep representation and shallow exploration: https://arxiv.org/abs/2012.01780

---

# 35. Logistic / Generalized Linear Bandits

## Motivation

Binary rewards may be better modeled by a sigmoid rather than unbounded linear mean.

Example:

\[
P(r=1\mid x,a)=\sigma(x^T\theta).
\]

Generalized linear bandits extend confidence-based exploration to nonlinear link functions with linear predictors.

Use when reward distribution/link structure matters and plain linear prediction is poorly calibrated.

---

# 36. Combinatorial Bandits

## Motivation

An action may be a set/subset rather than one arm:

- choose several recommendations;
- allocate resources to multiple services;
- select portfolio;
- choose test suite subset.

The action space can be exponentially large.

## Contribution

Exploit decomposable reward/feedback or optimization oracles rather than enumerating every composite action.

Research questions:

- semi-bandit feedback (observe component rewards) vs aggregate reward;
- combinatorial constraints;
- efficient oracle for optimistic/sample-based objective.

---

# 37. Constrained / Safe Bandits

## Motivation

Exploration itself may violate budgets or safety requirements.

Examples:

- latency SLO;
- money budget;
- failure-rate ceiling;
- capacity limit.

## Structure

\[
\max \text{reward}
\]

subject to

\[
\text{expected or cumulative cost constraints}.
\]

Approaches include:

- feasibility filters;
- primal-dual/Lagrangian methods;
- conservative baselines;
- constrained Thompson/UCB variants.

A practical production architecture should usually enforce non-negotiable constraints deterministically before bandit scoring.

---

# 38. Offline Evaluation: Why It Is Hard

Suppose historical policy selected action \(a\) and observed reward \(r(a)\). We do not know \(r(b)\) for unchosen \(b\).

Therefore naive evaluation such as “apply new policy to old rows and use observed reward regardless of historical action” is invalid.

The new policy's choices and the old policy's observed outcomes do not align counterfactually.

---

# 39. Replay / Rejection Evaluation

If historical traffic chose actions randomly with known uniform/randomized policy, a simple evaluator can replay events and only keep events where candidate policy chooses the same action as historical log.

Pros:

- conceptually clean under suitable logging assumptions.

Cons:

- data inefficient;
- problematic when action sets are large;
- policy adaptation during replay must mimic online chronology.

The 2010 contextual-bandit news paper emphasized offline evaluation from randomized traffic.

---

# 40. Inverse Propensity Scoring (IPS)

If logging policy selected action \(a_t\) with known probability \(p_t(a_t\mid x_t)\), evaluate target policy \(\pi\) using importance weighting.

For deterministic target policy, a basic estimator uses matched events weighted by

\[
\frac{1}{p_t(a_t\mid x_t)}.
\]

For stochastic target policy:

\[
\frac{\pi(a_t\mid x_t)}{p_t(a_t\mid x_t)}r_t.
\]

## Failure mode

Tiny logging propensities produce huge weights and variance.

This motivates clipping, self-normalization, overlap checks, and doubly robust methods.

---

# 41. Doubly Robust Evaluation

Combine:

- reward model predictions;
- propensity-weighted correction.

The goal is lower variance and robustness if either the reward model or propensity component is sufficiently correct under assumptions.

Production off-policy evaluation should include diagnostics for support/overlap and effective sample size, not only a point estimate.

---

# 42. Logging Requirements

Every bandit decision should record enough information to reconstruct what happened.

Minimum useful schema:

```text
decision_id
timestamp
context / immutable feature values
feature version
available action IDs
chosen action ID
policy version
model version
selection probability / propensity where defined
predicted reward
uncertainty / exploration bonus
final score
exploration reason
reward event(s)
reward timestamp
deduplication status
```

For privacy/security, log only data permitted by policy and minimize sensitive context.

---

# 43. Debugging LinUCB

When LinUCB behaves strangely, inspect:

## Feature norms

\[
\|x\|_2
\]

Large variation can dominate scores.

## Condition number of A

Ill-conditioning implies unstable parameter/uncertainty calculations.

## Mean vs bonus

Log separately:

```text
predicted_mean
exploration_bonus
ucb_score
```

This reveals whether choices are value-driven or uncertainty-driven.

## Eigenvalues / coverage

Small eigenvalues of \(A\) indicate poorly observed feature directions.

## Residuals

Check reward residual against features for nonlinearity, heteroscedasticity, drift.

## Action exposure

Some actions may never become eligible because candidate-generation rules exclude them before LinUCB sees them.

## Reward attribution

Duplicate/delayed/wrongly joined rewards can corrupt sufficient statistics.

---

# 44. Unit Tests for LinUCB

## Test 1 — one-dimensional update

With \(d=1\), calculations can be checked by hand.

## Test 2 — identical features

Two actions with identical model/features should score identically unless they have separate disjoint histories.

## Test 3 — uncertainty shrinks

Repeatedly update on same feature direction; exploration bonus for that direction should decrease.

## Test 4 — orthogonal direction remains uncertain

Observing \([1,0]\) repeatedly should not eliminate uncertainty for \([0,1]\).

## Test 5 — alpha zero

With \(\alpha=0\), LinUCB should reduce to greedy linear prediction.

## Test 6 — reward scaling

Changing reward scale without retuning parameters may change behavior; test/document intended normalization.

## Test 7 — inverse/factor implementation equivalence

Compare optimized implementation to direct `solve` on random small matrices.

---

# 45. Simulation Benchmark

Create synthetic environment with known \(\theta^*\):

\[
r_t=x_{t,a_t}^T\theta^*+\epsilon_t.
\]

At each round generate candidate contexts, compute oracle best action, let policy choose, and accumulate regret.

Compare:

- random;
- epsilon-greedy;
- greedy linear;
- UCB1 where meaningful;
- LinUCB;
- Linear Thompson Sampling;
- nonlinear methods if reward function intentionally nonlinear.

Stress:

- feature dimension;
- noise;
- action count;
- drift;
- delayed rewards;
- model misspecification.

---

# 46. LinUCB Failure Modes

## Linear misspecification

True reward cannot be represented by the supplied features.

Symptom: structured residuals and persistent regret.

Responses:

- interaction features;
- generalized linear bandit;
- learned/frozen representation;
- tree/neural bandit variants.

## Nonstationarity

Old evidence becomes misleading.

Response: forgetting/window/change detection.

## Huge action space

Scoring every action is too expensive.

Response: retrieval/candidate generation.

## Sparse rewards

Learning is slow.

Response: better reward shaping/proxies where valid, priors/shared structure, longer horizon, carefully designed exploration.

## Confounding/feedback loops

Policy changes what data is collected.

Response: randomized exploration and proper off-policy evaluation.

## Unsafe exploration

Trying uncertain actions has unacceptable cost.

Response: constraints, baseline guarantees, staged rollout.

## Feature drift

Changing feature definitions invalidates historical model state.

Response: strict feature versioning/rebuild.

---

# 47. When to Use LinUCB

LinUCB is a strong baseline when:

- decisions repeat frequently;
- context is observed before action;
- immediate reward is the main consequence;
- only selected-action reward is observed;
- useful low/moderate-dimensional features exist;
- reward is approximately linear or locally linear in those features;
- uncertainty-aware exploration is valuable;
- interpretability and computational simplicity matter.

---

# 48. When Not to Use LinUCB

Prefer another method when:

### No exploration is allowed

A static/risk-constrained predictor may be more appropriate.

### Full labels for all actions are available

Supervised learning may use information more efficiently.

### Actions strongly affect future states

Use RL/control/MDP methods.

### Reward relation is strongly nonlinear

Use richer contextual models or learned representations.

### Action space is enormous and unstructured

Need candidate generation/structured optimization before bandit scoring.

### Environment changes faster than learning horizon

A slowly adapting stationary model will fail without forgetting.

---

# 49. AI Engineering Intelligence OS Example

Suppose an engineering-intelligence system receives a task and can choose among strategies:

```text
A: direct LLM reasoning
B: repository search first
C: static analysis first
D: run tests first
E: delegate to coding agent
F: retrieve similar historical task
G: ask specialized security analyzer
```

## Context/features

\[
x=
[
1,
\text{task type},
\text{repo size},
\text{language},
\text{files changed},
\text{historical failure rate},
\text{estimated complexity},
\text{latency budget},
\text{token budget},
\text{CI status},
\ldots
]
\]

## Reward

Possible composite:

\[
r=
+1.0\cdot success
-0.2\cdot normalized\ latency
-0.1\cdot normalized\ token\ cost
-0.2\cdot tool\ failures
-0.5\cdot regression\ introduced.
\]

Hard security/permission rules stay outside reward.

## Architecture

```text
Task
 ↓
feature extraction
 ↓
capability/permission filter
 ↓
candidate strategy retrieval
 ↓
LinUCB / Linear TS
 ↓
selected execution plan
 ↓
state-machine orchestration
 ↓
results/tests/latency/cost
 ↓
reward attribution
 ↓
idempotent online update
```

## Why LinUCB is attractive here

- interpretable features;
- online adaptation;
- uncertainty-aware experimentation;
- low serving overhead relative to large neural routing systems;
- easy baseline for future nonlinear methods.

---

# 50. Hierarchical Bandit Routing

Instead of one huge action set:

```text
level 1: choose strategy family
level 2: choose tool/model inside family
level 3: choose configuration
```

Each level can use a contextual bandit or deterministic rule.

Benefits:

- smaller local action sets;
- feature specialization;
- easier cold start;
- natural organizational structure.

Risk: early hierarchy decision can exclude globally best action. Evaluate end-to-end regret/utility.

---

# 51. Retrieval + LinUCB

For huge action catalogs:

```text
context/task embedding
       ↓
ANN/HNSW retrieve top 100 plausible actions
       ↓
hard constraint filter
       ↓
LinUCB score 20 feasible candidates
       ↓
choose action
```

This combines:

- representation learning;
- approximate search;
- constraints;
- contextual exploration.

Research question: candidate generator changes the action support. Regret relative to all actions decomposes into retrieval loss + bandit decision loss.

---

# 52. Search + Bandit Combination

A bandit can allocate computation among search strategies.

Example actions:

- lexical code search;
- vector code search;
- dependency graph expansion;
- issue/PR history search;
- test failure search.

Context includes task/query properties. Reward measures whether the search produced useful evidence per latency/cost.

This turns orchestration into an adaptive resource-allocation problem.

---

# 53. Bandit over Models / Experts

Treat each model, prompt strategy, or agent as an arm.

Simple MAB is enough if relative quality does not depend strongly on context.

Contextual bandit is better when task properties predict which expert will succeed.

Full RL is needed only if routing choices materially change the future state/decision sequence in ways immediate reward cannot capture.

---

# 54. Meta-Bandit / Algorithm Selection

A research system can treat algorithms themselves as arms:

```text
LinUCB
Linear TS
NeuralUCB
rule-based router
static ranker
```

Context describes environment regime. A meta-controller allocates traffic between policies.

Caution: evaluating learning algorithms as arms creates nonstationarity because each arm itself learns over time. This is more complicated than ordinary stochastic bandits.

---

# 55. Research Roadmap

A disciplined progression for a new adaptive decision problem:

### Stage 0 — static heuristic

Establish deterministic baseline.

### Stage 1 — random / epsilon-greedy

Verify feedback and exploration infrastructure.

### Stage 2 — UCB1

If no context needed, test uncertainty-aware bandit.

### Stage 3 — greedy contextual linear model

Verify features have predictive value.

### Stage 4 — LinUCB

Add contextual uncertainty/exploration.

### Stage 5 — Linear Thompson Sampling

Compare deterministic optimism vs randomized exploration.

### Stage 6 — shared/hybrid/action-feature modeling

Improve generalization/cold start.

### Stage 7 — nonstationary variants

Only if drift is demonstrated.

### Stage 8 — learned representation / neural bandit

Only after showing linear misspecification matters enough to justify complexity.

This sequence creates interpretable baselines and prevents jumping directly to a sophisticated algorithm without knowing whether it is needed.

---

# 56. Implementation Checklist

Before production, answer all of these.

## Problem

- What exactly is an action?
- What context is available before choice?
- Does action affect future state?
- What is the reward and its delay?
- Are rewards bounded/normalized?

## Features

- dimension;
- scaling;
- intercept;
- action/context interactions;
- missing values;
- feature versioning.

## Exploration

- alpha/epsilon/posterior scale;
- minimum/maximum traffic per action;
- safe action set;
- cold-start rules.

## Numerical

- regularization \(\lambda\);
- linear solves/factorizations;
- condition-number monitoring;
- inverse-update strategy;
- dtype.

## Systems

- decision IDs;
- delayed reward join;
- deduplication;
- idempotent updates;
- model persistence;
- rollback;
- distributed consistency.

## Evaluation

- online A/B or interleaving design;
- randomized logging traffic;
- propensities;
- off-policy estimator;
- regret/reward/cost metrics;
- confidence intervals;
- guardrail metrics.

---

# 57. Core References

- Auer, Cesa-Bianchi, Fischer, “Finite-time Analysis of the Multiarmed Bandit Problem,” 2002: https://doi.org/10.1023/A:1013689704352
- Lattimore and Szepesvári, *Bandit Algorithms*: https://tor-lattimore.com/downloads/book/book.pdf
- Li, Chu, Langford, Schapire, “A Contextual-Bandit Approach to Personalized News Article Recommendation,” WWW 2010: https://doi.org/10.1145/1772690.1772758
- Microsoft Research copy of the 2010 contextual-bandit paper: https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/p661.pdf
- Chu, Li, Reyzin, Schapire, “Contextual Bandits with Linear Payoff Functions,” AISTATS 2011: https://proceedings.mlr.press/v15/chu11a.html
- Chapelle and Li, “An Empirical Evaluation of Thompson Sampling,” NIPS 2011: https://papers.nips.cc/paper/2011/hash/e53a0a2978c28872a4505bdb51db06dc-Abstract.html
- Agrawal and Goyal, “Thompson Sampling for Contextual Bandits with Linear Payoffs,” ICML 2013: https://proceedings.mlr.press/v28/agrawal13.html
- Zhou, Li, Gu, “Neural Contextual Bandits with UCB-based Exploration,” ICML 2020: https://proceedings.mlr.press/v119/zhou20a
- Zhang, Zhou, Li, Gu, “Neural Thompson Sampling”: https://arxiv.org/abs/2010.00827
- Bouneffouf and Rish, survey on practical multi-armed/contextual bandit applications: https://arxiv.org/abs/1904.10040
