# 24 — Quantum Error Correction and Decoding

Quantum error correction (QEC) is the algorithmic bridge between fragile physical qubits and long computations on logical qubits. The key idea is subtle: redundancy is introduced without copying an unknown quantum state. Instead, logical information is encoded into a larger entangled subspace, and carefully chosen parity-like measurements reveal **which error occurred** without directly revealing the logical state.

This chapter covers code constructions and, equally importantly, the classical decoding algorithms that make them operational.

## 1. Why QEC is necessary

Physical qubits suffer:

- bit flips;
- phase flips;
- combined Pauli errors;
- relaxation and dephasing;
- leakage;
- measurement errors;
- correlated errors;
- crosstalk;
- calibration drift.

Useful large-scale quantum algorithms require logical error rates far below typical physical operation error rates.

QEC trades hardware and classical processing for reliability.

## 2. Classical repetition code

Encode one bit:

\[
0\to000,\qquad1\to111.
\]

Majority vote corrects one bit flip.

This introduces the core coding concepts:

- code distance;
- syndrome;
- decoder;
- redundancy.

But direct copying is forbidden for arbitrary quantum states, so quantum codes require a different construction.

## 3. Three-qubit bit-flip code

Encode:

\[
\alpha|0\rangle+\beta|1\rangle
\to
\alpha|000\rangle+\beta|111\rangle.
\]

Measure parity checks rather than the logical amplitudes to locate a bit flip.

The syndrome identifies an error class while preserving \(\alpha,\beta\).

## 4. Phase-flip code

Using the Hadamard basis, analogous redundancy can correct phase errors.

Since:

\[
HXH=Z,
\]

bit and phase errors are related by basis change.

## 5. Shor nine-qubit code

Combines repetition-like protection against bit and phase errors.

### Contribution

Demonstrates that arbitrary single-qubit errors can be corrected by encoding one logical qubit into multiple physical qubits.

## 6. Quantum error-correction conditions

For code projector \(P\) and errors \(E_a,E_b\), Knill-Laflamme condition:

\[
PE_a^\dagger E_bP=c_{ab}P.
\]

### Interpretation

Different correctable errors act distinguishably on syndrome degrees of freedom without revealing logical information.

This is the general mathematical condition behind QEC.

## 7. Stabilizer codes

A stabilizer code is defined by commuting Pauli operators \(S_i\). Code states satisfy:

\[
S_i|\psi_L\rangle=|\psi_L\rangle.
\]

Errors anticommute with subsets of stabilizers, changing measured eigenvalues and producing a syndrome.

### Contribution

Stabilizer formalism converts quantum code design and decoding into algebraic parity-check structure.

## 8. CSS codes

Calderbank-Shor-Steane codes construct quantum codes from pairs of classical linear codes with compatibility conditions.

### Why foundational

CSS structure lets X-type and Z-type errors be treated using related classical coding techniques.

Examples:

- Steane code;
- many surface-code formulations;
- quantum LDPC families.

## 9. Code parameters

Quantum code notation:

\[
[[n,k,d]],
\]

where:

- \(n\): physical qubits;
- \(k\): logical qubits;
- \(d\): code distance.

Roughly, distance \(d\) can detect up to \(d-1\) errors and correct up to \(\lfloor(d-1)/2\rfloor\) adversarial Pauli errors under idealized assumptions.

## 10. Surface codes

Surface codes place data and measurement qubits on a local 2D lattice and repeatedly measure stabilizers.

### Motivation

Use only local interactions while achieving a high threshold and scalable code-distance growth.

### Logical operators

Logical X/Z correspond to extended strings across the code. An undetected chain connecting appropriate boundaries can implement a logical error.

### Operational loop

```text
physical noise
 -> repeated stabilizer measurements
 -> detection events
 -> decoder
 -> inferred correction / Pauli frame update
 -> logical computation
```

## 11. Repeated syndrome measurement

Measurements themselves are noisy, so a single syndrome round is insufficient.

Surface-code decoding is often performed in spacetime:

- 2D physical layout;
- plus time dimension of repeated syndrome rounds.

Detection events arise from changes between rounds.

## 12. Minimum-Weight Perfect Matching

MWPM is a classic surface-code decoder.

