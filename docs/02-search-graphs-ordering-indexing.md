# 02 — Search, Graphs, Ordering, Hashing, and Indexing

Many modern systems are fundamentally retrieval systems: given a state, key, query, or node, locate the most relevant object or path quickly. The main tools are search, graph algorithms, sorting, selection, hashing, and indexing.

---

# 1. Search as a General Problem

## Motivation

A search problem contains:

- an initial state;
- a set of possible actions/transitions;
- a goal condition;
- optionally, transition costs and heuristic information.

The naive approach enumerates all reachable states. Search algorithms differ mainly in **which state they expand next**, **what information they remember**, and **what they prune**.

A generic graph-search skeleton is:

```python
def graph_search(start, expand, is_goal, frontier):
    frontier.push(start)
    seen = set()

    while frontier:
        state = frontier.pop()
        if is_goal(state):
            return state
        if state in seen:
            continue
        seen.add(state)
        for nxt in expand(state):
            frontier.push(nxt)
```

Changing the frontier policy produces BFS, DFS, Dijkstra-like search, best-first search, and A* variants.

---

# 2. Depth-First Search (DFS)

## Motivation

DFS explores one branch deeply before trying alternatives. It is useful when:

- solutions may lie deep;
- memory is limited;
- the entire graph must be traversed;
- structural properties such as cycles, connected components, topological relationships, or articulation structure are needed.

## Contribution

DFS provides a simple linear-time traversal for an adjacency-list graph:

\[
O(|V|+|E|).
\]

Its traversal tree and timestamps reveal substantial graph structure.

## Implementation

Recursive:

```python
def dfs(u):
    seen.add(u)
    for v in graph[u]:
        if v not in seen:
            parent[v] = u
            dfs(v)
```

Iterative implementations use an explicit stack and avoid recursion-depth limitations.

## Uses

- reachability;
- connected components;
- cycle detection;
- topological sorting;
- strongly connected components as part of Tarjan/Kosaraju-style methods;
- maze/search exploration;
- dependency analysis.

## Failure modes

DFS does **not** guarantee the shortest path in an unweighted graph. On infinite/deep spaces it can spend all its effort in an unproductive branch unless bounded or made iterative-deepening.

## Combination ideas

- DFS + backtracking → constraint search;
- DFS + memoization → graph/state DP;
- DFS + low-link information → connectivity analysis;
- DFS + depth limit → iterative deepening.

---

# 3. Breadth-First Search (BFS)

## Motivation

BFS explores states in increasing number of transitions from the start.

## Contribution

In an unweighted graph, or a graph whose edges all have equal cost, BFS finds shortest paths by number of edges.

Using adjacency lists:

\[
O(|V|+|E|)
\]

time and \(O(|V|)\) memory in the worst case.

## Implementation

```python
from collections import deque

def bfs(start):
    q = deque([start])
    dist = {start: 0}

    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist
```

## Failure modes

The frontier can become enormous when branching factor is high. A search tree with branching factor \(b\) and solution depth \(d\) can require memory on the order of \(b^d\).

## Combination ideas

- bidirectional BFS for known start and goal;
- multi-source BFS;
- BFS on implicit state spaces;
- BFS + pruning for puzzles/planning;
- BFS as a building block in flow and matching algorithms.

---

# 4. Iterative Deepening

## Motivation

DFS uses little memory but can get lost deep; BFS is complete for finite branching and finds shallow solutions but can consume enormous memory.

## Contribution

Iterative deepening repeatedly performs depth-limited DFS with increasing limits:

```text
limit 0
limit 1
limit 2
...
```

It combines DFS-like memory with BFS-like discovery order by depth. Re-exploration is often acceptable because most nodes in exponentially growing trees occur at the deepest level.

## Use

Game search and large implicit trees where edge costs are uniform or depth is the natural cost.

---

# 5. Bidirectional Search

## Motivation

If a path of depth \(d\) is sought in a branching space of factor \(b\), ordinary BFS can explore roughly \(b^d\) states.

## Contribution

Search from both start and goal and stop when frontiers meet. Idealized work can fall toward:

\[
O(b^{d/2}).
\]

## Constraints

