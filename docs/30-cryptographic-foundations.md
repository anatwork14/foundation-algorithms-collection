# 30 — Cryptographic Foundations

Cryptography is not a bag of ciphers. It is a collection of reusable constructions built from assumptions about computational hardness, randomness, one-wayness, indistinguishability, and authentication. This chapter focuses on the algorithmic primitives that modern security protocols compose.

## 1. Security goals

Core goals include:

- confidentiality — unauthorized parties cannot learn protected content;
- integrity — unauthorized modification is detectable;
- authenticity — parties can verify who produced data;
- non-replay/freshness — old valid messages cannot simply be reused;
- forward secrecy — compromise of long-term keys does not reveal old sessions;
- key separation — one key is not reused across incompatible purposes;
- misuse resistance — some implementation mistakes have bounded consequences.

Security definitions matter more than algorithm names.

## 2. Threat models

Before selecting algorithms specify:

- adversary capabilities;
- online/offline access;
- chosen-plaintext/chosen-ciphertext capabilities;
- side-channel access;
- key compromise assumptions;
- quantum capability;
- implementation compromise;
- active network manipulation.

Cryptographic guarantees are always relative to a model.

## 3. Computational security

Most practical cryptography assumes certain problems are computationally infeasible for bounded adversaries.

Examples:

- factoring;
- discrete logarithm;
- lattice problems;
- decoding random linear codes;
- finding hash preimages/collisions.

A reduction attempts to show that breaking a construction would solve an assumed-hard problem.

## 4. One-Way Functions

A one-way function is easy to evaluate but hard to invert on typical inputs.

Conceptually:

\[
y=f(x)\quad\text{easy},
\qquad
x=f^{-1}(y)\quad\text{hard}.
\]

One-way functions are a foundational theoretical assumption from which many cryptographic primitives can be constructed.

## 5. Cryptographic Hash Functions

A hash maps arbitrary input to fixed-length output:

\[
H:\{0,1\}^*\rightarrow\{0,1\}^n.
\]

Desired properties include:

- preimage resistance;
- second-preimage resistance;
- collision resistance;
- pseudorandom-looking output under suitable use.

### Birthday bound

Generic collision search requires roughly \(2^{n/2}\) work for an \(n\)-bit ideal hash.

### Major constructions/families

- SHA-2;
- SHA-3/Keccak sponge construction;
- BLAKE-family designs.

## 6. Merkle–Damgård

Iteratively compress message blocks:

```text
IV -> compress(block1) -> state -> ... -> digest
```

This construction explains properties and pitfalls such as length-extension attacks for some hash/MAC misuse patterns.

## 7. Sponge Construction

Keccak/SHA-3 uses a permutation-based sponge:

1. absorb input into part of state;
2. repeatedly apply permutation;
3. squeeze output.

The capacity/rate split controls security/performance trade-offs.

Sponge designs support hashes, extendable-output functions, and domain-separated primitives.

## 8. Message Authentication Codes

A MAC authenticates a message using shared secret key:

\[
tag=MAC_K(m).
\]

The receiver recomputes/verifies tag.

### HMAC

HMAC safely turns a cryptographic hash into a keyed authentication construction using nested hashing and key pads.

### Contribution

Authentication is separate from confidentiality. Encryption alone does not necessarily detect malicious modification.

## 9. Pseudorandom Functions

A PRF family \(F_K(x)\) should be computationally indistinguishable from a random function to an adversary without key \(K\).

PRFs are foundational for:

- MACs;
- key derivation;
- stream ciphers;
- protocol key schedules.

## 10. Pseudorandom Permutations

A PRP is a keyed invertible permutation that appears random without the key.

Block ciphers such as AES are designed to approximate strong PRPs over fixed-size blocks.

## 11. Feistel Networks

Split input into halves and iterate keyed round functions. The Feistel structure creates invertibility even when the round function itself is not invertible.

Historical and conceptual importance: DES and many cipher designs use Feistel-like principles.

## 12. Substitution–Permutation Networks

Alternate nonlinear substitution and linear diffusion layers.

AES uses:

- SubBytes;
- ShiftRows;
- MixColumns;
- AddRoundKey.

