# 20 — Quantum Computation Foundations

Quantum algorithms are easiest to understand when separated into reusable primitives: state preparation, reversible transformations, interference, phase manipulation, entanglement, measurement, and amplitude amplification. This chapter builds that substrate before specialized algorithms such as Shor, Grover, QPE, QSVT, VQE, or QAOA.

## 1. Qubits

A pure qubit state is:

\[
|\psi\rangle=\alpha|0\rangle+\beta|1\rangle,
\qquad |\alpha|^2+|\beta|^2=1.
\]

Unlike a classical bit, a qubit stores complex amplitudes. Measurement in the computational basis returns 0 or 1 probabilistically.

### Foundation idea

Quantum algorithms do not obtain speedups merely by “trying all answers at once.” They engineer amplitudes so interference increases probability on useful outcomes and suppresses unwanted outcomes.

## 2. Multiple qubits and tensor products

Two qubits live in a four-dimensional state space:

\[
|\psi\rangle=\alpha_{00}|00\rangle+\alpha_{01}|01\rangle+\alpha_{10}|10\rangle+\alpha_{11}|11\rangle.
\]

For \(n\) qubits, the state vector has \(2^n\) amplitudes.

This exponential state dimension enables rich representation but does **not** imply arbitrary exponential information can be read out; measurement severely limits accessible classical information.

## 3. Unitary evolution

Closed-system quantum evolution is represented by a unitary matrix:

\[
U^\dagger U=I.
\]

Applying a quantum gate:

\[
|\psi'\rangle=U|\psi\rangle.
\]

Unitarity implies reversibility and norm preservation.

## 4. Single-qubit gates

### Pauli X

Bit flip:

\[
X=\begin{bmatrix}0&1\\1&0\end{bmatrix}.
\]

### Pauli Z

Phase flip:

\[
Z=\begin{bmatrix}1&0\\0&-1\end{bmatrix}.
\]

### Pauli Y

Combines bit and phase behavior with complex phase.

### Hadamard

\[
H=\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}.
\]

Creates/evaluates superpositions and is central to interference-based algorithms.

### Phase rotations

\[
R_z(\theta)=e^{-i\theta Z/2}.
\]

Parameterized rotations are basic ingredients of quantum Fourier transforms, variational circuits, signal processing, and compilation.

## 5. Controlled operations

A controlled-U applies \(U\) conditioned on a control qubit.

The CNOT gate maps:

\[
|a,b\rangle\mapsto |a,a\oplus b\rangle.
\]

Controlled operations create conditional phase relationships and entanglement.

## 6. Entanglement

A Bell state:

\[
|\Phi^+\rangle=\frac{|00\rangle+|11\rangle}{\sqrt2}
\]

cannot be written as a product of independent single-qubit states.

Entanglement is a correlation resource used in:

- teleportation;
- error correction;
- distributed quantum protocols;
- many quantum algorithms;
- measurement-based computation.

But entanglement alone is not equivalent to computational advantage.

## 7. Measurement

For projective measurement operators \(P_i\):

\[
P(i)=\langle\psi|P_i|\psi\rangle.
\]

The state updates conditioned on the observed outcome.

### Algorithmic importance

Measurement converts quantum information into classical information and can also be used inside algorithms for adaptive control, syndrome extraction, iterative phase estimation, teleportation, and error correction.

## 8. The Bloch sphere

A pure qubit can be represented:

\[
|\psi\rangle=\cos(\theta/2)|0\rangle+e^{i\phi}\sin(\theta/2)|1\rangle.
\]

The Bloch sphere gives geometric intuition for single-qubit rotations and noise.

## 9. Density matrices

Pure state:

\[
\rho=|\psi\rangle\langle\psi|.
\]

Mixed states are probability mixtures:

\[
\rho=\sum_i p_i|\psi_i\rangle\langle\psi_i|.
\]

Density operators are necessary for open systems, noise, partial observations, entanglement with environments, and error correction.

## 10. Partial trace

For a composite system \(AB\), the local state of \(A\) is:

\[
\rho_A=\mathrm{Tr}_B(\rho_{AB}).
\]

This explains how a subsystem can appear mixed even when the global state is pure.

## 11. Quantum channels

A general physical noisy operation is a completely positive trace-preserving map:

\[
\rho' = \mathcal E(\rho).
\]

Kraus representation:

\[
\mathcal E(\rho)=\sum_k E_k\rho E_k^\dagger,
\qquad \sum_kE_k^\dagger E_k=I.
\]

Examples:

- bit-flip channel;
- phase-flip channel;
- depolarizing channel;
- amplitude damping;
- dephasing;
- erasure.

Noise models are algorithmic inputs to QEC, compilation, mitigation, and hardware-aware optimization.

## 12. No-cloning theorem

An unknown arbitrary quantum state cannot be perfectly copied by a universal unitary process.

### Consequence

Classical redundancy cannot be applied naively. Quantum error correction encodes information in entangled subspaces and extracts syndromes without measuring the logical state directly.

## 13. Reversible computation

Unitary gates are reversible, so classical irreversible functions must be embedded into reversible transformations.

A classical function \(f\) is often represented as an oracle:

\[
U_f|x,y\rangle=|x,y\oplus f(x)\rangle.
\]

This pattern underlies many query-complexity algorithms.

## 14. Quantum oracles

An oracle abstracts access to a function/data structure.

Important distinction:

- query complexity may show a quantum advantage;
- total end-to-end runtime also includes state preparation, oracle construction, error correction, and readout.

Any practical quantum advantage claim should account for those costs.

## 15. Phase kickback

When a target register is prepared in an eigenstate of a controlled operation, function information can be transferred into a phase on the control register.

