# 03 — Optimization, Randomization, Approximation, Heuristics, and Constraints

This chapter covers the families used when a problem is best expressed as “find the best configuration” rather than “find a particular item.” It connects mathematical optimization, randomized computation, Monte Carlo methods, sampling, approximation, local search, constraint satisfaction, backtracking, and branch-and-bound.

---

# 1. Optimization as a Universal Abstraction

Many problems can be written as

\[
\min_x f(x)
\]

or

\[
\max_x f(x)
\]

subject to constraints such as

\[
g_i(x)\le 0,
\qquad
h_j(x)=0.
\]

The hard part is usually not writing an objective. It is understanding the geometry and structure:

- Is \(x\) continuous, discrete, or mixed?
- Is \(f\) differentiable?
- Is the problem convex?
- Are constraints convex?
- Is the objective noisy or stochastic?
- Is exact optimality necessary?
- Can the objective even be evaluated cheaply?

These answers determine the algorithm family.

---

# 2. Gradient Descent

## Motivation

When a differentiable objective has many parameters, evaluating every possible parameter setting is impossible. The gradient gives a local direction of steepest increase, so its negative points toward local decrease.

## Contribution

The basic update is

\[
x_{t+1}=x_t-\eta_t\nabla f(x_t),
\]

where \(\eta_t\) is the learning rate/step size.

This turns optimization into iterative local improvement using first-order information.

## Implementation

```python
def gradient_descent(x, grad, lr, steps):
    for _ in range(steps):
        x = x - lr * grad(x)
    return x
```

In real systems, step-size selection is central. Too small is slow; too large may oscillate or diverge.

## Convergence intuition

For smooth convex functions, gradient methods have strong convergence guarantees. For nonconvex objectives such as deep networks, they generally seek useful stationary regions rather than guaranteed global optima.

## Failure modes

- poor feature scaling / ill conditioning;
- exploding or vanishing gradients;
- bad learning-rate schedule;
- local minima/saddles in nonconvex problems;
- noisy gradients;
- constraints not respected.

## Modern variants

- stochastic gradient descent (SGD);
- mini-batch SGD;
- momentum;
- AdaGrad;
- RMSProp;
- Adam and related adaptive methods;
- projected gradient methods;
- proximal gradient methods.

## Combination ideas

- gradient optimization + learned representations;
- constrained projection + gradient update;
- bandit feedback + gradient estimation;
- distributed data-parallel gradient computation.

---

# 3. Stochastic Gradient Descent

## Motivation

Computing the exact gradient over a huge dataset can be expensive. If

\[
f(x)=\frac1N\sum_{i=1}^N f_i(x),
\]

we can estimate the full gradient from one or a small batch of samples.

## Contribution

Use a noisy but cheap gradient estimate:

\[
x_{t+1}=x_t-\eta_t\widehat{\nabla f}(x_t).
\]

Noise can slow convergence but allows far more frequent updates and makes massive datasets tractable.

## Implementation considerations

- shuffle or sample carefully;
- track batch size;
- schedule learning rate;
- normalize inputs;
- monitor train/validation loss separately;
- checkpoint optimizer state.

## Research connection

SGD is not only an optimization trick. The stochasticity changes optimization dynamics and can influence which solution basin is reached.

---

# 4. Newton's Method

## Motivation

Gradient descent only uses slope. If curvature is available, a local quadratic model can give a better update.

## Contribution

For twice-differentiable \(f\):

\[
x_{t+1}=x_t-H(x_t)^{-1}\nabla f(x_t),
\]

where \(H\) is the Hessian.

Near a well-behaved optimum, Newton's method can converge extremely quickly.

## Costs

Computing and solving with a \(d\times d\) Hessian can be expensive:

- storage roughly \(O(d^2)\);
- dense linear solve roughly \(O(d^3)\).

Do not explicitly invert matrices in production unless there is a very specific reason. Solve linear systems using stable factorizations.

## Failure modes

- Hessian indefinite away from optimum;
- singular/ill-conditioned Hessian;
- large parameter dimension;
- step may be too aggressive.

Damping, line search, and trust regions improve robustness.

---

# 5. Quasi-Newton Methods: BFGS / L-BFGS

## Motivation