### Representation

Construct a graph whose vertices are detection events and whose edge weights reflect likely error-chain costs.

### Algorithm

Find a minimum-weight pairing of syndrome events consistent with boundaries.

### Contribution

Decoding becomes a classical combinatorial optimization problem.

### Limitations

- runtime/latency at large scale;
- graph construction depends on noise model;
- correlated errors can invalidate simple independent-edge weights.

## 13. Union-Find Decoders

Union-find decoders grow and merge clusters of detection events, then construct corrections.

### Contribution

Very fast near-linear-time practical decoding with good threshold behavior in many settings.

### Trade-off

Can sacrifice some decoding optimality relative to more expensive methods.

## 14. Belief Propagation

Represent error variables and parity constraints as a factor graph. Iteratively exchange messages estimating marginal error probabilities.

### Strength

Natural for sparse parity-check structures such as LDPC codes.

### Weakness

Short cycles and degeneracy can create correlated messages and poor convergence.

## 15. Ordered-Statistics Decoding

OSD uses reliability estimates from a soft decoder, chooses a likely information set, and searches a limited set of corrections.

BP+OSD combinations are important for quantum LDPC decoding because belief propagation provides soft information while OSD repairs difficult residual ambiguities.

## 16. Tensor-Network Decoders

Approximate likelihoods by contracting tensor networks representing code constraints and error probabilities.

### Contribution

Can approach maximum-likelihood behavior while exploiting structure.

### Limitation

Contraction cost grows with bond dimension/code geometry.

## 17. Renormalization-Group Decoders

Decode hierarchically:

1. solve local regions;
2. coarse-grain residual syndromes;
3. repeat at larger scales.

This is a direct application of multiscale algorithm design.

## 18. Neural Decoders

Train a model to map syndrome history to correction/logical-error predictions.

Graph neural network decoders can encode stabilizer measurements as detector graphs and predict logical-error classes from the resulting structured syndrome data.

Selective state-space decoders can encode active surface-code detection events as a variable-length sequence and process that sequence with a Mamba-style backbone.

Architectures:

- MLP/CNN;
- recurrent models;
- graph neural networks;
- Transformers;
- reinforcement learning.

### Potential advantages

- learn correlated hardware noise;
- exploit device-specific structure;
- fast inference after training.

### Risks

- generalization under calibration drift;
- rare high-weight errors;
- lack of guarantees;
- training-data coverage;
- inference latency.

## 19. Decoder as Bayesian inference

Probabilistic decoding can be framed as posterior inference over candidate error patterns or codewords conditioned on observed syndrome or soft channel evidence.

Given syndrome \(s\), infer likely error equivalence class:

\[
\hat E=\arg\max_E P(E|s).
\]

Because errors differing by stabilizers may be logically equivalent, the optimal target is often the most likely **logical coset**, not the most likely individual physical error.

This degeneracy distinguishes quantum decoding from naive classical decoding.

## 20. Fault-Tolerant syndrome extraction

Syndrome circuits themselves can spread errors. Circuit design must prevent a single physical fault from becoming an uncorrectable logical fault.

Techniques:

- ancilla verification;
- flag qubits;
- repeated measurement;
- carefully ordered CNOT schedules;
- code-specific fault-tolerant gadgets.

## 21. Threshold theorem

If physical operations are below a code/scheme-dependent threshold and noise assumptions hold, arbitrarily long computation can in principle be achieved with increasing overhead.

### Current relevance

Modern experiments have demonstrated below-threshold surface-code behavior where larger code distance reduces logical error rates, making decoder quality and real-time integration central systems problems.

## 22. Logical error rate scaling

A simplified phenomenological form below threshold is often written:

\[
p_L \approx A\left(\frac{p}{p_{th}}\right)^{(d+1)/2}.
\]

Exact behavior depends on decoder, circuit, code geometry, and noise correlations.

## 23. Color Codes

Color codes use different lattice/check structures and can offer attractive transversal logical gates depending on dimension/code construction.

Trade-offs include:

- stabilizer weight;
- threshold;
- decoding complexity;
- connectivity.

## 24. Quantum LDPC Codes

