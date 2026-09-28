# 05 — Probabilistic Inference, Feedback Control, and Reinforcement Learning

This chapter covers algorithms for problems where the system does not know the true state perfectly, outcomes are stochastic, actions influence future states, or control must continuously react to feedback.

---

# 1. Probability as a Representation of Uncertainty

## Motivation

Classical algorithms often assume the input is known exactly. Real systems observe noisy sensors, incomplete logs, uncertain user intent, stochastic demand, delayed rewards, and changing environments.

Probability provides a language for representing uncertainty rather than forcing every unknown into a single point estimate.

A central object is a conditional distribution:

\[
P(X\mid E)
\]

meaning belief about unknown quantity \(X\) given evidence \(E\).

## Contribution

Probabilistic reasoning separates:

- uncertainty about the world;
- uncertainty about model parameters;
- irreducible randomness;
- uncertainty caused by missing observations.

This matters because different uncertainties should lead to different actions. A system that is uncertain may need to gather information rather than simply choose its current best guess.

---

# 2. Bayes' Rule

## Motivation

We need a principled way to update prior beliefs after observing evidence.

## Contribution

Bayes' rule:

\[
P(H\mid E)=\frac{P(E\mid H)P(H)}{P(E)}.
\]

Interpretation:

- prior \(P(H)\): belief before evidence;
- likelihood \(P(E\mid H)\): compatibility of evidence with hypothesis;
- posterior \(P(H\mid E)\): updated belief.

The denominator normalizes the posterior.

## Implementation pattern

For discrete hypotheses:

```python
def bayes_update(prior, likelihood):
    unnormalized = {
        h: prior[h] * likelihood[h]
        for h in prior
    }
    z = sum(unnormalized.values())
    return {h: v / z for h, v in unnormalized.items()}
```

In continuous/high-dimensional settings, exact normalization may be impossible. Approximate inference then uses sampling, variational methods, Laplace approximations, or specialized conjugate models.

## Failure modes

- prior too strong relative to data;
- wrong likelihood model;
- numerical underflow from multiplying tiny probabilities;
- treating posterior uncertainty as calibrated when the model is misspecified.

Use log probabilities for numerical stability:

\[
\log p(x_1,\ldots,x_n)=\sum_i\log p(x_i).
\]

---

# 3. Maximum Likelihood and Maximum A Posteriori Estimation

## Maximum likelihood

Choose parameters maximizing observed-data probability:

\[
\hat\theta_{ML}=\arg\max_\theta P(D\mid\theta).
\]

Equivalent to minimizing negative log-likelihood.

## MAP

Include prior:

\[
\hat\theta_{MAP}
=
\arg\max_\theta P(D\mid\theta)P(\theta).
\]

MAP links probabilistic modeling with regularized optimization. Many familiar regularizers correspond to priors.

Example: Gaussian prior on weights often corresponds to L2 regularization.

---

# 4. Probabilistic Graphical Models

## Motivation

A full joint distribution over many variables can be exponentially complex. Conditional independence allows compact factorization.

### Bayesian networks

Directed acyclic graphs encode conditional dependencies:

\[
P(x_1,\ldots,x_n)=\prod_i P(x_i\mid parents(x_i)).
\]

### Markov random fields

Undirected graphs express factorized compatibility relationships.

## Contribution

Graph structure becomes computational structure for inference.

## Inference algorithms

- variable elimination;
- belief propagation/message passing;
- junction tree;
- sampling/MCMC;
- variational inference.

## Combination ideas

Graphical models can provide calibrated uncertainty upstream of decision algorithms such as bandits or planners.

---

# 5. Markov Chains

## Motivation

Model stochastic evolution where the next state depends only on the current state:

\[
P(S_{t+1}\mid S_t,S_{t-1},\ldots)=P(S_{t+1}\mid S_t).
\]

## Contribution

The Markov property compresses history into a sufficient state representation.

For discrete states, transition matrix \(P\) contains

\[
P_{ij}=P(S_{t+1}=j\mid S_t=i).
\]

A state distribution evolves as

\[
\pi_{t+1}=\pi_t P.
\]

## Stationary distribution

