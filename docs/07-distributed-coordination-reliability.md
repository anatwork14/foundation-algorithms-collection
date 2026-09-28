# 07 — Distributed Coordination, Replication, Sharding, Consensus, and Reliability

Distributed systems add a new source of difficulty: independent machines can fail, messages can be delayed or duplicated, clocks can disagree, and partial progress can be visible in different places. Algorithms here are designed not only to compute answers but to preserve system-wide invariants despite failure and concurrency.

---

# 1. Why Distributed Algorithms Are Different

## Motivation

On one machine, a function call either returns or fails locally. Across a network, many ambiguous outcomes appear:

- request never reached server;
- request reached server but response was lost;
- server executed partially then crashed;
- two replicas disagree temporarily;
- timeout fires even though remote work is still running;
- messages are duplicated or reordered.

The fundamental engineering problem is therefore:

> How do multiple independent participants behave like one reliable logical system?

## Core dimensions

- safety — something bad never happens;
- liveness — something good eventually happens;
- consistency — what different participants are allowed to observe;
- availability — whether operations can complete despite failures;
- durability — whether acknowledged data survives failures;
- partition tolerance — behavior when network connectivity splits.

---

# 2. Replication

## Motivation

One copy of important state creates a single point of failure and can become a throughput/geographic bottleneck.

Replication stores multiple copies:

```text
logical state
   ├→ replica A
   ├→ replica B
   └→ replica C
```

## Contribution

Replication can improve:

- availability;
- read throughput;
- geographic latency;
- fault tolerance;
- durability.

But replication creates a new problem: copies must be coordinated.

## Main replication styles

### Primary/backup (leader/follower)

Writes go through one leader and replicate to followers.

Advantages:

- clear write order;
- simple conflict model.

Challenges:

- leader failure/election;
- replication lag;
- stale follower reads.

### Multi-leader

Several replicas accept writes.

Useful for geographic distribution but creates conflict-resolution complexity.

### Leaderless/quorum-style

Clients coordinate writes/reads across multiple replicas. Systems inspired by Dynamo use versioning, quorum-like mechanisms, and conflict resolution to prioritize availability.

Reference: DeCandia et al., “Dynamo: Amazon's Highly Available Key-value Store,” 2007: https://www.amazon.science/publications/dynamo-amazons-highly-available-key-value-store

---

# 3. Quorums

## Motivation

Do we need every replica to respond before proceeding? Usually not.

Suppose:

- \(N\): replicas;
- \(W\): number required for a successful write;
- \(R\): number queried for a read.

A classical overlap condition is

\[
R+W>N,
\]

which guarantees read and write sets overlap. Stronger guarantees still depend on versioning, failure model, read/write protocol, and concurrency semantics.

## Contribution

Quorums let systems trade latency/availability against consistency requirements.

## Failure modes

- assuming the arithmetic alone guarantees linearizability;
- stale replicas;
- sloppy quorum behavior changing membership of responding nodes;
- unresolved concurrent versions.

---

# 4. Consensus

## Motivation

Several machines need to agree on a value/order despite failures.

Typical uses:

- choose a leader;
- agree on log entries;
- update configuration;
- implement replicated state machines.

Consensus is not simply majority voting. It must define behavior across message delay, duplicate messages, crashes, and leadership changes.

## Core properties

A simplified consensus specification includes:

- agreement — correct participants do not decide different values;
- validity — decided values are legitimate/proposed according to protocol;
- termination/liveness under stated timing/failure assumptions.

---

# 5. Replicated State Machines

## Motivation

If deterministic state machines execute the same ordered commands from the same initial state, they reach the same state.

## Contribution

Consensus can be used to agree on an ordered command log:

```text
client commands
      ↓
consensus protocol
      ↓
replicated ordered log
      ↓
deterministic state machine on each replica
```

This separates:

- ordering/agreement;
- application state transition logic.

It is one of the most important composition ideas in distributed systems.

---

# 6. Paxos

## Motivation

Reach consensus in an asynchronous message-passing system with crash failures.

## Conceptual roles

Classic explanations use proposers, acceptors, and learners. The protocol uses numbered proposals/ballots and quorum intersection to ensure later decisions preserve previously chosen values.

## Contribution

Paxos demonstrates how carefully chosen quorum and proposal-number invariants can guarantee safety despite message loss/reordering and participant failure.

