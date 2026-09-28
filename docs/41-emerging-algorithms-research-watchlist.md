# 41 — Emerging Algorithms Research Watchlist

This document tracks algorithmic families that are important enough to monitor but whose long-term role is still developing. The purpose is to prevent the repository from confusing **established foundations** with **promising current mechanisms**.

The watchlist should be updated periodically as methods mature, fail, merge with older frameworks, or become standard infrastructure.

## 1. Maturity labels

Use five labels.

### FOUNDATION

Long-lived idea with broad reuse across decades and domains.

Examples: dynamic programming, Bayesian inference, gradient descent, error-correcting codes, SAT, hashing.

### ESTABLISHED MODERN

Widely deployed/reproduced algorithm whose modern form is stable enough to teach as a standard tool.

Examples: Transformers, AdamW, HNSW, conformal prediction, ML-KEM.

### EMERGING

Strong recent evidence and active adoption, but design space remains unsettled.

Examples: selective state-space models, flow matching, quantum LDPC engineering, recursive folding schemes.

### EXPERIMENTAL

Promising research direction with limited evidence or narrow conditions.

### SPECULATIVE

Interesting hypothesis that should be framed as a research question, not a known solution.

## 2. Promotion criteria

Move an algorithm toward FOUNDATION/ESTABLISHED when it demonstrates several of:

- independent replication;
- multiple domains of use;
- robust theory or empirical regularity;
- stable implementation ecosystem;
- clear failure conditions;
- survival against stronger baselines;
- production deployment;
- durable abstraction beyond one architecture/product.

## 3. Retirement criteria

Demote/archive when:

- security assumption is broken;
- claimed advantage disappears under strong baselines;
- later work subsumes the method cleanly;
- method depends on unrealistic access assumptions;
- results fail independent replication;
- deployment cost dominates contribution.

# AI / ML Watchlist

## 4. Selective State-Space Models — EMERGING / ESTABLISHED MODERN BOUNDARY

### Why watch

They offer recurrent linear-time sequence processing with input-dependent selective state updates, providing an alternative/complement to dense attention.

### Foundation underneath

- state-space models;
- control theory;
- recurrent networks;
- gating;
- efficient scans.

### Questions

- where do they outperform attention at equal total compute?
- how stable is ultra-long-context memory?
- what hybrid attention/SSM ratios emerge?
- can they serve persistent streaming-agent state?

## 5. Efficient Attention Kernels — ESTABLISHED MODERN

Includes IO-aware exact attention, sparse attention, grouped/multi-query key-value strategies, and kernelized alternatives.

### Watch

The long-term foundation may be **memory-hierarchy-aware communication algorithms**, not one attention kernel.

## 6. Mixture-of-Experts Routing — ESTABLISHED MODERN / EMERGING CONTROL

Sparse expert activation is established; adaptive routers incorporating latency, uncertainty, device load, or expert trust remain active research.

### Combination target

Contextual bandit or constrained optimizer as an online router over experts/tools/models.

## 7. Test-Time Compute Scaling — EMERGING

Allocate more inference computation through:

- sampling;
- search;
- verification;
- tool calls;
- iterative refinement.

### Foundation underneath

- metareasoning;
- optimal stopping;
- value of information;
- tree search;
- bandit allocation.

### Research need

Formalize when additional compute has positive expected value.

## 8. Verifier-Guided Reasoning — EMERGING

Strong pattern when exact or high-quality verification is available.

Potential long-term abstraction:

```text
proposal model + search + verifier
```

rather than “reasoning model” as a monolithic object.

## 9. Learned Algorithm Selection — EMERGING

A controller selects among algorithms based on problem features.

Examples:

- solver portfolios;
- tool routing;
- decoder selection;
- compiler pass selection;
- model routing.

Foundation: contextual bandits, meta-learning, algorithm portfolios.

## 10. Agentic Planning Systems — EMERGING

Watch components rather than marketing labels:

- hierarchical decomposition;
- state/memory management;
- planning/search;
- tool execution;
- recovery;
- verifier feedback;
- human escalation.