- predecessor generation must be possible or reverse edges known;
- detecting intersection must be efficient;
- path reconstruction must combine both halves;
- weighted settings require more care than ordinary BFS.

---

# 6. Best-First Search and Heuristics

## Motivation

Uniform exploration wastes work when domain knowledge can estimate which states are promising.

Best-first methods maintain a priority queue ordered by an evaluation function.

### Greedy best-first

\[
f(n)=h(n)
\]

where \(h(n)\) estimates remaining distance/cost.

It can be fast, but it does not generally guarantee optimality.

---

# 7. A* Search

## Motivation

A* combines known path cost with estimated remaining cost:

\[
f(n)=g(n)+h(n)
\]

where:

- \(g(n)\): cost from start to \(n\);
- \(h(n)\): heuristic estimate from \(n\) to goal.

## Contribution

A* gives a principled way to inject problem-specific knowledge into shortest-path search.

If \(h\) is admissible—never overestimates true remaining cost—A* can preserve optimality under standard conditions. Consistency/monotonicity gives stronger operational properties for graph search.

### Heuristic quality

- \(h=0\) makes A* behave like uniform-cost/Dijkstra search;
- a more informative admissible heuristic can reduce expansions;
- an exact remaining-cost heuristic would guide directly toward an optimal path but is usually as hard as solving the problem.

## Implementation

```python
import heapq

def astar(start, goal, neighbors, h):
    pq = [(h(start), 0, start)]
    best_g = {start: 0}
    parent = {}

    while pq:
        f, g, u = heapq.heappop(pq)
        if u == goal:
            return g, parent
        if g != best_g[u]:
            continue

        for v, cost in neighbors(u):
            ng = g + cost
            if ng < best_g.get(v, float('inf')):
                best_g[v] = ng
                parent[v] = u
                heapq.heappush(pq, (ng + h(v), ng, v))
```

## Failure modes

- heuristic overestimation can sacrifice optimality;
- huge open sets consume memory;
- inconsistent heuristics can cause re-expansions;
- badly scaled heuristic and path cost can produce weak guidance;
- learned heuristics may shift out of distribution.

## Combination ideas

- A* + learned heuristic;
- weighted A* for bounded/suboptimal faster search;
- hierarchical A*;
- A* + constraint pruning;
- A* + bandit allocation to decide which search region to expand under uncertain heuristic quality.

Primary reference: Hart, Nilsson, Raphael, “A Formal Basis for the Heuristic Determination of Minimum Cost Paths,” 1968: https://doi.org/10.1109/TSSC.1968.300136

---

# 8. Dijkstra's Shortest-Path Algorithm

## Motivation

Find minimum-cost paths from one source when edge costs are nonnegative.

## Contribution

Dijkstra maintains tentative distances and repeatedly finalizes the unsettled node with smallest known distance.

Key relaxation:

\[
\text{if } d[u]+w(u,v)<d[v],\quad d[v]\leftarrow d[u]+w(u,v).
\]

The nonnegative-edge assumption ensures a settled node cannot later be improved through a path that first travels through a more expensive unsettled node.

## Implementation

```python
import heapq

def dijkstra(graph, source):
    dist = {source: 0.0}
    pq = [(0.0, source)]

    while pq:
        du, u = heapq.heappop(pq)
        if du != dist[u]:
            continue
        for v, w in graph[u]:
            nd = du + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist
```

### Complexity

With a binary heap and adjacency list, a common bound is

\[
O((|V|+|E|)\log |V|).
\]

## Failure mode

Negative edges invalidate the settled-node argument. Use algorithms such as Bellman-Ford when negative weights are allowed and negative cycles must be detected.

Primary reference: E. W. Dijkstra, 1959: https://doi.org/10.1007/BF01386390

---

# 9. Bellman-Ford

## Motivation

Dijkstra cannot handle negative edge weights.

## Contribution

Bellman-Ford repeatedly relaxes every edge. Any simple shortest path without negative cycles has at most \(|V|-1\) edges, so \(|V|-1\) passes suffice. One additional successful relaxation signals a reachable negative cycle.

### Complexity

\[
O(|V||E|).
\]