The essential idea is not “send to majority.” It is that later proposals must discover and preserve values that may already have become chosen.

## Engineering reality

Basic single-decree Paxos is only one piece. Production replicated logs require repeated instances, leader optimizations, membership management, persistence, batching, snapshots, and recovery.

Reference: Leslie Lamport, “Paxos Made Simple,” 2001: https://www.microsoft.com/en-us/research/publication/paxos-made-simple/

---

# 7. Raft

## Motivation

Raft was designed with understandability as a major goal while providing consensus for replicated logs.

## Contribution

Raft decomposes consensus into:

- leader election;
- log replication;
- safety rules;
- membership/configuration mechanisms.

Servers occupy roles such as follower, candidate, and leader, and use increasing **terms** to separate election epochs.

## Leader election

If followers stop hearing from a leader, one may become a candidate, increment term, vote for itself, and request votes. A majority elects the leader.

Randomized election timeouts reduce repeated split votes.

## Log replication

Clients send commands to leader. Leader appends entries, sends them to followers, and commits entries after required replication conditions are satisfied.

## Safety intuition

Election restrictions and log matching rules prevent a leader without sufficiently up-to-date committed history from replacing committed entries.

## Operational concerns

- persistent term/vote/log state;
- snapshot installation;
- slow followers;
- leader lease/read semantics;
- membership changes;
- network partitions;
- disk fsync latency.

Reference: Ongaro and Ousterhout, “In Search of an Understandable Consensus Algorithm,” 2014: https://raft.github.io/raft.pdf

---

# 8. Leader Election

## Motivation

Many protocols simplify writes/coordination by choosing one authority for an epoch.

## Contribution

Leader election provides temporary ownership under a term/epoch identifier.

A robust design must prevent a stale former leader from continuing to act with authority after losing leadership.

### Fencing tokens

Monotonically increasing terms/tokens can be attached to operations so downstream resources reject stale leaders.

This is often stronger than relying only on leases/timeouts.

---

# 9. Logical Clocks and Ordering

## Motivation

Physical clocks are imperfect and events on different machines may not have a globally reliable timestamp order.

## Lamport clocks

Maintain a scalar logical clock. On local event increment. On receiving timestamp \(t\), set clock to at least \(t+1\).

Contribution: if event \(a\) causally precedes \(b\), Lamport timestamp of \(a\) is smaller than \(b\)'s. The converse does not establish causality.

## Vector clocks

Maintain one counter per participant to represent causal history more precisely.

They can detect some concurrent updates but grow with participant count.

## Combination ideas

Version vectors and related causal metadata support conflict detection in replicated stores.

---

# 10. Replication Logs and Write-Ahead Logging

## Motivation

State changes need durable, ordered recovery information.

## Contribution

Write-ahead logging records intent/change before applying it to mutable state. Recovery replays or rolls back according to protocol.

Consensus logs add replication and agreement around ordering.

## Combination pattern

```text
request
 ↓ validate
log durable intent
 ↓
apply state mutation
 ↓
acknowledge according to durability policy
```

A crash boundary between any two steps must have defined recovery behavior.

---

# 11. Sharding / Partitioning

## Motivation

One machine cannot hold or process all data/work.

Partition data across nodes:

```text
key space
  ↓ partition function
shard 1 | shard 2 | shard 3 | ...
```

## Contribution

Sharding increases horizontal capacity.

## Partition strategies

### Range partitioning

Keys in contiguous ranges.

Strength: range scans/locality.

Weakness: hotspots if traffic clusters in a range.

### Hash partitioning

Hash key to shard.

Strength: more uniform distribution.

Weakness: poor range locality; naive modulo hashing causes massive remapping when shard count changes.

### Directory-based

Metadata maps keys/ranges to shards. Flexible but introduces metadata coordination.

---

# 12. Consistent Hashing

## Motivation

With naive mapping

\[
shard=hash(key)\bmod N,
\]

changing \(N\) remaps a large portion of keys.

## Contribution

Consistent hashing maps nodes and keys onto a logical ring. A key is assigned to a nearby node on the ring. Adding/removing one node moves only a fraction of keys.

Virtual nodes improve balance and allow heterogeneous capacity.

## Applications

- distributed caches;
- partitioned databases;
- request routing.

## Failure modes

- skew without enough virtual nodes/load-aware placement;
- hotspots from popular keys even with balanced key counts;
- topology changes causing migration storms.

