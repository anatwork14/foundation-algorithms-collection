# 31 — Post-Quantum Cryptography: Lattices, Codes, Hash-Based Signatures, and Migration

Post-quantum cryptography (PQC) studies classical cryptographic algorithms designed to resist known attacks by both classical and quantum computers. The field is foundational because large-scale quantum computers would break widely deployed factoring- and discrete-logarithm-based public-key systems through Shor-type algorithms.

As of 2026, NIST has standardized ML-KEM (FIPS 203), ML-DSA (FIPS 204), and SLH-DSA (FIPS 205). FN-DSA/FALCON was selected for standardization and remains in development as FIPS 206. HQC was selected in March 2025 as an additional code-based KEM, with standardization still in progress.

## 1. Threat model

Quantum computers do **not** break all cryptography equally.

- RSA/factoring: vulnerable to Shor;
- finite-field/elliptic-curve discrete log: vulnerable to Shor;
- symmetric cryptography: Grover gives a quadratic generic search improvement, generally handled by suitable key sizes;
- hash collision/preimage security: quantum query algorithms alter generic security exponents, but hash-based constructions remain viable with parameter adjustments.

## 2. Harvest-now-decrypt-later

Adversaries can record encrypted traffic today and decrypt it later if future quantum capability breaks the key-establishment scheme.

Therefore migration urgency depends on:

\[
\text{data confidentiality lifetime}
+
\text{migration time}
>
\text{time to cryptographically relevant quantum capability}.
\]

The last term is uncertain, so systems with long-lived secrets should not wait for certainty.

## 3. KEMs

A Key Encapsulation Mechanism exposes:

```text
KeyGen -> public key, secret key
Encaps(public key) -> ciphertext, shared secret
Decaps(secret key, ciphertext) -> shared secret
```

The shared secret is then passed through a KDF and used by symmetric AEAD.

KEMs are easier to compose safely than ad hoc public-key encryption in many protocols.

## 4. Lattice cryptography

A lattice is the set of integer combinations of basis vectors:

\[
\mathcal L(B)=\{Bz:z\in\mathbb Z^n\}.
\]

Hard computational problems on high-dimensional lattices provide assumptions for major PQC systems.

## 5. Shortest Vector Problem

SVP asks for a shortest nonzero lattice vector.

Approximate versions are believed hard in high dimensions and underpin reductions for several lattice-based constructions.

## 6. Closest Vector Problem

Given target \(t\), find lattice vector nearest to it.

CVP and bounded-distance decoding provide another geometric lens on lattice cryptography.

## 7. Learning With Errors

LWE samples:

\[
b=A s+e \pmod q,
\]

where \(A\) is public/random, \(s\) secret, and \(e\) is small noise.

Without \(e\), linear algebra recovers \(s\). Small noise transforms the system into a computationally hard inference problem under appropriate parameters.

### Contribution

LWE creates cryptographic hardness from **noisy linear equations**.

## 8. Ring-LWE and Module-LWE

Structured variants operate over polynomial rings/modules to reduce key size and accelerate arithmetic.

Module-LWE interpolates between unstructured LWE and highly structured Ring-LWE.

ML-KEM and ML-DSA are based on module-lattice problems.

## 9. Short Integer Solution

SIS asks for short nonzero vector \(z\) satisfying:

\[
Az=0\pmod q.
\]

SIS-like assumptions appear in lattice signatures, commitments, and proof systems.

## 10. Polynomial rings

Practical lattice schemes operate on polynomials modulo relations such as:

\[
R_q=\mathbb Z_q[x]/(x^n+1).
\]

Operations become polynomial addition/multiplication modulo \(q\) and the defining polynomial.

## 11. Number Theoretic Transform

The NTT is a finite-field analog of FFT used to accelerate polynomial multiplication.

Naive convolution:

\[
O(n^2)
\]

can be reduced toward:

\[
O(n\log n)
\]

for suitable parameters.

### Why foundational

PQC performance depends heavily on fast and side-channel-safe NTT implementations.

## 12. ML-KEM

ML-KEM is the standardized module-lattice key-encapsulation mechanism derived from CRYSTALS-Kyber.

NIST FIPS 203 defines ML-KEM-512, ML-KEM-768, and ML-KEM-1024 parameter sets.

### High-level structure