It is slower than Dijkstra but handles a more general problem.

## Combination idea

Bellman-Ford illustrates a common design rule: if a faster greedy invariant breaks, repeated dynamic-relaxation methods may restore correctness at higher computational cost.

---

# 10. Floyd-Warshall

## Motivation

Need shortest paths between every pair of vertices, especially on modest dense graphs.

## Contribution

Dynamic programming over allowed intermediate vertices:

\[
D^{(k)}[i,j]=\min\left(D^{(k-1)}[i,j],D^{(k-1)}[i,k]+D^{(k-1)}[k,j]\right).
\]

### Complexity

\[
O(|V|^3) \text{ time},\qquad O(|V|^2) \text{ memory}.
\]

This is a clear example of graph problems becoming DP after the correct state dimension is chosen.

---

# 11. Topological Sorting

## Motivation

A directed acyclic graph encodes precedence/dependencies. We need an order in which every prerequisite appears before dependents.

## Contribution

Two standard approaches:

- DFS postorder;
- Kahn's algorithm using in-degrees.

### Kahn implementation

```python
from collections import deque

def topo(graph, indegree):
    q = deque([u for u, d in indegree.items() if d == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    if len(order) != len(indegree):
        raise ValueError('cycle detected')
    return order
```

## Applications

- build systems;
- workflow orchestration;
- dependency resolution;
- DAG scheduling;
- DP on graphs.

---

# 12. Minimum Spanning Trees: Kruskal and Prim

## Motivation

Connect all vertices with minimum total edge weight without cycles.

## Kruskal contribution

Sort edges by weight and add the next lightest edge that connects two previously disconnected components. Union-find efficiently tracks components.

Typical complexity:

\[
O(|E|\log |E|).
\]

## Prim contribution

Grow one tree by repeatedly taking the cheapest edge crossing from the current tree to an outside vertex. Priority queues give efficient implementations.

## Why greedy works

The cut property gives a structural proof that certain light edges are safe choices.

## Applications

- network design;
- clustering variants;
- infrastructure layout;
- approximation algorithms.

---

# 13. Maximum Flow / Minimum Cut

## Motivation

Model capacity-constrained movement through a network.

Examples:

- communication bandwidth;
- transportation;
- assignment reductions;
- image segmentation;
- matching;
- resource routing.

## Contribution

The residual graph represents how existing decisions can be augmented or partially undone. Augmenting-path algorithms repeatedly find a path from source to sink with residual capacity.

The max-flow/min-cut theorem links an optimization problem to a combinatorial certificate: maximum feasible flow equals minimum cut capacity.

## Combination ideas

- bipartite matching reduction;
- scheduling/assignment;
- min-cut as graph partitioning primitive;
- flow subproblems inside larger optimization models.

MIT 6.046J notes include max-flow/min-cut and matching: https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/pages/lecture-notes/

---

# 14. Sorting

Sorting is not merely arranging data. It is a **representation transformation** that often makes later operations cheaper.

## Why sorting matters

Once ordered, data supports:

- binary search;
- merging;
- duplicate detection;
- range queries;
- rank statistics;
- sweep-line algorithms;
- efficient joins.

---

## 14.1 Insertion Sort

### Motivation

Simple, in-place, effective for small or nearly sorted inputs.

### Complexity

- worst/average: \(O(n^2)\);
- best on already sorted input: \(O(n)\).

### Contribution

Maintains a sorted prefix and inserts each new element into its correct location.

It is commonly used as a base case inside more sophisticated hybrid sorting algorithms.

---

## 14.2 Merge Sort

### Contribution

Divide input, recursively sort halves, merge sorted sequences.

\[
O(n\log n)
\]

worst-case time.

Strengths:

- stable;
- predictable runtime;
- natural for linked/external data;
- parallelizable.

Trade-off: standard array implementations require additional merge memory.

---

## 14.3 Quicksort

### Contribution

Partition around a pivot and recursively sort partitions.

Typical/expected performance with good pivot selection:

\[
O(n\log n),
\]

but bad partitions can yield \(O(n^2)\).

Randomized pivoting reduces dependence on adversarial input order.