This mechanism is central to:

- Deutsch-Jozsa;
- Bernstein-Vazirani;
- phase estimation;
- Fourier-based algorithms.

## 16. Interference

If two computational paths contribute amplitudes \(a\) and \(b\), probability depends on:

\[
|a+b|^2,
\]

not \(|a|^2+|b|^2\).

Constructive and destructive interference are the operational mechanism behind many quantum algorithms.

## 17. Universal gate sets

A finite gate set can approximate arbitrary unitaries to desired precision.

Common abstractions:

- Clifford + T;
- arbitrary single-qubit rotations + entangling gate;
- hardware-native gate sets.

The difference between logical gates and native physical gates becomes critical in fault-tolerant compilation.

## 18. Clifford circuits

The Clifford group maps Pauli operators to Pauli operators under conjugation.

Generated by gates such as:

- H;
- S;
- CNOT.

Clifford circuits are important because they can be efficiently simulated classically under the stabilizer formalism, demonstrating that superposition and entanglement alone do not guarantee quantum computational advantage.

## 19. Non-Clifford resources

Adding a non-Clifford gate such as T enables universal quantum computation.

In many fault-tolerant architectures, non-Clifford operations are significantly more expensive, motivating:

- T-count minimization;
- T-depth minimization;
- magic-state distillation;
- alternative code/gate constructions.

## 20. Stabilizer formalism

A stabilizer state is the simultaneous +1 eigenstate of a commuting group of Pauli operators.

This formalism provides compact representation for many error-correcting codes and Clifford computations.

Foundation connection:

```text
linear algebra over finite fields
+ group theory
+ parity checks
= stabilizer computation and QEC
```

## 21. Quantum teleportation

Using shared entanglement, two classical bits, Bell measurement, and correction operations, an unknown qubit state can be transferred without physically sending the original qubit.

Teleportation is not just a communication curiosity; it is a computational primitive for:

- gate teleportation;
- fault-tolerant logical operations;
- modular quantum architectures.

## 22. Quantum query complexity

The query model asks how many oracle accesses are required.

Examples:

- Grover: quadratic improvement for unstructured search;
- Simon: exponential query separation for a structured promise problem;
- Bernstein-Vazirani: recovers a hidden linear bit string with fewer oracle calls than straightforward classical querying.

Query advantages must later be converted into resource estimates for real systems.

## 23. Circuit complexity

Relevant metrics:

- gate count;
- circuit depth;
- two-qubit gate count;
- T-count/T-depth;
- qubit count;
- connectivity/routing overhead;
- measurement rounds;
- logical error budget;
- classical control latency.

## 24. State preparation

Loading classical data into amplitudes may itself be expensive.

Common preparation strategies:

- computational-basis encoding;
- angle encoding;
- amplitude encoding;
- basis-state superposition;
- QRAM-like abstractions.

### Research caution

Quantum algorithms that assume cheap amplitude loading may lose practical advantage when realistic data-loading cost is included.

## 25. Measurement complexity

Expectation values often require repeated circuit shots:

\[
\langle O\rangle = \langle\psi|O|\psi\rangle.
\]

Sampling error decreases roughly as \(1/\sqrt N\) in ordinary Monte Carlo estimation, so measurement can dominate variational-algorithm cost.

## 26. Quantum algorithm design patterns

Reusable patterns:

```text
prepare superposition
 -> compute oracle/value
 -> encode information into phase/amplitude
 -> interfere/amplify
 -> measure
```

or:

```text
prepare eigenstate
 -> controlled powers of U
 -> estimate phase
 -> classical postprocess
```

or:

```text
block-encode matrix
 -> polynomial transformation
 -> measure/use transformed operator
```

or:

```text
parameterized circuit
 -> measure objective
 -> classical optimizer
 -> update parameters
```

These patterns lead directly to later quantum chapters.

## 27. Classical simulation as a baseline

Before claiming quantum advantage, compare against:

- state-vector simulation;
- stabilizer simulation;
- tensor networks;
- Monte Carlo;
- specialized classical algorithms;
- approximate classical methods.

The best classical baseline often improves after a quantum proposal appears.

## 28. Implementation stack

A quantum program usually crosses layers:

```text
problem formulation
 -> quantum algorithm
 -> logical circuit
 -> synthesis
 -> mapping/routing
 -> error correction / mitigation
 -> native pulses/gates
 -> measurement
 -> classical decoding/postprocessing
```

Performance can be dominated by any layer.

## 29. Combination research map

```text
Quantum circuits + classical optimization
  -> variational algorithms

Quantum phase + Fourier transform
  -> phase estimation / Shor

Stabilizer formalism + classical decoding
  -> quantum error correction

Quantum measurement + Bayesian estimation
  -> adaptive metrology

Quantum algorithm + contextual bandit
  -> adaptive circuit/measurement selection

Quantum compilation + reinforcement learning
  -> hardware-aware routing/scheduling
```

## 30. Primary references

- Nielsen & Chuang, *Quantum Computation and Quantum Information*.
- Preskill, lecture notes on quantum computation.
- Watrous, *The Theory of Quantum Information*.
- Aaronson, *Quantum Computing Since Democritus*.
- Gottesman, stabilizer formalism and quantum error-correction work.

## 31. Research questions

- Which claimed speedups survive realistic state preparation and fault-tolerance costs?
- Which quantum resources are actually necessary for advantage in specific workloads?
- Can classical adaptive algorithms reduce quantum measurement/sample complexity?
- How should algorithms be co-designed with topology, noise, and decoder latency?
- Which abstractions will remain useful when hardware transitions from NISQ experiments to logical qubits?