# 32 — Zero-Knowledge Proofs and Verifiable Computation

Zero-knowledge systems let a prover convince a verifier that a statement is true without revealing more information than necessary about the witness. Modern proof systems also support succinct verification of large computations.

## 1. Core properties

A proof system aims for:

- completeness — honest proofs of true statements verify;
- soundness — false statements are rejected except with small probability;
- zero knowledge — verifier learns nothing beyond validity, under the formal definition used;
- succinctness — in many modern systems, proofs and verification can be much smaller/faster than re-running the computation.

## 2. Witness relations

Represent statement \(x\) and secret witness \(w\) with relation:

\[
R(x,w)=1.
\]

The prover demonstrates knowledge of a valid \(w\) without revealing it.

Examples:

- knowledge of a private key;
- valid transaction balance constraints;
- correct execution of a program;
- membership in a committed set.

## 3. Sigma Protocols

Three-move structure:

```text
prover commitment
 -> verifier challenge
 -> prover response
```

Important properties often include special soundness and honest-verifier zero knowledge.

Sigma protocols are foundational because many identification and proof-of-knowledge constructions reduce to this pattern.

## 4. Fiat–Shamir Transform

Replace an interactive random verifier challenge with a cryptographic hash of the transcript:

\[
c=H(statement,commitment,context).
\]

This produces non-interactive proofs/signatures in the random-oracle model under appropriate assumptions.

Transcript/domain separation is critical to prevent cross-protocol attacks.

## 5. Commitments

A commitment provides hiding and binding.

Zero-knowledge protocols frequently commit to values before challenges are known.

Common foundations:

- hash commitments;
- Pedersen commitments;
- polynomial commitments.

## 6. Pedersen Commitments

For group generators \(g,h\):

\[
C=g^m h^r.
\]

They are additively homomorphic in exponents and provide perfect hiding under standard setup assumptions.

Useful for range proofs and arithmetic relations.

## 7. Arithmetic Circuits

Programs are translated into additions/multiplications over a finite field.

The verification problem becomes:

> prove that a set of wire values satisfies all gate constraints.

This translation is one of the key costs of practical proof systems.

## 8. R1CS

Rank-1 Constraint Systems express constraints:

\[
\langle A_i,z\rangle\cdot\langle B_i,z\rangle=\langle C_i,z\rangle.
\]

The vector \(z\) includes public inputs, private witness values, and intermediate wires.

R1CS is a common intermediate representation for SNARK systems.

## 9. Polynomialization

Many proof systems convert circuit satisfaction into polynomial identities.

Core idea:

```text
many local constraints
 -> one/few global polynomial identities
 -> random evaluation checks
```

This is where algebra, coding theory, FFT/NTT, and commitments converge.

## 10. Schwartz–Zippel Principle

Two different low-degree polynomials agree at a random field point only with limited probability.

This gives efficient randomized checking of polynomial identities and is a core soundness ingredient in many proof systems.

## 11. Polynomial Commitments

Commit to polynomial \(f(X)\), then later prove claims such as:

\[
f(z)=y.
\]

Desired properties:

- compact commitment;
- efficient opening proof;
- binding;
- batch/multi-point support.

Families include:

- KZG;
- inner-product-based commitments;
- FRI/Merkle-based commitments.

## 12. KZG Commitments

KZG uses pairings and a structured reference string to produce constant-size commitments/opening proofs.

### Strength

Very compact proofs.

### Trade-off

Requires trusted/structured setup assumptions and pairing-friendly curves.

## 13. Merkle Trees as commitments

Merkle roots commit to many values using hashes. Openings include a logarithmic authentication path.

This provides a transparent foundation for STARK/FRI-style systems without pairing-based trusted setup.

## 14. SNARKs

Succinct Non-interactive Arguments of Knowledge aim for short proofs and fast verification.

Important families:

- Groth16;
- PLONK-family systems;
- Marlin-like systems;
- lookup-heavy modern arithmetizations.

The important foundation is not one protocol name but:

```text
computation -> algebraic constraints -> commitment -> random challenge -> succinct proof
```

## 15. Groth16

A pairing-based zk-SNARK with very small proofs and fast verification.

Trade-offs:

- circuit-specific trusted setup in canonical form;
- elliptic-curve pairing assumptions;
- setup ceremony complexity.

## 16. PLONK

PLONK introduced universal/updatable setup approaches and permutation arguments enabling flexible wiring constraints.

Key ideas:

- polynomial IOP structure;
- permutation/grand-product argument;
- quotient polynomials;
- polynomial commitments.

## 17. Lookup Arguments

Instead of implementing complex operations bit-by-bit, prove that values belong to a precomputed table.

Useful for:

- range checks;
- byte operations;
- hash/circuit acceleration;
- VM instruction tables.

Lookups are now a major arithmetization design primitive.

## 18. STARKs

Scalable Transparent Arguments of Knowledge rely mainly on hashes, polynomial low-degree testing, and Merkle commitments.

### Contribution

Avoid pairing-based trusted setup and offer post-quantum-friendly cryptographic assumptions at the cost of larger proofs.

## 19. FRI

Fast Reed-Solomon Interactive Oracle Proof of Proximity tests whether a function is close to a low-degree polynomial.

Repeated folding reduces degree/domain size while preserving soundness evidence.

### Foundation connection

```text
error-correcting codes
 + polynomial evaluation
 + Merkle commitments
 + random sampling
 = transparent proof system
```

## 20. AIR