## 11. World Models — EMERGING

Learn latent dynamics and plan through imagined states.

Foundation:

- system identification;
- model-based RL;
- MPC;
- latent variable models.

Watch for robust long-horizon planning under compounding model error.

## 12. Flow Matching / Rectified Flows — EMERGING / ESTABLISHED MODERN BOUNDARY

Transport-based generative modeling may unify parts of diffusion, continuous flows, and ODE generation.

Research dimensions:

- path geometry;
- solver steps;
- conditioning;
- discrete/multimodal extensions.

## 13. Diffusion/Flow for Decisions — EXPERIMENTAL / EMERGING

Generate action trajectories/plans rather than images.

Compare carefully against:

- MPC;
- autoregressive policies;
- trajectory optimization;
- RL policies.

## 14. Mechanistic Interpretability Algorithms — EMERGING

Methods include:

- activation patching;
- sparse autoencoders/dictionary learning;
- circuit discovery;
- causal interventions on internal states.

Long-term goal: derive causal computational explanations rather than correlation-only feature visualizations.

## 15. Sparse Autoencoders for Feature Discovery — EMERGING

Learn sparse dictionaries over neural activations.

Foundation:

- sparse coding;
- dictionary learning;
- compressed representations.

Research question: do learned features correspond to stable causal mechanisms or merely useful decompositions?

## 16. Neural Theorem Proving / Proof Search — EMERGING

Neural model ranks/generates tactics; proof assistant checks validity.

Strong combination pattern because exact proof checking contains hallucination risk.

## 17. Causal Representation Learning — EMERGING

Goal: learn representations aligned with stable causal factors/interventions.

Hard problem because observational data alone does not identify causal structure without assumptions.

## 18. Online Conformal Prediction — EMERGING

Adapt coverage under temporal drift/feedback.

Need explicit distinction between empirical adaptive coverage and classical exchangeability guarantees.

## 19. Distributionally Robust Foundation Models — EMERGING

Combine large representation models with DRO/adversarial uncertainty sets to improve worst-case behavior.

Major open issue: define uncertainty sets corresponding to realistic deployment shifts.

## 20. Privacy-Preserving Foundation-Model Training/Inference — EMERGING

Combination of:

- DP;
- secure aggregation;
- TEEs;
- FHE/MPC for specialized subroutines;
- model partitioning.

Watch cost and actual threat-model coverage.

# Quantum Watchlist

## 21. Quantum Error Correction Below Threshold — ESTABLISHED EXPERIMENTAL MILESTONE

Recent surface-code experiments demonstrate the central scaling condition: larger codes can reduce logical error when operating below threshold.

Research now shifts toward:

- lower logical error;
- long-duration operation;
- real-time decoding;
- logical gates;
- lower overhead.

## 22. Dynamic Surface Codes — EMERGING

Syndrome-extraction circuits can change over time to accommodate connectivity, leakage, alternative gates, or failed components.

Potential foundation: adaptive error-correcting codes as closed-loop control systems.

## 23. Quantum LDPC — EMERGING HIGH PRIORITY

Theoretical constructions offer improved encoding-rate/distance trade-offs.

Watch:

- hardware-local realizations;
- BP/OSD/general decoders;
- logical gates;
- fault-tolerant syndrome extraction;
- routing overhead.

## 24. Learned QEC Decoders — EMERGING

GNNs/recurrent/Transformer decoders can model correlated hardware noise.

Promotion criterion: robust logical-error improvement **and** predictable real-time latency under drift.

## 25. Bosonic Error Correction — EMERGING

Cat, GKP, and related oscillator encodings may shift error correction into hardware-native continuous-variable degrees of freedom.

Important question: total system overhead after concatenation/control/readout.

## 26. QSP/QSVT — ESTABLISHED MODERN THEORY

QSVT increasingly serves as a unifying language for fault-tolerant quantum algorithms.

Research watch:

- automated phase synthesis;
- practical block encodings;
- application resource estimates;
- robust implementation under logical error budgets.

