# 33 — Secure Computation, MPC, Homomorphic Encryption, and Differential Privacy

This chapter covers algorithms that let systems compute on sensitive data while limiting who can see inputs, intermediate values, or exact individual contributions. These methods are increasingly important where AI, analytics, finance, healthcare, distributed systems, and cybersecurity intersect.

## 1. Privacy is not one property

Distinguish:

- confidentiality of data at rest/in transit;
- confidentiality during computation;
- privacy of individuals in aggregate outputs;
- access control;
- unlinkability/anonymity;
- verifiable correctness.

Different algorithms protect different surfaces.

## 2. Secret Sharing

Split a secret into shares distributed among parties.

Shamir secret sharing uses polynomial interpolation:

\[
f(x)=s+a_1x+\cdots+a_{t-1}x^{t-1}.
\]

Any \(t\) points reconstruct \(s=f(0)\); fewer reveal no information in the ideal information-theoretic setting.

## 3. Additive Secret Sharing

Over modulus \(q\): choose random shares \(s_1,\ldots,s_{n-1}\) and set:

\[
s_n=s-\sum_{i<n}s_i\pmod q.
\]

Addition is local: parties can add shares without interaction.

Multiplication is harder and motivates Beaver triples.

## 4. Secure Multi-Party Computation

MPC lets parties jointly compute:

\[
y=f(x_1,\ldots,x_n)
\]

without revealing their private inputs beyond what follows from output and protocol security definition.

Threat models:

- semi-honest/honest-but-curious;
- malicious;
- honest majority vs dishonest majority;
- synchronous/asynchronous network assumptions.

## 5. Yao Garbled Circuits

Two-party Boolean computation is represented as a circuit. Each wire has cryptographic labels; truth tables are encrypted so the evaluator can compute labels but not intermediate bits.

### Foundation components

- Boolean circuits;
- symmetric encryption/PRFs;
- oblivious transfer;
- wire-label encoding.

### Trade-off

Works naturally for Boolean operations; arithmetic-heavy workloads may prefer secret-sharing protocols.

## 6. Oblivious Transfer

In 1-out-of-2 OT, sender has \(m_0,m_1\), receiver chooses bit \(b\), learns \(m_b\) but not the other, while sender does not learn \(b\).

OT is complete for general secure two-party computation and a major building block in MPC.

## 7. OT Extension

Expensive public-key OTs can bootstrap many cheap symmetric-key OTs.

This is a recurring cryptographic systems pattern:

```text
small expensive setup
 -> many cheap amortized operations
```

## 8. GMW Protocol

Goldreich-Micali-Wigderson protocols evaluate circuits using secret sharing, with cheap XOR/addition and interactive AND/multiplication.

The round complexity depends on circuit depth, making communication latency important.

## 9. Beaver Triples

Preprocess random multiplication triples:

\[
(a,b,c),\qquad c=ab.
\]

Then multiply secret-shared values with limited online interaction.

### Contribution

Move expensive work offline so online MPC can be fast.

This offline/online decomposition is fundamental in privacy-preserving systems.

## 10. SPDZ-family MPC

SPDZ protocols provide malicious security using authenticated secret sharing and preprocessing for arithmetic circuits.

Important idea: attach information-theoretic MAC-like authentication to shares so cheating is detected.

## 11. Private Set Intersection

Two parties learn intersection:

\[
A\cap B
\]

without revealing non-intersecting elements beyond protocol leakage.

Applications:

- private contact discovery;
- fraud collaboration;
- privacy-preserving measurement;
- entity matching.

Constructions use OT, OPRFs, hashing, or public-key techniques.

## 12. Oblivious PRFs

Client obtains \(F_k(x)\) without learning key \(k\); server learns limited/no information about \(x\) depending on protocol.

OPRFs underpin PSI, privacy-preserving authentication, and private credential constructions.

## 13. Homomorphic Encryption

Homomorphic encryption allows computation on ciphertexts:

\[
Enc(x)\star Enc(y)\rightarrow Enc(f(x,y)).
\]

Decrypting reveals result without exposing plaintext inputs to evaluator.

## 14. Partially Homomorphic Encryption

Supports one operation efficiently:

- additive homomorphism (e.g., Paillier);
- multiplicative homomorphism in other schemes.

These are useful when the target computation matches the supported algebra.

## 15. Somewhat Homomorphic Encryption

Supports bounded-depth additions and multiplications before accumulated noise makes decryption unreliable.

This leads to the central concept of ciphertext noise budget.

## 16. Fully Homomorphic Encryption

FHE supports arbitrary circuits by refreshing ciphertexts through bootstrapping.

### Contribution

Enables general computation on encrypted data in principle.

### Cost

Substantially higher compute/memory than plaintext computation; algorithm engineering and workload structure are crucial.

## 17. Bootstrapping

Homomorphically evaluate the decryption circuit (or a related refresh procedure) to reduce ciphertext noise while preserving encrypted data.

Bootstrapping was the breakthrough that turns bounded homomorphism into unbounded computation.

## 18. BGV

BGV is a lattice-based leveled/FHE scheme supporting arithmetic over modular plaintext spaces with modulus switching and relinearization techniques.

## 19. BFV

BFV is another ring-lattice scheme for exact modular arithmetic.

Good fit for integer arithmetic workloads where exactness matters.

## 20. CKKS

CKKS supports approximate arithmetic on encoded real/complex vectors.

### Contribution

Approximation is built into cryptographic semantics, making it useful for numerical/ML workloads.

### Key concepts

- packing/SIMD slots;
- ciphertext scale;
- rescaling;
- multiplicative depth;
- approximation error.

## 21. TFHE-style Boolean/FHE

TFHE-family schemes emphasize fast programmable bootstrapping and Boolean/small-domain operations.

