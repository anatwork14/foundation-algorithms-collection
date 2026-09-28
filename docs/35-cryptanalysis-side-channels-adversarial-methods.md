# 35 — Cryptanalysis, Side Channels, and Adversarial Methods

Cryptographic and security algorithms must be evaluated against the strongest realistic attacks. This chapter studies **attack classes as analytical tools for defensive design**: what assumptions they target, what evidence they require, and what defensive mechanisms they motivate. It deliberately focuses on principles and research methodology rather than operational exploitation instructions.

## 1. Cryptanalysis mindset

A cryptosystem can fail at multiple layers:

- mathematical primitive;
- protocol composition;
- random-number generation;
- parameter choice;
- implementation;
- hardware leakage;
- key lifecycle;
- user/application semantics.

The correct question is not only “is AES/RSA/PQC secure?” but:

> Which security definition holds under which implementation and adversary model?

## 2. Brute-Force Search

Generic key search tries candidate keys until a consistency check succeeds.

For a uniformly random \(k\)-bit key, classical work is roughly \(2^k\) in the worst case and \(2^{k-1}\) on average.

### Defensive lesson

Key entropy must exceed the feasible search budget, including parallelism and specialized hardware.

## 3. Grover's Quantum Search Impact

Idealized quantum search can reduce generic key search from \(O(2^k)\) to \(O(2^{k/2})\) oracle calls.

This motivates larger symmetric key sizes in quantum threat models but does not remotely imply that all symmetric cryptography is broken.

## 4. Birthday Attacks

For an ideal \(n\)-bit hash, collisions appear after roughly \(2^{n/2}\) random samples.

Applications:

- hash-output sizing;
- signature hash choices;
- protocol collision analysis.

The birthday paradox is a foundational probabilistic cryptanalysis tool.

## 5. Meet-in-the-Middle

When a construction has two sequential keyed transformations, an attacker may compute forward from one side and backward from the other and match intermediate states.

### Contribution

Time-memory trade-offs can defeat the naive assumption that double encryption doubles key strength.

### Defensive lesson

Composition security must be analyzed, not inferred by adding nominal key lengths.

## 6. Time-Memory Trade-Offs

Precomputation can trade storage for online attack time.

Generic research concepts:

- Hellman tables;
- distinguished points;
- rainbow-table-style password cracking.

### Defense

Unique salts prevent useful global precomputation across password databases.

## 7. Differential Cryptanalysis

Study how input differences propagate through a cipher and bias output differences.

For difference \(\Delta X\), analyze probability of:

\[
F(X)\oplus F(X\oplus\Delta X)=\Delta Y.
\]

### Contribution

Turn tiny statistical nonuniformities in round functions into information about secret subkeys.

Modern block ciphers are designed explicitly against differential characteristics.

## 8. Linear Cryptanalysis

Find approximate linear relations among plaintext, ciphertext, and key bits with bias away from probability \(1/2\).

Combine many samples to distinguish/correlate key hypotheses.

### Defensive lesson

S-boxes and diffusion layers are evaluated for resistance to both linear and differential structure.

## 9. Differential-Linear and Higher-Order Methods

Attack families can combine differential properties with linear approximations or higher-order derivatives.

This illustrates a recurring research principle: attack composition can outperform isolated techniques.

## 10. Algebraic Cryptanalysis

Represent cryptographic operations as systems of polynomial equations over finite fields and solve/analyze the resulting system.

Tools:

- Gröbner bases;
- SAT/SMT encodings;
- linearization;
- XL-like methods.

Defensive value: reveal low-degree or structural weaknesses in cipher design.

## 11. SAT-Based Cryptanalysis

Encode key recovery or property violations as SAT constraints.

The SAT solver then exploits:

- unit propagation;
- clause learning;
- conflict analysis;
- branching heuristics.

This connects cryptanalysis directly to general-purpose constraint-solving research.

## 12. Lattice Attacks

Translate number-theoretic/cryptographic relations into a lattice and apply reduction such as LLL/BKZ.

Applications in defensive analysis include evaluating:

- weak parameter choices;
- partial nonce leakage;
- hidden-number-type structure;
- lattice-based PQC security estimates.

The core foundation is geometric search for unusually short vectors encoding hidden relations.

## 13. Index Calculus

Discrete logarithm algorithms in some groups collect many relations among small-factor-base elements, solve a large linear system, then derive target logarithms.

This explains why not all groups of equal element size provide equal security.

## 14. Number Field Sieve

The general number field sieve is the leading classical family for factoring large general integers.