- generate structured noisy module-lattice public/secret key pair;
- encapsulate a random shared secret using public-key encryption-like operations;
- decapsulate with secret key;
- use transforms and checks designed to achieve chosen-ciphertext security.

### Contribution

Efficient general-purpose PQ key establishment with relatively compact keys/ciphertexts compared with many alternatives.

## 13. Fujisaki–Okamoto transform

A broad class of KEMs upgrades weaker public-key encryption properties into chosen-ciphertext-secure encapsulation using hashing/re-encryption-style checks.

Understanding FO-style transformations is important for understanding why decapsulation must handle malformed ciphertexts carefully.

## 14. ML-DSA

ML-DSA is NIST's standardized module-lattice signature algorithm derived from CRYSTALS-Dilithium.

### Foundation ideas

- module-lattice hardness;
- Fiat-Shamir-type challenge generation;
- rejection sampling;
- bounded-norm responses;
- deterministic/hedged hashing conventions.

### Implementation considerations

- constant-time rejection sampling;
- careful randomness handling;
- large public keys/signatures relative to classical ECC;
- side-channel resistance.

## 15. Rejection Sampling

A signer may sample internal randomness and reject outputs that could leak secret-dependent information through statistical bias.

### Contribution

Output distribution is shaped to hide secrets while satisfying verification equations.

This is a strong example of probability theory being part of cryptographic correctness/security.

## 16. FN-DSA / Falcon

Falcon/FN-DSA uses NTRU-lattice structure and Gaussian sampling to achieve comparatively compact signatures.

### Challenge

Secure high-precision sampling and numerical implementation are subtle, which is one reason implementation validation matters heavily.

As of 2026, NIST's FIPS 206 standardization remains in development.

## 17. NTRU lattices

NTRU constructions use structured polynomial lattices supporting efficient arithmetic and short-vector relationships.

They are historically important and remain relevant to signatures/encryption research.

## 18. Hash-Based Signatures

Hash-based signatures derive security primarily from cryptographic hash functions rather than algebraic number-theory assumptions.

### Foundation chain

```text
one-time signature
 -> many one-time keys
 -> Merkle tree authentication
 -> hypertree structure
 -> stateless signature scheme
```

## 19. Lamport Signatures

A one-time signature reveals selected secret preimages corresponding to message hash bits.

Simple and conceptually foundational, but keys/signatures are large and keys cannot safely be reused.

## 20. Winternitz One-Time Signatures

Encode message digits in a larger base and use hash chains to reduce signature size at a computation trade-off.

WOTS+ is a core component of SPHINCS+/SLH-DSA.

## 21. Merkle Signature Trees

Commit to many one-time public keys through a Merkle root. A signature includes an authentication path proving the used one-time key belongs to the committed tree.

This transforms many one-time signatures into a larger signing system.

## 22. SLH-DSA

SLH-DSA is the NIST standardized stateless hash-based signature scheme derived from SPHINCS+.

### Contribution

Provides a standardized signature family with security grounded mainly in hash assumptions, giving algorithmic diversity from lattice signatures.

### Trade-offs

- larger signatures;
- slower signing/verification in some parameter sets;
- conservative and well-understood primitive basis.

## 23. FORS

Forest of Random Subsets (FORS) is a few-time signature component used in SPHINCS+/SLH-DSA.

It signs digest-derived indices into collections of small hash trees and integrates with the hypertree construction.

## 24. Code-Based Cryptography

Security derives from difficulty of decoding random linear codes with errors.

Classic McEliece is the archetypal family.

### Strength

Long history of cryptanalysis.

### Cost

Public keys can be very large.

## 25. Syndrome Decoding

Given parity-check matrix \(H\), syndrome \(s\), find low-weight error vector \(e\):

\[
He^T=s.
\]

This is a foundational hard problem behind code-based cryptography.

## 26. HQC

HQC is a code-based KEM selected by NIST in March 2025 as an additional algorithm for standardization and as mathematical diversity relative to ML-KEM.

Its security relies on code-based hardness rather than module lattices.

As of September 2026, the NIST standard is still in development rather than final.

## 27. Isogeny-Based Cryptography and Lessons from SIKE

Isogeny-based systems offered very small key sizes, but the SIKE/SIDH family was broken classically and is not safe for deployment.

### Research lesson

Novel hardness assumptions need years of public cryptanalysis. Elegant performance is not evidence of security.

## 28. Multivariate Cryptography

