# 09 — Combination Research Map: Building New Systems from Foundation Algorithms

This chapter is the synthesis layer of the collection. Its purpose is not to introduce one more isolated algorithm, but to show how foundational algorithms can be combined into new systems, how to tell whether a combination is coherent, and how to design research that can establish whether the combination actually improves anything.

A recurring principle throughout this repository is:

> Most modern systems are not one algorithm. They are compositions of representation, retrieval, constraints, optimization, decision-making, state management, feedback, and reliability mechanisms.

The research opportunity often lies in the interfaces between these mechanisms.

---

# 1. Coverage Map of the Foundational Ideas

The original foundation list is covered across the collection as follows.

| # | Foundation | Main chapter(s) | Core role |
|---:|---|---|---|
| 1 | Exhaustive search | 01 | correctness baseline, oracle, complete enumeration |
| 2 | Divide and conquer | 01 | recursive independent subproblem decomposition |
| 3 | Decomposition | 01, 09 | split complex systems into compatible modules |
| 4 | Recursion | 01 | self-similar problem definitions and traversal |
| 5 | Greedy algorithms | 01 | locally optimal choice under provable structure |
| 6 | Dynamic programming | 01, 05 | reuse overlapping subproblems / Bellman structure |
| 7 | Search | 02 | explore state/action spaces |
| 8 | Graph algorithms | 02 | model relations, dependencies, paths, flows |
| 9 | Sorting | 02 | transform data into an order enabling cheaper operations |
| 10 | Selection/ranking | 02 | top-K, kth element, priority processing |
| 11 | Hashing | 02, 07 | fast lookup, signatures, partitioning, deduplication |
| 12 | Indexing | 02, 06 | preprocessing to make repeated queries cheap |
| 13 | Optimization | 03 | maximize/minimize objectives under constraints |
| 14 | Gradient-based learning | 03 | iterative differentiable optimization |
| 15 | Iterative improvement | 03 | improve a solution locally over repeated updates |
| 16 | Randomization | 03 | break adversarial structure, sample, explore |
| 17 | Sampling | 03, 04 | approximate large populations/streams |
| 18 | Approximation | 03, 06 | trade exactness for compute, memory, latency |
| 19 | Heuristics | 02, 03 | inject domain knowledge into search/optimization |
| 20 | Constraint satisfaction | 03 | enforce discrete logical feasibility |
| 21 | Backtracking | 03 | systematic search with early infeasibility pruning |
| 22 | Branch and bound | 03 | exact optimization with bounds/pruning |
| 23 | State machines | 04, 07 | explicit lifecycle and deterministic transitions |
| 24 | Event-driven processing | 04 | reactive decoupled computation |
| 25 | Queues and scheduling | 04 | allocate limited resources among competing work |
| 26 | Caching | 04 | reuse expensive results |
| 27 | Streaming | 04 | compact online processing of unbounded data |
| 28 | Map → Filter → Reduce | 04 | composable/parallel data transformation |
| 29 | Probabilistic inference | 05 | reason under uncertainty |
| 30 | Feedback and control | 05 | continuously correct deviations from target |
| 31 | Reinforcement learning | 05 | optimize sequential decisions with future-state effects |
| 32 | Representation learning | 06 | learn features that simplify downstream decisions |
| 33 | Similarity search | 06 | retrieve semantically/geometrically nearby objects |
| 34 | Compression | 06 | exploit redundancy to reduce storage/bandwidth |
| 35 | Parsing | 06 | convert sequences into structured representations |
| 36 | Transformation pipelines | 06 | stage computations through purpose-specific representations |
| 37 | Consensus | 07 | agree on ordered state despite failures |
| 38 | Replication | 07 | maintain redundant copies for reliability/scale |
| 39 | Sharding/partitioning | 07 | distribute state/work horizontally |
| 40 | Retry, timeout, idempotency | 07 | survive ambiguous remote failures safely |
| 41 | Voting and aggregation | 07 | combine several observations/participants |
| 42 | Exploration vs exploitation | 08 | learn while making reward-bearing decisions |
| — | LinUCB / contextual bandits | 08 | context-aware uncertainty-driven online selection |

This table should be used as an index of primitives. The rest of this chapter focuses on composition.

---

# 2. The Universal Modern-System Pipeline

A surprisingly large number of systems can be mapped to this architecture:

```text
raw input / environment
          ↓
[1] representation
          ↓
[2] retrieval / candidate generation / search
          ↓
[3] feasibility / hard constraints
          ↓
[4] ranking / optimization / adaptive policy
          ↓
[5] planning / scheduling
          ↓
[6] execution through state machine
          ↓
[7] event stream / telemetry
          ↓
[8] reward / outcome attribution
          ↓
[9] online learning / model update
          ↓
[10] durable replicated state / memory
          ↺
```

Typical algorithm choices at each layer:

| Layer | Foundation algorithms |
|---|---|
| Representation | feature engineering, PCA, neural embeddings, parsing, graphs |
| Candidate generation | inverted index, HNSW, hashing, BFS/DFS, A*, top-K |
| Feasibility | rules, CSP, SAT/SMT, LP/MIP constraints |
| Ranking/selection | supervised ranker, greedy, optimization, LinUCB, Thompson Sampling |
| Planning | graph search, dynamic programming, MPC, MIP, RL |
| Scheduling | priority queues, EDF, fair scheduling, bandit routing |
| Execution | state machines, event-driven architecture, sagas |
| Telemetry | streaming algorithms, sketches, MapReduce/dataflow |
| Learning | regression, SGD, Bayesian inference, contextual bandits, RL |
| Durable coordination | replication, Raft/Paxos, idempotency, sharding |

The architecture is deliberately modular. A research proposal can replace one layer while holding others constant.

---

# 3. The Interface Contract Between Algorithms

Before combining two algorithms, define the interface explicitly.

A useful module contract is

\[
M=(I,O,S,U,T,C,F),
\]

where:

- \(I\): input representation;
- \(O\): output representation;
- \(S\): persistent state;
- \(U\): uncertainty representation;
- \(T\): time/update semantics;
- \(C\): constraints/guarantees;
- \(F\): failure semantics.

A combination is dangerous when these contracts are incompatible.

## Example: HNSW → LinUCB

HNSW outputs a candidate set based on embedding distance.

LinUCB assumes the action set it receives contains meaningful alternatives and scores them using contextual reward features.