Its existence determines practical RSA key-size guidance and demonstrates how advanced algebraic/number-theoretic algorithms shape cryptographic standards.

## 15. Side-Channel Analysis

A side channel uses information leaked by implementation rather than breaking mathematical security.

Sources:

- timing;
- cache/memory behavior;
- power consumption;
- electromagnetic radiation;
- acoustic signals;
- branch prediction;
- fault response.

## 16. Timing Analysis

If runtime depends on secret values, repeated timing measurements may leak information statistically.

### Defenses

- constant-time code;
- blinding;
- uniform error behavior;
- avoiding secret-dependent branches/table lookups.

Noise does not guarantee safety; statistical averaging can reveal small biases.

## 17. Cache Attacks

Memory addresses touched by lookup-table implementations may depend on secret data. Shared microarchitectural state can reveal those accesses.

### Defensive lesson

Algorithm implementation should use constant-time table-free approaches or hardware instructions designed to avoid secret-indexed memory behavior.

## 18. Simple Power Analysis

Directly inspect power traces for operation-dependent patterns.

Defenses can include regularized operations, masking, hiding, and hardware countermeasures.

## 19. Differential Power Analysis

Collect many traces and correlate measured leakage with hypotheses about intermediate values.

### Contribution

Tiny data-dependent leakage becomes exploitable through statistical aggregation.

This is a signal-processing/inference problem as much as a cryptographic one.

## 20. Correlation Power Analysis

Use a leakage model such as Hamming weight/distance and compute correlation between predicted intermediates and measured traces.

### Defensive value

CPA is a standard way to evaluate whether implementations leak secrets under realistic measurements.

## 21. Template and Profiling Attacks

Build statistical models of leakage using a similar device with known secrets, then infer unknown secret values from target traces.

Modern variants may use neural classifiers.

## 22. Masking

Randomize intermediate sensitive values into shares so any limited subset reveals little/no information.

Example additive masking:

\[
x=x_1\oplus x_2.
\]

Operations must preserve masked computation without recombining shares insecurely.

### Challenge

Higher-order attacks combine leakage from multiple shares/time points.

## 23. Hiding

Reduce signal-to-noise ratio by making execution timing/power less correlated with secrets.

Masking changes data representation; hiding changes leakage observability. Strong systems often need both.

## 24. Fault Attacks

An adversary induces computation faults and compares faulty/correct outputs to infer secrets or bypass checks.

Fault sources include:

- voltage/clock glitches;
- electromagnetic disturbance;
- optical injection;
- memory corruption.

### Defenses

- redundant computation;
- consistency checks;
- infective countermeasures;
- error-detecting codes;
- secure boot/hardware sensors.

## 25. Differential Fault Analysis

Analyze how induced faults propagate through a cipher to constrain secret key hypotheses.

The defensive lesson mirrors differential cryptanalysis: fault propagation must be considered in implementation design.

## 26. Rowhammer and Faulty Memory Phenomena

Hardware-induced bit flips can cross software isolation boundaries. This demonstrates that security models must sometimes include physical memory disturbance, not just logical access control.

Defensive research includes detection, memory-controller mitigations, stronger ECC, and isolation policies.

## 27. Spectre-Class Speculation Issues

Speculative execution can create microarchitectural traces even when architectural results are rolled back.

### Foundation lesson

Correctness at architectural state does not imply confidentiality at microarchitectural state.

Mitigations require compiler, OS, hardware, and application cooperation.

## 28. Padding Oracles and Error Channels

Protocols can leak plaintext information when error behavior differs depending on hidden decryption properties.

### Defensive lesson

- use modern AEAD;
- authenticate before releasing plaintext;
- normalize error handling;
- avoid distinguishable parsing/decryption failure paths.

## 29. Replay and State-Machine Attacks

A cryptographic message can be valid yet unsafe in the wrong state/time/context.

Defenses:

- nonces;
- sequence numbers;
- transcript binding;
- expiration;
- state-machine verification.

Cryptography must authenticate **context**, not only bytes.

## 30. Downgrade Attacks

An active adversary manipulates negotiation so parties select weaker algorithms/protocol versions.

Defenses bind negotiation transcript into authenticated key exchange and enforce minimum policy.

Crypto agility must avoid becoming downgrade agility.

## 31. Oracle Attacks as Information Extraction

An oracle exposes one bit/small amount of information per query:

- valid/invalid;
- timing difference;
- padding result;
- signature acceptance;
- cache hit;
- parser error.

