# Foundation Algorithms Collection

A research-oriented reference for the foundational algorithmic ideas that recur across modern software systems, artificial intelligence, optimization, data systems, distributed computing, control, and adaptive decision-making.

The goal of this repository is **not** to collect disconnected algorithm names. It is to expose the reusable ideas underneath them so they can be studied, implemented, compared, and combined into new systems.

## Why this collection exists

Modern systems often look novel at the surface but are composed from a relatively small set of recurring mechanisms:

- represent a problem as states, vectors, graphs, constraints, distributions, or objectives;
- decompose it into manageable subproblems;
- search a space of possibilities;
- organize information so queries become cheap;
- optimize an objective under constraints;
- approximate when exact computation is too expensive;
- learn from data or feedback;
- quantify uncertainty;
- coordinate concurrent or distributed actors;
- reuse previous computation;
- react to events and changing state;
- balance exploration against exploitation.

The documents in this repository explain these mechanisms from first principles and connect classical algorithms to modern applications such as AI agents, recommender systems, vector search, distributed orchestration, adaptive routing, autonomous systems, and engineering-intelligence platforms.

## Standard used in every chapter

For each algorithm or algorithm family, the collection emphasizes three required perspectives.

### Motivation

- What problem forced this idea to exist?
- What is difficult about the naive solution?
- What assumptions make the problem tractable?
- What information is available to the algorithm?
- What trade-off is the algorithm making?

### Contribution

- What conceptual idea does the algorithm introduce?
- What does it improve over simpler approaches?
- What guarantees can it provide?
- What is its computational or statistical cost?
- What are its failure modes and modeling assumptions?

### Implementation

- State/data representation
- Core recurrence, score, update, or invariant
- Pseudocode and implementation patterns
- Complexity
- Numerical and systems considerations
- Testing and observability
- Production failure modes
- Natural extensions and hybrid combinations

The collection also adds a fourth perspective: **Combination Research**. This describes how an algorithm can become a component in a larger adaptive system rather than being studied in isolation.

## Reading map

| File | Main subjects |
|---|---|
| [00 — Research framework](docs/00-research-framework.md) | How to classify problems, compare algorithms, reason about assumptions, complexity, regret, uncertainty, and composition |
| [01 — Core problem-solving paradigms](docs/01-core-problem-solving-paradigms.md) | Exhaustive search, decomposition, divide-and-conquer, recursion, greedy methods, dynamic programming |
| [02 — Search, graphs, ordering, hashing, indexing](docs/02-search-graphs-ordering-indexing.md) | BFS, DFS, A*, shortest paths, MSTs, flow, sorting, selection, hashing, B-trees, inverted/vector indexes |
| [03 — Optimization, randomization, approximation, constraints](docs/03-optimization-randomization-constraints.md) | Gradient methods, Newton/quasi-Newton, LP, local search, Monte Carlo, sampling, approximation, heuristics, CSP/SAT, backtracking, branch-and-bound |
| [04 — State, events, queues, caching, streaming, dataflow](docs/04-state-streaming-dataflow-systems.md) | State machines, event-driven systems, scheduling, caching, streaming sketches, Map/Filter/Reduce, MapReduce |
| [05 — Probability, control, reinforcement learning](docs/05-probabilistic-control-reinforcement-learning.md) | Bayesian inference, HMMs, Kalman filters, feedback control, MDPs, value/policy iteration, temporal-difference methods, Q-learning, policy gradients |
| [06 — Representation, similarity, compression, parsing](docs/06-representation-similarity-compression-parsing.md) | Feature/representation learning, embeddings, nearest-neighbor search, LSH/HNSW, compression, information theory, parsing, transformation pipelines |
| [07 — Distributed coordination and reliability](docs/07-distributed-coordination-reliability.md) | Consensus, Paxos/Raft, replication, quorum reasoning, sharding, consistent hashing, retries, timeouts, idempotency, aggregation |
| [08 — Bandits, contextual bandits, LinUCB](docs/08-bandits-contextual-bandits-linucb.md) | Epsilon-greedy, UCB1, Thompson sampling, contextual bandits, LinUCB, Linear Thompson Sampling, NeuralUCB/NeuralTS, offline evaluation |
| [09 — Combination research map](docs/09-combination-research-map.md) | How to combine the families into new adaptive architectures; research questions, experimental design, and hybrid recipes |

