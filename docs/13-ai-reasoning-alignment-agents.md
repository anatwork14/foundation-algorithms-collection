# 13 — AI Reasoning, Preference Optimization, Search, World Models, and Agent Algorithms

This chapter focuses on algorithms that turn predictive models into decision-making and reasoning systems. The unifying theme is **computation over alternatives**: generate candidate thoughts/actions, evaluate them, revise state, and allocate more computation when uncertainty or difficulty is high.

## 1. From prediction to decision

A predictor estimates:

\[
p(y|x).
\]

An agent must choose actions:

\[
a_t \sim \pi(a|s_t),
\]

observe consequences, update state, and optimize an objective over time.

The gap between prediction and agency introduces:

- action selection;
- planning;
- credit assignment;
- tool use;
- verification;
- memory;
- exploration;
- preference/utility modeling;
- safety constraints;
- and test-time compute allocation.

## 2. Search over generated candidates

A model can act as a proposal distribution while a separate algorithm performs search.

Generic pattern:

```text
state
  -> propose candidates
  -> score / verify
  -> select
  -> expand
  -> repeat
```

This architecture is older than neural networks and appears in theorem proving, game playing, planning, decoding, and program synthesis.

## 3. Best-of-N Sampling

Generate \(N\) independent candidates and select the highest-scoring one under a reward/verifier function.

### Contribution

Improves output quality through inference-time compute without changing model weights.

### Cost

Linear growth in candidate-generation cost.

### Failure mode

If the evaluator is biased or exploitable, larger \(N\) can amplify reward hacking.

## 4. Self-Consistency

Generate multiple reasoning trajectories and aggregate their final answers, often by majority or weighted voting.

### Motivation

A single stochastic reasoning trajectory may fail even when the model assigns probability mass to correct reasoning paths.

### Contribution

Uses diversity as an estimator of stable conclusions.

### Limitation

Correlated errors do not disappear under voting.

## 5. Beam Search for reasoning

Maintain a bounded frontier of partial reasoning traces.

At each depth:

1. expand each candidate;
2. score children;
3. retain top \(B\);
4. continue until terminal conditions.

### Research challenge

Local reasoning scores may not predict final correctness, so pruning can destroy the only successful path.

## 6. Tree Search

Reasoning can be represented as a tree where nodes are partial states and edges are candidate actions/thoughts.

Classical algorithms applicable directly:

- BFS/DFS;
- best-first search;
- A*;
- beam search;
- branch-and-bound;
- Monte Carlo Tree Search.

The neural model need not replace search; it can provide:

- proposals;
- heuristic values;
- priors;
- rollout policies;
- pruning signals.

## 7. Monte Carlo Tree Search

MCTS iterates:

1. selection;
2. expansion;
3. simulation/evaluation;
4. backup.

A UCB-style selection rule balances exploitation and exploration:

\[
UCB_i = \bar X_i + c\sqrt{\frac{\ln N}{n_i}}.
\]

### Contribution

Allocates more computation to promising branches while still exploring uncertain branches.

### Modern combination

Neural policy/value models + MCTS is a general architecture for strategic reasoning.

## 8. Learned Heuristics

A learned model estimates distance-to-go, value, likelihood of success, or branch quality.

A learned cost-to-go estimate can be inserted into A-star as the heuristic term while the search procedure continues to perform explicit state-space exploration.

Combine with A*:

\[
f(n)=g(n)+\hat h_\theta(n).
\]

### Key issue

If admissibility is lost, classical optimality guarantees may disappear. Hybrid designs can bound or calibrate learned heuristics.

## 9. Verifier-Guided Search

A verifier estimates whether a candidate solution, proof, plan, or program is correct.

Types:

- exact symbolic verifier;
- unit tests;
- compiler/type checker;
- learned reward model;
- critic model;
- formal proof checker;
- environment execution.

### Contribution

Separates generation from judgment.

### Combination principle

Weak generator + strong verifier can sometimes outperform a stronger generator with no verification.

## 10. Process vs. Outcome Supervision

### Outcome supervision

Score only final result.

### Process supervision

Score intermediate steps or reasoning states.

Trade-off:

- outcome supervision is easier to define but sparse;
- process supervision gives denser feedback but requires reliable step labels.

## 11. Preference Learning

Suppose humans prefer response \(y_w\) over \(y_l\) for prompt \(x\).

A Bradley-Terry-style reward model can use:

\[
P(y_w \succ y_l)=\sigma(r_\phi(x,y_w)-r_\phi(x,y_l)).
\]

Train with pairwise log-likelihood.

### Contribution

Subjective or hard-to-formalize objectives become learnable from comparisons rather than absolute labels.

## 12. RLHF

A common high-level pipeline:

1. supervised fine-tuning;
2. preference data collection;
3. reward model training;
4. reinforcement learning against the reward model with regularization toward a reference policy.