Repeated adaptive queries can accumulate enough information to break confidentiality.

This is structurally similar to active learning and sequential experimental design.

## 32. Adaptive Query Strategy

From a research perspective, an attacker chooses next query to maximize expected information about secret state.

This can be modeled using:

- Bayesian experimental design;
- information gain;
- bandits;
- reinforcement learning.

The defensive response is to minimize information leakage per observable interaction.

## 33. Adversarial Machine Learning

### Evasion

Modify inputs at inference time to cause model error.

### Poisoning

Manipulate training data/process.

### Backdoors

Create hidden trigger behavior.

### Extraction

Infer/model-copy functionality through queries.

### Membership inference

Infer whether a record was in training data.

These threat classes connect AI security to classical cryptanalytic thinking.

## 34. Gradient-Based Adversarial Examples

For model loss \(L\), FGSM-style perturbation follows sign of input gradient:

\[
\delta=\epsilon\,sign(\nabla_xL).
\]

Iterative projected methods repeatedly optimize within allowed perturbation set.

Defensive research uses these algorithms to evaluate robustness, not as evidence that one perturbation norm captures all real threats.

## 35. Adversarial Training

Solve minimax objective:

\[
\min_\theta \mathbb E_{(x,y)}\left[\max_{\delta\in\Delta}L(f_\theta(x+\delta),y)\right].
\]

### Contribution

Training explicitly includes the adversary's optimization problem.

### Limitation

Robustness is usually specific to the perturbation/threat model used.

## 36. Data Poisoning Analysis

Study how malicious training examples influence learned parameters/decisions.

Defensive methods:

- robust statistics;
- influence analysis;
- provenance;
- anomaly detection;
- trusted validation sets;
- data signing/auditing.

## 37. Supply-Chain Threats

Security assumptions can be defeated through compromised:

- dependencies;
- build systems;
- model weights;
- training data;
- firmware;
- update channels.

Algorithms relevant to defense:

- content hashing;
- signed provenance;
- reproducible builds;
- transparency logs;
- graph dependency analysis;
- anomaly detection.

## 38. Automated Cryptanalysis with AI

Learned systems can assist researchers by:

- discovering statistical distinguishers;
- searching parameter spaces;
- prioritizing hypotheses;
- learning side-channel trace features;
- guiding SAT/lattice searches;
- generating candidate invariants/counterexamples.

They should complement, not replace, mathematical validation.

## 39. Defensive Evaluation Loop

```text
formal security assumption
 -> implementation
 -> attack model
 -> measurement/test
 -> counterexample/leakage evidence
 -> mitigation
 -> regression verification
```

This iterative loop is the security analog of scientific falsification.

## 40. Combination research map

```text
Side-channel traces + representation learning
  -> learned leakage detection

Bayesian experimental design + leakage testing
  -> maximize information from defensive measurements

LLL/BKZ + learned heuristics
  -> cryptanalytic search research

SAT/SMT + cryptographic constraints
  -> automated property testing

Adversarial training + formal verification
  -> empirical + certified robustness

Transparency log + signed provenance + dependency graph
  -> supply-chain integrity

Change-point detection + side-channel monitor
  -> detect new leakage/fault regimes
```

## 41. Research methodology and ethics

For cryptanalysis research:

- use systems/data you are authorized to test;
- prefer reproducible laboratory setups;
- disclose vulnerabilities responsibly;
- distinguish theoretical breaks from practical exploits;
- report assumptions and required capabilities;
- provide defensive mitigations and regression tests.

## 42. Primary references

- Matsui, linear cryptanalysis.
- Biham & Shamir, differential cryptanalysis.
- Kocher, timing attacks.
- Kocher, Jaffe & Jun, differential power analysis.
- Boneh, DeMillo & Lipton, fault-based cryptanalysis.
- Lenstra, Lenstra & Lovász, LLL lattice reduction.
- Albrecht et al., lattice-estimator/security-estimation literature.
- Goodfellow et al., adversarial examples/FGSM.
- Madry et al., adversarial training/PGD robustness.

## 43. Research questions

- Can AI discover meaningful cryptanalytic structure without merely overfitting toy ciphers?
- How can side-channel resistance be verified automatically across compiler/hardware changes?
- Can information-theoretic leakage metrics guide protocol/API design before deployment?
- How should PQC implementations be evaluated against combined timing, power, and fault attacks?
- Can adaptive attack simulation improve defensive test coverage while remaining interpretable and reproducible?
- How can supply-chain provenance become cryptographically verifiable end-to-end?