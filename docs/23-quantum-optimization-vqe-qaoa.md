# 23 — Quantum Optimization, Variational Algorithms, VQE, and QAOA

Variational quantum algorithms combine parameterized quantum circuits with classical optimization. They are important not because every near-term proposal yields an advantage, but because they expose a reusable hybrid control architecture:

```text
parameters
 -> quantum circuit
 -> measurement
 -> classical objective estimate
 -> optimizer
 -> updated parameters
```

This chapter studies that loop, its strengths, failure modes, and connections to classical optimization and control.

## 1. Parameterized quantum circuits

A parameterized circuit prepares:

\[
|\psi(\theta)\rangle = U(\theta)|0\rangle.
\]

Typical layers alternate:

- local rotations;
- entangling gates;
- problem-inspired evolutions.

### Design dimensions

- expressivity;
- depth;
- hardware connectivity;
- trainability;
- symmetry preservation;
- measurement cost.

## 2. Variational principle

For Hamiltonian \(H\) with ground energy \(E_0\):

\[
\langle\psi(\theta)|H|\psi(\theta)\rangle \ge E_0.
\]

Minimizing expected energy over a parameterized state yields an upper bound to the ground-state energy.

This principle underlies VQE.

## 3. Variational Quantum Eigensolver

### Motivation

Deep phase-estimation circuits may exceed noisy-device capabilities. Use shallower parameterized circuits and a classical optimizer.

### Algorithm

1. choose ansatz \(U(\theta)\);
2. prepare \(|\psi(\theta)\rangle\);
3. estimate \(E(\theta)=\langle H\rangle\);
4. classical optimizer proposes new \(\theta\);
5. repeat until stopping criterion.

## 4. Hamiltonian decomposition

Chemistry and physics Hamiltonians are typically decomposed into Pauli strings:

\[
H=\sum_j c_j P_j.
\]

Then:

\[
E(\theta)=\sum_j c_j\langle P_j\rangle.
\]

### Measurement challenge

Each expectation requires finite-shot estimation. Grouping commuting terms can reduce circuit count.

## 5. Ansatz design

### Hardware-efficient ansatz

Uses native shallow gates and entanglers.

Pros: easy to execute.

Cons: may ignore physical symmetries and suffer barren plateaus.

### Problem-inspired ansatz

Examples include unitary coupled-cluster-inspired forms in quantum chemistry.

Pros: stronger inductive bias.

Cons: potentially deeper and harder to compile.

## 6. Barren Plateaus

For some parameterized circuits, gradient variance can shrink exponentially with system size, making optimization nearly impossible.

Contributing factors:

- excessive random depth;
- global cost functions;
- highly expressive random circuits;
- noise.

Mitigations:

- local cost functions;
- structured initialization;
- shallow/problem-inspired ansatz;
- layerwise training;
- symmetry constraints.

## 7. Gradient estimation

### Parameter-shift rule

For suitable gates:

\[
\frac{\partial f}{\partial\theta}
=
\frac{1}{2}[f(\theta+s)-f(\theta-s)]
\]

for an appropriate shift \(s\).

### Alternatives

- finite differences;
- simultaneous perturbation stochastic approximation;
- analytic adjoint methods in simulation;
- natural gradient / quantum geometric tensor.

Measurement noise turns gradient estimation into a stochastic optimization problem.

## 8. Quantum Natural Gradient

Use the geometry induced by quantum states rather than Euclidean parameter geometry.

A metric related to the quantum Fisher information modifies the update:

\[
\Delta\theta \propto -F_Q^{-1}\nabla E.
\]

This links information geometry in classical ML with variational quantum optimization.

## 9. QAOA

The Quantum Approximate Optimization Algorithm targets combinatorial problems.

Encode cost function in Hamiltonian \(H_C\) and choose mixer \(H_M\).

For depth \(p\):

\[
|\gamma,\beta\rangle=
\prod_{j=1}^{p}e^{-i\beta_jH_M}e^{-i\gamma_jH_C}|+\rangle^{\otimes n}.
\]

Optimize angles to maximize expected objective.

## 10. Cost Hamiltonians

A binary optimization problem can often be mapped to Ising variables or Pauli-Z operators.

Example MaxCut edge term:

\[
C_{ij}=\frac{1-Z_iZ_j}{2}.
\]

Sum over graph edges to obtain objective Hamiltonian.

## 11. Mixer design

Standard mixer:

\[
H_M=\sum_i X_i.
\]

For constrained problems, custom mixers can preserve feasibility and avoid wasting amplitude on invalid states.

This is a direct connection between constraint-satisfaction algorithms and quantum circuit design.

## 12. QAOA as alternating control

QAOA can be interpreted as discretized alternating evolution between problem and mixing Hamiltonians.

This connects it to:

- optimal control;
- adiabatic computing;
- bang-bang protocols;
- variational optimization.

## 13. Quantum Annealing

Quantum annealing evolves from an easy Hamiltonian toward a problem Hamiltonian, often using hardware designed for Ising/QUBO problems.

### Difference from gate-model QAOA