A distribution \(\pi\) satisfying

\[
\pi=\pi P
\]

is stationary. Under suitable irreducibility/aperiodicity conditions, chains can converge toward it.

## Applications

- queueing models;
- ranking;
- reliability;
- MCMC;
- stochastic processes;
- reinforcement learning foundations.

---

# 6. Hidden Markov Models (HMMs)

## Motivation

The real state is often hidden, while observations are noisy emissions from it.

HMM structure:

```text
S1 → S2 → S3 → ...
↓    ↓    ↓
O1   O2   O3
```

## Model

An HMM specifies:

- initial state distribution \(\pi\);
- transition probabilities \(A_{ij}=P(S_{t+1}=j\mid S_t=i)\);
- emission probabilities \(B_j(o)=P(O_t=o\mid S_t=j)\).

## Contribution

HMMs separate a latent discrete process from noisy observations.

Three classical computational problems:

### Evaluation

Compute likelihood of an observation sequence.

Solved efficiently by the **forward algorithm** rather than summing over all state sequences.

### Decoding

Find most likely hidden state sequence.

Solved by **Viterbi dynamic programming**.

### Learning

Estimate parameters from observations when states are hidden.

Baum-Welch is an EM-style algorithm.

## Forward recurrence

Define

\[
\alpha_t(j)=P(o_1,\ldots,o_t,S_t=j).
\]

Then

\[
\alpha_{t+1}(j)=B_j(o_{t+1})\sum_i\alpha_t(i)A_{ij}.
\]

This replaces exponential sequence enumeration with dynamic programming.

## Implementation concerns

Probabilities rapidly underflow. Use scaling or log-space computations.

## Applications

- speech recognition;
- biological sequences;
- activity/state inference;
- anomaly regimes;
- fault-state modeling.

Reference: Rabiner, 1989: https://doi.org/10.1109/5.18626

---

# 7. Kalman Filter

## Motivation

Estimate a continuously valued hidden state from noisy measurements over time.

Linear state-space model:

\[
x_t=F x_{t-1}+B u_t+w_t,
\]

\[
z_t=H x_t+v_t,
\]

with process noise \(w_t\) and measurement noise \(v_t\).

## Contribution

The Kalman filter recursively maintains a Gaussian belief summarized by:

- mean estimate \(\hat x_t\);
- covariance \(P_t\).

It alternates **prediction** and **correction**.

## Prediction

\[
\hat x^-_t=F\hat x_{t-1}+Bu_t
\]

\[
P^-_t=FP_{t-1}F^T+Q.
\]

## Measurement update

Innovation:

\[
y_t=z_t-H\hat x^-_t.
\]

Innovation covariance:

\[
S_t=HP^-_tH^T+R.
\]

Kalman gain:

\[
K_t=P^-_tH^TS_t^{-1}.
\]

Corrected mean:

\[
\hat x_t=\hat x^-_t+K_ty_t.
\]

Corrected covariance:

\[
P_t=(I-K_tH)P^-_t.
\]

## Interpretation

The gain balances trust in model prediction against trust in measurement according to uncertainty.

This is a universal idea:

> combine prediction and evidence weighted by confidence.

## Implementation guidance

- avoid explicit inverses; solve linear systems;
- use Joseph-form covariance update when numerical robustness matters;
- verify covariance stays symmetric/positive semidefinite;
- tune \(Q\) and \(R\) based on real process/measurement uncertainty;
- inspect innovation residuals.

## Extensions

- Extended Kalman Filter (EKF): linearize nonlinear dynamics;
- Unscented Kalman Filter (UKF): propagate sigma points;
- ensemble Kalman methods;
- particle filters for strongly nonlinear/non-Gaussian systems.

Primary reference: Kalman, 1960: https://doi.org/10.1115/1.3662552

---

# 8. Particle Filters

## Motivation

When hidden-state distributions are nonlinear or non-Gaussian, a single Gaussian approximation may be inadequate.

## Contribution

Represent belief with weighted particles:

\[
\{x_t^{(i)},w_t^{(i)}\}_{i=1}^N.
\]

Each cycle:

1. propagate particles through dynamics;
2. weight by measurement likelihood;
3. normalize;
4. resample when weights degenerate.

## Strengths

- flexible distributions;
- multimodality;
- nonlinear models.

## Weaknesses

- expensive in high dimensions;
- particle degeneracy;
- resampling variance.

---

# 9. Feedback Control

## Motivation

Open-loop systems issue commands without correcting for deviations. Real environments have disturbances and model errors.

Closed-loop control measures output and adjusts actions:

```text
reference r(t)
    ↓
error = r-y
    ↓
controller
    ↓ u(t)
plant/system
    ↓
y(t)
    └──── feedback
```

## Contribution

Feedback makes behavior robust to disturbances and imperfect models.

---

# 10. PID Control

## Motivation

A simple controller should respond to present error, accumulated error, and rate of change.

## Contribution

PID control:

\[
u(t)=K_P e(t)+K_I\int_0^t e(\tau)d\tau+K_D\frac{de(t)}{dt}.
\]

### Proportional term

Responds to current error.

### Integral term

Corrects persistent steady-state bias.

### Derivative term

Anticipates rapid error changes and adds damping.

## Implementation issues

- derivative noise amplification;
- integral windup when actuators saturate;
- sampling rate;
- delay;
- tuning gains.

## Modern systems use

PID-like loops appear in autoscaling, congestion control, resource management, thermal control, and robotics.

---

# 11. Model Predictive Control (MPC)

## Motivation

Instead of reacting only to current error, optimize a future action sequence using a model.

At time \(t\):

1. estimate current state;
2. solve finite-horizon constrained optimization;
3. execute only first action;
4. observe new state;
5. repeat.

## Contribution

MPC combines:

- prediction/modeling;
- optimization;
- constraints;
- feedback.

This “receding horizon” structure is a powerful combination pattern for adaptive systems.

## Combination ideas

- Kalman filter for state estimation + MPC for control;
- learned dynamics + MPC;
- bandit/RL for model/parameter selection around an MPC safety core.

---

# 12. Markov Decision Processes (MDPs)

## Motivation

When actions influence both immediate reward and future state, a contextual bandit is insufficient.

An MDP consists of:

\[
(\mathcal{S},\mathcal{A},P,R,\gamma)
\]

where:

- \(\mathcal{S}\): states;
- \(\mathcal{A}\): actions;
- \(P(s'\mid s,a)\): transition distribution;
- \(R(s,a,s')\): reward;
- \(\gamma\): discount factor.

## Contribution

The objective is expected cumulative discounted return:

\[
G_t=\sum_{k=0}^{\infty}\gamma^k R_{t+k+1}.
\]

A policy \(\pi(a\mid s)\) maps states to action distributions.

---

# 13. Value Functions

State value under policy \(\pi\):

\[
V^\pi(s)=\mathbb{E}_\pi[G_t\mid S_t=s].
\]

Action value:

\[
Q^\pi(s,a)=\mathbb{E}_\pi[G_t\mid S_t=s,A_t=a].
\]

These functions convert long-term sequential consequences into scalar quantities that can guide local decisions.

---

# 14. Bellman Equations

## Motivation

Long-term return appears global, but the Markov property creates recursive structure.

For a fixed policy:

\[
V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)
\left[R(s,a,s')+\gamma V^\pi(s')\right].
\]

Optimality equation:

\[
V^*(s)=\max_a\sum_{s'}P(s'\mid s,a)
\left[R(s,a,s')+\gamma V^*(s')\right].
\]

## Contribution

Bellman equations are dynamic programming applied to stochastic sequential decision-making.

---

# 15. Value Iteration

## Motivation

If the MDP model is known and state/action spaces are manageable, repeatedly apply the Bellman optimality backup.

## Update

\[
V_{k+1}(s)=\max_a\sum_{s'}P(s'\mid s,a)
\left[R(s,a,s')+\gamma V_k(s')\right].
\]

Under standard discounted finite-MDP conditions, this converges toward \(V^*\).

## Implementation concerns

- computational cost grows with state/action/transition size;
- sparse transitions should be exploited;
- stopping threshold affects approximation accuracy.

---

# 16. Policy Iteration

Alternate:

1. **policy evaluation** — estimate \(V^\pi\);
2. **policy improvement** — choose greedier actions using that value.

This is a foundational structure repeated in many RL algorithms.

---

# 17. Monte Carlo Reinforcement Learning

## Motivation

What if transition probabilities are unknown but complete episodes can be sampled?

## Contribution

Estimate values from empirical returns rather than a known model.

For a visited state/action, update toward observed return \(G_t\).

Strength:

- unbiased return target under suitable sampling.

Weakness:

- high variance;
- must often wait until episode completion.

---

# 18. Temporal-Difference (TD) Learning

## Motivation

Monte Carlo waits for final outcomes. Dynamic programming bootstraps from known model expectations. TD combines sampling with bootstrapping.

TD(0):

\[
V(S_t)\leftarrow V(S_t)+\alpha
\left[R_{t+1}+\gamma V(S_{t+1})-V(S_t)\right].
\]

The bracketed quantity is the TD error:

\[
\delta_t=R_{t+1}+\gamma V(S_{t+1})-V(S_t).
\]

## Contribution

Learn directly from incomplete experience, online, without a model.

This is one of the central algorithmic innovations in modern RL.

---

# 19. SARSA

On-policy TD control:

\[
Q(S_t,A_t)\leftarrow Q(S_t,A_t)+\alpha
\left[R_{t+1}+\gamma Q(S_{t+1},A_{t+1})-Q(S_t,A_t)\right].
\]

It learns the value of the policy actually being followed, including its exploration behavior.

---

# 20. Q-Learning

## Contribution

Off-policy TD control update:

\[
Q(S_t,A_t)\leftarrow Q(S_t,A_t)+\alpha
\left[R_{t+1}+\gamma\max_aQ(S_{t+1},a)-Q(S_t,A_t)\right].
\]

It learns toward the greedy target policy while behavior can still explore.

## Failure modes in function approximation

The combination of:

- function approximation;
- bootstrapping;
- off-policy learning

can be unstable—the classic “deadly triad.”

Deep Q-learning adds stabilizing mechanisms such as replay buffers and target networks.

---

# 21. Eligibility Traces and TD(λ)

## Motivation

One-step TD assigns credit locally, while Monte Carlo assigns credit using full returns.

TD(\(\lambda\)) interpolates between short- and long-horizon credit assignment through eligibility traces.

This is a recurring pattern: maintain a decaying memory of recently responsible states/features.

---

# 22. Policy Gradient Methods

## Motivation

Instead of learning action values and deriving a policy, directly parameterize policy \(\pi_\theta(a\mid s)\) and optimize expected return.

Policy gradient theorem leads to estimators of the form

\[
\nabla_\theta J(\theta)
=
\mathbb{E}\left[
\nabla_\theta\log\pi_\theta(A_t\mid S_t)\,Q^{\pi}(S_t,A_t)
\right].
\]

## Contribution

Policy gradients naturally handle:

- stochastic policies;
- continuous actions;
- differentiable policy parameterizations.

## Main difficulty

Gradient estimates can have high variance.

Baselines and advantage functions reduce variance without changing the expectation under suitable conditions.

---

# 23. Actor-Critic

## Motivation

Pure policy gradient needs return/value estimates; value-based methods need a policy mechanism.

## Contribution

Maintain two components:

- **actor**: policy parameters;
- **critic**: value estimator.

Critic estimates advantage/TD error; actor updates action probabilities accordingly.

This is a hybrid of value learning and direct policy optimization.

---

# 24. Exploration in Reinforcement Learning

Common strategies:

- epsilon-greedy;
- softmax/Boltzmann exploration;
- optimistic initialization;
- UCB-style bonuses;
- posterior sampling;
- entropy regularization;
- intrinsic motivation;
- count/pseudo-count bonuses.

The exploration problem is harder than contextual bandits because exploratory actions change future state distribution.

---

# 25. Model-Based vs Model-Free RL

## Model-free

Learn values/policies directly from experience.

Pros:

- avoids explicit dynamics model.

Cons:

- often data hungry;
- harder to inspect predicted consequences.

## Model-based

Learn or use transition/reward model and plan through it.

Pros:

- can reuse data for simulated planning;
- supports explicit lookahead.

Cons:

- model bias compounds over multi-step rollouts.

## Combination idea: Dyna

Use real experience to update both a model and a policy/value function; also train from simulated model transitions.

This is a powerful architecture for engineering-intelligence systems: real tool executions are expensive, while learned models can support additional planning.

---

# 26. Partially Observable MDPs (POMDPs)

## Motivation

If state is hidden, the agent cannot condition directly on the true \(s_t\).

## Contribution

Maintain a **belief state**:

\[
b_t(s)=P(S_t=s\mid history).
\]

The belief itself becomes the information state for decision-making.

Exact POMDP planning is computationally difficult, so practical systems use approximations, recurrent models, particle filters, or learned state representations.

---

# 27. Contextual Bandit vs RL

This distinction is critical.

## Contextual bandit

At round \(t\):

```text
observe context x_t
choose action a_t
observe immediate reward r_t
```

The standard model does not require action to affect the next context/state.

## Reinforcement learning

```text
state s_t
  ↓ choose a_t
reward r_t + next state s_{t+1}
  ↓
future consequences depend on a_t
```

Use a contextual bandit when the main decision effect is immediate and the environment context can be treated as externally generated.

Use RL/control when decisions materially change future opportunities/states.

Choosing RL where a contextual bandit suffices can add unnecessary complexity and sample cost.

---

# 28. Reward Design

## Motivation

The optimizer learns what is measured, not what was intended.

A reward might combine:

\[
r=
+w_1(success)
-w_2(latency)
-w_3(cost)
-w_4(error)
-w_5(risk).
\]

## Risks

- proxy gaming;
- scale imbalance;
- delayed credit;
- hidden hard constraints encoded as weak penalties;
- nonstationary business value.

## Recommendation

Use hard constraints for truly forbidden behavior and reward optimization only inside the feasible set when possible.

---

# 29. Offline Evaluation and Off-Policy Learning

Adaptive systems need evaluation without exposing users or systems to every candidate policy.

Methods include:

- importance sampling;
- weighted/self-normalized estimators;
- doubly robust evaluation;
- fitted value methods;
- model-based simulation.

These require careful logging of behavior-policy probabilities/propensities and action availability.

Offline RL is especially difficult because a new policy may choose actions poorly represented in logged data.

---

# 30. Combination Architecture

A robust adaptive control stack can look like:

```text
noisy observations
      ↓
state estimator (Kalman / HMM / learned belief)
      ↓
hard constraints
      ↓
planner / MPC / RL policy
      ↓
action
      ↓
real system
      ↓
measurements + rewards
      └──────── feedback
```

For simpler decisions:

```text
context
  ↓
LinUCB / contextual bandit
  ↓
action
  ↓ immediate reward
```

The modeling question “does action alter the future state?” often decides between these architectures.

---

# 31. Implementation Checklist

For probabilistic/control/RL algorithms document:

- hidden vs observed variables;
- state representation;
- transition assumptions;
- reward definition;
- horizon/discount;
- noise model;
- uncertainty representation;
- exploration policy;
- update cadence;
- delayed reward attribution;
- stationarity assumption;
- safety constraints;
- offline evaluation method;
- model/version logging;
- reset/recovery behavior.

Monitor:

- prediction residuals;
- calibration;
- TD error;
- episode return;
- constraint violations;
- policy entropy;
- state/action coverage;
- reward drift;
- model uncertainty;
- distribution shift.

---

# 32. References

- Kalman, “A New Approach to Linear Filtering and Prediction Problems,” 1960: https://doi.org/10.1115/1.3662552
- Rabiner, “A Tutorial on Hidden Markov Models and Selected Applications in Speech Recognition,” 1989: https://doi.org/10.1109/5.18626
- Sutton and Barto, *Reinforcement Learning: An Introduction*: http://incompleteideas.net/book/the-book-2nd.html
- Sutton publications and historical RL material: https://incompleteideas.net/publications.html
- Boyd and Vandenberghe, *Convex Optimization*: https://web.stanford.edu/~boyd/cvxbook/