Approximate second-order curvature without constructing the exact Hessian.

## Contribution

BFGS updates an approximation to the inverse Hessian from changes in iterates and gradients. L-BFGS stores only a limited history, making it practical for larger problems.

## When useful

- smooth deterministic optimization;
- moderate/large dimension;
- full-batch objectives where second-order structure matters.

## Combination ideas

Use first-order methods for rough initial progress, then quasi-Newton methods for accurate refinement.

Reference: Nocedal and Wright, *Numerical Optimization*: https://doi.org/10.1007/978-0-387-40065-5

---

# 6. Line Search and Trust Regions

## Line search

Choose a direction \(p_t\), then search for a step length \(\alpha_t\):

\[
x_{t+1}=x_t+\alpha_t p_t.
\]

The algorithm separates “which direction?” from “how far?”

## Trust region

Build a local model and only trust it inside a neighborhood:

\[
\min_p m_t(p) \quad \text{s.t.}\quad \|p\|\le \Delta_t.
\]

If the local model predicts the real improvement well, enlarge the region; otherwise shrink it.

## Why foundational

This is a general pattern:

> make an approximate local model, test whether reality agrees, and adapt the region of trust.

The same principle appears in model-based control, Bayesian optimization, and adaptive planning.

---

# 7. Convex Optimization

## Motivation

Global optimization is difficult in general. Convexity provides structure that turns local reasoning into global reasoning.

A set \(C\) is convex if the line segment between any two points in \(C\) remains in \(C\). A function \(f\) is convex if

\[
f(\theta x+(1-\theta)y)
\le
\theta f(x)+(1-\theta)f(y)
\]

for \(0\le\theta\le1\).

## Contribution

For convex problems:

- any local minimum is global;
- duality gives useful lower bounds and often exact relationships;
- many efficient algorithms exist;
- modeling choices can preserve tractability.

## Important forms

### Linear programming

\[
\min c^Tx \quad \text{s.t. } Ax\le b.
\]

### Quadratic programming

Quadratic objective with linear constraints.

### Conic optimization

Includes second-order cone and semidefinite programs.

## Implementation

Prefer mature solvers for serious convex problems. The research work is often in **formulating** the problem correctly, scaling data, and interpreting dual variables.

Reference: Boyd and Vandenberghe: https://web.stanford.edu/~boyd/cvxbook/

---

# 8. Lagrange Multipliers and Duality

## Motivation

Constraints couple the feasible variables. Lagrange multipliers move constraints into an augmented objective:

\[
\mathcal{L}(x,\lambda,\nu)
=f(x)+\sum_i\lambda_i g_i(x)+\sum_j\nu_j h_j(x).
\]

## Contribution

This creates several deep ideas:

- shadow prices for constraints;
- dual lower bounds;
- decomposition;
- constrained learning via penalties/multipliers;
- primal-dual algorithms.

## Combination ideas

Bandit or RL systems with budgets can maintain adaptive dual prices for resource use while a learner optimizes reward.

---

# 9. Linear Programming

## Motivation

A huge class of allocation, scheduling, flow, blending, and planning problems become linear after the right variables are introduced.

## Contribution

Linear programming provides exact optimization over a convex polytope.

Classical methods include:

- simplex;
- interior-point methods.

## Research use

LP relaxations are also useful when the original problem is discrete. Solve a relaxed continuous problem to obtain:

- a lower/upper bound;
- a heuristic solution;
- guidance for branch-and-bound.

This bridge is fundamental to integer programming.

---

# 10. Integer and Mixed-Integer Programming

## Motivation

Many choices are discrete:

- assign task or not;
- choose server;
- open facility;
- select route;
- activate feature;
- order jobs.

Represent binary choices with \(x_i\in\{0,1\}\).

## Contribution

Mixed-integer programming combines continuous optimization with combinatorial search. Modern solvers use:

- LP relaxations;
- branch-and-bound;
- cutting planes;
- preprocessing;
- primal heuristics;
- conflict analysis.

## Implementation lesson

Model quality matters enormously. Equivalent logical formulations can have very different solver performance because their relaxations differ in strength.

---

# 11. Iterative Improvement / Local Search

## Motivation

When exact optimization is hard, start with a feasible solution and repeatedly modify it.