Uses hardness of solving systems of multivariate polynomial equations over finite fields.

Many proposed schemes have been broken; the area remains valuable as a source of algebraic techniques and cautionary lessons.

## 29. Lattice Reduction: LLL

LLL finds a reduced lattice basis in polynomial time.

It does not solve exact SVP in general, but it is central to practical lattice cryptanalysis and number-theoretic algorithms.

## 30. BKZ

Block Korkine-Zolotarev reduction strengthens LLL by solving approximate shortest-vector subproblems within blocks.

Security estimates for lattice schemes depend on models of BKZ/sieving/enumeration costs.

### Algorithmic significance

PQC parameter selection is directly linked to the expected cost of the best lattice-reduction attacks.

## 31. Hybrid attacks

Cryptanalysis may combine:

- lattice reduction;
- meet-in-the-middle;
- guessing selected coordinates;
- decoding algorithms;
- quantum speedups for subroutines.

Security estimation should consider composed attacks, not only textbook single-method complexity.

## 32. Side Channels in PQC

PQC can leak through:

- timing;
- power/EM traces;
- cache/memory access;
- rejection patterns;
- decryption-failure behavior;
- fault injection.

Secure mathematical design does not imply secure implementation.

## 33. Constant-Time NTT and Sampling

Implementation must avoid secret-dependent:

- branches;
- table indices;
- early exits;
- variable rejection timing where leakage matters.

PQC creates new implementation surfaces, especially around polynomial arithmetic and samplers.

## 34. Hybrid Key Exchange

During migration, combine classical and PQ shared secrets:

```text
classical KEX secret
 + PQ KEM secret
 -> combiner/KDF
 -> session key
```

The goal is that session security survives if at least one component remains secure, subject to the combiner/protocol design.

## 35. Crypto Agility

PQC migration is not a one-time swap. Systems should support:

- algorithm identifiers;
- versioned keys/certificates;
- multiple signature/KEM suites;
- policy-driven migration;
- inventory of cryptographic dependencies;
- rapid deprecation after cryptanalytic breaks.

## 36. Migration algorithm

A practical migration program can be modeled:

1. inventory cryptographic usage;
2. classify data longevity and exposure;
3. identify protocol/library dependencies;
4. introduce hybrid support;
5. benchmark PQ sizes/latencies;
6. rotate credentials;
7. monitor standards/cryptanalysis;
8. deprecate vulnerable schemes.

## 37. PQC and constrained systems

Evaluate:

- public-key size;
- ciphertext/signature size;
- stack/heap memory;
- code size;
- CPU cycles;
- energy;
- side-channel countermeasure cost.

IoT/embedded constraints can make algorithm selection very different from server environments.

## 38. Combination research map

```text
ML-KEM + classical ECDH + HKDF
  -> hybrid key establishment

ML-DSA + transparency log
  -> PQ authenticated audit system

Lattice reduction + ML-guided heuristics
  -> cryptanalysis research

PQC + formal verification
  -> high-assurance implementations

Crypto inventory + dependency graph
  -> automated migration planning

Change detection + cryptanalytic feeds
  -> crypto-agility trigger system
```

## 39. Primary references and current standards

- NIST FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM), finalized August 13, 2024.
- NIST FIPS 204 — Module-Lattice-Based Digital Signature Standard (ML-DSA), finalized August 13, 2024.
- NIST FIPS 205 — Stateless Hash-Based Digital Signature Standard (SLH-DSA), finalized August 13, 2024.
- NIST PQC project — HQC selected for standardization March 11, 2025; FIPS in development.
- Regev, foundational Learning With Errors work.
- Ajtai, lattice cryptography foundations.
- CRYSTALS-Kyber and Dilithium specifications/papers.
- SPHINCS+ specification/papers.
- Ducas et al., Falcon specification/papers.
- Bernstein et al., Classic McEliece work.

## 40. Research questions

- How should large organizations optimize migration order under uncertain quantum timelines?
- Can cryptographic dependency graphs automatically identify hidden quantum-vulnerable paths?
- Which algorithm combinations provide meaningful diversity rather than shared hidden assumptions?
- Can formal methods verify constant-time polynomial arithmetic and samplers end to end?
- How will ML-assisted cryptanalysis change conservative parameter selection?
- Which emerging signature families will offer the best size/performance/security diversity beyond the current standards?