### Foundation

Confusion + diffusion transform local key/data relationships into globally mixed ciphertext.

## 13. AES

AES operates on 128-bit blocks with 128/192/256-bit keys.

Important implementation topics:

- authenticated modes rather than raw ECB;
- side-channel-resistant implementations;
- hardware acceleration;
- nonce/IV requirements of modes.

Do not treat the block cipher as the full encryption scheme.

## 14. Stream Ciphers

Generate keystream \(z_i\) and combine with plaintext, often by XOR:

\[
c_i=m_i\oplus z_i.
\]

Security critically depends on never reusing the same keystream under conditions where reuse leaks relations between plaintexts.

ChaCha20 is a major modern software-oriented design.

## 15. Authenticated Encryption with Associated Data

AEAD simultaneously protects confidentiality and integrity while authenticating optional unencrypted metadata.

Interfaces:

\[
C,tag=Enc(K,nonce,plaintext,AAD).
\]

Common constructions:

- AES-GCM;
- ChaCha20-Poly1305.

### Foundation rule

Modern application encryption should generally use a well-reviewed AEAD construction instead of manually combining encryption and MAC algorithms.

## 16. Nonces

Many modes require a unique nonce per key. Nonce reuse can be catastrophic depending on construction.

System design therefore needs:

- counters;
- randomness with collision analysis;
- persistent state;
- key rotation;
- misuse-resistant schemes where appropriate.

Nonce management is a systems algorithm, not a footnote.

## 17. Key Derivation Functions

KDFs derive one or more keys from input key material.

### HKDF

Two-stage pattern:

```text
extract -> pseudorandom key
expand  -> context-specific derived keys
```

Domain/context labels enforce key separation.

## 18. Password Hashing

Passwords have low entropy and require deliberately expensive KDFs.

Algorithms:

- Argon2id;
- scrypt;
- PBKDF2 in compatibility contexts.

Key properties:

- unique salt;
- memory hardness where available;
- tunable time/memory parameters;
- optional pepper stored separately.

Fast hashes such as raw SHA-256 are unsuitable as password-storage algorithms.

## 19. Public-Key Encryption

Uses public key for encryption and private key for decryption.

Security requires randomized padding/encoding and robust schemes; textbook RSA is not secure deployment practice.

## 20. RSA Foundation

RSA uses modular exponentiation:

\[
c=m^e\bmod N,
\qquad m=c^d\bmod N.
\]

Its security is related to difficulty of factoring large composite modulus under classical attacks.

Modern RSA uses standardized padding such as OAEP for encryption and PSS for signatures.

## 21. Diffie–Hellman Key Exchange

Two parties agree on a shared secret over an insecure channel using exponentiation in a group:

\[
A=g^a,\quad B=g^b,
\quad K=g^{ab}.
\]

Unauthenticated DH is vulnerable to active man-in-the-middle attacks; protocols authenticate the exchange.

## 22. Elliptic-Curve Cryptography

ECC uses groups of points on elliptic curves.

Scalar multiplication:

\[
Q=kP
\]

is easy; recovering \(k\) from \(P,Q\) is assumed hard classically for suitable curves.

ECC provides smaller keys than classical finite-field systems at comparable classical security levels.

## 23. X25519

X25519 is a widely used elliptic-curve Diffie–Hellman function designed around Curve25519 and robust implementation conventions.

Its importance is not merely mathematical; API design and resistance to common implementation pitfalls are part of secure algorithm engineering.

## 24. Digital Signatures

A signature scheme has:

- key generation;
- signing;
- verification.

Security usually targets existential unforgeability under chosen-message attack.

Major classical families:

- RSA-PSS;
- ECDSA;
- EdDSA/Ed25519.

## 25. ECDSA and nonce safety

ECDSA uses per-signature nonce \(k\). Reusing or biasing \(k\) can reveal the private key.

This illustrates a general rule:

> randomness generation is part of the cryptographic algorithm.

Deterministic nonce-generation schemes can reduce dependence on external entropy for some signature constructions.

## 26. EdDSA

EdDSA uses Edwards curves and deterministic signing structure, designed for efficient and safer implementation than many traditional elliptic-curve interfaces.