```text
initial solution
      ↓
choose local modification
      ↓
evaluate
      ↓
accept/reject
      ↓
repeat
```

## Contribution

Local search replaces global enumeration with navigation over a neighborhood graph.

Examples:

- hill climbing;
- coordinate descent;
- 2-opt / k-opt for routing;
- local scheduling moves.

## Failure mode

Local optima: no local move improves the solution even though a much better global solution exists.

## Combination ideas

- multi-start local search;
- random restarts;
- simulated annealing;
- tabu search;
- learned proposal policies;
- local search as a primal heuristic inside exact solvers.

---

# 12. Simulated Annealing

## Motivation

Pure hill climbing gets trapped because it never accepts temporary worsening moves.

## Contribution

Simulated annealing sometimes accepts worse moves, especially early. For energy increase \(\Delta E>0\), a common acceptance probability is

\[
P(accept)=\exp(-\Delta E/T).
\]

The temperature \(T\) decreases over time.

At high temperature the search explores; at low temperature it becomes more exploitative.

## Implementation

```python
import math, random

def anneal(x, score, propose, temp_schedule, steps):
    fx = score(x)
    best, best_fx = x, fx
    for t in range(steps):
        y = propose(x)
        fy = score(y)
        T = temp_schedule(t)
        if fy < fx or random.random() < math.exp(-(fy - fx) / max(T, 1e-12)):
            x, fx = y, fy
        if fx < best_fx:
            best, best_fx = x, fx
    return best
```

## Failure modes

- cooling too fast → behaves like greedy local search;
- cooling too slowly → expensive;
- neighborhood proposal too weak;
- objective scaling makes acceptance probabilities meaningless.

Primary reference: Kirkpatrick, Gelatt, Vecchi, 1983: https://doi.org/10.1126/science.220.4598.671

---

# 13. Evolutionary Algorithms

## Motivation

Search complicated non-differentiable spaces using a population of candidate solutions.

## Core mechanism

1. initialize population;
2. evaluate fitness;
3. select parents;
4. recombine/mutate;
5. form next generation;
6. repeat.

## Contribution

Evolutionary methods provide flexible derivative-free search and naturally support discrete or structured candidates.

## Multi-objective optimization

Instead of combining every goal into one weighted score, Pareto methods maintain solutions that trade objectives differently.

A solution dominates another if it is no worse in all objectives and better in at least one.

NSGA-II is a widely studied multi-objective evolutionary algorithm using nondominated sorting and diversity preservation.

Reference: Deb et al., NSGA-II, 2002: https://doi.org/10.1109/4235.996017

## Failure modes

- expensive fitness evaluation;
- poor representation/operators;
- premature convergence;
- hyperparameter sensitivity;
- no guarantee of exact optimality.

---

# 14. Randomized Algorithms

## Motivation

Randomness can simplify logic, avoid adversarial structure, or reduce expected runtime.

There are two broad kinds.

### Las Vegas algorithms

Always correct; runtime is random.

Example: randomized quicksort has deterministic correctness but random performance based on pivot choices.

### Monte Carlo algorithms

Runtime may be bounded, but the answer may have a small probability of error.

## Contribution

Randomization can provide:

- symmetry breaking;
- expected performance guarantees;
- simpler algorithms;
- sampling-based approximation;
- robustness against worst-case ordering.

Reference: Motwani and Raghavan, *Randomized Algorithms*: https://doi.org/10.1017/CBO9780511814075

---

# 15. Monte Carlo Methods

## Motivation

Some quantities are difficult to compute analytically but easy to estimate from random samples.

For expectation

\[
\mu=\mathbb{E}[f(X)],
\]

estimate

\[
\hat\mu_N=\frac1N\sum_{i=1}^N f(X_i).
\]

Under standard conditions, estimation error typically decreases on the order of \(1/\sqrt{N}\), independent of many geometric details that make deterministic high-dimensional integration difficult.

## Contribution

Monte Carlo turns numerical problems into statistical estimation.

Applications:

- integration;
- uncertainty propagation;
- Bayesian inference;
- simulation;
- planning;
- risk analysis;
- rendering.

Primary historical reference: Metropolis and Ulam, “The Monte Carlo Method,” 1949: https://doi.org/10.1080/01621459.1949.10483310