They are useful when comparison, bit operations, lookup-style functions, or frequent refresh dominate.

## 22. SIMD Packing

Pack multiple plaintext values into one ciphertext and apply operations in parallel.

This is essential for FHE throughput but imposes data-layout constraints.

Rotations/permutations move values across slots and often dominate key/material costs.

## 23. FHE Circuit Optimization

Optimize for:

- multiplicative depth;
- number of ciphertext multiplications;
- rotations;
- bootstraps;
- ciphertext size;
- scale management.

A circuit optimal for plaintext computation may be poor under FHE.

## 24. Privacy-Preserving ML with FHE

Typical inference pipeline:

```text
client encrypts features
 -> server evaluates quantized/polynomial model
 -> client decrypts prediction
```

Challenges:

- nonlinear activations;
- large matrix multiplies;
- bootstrapping frequency;
- model confidentiality;
- latency.

Polynomial approximations or lookup-oriented FHE can replace unsupported nonlinearities.

## 25. MPC + FHE Hybrids

Use FHE where communication would be expensive and MPC where homomorphic operations are inefficient.

Hybrid protocols exploit complementary cost models.

## 26. Trusted Execution Environments

TEEs are hardware isolation mechanisms rather than purely cryptographic computation.

They can be combined with MPC/FHE to improve performance while changing the trust model.

Research should clearly distinguish hardware trust from cryptographic guarantees.

## 27. Differential Privacy

Differential privacy protects individuals by bounding how much an output distribution changes when one person's data is added/removed.

A mechanism \(M\) is \(\epsilon\)-DP if:

\[
P(M(D)\in S)\le e^\epsilon P(M(D')\in S)
\]

for neighboring datasets \(D,D'\).

Approximate DP adds \(\delta\):

\[
P(M(D)\in S)\le e^\epsilon P(M(D')\in S)+\delta.
\]

## 28. Sensitivity

Global sensitivity of query \(f\):

\[
\Delta f=\max_{D\sim D'}\|f(D)-f(D')\|.
\]

Noise scale depends on sensitivity.

## 29. Laplace Mechanism

For scalar/vector numeric queries, add Laplace noise proportional to \(\Delta f/\epsilon\) to achieve pure DP under standard conditions.

## 30. Gaussian Mechanism

Adds Gaussian noise and typically provides \((\epsilon,\delta)\)-DP under appropriate calibration.

This is central to DP-SGD.

## 31. Exponential Mechanism

For nonnumeric outputs, sample candidate \(r\) with probability increasing in utility score while scaled by sensitivity/privacy budget.

This turns private selection into randomized optimization.

## 32. Randomized Response

Respond truthfully with some probability and randomly otherwise.

A simple foundational example showing privacy can arise from controlled randomness at data collection time.

## 33. Composition

Multiple DP releases consume privacy budget.

Naive composition sums \(\epsilon\), while advanced accounting methods provide tighter bounds.

Privacy accounting is therefore a resource-management algorithm.

## 34. Rényi Differential Privacy

RDP measures divergence across distributions using Rényi divergence and composes conveniently.

Frequently used to track privacy of iterative algorithms such as DP-SGD.

## 35. DP-SGD

Algorithm:

1. compute per-example gradients;
2. clip each gradient norm to bound sensitivity;
3. average clipped gradients;
4. add Gaussian noise;
5. update parameters;
6. account for privacy loss across steps.

### Trade-off

Privacy, utility, model capacity, data size, clipping norm, and number of steps interact.

## 36. Secure Aggregation

In federated learning, server learns only aggregate client updates, not each individual update.

Secret-sharing/masking techniques can tolerate some client dropout.

Secure aggregation protects update visibility but does not by itself guarantee differential privacy.

## 37. Federated + DP + Secure Aggregation

A layered architecture:

```text
client training
 -> clipped/noised update (DP)
 -> secure aggregation (cryptographic confidentiality)
 -> server aggregate
```

Each layer protects a different threat surface.

## 38. Privacy Attacks on ML

Threats include:

- membership inference;
- model inversion;
- gradient leakage;
- property inference;
- memorization/extraction.

Privacy-preserving algorithms should be evaluated against realistic attack models, not only formal budget values.

## 39. Combination research map

```text
MPC + secret sharing + Beaver triples
  -> efficient private arithmetic

FHE + quantized neural inference
  -> encrypted inference

FHE + MPC
  -> hybrid private computation

Federated learning + secure aggregation + DP
  -> distributed privacy-preserving training

ZK proof + MPC/FHE
  -> private computation with verifiable correctness

Contextual bandit + privacy budget
  -> adaptive decision making under privacy constraints
```

## 40. Primary references

- Yao, garbled-circuit secure computation.
- Goldreich, Micali & Wigderson, general MPC.
- Beaver, multiplication triples.
- Damgård et al., SPDZ family.
- Gentry, foundational fully homomorphic encryption.
- Brakerski-Gentry-Vaikuntanathan (BGV).
- Fan-Vercauteren (BFV).
- Cheon et al., CKKS approximate homomorphic encryption.
- Dwork et al., differential privacy foundations.
- Abadi et al., *Deep Learning with Differential Privacy* (DP-SGD).
- Bonawitz et al., secure aggregation for federated learning.

## 41. Research questions

- Can compilers automatically partition workloads among plaintext, MPC, and FHE execution?
- How should a system jointly optimize privacy budget, accuracy, latency, and energy?
- Can verifiable computation make outsourced FHE/MPC results efficiently auditable?
- What privacy accounting is appropriate for long-lived adaptive agents repeatedly querying user data?
- Can contextual bandits allocate privacy budget where marginal information value is highest?
- How can FHE-friendly neural architectures be co-designed rather than approximated after training?