---

# 13. Rebalancing

## Motivation

Shard membership and load change over time.

## Contribution

Rebalancing moves ownership while the system remains available.

Important concerns:

- copy-before-cutover;
- dual reads/writes during migration;
- version/fencing;
- rate-limit migration so foreground traffic survives;
- resumability after failure.

This is state-machine orchestration plus data movement.

---

# 14. Retries

## Motivation

Transient failures are common. Retrying may turn a temporary timeout into success.

## Contribution

Retries improve reliability when failures are temporary.

But naive retries can amplify overload.

### Exponential backoff

Delay grows approximately exponentially after failures:

\[
d_k=\min(d_{max}, d_0 2^k).
\]

### Jitter

Add randomness so many clients do not retry simultaneously.

```python
import random

def retry_delay(base, attempt, cap):
    max_delay = min(cap, base * (2 ** attempt))
    return random.uniform(0, max_delay)
```

Randomized backoff has deep roots in contention protocols; binary exponential backoff is central to classic Ethernet behavior.

## Retry budget

Bound total attempts/time. A service already overloaded should not receive unlimited duplicated work.

---

# 15. Timeouts

## Motivation

Without timeouts, failed dependencies can hold resources forever.

## Contribution

A timeout turns uncertain waiting into a local decision point.

But a timeout means:

> “I stopped waiting,” not necessarily “the remote operation did not happen.”

This ambiguity makes idempotency essential for retried side-effecting operations.

## Timeout design

Consider:

- latency distribution rather than average;
- nested deadline propagation;
- connection vs request timeout;
- maximum end-to-end user deadline;
- cancellation propagation.

---

# 16. Idempotency

## Motivation

At-least-once delivery/retries may execute the same logical request more than once.

An idempotent operation satisfies conceptually

\[
f(f(x))=f(x).
\]

For API side effects, an idempotency key lets server recognize duplicate logical operations.

## Implementation pattern

```text
request(idempotency_key, payload)
        ↓
lookup key
  ├─ completed → return stored result
  ├─ running   → join/reject according to protocol
  └─ absent    → atomically reserve and execute
```

## Failure modes

- key stored after side effect rather than atomically with it;
- key expires too soon;
- same key reused with different payload;
- duplicate requests race before reservation.

---

# 17. Deduplication

## Motivation

Streams/messages may arrive more than once.

## Approaches

- exact set of processed IDs;
- TTL-based dedup table;
- sequence numbers;
- Bloom filter when occasional false positives are acceptable;
- transactional inbox/outbox patterns.

## Trade-off

Long deduplication windows cost memory/storage. Short windows permit late duplicates.

---

# 18. Circuit Breakers

## Motivation

Repeatedly calling a clearly failing dependency wastes resources and worsens cascading failure.

## Contribution

State machine:

```text
CLOSED --failures--> OPEN
OPEN --cooldown--> HALF_OPEN
HALF_OPEN --success--> CLOSED
HALF_OPEN --failure--> OPEN
```

Circuit breakers combine state machines, rolling statistics, and retry control.

---

# 19. Bulkheads and Isolation

## Motivation

One failing dependency or workload should not consume every shared resource.

## Contribution

Partition thread pools, queues, connection pools, or quotas so failure remains contained.

This is resource sharding for reliability rather than data scaling.

---

# 20. Gossip / Epidemic Dissemination

## Motivation

Broadcasting updates from a central coordinator to every node can become expensive or fragile.

## Contribution

Nodes periodically exchange information with a few peers. Updates spread probabilistically through the cluster.

Useful for:

- membership;
- failure detection;
- eventual metadata dissemination;
- aggregate state.

Trade-off: convergence is eventual and probabilistic rather than immediate global synchronization.

---

# 21. Voting and Aggregation

## Motivation

Several replicas/models/agents may produce candidate answers or observations.

Aggregation methods include:

- majority vote;
- weighted vote;
- median/trimmed mean;
- confidence-weighted ensemble;
- quorum acknowledgment.

## Contribution

Aggregation can reduce independent error, but correlated failures limit benefit.

Never assume “more voters” automatically means reliability if all voters share the same model, dependency, or data source.

---

# 22. Distributed Transactions

## Motivation

An operation may need atomic effects across multiple resources.

## Two-phase commit (2PC) idea