---

# 16. Sampling

## Motivation

Processing all data or states may be impossible.

## Core question

Can a smaller sample preserve the statistic or property we care about?

Important forms:

- uniform random sampling;
- stratified sampling;
- importance sampling;
- reservoir sampling;
- MCMC;
- bootstrap resampling.

## Importance sampling

If samples come from proposal \(q(x)\) instead of target \(p(x)\), reweight:

\[
\mathbb{E}_p[f(X)]
=
\mathbb{E}_q\left[f(X)\frac{p(X)}{q(X)}\right].
\]

This can drastically reduce variance if \(q\) focuses on important regions, or catastrophically increase variance if weights become extreme.

## Reservoir sampling

Maintain a uniform sample of fixed size from a stream whose total length is unknown in advance.

This is a foundational streaming pattern.

---

# 17. Approximation Algorithms

## Motivation

For many NP-hard optimization problems, exact solutions may be impractical at realistic scale.

## Contribution

Approximation algorithms provide polynomial-time solutions with provable quality relative to optimum.

For minimization, an \(\alpha\)-approximation satisfies something like

\[
ALG\le \alpha OPT.
\]

This is fundamentally different from an unproven heuristic.

## Design techniques

- greedy approximation;
- LP relaxation + rounding;
- primal-dual algorithms;
- local search with bounds;
- randomized rounding.

## Research value

Approximation theory teaches which part of an exact problem is expensive and what quality can be guaranteed if exactness is relaxed.

---

# 18. Heuristics

## Motivation

Domain knowledge can guide search even when no formal approximation guarantee exists.

A heuristic is a rule that predicts which action/state is promising.

Examples:

- A* distance estimate;
- move ordering in game search;
- scheduling priority rules;
- learned ranking scores;
- greedy initialization for an optimizer.

## Contribution

Heuristics exchange formal certainty for practical efficiency.

## Evaluation discipline

A heuristic should be evaluated against:

- trivial baseline;
- random baseline;
- exact solver on small instances;
- known upper/lower bound;
- adversarial examples;
- ablations.

Never infer general quality only from a few favorable examples.

---

# 19. Constraint Satisfaction Problems (CSPs)

## Motivation

Many problems ask for values satisfying rules rather than maximizing a smooth objective.

A CSP consists of:

- variables \(X_1,\ldots,X_n\);
- domains \(D_i\);
- constraints over subsets of variables.

Examples:

- scheduling;
- timetabling;
- configuration;
- Sudoku;
- resource assignment.

## Contribution

CSP methods exploit constraint propagation to remove impossible values before explicit search.

### Forward checking

After assigning a variable, remove inconsistent values from neighboring domains.

### Arc consistency

Ensure each remaining value has compatible support in related domains.

### Variable ordering

“Most constrained variable first” can dramatically reduce branching.

### Value ordering

Try values that leave the most flexibility first.

## Combination ideas

Constraint propagation + backtracking is much stronger than blind search.

---

# 20. SAT Solving

## Motivation

Boolean satisfiability asks whether a Boolean formula has an assignment that makes it true.

Despite worst-case hardness, modern SAT solvers are extraordinarily effective on many structured instances.

## Contribution

Modern CDCL-style SAT solvers combine:

- Boolean constraint propagation;
- branching decisions;
- conflict analysis;
- learned clauses;
- non-chronological backtracking;
- restart strategies;
- activity-based heuristics.

This is a striking example of a hard theoretical problem becoming practical through layered algorithmic ideas.

## Combination ideas

SAT/SMT solvers can serve as hard-constraint layers around learned or heuristic systems.

---

# 21. Backtracking

## Motivation

Build a solution incrementally, but stop exploring a partial assignment as soon as it cannot lead to a valid complete solution.

## Contribution

Backtracking is structured exhaustive search with early pruning.

```python
def backtrack(state):
    if complete(state):
        return state

    for choice in choices(state):
        apply(state, choice)
        if consistent(state):
            result = backtrack(state)
            if result is not None:
                return result
        undo(state, choice)
    return None
```

## Key engineering insight

The algorithm's performance is determined less by the recursion and more by:

- variable ordering;
- value ordering;
- pruning strength;
- symmetry breaking;
- incremental constraint checks.