Annealing is typically continuous analog evolution; QAOA is a parameterized gate-model sequence. They share optimization/adiabatic conceptual roots but have different control and error models.

## 14. QUBO formulations

Quadratic unconstrained binary optimization:

\[
\min_{x\in\{0,1\}^n} x^TQx.
\]

Many scheduling, partitioning, routing, and allocation problems can be encoded as QUBOs, often with penalty terms for constraints.

### Caution

Encoding can dramatically increase variable count and coefficient range.

## 15. Penalty methods

Constraint \(g(x)=0\) can be added as:

\[
C'(x)=C(x)+\lambda g(x)^2.
\]

Choosing \(\lambda\) is nontrivial:

- too small → infeasible solutions;
- too large → poor numerical/energy scaling.

## 16. Classical optimizer choices

Common choices:

- COBYLA;
- Nelder-Mead;
- SPSA;
- gradient descent/Adam;
- natural gradient;
- Bayesian optimization.

The best choice depends on shot noise, dimensionality, landscape smoothness, and circuit execution latency.

## 17. Shot allocation

Given limited measurement budget, allocate shots adaptively among:

- Hamiltonian terms;
- parameter points;
- gradient components.

This is naturally a sequential resource-allocation problem.

### Combination idea

Contextual bandits can choose which measurement/parameter evaluation to perform next based on variance and expected information gain.

## 18. Warm starts

Use classical approximate solutions to initialize quantum states or parameters.

Sources:

- semidefinite relaxations;
- greedy heuristics;
- classical local search;
- previous related instances;
- learned predictors.

Warm starts make hybrid algorithms genuine combinations rather than replacements for classical solvers.

## 19. Layerwise training

Train a shallow circuit first, then append layers and continue optimization.

This can reduce optimization difficulty and provide useful initialization for deeper circuits.

## 20. Symmetry constraints

If the problem conserves particle number, spin, parity, or other quantities, design the ansatz/mixer to remain in the relevant subspace.

### Contribution

Reduces search space and prevents physically invalid states.

## 21. Error mitigation inside variational loops

Methods:

- zero-noise extrapolation;
- probabilistic error cancellation;
- symmetry verification;
- readout mitigation.

The optimizer can otherwise learn hardware noise rather than the intended objective.

## 22. Trainability under noise

Noise contracts distinguishability and can flatten objective landscapes. Thus circuit depth, noise, and optimizer interact strongly.

A useful experiment should separate:

- optimization failure;
- expressivity failure;
- sampling noise;
- hardware noise;
- compiler-induced error.

## 23. Classical baselines

For optimization compare against:

- greedy/local search;
- simulated annealing;
- tabu search;
- branch-and-bound;
- mixed-integer programming;
- semidefinite relaxation;
- specialized graph algorithms;
- modern heuristic/metaheuristic solvers.

Quantum experiments without strong baselines are difficult to interpret.

## 24. Variational quantum machine learning

Parameterized circuits can serve as classifiers, kernels, or feature maps.

Questions:

- does the quantum feature map encode a useful inductive bias?
- is training stable?
- can the kernel be estimated efficiently?
- can classical kernels/tensor networks match performance?

## 25. Quantum kernels

Encode \(x\) into quantum state \(|\phi(x)\rangle\) and estimate similarity:

\[
K(x,x')=|\langle\phi(x)|\phi(x')\rangle|^2.
\]

Then use classical kernel algorithms such as SVMs.

This is a clear example of quantum representation + classical learning.

## 26. Hybrid optimizer architecture

```text
classical representation / warm start
 -> quantum state preparation
 -> quantum objective sampling
 -> uncertainty estimator
 -> classical optimizer/bandit
 -> new circuit parameters
 -> repeat
```

Each component can be independently improved and benchmarked.

## 27. Combination research map

```text
VQE + adaptive shot allocation
  -> lower measurement cost

QAOA + constraint-preserving mixers
  -> feasible-state quantum search

QAOA + classical local search
  -> quantum proposal + classical refinement

Quantum natural gradient + variational circuits
  -> geometry-aware optimization

Bayesian optimization + expensive quantum objective
  -> sample-efficient parameter tuning

Contextual bandit + circuit/measurement choice
  -> online resource allocation

Classical solver + quantum subproblem
  -> decomposition-based hybrid optimization
```

## 28. Primary references

- Peruzzo et al., *A Variational Eigenvalue Solver on a Photonic Quantum Processor* (2014).
- Farhi, Goldstone & Gutmann, *A Quantum Approximate Optimization Algorithm* (2014).
- McClean et al., *Barren Plateaus in Quantum Neural Network Training Landscapes* (2018).
- Schuld et al., parameter-shift gradient work.
- Stokes et al., *Quantum Natural Gradient*.
- Farhi et al., adiabatic quantum computation.

## 29. Research questions

- Can adaptive experimental-design algorithms reduce VQE measurement cost enough to change total economics?
- Which constrained mixers generalize across problem families?
- Can classical decomposition isolate quantum subproblems where coherent processing is actually valuable?
- How should optimizer state incorporate hardware drift and changing calibration?
- What evidence would constitute practical variational quantum advantage over continuously improving classical heuristics?