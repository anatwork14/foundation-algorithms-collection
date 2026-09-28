# Foundation Algorithms Collection

A research-oriented reference for the foundational algorithmic ideas that recur across modern software systems, artificial intelligence, optimization, data systems, distributed computing, control, quantum computing, cryptography, cybersecurity, and adaptive decision-making.

The goal of this repository is **not** to collect disconnected algorithm names. It is to expose the reusable ideas underneath them so they can be studied, implemented, compared, and combined into new systems.

## Why this collection exists

Modern systems often look novel at the surface but are composed from a relatively small set of recurring mechanisms:

- represent a problem as states, vectors, graphs, constraints, distributions, operators, or objectives;
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
- balance exploration against exploitation;
- encode and correct errors;
- prove or verify properties;
- protect information under adversarial conditions;
- transform amplitudes, phases, spectra, or probability distributions.

The documents connect classical algorithms to AI agents, recommender systems, vector search, distributed orchestration, adaptive routing, autonomous systems, quantum computation, post-quantum cryptography, formal security analysis, privacy-preserving computation, and engineering-intelligence platforms.

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

### General algorithmic foundations

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
| [09 — Combination research map](docs/09-combination-research-map.md) | How to combine the general families into adaptive architectures; research questions, experimental design, and hybrid recipes |

### AI / Machine Learning

| File | Main subjects |
|---|---|
| [10 — AI optimization and learning theory](docs/10-ai-optimization-learning-theory.md) | SGD, momentum, Adam/AdamW, natural gradient, proximal methods, regularization, PAC/capacity, Bayesian learning, calibration, conformal prediction, active/meta/continual/federated learning, distillation, PEFT, quantization |
| [11 — Neural architectures](docs/11-neural-architectures-attention-ssm-moe-gnn.md) | MLPs, CNNs, RNN/LSTM, attention, Transformers, positional methods, KV caching, sparse/linear attention, FlashAttention principles, state-space models, selective SSMs, MoE, GCN/GAT/GraphSAGE, graph Transformers |
| [12 — Generative models](docs/12-generative-models-diffusion-flow-autoregressive.md) | Autoregressive modeling/decoding, VAEs, GANs, energy models, score matching, diffusion, SDEs, normalizing flows, flow matching, rectified flows, optimal transport |
| [13 — Reasoning, alignment, agents](docs/13-ai-reasoning-alignment-agents.md) | Best-of-N, self-consistency, tree search, MCTS, verifiers, preference learning, RLHF/PPO, DPO, tool use, planner-executor systems, memory, world models, multi-agent algorithms, neuro-symbolic reasoning, program synthesis |
| [14 — Uncertainty, causality, adaptation](docs/14-uncertainty-causal-active-continual-meta-learning.md) | Bayesian decisions, ensembles, conformal/OOD, distribution shift, causal inference/discovery, propensity/doubly robust methods, active learning, experimental design, continual/meta/online learning, drift detection, robust/adversarial learning |

### Quantum Computing

| File | Main subjects |
|---|---|
| [20 — Quantum computation foundations](docs/20-quantum-computation-foundations.md) | Qubits, unitary evolution, gates, entanglement, measurement, density matrices, channels, oracles, phase kickback, stabilizers, logical/native resource models |
| [21 — Search, Fourier, phase estimation](docs/21-quantum-search-fourier-phase-estimation.md) | Deutsch-Jozsa, Bernstein-Vazirani, Simon, Grover, amplitude amplification/estimation, QFT, QPE, period finding, Shor, hidden subgroup problems, quantum walks |
| [22 — Simulation, QSP/QSVT, linear algebra](docs/22-quantum-simulation-qsp-qsvt-linear-algebra.md) | Hamiltonian simulation, Trotter, LCU, block encoding, QSP, QSVT, qubitization, HHL/linear systems, spectral transforms, polynomial approximation |
| [23 — Quantum optimization and variational methods](docs/23-quantum-optimization-vqe-qaoa.md) | Parameterized circuits, VQE, ansatz design, barren plateaus, parameter-shift gradients, quantum natural gradient, QAOA, QUBO, annealing, adaptive shot allocation, quantum kernels |
| [24 — Quantum error correction and decoding](docs/24-quantum-error-correction-decoding.md) | Stabilizer/CSS/surface/color/LDPC/bosonic codes, MWPM, union-find, BP/OSD, tensor/RG/neural decoders, thresholds, logical error scaling, dynamic QEC |
| [25 — Fault tolerance, mitigation, compilation](docs/25-fault-tolerance-error-mitigation-compilation.md) | Magic states, lattice surgery, logical resource estimation, circuit synthesis, routing/scheduling, noise-aware compilation, pulse control, randomized compiling, ZNE/PEC/symmetry verification, ZX calculus |

### Cybersecurity / Cryptography