The full system's quality is limited by both stages:

\[
\text{total decision loss}
\approx
\text{candidate-retrieval loss}
+
\text{ranking/decision loss}.
\]

If the optimal action is never retrieved, no bandit can choose it.

---

# 4. Eight Dimensions That Must Align

## 4.1 State representation

Do components mean the same thing by “state”?

A graph planner may use exact node identity while a neural model uses a latent vector. Conversion between them must preserve the information needed by downstream rules.

## 4.2 Time horizon

A contextual bandit optimizes immediate reward. RL/MPC reason about future consequences. Combining them carelessly can create conflicting objectives.

## 4.3 Information availability

Does a component receive full feedback, bandit feedback, delayed feedback, or partial observations?

A downstream learner cannot use counterfactual labels that the upstream policy never generated.

## 4.4 Objective

Local metrics must align with end-to-end utility.

Example:

- candidate retriever optimizes semantic recall;
- ranker optimizes click probability;
- system actually cares about successful task completion.

Improving either local metric might reduce the final objective.

## 4.5 Uncertainty

If one model outputs uncertainty, is it calibrated enough for the downstream exploration/planning algorithm to trust?

## 4.6 Stationarity

A learning module changes the data distribution experienced by another module. Two adaptive components can make each other's environment nonstationary.

## 4.7 Compute/latency budget

An algorithmically stronger method may be unusable if it violates serving or planning deadlines.

## 4.8 Safety/consistency

Learning algorithms should not own invariants that must never be violated. Hard constraints and distributed consistency should be guaranteed by deterministic/verifiable layers whenever possible.

---

# 5. Composition Pattern A — HNSW + LinUCB

## Motivation

A contextual bandit can choose intelligently among candidates, but scoring millions of actions is too expensive. ANN retrieval can reduce the action space, but pure embedding similarity does not adapt to downstream reward.

Combine them:

```text
query/context
   ↓ embedding model
query vector
   ↓ HNSW
high-recall candidate set
   ↓ hard filters
feasible set
   ↓ LinUCB
adaptive final action
```

## Contribution

The two algorithms solve different bottlenecks:

- HNSW addresses **scale and retrieval latency**;
- LinUCB addresses **reward optimization and exploration**.

The composition separates semantic plausibility from empirical utility.

## Implementation

### Retrieval features

Use embedding \(e(x)\) and ANN metric.

### Bandit features

Construct richer \(\phi(context, action)\), possibly including:

- ANN similarity score;
- rank position;
- action metadata;
- task/action interactions;
- historical reliability;
- cost/latency estimates.

### Logging

Log both:

- complete retrieved candidate set;
- final feasible candidate set.

Otherwise you cannot tell whether a failure came from retrieval or ranking.

### Evaluation decomposition

Measure:

1. retrieval recall of oracle/best-known action;
2. conditional bandit regret given candidate set;
3. end-to-end reward;
4. latency/memory.

## Research questions

- How large must candidate set \(K\) be before bandit regret dominates retrieval loss?
- Can LinUCB uncertainty feed back into ANN exploration, requesting broader retrieval when uncertainty is high?
- Should embedding similarity be a bandit feature or only a candidate-generation signal?
- How often can embeddings be updated without invalidating both index and bandit statistics?

---

# 6. Composition Pattern B — Embeddings + Graph Search

## Motivation

Vector similarity finds semantically related objects but may ignore explicit structure. Graph traversal respects structure but requires good starting nodes.

Combine them:

```text
query
 ↓ embedding search
seed nodes
 ↓ dependency/knowledge graph expansion
structurally connected candidates
 ↓ ranking/search
results
```

## Contribution

The vector stage gives fuzzy semantic entry points. The graph stage adds explicit relations and constraints.

## Implementation example: code intelligence

1. Embed task/query.
2. Retrieve functions/files with HNSW.
3. Expand callers, callees, imports, tests, ownership, recent commits.
4. Score expanded subgraph.
5. Pass selected context to planner/agent.

## Research questions

- How many hops maximize useful context before noise dominates?
- Should edge types have learned weights?
- Can a contextual bandit choose which relation type to expand next?
- Can A* use learned relevance as a heuristic over dependency graphs?

---

# 7. Composition Pattern C — Constraint Solver + Contextual Bandit

## Motivation

Bandits should explore, but many actions are invalid, unsafe, unaffordable, or unavailable.

## Contribution

Separate feasibility from preference:

```text
all actions
  ↓ deterministic constraints
safe/feasible actions
  ↓ LinUCB / Thompson Sampling
best adaptive feasible action
```

This architecture makes the feasible set

\[
\mathcal{A}_{safe}(x)
=
\{a:C_j(x,a)=true\;\forall j\}.
\]

The bandit solves only

\[
\max_{a\in\mathcal{A}_{safe}(x)} UCB(x,a).
\]

## Implementation

Constraints may include:

- permissions;
- required capability;
- latency ceiling;
- budget;
- data residency;
- dependency availability;
- rate limits.

For simple rules, ordinary predicates suffice. Complex discrete dependencies may use CSP/SAT/MIP.

## Research contribution

This combination lets exploration happen without turning mandatory rules into reward penalties.

## Research questions

- Can dual prices from constrained optimization become features for the bandit?
- How should the learner behave when the feasible set changes rapidly?
- Can uncertainty in constraint estimates be modeled separately from reward uncertainty?

---

# 8. Composition Pattern D — A* + Learned Heuristic

## Motivation

A* can be exact/optimal under appropriate heuristic conditions, but handcrafted heuristics may be weak. Machine learning can estimate remaining cost from historical solved instances.

## Contribution

Combine structured search with learned guidance:

\[
f(n)=g(n)+\hat h_\theta(n).
\]

The search algorithm preserves explicit state transitions and path costs, while learning improves prioritization.

## Implementation variants

### Safe admissible heuristic

Learn a heuristic and transform/bound it so admissibility is preserved. Difficult but retains classical guarantees.

### Weighted / bounded-suboptimal search

Allow controlled heuristic aggressiveness:

\[
f(n)=g(n)+w h(n),\quad w>1.
\]

### Learned tie-breaking

Keep admissible primary score but use learned model only to order equal/near-equal nodes.

### Search policy learning

Train a model to predict promising expansions while retaining fallback search.

## Evaluation

Measure:

- path quality;
- node expansions;
- wall-clock latency;
- memory;
- failure rate under distribution shift.

## Research questions

Can contextual bandits select among multiple heuristics per problem instance? Can uncertainty trigger fallback to conservative search?

---

# 9. Composition Pattern E — Kalman Filter + MPC

## Motivation

A controller needs state, but sensors are noisy. MPC can optimize future constrained actions, but only if its initial state estimate is useful.

## Contribution

Classic estimator-controller separation:

```text
measurements
    ↓ Kalman filter
state estimate + covariance
    ↓ MPC
optimized action
    ↓ plant
new measurements
```

The Kalman filter solves **state estimation**. MPC solves **constrained planning/control**.

## Implementation

1. Filter observations into \(\hat x_t,P_t\).
2. Initialize MPC optimization from \(\hat x_t\).
3. Optionally use covariance to tighten safety constraints or adapt planning conservatism.
4. Execute first action.
5. Repeat at next control step.

## Research extensions

- learned dynamics inside MPC;
- learned measurement model inside filter;
- bandit chooses among model/controller configurations;
- RL learns residual corrections while MPC enforces constraints.

## Caution

If learned residuals can bypass the safety controller, the guarantee is lost. Define action authority clearly.

---

# 10. Composition Pattern F — Model Predictive Control + Reinforcement Learning

## Motivation

MPC is sample-efficient and constraint-friendly when a good model exists. RL can adapt to unknown dynamics/reward but may require much more data.

## Combination strategies

### RL learns the model

Learn \(\hat P\) / dynamics, then plan with MPC.

### RL learns a residual controller

\[
a=a_{MPC}+\Delta a_{RL}.
\]

Bound \(\Delta a\) to preserve safety.

### RL tunes MPC parameters

Learn horizon, cost weights, or model selection at a slower time scale.

### MPC generates demonstrations

Use the controller as an expert for imitation/pretraining.

## Research question

Which component should adapt fast, and which should remain a stable safety anchor?

---

# 11. Composition Pattern G — Event Sourcing + Online Learning

## Motivation

Online learners need chronologically correct historical decisions and outcomes. Operational systems need audit and replay.

Event sourcing can provide both.

## Contribution

Record immutable decision lifecycle events:

```text
DecisionCreated
CandidateSetComputed
ActionChosen
ActionStarted
ActionSucceeded / ActionFailed
RewardObserved
ModelUpdated
```

A materialized state view serves the application; the log preserves learning history.

## Implementation

Each decision event should include immutable IDs and version metadata. Reward update consumers must be idempotent.

The learning dataset becomes a projection over the event stream rather than an ad hoc collection of mutable tables.

## Benefits

- reproducible policy replay;
- delayed reward attribution;
- debugging;
- counterfactual evaluation when propensities are logged;
- rebuilding model state after corruption.

## Risks

- schema evolution;
- privacy/deletion requirements;
- duplicate reward events;
- replaying external side effects accidentally.

---

# 12. Composition Pattern H — Streaming Sketches + Adaptive Cache

## Motivation

A cache wants to retain valuable items, but exact frequency statistics for every key can consume too much memory.

## Contribution

Use streaming sketches to estimate demand and drive admission/eviction decisions.

```text
requests
  ↓ Count-Min / frequency sketch
estimated popularity
  ↓ cache admission policy
cache
```

## Implementation idea

- frequency sketch estimates recent frequency;
- candidate new item competes with potential victim;
- admit only if estimated future value is higher;
- maintain recency information separately if needed.

## Research extension

Use contextual bandit to choose among eviction/admission policies based on workload regime.

Features:

- request-rate distribution;
- working-set estimate;
- read/write ratio;
- object size;
- cost of miss.

Reward:

- latency saved;
- backend cost saved;
- weighted hit ratio.

---

# 13. Composition Pattern I — Branch-and-Bound + Learned Heuristics

## Motivation

Exact combinatorial solvers spend enormous effort deciding:

- which node to explore;
- which variable to branch on;
- which heuristic solution to try;
- which cuts to prioritize.

Machine learning can predict promising choices without replacing exact bounds/correctness.

## Contribution

Keep mathematical bounds as the correctness layer; learn search ordering.

```text
branch-and-bound tree
        ↓
learned branching/node heuristic
        ↓
prioritize promising subproblems
        ↓
exact bounds still prune/prove
```

## Implementation

Training data can come from solved instances:

- state features at branching point;
- candidate branching choices;
- downstream tree size/time/objective improvement.

Use supervised learning, imitation, contextual bandits, or RL depending on whether delayed tree-wide effects matter.

## Research question

Is the branching decision primarily immediate (bandit-like) or long-horizon (RL-like)? It often has delayed consequences, so full sequential methods may eventually be justified.

---

# 14. Composition Pattern J — Dynamic Programming + Function Approximation

## Motivation

Exact DP tables become impossible when state spaces are huge or continuous.

## Contribution

Replace explicit table

\[
V(s)
\]

with parametric approximation

\[
V_\theta(s).
\]

Then use Bellman-derived targets to train it.

This is the bridge from classical DP to modern value-based reinforcement learning.

## Implementation progression

1. solve small exact DP instances;
2. collect state/value pairs;
3. fit function approximator;
4. use approximation to guide larger search/planning;
5. optionally bootstrap online with TD learning.

## Risks

Approximation error is fed back through Bellman updates and can compound or become unstable, especially off-policy.

---

# 15. Composition Pattern K — MapReduce/Dataflow + Distributed Learning

## Motivation

Model training/feature computation over massive datasets requires distributed data processing.

## Contribution

Separate:

- feature extraction;
- sufficient-statistic aggregation;
- model update.

For linear regression/bandit warm starts, workers can compute local statistics:

\[
A_i=\sum_{j\in shard_i}x_jx_j^T,
\qquad
b_i=\sum_{j\in shard_i}r_jx_j.
\]

Then aggregate:

\[
A=\lambda I+\sum_i A_i,
\qquad
b=\sum_i b_i.
\]

This demonstrates that sufficient statistics often compose naturally under reduction.

## Research extension

Use streaming incremental statistics for online updates and batch recomputation as a numerical/checkpoint correction.

---

# 16. Composition Pattern L — Bayesian Inference + Thompson Sampling

## Motivation

Thompson Sampling needs a distribution over plausible reward models. Bayesian inference provides exactly that.