## 27. Quantum Algorithms with End-to-End Resource Advantage — EMERGING TARGET

The field is moving beyond query complexity toward complete resource accounting.

Promotion criterion:

> quantum method beats best known classical approach after state preparation, fault tolerance, measurement, and hardware throughput are included.

## 28. Fault-Tolerant Quantum Chemistry — EMERGING

Watch algorithms combining:

- state preparation;
- qubitization;
- QPE;
- low-rank Hamiltonian decompositions;
- logical resource optimization.

## 29. Fault-Tolerant Quantum Simulation — EMERGING

Hamiltonian simulation may become one of the earliest scientifically valuable logical-quantum workloads, but concrete advantage depends on physical resources and classical baselines.

## 30. Quantum Optimization Advantage — EXPERIMENTAL

QAOA/annealing/variational optimization should remain on watch rather than be assumed advantageous.

Require comparisons against mature classical MIP/CP-SAT/local-search/metaheuristic solvers.

## 31. Quantum Machine Learning — EXPERIMENTAL / DOMAIN-SPECIFIC

Promotion requires realistic data access and end-to-end evidence, not only asymptotic feature-map arguments.

Potentially strongest niches may involve intrinsically quantum data rather than classical datasets loaded into quantum states.

## 32. Adaptive Quantum Compilation — EMERGING

Use live calibration data and learned/search-based routing/scheduling.

Foundation combination:

- graph algorithms;
- constrained scheduling;
- online learning;
- control.

## 33. Classical-Verifier Quantum Verification — EMERGING THEORY

Protocols enabling limited/classical clients to verify quantum computations connect cryptography and complexity theory.

Practicality and assumptions remain active research.

# Cybersecurity Watchlist

## 34. ML-KEM / ML-DSA / SLH-DSA — ESTABLISHED MODERN STANDARDS

These are standardized foundations for PQ migration.

Watch implementation hardening, protocol integration, side channels, and long-term cryptanalysis.

## 35. FN-DSA / Falcon — STANDARDIZATION IN PROGRESS

NIST selected Falcon/FN-DSA, with FIPS 206 still in development as of 2026.

Watch numerical-sampling implementation validation and side-channel resistance.

## 36. HQC — EMERGING STANDARD

NIST selected HQC in March 2025 as an additional code-based KEM; standardization is still in progress.

Its value includes mathematical diversity from module-lattice ML-KEM.

## 37. Additional PQ Digital Signatures — EMERGING

NIST's additional digital-signature process continues in 2026. Track candidates by **underlying assumption family**, not acronym count:

- code-based;
- multivariate;
- symmetric/hash-based;
- lattice-based variants;
- other structures.

Avoid treating candidates as deployment standards before final selection.

## 38. Crypto Agility Automation — EMERGING

Algorithms to inventory and migrate cryptography across dependency graphs may become as important operationally as the primitives themselves.

Potential components:

- SBOM/asset graph;
- cryptographic usage detection;
- policy engine;
- migration scheduler;
- compatibility testing.

## 39. Post-Quantum TLS/PKI Migration — EMERGING DEPLOYMENT

Watch:

- hybrid key exchange;
- certificate/signature size;
- handshake fragmentation;
- middlebox compatibility;
- HSM support;
- certificate authority migration.

## 40. Zero-Knowledge Virtual Machines — EMERGING

General-purpose verifiable computation is moving from custom circuits toward programmable VMs.

Promotion criteria:

- prover throughput;
- memory;
- recursion;
- developer ergonomics;
- audited soundness.

## 41. Folding / IVC — EMERGING HIGH PRIORITY

Incrementally accumulate proofs over long computations.

Potential uses:

- rollups;
- proof-carrying state;
- verifiable agents;
- long-running workflows.

## 42. Post-Quantum Succinct Proofs — EMERGING

Transparent/hash-based systems offer one route, but proof size/prover cost remain major trade-offs.

Watch new commitment schemes and recursive constructions under PQ assumptions.

## 43. FHE Compilers — EMERGING

Automated compilation from ordinary numerical/ML code to efficient BFV/BGV/CKKS/TFHE execution.

