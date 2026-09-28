# 21 — Quantum Search, Fourier Methods, Phase Estimation, and Factoring

This chapter collects the most reusable algorithmic patterns behind early quantum speedups: oracle queries, phase kickback, amplitude amplification, Fourier analysis, and eigenphase estimation.

## 1. Deutsch–Jozsa

### Motivation

Given a promised Boolean function that is either constant or balanced, determine which case holds with very few oracle calls.

### Contribution

Shows how phase kickback and interference can reveal a global property of a function without learning individual outputs.

### Core pattern

1. prepare superposition over inputs;
2. query oracle in phase-kickback configuration;
3. apply Hadamards;
4. measure whether destructive interference removed nonconstant structure.

Its practical importance is mostly conceptual: global structure can be encoded in phase and extracted through interference.

## 2. Bernstein–Vazirani

Given hidden string \(s\) and oracle:

\[
f_s(x)=s\cdot x \pmod 2,
\]

recover \(s\).

Quantum phase kickback places the hidden linear function into relative phases and Hadamard transforms recover the entire string in one ideal oracle query.

### Foundation connection

This is Fourier analysis over \(\mathbb Z_2^n\).

## 3. Simon's Algorithm

Given a promise:

\[
f(x)=f(y) \iff y=x\oplus s,
\]

find hidden xor-mask \(s\).

### Contribution

Provides an exponential oracle-query separation and introduced the hidden-subgroup structure that later appears in Shor's algorithm.

### Implementation skeleton

1. create uniform superposition over \(x\);
2. compute \(f(x)\);
3. measure/discard function register;
4. apply Hadamards to input register;
5. obtain random vectors \(y\) satisfying \(y\cdot s=0\pmod2\);
6. solve a classical linear system over \(\mathbb F_2\).

The hybrid quantum/classical structure is important: quantum sampling produces constraints; classical algebra solves them.

## 4. Grover Search

### Problem

Find a marked item among \(N\) unstructured possibilities.

Classically, worst-case queries are \(O(N)\). Grover uses \(O(\sqrt N)\) oracle queries.

### State decomposition

Let \(|w\rangle\) represent marked subspace and \(|r\rangle\) unmarked subspace. The initial uniform state lies in their span.

### Grover iteration

1. oracle phase flip on marked states;
2. diffusion/reflection about the uniform state.

These reflections rotate the state toward the marked subspace.

### Number of iterations

For one marked item:

\[
T\approx \frac{\pi}{4}\sqrt N.
\]

### Contribution

Grover is a reusable **amplitude amplification** primitive, not merely database search.

### Limitations

- only quadratic speedup;
- oracle construction may dominate;
- state loading and fault-tolerant cost matter;
- measuring destroys state, so output remains limited.

## 5. Amplitude Amplification

Suppose an algorithm \(A\) produces a good result with probability \(p\). Amplitude amplification can increase success using roughly \(O(1/\sqrt p)\) applications rather than \(O(1/p)\) independent repetitions.

This generalizes Grover to arbitrary probabilistic quantum subroutines.

## 6. Amplitude Estimation

Estimate probability/amplitude \(a\) more efficiently than naive sampling in idealized query complexity.

Canonical amplitude estimation combines amplitude amplification operators with phase estimation.

### Modern variants

Because deep QPE circuits are expensive, many practical variants use iterative or maximum-likelihood estimation with shallower circuits.

### Combination opportunities

- Monte Carlo integration;
- risk estimation;
- option pricing research;
- probabilistic inference;
- quantum metrology.

Practical advantage depends on state preparation and fault-tolerant resources.

## 7. Quantum Fourier Transform

For \(N=2^n\):

\[
QFT|x\rangle = \frac{1}{\sqrt N}\sum_{k=0}^{N-1}e^{2\pi i xk/N}|k\rangle.
\]

### Contribution

QFT is the quantum analog of discrete Fourier analysis on amplitudes. It exposes periodic/phase structure.

### Circuit structure

QFT can be decomposed into:

- Hadamards;
- controlled phase rotations;
- output bit reversal/swaps.

Exact gate count is polynomial in \(n=\log_2N\), and approximate QFT can omit very small rotations.

### Important caveat

QFT does not output all Fourier coefficients classically. It prepares a quantum state whose amplitudes encode them.

## 8. Inverse QFT

The inverse Fourier transform is central to converting accumulated quantum phases into measurable binary information.

It appears in phase estimation and period-finding algorithms.

## 9. Quantum Phase Estimation

Given eigenstate \(|\psi\rangle\) of unitary \(U\):

\[
U|\psi\rangle=e^{2\pi i\phi}|\psi\rangle,
\]

estimate \(\phi\).

### Algorithm

1. prepare control register in superposition;
2. apply controlled powers \(U^{2^k}\);
3. phases accumulate according to binary significance;
4. apply inverse QFT;
5. measure an approximation to \(\phi\).

### Contribution

QPE turns access to controlled time evolution into eigenvalue information.

### Applications