## Contribution

Posterior uncertainty is not merely reported; it directly controls exploration.

```text
prior
  ↓ data
posterior over reward model
  ↓ sample plausible model
optimize action under sample
  ↓
observe reward
  ↺ Bayes update
```

This is an elegant composition because the uncertainty representation and decision mechanism are mathematically aligned.

## Research extension

Hierarchical Bayesian models can share statistical strength across related actions while preserving uncertainty for cold-start arms.

---

# 17. Composition Pattern M — Ensemble / Voting + Uncertainty

## Motivation

Multiple models/agents may have different errors.

## Contribution

Aggregate outputs using:

- majority vote;
- weighted vote;
- mean/median;
- stacking;
- Bayesian model averaging;
- confidence-aware arbitration.

## Research direction

Treat experts as contextual-bandit arms rather than always averaging them. This allows the system to learn **which expert is useful for which context**.

However, expert outputs may be correlated. Diversity must be measured, not assumed.

---

# 18. Composition Pattern N — Parsing + Graph + Retrieval + Planning

## Motivation

Source code, SQL, configuration, and structured documents have syntax and semantics that raw text embeddings alone may miss.

## Architecture

```text
source text
  ↓ parser
AST / structured IR
  ↓ static analysis
symbol/dependency graph
  ↓ embeddings/index
semantic + structural retrieval
  ↓ planner
changes/actions
```

## Contribution

Each representation serves a different purpose:

- parser preserves syntax;
- graph preserves explicit relations;
- embeddings expose fuzzy similarity;
- planner makes decisions.

## Research question

Which representation should be used at each stage rather than forcing one representation to solve every problem?

---

# 19. Composition Pattern O — Search + Monte Carlo

## Motivation

In games/planning, exhaustive tree search is too large and exact value evaluation is unavailable.

## Contribution

Monte Carlo Tree Search (MCTS) allocates simulations selectively through the search tree.

A common selection idea is UCB applied to tree actions:

\[
score_i
=
\bar X_i
+
C\sqrt{\frac{\ln N}{n_i}}.
\]

This is a major conceptual connection:

> bandit exploration can decide where a tree-search algorithm should spend computation.

## Stages

1. selection;
2. expansion;
3. simulation/evaluation;
4. backpropagation.

## Combination ideas

- neural policy/value model + MCTS;
- learned representation + MCTS;
- constraint filter + MCTS;
- distributed rollouts.

This family demonstrates how “exploration vs exploitation” can allocate **computation**, not only real-world actions.

---

# 20. Composition Pattern P — Bayesian Optimization + Expensive Engineering Experiments

## Motivation

Some decisions are repeated only tens/hundreds of times because each evaluation is expensive: benchmark a full architecture, retrain a model, run a deployment experiment.

## Contribution

Use a probabilistic surrogate and acquisition function to decide which configuration to evaluate next.

This differs from LinUCB:

- Bayesian optimization often searches a continuous/static configuration domain with expensive evaluations;
- contextual bandits repeatedly act under changing context.

## Combination

Use Bayesian optimization at a slow configuration time scale and LinUCB at a fast operational time scale.

Example:

```text
weekly: Bayesian optimization tunes policy hyperparameters
per request: LinUCB chooses action
```

Time-scale separation avoids making one algorithm solve both meta-configuration and per-request routing.

---

# 21. Composition Pattern Q — Consensus + Replicated State Machine + Adaptive Policy

## Motivation

An adaptive orchestrator may need to run on multiple machines while sharing one coherent task/model state.

## Contribution

Keep coordination state strongly replicated while allowing learning/decision logic above it:

```text
requests
  ↓
Raft/Paxos replicated command log
  ↓
deterministic orchestration state machine
  ↓
adaptive policy selects action
  ↓
idempotent external execution
  ↓
result event committed
```

## Important boundary

Consensus should agree on **facts/state transitions**, not on stochastic model internals unless those must be identical.

For example, the chosen action and reward event may need durable agreement, while model training can be asynchronous if policy-version semantics are explicit.

## Research questions

- centralized learner vs federated/statistically merged learners;
- how stale can a serving policy be?
- when should sufficient-statistic updates be strongly consistent?
- can exact-once reward application be guaranteed using decision IDs and replicated logs?

---

# 22. Composition Pattern R — Sharding + Hierarchical Bandits

## Motivation

A giant global action set or model may not fit one node or one policy.

## Contribution

Partition action space and make decisions hierarchically:

```text
context
 ↓ top-level bandit/router
select shard/category
 ↓ local contextual bandit
select action
```

## Advantages

- smaller matrices/action scans;
- local specialization;
- parallel serving;
- easier ownership.

## Risks

- top-level mistakes hide good actions in other shards;
- local rewards create biased top-level feedback;
- shard rebalancing changes semantics.

## Research question

Compare hierarchical regret/decomposition against flat candidate-retrieval + shared bandit.

---

# 23. Combination Pattern S — Greedy Baseline + Exploration Bonus

## Motivation

Many online systems already have a greedy score. Replacing everything with a sophisticated learner may be unnecessary.

## Contribution

Start from

\[
score_{greedy}(x,a)
\]

and add explicit uncertainty:

\[
score(x,a)
=score_{greedy}(x,a)+\alpha U(x,a).
\]

This is the conceptual path from regression/ranking to UCB/LinUCB.

## Research value

It isolates whether gains come from better prediction or from better exploration.

Ablate:

- predictor only;
- uncertainty only around simple predictor;
- full contextual features.

---

# 24. Combination Pattern T — Exact Small-Instance Solver + Learned Large-Instance Heuristic

## Motivation

Many hard problems are solvable exactly only for small instances.

## Contribution

Use exact solutions as supervision/oracles:

```text
small random/real instances
   ↓ exhaustive / DP / branch-and-bound
optimal solutions
   ↓ supervised / imitation learning
learned heuristic
   ↓
large instances
   ↓ heuristic search / local optimization
```

This creates high-quality labels without human annotation.

## Evaluation

Retain exact solver on small holdout instances to measure true optimality gap of the learned heuristic.

---

# 25. Combination Pattern U — Streaming Change Detection + Nonstationary Bandit

## Motivation

A bandit with aggressive forgetting adapts quickly but wastes historical data. A stationary bandit is stable but slow after abrupt regime shifts.

## Contribution