1. coordinator asks participants to prepare;
2. after all prepare, coordinator decides commit; otherwise abort.

## Contribution

Coordinates atomic commitment, but blocking/failure recovery and coordinator durability make implementation complex.

## Alternative: Sagas

For long-lived workflows, sequence local transactions with compensating actions rather than one global atomic transaction.

```text
reserve inventory
 ↓
charge payment
 ↓
create shipment
```

If later step fails, execute defined compensations where possible.

This is especially relevant to agent/tool orchestration.

---

# 23. Exactly Once: A Systems View

“Exactly once” is rarely a property of message transport alone. End-to-end effect semantics usually require a combination of:

- unique operation IDs;
- idempotent writes;
- deduplication;
- transactional state/message updates;
- replay-safe processing;
- durable progress tracking.

A better question is:

> Which externally visible effect must occur exactly once, and which protocol ensures that across retries and crashes?

---

# 24. Distributed Storage Example: GFS

The Google File System work demonstrates how system design changes when hardware failures are expected rather than exceptional. It uses replication and a design tailored to large data-intensive workloads.

Reference: Ghemawat, Gobioff, Leung, “The Google File System,” 2003: https://research.google/pubs/the-google-file-system/

The foundational lesson is broader than the specific filesystem:

> model expected failures and actual workload patterns explicitly instead of inheriting assumptions from smaller systems.

---

# 25. Combination Architecture for Reliable Adaptive Agents

A reliable distributed AI/automation system can compose these ideas:

```text
incoming task
   ↓
idempotency reservation
   ↓
replicated task/event log
   ↓
scheduler / policy selects worker or tool
   ↓
worker execution with deadline
   ↓
retry with jitter if retryable
   ↓
state transition recorded
   ↓
streaming metrics / reward attribution
```

If coordination state itself must survive failures:

```text
Raft/Paxos replicated log
      ↓
deterministic orchestration state machine
```

Learning algorithms should not be responsible for core safety invariants such as duplicate prevention or committed-state consistency.

---

# 26. Distributed Bandit / Learning Considerations

When online learning is distributed, new issues appear:

- duplicate reward updates due to retries;
- stale model copies;
- asynchronous sufficient-statistic updates;
- inconsistent action probabilities across versions;
- delayed feedback arriving after model changes.

A robust event should include:

- decision ID;
- policy/model version;
- context/features or immutable feature reference;
- available actions;
- chosen action;
- propensity if relevant;
- reward event ID;
- timestamp(s).

Updates should be deduplicated by decision/reward identity.

---

# 27. Testing Distributed Algorithms

Unit tests are insufficient. Test schedules and failure modes.

Inject:

- dropped messages;
- duplicated messages;
- reordering;
- long pauses;
- process crash before/after durable write;
- leader failover;
- network partitions;
- clock skew;
- disk-full/fsync errors;
- retry storms.

Verify invariants, not only happy-path outputs.

Useful techniques:

- deterministic simulation;
- property-based tests;
- model checking for protocol state machines;
- fault injection/chaos testing;
- Jepsen-style history analysis for data consistency.

---

# 28. Implementation Checklist

Document:

- failure model;
- consistency model;
- replication factor;
- quorum rules;
- leader election terms/fencing;
- durable state boundaries;
- retryable vs non-retryable errors;
- timeout/deadline policy;
- idempotency key semantics;
- dedup window;
- partition mapping;
- rebalancing protocol;
- overload policy;
- recovery/replay procedure;
- audit/observability fields.

Track:

- replication lag;
- leader changes;
- consensus commit latency;
- retry count;
- timeout count;
- duplicate suppression;
- queue depth;
- shard skew;
- failed rebalances;
- stale reads/conflicts where applicable.

---

# 29. References

- Lamport, “Paxos Made Simple”: https://www.microsoft.com/en-us/research/publication/paxos-made-simple/
- Ongaro and Ousterhout, “In Search of an Understandable Consensus Algorithm”: https://raft.github.io/raft.pdf
- Raft resources: https://raft.github.io/
- DeCandia et al., “Dynamo: Amazon's Highly Available Key-value Store”: https://www.amazon.science/publications/dynamo-amazons-highly-available-key-value-store
- Ghemawat, Gobioff, Leung, “The Google File System”: https://research.google/pubs/the-google-file-system/
- Goodman et al., “Stability of binary exponential backoff”: https://doi.org/10.1145/44483.44488
