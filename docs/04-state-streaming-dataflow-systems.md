# 04 — State Machines, Events, Queues, Caching, Streaming, and Dataflow

This chapter covers foundational algorithms and system patterns for computations that evolve over time rather than simply accepting one static input and returning one static output.

---

# 1. State Machines

## Motivation

Many systems behave differently depending on what has happened before. A request handler, workflow, network connection, job, user session, device, or agent has a **state**, and events cause transitions.

The fundamental model is

\[
(state,event)\rightarrow(new\ state, output).
\]

## Contribution

A finite-state machine makes hidden lifecycle assumptions explicit.

Example:

```text
QUEUED --start--> RUNNING
RUNNING --success--> SUCCEEDED
RUNNING --error--> FAILED
FAILED --retry--> QUEUED
RUNNING --cancel--> CANCELLED
```

This prevents invalid transitions such as `SUCCEEDED -> RUNNING` unless deliberately supported.

## Implementation

```python
TRANSITIONS = {
    ("QUEUED", "start"): "RUNNING",
    ("RUNNING", "success"): "SUCCEEDED",
    ("RUNNING", "error"): "FAILED",
    ("FAILED", "retry"): "QUEUED",
}

def transition(state, event):
    key = (state, event)
    if key not in TRANSITIONS:
        raise ValueError("invalid transition")
    return TRANSITIONS[key]
```

## Invariants

- state transitions are explicit;
- invalid events do not silently mutate state;
- transition effects are atomic where necessary;
- external side effects have defined retry semantics.

## Extensions

### Hierarchical state machines / Statecharts

Flat state machines become unwieldy for complex behavior. Statecharts add hierarchy, concurrency, and communication.

Reference: David Harel, “Statecharts: a visual formalism for complex systems,” 1987: https://doi.org/10.1016/0167-6423(87)90035-9

### State machine + event sourcing

Store transitions/events rather than only the latest state. This enables audit, replay, reconstruction, and alternative projections.

## Combination ideas

- state machine + workflow scheduler;
- state machine + consensus → replicated state machine;
- state machine + policy/bandit → adaptive transition decisions;
- state machine + event log → replayable agent execution.

---

# 2. Event-Driven Processing

## Motivation

Polling repeatedly asks whether something changed. Event-driven systems react when change occurs.

```text
event source
    ↓
queue / broker
    ↓
handler
    ↓
state change / side effect
```

## Contribution

Events decouple producers from consumers in time and architecture. Producers announce facts; consumers independently react.

Important distinctions:

- **command**: request to perform an action;
- **event**: statement that something happened;
- **query**: request for information.

Confusing these leads to poor retry and ownership semantics.

## Implementation concerns

### Ordering

Does order matter globally, per key, per partition, or not at all?

### Delivery semantics

Real systems often expose variants of:

- at-most-once;
- at-least-once;
- effectively-once through idempotency/deduplication and transactional boundaries.

### Backpressure

Consumers must signal or indirectly enforce limits when producers are faster than processing capacity.

### Event time vs processing time

Streaming analytics often must distinguish when an event occurred from when it arrived.

## Failure modes

- duplicate event processing;
- out-of-order events;
- poison messages;
- unbounded queues;
- hidden synchronous dependencies inside “asynchronous” systems;
- non-idempotent handlers.

---

# 3. Queues

## Motivation

Queues separate arrival time from execution time.

Core abstraction:

```text
producer → queue → worker
```

## Contribution

Queues provide buffering, smoothing, scheduling, and failure isolation.

### FIFO

First-in, first-out preserves arrival order under a simple queue.

### Priority queue

Items are selected by priority rather than age. Heaps commonly support:

- insert: \(O(\log n)\);
- extract-min/max: \(O(\log n)\);
- peek: \(O(1)\).

Priority queues power Dijkstra, A*, schedulers, simulation engines, and top-K systems.

## Queueing perspective

If average arrival rate exceeds sustainable service rate, backlog grows without bound. No queue data structure can solve a capacity mismatch.