Use a streaming change detector to decide when to reset/discount the learner.

```text
reward/residual stream
  ↓ change detector
normal? ─ yes → standard update
change? ─ yes → reset/discount/reinitialize affected statistics
```

## Research questions

- global reset vs per-feature/per-arm reset;
- false alarm cost vs adaptation delay;
- continuous drift vs abrupt change;
- change detection on rewards, residuals, contexts, or all three.

---

# 26. Combination Pattern V — Scheduling + Contextual Bandit

## Motivation

Schedulers often use static priority rules although task durations, worker capabilities, and failure probabilities depend on context.

## Contribution

Separate hard resource feasibility from learned assignment:

```text
queued jobs
 ↓ scheduler constraints
eligible worker-job pairs
 ↓ contextual bandit
assignment
```

Features:

- job type/size;
- worker hardware/load;
- historical success;
- queue age;
- cache/data locality;
- deadline slack.

Reward:

- completion success;
- latency;
- resource cost;
- deadline miss penalty.

## Caution

Scheduling decisions alter future queue states, so a contextual bandit is only an approximation when queue dynamics matter strongly. This is a natural path toward RL/control if long-term effects prove important.

---

# 27. Combination Pattern W — Cache + Prediction + Control

## Motivation

Caching is a sequential resource-allocation problem under uncertain future demand.

## Architecture

```text
request stream
 ↓ frequency/recency features
reuse predictor
 ↓
cache admission/eviction optimizer
 ↓
cache state
 ↓ hits/misses
feedback
```

Possible algorithms:

- LRU/LFU baseline;
- learned reuse-distance predictor;
- contextual bandit for admission;
- RL if actions significantly alter future cache-state dynamics;
- hard capacity constraint always enforced deterministically.

This is a useful example for deciding when the state dynamics justify RL over bandits.

---

# 28. When *Not* to Combine Algorithms

More algorithms do not automatically mean a better system.

## Anti-pattern 1 — Two adaptive layers chasing each other

Example: retriever continuously changes embeddings while bandit continuously updates covariance in that changing feature space.

Result: uncertainty becomes difficult to interpret.

Mitigation: freeze one layer per learning epoch or rebuild downstream statistics after representation changes.

## Anti-pattern 2 — Hard constraint as reward penalty

A policy may still violate it if reward trade-offs favor doing so.

Use deterministic feasibility enforcement.

## Anti-pattern 3 — Multiple local objectives

Retriever optimizes recall, ranker CTR, scheduler throughput, system success. Without a shared causal evaluation, local improvements can fight each other.

## Anti-pattern 4 — Duplicate uncertainty bonuses

If an upstream model already outputs an optimistic score and downstream UCB adds another bonus, uncertainty may be double-counted.

## Anti-pattern 5 — Hidden feedback loops

A ranker influences what data the representation learner sees, which changes future retrieval, which changes bandit rewards. Offline IID evaluation may become misleading.

## Anti-pattern 6 — Algorithmic complexity without baseline evidence

If a static heuristic solves 99.9% of the value opportunity, a neural bandit may add cost and failure modes without meaningful benefit.

## Anti-pattern 7 — Incompatible time scales

Do not update a slow representation model for every millisecond decision unless the infrastructure and statistics justify it.

---

# 29. Research Decomposition of End-to-End Error

For a multi-stage system, try to decompose failure probability or regret.

Example:

\[
L_{total}
=
L_{representation}
+L_{retrieval}
+L_{feasibility}
+L_{ranking}
+L_{execution}
+L_{feedback}
\]

This is not necessarily an exact additive equation; it is a diagnostic decomposition.

Ask:

- Was the correct action representable?
- Was it retrieved?
- Was it filtered incorrectly?
- Was it scored incorrectly?
- Did execution fail?
- Was reward measured incorrectly?

Without this, an end-to-end metric tells you that something failed but not which algorithm should change.

---

# 30. Research Hypothesis Template

A combination idea should be written as a falsifiable hypothesis.

Bad:

> “Use HNSW and LinUCB to make the agent smarter.”

Better:

> “For tasks with more than 100k available historical strategies/artifacts, HNSW candidate generation with recall@50 ≥ 0.95 followed by LinUCB ranking will reduce median decision latency by at least 10× relative to flat LinUCB scoring while retaining at least 98% of cumulative reward in a stationary synthetic environment.”

A research hypothesis should specify:

- population/problem regime;
- baseline;
- intervention;
- primary metric;
- acceptable degradation/trade-off;
- time horizon;
- assumptions.

---

# 31. Experimental Protocol for Hybrid Algorithms

## Step 1 — Formalize the environment

Define:

- states;
- actions;
- observations;
- rewards/objective;
- constraints;
- horizon;
- failure model;
- feedback delay.

## Step 2 — Build trivial baselines

Include:

- random;
- static heuristic;
- greedy;
- exact solver where feasible;
- simplest relevant learned model.

## Step 3 — Isolate each stage

For retrieval + bandit:

- evaluate retrieval against oracle independently;
- evaluate bandit on oracle candidate sets;
- then evaluate end-to-end.

## Step 4 — Use synthetic environments with known truth

Synthetic environments allow exact regret/optimality measurement and controlled violations of assumptions.

## Step 5 — Replay historical logs carefully

Use only valid counterfactual methods. Preserve chronological policy updates.

## Step 6 — Perform ablations

Remove one component at a time:

- no uncertainty bonus;
- no graph expansion;
- no learned representation;
- no cache;
- no adaptive scheduling.

## Step 7 — Stress the assumptions

Test:

- drift;
- noise;
- missing features;
- delayed rewards;
- large action count;
- cold start;
- failures;
- load spikes;
- adversarial/pathological inputs.

## Step 8 — Measure systems cost

Track:

- CPU/GPU;
- memory;
- p50/p95/p99 latency;
- network;
- storage;
- model/index rebuild time;
- operational complexity.

## Step 9 — Controlled online rollout

Start with limited safe traffic and guardrails. Compare against established policy using randomized assignment when appropriate.

## Step 10 — Keep reproducible artifacts

Store:

- code commit;
- data snapshot/version;
- feature definitions;
- model/index version;
- seed;
- hyperparameters;
- evaluation script;
- metrics.

---

# 32. Combination Scorecard

For each proposed hybrid, fill out this table.

