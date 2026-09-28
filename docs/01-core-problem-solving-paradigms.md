# 01 — Core Problem-Solving Paradigms

This chapter covers the classical design patterns that appear underneath a large fraction of modern algorithms: exhaustive search, decomposition, divide-and-conquer, recursion, greedy choice, and dynamic programming.

The important goal is not memorizing names. It is recognizing the structural property that makes each technique valid.

---

# 1. Exhaustive Search / Brute Force

## Motivation

The most direct way to solve a finite problem is to enumerate every candidate and test it. Brute force matters because it provides:

- a correctness baseline;
- an oracle for small instances;
- a way to validate more sophisticated algorithms;
- a fallback when the input is tiny;
- insight into what combinatorial explosion actually needs to be removed.

If a problem has \(n\) binary choices, the naive space can be \(2^n\). If it asks for a permutation, it may be \(n!\). The search is conceptually simple but quickly becomes impossible.

## Contribution

Brute force contributes a universal strategy with minimal structural assumptions:

1. define the candidate space;
2. enumerate candidates;
3. test feasibility;
4. score feasible candidates;
5. retain the best.

It is frequently the starting point from which pruning, memoization, branch-and-bound, symmetry reduction, heuristics, or approximation are derived.

## Implementation

```python
def exhaustive(candidates, feasible, score):
    best = None
    best_score = None
    for x in candidates:
        if not feasible(x):
            continue
        s = score(x)
        if best_score is None or s < best_score:
            best, best_score = x, s
    return best, best_score
```

### Complexity

Usually dominated by candidate count:

\[
O(|\mathcal{X}|\cdot C_{test}).
\]

For subset enumeration, \(|\mathcal{X}|=2^n\). For permutations, \(n!\).

### Failure modes

- treating brute force as unacceptable without checking actual input size;
- using it on large instances without pruning;
- generating all candidates in memory instead of streaming them;
- duplicating symmetric states.

### Combination ideas

Brute force becomes much more powerful when combined with:

- **backtracking** to reject partial candidates early;
- **branch-and-bound** to prune candidates whose best possible completion is already inferior;
- **memoization** to avoid repeating equivalent subproblems;
- **randomization** to sample candidates rather than enumerate all;
- **parallelism** when candidate evaluations are independent.

### Research use

For a new heuristic, keep a brute-force solver for small problem instances. It lets you measure true optimality gaps rather than only comparing one heuristic against another.

---

# 2. Decomposition

## Motivation

Large problems are often difficult because they mix several concerns. Decomposition asks whether the problem can be separated into subproblems with limited interfaces.

Examples:

- compiler: lexing → parsing → optimization → code generation;
- AI agent: retrieve → reason → select tool → execute → evaluate;
- routing: candidate generation → feasibility checks → path optimization;
- distributed service: partition → local computation → aggregation.

## Contribution

Decomposition reduces cognitive and computational complexity by exposing structure.

The central design question is:

> Can the global solution be reconstructed from solutions to smaller components without losing essential interactions?

There are multiple forms.

### Functional decomposition

Split by responsibility.

### Data decomposition

Partition input data into independent or weakly coupled pieces.

### Temporal decomposition

Break a process into stages.

### Hierarchical decomposition

Solve coarse structure first, then refine.

### Optimization decomposition

Separate a large optimization into master/subproblems, local components, or alternating updates.

## Implementation

A good decomposition has an explicit contract:

```text
Subproblem input
    ↓
well-defined transformation
    ↓
Subproblem output
    ↓
composition rule
```

For every boundary document:

- required inputs;
- guarantees on outputs;
- failure semantics;
- whether state is shared;
- whether execution can be parallel;
- whether approximation error propagates.

## Failure modes

- decomposing strongly coupled variables and then ignoring interactions;
- duplicating state across modules;
- local objectives that conflict with the global objective;
- excessive communication between supposedly independent components;
- interfaces that throw away uncertainty needed downstream.

## Combination ideas

Decomposition is the meta-pattern behind divide-and-conquer, dynamic programming, MapReduce, hierarchical planning, multi-agent architecture, mixture-of-experts systems, and distributed optimization.

---

# 3. Divide and Conquer

## Motivation

Some problems contain smaller independent instances of the same problem. Instead of solving the full instance directly:

1. divide it;
2. recursively solve parts;
3. combine results.

Classic examples include merge sort, quicksort, binary search, FFT, closest pair of points, and parallel reductions.

## Contribution

Divide-and-conquer turns problem structure into a recurrence. A common form is

\[
T(n)=aT(n/b)+f(n)
\]

where:

- \(a\): number of recursive subproblems;
- \(n/b\): size of each subproblem;
- \(f(n)\): partition/combine cost.

Understanding the recurrence explains the algorithm's scalability.

### Merge sort

\[
T(n)=2T(n/2)+O(n)=O(n\log n).
\]

### Binary search

\[
T(n)=T(n/2)+O(1)=O(\log n).
\]

## Implementation

```python
def divide_and_conquer(problem):
    if small(problem):
        return solve_directly(problem)

    parts = divide(problem)
    solutions = [divide_and_conquer(p) for p in parts]
    return combine(solutions)
```