A simplified utilization is

\[
\rho=\frac{\lambda}{\mu},
\]

where \(\lambda\) is arrival rate and \(\mu\) service rate for a simple single-server abstraction. As utilization approaches saturation, latency typically becomes unstable/high.

## Combination ideas

- queue + autoscaling;
- queue + backpressure;
- queue + priority policy;
- queue + bandit scheduler choosing worker/tool;
- queue + deadline-aware scheduling.

---

# 4. Scheduling

## Motivation

Multiple tasks compete for limited resources such as CPU, GPU, workers, network, API quota, or humans.

A scheduler chooses **what runs next, where, and for how long**.

## Core policies

### FIFO / FCFS

Simple and fair by arrival, but long jobs can delay short jobs.

### Shortest Job First

Minimizes average completion time under idealized knowledge, but job duration is often unknown.

### Round Robin

Time-slices work for responsiveness/fairness.

### Priority Scheduling

Executes high-priority tasks first; risks starvation without aging.

### Earliest Deadline First

Prioritizes deadlines in real-time scheduling contexts.

### Weighted Fair Scheduling

Shares capacity according to weights.

## Contribution

Scheduling is an optimization problem under incomplete information. Real schedulers combine:

- hard constraints;
- fairness;
- predicted duration/resource need;
- priorities;
- locality;
- preemption cost;
- deadlines.

## Combination research

Contextual bandits can learn which worker/model/tool is best for a task, while a deterministic scheduler enforces capacity and hard deadlines.

---

# 5. Caching

## Motivation

If a computation or fetch is expensive and likely to repeat, store the result.

```text
request
  ↓
cache hit? ──yes→ return
  ↓ no
compute/fetch
  ↓
store
  ↓
return
```

## Contribution

Caching trades memory and consistency complexity for lower latency and reduced backend load.

The key quantity is not cache size alone but **reuse locality**.

### Temporal locality

Recently used values are likely to be reused.

### Frequency locality

Frequently used values should remain available.

## Eviction algorithms

### LRU

Evict least recently used.

Motivation: exploit temporal locality.

### LFU

Evict least frequently used.

Motivation: retain historically popular items.

### FIFO

Simple but not adaptive to reuse.

### Random eviction

Cheap and sometimes surprisingly competitive.

### Optimal/Belady policy

Evict the item whose next use is farthest in the future. This requires future knowledge and therefore serves mainly as an offline benchmark/lower bound for misses.

## Implementation concerns

### Cache key correctness

The key must include every input that changes the result.

### Invalidation

The famous difficulty: when underlying truth changes, cached values may become stale.

Strategies:

- TTL;
- explicit invalidation;
- versioned keys;
- write-through;
- write-back;
- stale-while-revalidate.

### Stampede prevention

Many concurrent misses for one key can overload the backend. Use request coalescing/single-flight, locks, or probabilistic early refresh.

## Metrics

- hit ratio;
- byte hit ratio;
- miss latency;
- eviction rate;
- stale response rate;
- backend load saved.

## Combination ideas

- cache + learned eviction;
- cache + Bloom filter;
- cache + CDN hierarchy;
- cache + vector retrieval;
- cache + online prediction of reuse.

---

# 6. Memoization vs Caching

They are related but not identical.

### Memoization

Usually stores results of deterministic function calls within an algorithm/process. It is strongly associated with dynamic programming and recursion.

### Caching

Broader systems concept involving remote data, lifecycle, eviction, consistency, and capacity.

A useful way to think:

> memoization is algorithm-local caching; production caching adds distributed systems and data freshness problems.

---

# 7. Streaming Algorithms

## Motivation

Data may be too large or too fast to store and repeatedly rescan.

Streaming model:

```text
item_1 → update summary
item_2 → update summary
...
item_t → update summary
```

The algorithm maintains a compact state.

## Contribution

Streaming algorithms trade exact historical access for small memory and one/few passes.

Important goals include:

- counts;
- distinct count;
- frequencies/heavy hitters;
- quantiles;
- moments;
- samples;
- approximate membership.