| Dimension | Question |
|---|---|
| Motivation | Which limitation of algorithm A is algorithm B intended to solve? |
| Contribution | What capability exists only because of the combination? |
| Representation | Are inputs/outputs compatible? |
| Objective | Do both components optimize compatible goals? |
| Feedback | What labels/rewards are observable? |
| Uncertainty | Where is uncertainty represented and consumed? |
| Time scale | How often does each component update? |
| Complexity | What time/memory/network cost is added? |
| Safety | Which invariants are deterministic? |
| Failure | What happens if either component is unavailable/wrong? |
| Evaluation | How can each component be ablated? |
| Baseline | What simpler system must it beat? |
| Theory | Which guarantees survive composition? |
| Drift | How does it adapt to nonstationarity? |
| Reproducibility | Can a decision be replayed exactly? |

A proposal with many unanswered cells is not ready for implementation.

---

# 33. Research Matrix: Problem Signal → Combination Candidate

| Problem signal | Useful combination |
|---|---|
| Millions of actions, contextual reward | ANN/HNSW → LinUCB/Linear TS |
| Hard safety rules + online learning | CSP/rule filter → contextual bandit |
| Huge path search + historical solved paths | learned heuristic → A*/beam search |
| Noisy sensors + constrained future actions | Kalman/particle filter → MPC |
| Unknown dynamics + safety controller | model learning/RL + MPC |
| Large exact combinatorial solver tree | learned branching + branch-and-bound |
| Changing workload + cache | streaming sketch + adaptive admission |
| Huge state DP | function approximation + TD/RL |
| Semantic + structural retrieval | embeddings + graph traversal |
| Expensive hyperparameter experiments | Bayesian optimization + online bandit serving |
| Distributed adaptive orchestrator | consensus state machine + idempotent policy execution |
| Frequent topology changes | consistent hashing + replication + rebalancing controller |
| Partial feedback from recommendations | contextual bandit + logged propensities + OPE |
| Expensive planning simulations | MCTS/UCB + learned value model |
| Massive offline learning data | dataflow/MapReduce + sufficient-statistic aggregation |

---

# 34. AI Engineering Intelligence OS — Foundation Architecture

For an engineering-intelligence operating system, organize foundations into planes rather than treating algorithms as isolated utilities.

## Plane 1 — Knowledge and Representation

Purpose: convert repositories, issues, logs, tests, traces, documentation, and historical actions into usable structured state.

Algorithms:

- parsing / AST / IR;
- embeddings;
- graphs;
- hashing/content addressing;
- compression;
- stream processing.

Artifacts:

- symbol graph;
- dependency graph;
- vector index;
- event history;
- task feature vectors.

---

## Plane 2 — Retrieval and Candidate Generation

Purpose: reduce enormous knowledge/action spaces to plausible alternatives.

Algorithms:

- lexical inverted search;
- HNSW/ANN;
- BFS/DFS/A* graph traversal;
- top-K heaps;
- filters;
- caching.

Output:

\[
\mathcal{A}_{candidate}(x).
\]

---

## Plane 3 — Constraint and Policy Decision

Purpose: choose what should happen.

Algorithms:

- CSP/SAT/rules for hard feasibility;
- optimization for resource/budget allocation;
- LinUCB / Linear TS for adaptive strategy/tool selection;
- Bayesian optimization for slow configuration;
- RL only where long-term state effects require it.

Output:

\[
a_t\in\mathcal{A}_{safe}(x_t).
\]

---

## Plane 4 — Planning and Execution

Purpose: turn decisions into reliable actions.

Algorithms/patterns:

- DAG/topological planning;
- state machines;
- queues/schedulers;
- branch-and-bound/MIP for complex planning;
- event-driven execution;
- sagas;
- retries/timeouts/idempotency.

---

## Plane 5 — Learning and Evaluation

Purpose: learn which decisions work.

Algorithms:

- streaming aggregates;
- regression/SGD;
- contextual bandit updates;
- Bayesian inference;
- off-policy evaluation;
- change detection;
- experimental statistics.

Required data:

- decision context;
- action set;
- selected action;
- policy version;
- propensity where applicable;
- outcomes/rewards;
- latency/cost/failure traces.

---

## Plane 6 — Reliability and Distributed State

Purpose: preserve truth under failure and scale.

Algorithms:

- replication;
- consensus/Raft;
- sharding;
- consistent hashing;
- quorum reasoning;
- durable logs;
- deduplication;
- circuit breakers;
- backpressure.

Learning should consume reliable events from this plane rather than attempting to replace reliability semantics.

---

# 35. AI Engineering Intelligence OS — Example Decision Loop

```text
1. Task arrives
      ↓
2. Parse + classify + embed task
      ↓
3. Search repository/docs/history using lexical + vector + graph retrieval
      ↓
4. Construct candidate strategies/tools/models
      ↓
5. Apply permission/capability/budget constraints
      ↓
6. LinUCB/Linear TS selects execution strategy
      ↓
7. Planner decomposes into DAG/state machine
      ↓
8. Scheduler dispatches idempotent actions
      ↓
9. Tests/telemetry/results produce events
      ↓
10. Reward attribution updates learner
      ↓
11. Event log and replicated state persist history
      ↓
12. Drift/quality monitors decide whether models/indexes need rebuild
```

This loop uses nearly every foundation in the collection, but each one solves a distinct subproblem.

---

# 36. Recommended Research Progression for an Adaptive Engineering System

Avoid starting with the most complex architecture.

## Phase 1 — Deterministic foundation

Implement:

- structured state machines;
- reliable event logging;
- candidate generation;
- hard constraints;
- static heuristics;
- evaluation metrics.

Without this, later learning data will be unreliable.

## Phase 2 — Supervised prediction

Predict:

- success probability;
- latency;
- cost;
- likely relevant tools/files.

Verify features contain useful signal.

## Phase 3 — Contextual bandit

Add LinUCB as an interpretable exploration-aware decision layer.

Compare with:

- static heuristic;
- greedy linear model;
- epsilon-greedy;
- Linear Thompson Sampling.

## Phase 4 — Candidate/retrieval scaling

If action set grows, add ANN/graph retrieval and quantify candidate loss.

## Phase 5 — Nonstationarity

Only after measuring drift, add sliding windows, discounting, or change detection.

## Phase 6 — Learned representation

If residual analysis shows linear feature limitations, add frozen/deep representations and retain a shallow uncertainty-aware head first.

