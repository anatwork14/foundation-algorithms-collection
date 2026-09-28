# 34 — Defensive Security Analysis: Static Analysis, Symbolic Execution, Fuzzing, Detection, and Verification

Cybersecurity is not only cryptography. Defensive systems must discover bugs, unsafe states, malicious behavior, and policy violations in enormous program and network state spaces. This chapter studies the algorithms used to analyze software and telemetry before failures become incidents.

The focus is defensive research: finding, reproducing, prioritizing, and eliminating weaknesses in systems you are authorized to test.

## 1. Program analysis as state-space reasoning

A program implicitly defines a transition system:

\[
s_{t+1}=T(s_t,input_t).
\]

Security analysis asks questions such as:

- can untrusted input reach a sensitive operation?
- can a memory access violate bounds?
- can privilege state be bypassed?
- can an invariant be violated?
- is there an input that reaches a failing assertion?

Exact analysis is often undecidable or computationally prohibitive, so tools approximate.

## 2. Control-Flow Graphs

A CFG represents basic blocks as nodes and possible control transfers as edges.

Algorithms applied:

- DFS/BFS;
- dominators;
- strongly connected components;
- path enumeration;
- loop detection;
- reachability.

CFGs are the substrate for many static analyses.

## 3. Dominators

Node \(d\) dominates node \(n\) if every path from entry to \(n\) passes through \(d\).

Dominator trees support:

- compiler optimization;
- control-dependence analysis;
- security checks;
- SSA construction.

## 4. Data-Flow Analysis

Associate facts with program points and solve equations to a fixed point.

Generic form:

\[
OUT_b = F_b(IN_b),
\]

\[
IN_b = \bigvee_{p\in pred(b)}OUT_p.
\]

Examples:

- reaching definitions;
- live variables;
- available expressions;
- definite assignment;
- constant propagation.

Security analyses reuse this framework for taint and initialization reasoning.

## 5. Fixed-Point Iteration

Repeatedly apply transfer functions until facts stop changing.

A worklist algorithm processes only nodes whose incoming facts changed.

### Contribution

Turns global program reasoning into local monotone updates over a lattice of abstract facts.

## 6. Abstract Interpretation

Map concrete program states into an abstract domain that is cheaper to analyze.

Examples of abstract values:

- sign: negative/zero/positive;
- intervals: \([l,u]\);
- null/non-null;
- tainted/untainted;
- symbolic shape/type;
- pointer regions.

### Contribution

Provides a mathematical framework for sound over-approximation.

### Trade-off

More precise domains cost more time/memory.

## 7. Widening and Narrowing

Loops may create ascending abstract-state chains. Widening accelerates convergence by jumping to a broader approximation; narrowing can later recover precision.

This is a foundational example of intentionally losing information to guarantee termination.

## 8. Taint Analysis

Track whether data influenced by an untrusted source reaches a sensitive sink without appropriate sanitization.

```text
source -> propagation -> sanitizer? -> sink
```

Sources:

- network input;
- files;
- user parameters;
- environment variables.

Sinks:

- query construction;
- command execution;
- file paths;
- authorization decisions;
- serialization/deserialization boundaries.

### Challenges

- aliases;
- implicit flows;
- sanitization context;
- dynamic dispatch;
- interprocedural propagation.

## 9. Points-To and Alias Analysis

Determine which objects/pointers a reference may point to.

Trade-offs:

- flow-sensitive vs insensitive;
- context-sensitive vs insensitive;
- field-sensitive vs insensitive.

Precise alias information improves vulnerability analysis but can be expensive.

## 10. Interprocedural Analysis

Reason across function boundaries using:

- call graphs;
- summaries;
- context-sensitive call strings;
- pushdown models;
- function contracts.

Library summaries are often essential for scaling.

## 11. Symbolic Execution

Execute program with symbolic inputs rather than concrete values.

Example:

```text
x = symbolic
if x > 10:
    if x*x == 144:
        failure()
```

The executor accumulates path constraint:

\[
x>10 \land x^2=144.
\]

An SMT solver finds a satisfying concrete input if one exists.

## 12. Symbolic State

Track:

- symbolic registers/variables;
- symbolic memory;
- path condition;
- program counter;
- environment model.

Each branch can fork the execution state.

## 13. Path Explosion

With \(n\) independent branches, paths can grow exponentially.

Mitigations:

- search heuristics;
- path merging;
- state subsumption;
- compositional summaries;
- bounded exploration;
- concolic execution;
- targeted symbolic execution.