Low-density parity-check quantum codes use sparse stabilizer checks while seeking better encoding rates/distance-overhead trade-offs than simple 2D topological codes.

### Why emerging

Recent theory and experiments increasingly focus on reducing the physical-qubit overhead of fault-tolerant computation.

### Challenges

- nonlocal connectivity for some constructions;
- decoding degeneracy;
- syndrome circuit design;
- logical operations;
- hardware layout.

## 25. Hypergraph-Product and Related Codes

Quantum LDPC constructions can be formed from products/lifts of classical codes.

This creates an important research bridge:

```text
classical coding theory
 + sparse graphs
 + finite-field algebra
 -> quantum LDPC codes
```

## 26. Erasure-Biased and Noise-Biased Codes

If hardware noise is asymmetric or locations of faults are partially known, codes/decoders can exploit that structure.

Examples:

- XZZX-like surface code adaptations;
- erasure-aware decoding;
- bosonic loss-detection information.

Algorithm design should match the **actual noise channel**, not only depolarizing toy models.

## 27. Bosonic Codes

Encode logical information in oscillator modes rather than many two-level systems.

Examples:

- cat codes;
- binomial codes;
- GKP codes.

These can shift parts of error correction into hardware-native continuous-variable structure.

## 28. GKP Codes

Grid states encode a qubit in phase space. Small displacement errors can be inferred from modular quadrature measurements.

### Research connection

Continuous-variable estimation + classical decoding + concatenation with qubit codes.

## 29. Decoder latency

A decoder must often keep pace with repeated QEC cycles.

Metrics:

- average latency;
- tail latency;
- throughput;
- memory bandwidth;
- parallelism;
- calibration update speed;
- accuracy vs. code distance.

This makes QEC simultaneously a coding-theory, AI, and real-time systems problem.

## 30. Pauli Frame

Instead of physically applying every correction, track known Pauli corrections classically and reinterpret future operations/measurements.

This reduces physical gate overhead and highlights the classical control system's central role.

## 31. Dynamic QEC circuits

Recent experiments explore dynamically varying syndrome-extraction circuits rather than repeating one static schedule.

Potential motivations:

- avoid failed qubits/couplers;
- reduce leakage propagation;
- use alternative entangling gates;
- adapt to hardware topology.

This suggests a new research direction: **adaptive QEC scheduling**.

## 32. Combination research map

```text
Surface code + MWPM
  -> graph optimization decoder

Quantum LDPC + BP/OSD
  -> sparse-message-passing decoder

Syndrome graph + GNN
  -> learned relational decoding

Hardware telemetry + contextual bandit
  -> adaptive decoder/circuit selection

Change-point detection + decoder calibration
  -> react to noise drift

RL + dynamic QEC circuits
  -> adaptive syndrome scheduling

QEC + distributed real-time systems
  -> low-latency logical control plane
```

## 33. Evaluation protocol

For every decoder report:

- physical noise model;
- code family/distance;
- syndrome circuit;
- number of rounds;
- logical error rate;
- threshold estimate;
- decoder latency/throughput;
- training/calibration requirements;
- behavior under correlated errors;
- behavior under noise drift;
- memory/compute cost.

## 34. Primary references

- Shor, *Scheme for Reducing Decoherence in Quantum Computer Memory* (1995).
- Steane, *Error Correcting Quantum Code* (1996).
- Gottesman, stabilizer-code work.
- Dennis et al., *Topological Quantum Memory* (2002).
- Fowler et al., surface-code review.
- Delfosse & Nickerson, union-find decoding work.
- Panteleev & Kalachev and subsequent quantum-LDPC literature.
- Google Quantum AI, below-threshold surface-code experiments on Willow (2024) and dynamic surface-code demonstrations (2026).

## 35. Research questions

- Can one decoder remain calibrated across long-term hardware drift without retraining from scratch?
- Can neural/graph decoders provide predictable worst-case latency and trustworthy rare-event behavior?
- Which quantum-LDPC constructions best balance connectivity, logical gates, and decoder complexity?
- Can contextual bandits select decoder families or syndrome schedules online?
- How should decoder confidence be exposed to higher-level fault-tolerant schedulers?
- Can QEC become a closed-loop adaptive control problem rather than a static code-plus-decoder stack?