Algebraic Intermediate Representation expresses computation traces through transition constraints and boundary constraints.

This is natural for virtual machines and sequential computations.

## 21. Interactive Oracle Proofs

IOPs let verifiers query encoded prover messages at selected positions rather than reading everything.

They generalize PCP-style probabilistic checking and underpin STARK-like systems.

## 22. Sumcheck Protocol

Proves claims about sums of a multivariate polynomial over the Boolean hypercube:

\[
S=\sum_{x\in\{0,1\}^n}g(x).
\]

The verifier reduces an exponentially large sum to a sequence of univariate checks and one final evaluation.

Sumcheck is increasingly central in modern proof-system design.

## 23. GKR Protocol

The Goldwasser–Kalai–Rothblum protocol verifies layered arithmetic circuits using sumcheck and multilinear extensions.

It is a foundational example of delegating large computations with much cheaper verification.

## 24. Multilinear Extensions

A table over Boolean vectors is extended to a multilinear polynomial over a field.

This representation supports efficient random evaluation and sumcheck-style verification.

## 25. Recursive Proofs

A proof verifies another proof inside its own circuit.

Applications:

- proof aggregation;
- blockchain rollups;
- long-running verifiable computation;
- incremental computation;
- proof-carrying state.

## 26. Incrementally Verifiable Computation

Maintain a compact proof that a computation has advanced correctly one step at a time.

This is a natural foundation for persistent verified agents/services.

## 27. Folding Schemes

Folding combines multiple constraint instances into a smaller recursive accumulator rather than generating a fresh expensive SNARK at every step.

Modern IVC research uses folding to reduce recursive-proof overhead.

## 28. Range Proofs

Prove committed value lies in interval without revealing it.

Applications:

- confidential transactions;
- private credentials;
- bounded-resource claims.

Bulletproofs use inner-product arguments and avoid trusted setup, with proof size growing logarithmically with range/aggregation dimensions.

## 29. Set Membership and Merkle Proofs

Prove an item belongs to a committed set using Merkle paths or accumulator constructions.

Zero-knowledge wrappers can hide which member was proven.

## 30. Verifiable ML

Goal: prove that a model inference or training-related computation followed specified rules.

Challenges:

- neural networks contain many multiplications;
- nonlinear activation representation;
- floating-point arithmetic is expensive in fields;
- model size;
- private model vs private input requirements.

Approaches:

- quantized integer circuits;
- lookup tables;
- specialized arithmetizations;
- polynomial approximations;
- proof aggregation.

## 31. zkVMs

A zero-knowledge virtual machine proves execution of general-purpose instruction traces.

Pipeline:

```text
program execution trace
 -> algebraic constraints
 -> polynomial commitment/proof
 -> verifier
```

zkVMs trade specialized circuit efficiency for programmability.

## 32. Proof-System Design Dimensions

Compare:

- proof size;
- prover time;
- verifier time;
- memory;
- trusted setup;
- post-quantum assumptions;
- recursion cost;
- arithmetization flexibility;
- hardware acceleration;
- field/curve compatibility.

There is no universally best proof system.

## 33. Soundness and Knowledge Soundness

“Verifier accepts” must imply more than accidental algebraic consistency. Knowledge-sound systems formalize that a successful prover effectively knows a valid witness under the assumed model.

Security assumptions and extractor definitions should be explicit in serious research.

## 34. Zero-Knowledge Simulation

Zero knowledge is proved by showing a simulator can generate a verifier view indistinguishable from a real interaction without knowing the witness.

This formalizes “learns nothing” much more precisely than intuitive secrecy claims.

## 35. Trusted Setup

Some systems require public parameters generated with secret randomness that must be destroyed.

Design options:

- circuit-specific setup;
- universal setup;
- updatable multi-party ceremonies;
- transparent setup using public randomness/hash assumptions.

## 36. Hardware Acceleration

Prover cost is dominated by operations such as:

- FFT/NTT;
- multi-scalar multiplication;
- hashing;
- field arithmetic;
- Merkle-tree construction.

GPU/FPGA/ASIC optimization can change system-level algorithm choices.

## 37. Combination research map

```text
ZK proof + ML inference
  -> verifiable private AI

ZK + MPC
  -> private computation with public correctness proof

Recursive proofs + event sourcing
  -> proof-carrying state machine

STARK + PQ hash assumptions
  -> transparent post-quantum-oriented verification

LLM/program synthesis + formal proof verifier
  -> generated computation with machine-checked evidence

Zero knowledge + credentials
  -> selective disclosure
```

## 38. Primary references

- Goldwasser, Micali & Rackoff, foundational zero-knowledge work.
- Fiat & Shamir, interactive-to-noninteractive transform.
- Groth, *On the Size of Pairing-based Non-interactive Arguments* (Groth16).
- Gabizon, Williamson & Ciobotaru, PLONK.
- Ben-Sasson et al., STARK/FRI literature.
- Thaler, *Proofs, Arguments, and Zero-Knowledge*.
- Bulletproofs paper by Bünz et al.
- GKR verifiable computation work.

## 39. Research questions

- Can proof systems make large AI inference routinely verifiable at acceptable cost?
- Which arithmetizations best support sparse/quantized neural networks?
- Can recursive proof systems provide tamper-evident long-term memory for autonomous agents?
- How should proof systems migrate to post-quantum assumptions without extreme prover costs?
- Can compilers automatically choose among R1CS, lookup-heavy, AIR, and multilinear arithmetizations based on workload structure?