## 27. KEM–DEM Hybrid Encryption

A Key Encapsulation Mechanism produces a shared symmetric key; a Data Encapsulation Mechanism/AEAD encrypts bulk data.

```text
public-key/KEM
 -> shared secret
 -> KDF
 -> AEAD bulk encryption
```

This is the standard architecture behind both classical and post-quantum hybrid encryption.

## 28. Forward Secrecy

Ephemeral key exchange ensures compromise of long-term authentication key does not automatically decrypt previously recorded sessions.

This matters in TLS-like protocols and messaging systems.

## 29. Key Rotation and Crypto Agility

Algorithms age. Systems need mechanisms to:

- identify algorithms/versions;
- rotate keys;
- migrate ciphertexts/certificates;
- negotiate safely;
- disable deprecated algorithms;
- support hybrid transitions.

Crypto agility is becoming especially important for post-quantum migration.

## 30. Merkle Trees

Hash leaves and recursively hash pairs to obtain a root commitment.

Proof size is logarithmic in number of leaves.

Applications:

- transparency logs;
- content integrity;
- distributed systems;
- hash-based signatures;
- verifiable data structures;
- zero-knowledge systems.

## 31. Commitments

A commitment scheme has:

- hiding — commitment conceals value;
- binding — committer cannot change value later.

Commitments are building blocks for zero-knowledge proofs, protocols, and secure computation.

## 32. Secret Sharing

Shamir secret sharing represents secret \(s\) as constant term of random polynomial of degree \(t-1\):

\[
f(x)=s+a_1x+\cdots+a_{t-1}x^{t-1}.
\]

Any \(t\) shares reconstruct by interpolation; fewer reveal no information in the information-theoretic idealization.

## 33. Randomness and CSPRNGs

Cryptographic randomness requires unpredictable state evolution, not merely statistical uniformity.

Systems require:

- secure entropy collection;
- DRBG/CSPRNG construction;
- reseeding policy;
- fork/process safety;
- protection of generator state.

## 34. Constant-Time Programming

Even mathematically secure algorithms can leak keys through runtime or microarchitectural behavior.

Constant-time implementation avoids branches/memory accesses depending on secret data where feasible.

This connects cryptographic engineering to side-channel analysis.

## 35. Security composition

A secure primitive can become insecure when composed incorrectly.

Examples of design questions:

- encrypt-then-MAC vs ad hoc combinations;
- domain separation;
- key reuse;
- nonce reuse;
- transcript binding;
- downgrade prevention;
- replay protection.

Protocol security is a composition problem.

## 36. Formal protocol models

Security protocols can be studied through:

- symbolic/Dolev–Yao models;
- computational proofs;
- state machines;
- model checking;
- protocol verification tools.

The protocol transcript itself should be treated as state subject to adversarial scheduling.

## 37. Combination research map

```text
ECDH/KEM + HKDF + AEAD
  -> secure channel core

Merkle tree + digital signatures
  -> transparency / append-only integrity

Secret sharing + threshold signatures
  -> distributed trust

CSPRNG + signature nonce generation
  -> secure randomness-dependent signing

Formal verification + protocol state machine
  -> checked cryptographic protocol implementation

Classical + post-quantum KEM
  -> hybrid migration strategy
```

## 38. Primary references

- Katz & Lindell, *Introduction to Modern Cryptography*.
- Boneh & Shoup, *A Graduate Course in Applied Cryptography*.
- NIST FIPS 197 (AES).
- NIST SHA-2/SHA-3 standards.
- RFC 5869 (HKDF).
- RFC 8439 (ChaCha20-Poly1305).
- RFC 7748 (X25519/X448).
- RFC 8032 (EdDSA).
- Argon2 / Password Hashing Competition specification.

## 39. Research questions

- How should crypto-agile systems migrate algorithms without downgrade vulnerabilities?
- Can formal verification become routine for protocol state machines and key schedules?
- Which misuse-resistant interfaces most reduce real-world cryptographic failure?
- How should cryptographic libraries expose hardware/side-channel constraints without making APIs unsafe?
- Can adaptive systems detect nonce/key-management failures before catastrophic compromise?