### Engineering considerations

Recursive decomposition has overhead. Production systems often use a threshold below which an iterative/simple method is faster.

Parallelism is attractive when subproblems are independent, but the combine phase can become a bottleneck.

## Failure modes

- overlapping subproblems cause repeated work — often a signal for dynamic programming;
- highly unbalanced partitions degrade performance, as in worst-case quicksort;
- combine cost dominates;
- recursion depth causes stack problems.

## Combination ideas

- divide-and-conquer + randomization → randomized quicksort;
- divide-and-conquer + parallelism → parallel sort/reduce;
- divide-and-conquer + approximation → multilevel solvers;
- hierarchical search + divide-and-conquer → coarse-to-fine planning.

---

# 4. Recursion

## Motivation

Recursion is appropriate when an object or problem is naturally defined in terms of smaller objects of the same kind.

Examples:

- trees contain subtrees;
- expressions contain subexpressions;
- filesystem directories contain directories;
- recursive mathematical sequences;
- graph search can recursively visit neighbors.

## Contribution

Recursion separates:

- **base case**: directly solvable instance;
- **recursive case**: reduce to smaller instance(s).

This often creates code that mirrors a mathematical specification.

## Implementation

```python
def dfs(node):
    if node in visited:
        return
    visited.add(node)
    for nxt in graph[node]:
        dfs(nxt)
```

### Correctness reasoning

Recursive correctness frequently follows induction:

1. prove base case;
2. assume recursive calls solve smaller cases correctly;
3. prove the combination yields the current solution.

## Failure modes

- missing base case;
- recursion does not shrink the problem;
- exponential recomputation;
- stack overflow;
- shared mutable state creates subtle bugs.

### Tail recursion vs explicit stack

Many recursive algorithms can be implemented iteratively using an explicit stack. This gives greater control over memory and is often preferable in production graph traversal.

## Combination ideas

Recursion is a representation mechanism used by:

- divide-and-conquer;
- DFS;
- backtracking;
- tree dynamic programming;
- recursive-descent parsing;
- branch-and-bound.

---

# 5. Greedy Algorithms

## Motivation

If a problem can be solved by repeatedly making the locally best choice without needing to revise earlier choices, a greedy algorithm can be dramatically simpler and faster than global search.

Examples:

- interval scheduling;
- Kruskal's and Prim's minimum spanning tree algorithms;
- Huffman coding;
- Dijkstra's shortest-path algorithm under nonnegative weights;
- certain resource allocation problems.

## Contribution

Greedy design relies on a structural theorem, not on optimism.

A typical proof needs one or both of:

### Greedy-choice property

There exists an optimal solution containing the locally greedy decision.

### Optimal substructure

After making that choice, the remaining problem is itself optimally solvable.

A common proof technique is an **exchange argument**: take an arbitrary optimal solution and show its first differing choice can be replaced by the greedy choice without making the solution worse.

## Example: interval scheduling

Goal: select the largest number of non-overlapping intervals.

Greedy rule: repeatedly choose the feasible interval with the earliest finish time.

Why it works: finishing earliest leaves at least as much room for future intervals as any alternative first choice.

## Implementation

```python
def interval_schedule(intervals):
    intervals = sorted(intervals, key=lambda x: x.end)
    chosen = []
    end = float('-inf')
    for x in intervals:
        if x.start >= end:
            chosen.append(x)
            end = x.end
    return chosen
```

## Complexity

Frequently sorting dominates:

\[
O(n\log n).
\]

Some greedy algorithms can be linear if the input is already organized appropriately.

## Failure modes

Greedy methods fail when present choices affect future feasibility/value in ways the local score does not capture.

Classic counterexample: 0/1 knapsack cannot generally be solved by taking items in descending value/weight ratio, even though fractional knapsack can.

## Implementation discipline

Before trusting a greedy rule:

1. state the exact rule;
2. search for a small counterexample;
3. identify an exchange argument or matroid-like structure;
4. compare against brute force on small random instances.

## Combination ideas

- greedy candidate generation + exact local optimization;
- greedy warm start + branch-and-bound;
- greedy exploitation + exploration bonus → UCB-style decision rules;
- greedy routing + learned heuristic;
- greedy cache admission + learned eviction.

---

# 6. Dynamic Programming (DP)

## Motivation

Recursive solutions become wasteful when the same subproblem is solved repeatedly.

Dynamic programming applies when two properties appear.

### Overlapping subproblems

The recursion reaches the same smaller state multiple times.

### Optimal substructure

An optimal global solution can be constructed from optimal solutions to subproblems.

The key contribution is simple:

> Define the right state, solve each state once, store it, and reuse it.

## Contribution

Dynamic programming converts repeated recursive work into a directed acyclic dependency computation whenever the state transitions can be ordered.

A DP formulation has four central pieces.

### 1. State

What information uniquely determines the remaining subproblem?

### 2. Recurrence

How is the answer for a state computed from smaller states?

### 3. Base cases

What states are directly known?

### 4. Evaluation order

In what order can dependencies be computed?