## Phase 7 — Sequential RL

Move from contextual bandits to RL only when evidence shows that decisions have significant delayed future-state consequences that immediate contextual rewards cannot model.

## Phase 8 — Multi-agent/meta-control

Only after individual policies are measurable and reliable should the system adaptively allocate work among agents, planners, and policies.

---

# 37. Open Research Questions for Combination Work

## Representation × Bandits

- How can contextual-bandit confidence remain calibrated when embeddings change?
- Can uncertainty in embedding space be propagated into LinUCB/TS?
- When does a frozen pretrained representation outperform jointly learned neural exploration?

## Retrieval × Exploration

- Can the bandit request broader candidate retrieval when its uncertainty is high?
- How should exploration account for actions omitted by the candidate generator?
- Can retrieval itself be treated as a sequential allocation problem?

## Graphs × Learning

- Can graph structure define priors/covariance between related actions?
- Can uncertainty propagate across graph neighbors?
- Can learned heuristics preserve A* guarantees through admissible bounds?

## Constraints × Learning

- How should uncertain constraint estimates be handled?
- Can primal-dual online learning optimize reward under time-varying budgets?
- What is the safest architecture for exploratory policies with non-negotiable rules?

## Distributed Systems × Online Learning

- How much model staleness is acceptable across replicas?
- Should bandit sufficient statistics use strong consistency or eventual aggregation?
- How can delayed/duplicate rewards be applied exactly once?
- Can model updates be CRDT-like for particular sufficient statistics?

## Control × RL

- Which portion of a control stack should remain model-based and verified?
- How can RL learn residuals without invalidating hard constraints?
- How should model uncertainty influence MPC horizons and safety margins?

## Scheduling × Bandits/RL

- When is one-step contextual routing sufficient?
- At what queue/load regimes do long-term state effects require RL?
- Can theoretical regret coexist with deadline/fairness constraints?

## Search × Learned Guidance

- How should uncertainty trigger fallback from learned to exact/conservative heuristics?
- Can bandits allocate computational budget across multiple search algorithms?
- How can solver traces become supervision without introducing selection bias?

---

# 38. A Research Idea Generator

To generate new combination hypotheses systematically, choose one item from each row.

## Representation

- symbolic;
- graph;
- vector embedding;
- probabilistic belief;
- compressed/sketched.

## Candidate mechanism

- exhaustive;
- index;
- graph search;
- ANN;
- heuristic search.

## Feasibility mechanism

- static rules;
- CSP/SAT;
- LP/MIP;
- resource scheduler.

## Decision mechanism

- greedy;
- optimization;
- UCB/LinUCB;
- Thompson Sampling;
- Bayesian optimization;
- RL/MPC.

## Feedback mechanism

- full information;
- bandit reward;
- delayed reward;
- state transition;
- noisy observation.

## Reliability mechanism

- cache;
- event log;
- idempotency;
- replication;
- consensus;
- sharding.

Then ask:

> What limitation does each added component remove, and what new assumption/failure mode does it introduce?

That question prevents arbitrary algorithm stacking.

---

# 39. Example Research Proposals

## Proposal 1 — Uncertainty-Adaptive Retrieval Breadth

### Motivation

Fixed ANN top-K may retrieve too many candidates for easy tasks and too few for uncertain tasks.

### Contribution

Let downstream LinUCB uncertainty control retrieval breadth:

\[
K_t=f(uncertainty_t, latency\ budget_t).
\]

### Implementation

Start with small K. If best-vs-second-best confidence margin is low, expand HNSW `efSearch`/K and rescore.

### Hypothesis

Adaptive K can reduce average retrieval cost while preserving reward compared with fixed large K.

---

## Proposal 2 — Graph-Regularized Linear Bandit

### Motivation

Actions connected in a tool/dependency graph may have related reward parameters.

### Contribution

Regularize action parameters so graph neighbors share statistical strength.

Possible objective:

\[
\sum_t(r_t-x_t^T\theta_{a_t})^2
+
\lambda\sum_a\|\theta_a\|^2
+
\gamma\sum_{(a,b)\in E}w_{ab}\|\theta_a-\theta_b\|^2.
\]

### Implementation

Compare against disjoint and fully shared LinUCB. Use graph Laplacian structure for regularization.

### Research question

Does structural sharing improve cold start without creating harmful bias between superficially related actions?

---

## Proposal 3 — Change-Point-Aware LinUCB

### Motivation

Discounted LinUCB forgets continuously even in stable periods.

### Contribution

Use residual change detector to trigger targeted reset.

### Implementation

Track standardized residuals per segment/arm. On statistically significant shift, increase uncertainty or reset affected sufficient statistics.

### Evaluation

Synthetic abrupt changes + gradual drift; compare stationary, sliding-window, discounted, and detector-triggered variants.

---

## Proposal 4 — Bandit-Selected Solver Portfolio

### Motivation

No one solver/heuristic dominates every optimization instance.

### Contribution

Treat solver configurations as contextual arms.

Features:

- variable count;
- constraint density;
- graph statistics;
- LP relaxation gap;
- historical domain category.

Reward:

- negative solve time with correctness requirement;
- objective gap under time budget.

### Implementation

Use LinUCB/Linear TS to select a solver, while correctness is provided by solver itself.

---

## Proposal 5 — Cost-Aware Multi-Stage AI Routing

### Motivation

Different AI models/tools vary in accuracy, latency, and monetary cost.

### Contribution

Retrieve feasible models, estimate success, and use contextual bandit with a constrained/composite reward.

### Implementation

Hard filter incompatible models. Feature cost explicitly. Log full action availability. Compare static routing, greedy predictor, LinUCB, Linear TS.

### Research question

Can uncertainty-aware routing discover specialized low-cost tools without sacrificing task success?

---

## Proposal 6 — Event-Replay Counterfactual Policy Laboratory

### Motivation

Online experimentation is expensive/risky.

### Contribution

Build an event-sourced simulator that reconstructs historical policy decisions and supports valid off-policy estimators where randomized propensities exist.

### Implementation

Immutable decision log + reward log + policy registry + replay engine + IPS/doubly robust estimators.

### Research value

This infrastructure makes every future bandit/policy experiment cheaper and more reproducible.

---

# 40. Theoretical Guarantees Under Composition

An important warning: guarantees do not automatically compose.