A policy objective may include:

\[
\mathbb E[r_\phi(x,y)]-\beta D_{KL}(\pi_\theta\|\pi_{ref}).
\]

### Motivation

Optimize behavior toward human preferences rather than next-token likelihood alone.

### Failure modes

- reward model overoptimization;
- preference bias;
- mode collapse;
- annotator disagreement;
- distribution shift;
- KL coefficient sensitivity.

## 13. PPO as an alignment optimizer

Proximal Policy Optimization constrains policy changes using a clipped probability ratio:

\[
r_t(\theta)=\frac{\pi_\theta(a_t|s_t)}{\pi_{old}(a_t|s_t)}.
\]

The clipped objective discourages excessively large updates.

PPO's importance is broader than alignment: it is a practical policy-gradient method balancing improvement and update stability.

## 14. Direct Preference Optimization

DPO avoids explicitly fitting a separate RL loop over a reward model by deriving a classification-style objective from a KL-regularized preference model.

A common form uses the log-ratio difference between chosen and rejected responses relative to a reference policy.

### Contribution

Preference optimization becomes closer to supervised pairwise learning.

### Limitations

- depends on quality/coverage of preference pairs;
- can inherit reference-policy limitations;
- still optimizes observed comparisons rather than a perfect latent utility;
- offline preference data can be distribution-limited.

## 15. Other direct preference objectives

The family includes objectives that modify:

- margin shape;
- reference dependence;
- reward calibration;
- robustness to noisy preferences;
- listwise vs pairwise ranking;
- online vs offline data collection.

The research foundation is **learning a policy from comparative feedback**, not any one acronym.

## 16. Reward Modeling

Reward models are learned utility estimators.

Critical questions:

- whose preferences?
- individual or aggregate utility?
- pairwise consistency?
- uncertainty?
- exploitable blind spots?
- adversarial robustness?
- temporal drift?

A reward model should be treated as another fallible learned component, not ground truth.

## 17. Constitutional / Rule-Guided Critique

An agent can evaluate outputs against explicit principles or rules, then revise.

Algorithmic pattern:

```text
proposal
 -> rule retrieval
 -> critique
 -> revision
 -> verification
```

This is closely related to iterative refinement, constraint satisfaction, and program repair.

## 18. Tool Use

An agent has a set of actions corresponding to external tools/APIs.

Tool-selection problem:

\[
a_t \in \{tool_1,\ldots,tool_k,respond\}.
\]

### Challenges

- schema grounding;
- argument generation;
- authorization;
- cost/latency;
- error recovery;
- tool selection under uncertainty;
- observation parsing;
- multi-step planning.

### Algorithmic combinations

- supervised routing;
- contextual bandits for adaptive tool selection;
- planner + executor separation;
- constrained decoding for valid calls;
- search over tool sequences.

## 19. ReAct-like interleaving

Interleave internal reasoning/planning with environment actions and observations:

```text
state -> think/plan -> act -> observe -> update -> ...
```

The foundation is a partially observed control loop with language-mediated state.

## 20. Planner–Executor architectures

Separate:

- planner: chooses subgoals;
- executor: performs actions;
- verifier: checks results;
- memory: stores state;
- controller: decides whether to continue/replan.

This resembles classical hierarchical planning and operating-system scheduling.

## 21. Hierarchical Task Decomposition

Represent a task as a tree/DAG of subproblems.

```text
goal
 |- research
 |- transform data
 |- implement
 |- test
 `- report