Core research problem: choose representation, packing, polynomial approximations, bootstrap points, and hybrid plaintext/FHE partition automatically.

## 44. Verifiable Private AI — EMERGING

Combine:

- FHE/MPC for confidentiality;
- ZK for correctness;
- DP for aggregate privacy;
- signed provenance for model/data identity.

This is powerful but expensive; end-to-end benchmarks are essential.

## 45. AI-Guided Fuzzing and Program Analysis — EMERGING

Promotion criterion: discovers more real defects under equal budget than strong coverage-guided/symbolic baselines, with manageable false positives.

## 46. AI-Assisted Cryptanalysis — EMERGING

Recent security research increasingly uses ML systems as search/hypothesis engines.

The durable pattern is likely:

```text
AI proposes
 -> mathematical/statistical analyzer verifies
```

not autonomous trust in generated cryptanalytic claims.

## 47. Proof-Carrying Software/Actions — EMERGING

Critical software/agent actions accompanied by verifiable evidence may become an important trust primitive.

Evidence can include:

- proof certificates;
- reproducible tests;
- signatures/provenance;
- formal invariant checks;
- ZK proofs.

# Cross-Field Watchlist

## 48. Algorithm Controllers — EMERGING META-FOUNDATION

A controller chooses which specialized algorithm to run.

Examples:

- tool router;
- solver portfolio;
- QEC decoder router;
- compiler optimization selector;
- security analyzer scheduler.

Candidate algorithms:

- LinUCB;
- Thompson sampling;
- contextual policy networks;
- constrained bandits;
- meta-learning.

This may become one of the most useful meta-algorithms in autonomous systems.

## 49. Learned Proposal + Exact Verification — EMERGING META-PATTERN

Appears in:

- neural theorem proving;
- code synthesis + tests;
- circuit synthesis + equivalence checking;
- security hypothesis + SMT;
- AI cryptanalysis + exact validation.

This pattern deserves promotion toward a general foundation if it continues transferring across domains.

## 50. Uncertainty-Aware Escalation — EMERGING META-PATTERN

Combine calibrated uncertainty/conformal sets with a controller that chooses:

- answer;
- gather more data;
- invoke stronger model;
- run verifier;
- ask human.

Research target: optimize risk × cost × latency.

## 51. Proof-Carrying Adaptive Systems — SPECULATIVE / HIGH VALUE

Adaptive system learns/changes behavior but emits verifiable evidence that actions satisfy invariant constraints.

Possible ingredients:

- online learning;
- formal policy layer;
- cryptographic identity;
- append-only logs;
- ZK/recursive proofs.

## 52. Adaptive QEC + AI + Formal Constraints — SPECULATIVE / HIGH VALUE

Combine learned noise model and dynamic QEC controller with a formally verified safe set of syndrome circuits.

Goal: adaptation without sacrificing correctness structure.

## 53. Automated Scientific Algorithm Discovery — EMERGING

Systems can search over:

- equations;
- code;
- proof steps;
- compiler rewrites;
- circuit identities;
- optimization update rules.

Strong architecture:

```text
generative search
 + evaluator/simulator
 + formal constraints
 + novelty checker
 + experiment manager
```

## 54. Research database schema

For each watchlist item maintain:

```yaml
name:
field:
maturity:
foundation_underneath:
problem:
key_contribution:
assumptions:
best_baselines:
known_failures:
implementation_status:
production_evidence:
formal_guarantees:
open_questions:
last_reviewed:
primary_sources:
```

This can later become machine-readable metadata for automated research agents.

## 55. Review cadence

Recommended review:

- standards/security: monthly or when major announcements/breaks occur;
- fast-moving AI mechanisms: quarterly;
- quantum hardware/QEC: quarterly;
- foundational algorithms: only when substantial theoretical reinterpretation occurs.

## 56. Rule for this repository

Never promote an algorithm because it is popular.

Promote it when its **underlying computational idea becomes reusable**.

That distinction keeps the collection valuable even as model names, vendors, and research fashions change.