---

# 22. Branch and Bound

## Motivation

Backtracking prunes infeasible branches. Optimization also allows pruning branches that are feasible but cannot possibly beat the best solution already found.

## Contribution

Maintain:

- incumbent best feasible value;
- bound on the best possible completion of each partial branch.

For minimization, if

\[
LB(branch)\ge incumbent,
\]

that branch cannot improve the incumbent and can be discarded.

## Implementation structure

```text
branch
  ↓
compute relaxation/bound
  ↓
bound cannot beat incumbent? → prune
  ↓ no
is complete? → update incumbent
  ↓ no
split into child branches
```

## Critical components

- strong but cheap bounds;
- branching rule;
- node selection rule;
- good initial incumbent;
- presolve and propagation.

## Historical reference

Land and Doig's 1960 method for discrete programming is a foundational branch-and-bound reference.

---

# 23. Bayesian Optimization

## Motivation

What if evaluating \(f(x)\) is expensive—minutes, hours, physical experiments, or costly model training—and gradients are unavailable?

## Contribution

Bayesian optimization maintains a surrogate model with uncertainty and chooses the next evaluation by an acquisition function.

Common acquisition ideas:

- expected improvement;
- probability of improvement;
- upper/lower confidence bounds.

This is conceptually close to bandits:

\[
\text{choose where to evaluate based on value + uncertainty}.
\]

## Combination ideas

- optimize hyperparameters;
- choose expensive experiment settings;
- use contextual bandit policies for repeated decisions and Bayesian optimization for slower global configuration.

---

# 24. Choosing the Family

| Problem property | Candidate methods |
|---|---|
| Smooth, continuous, large-scale | SGD / first-order methods |
| Smooth and moderate dimension | Newton / quasi-Newton |
| Convex constraints/objective | convex optimization |
| Linear objective/constraints | LP |
| Discrete choices with exactness important | MIP / branch-and-bound |
| Hard constraints, feasibility focus | CSP / SAT / SMT |
| Expensive black-box objective | Bayesian optimization |
| Non-differentiable black-box | evolutionary/local/randomized methods |
| Need provable near-optimality for NP-hard problem | approximation algorithm |
| Simulation/sample access | Monte Carlo / sampling |

---

# 25. Combination Research Patterns

## Constraint filter + learned optimizer

Keep safety/feasibility deterministic:

```text
all actions
   ↓ CSP/rules
feasible actions
   ↓ bandit / optimizer
chosen action
```

## Learned heuristic + exact search

Train a model to prioritize branches but retain exact pruning/correctness logic.

## LP relaxation + rounding + local search

Use optimization to get a global continuous picture, round to a discrete solution, then improve locally.

## Bandit over heuristics

Treat multiple solvers/heuristics as arms and learn which works best for different instance contexts.

## Monte Carlo + control/search

Use simulation to estimate action values where closed-form models are unavailable.

---

# 26. Implementation Checklist

For any optimization/search method document:

- decision variables;
- objective direction and units;
- hard vs soft constraints;
- feasible-set representation;
- differentiability;
- convexity;
- stochasticity/noise;
- initialization;
- stopping criterion;
- optimality gap or regret metric;
- numerical scaling;
- randomness/seeds;
- timeout behavior;
- constraint violation handling;
- reproducible benchmark set.

---

# 27. References

- Boyd and Vandenberghe, *Convex Optimization*: https://web.stanford.edu/~boyd/cvxbook/
- Nocedal and Wright, *Numerical Optimization*: https://doi.org/10.1007/978-0-387-40065-5
- Motwani and Raghavan, *Randomized Algorithms*: https://doi.org/10.1017/CBO9780511814075
- Metropolis and Ulam, “The Monte Carlo Method,” 1949: https://doi.org/10.1080/01621459.1949.10483310
- Kirkpatrick, Gelatt, Vecchi, “Optimization by Simulated Annealing,” 1983: https://doi.org/10.1126/science.220.4598.671
- Deb et al., “A fast and elitist multiobjective genetic algorithm: NSGA-II,” 2002: https://doi.org/10.1109/4235.996017
- MIT 6.046J notes on LP, approximation, flow, matching: https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/lecture-notes/