## Example: Fibonacci

Naive recursion:

\[
F(n)=F(n-1)+F(n-2)
\]

recomputes values exponentially.

Memoized or bottom-up evaluation computes every \(F(i)\) once, yielding \(O(n)\) time.

```python
def fib(n):
    if n < 2:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

The memory optimization works because only the previous two states are required.

## Example: 0/1 knapsack

State:

\[
DP[i,w] = \text{best value using first } i \text{ items with capacity } w.
\]

Recurrence:

\[
DP[i,w]=\max\left(DP[i-1,w],\;v_i+DP[i-1,w-w_i]\right)
\]

when item \(i\) fits.

This exposes an important property: a problem can be exponential in naive search but pseudo-polynomial when a numerical constraint is used as a DP dimension.

## Memoization vs tabulation

### Memoization / top-down

- implement natural recursion;
- cache states on demand;
- may avoid unreachable states;
- incurs recursion/hash overhead.

### Tabulation / bottom-up

- compute states in dependency order;
- often faster and easier to optimize memory;
- may compute unused states.

## State design is the hard part

A DP state should contain all information needed for future decisions but no irrelevant history.

Too little state → incorrect recurrence.

Too much state → state-space explosion.

This is closely related to the Markov property in reinforcement learning: the state should summarize the past sufficiently for future reasoning.

## Complexity

A useful rule:

\[
\text{time} \approx \#\text{states} \times \#\text{transitions per state}.
\]

Memory is approximately number of stored states, possibly reduced using rolling arrays or state compression.

## Failure modes

- hidden dependence on omitted history;
- cycles in recurrence without appropriate fixed-point treatment;
- enormous state dimensions;
- integer-index DP applied to continuous values without discretization consequences;
- storing full solution objects when parent pointers are enough.

## Advanced forms

### Tree DP

Subproblems correspond to subtrees.

### Bitmask DP

State includes a subset encoded as bits. Useful for small \(n\) combinatorial problems such as exact TSP variants.

### Interval DP

State is a subarray/subsequence interval \([i,j]\).

### Digit DP

Counts objects represented by number prefixes under digit constraints.

### DP on DAGs

Topological order provides a natural evaluation order.

### Bellman equations

Reinforcement learning and optimal control extend DP to stochastic sequential decisions:

\[
V(s)=\max_a\left[r(s,a)+\gamma\sum_{s'}P(s'|s,a)V(s')\right].
\]

This is one of the deepest bridges between classical algorithms and modern learning systems.

## Combination ideas

- DP + approximation → approximate dynamic programming;
- DP + neural function approximation → value-based RL;
- DP + search → memoized game search;
- DP + constraint optimization → state-space planning;
- DP + decomposition → hierarchical optimization;
- DP + streaming → incremental recurrence updates.

---

# 7. How to choose among the paradigms

| Signal in the problem | Likely technique |
|---|---|
| Tiny candidate space, correctness matters | exhaustive search |
| Independent smaller instances of same form | divide-and-conquer |
| Natural nested structure | recursion |
| Locally optimal choice can be proven safe | greedy |
| Same subproblems repeat | dynamic programming |
| Huge search but partial candidates can be rejected | backtracking / branch-and-bound |
| Exact optimization too expensive | approximation / heuristics |

A practical sequence is:

```text
Write brute force
    ↓
Observe repeated or impossible work
    ↓
Identify structure
    ├─ independent parts → divide-and-conquer
    ├─ repeated subproblems → DP
    ├─ provably safe local choice → greedy
    └─ infeasible partial states → pruning/backtracking
```

---

# 8. Research combination examples

## Greedy + bandit exploration

A purely greedy online system selects the action with the best current estimate. UCB-style methods modify that local score with uncertainty:

\[
\text{score}=\text{estimated value}+\text{uncertainty bonus}.
\]

This can be viewed as a greedy algorithm operating on an optimism-adjusted objective.

## Dynamic programming + learned value function

When a DP state space is too large, replace the exact value table with a learned approximation. This leads naturally toward approximate dynamic programming and reinforcement learning.

## Divide-and-conquer + distributed execution

Partition a large dataset or graph, compute local summaries, and combine them. This is the conceptual ancestor of many distributed data-processing systems.

## Brute-force oracle + heuristic learner

Generate optimal solutions for small instances using exhaustive or branch-and-bound search, then train a model to imitate or predict good decisions on larger instances.

---

# 9. Implementation checklist

For any new algorithm based on these paradigms, record:

- problem definition;
- state representation;
- exact invariant;
- recurrence or greedy rule;
- proof idea;
- termination condition;
- time complexity;
- memory complexity;
- adversarial/worst-case input;
- smallest counterexample to plausible alternative strategies;
- brute-force validation range;
- opportunities for parallelism;
- approximation or learning extensions.

---

# 10. References

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed.: https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
- MIT OpenCourseWare 6.006 lecture notes — sorting, searching, shortest paths, dynamic programming: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2008/pages/lecture-notes/
- MIT OpenCourseWare 6.046J — advanced DP, greedy methods, flow, approximation: https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/lecture-notes/