Examples:

- LinUCB regret guarantee assumes access to its action set; ANN candidate pruning may remove the comparator action.
- A* optimality assumes heuristic conditions; a learned heuristic may violate them.
- convex optimization guarantees disappear if a learned nonlinear component makes the effective objective nonconvex.
- Raft safety protects the replicated log, not correctness of external non-idempotent side effects.

When combining algorithms, explicitly rewrite the guarantee for the full architecture.

A useful form is:

\[
Error_{system}
\le
Error_A
+Error_B
+InterfaceError
\]

where possible, or provide empirical bounds when analytical decomposition is unavailable.

---

# 41. Complexity Under Composition

End-to-end complexity is also not just the sum of Big-O expressions.

Consider HNSW → LinUCB:

- ANN lookup depends on index size/graph structure and search breadth;
- LinUCB scoring depends on returned K and feature dimension d;
- feature extraction may dominate both;
- network/storage serialization may dominate serving latency.

Record a practical cost equation:

\[
T_{total}
=
T_{feature}
+T_{retrieve}
+T_{filter}
+T_{score}
+T_{execute-overhead}.
\]

Measure each term directly.

Similarly memory:

\[
M_{total}
=
M_{vectors}
+M_{ANN}\text{ graph}
+M_{bandit}\text{ state}
+M_{cache}
+M_{runtime}.
\]

This prevents optimizing a component that contributes little to total cost.

---

# 42. Failure Semantics Under Composition

For every module, specify:

- fail-open or fail-closed;
- retryable or not;
- deterministic fallback;
- timeout budget;
- idempotency requirements;
- state rollback/recovery.

Example:

```text
embedding service unavailable
   ↓
fallback lexical retrieval
   ↓
if no candidates → static safe action

bandit model unavailable
   ↓
static ranker / deterministic default

reward pipeline delayed
   ↓
do not block serving; apply idempotent update later
```

A research prototype that has no fallback architecture is not yet a production design.

---

# 43. Observability for Hybrid Algorithms

End-to-end metrics are necessary but insufficient. Each layer needs diagnostics.

## Representation

- feature missingness;
- embedding norm/drift;
- model version.

## Retrieval

- candidate count;
- recall proxy;
- ANN latency;
- graph expansions.

## Constraints

- rejection reason counts;
- empty feasible-set rate.

## Bandit/ranker

- predicted mean;
- uncertainty;
- chosen score;
- action exposure;
- reward/regret proxy.

## Execution

- latency;
- retries;
- failure type;
- state transitions.

## Learning

- residuals;
- condition numbers;
- posterior/confidence width;
- delayed reward age;
- duplicate-update rate.

## Distributed state

- replication lag;
- leader changes;
- event backlog;
- shard skew.

Observability is itself part of algorithm implementation because it determines whether assumptions can be tested in reality.

---

# 44. Documentation Standard for New Algorithms Added to This Repository

Every future algorithm/family should include these sections.

## Motivation

1. What problem does it solve?
2. Why are simpler approaches insufficient?
3. What information does it assume?
4. What objective/trade-off is involved?

## Contribution

1. Core conceptual innovation.
2. Mathematical rule/invariant.
3. Theoretical guarantee under explicit assumptions.
4. Complexity.
5. Relationship to neighboring algorithms.

## Implementation

1. Data/state representation.
2. Initialization.
3. Pseudocode/reference implementation.
4. Numerical concerns.
5. Failure modes.
6. Testing.
7. Observability.
8. Production scaling.

## Combination Research

1. Natural upstream/downstream algorithms.
2. Interface contract.
3. New failure modes caused by composition.
4. Candidate hypotheses.
5. Experiment design and baselines.

## References

Prefer primary papers, textbooks, official course notes, and high-quality surveys.

---

# 45. Final Mental Model

The deepest reusable abstraction in this collection is not a particular algorithm. It is a sequence of questions.

```text
What is the STATE?
        ↓
How should it be REPRESENTED?
        ↓
What ACTIONS or outputs are possible?
        ↓
Can we reduce them by SEARCH / RETRIEVAL / INDEXING?
        ↓
Which are FEASIBLE under hard constraints?
        ↓
What OBJECTIVE are we optimizing?
        ↓
What UNCERTAINTY remains?
        ↓
Do we need EXPLORATION?
        ↓
Does this action affect FUTURE STATE?
        ↓
How should execution be SCHEDULED and RECOVERED?
        ↓
What FEEDBACK is observable?
        ↓
How do we LEARN / UPDATE?
        ↓
How is state made RELIABLE under failure?
        ↓
How do we EVALUATE whether the whole composition is better?
```

If the action only affects immediate reward, contextual bandits such as LinUCB may be sufficient.

If the action affects future state, move toward control, planning, or reinforcement learning.

If the action set is enormous, add indexing/retrieval before decision-making.

If actions are constrained, filter/optimize feasibility before exploration.

If the system is distributed, make retry/idempotency/consensus semantics explicit.

If the environment changes, add controlled forgetting/change detection rather than assuming stationarity.

And if a complex method cannot beat a simple baseline under reproducible experiments, keep the simple method.

---

# 46. References for Combination Research

The detailed chapters contain topic-specific primary references. Particularly important cross-cutting sources include:

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed.: https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
- Boyd and Vandenberghe, *Convex Optimization*: https://web.stanford.edu/~boyd/cvxbook/
- Sutton and Barto, *Reinforcement Learning: An Introduction*: http://incompleteideas.net/book/the-book-2nd.html
- Lattimore and Szepesvári, *Bandit Algorithms*: https://tor-lattimore.com/downloads/book/book.pdf
- Li, Chu, Langford, Schapire, contextual bandits / LinUCB: https://doi.org/10.1145/1772690.1772758
- Malkov and Yashunin, HNSW: https://arxiv.org/abs/1603.09320
- Ongaro and Ousterhout, Raft: https://raft.github.io/raft.pdf
- Lamport, Paxos: https://www.microsoft.com/en-us/research/publication/paxos-made-simple/
- Dean and Ghemawat, MapReduce: https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/
- Bengio, Courville, Vincent, representation learning: https://arxiv.org/abs/1206.5538
- Kalman, linear filtering: https://doi.org/10.1115/1.3662552
- Hart, Nilsson, Raphael, A*: https://doi.org/10.1109/TSSC.1968.300136