## A compact taxonomy

A useful first classification is by the **kind of uncertainty** the algorithm must handle.

| Situation | Typical foundation |
|---|---|
| Entire input known, exact answer desired | classical algorithms, dynamic programming, graph algorithms |
| Search space enormous | heuristics, A*, branch-and-bound, approximation |
| Objective differentiable | gradient/Newton/quasi-Newton methods |
| Exact model unavailable but simulator/samples exist | Monte Carlo, stochastic optimization |
| Data arrives continuously | online/streaming algorithms |
| Environment changes after actions | control, reinforcement learning |
| Only chosen action reveals reward | multi-armed/contextual bandits |
| Multiple machines must agree | consensus and replicated state machines |
| Query latency dominates | indexes, caching, approximate nearest neighbors |
| Hidden state must be inferred | Bayesian filtering, HMMs, Kalman filters |

Another useful classification is by **what the algorithm stores**:

- a frontier of candidate states — search;
- a table of solved subproblems — dynamic programming;
- sufficient statistics — streaming/statistical algorithms;
- parameters and gradients — optimization/learning;
- confidence intervals or posterior distributions — bandits;
- replicated logs/state — consensus systems;
- an index structure — retrieval systems;
- a policy/value function — reinforcement learning;
- cached results — performance systems.

## Research mindset

When investigating a modern problem, do not start by asking “Which fashionable algorithm should I use?” Start with:

1. What is the state or representation?
2. What decisions are possible?
3. What information is known before a decision?
4. What becomes observable only afterward?
5. Is the environment stationary?
6. Is an exact solution required?
7. What is the objective and what are the constraints?
8. Does the action affect only immediate reward, or future state too?
9. Can computation be reused?
10. What uncertainty must be represented explicitly?
11. What failures must the system tolerate?
12. What is the cost of a wrong decision versus the cost of exploration?

These questions usually narrow a large modern problem to a small number of foundational families.

## Special emphasis: adaptive systems and LinUCB

Contextual bandits deserve special attention because they sit between prediction and full reinforcement learning. **LinUCB** is particularly useful when:

- a decision must be made repeatedly;
- context is available before each decision;
- only the reward of the selected action is observed;
- rewards are reasonably modeled as linear in features, at least locally;
- exploration has real value because uncertainty about actions matters.

The dedicated bandit chapter derives LinUCB from regularized linear regression, explains its confidence ellipsoid, shows practical update formulas, discusses disjoint vs. shared/hybrid parameterizations, and connects it to Thompson sampling and neural contextual bandits.

## Scope and non-goals

This repository is a **foundation and research map**, not a substitute for original papers, textbooks, proof-heavy courses, or domain-specific benchmarking. Complexity bounds and theoretical guarantees depend on assumptions; always follow the primary references before relying on a guarantee in a new setting.

The implementation examples are intentionally minimal and meant to reveal structure. Production implementations should additionally handle numerical stability, concurrency, persistence, monitoring, distribution shift, privacy, security, and failure recovery.

## Core references used throughout

- Cormen, Leiserson, Rivest, Stein — *Introduction to Algorithms*, 4th ed., MIT Press: https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
- MIT OpenCourseWare — *Introduction to Algorithms*: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- Boyd and Vandenberghe — *Convex Optimization*: https://web.stanford.edu/~boyd/cvxbook/
- Nocedal and Wright — *Numerical Optimization*: https://doi.org/10.1007/978-0-387-40065-5
- Motwani and Raghavan — *Randomized Algorithms*: https://doi.org/10.1017/CBO9780511814075
- Sutton and Barto — *Reinforcement Learning: An Introduction*: http://incompleteideas.net/book/the-book-2nd.html
- Lattimore and Szepesvári — *Bandit Algorithms*: https://tor-lattimore.com/downloads/book/book.pdf

## Status

This repository is designed as a living collection. A useful extension pattern is to add, for each family:

- proofs or proof sketches;
- executable notebooks;
- benchmark suites;
- reference implementations in multiple languages;
- failure-case datasets;
- comparison matrices;
- hybrid experiments combining two or more families.