Quicksort is an important example of divide-and-conquer + randomization.

---

## 14.4 Heapsort

Uses a heap to repeatedly extract an extremal element.

- worst-case \(O(n\log n)\);
- in-place variants;
- not generally stable.

The heap itself becomes a reusable priority-queue data structure for Dijkstra, A*, scheduling, top-k processing, and event simulation.

---

## 14.5 Counting and Radix Sort

Comparison sorting has a lower bound of \(\Omega(n\log n)\) in the comparison model. If keys have exploitable structure, non-comparison algorithms can do better.

Counting sort can run in \(O(n+k)\) for integer keys in a range of size \(k\). Radix sort processes digits/components and can achieve near-linear performance under bounded representations.

Lesson: complexity lower bounds depend on the allowed operations/model of computation.

---

# 15. Binary Search

## Motivation

Find an item or boundary in ordered data without scanning everything.

## Contribution

Each comparison halves the remaining interval:

\[
O(\log n).
\]

## More general use: search on answer

Binary search can find a threshold in a monotonic predicate:

```text
false false false true true true
                  ↑
             first true
```

This converts optimization questions into repeated feasibility tests.

## Failure modes

- off-by-one errors;
- non-monotonic predicate;
- overflow in midpoint calculation in low-level languages;
- incorrect handling of duplicates/boundaries.

---

# 16. Selection and Top-K

## Motivation

Sorting everything is wasteful if only the minimum, maximum, median, kth element, or top \(K\) values are needed.

## Quickselect

Partition as in quicksort but recurse only into the side containing the target rank.

Expected time:

\[
O(n).
\]

Worst-case can be \(O(n^2)\), while deterministic median-of-medians strategies can guarantee linear time with larger constants.

## Heap top-K

Maintain a heap of size \(K\) while streaming through data:

\[
O(n\log K)
\]

time and \(O(K)\) memory.

## Modern applications

- search ranking;
- recommendation candidate selection;
- monitoring heavy hitters;
- beam search;
- nearest-neighbor post-filtering.

---

# 17. Hashing

## Motivation

Map arbitrary keys to locations/identifiers so lookup can be close to constant time on average.

A hash table uses:

\[
h:\mathcal{K}\rightarrow\{0,\ldots,m-1\}.
\]

Collisions are unavoidable when the key universe is larger than the table.

## Collision strategies

### Chaining

Each bucket stores multiple entries.

### Open addressing

Probe alternative locations according to a rule such as linear probing, quadratic probing, or double hashing.

## Contribution

With appropriate load factor and hash behavior, insert/search/delete can be expected \(O(1)\).

## Failure modes

- adversarial collisions;
- excessive load factor;
- poor resizing strategy;
- mutable keys;
- treating cryptographic and non-cryptographic hash functions as interchangeable.

## Combination ideas

Hashing underlies caches, deduplication, partitioning, memoization, joins, content-addressed storage, Bloom filters, and distributed routing.

---

# 18. Bloom Filters

## Motivation

Sometimes we only need a compact probabilistic membership test: “Is this key possibly present?”

## Contribution

A Bloom filter uses a bit array and multiple hash functions. Insert sets several bits; lookup checks them.

Properties:

- no false negatives under the basic append-only model;
- false positives are possible;
- very memory efficient.

For \(m\) bits, \(n\) inserted items, and \(k\) hash functions, a common approximation for false-positive probability is

\[
\left(1-e^{-kn/m}\right)^k.
\]

The near-optimal \(k\) is approximately

\[
k\approx\frac{m}{n}\ln 2.
\]

## Modern uses

- avoid unnecessary disk/network lookups;
- database/storage engines;
- distributed caches;
- deduplication prechecks.

Primary reference: Burton Bloom, 1970, “Space/time trade-offs in hash coding with allowable errors”: https://doi.org/10.1145/362686.362692

---

# 19. Indexing

## Motivation

Scanning the entire dataset for each query is usually the wrong complexity model. An index spends storage and update cost to make future queries cheap.

This is one of the deepest reusable systems ideas:

```text
expensive preprocessing / maintenance
          ↓
      index structure
          ↓
cheap repeated queries
```

---

## 19.1 B-Trees and B+ Trees