## 14. SMT Solving

Satisfiability Modulo Theories extends SAT with domains such as:

- bit vectors;
- arrays;
- integers/reals;
- floating point;
- uninterpreted functions.

Security tools use SMT to solve constraints derived from real program semantics.

## 15. DPLL(T)

Many SMT solvers combine a Boolean SAT engine with theory-specific solvers.

This is a key cross-field architecture:

```text
Boolean search
 + domain-specific consistency checks
 -> SMT reasoning
```

## 16. Concolic Execution

Run concrete execution while tracking symbolic constraints simultaneously.

To explore another path, negate a branch condition and ask the solver for a new concrete input.

### Contribution

Combines realism of concrete execution with systematic symbolic exploration.

## 17. Fuzzing

Fuzzing repeatedly generates/mutates inputs and observes program behavior.

Basic loop:

```text
seed corpus
 -> choose seed
 -> mutate/generate
 -> execute target
 -> collect feedback
 -> keep interesting inputs
 -> repeat
```

## 18. Coverage-Guided Fuzzing

Use code coverage as a feedback signal. Inputs that reach new edges/blocks are retained and mutated further.

### Contribution

Transforms random testing into evolutionary search over program behavior.

## 19. Mutation Operators

Safe research abstractions include:

- bit/byte changes;
- insertion/deletion;
- token replacement;
- dictionary substitution;
- integer boundary changes;
- block splicing.

The algorithmic question is which mutation distribution most efficiently explores new behavior.

## 20. Seed Scheduling

A fuzzer has a corpus of candidates and limited execution budget. Scheduling policies assign energy/iterations to seeds.

Criteria:

- coverage rarity;
- execution speed;
- path depth;
- age;
- recent discoveries;
- distance to target code.

This is naturally a bandit/scheduling problem.

## 21. Contextual Bandit Fuzzing

Context features can include:

- seed coverage signature;
- file size;
- branch rarity;
- mutation history;
- target-module distance.

Actions:

- choose seed;
- choose mutation operator;
- choose energy budget.

Reward:

- new coverage;
- unique crash;
- sanitizer finding;
- target-state reachability.

LinUCB or Thompson-sampling variants can adapt mutation policy online while preserving exploration.

## 22. Grammar-Based Fuzzing

Generate inputs from a formal grammar rather than arbitrary bytes.

Useful for:

- parsers;
- compilers;
- structured file formats;
- protocol messages.

### Trade-off

Validity increases but malformed-edge exploration may decrease unless mutation deliberately violates grammar constraints.

## 23. Structure-Aware Fuzzing

Parse seeds into AST/message structures and mutate semantic components.

Combines:

- parsing;
- domain models;
- generative search;
- coverage feedback.

## 24. Differential Fuzzing

Run same input through multiple implementations and flag disagreements.

Applications:

- compilers;
- cryptographic libraries;
- parsers;
- protocol stacks.

It uses another implementation as a partial oracle when exact expected output is hard to specify.

## 25. Property-Based Testing

Generate many inputs from structured generators and verify invariants:

\[
P(input, output)=true.
\]

When a failure occurs, **shrinking** searches for a smaller counterexample.

This is highly useful for cryptographic and parser implementations.

## 26. Sanitizers

Runtime instrumentation detects classes of violations:

- memory safety;
- undefined behavior;
- thread races;
- integer errors depending on tooling.

Fuzzing + sanitizers provides much stronger feedback than crashes alone.

## 27. Directed Fuzzing

Bias exploration toward target locations or states, using a distance metric over CFG/call graph.

Algorithms:

- shortest-path distance;
- simulated annealing schedules;
- learned target-distance estimates.

## 28. Hybrid Fuzzing

Combine fast coverage fuzzing with selective symbolic/concolic solving for branches the fuzzer struggles to cross.

```text
fuzzer finds hard branch
 -> symbolic engine solves constraint
 -> new seed
 -> fuzzer continues high-throughput exploration
```

This is one of the strongest examples of algorithm combination in security.

## 29. Model Checking

Explore system-state transitions to verify temporal/logical properties.

Challenges:

- state explosion;
- concurrency interleavings;
- infinite-state systems.

Techniques:

- symbolic model checking;
- BDDs;
- SAT-based bounded model checking;
- partial-order reduction;
- abstraction.

## 30. Bounded Model Checking

Encode existence of a counterexample of length \(k\) into SAT/SMT.

If satisfiable, solver returns a violating trace.