```

Algorithms:

- hierarchical task networks;
- AND/OR search;
- dependency DAG scheduling;
- recursive decomposition;
- critical-path analysis.

## 22. Memory algorithms for agents

Agent memory can be divided into:

- working context;
- episodic memory;
- semantic memory;
- procedural memory;
- external knowledge base.

Operations:

- write;
- retrieve;
- summarize;
- consolidate;
- forget/evict;
- conflict resolution.

### Retrieval policy

Memory retrieval is itself a ranking problem and can use:

- vector similarity;
- BM25;
- graph traversal;
- temporal decay;
- learned reranking;
- contextual bandits.

## 23. World Models

Learn environment dynamics:

\[
p(s_{t+1},r_t|s_t,a_t).
\]

Then plan using imagined rollouts.

### Contribution

Separate learning dynamics from policy optimization.

### Algorithms

- latent state-space models;
- model predictive control;
- tree search over learned dynamics;
- Dyna-style planning;
- trajectory optimization.

### Failure mode

Model errors compound under long imagined rollouts.

## 24. Model-Based RL

Pipeline:

1. fit dynamics model;
2. generate predicted trajectories;
3. optimize actions under predicted outcomes;
4. execute a limited prefix;
5. replan using new observations.

This naturally connects AI world models with MPC from control theory.

## 25. Test-Time Compute Allocation

Not every query needs equal inference effort.

Decision variables:

- number of samples;
- search depth;
- verifier calls;
- tool calls;
- context retrieved;
- model size/expert route;
- stopping threshold.

### Foundation problem

Allocate a limited computational budget to maximize expected answer utility.

This can be formalized as:

- optimal stopping;
- metareasoning;
- bandit allocation;
- value of information;
- sequential hypothesis testing.

## 26. Adaptive Computation

A controller decides whether to:

```text
answer now
retrieve more
sample again
call a tool
verify
branch search
switch model
escalate to human
```

A contextual bandit is a natural baseline if decisions affect immediate quality/cost. Full RL is appropriate when actions significantly alter future state.

## 27. Multi-Agent Algorithms

Multiple agents introduce coordination and game-theoretic problems.

### Foundations

- consensus;
- auctions;
- matching;
- task allocation;
- distributed constraint optimization;
- cooperative MARL;
- competitive games;
- mechanism design;
- communication protocols.

### Contract Net

Agents bid for tasks; a manager assigns work based on bids.

### Auction-based allocation

Optimize assignment under costs/capabilities.

### Failure modes

- duplicated work;
- coordination overhead;
- collusion;
- inconsistent state;
- communication bottlenecks;
- emergent incentives.

## 28. Neuro-Symbolic Reasoning

Combine learned representations with explicit symbolic mechanisms:

- SAT/SMT solvers;
- theorem provers;
- logic programming;
- knowledge graphs;
- type systems;
- constraint solvers.

### Hybrid pattern

```text
neural proposal
 -> symbolic constraint check
 -> counterexample / conflict
 -> neural revision
```

This can preserve flexibility while recovering formal guarantees for parts of the pipeline.

## 29. Program Synthesis

Search over programs satisfying examples/specifications.

Methods:

- enumerative search;
- constraint-based synthesis;
- inductive synthesis;
- stochastic search;
- neural-guided synthesis;
- CEGIS (counterexample-guided inductive synthesis).

CEGIS loop:

```text
synthesize candidate
 -> verify
 -> obtain counterexample
 -> add constraint
 -> synthesize again
```

This is a powerful general pattern for AI + formal methods.

## 30. Safety-Constrained Decision Making

An agent should optimize reward subject to constraints:

\[
\max_\pi J(\pi)
\quad \text{s.t.}\quad C_i(\pi)\le d_i.
\]

Approaches:

- constrained MDPs;
- Lagrangian methods;
- shields;
- rule-based action filters;
- formal verification;
- risk-sensitive objectives;
- human approval gates.

## 31. Evaluation

Agent evaluation must distinguish:

- final task success;
- number of environment interactions;
- token/compute cost;
- latency;
- tool error recovery;
- hallucination/fabrication rate;
- constraint violations;
- robustness to adversarial observations;
- reproducibility;
- ability to know when to stop/escalate.

## 32. Combination research map

```text
LLM + MCTS + verifier
  -> search-based reasoning

LLM + SAT/SMT
  -> flexible proposal + exact constraint solving

World model + MPC
  -> learned dynamics + receding-horizon control

Contextual bandit + tool router
  -> adaptive tool selection

Conformal uncertainty + agent controller
  -> uncertainty-aware escalation

Program synthesis + CEGIS + neural proposals
  -> iterative formally checked code generation

Multi-agent auction + skill graph
  -> cost-aware task allocation

Reward model + active learning
  -> request human preferences where most informative
```

## 33. Primary references

- Sutton & Barto, *Reinforcement Learning: An Introduction*.
- Kocsis & Szepesvári, *Bandit Based Monte-Carlo Planning* (UCT, 2006).
- Silver et al., *Mastering the Game of Go with Deep Neural Networks and Tree Search* (2016).
- Schulman et al., *Proximal Policy Optimization Algorithms* (2017).
- Christiano et al., *Deep Reinforcement Learning from Human Preferences* (2017).
- Ouyang et al., *Training Language Models to Follow Instructions with Human Feedback* (2022).
- Rafailov et al., *Direct Preference Optimization: Your Language Model Is Secretly a Reward Model* (2023).
- Yao et al., *ReAct: Synergizing Reasoning and Acting in Language Models* (2022).
- Wei et al., *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models* (2022).
- Wang et al., *Self-Consistency Improves Chain of Thought Reasoning in Language Models* (2022).

## 34. Research questions

- How should test-time compute be allocated adaptively instead of by fixed budgets?
- Can formal verifiers be integrated deeply enough to shape generation rather than merely reject it?
- When does a contextual bandit suffice for agent routing, and when is full RL necessary?
- How should agent memory forget information without losing causal context?
- Can preference models represent disagreement rather than collapsing preferences into one scalar?
- How can multi-agent systems remain auditable when coordination strategies emerge?