### Motivation

Balanced binary trees are not ideal when data lives on disks/pages and I/O dominates. B-trees use high branching factors so one node corresponds naturally to a storage page.

### Contribution

A B-tree maintains sorted keys in balanced multiway nodes. Splits/merges maintain occupancy and logarithmic height.

The original B-tree work explicitly targeted dynamic ordered indexes on secondary storage.

Primary reference: Bayer and McCreight, “Organization and Maintenance of Large Ordered Indexes,” 1972.

### Uses

- database indexes;
- filesystems;
- range scans.

### Combination ideas

B-tree index + buffer cache + write-ahead logging + query planner forms the foundation of many transactional storage engines.

---

## 19.2 Inverted Index

### Motivation

Text search asks: which documents contain a term or feature?

### Contribution

Store mapping:

```text
term → posting list of documents/positions
```

A multi-term query intersects or scores posting lists rather than scanning documents.

### Modern use

- search engines;
- log search;
- source-code search;
- sparse retrieval used alongside dense/vector retrieval.

---

## 19.3 Spatial Indexes

Structures such as k-d trees, R-trees, and quadtrees organize geometric/spatial data to accelerate range and nearest-neighbor queries.

Their effectiveness depends strongly on dimensionality and data distribution.

---

## 19.4 Vector Indexes

High-dimensional embedding retrieval often uses approximate indexes such as HNSW, product quantization, or inverted-file structures. These are covered in detail in the representation/similarity chapter.

The important conceptual difference from exact key indexes is that vector search asks for **nearby** objects under a metric rather than exact key equality.

---

# 20. Cache, Index, or Compute?

For repeated queries, decide among:

### Cache

Store outputs of previous exact queries.

Best when queries repeat.

### Index

Store structure that accelerates many related queries.

Best when query space is large but structured.

### Precompute

Materialize expensive derived results.

Best when updates are infrequent and queries dominate.

### Compute on demand

Best when queries are rare or state changes too quickly for maintenance to pay off.

This cost model is often more important than the specific data structure.

---

# 21. Combination Patterns

## Retrieval → ranking

```text
huge corpus
   ↓ index/search
small candidate set
   ↓ expensive ranker / contextual bandit
final result
```

This is a standard modern architecture. Approximate retrieval optimizes recall/latency; the second stage optimizes decision quality.

## Graph search + learned heuristic

Use machine learning to estimate distance/value and A* or beam search to enforce structured exploration.

## Hashing + partitioning

Hash keys into shards, then maintain local B-tree/LSM/hash indexes inside each shard.

## Top-K + streaming

Maintain only the highest-priority events or metrics under memory limits.

## Index + cache

Index finds the relevant underlying record; cache avoids repeated backend access for hot records.

---

# 22. Implementation and Testing Checklist

For search/index algorithms record:

- exact key/state representation;
- equality and ordering semantics;
- edge/cost assumptions;
- duplicate handling;
- update frequency;
- read/write ratio;
- memory budget;
- persistence requirements;
- worst-case/adversarial input;
- target latency percentile;
- exactness/recall requirements;
- cache/index invalidation strategy;
- concurrency semantics.

Testing should include:

- tiny hand-checkable cases;
- disconnected/cyclic graphs;
- duplicate keys;
- empty/singleton data;
- worst-case ordering;
- very dense and very sparse graphs;
- index rebuild/recovery;
- randomized differential tests against brute force.

---

# 23. References

- Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms*, 4th ed.: https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
- MIT OCW 6.006 lecture notes: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2008/pages/lecture-notes/
- Dijkstra, “A note on two problems in connexion with graphs,” 1959: https://doi.org/10.1007/BF01386390
- Hart, Nilsson, Raphael, “A Formal Basis for the Heuristic Determination of Minimum Cost Paths,” 1968: https://doi.org/10.1109/TSSC.1968.300136
- Bloom, “Space/time trade-offs in hash coding with allowable errors,” 1970: https://doi.org/10.1145/362686.362692
- Bayer and McCreight, “Organization and Maintenance of Large Ordered Indexes,” 1972: https://link.springer.com/article/10.1007/BF00288683