This connects formal verification and constraint solving directly.

## 31. Counterexample-Guided Abstraction Refinement

CEGAR loop:

1. build coarse abstraction;
2. model-check property;
3. if counterexample appears, test whether real;
4. if spurious, refine abstraction;
5. repeat.

### Foundation

Approximate aggressively, then add precision only where evidence demands it.

## 32. Runtime Monitoring

Some security properties are enforced/detected at runtime through:

- state machines;
- invariants;
- sequence models;
- policy automata;
- anomaly detectors.

Runtime verification complements static analysis for dynamic/environment-dependent behavior.

## 33. Intrusion Detection as Statistical Decision

Given telemetry \(x_t\), estimate:

\[
P(attack|x_{1:t})
\]

or anomaly score.

Methods:

- signatures/rules;
- statistical thresholds;
- sequence models;
- clustering;
- one-class classification;
- change-point detection;
- graph anomaly detection.

False positives and base rates are central operational problems.

## 34. Change-Point Detection for Security

Algorithms such as CUSUM or adaptive windows can detect changes in:

- request rates;
- authentication failure distributions;
- network-flow features;
- process behavior;
- model/API usage.

Detection should trigger a response policy rather than being treated as an isolated score.

## 35. Graph-Based Security Analytics

Represent:

- identities;
- machines;
- processes;
- network connections;
- permissions;
- transactions;

as a graph.

Algorithms:

- reachability;
- shortest attack paths;
- connected components;
- centrality;
- community detection;
- GNN anomaly detection.

## 36. Attack-Graph Analysis

An attack graph represents prerequisites and possible transitions among compromised states.

Defensive use:

- identify critical choke points;
- prioritize patching;
- simulate blast radius;
- reason about privilege chains.

Large attack graphs can use probabilistic risk weighting and graph search.

## 37. Vulnerability Prioritization

Raw severity is insufficient. A prioritization algorithm can combine:

- exploitability evidence;
- asset importance;
- exposure;
- dependency reachability;
- compensating controls;
- observed exploitation;
- remediation cost.

This is a multi-objective ranking/decision problem.

## 38. Formal Specifications

Security becomes easier to verify when invariants are explicit:

- authorization rules;
- state transitions;
- memory safety;
- protocol sequencing;
- key lifecycle constraints.

A vague policy cannot be formally checked.

## 39. AI-Assisted Defensive Analysis

Learned models can help:

- prioritize paths/seeds;
- generate structured test inputs;
- summarize findings;
- infer likely vulnerable modules;
- propose invariants;
- rank static-analysis warnings.

But exact analyzers/solvers should validate high-impact claims where possible.

## 40. Combination research map

```text
Coverage fuzzer + LinUCB
  -> adaptive mutation/seed scheduling

Fuzzer + symbolic execution
  -> throughput + hard-constraint solving

Static taint + dynamic traces
  -> hybrid source-to-sink validation

GNN + attack graph
  -> learned risk prioritization

Change-point detection + runtime policy
  -> adaptive incident response trigger

LLM + SMT/model checker
  -> flexible hypothesis generation + exact verification

CEGAR + learned abstraction selection
  -> adaptive formal verification
```

## 41. Evaluation

For analyzers report:

- true/false positive rates;
- code coverage/state coverage;
- unique defects discovered;
- time-to-first finding;
- solver timeouts;
- path/memory scalability;
- reproducibility;
- bug-class coverage;
- human triage cost.

A tool that produces thousands of unactionable warnings may be less useful than a narrower high-precision analyzer.

## 42. Primary references

- Cousot & Cousot, abstract interpretation.
- KLEE / symbolic execution literature.
- DART/CUTE and concolic-testing literature.
- AFL and coverage-guided fuzzing research.
- Angora, AFLFast, libFuzzer and subsequent fuzzing literature.
- Cadar & Sen, symbolic execution surveys.
- Clarke, Grumberg & Peled, *Model Checking*.
- Biere et al., bounded model checking.

## 43. Research questions

- Can contextual bandits learn mutation policies that transfer across programs?
- Can learned path heuristics accelerate symbolic execution without hiding rare critical paths?
- Can formal and fuzzing evidence be combined into calibrated vulnerability confidence?
- How should attack graphs update continuously from live topology and identity telemetry?
- Can AI-generated security hypotheses be automatically reduced to solver-checkable claims?
- What is the optimal allocation of analysis budget among static analysis, fuzzing, symbolic execution, and human review?