| File | Main subjects |
|---|---|
| [30 — Cryptographic foundations](docs/30-cryptographic-foundations.md) | Hashes, MACs, PRFs/PRPs, AES, ChaCha20, AEAD, KDF/password hashing, RSA/DH/ECC, signatures, KEM-DEM, forward secrecy, Merkle trees, commitments, secret sharing, randomness, constant-time design |
| [31 — Post-quantum cryptography](docs/31-post-quantum-cryptography.md) | LWE/Module-LWE/SIS, NTT, ML-KEM, ML-DSA, Falcon/FN-DSA, hash signatures/SLH-DSA, code-based cryptography/HQC, LLL/BKZ, side channels, hybrid migration, crypto agility |
| [32 — Zero knowledge and verifiable computation](docs/32-zero-knowledge-verifiable-computation.md) | Sigma protocols, Fiat-Shamir, commitments, R1CS, polynomial commitments, Groth16, PLONK, lookups, STARK/FRI/AIR, sumcheck/GKR, recursion/folding/IVC, zkVMs, verifiable ML |
| [33 — MPC, homomorphic encryption, differential privacy](docs/33-mpc-homomorphic-encryption-differential-privacy.md) | Secret-sharing MPC, Yao/GMW/SPDZ, OT, Beaver triples, PSI, BGV/BFV/CKKS/TFHE, bootstrapping, FHE compilers, DP mechanisms/accounting, DP-SGD, secure aggregation |
| [34 — Defensive security analysis](docs/34-security-analysis-symbolic-execution-fuzzing.md) | CFG/data-flow/abstract interpretation/taint/alias analysis, symbolic/concolic execution, SMT, fuzzing, coverage/grammar/differential fuzzing, CEGAR/model checking, security telemetry, attack graphs |
| [35 — Cryptanalysis and side channels](docs/35-cryptanalysis-side-channels-adversarial-methods.md) | Brute force, birthday/MITM, differential/linear/algebraic cryptanalysis, SAT/lattice attacks, timing/cache/power/fault analysis, masking/hiding, protocol oracles, adversarial ML, defensive evaluation |

### Cross-field research

| File | Main subjects |
|---|---|
| [40 — AI × Quantum × Cybersecurity combination map](docs/40-ai-quantum-cybersecurity-combination-map.md) | LinUCB fuzzing, neural QEC decoders, adaptive quantum compilation, PQ migration graphs, verifiable/private AI, proof-carrying agents, hybrid research methodology |
| [41 — Emerging algorithms research watchlist](docs/41-emerging-algorithms-research-watchlist.md) | Maturity labels, promotion/retirement criteria, emerging AI mechanisms, QEC/QLDPC/QSVT, PQC standardization, zkVM/folding/FHE compilers, cross-field meta-patterns |

## A compact taxonomy

A useful first classification is by the **kind of uncertainty or computational obstacle** the algorithm must handle.

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
| Learned confidence may be unreliable | calibration, conformal prediction, ensembles |
| Correlation is insufficient for intervention decisions | causal inference and experimental design |
| Long sequence communication is expensive | sparse attention, state-space models, recurrence |
| Quantum phase/eigenvalue structure contains the answer | QFT/QPE/QSP/QSVT |
| Physical quantum noise prevents long computations | QEC, decoding, fault tolerance |
| Adversary can observe/modify protocol interactions | cryptography, formal protocol analysis |
| Public-key crypto must survive quantum attacks | PQC: lattice/code/hash-based constructions |
| Data must stay private during computation | MPC, FHE, secure aggregation |
| Aggregate outputs must protect individuals | differential privacy |
| Computation must be verified cheaply | SNARK/STARK/IVC/verifiable computation |
| Software behavior must be explored for failures | fuzzing, symbolic execution, static analysis |

Another useful classification is by **what the algorithm stores**:

- a frontier of candidate states — search;
- a table of solved subproblems — dynamic programming;
- sufficient statistics — streaming/statistical algorithms;
- parameters and gradients — optimization/learning;
- confidence intervals or posterior distributions — bandits/Bayesian methods;
- replicated logs/state — consensus systems;
- an index structure — retrieval systems;
- a policy/value function — reinforcement learning;
- cached results — performance systems;
- hidden/recurrent state — RNN/SSM/control systems;
- amplitudes/phases — quantum computation;
- syndrome history — error-correction decoding;
- secret shares/ciphertexts — privacy-preserving computation;
- commitments/proof transcripts — verifiable computation;
- abstract/symbolic states — program analysis.

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
13. Is there an adversary, and what can it observe/control?
14. Which claims require verification rather than prediction?
15. What access assumptions are hidden in an asymptotic result?
16. What is the cost of loading data, measuring outputs, proving correctness, or preserving privacy?
17. Can an older exact algorithm serve as verifier for a newer learned proposal mechanism?

These questions usually narrow a large modern problem to a small number of foundational families.

## Special emphasis: adaptive systems and LinUCB

Contextual bandits deserve special attention because they sit between prediction and full reinforcement learning. **LinUCB** is particularly useful when:

- a decision must be made repeatedly;
- context is available before each decision;
- only the reward of the selected action is observed;
- rewards are reasonably modeled as linear in features, at least locally;
- exploration has real value because uncertainty about actions matters.

The dedicated bandit chapter derives LinUCB from regularized linear regression, explains its confidence ellipsoid, shows practical update formulas, discusses disjoint vs. shared/hybrid parameterizations, and connects it to Thompson sampling and neural contextual bandits.

The expanded collection repeatedly reuses this idea for modern research problems:

- adaptive tool/model routing;
- fuzzing mutation selection;
- quantum decoder selection;
- adaptive measurement allocation;
- compiler strategy selection;
- privacy-budget allocation;
- scientific experiment scheduling.

## Cross-field thesis

Many future systems will not be defined by one algorithm. They will look like:

```text
observe
 -> represent
 -> estimate uncertainty
 -> select algorithm/action
 -> execute
 -> verify
 -> record provenance
 -> learn
 -> adapt
```

Examples:

- learned proposal + SAT/SMT verifier;
- GNN + surface-code decoder;
- contextual bandit + fuzzing engine;
- Bayesian optimizer + quantum hardware calibration;
- federated learning + secure aggregation + differential privacy;
- FHE/MPC + ZK proof + AI inference;
- PQC inventory graph + constraint-based migration scheduler;
- adaptive agent + cryptographic identity + formal policy checks.

This is why the repository treats **combination interfaces** as a first-class research topic.

## Foundation vs emerging mechanism

The collection intentionally separates durable ideas from methods that may still evolve.

Use [41 — Emerging algorithms research watchlist](docs/41-emerging-algorithms-research-watchlist.md) to track whether a method is:

- **FOUNDATION** — long-lived, broadly reusable idea;
- **ESTABLISHED MODERN** — stable and widely validated modern mechanism;
- **EMERGING** — strong active research/adoption, design still moving;
- **EXPERIMENTAL** — promising but limited evidence or narrow conditions;
- **SPECULATIVE** — research hypothesis rather than established solution.

Never promote an algorithm because it is fashionable. Promote it when its underlying computational idea becomes reusable and survives strong baselines.

## Scope and non-goals

This repository is a **foundation and research map**, not a substitute for original papers, textbooks, proof-heavy courses, standards, security reviews, or domain-specific benchmarking. Complexity bounds and theoretical guarantees depend on assumptions; always follow primary references before relying on a guarantee in a new setting.

The implementation examples are intentionally structural. Production implementations should additionally handle numerical stability, concurrency, persistence, monitoring, distribution shift, privacy, security, side channels, fault tolerance, standards compliance, and failure recovery.

Cybersecurity material is intended for defensive research, authorized testing, cryptographic understanding, verification, and system hardening.

## Core references used throughout

### General algorithms / optimization / learning

- Cormen, Leiserson, Rivest, Stein — *Introduction to Algorithms*, 4th ed., MIT Press: https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
- MIT OpenCourseWare — *Introduction to Algorithms*: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- Boyd and Vandenberghe — *Convex Optimization*: https://web.stanford.edu/~boyd/cvxbook/
- Nocedal and Wright — *Numerical Optimization*: https://doi.org/10.1007/978-0-387-40065-5
- Sutton and Barto — *Reinforcement Learning: An Introduction*: http://incompleteideas.net/book/the-book-2nd.html
- Lattimore and Szepesvári — *Bandit Algorithms*: https://tor-lattimore.com/downloads/book/book.pdf
- Pearl — *Causality*.

### Quantum computing

- Nielsen and Chuang — *Quantum Computation and Quantum Information*.
- Preskill — quantum computation lecture notes.
- Gilyén, Su, Low and Wiebe — Quantum Singular Value Transformation.
- Google Quantum AI — below-threshold surface-code and dynamic-QEC research.

### Cryptography / cybersecurity

- Katz and Lindell — *Introduction to Modern Cryptography*.
- Boneh and Shoup — *A Graduate Course in Applied Cryptography*.
- NIST FIPS 203 — ML-KEM.
- NIST FIPS 204 — ML-DSA.
- NIST FIPS 205 — SLH-DSA.
- NIST Post-Quantum Cryptography project: https://csrc.nist.gov/projects/post-quantum-cryptography
- Thaler — *Proofs, Arguments, and Zero-Knowledge*.
- Clarke, Grumberg and Peled — *Model Checking*.

## Status

This repository is designed as a living collection. A useful extension pattern is to add, for each family:

- proofs or proof sketches;
- executable notebooks;
- benchmark suites;
- reference implementations in multiple languages;
- failure-case datasets;
- comparison matrices;
- hybrid experiments combining two or more families;
- machine-readable algorithm metadata;
- maturity/status tracking;
- reproducible resource estimates;
- formal specifications where appropriate.

The next natural repository-level step is to convert the chapter metadata into a searchable algorithm knowledge graph so future research tools can query relationships such as:

> Which algorithms provide uncertainty estimates, support online updates, can enforce hard constraints, and have a verifiable execution path?