- Shor/order finding;
- Hamiltonian eigenvalue estimation;
- quantum chemistry;
- amplitude estimation;
- linear-system algorithms;
- signal processing primitives.

### Resource bottleneck

High precision requires long coherent controlled evolutions. Fault-tolerant resource estimation is therefore essential.

## 10. Iterative Phase Estimation

Estimate phase bits sequentially using fewer ancilla qubits and adaptive classical feedback.

Trade-off:

- fewer qubits;
- more sequential/adaptive operations.

This is an early example of hybrid quantum-classical control loops.

## 11. Kitaev-style phase estimation

Estimate trigonometric functions of phase using repeated controlled powers and classical inference.

The broad lesson is that inverse QFT is one implementation of phase estimation, not the only one.

## 12. Period Finding

Suppose a function is periodic with period \(r\):

\[
f(x)=f(x+r).
\]

Quantum Fourier sampling can produce information concentrated near multiples related to \(1/r\). Classical continued fractions then recover \(r\).

This split between quantum sampling and classical number theory is central to Shor.

## 13. Shor's Factoring Algorithm

### Classical reduction

Factoring \(N\) can be reduced probabilistically to finding the order \(r\) of a random \(a\) modulo \(N\):

\[
a^r\equiv1\pmod N.
\]

If conditions are favorable, factors can be obtained using:

\[
\gcd(a^{r/2}\pm1,N).
\]

### Quantum part

Use phase estimation/order finding on modular multiplication to determine \(r\).

### Contribution

Polynomial-time quantum factoring undermines security assumptions behind RSA and related cryptosystems for sufficiently large fault-tolerant quantum computers.

### Implementation reality

Dominant costs include:

- reversible modular arithmetic;
- logical qubits;
- T/Toffoli resources;
- error correction;
- magic-state factories;
- circuit depth.

This is why post-quantum migration is needed before cryptographically relevant quantum computers exist.

## 14. Discrete Logarithms

Shor-type techniques also solve discrete logarithms in groups where the relevant quantum operations can be implemented efficiently.

This threatens classical Diffie–Hellman and elliptic-curve cryptography in the fault-tolerant quantum threat model.

## 15. Hidden Subgroup Problem

Many Fourier-based quantum algorithms can be interpreted as recovering a hidden subgroup from a function constant on cosets.

Examples:

- Simon's problem;
- period finding over cyclic groups;
- factoring/order finding.

The hidden-subgroup framework helps separate deep algebraic structure from surface problem statements.

## 16. Quantum Walks

Quantum analogs of random walks use coherent evolution instead of classical stochastic transitions.

Families:

- discrete-time coined walks;
- continuous-time walks;
- Szegedy-style walks.

Applications:

- search;
- element distinctness;
- graph algorithms;
- amplitude amplification generalizations.

## 17. Element Distinctness

Determine whether any two input elements are equal. Quantum-walk algorithms improve query complexity beyond Grover-style direct search.

The broader contribution is showing that quantum walk structure can exploit state-space geometry.

## 18. Oracle cost and reversible implementation

Any query algorithm must answer:

- how is the oracle synthesized?
- how many ancillas?
- how much uncomputation?
- what is the T-count?
- what data access is assumed?

Asymptotic oracle-query speedup is only the first layer of resource analysis.

## 19. Classical postprocessing

Quantum algorithms frequently rely on classical algorithms:

- Gaussian elimination over finite fields;
- continued fractions;
- Bayesian/maximum-likelihood estimators;
- modular arithmetic;
- error decoding.

This repository should treat hybrid computation as the default rather than an exception.

## 20. Combination research map

```text
QPE + Hamiltonian simulation
  -> energy/eigenvalue estimation

Amplitude amplification + probabilistic subroutine
  -> quadratic success amplification

Amplitude estimation + Monte Carlo objective
  -> quantum statistical estimation

Quantum Fourier sampling + classical algebra
  -> hidden-structure recovery

Phase estimation + adaptive Bayesian updates
  -> precision-efficient metrology

Grover + constraint oracle
  -> search over combinatorial feasible states
```

## 21. Primary references

- Deutsch & Jozsa, *Rapid Solution of Problems by Quantum Computation* (1992).
- Bernstein & Vazirani, *Quantum Complexity Theory* (1993).
- Simon, *On the Power of Quantum Computation* (1994).
- Grover, *A Fast Quantum Mechanical Algorithm for Database Search* (1996).
- Brassard et al., *Quantum Amplitude Amplification and Estimation*.
- Shor, *Algorithms for Quantum Computation: Discrete Logarithms and Factoring* (1994).
- Kitaev, phase estimation / Abelian stabilizer problem work.
- Nielsen & Chuang, *Quantum Computation and Quantum Information*.

## 22. Research questions

- Which phase-estimation variants minimize total fault-tolerant spacetime cost?
- Where does amplitude estimation retain an advantage after state preparation and readout are included?
- Can adaptive classical inference reduce coherent depth enough to change practical feasibility?
- Which structured search problems permit more than Grover's quadratic improvement?
- How should reversible oracles be synthesized automatically from high-level constraints?