---

# 8. Reservoir Sampling

## Motivation

Keep a uniform sample of \(k\) items from a stream of unknown length.

## Contribution

For the \(i\)-th item after filling the reservoir, keep it with probability \(k/i\); if kept, replace a uniformly chosen reservoir position.

```python
import random

def reservoir(stream, k):
    sample = []
    for i, x in enumerate(stream, start=1):
        if i <= k:
            sample.append(x)
        else:
            j = random.randint(1, i)
            if j <= k:
                sample[j - 1] = x
    return sample
```

Memory:

\[
O(k).
\]

This demonstrates a powerful streaming principle: exact historical storage is unnecessary if the target statistic has a compact sufficient procedure.

---

# 9. Approximate Distinct Counting

## Motivation

Counting unique identifiers exactly can require memory proportional to the number of distinct items.

Probabilistic sketches such as HyperLogLog estimate cardinality using compact summaries derived from hashed values.

## Contribution

Accept a small statistical error to reduce memory dramatically.

The deeper pattern is:

> use hashing to transform a large domain into a random variable whose distribution reveals the statistic of interest.

---

# 10. Frequency Sketches and Heavy Hitters

## Motivation

Find frequent elements in a huge stream without storing a full exact counter per key.

Sketches such as Count-Min Sketch use multiple hashed counter arrays. Querying returns an overestimate controlled probabilistically by width/depth parameters.

Applications:

- network telemetry;
- abuse detection;
- top queries;
- approximate feature counts;
- monitoring.

## Combination ideas

Sketches can decide which keys deserve promotion into an exact cache or detailed monitoring table.

---

# 11. Sliding Windows

## Motivation

For changing environments, lifetime statistics are stale. Often only recent history matters.

Window types:

- last \(N\) events;
- last \(T\) minutes;
- exponentially decayed history.

## Contribution

Windowing introduces controlled forgetting.

This same concept appears in:

- nonstationary bandits;
- online regression;
- anomaly detection;
- monitoring;
- adaptive control.

---

# 12. Map → Filter → Reduce

## Motivation

A large class of data transformations can be decomposed into three operations.

### Map

Transform each item independently.

\[
x_i\rightarrow f(x_i)
\]

### Filter

Keep items satisfying predicate \(P\).

### Reduce

Combine many items using an aggregation.

\[
y = x_1\oplus x_2\oplus\cdots\oplus x_n.
\]

## Contribution

This decomposition exposes parallelism and clarifies dataflow.

Example:

```text
logs
 ↓ filter errors
error logs
 ↓ map(service, latency)
key-value records
 ↓ reduce by service
service latency summary
```

Associative reductions are particularly parallelizable.

---

# 13. MapReduce

## Motivation

Executing map/reduce computations over huge datasets across many unreliable machines requires partitioning, scheduling, shuffle, retry, and failure handling.

## Contribution

MapReduce made these infrastructure concerns part of the runtime abstraction.

User provides:

- map function producing intermediate key/value pairs;
- reduce function combining values for a key.

Runtime handles:

- input partitioning;
- task scheduling;
- shuffle;
- worker failure;
- distribution.

This separates domain logic from cluster orchestration.

Primary reference: Dean and Ghemawat, “MapReduce: Simplified Data Processing on Large Clusters,” OSDI 2004: https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/

## Failure modes / limitations

- iterative algorithms may reread/write too much intermediate state;
- skewed keys produce stragglers;
- shuffle dominates network cost;
- not every computation fits one map/reduce stage naturally.

## Modern descendants

Distributed dataflow engines generalize the model with DAGs, in-memory stages, streaming execution, and richer operators.

---

# 14. Dataflow DAGs

## Motivation

Complex processing pipelines contain dependencies among transformations.

Represent operations as nodes and dependencies as edges:

```text
source
 ├→ clean ─→ join ─→ aggregate
 └→ metadata ───────┘
```

## Contribution

Once represented as a DAG:

- topological scheduling becomes possible;
- independent stages can run in parallel;
- lineage supports recomputation;
- failures can be isolated;
- intermediate results can be cached.

This connects classical graph algorithms directly to workflow and analytics systems.

---

# 15. Backpressure

## Motivation

If an upstream producer can emit faster than downstream can process, queues grow until memory, latency, or storage fails.

## Contribution

Backpressure turns downstream capacity into a control signal that slows or limits upstream production.

Possible mechanisms:

- bounded queues;
- pull-based demand;
- flow-control credits;
- admission control;
- load shedding;
- adaptive batch size.

## Research connection

Backpressure is a feedback-control problem embedded in a data system.

---

# 16. Rate Limiting Algorithms

## Token Bucket

Tokens accumulate up to capacity. Each request consumes tokens. This allows controlled bursts while bounding long-term rate.

## Leaky Bucket

Models a fixed drain/output rate, smoothing bursts.

## Fixed/Sliding Windows

Count requests over time windows; sliding methods reduce boundary artifacts.

## Combination ideas

- rate limiter + priority scheduler;
- rate limiter + adaptive quota allocation;
- bandit/RL chooses quota weights while deterministic limiter enforces hard caps.

---

# 17. Feedback Control for Systems

Autoscaling and queue management often use feedback:

\[
error = target - measured.
\]

For example:

```text
latency target
   ↓
error calculation
   ↓
autoscaler
   ↓
worker count
   ↓
measured latency
   └──────── feedback
```

This reveals that distributed systems and control theory overlap heavily.

A naive reactive system can oscillate due to delayed measurements and slow provisioning. Smoothing, hysteresis, predictive signals, and carefully chosen control gains are important.

---

# 18. Event Sourcing and Replay

## Motivation

Storing only current state loses the history of how it arose.

## Contribution

Persist an append-only sequence of domain events:

```text
TaskCreated
TaskStarted
ToolCalled
ToolSucceeded
TaskCompleted
```

Current state is a projection/fold over events.

Benefits:

- auditability;
- replay;
- debugging;
- rebuilding derived views;
- temporal analysis.

Costs:

- schema evolution;
- replay cost;
- event ordering/versioning;
- privacy/deletion concerns;
- side effects must not repeat during replay.

## Combination ideas

Event-sourced traces are especially valuable for learning systems because they can become offline training/evaluation data—if propensities, contexts, and outcomes are logged correctly.

---

# 19. Composition Pattern for Modern Adaptive Systems

```text
incoming request/event
       ↓
state machine validation
       ↓
rate limit / admission control
       ↓
priority queue / scheduler
       ↓
cached result available? ─yes→ return
       ↓ no
candidate generation / computation
       ↓
execution
       ↓
event log
       ↓
streaming aggregates
       ↓
online learner / bandit update
```

This architecture combines classical data structures, control, distributed execution, and online learning without requiring any one algorithm to solve everything.

---

# 20. Implementation Checklist

For stateful/streaming systems document:

- state schema and legal transitions;
- event schema/version;
- ordering requirement;
- delivery semantics;
- idempotency key;
- retry policy;
- queue capacity;
- overload behavior;
- priority/fairness policy;
- cache key and invalidation rules;
- stream window definition;
- time semantics;
- backpressure mechanism;
- replay semantics;
- metrics and traces.

Essential metrics:

- queue depth;
- enqueue/dequeue rate;
- processing latency percentiles;
- retry rate;
- duplicate rate;
- cache hit ratio;
- state-transition failures;
- stream lag;
- dropped events;
- worker utilization.

---

# 21. References

- Harel, “Statecharts: a visual formalism for complex systems,” 1987: https://doi.org/10.1016/0167-6423(87)90035-9
- Dean and Ghemawat, “MapReduce: Simplified Data Processing on Large Clusters,” 2004: https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/
- Motwani and Raghavan, *Randomized Algorithms*: https://doi.org/10.1017/CBO9780511814075
- Cormen et al., *Introduction to Algorithms*, 4th ed.: https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
