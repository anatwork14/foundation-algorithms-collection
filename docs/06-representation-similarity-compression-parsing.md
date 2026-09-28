# 06 — Representation Learning, Similarity Search, Compression, Parsing, and Transformation Pipelines

A recurring lesson across computer science is that the representation often determines whether the downstream algorithm is easy or hard. This chapter covers methods that transform raw objects into useful structures: features, vectors, compressed codes, parse trees, and staged intermediate representations.

---

# 1. Representation as an Algorithmic Choice

## Motivation

Raw data rarely exposes the structure needed for efficient decisions.

Examples:

- text as bytes is difficult for semantic retrieval;
- source code as characters is difficult for static analysis;
- images as raw pixels do not directly expose object identity;
- user history as a list of events may not expose preferences;
- a complex task description may not expose its dependency graph.

A representation \(\phi(x)\) transforms object \(x\) into a form where relevant relationships become easier to compute.

## Contribution

The central question becomes:

> Which information should be preserved, discarded, separated, or made geometrically simple?

A strong representation can turn a difficult nonlinear decision into a simple linear one.

---

# 2. Hand-Engineered Features

## Motivation

Before learned representations, domain experts encoded useful properties directly.

Examples:

- term frequency in text;
- edge/shape descriptors in images;
- count of recent failures in monitoring;
- file type, dependency degree, and test coverage for software tasks.

## Contribution

Feature engineering injects prior knowledge and can be highly sample-efficient.

## Failure modes

- missing important interactions;
- brittle domain assumptions;
- costly maintenance;
- scaling/normalization inconsistencies;
- leakage of future information.

## Combination ideas

Hand-crafted and learned features can coexist. LinUCB and other online models often benefit from interpretable engineered features even when embeddings are also used.

---

# 3. Linear Representation and Dimensionality Reduction

## Principal Component Analysis (PCA)

### Motivation

High-dimensional features may be redundant and noisy.

### Contribution

PCA finds orthogonal directions of maximum variance. For centered data matrix \(X\), principal directions are eigenvectors of covariance or right singular vectors from SVD.

Projection onto top \(k\) components gives a low-dimensional approximation minimizing squared reconstruction error among linear rank-\(k\) projections.

### Implementation

Use SVD rather than explicitly constructing covariance for numerical robustness in many settings.

### Failure modes

- variance does not necessarily equal task relevance;
- linear structure only;
- sensitive to feature scaling;
- components may be hard to interpret.

### Combination ideas

- PCA before nearest-neighbor retrieval;
- PCA for visualization/diagnostics;
- PCA/whitening before online linear decision models.

---

# 4. Representation Learning

## Motivation

Instead of manually defining every useful feature, learn representations from data so relevant factors become easier for downstream algorithms.

Bengio, Courville, and Vincent describe representation learning as learning transformations that expose explanatory factors useful for tasks.

Reference: https://arxiv.org/abs/1206.5538

## Contribution

Deep networks learn layered transformations:

\[
h_1=f_1(x),\quad h_2=f_2(h_1),\ldots,z=f_L(h_{L-1}).
\]

The final representation \(z\) may organize semantically similar inputs near each other or make classes/values easier to predict.

## Research questions

- What invariances should the representation learn?
- What information should be discarded?
- Does the representation transfer across tasks?
- Is geometry meaningful under the chosen distance metric?
- How stable is it under distribution shift?

---

# 5. Autoencoders

## Motivation

Learn a compact representation without explicit labels.

Architecture:

\[
z=encoder(x),\qquad \hat x=decoder(z).
\]

Train to minimize reconstruction loss.

## Contribution

The bottleneck/regularization forces the model to encode structure that helps reconstruct input.

Variants:

- denoising autoencoders;
- sparse autoencoders;
- variational autoencoders.

## Failure mode

A representation that reconstructs well may not be useful for the target decision problem. Representation objectives and downstream objectives must be aligned.

---

# 6. Embeddings

## Motivation

Map discrete or complex objects into continuous vectors so similarity and algebraic operations become possible.

\[
object\rightarrow z\in\mathbb{R}^d.
\]

Examples:

- words;
- documents;
- images;
- users/items;
- source files/functions;
- products;
- graph nodes.

## Contribution

Embeddings convert symbolic matching into geometric retrieval.

The word2vec work demonstrated efficient learning of continuous word representations at large scale.

Reference: Mikolov et al., 2013: https://arxiv.org/abs/1301.3781

## Implementation considerations

- vector dimension;
- normalization;
- training objective;
- negative sampling or contrastive negatives;
- versioning;
- drift;
- domain adaptation.

An embedding model update can invalidate vector indexes and similarity thresholds, so embedding version must be stored with indexed vectors.

---

# 7. Metric Learning and Contrastive Learning

## Motivation

Generic embeddings may not organize objects according to the similarity needed by a specific application.

## Contribution

Train representation so positive pairs are close and negative pairs are separated.

A contrastive objective often compares a positive pair against many negatives using normalized similarities.

## Applications

- retrieval;
- face/object matching;
- recommendation;
- code similarity;
- duplicate detection.

## Combination ideas

Use a learned embedding for high-recall candidate retrieval, then a separate supervised or bandit ranker for final action selection.

---

# 8. Similarity Metrics

## Euclidean distance

\[
d(x,y)=\|x-y\|_2.
\]

Sensitive to magnitude and scale.

## Cosine similarity

\[
cos(x,y)=\frac{x^Ty}{\|x\|\|y\|}.
\]

Measures angle and is common for normalized semantic embeddings.

## Dot product

\[
s(x,y)=x^Ty.
\]

Magnitude affects score and is common in recommender models.

## Mahalanobis distance

\[
d_M(x,y)=\sqrt{(x-y)^TM(x-y)}.
\]

Allows anisotropic scaling/correlation.

## Critical lesson

A vector representation and metric are a pair. “Nearest” has no meaning without specifying the geometry.

---

# 9. Exact Nearest Neighbor Search

## Motivation

Given query vector \(q\), find

\[
\arg\min_{x_i} d(q,x_i).
\]

A brute-force scan costs roughly \(O(Nd)\) distance work per query.

For modest datasets this may be preferable: simple, exact, highly vectorizable, and easy to debug.

## Tree indexes

Structures such as k-d trees partition low-dimensional space and can prune regions. Performance often deteriorates in high dimensions due to the curse of dimensionality.

---

# 10. Approximate Nearest Neighbor (ANN) Search

## Motivation

For millions/billions of high-dimensional vectors, exact scanning may be too slow.

The goal becomes:

> retrieve neighbors with high recall at much lower latency/memory/compute cost.

This is an explicit approximation trade-off.

Key metrics:

- recall@K;
- query latency percentiles;
- queries per second;
- memory per vector;
- build/update cost.

---

# 11. Locality-Sensitive Hashing (LSH)

## Motivation

Ordinary hash functions intentionally destroy similarity. LSH constructs hash families where similar objects collide more often.

## Contribution

Map points into buckets so candidate comparisons are restricted to likely-near points.

Multiple hash tables amplify retrieval probability.

Conceptual structure:

```text
vector
  ↓ similarity-preserving hashes
bucket signatures
  ↓
candidate union
  ↓
exact rerank
```

## Trade-offs

More tables/probes increase recall but also memory and candidate work.

LSH is an important example of randomization + indexing + approximation.

---

# 12. HNSW — Hierarchical Navigable Small World Graphs

## Motivation

Graph-based nearest-neighbor methods exploit the idea that navigating neighbor-to-neighbor can quickly approach a query's neighborhood. A flat proximity graph can still require costly entry/search.

## Contribution

HNSW builds multiple graph layers. Higher layers contain progressively fewer nodes and provide long-distance navigation; lower layers provide local refinement.

Conceptually:

```text
sparse upper layer:  o---------o------o
                      \       /
mid layer:          o--o---o---o--o
                     \ |   |  /
dense base:        o-o-o-o-o-o-o-o-o
```

Search begins near the top and greedily descends toward better candidates, then performs a broader local search at the base layer.

Reference: Malkov and Yashunin: https://arxiv.org/abs/1603.09320

## Important parameters

### M

Controls graph connectivity / neighbors per node. Higher values improve graph quality/recall but consume more memory and build cost.

### efConstruction

Candidate breadth during index construction. Larger values generally improve index quality at higher build cost.

### efSearch

Candidate breadth at query time. Larger values generally improve recall at higher latency.

## Strengths

- strong recall/latency trade-off in many practical high-dimensional settings;
- incremental insertion;
- metric-flexible graph approach.

## Weaknesses

- significant memory overhead;
- deletions/updates require engineering care;
- performance depends on data distribution and parameter tuning;
- approximate, not exact.

## Combination ideas

- HNSW retrieval → cross-encoder/ranker;
- HNSW → LinUCB among retrieved actions;
- HNSW → constraint filter → optimizer;
- quantization to reduce vector memory before/around HNSW.

---

# 13. Product Quantization (PQ)

## Motivation

Storing full floating-point vectors can dominate memory and memory bandwidth.

## Contribution

Split vectors into subvectors and quantize each subvector using a learned codebook. Store compact code indices instead of full vectors.

Distance can be approximated through lookup tables.

## Trade-off

Compression saves memory and can accelerate distance computation, but introduces quantization error.

## Combination ideas

Inverted-file coarse partition + PQ compressed vectors is a classic large-scale ANN architecture.

---

# 14. Two-Stage and Multi-Stage Retrieval

A foundational modern pattern is:

```text
large corpus
    ↓ cheap/high-recall retrieval
hundreds/thousands of candidates
    ↓ expensive reranking
small candidate set
    ↓ decision policy / business rules
final output
```

## Why this matters

Trying to run the most expensive model over the entire corpus is usually impossible. Candidate generation and final ranking optimize different objectives.

### Candidate stage

Prioritize recall and efficiency.

### Ranking stage

Prioritize precision, utility, calibration, or contextual reward.

### Decision stage

Enforce constraints and possibly explore.

This decomposition is especially important for contextual bandits: LinUCB should often rank a manageable candidate set, not scan millions of actions with full matrix operations.

---

# 15. Compression and Information Theory

## Motivation

Data contains redundancy. Compression finds shorter representations by exploiting predictable structure.

## Lossless compression

Original data can be recovered exactly.

Examples:

- Huffman coding;
- arithmetic/range coding;
- Lempel-Ziv families.

## Lossy compression

Some information is discarded in exchange for a much smaller representation.

Examples:

- image/video codecs;
- quantized embeddings;
- model weight quantization.

---

# 16. Entropy

For discrete random variable \(X\):

\[
H(X)=-\sum_x p(x)\log_2 p(x).
\]

Entropy measures expected information/uncertainty in an idealized coding sense.

Rare events carry more information:

\[
I(x)=-\log_2 p(x).
\]

## Contribution

Information theory links prediction and compression: if a model assigns high probability to what actually occurs, the event can be encoded with fewer bits.

This insight underlies modern probabilistic sequence modeling and language-model cross-entropy objectives.

Foundational reference: Claude Shannon, “A Mathematical Theory of Communication,” 1948.

---

# 17. Huffman Coding

## Motivation

Given symbol probabilities, assign shorter prefix codes to common symbols and longer codes to rare symbols.

## Contribution

Repeatedly merge the two least frequent symbols/subtrees. This greedy construction yields an optimal prefix code for the given symbol probabilities under the standard objective.

This is a canonical example of a greedy algorithm with a provable optimality structure.

---

# 18. Quantization

## Motivation

Represent values with fewer bits.

Examples:

- FP32 → FP16/BF16/INT8;
- continuous embedding → codebook index;
- scalar values → bins.

## Contribution

Quantization trades representation precision for:

- memory;
- bandwidth;
- cache efficiency;
- arithmetic throughput.

## Failure modes

- outlier ranges dominate scale;
- small but important values collapse;
- accumulated numerical error;
- calibration dataset not representative.

## Combination ideas

Quantization is particularly useful with ANN indexing and large neural models.

---

# 19. Parsing

## Motivation

A sequence of symbols may contain hierarchical structure. Parsing converts a flat sequence into a structured representation according to a grammar.

```text
characters
   ↓ lexer
tokens
   ↓ parser
syntax tree / AST
```

## Contribution

Parsing separates surface syntax from semantic processing.

Once an abstract syntax tree exists, downstream algorithms can operate on meaningful structure instead of characters.

Applications:

- compilers;
- interpreters;
- query languages;
- config formats;
- protocol parsing;
- source-code intelligence.

---

# 20. Finite Automata and Lexing

Regular languages can be recognized by finite-state machines.

A lexer often turns character sequences into tokens using deterministic finite automata derived from patterns/regular expressions.

This connects state machines directly to language processing.

---

# 21. Recursive-Descent Parsing

## Motivation

For suitable grammars, grammar productions can map directly to recursive functions.

Example grammar idea:

```text
expr   → term (('+' | '-') term)*
term   → factor (('*' | '/') factor)*
factor → NUMBER | '(' expr ')'
```

Functions `parse_expr`, `parse_term`, and `parse_factor` recursively mirror the grammar.

## Contribution

Readable implementation and direct control of error handling.

## Limitations

Left-recursive grammars require transformation or other parser techniques.

---

# 22. Dynamic-Programming Parsers

General context-free parsing can use dynamic programming over substrings/spans. The core idea resembles interval DP:

\[
DP[i,j,nonterminal]
\]

records whether/how substring \([i,j)\) can be generated.

This is another example where representation of subproblems creates a tractable algorithm from an exponential naive parse-tree search.

---

# 23. Abstract Syntax Trees and Intermediate Representations

## Motivation

Raw syntax includes many details irrelevant to optimization or execution.

## Contribution

An AST strips surface details and makes program structure explicit. Compilers often translate further into one or more intermediate representations (IRs).

Example:

```text
source
 ↓ tokens
AST
 ↓ semantic analysis
high-level IR
 ↓ optimization
lower-level IR
 ↓ code generation
machine code
```

## Why multiple IRs?

Different transformations want different properties.

- high-level IR preserves language semantics;
- SSA-like forms expose data dependencies;
- low-level IR exposes machine operations.

This is a strong general lesson for AI/system pipelines: one representation does not have to serve every stage.

---

# 24. Transformation Pipelines

## Motivation

Complex computation is often best understood as a chain of representations.

A robust pipeline makes each stage explicit:

```text
input
 ↓ normalize
structured form
 ↓ enrich
features/representation
 ↓ retrieve
candidates
 ↓ rank/optimize
selected action
 ↓ execute
observations
```

## Contribution

Pipelines allow:

- stage-specific testing;
- caching intermediate results;
- replacing one algorithm without rewriting everything;
- tracing information loss;
- parallelism;
- failure isolation.

## Failure modes

- hidden state between stages;
- schema/version mismatch;
- error amplification;
- representation drift;
- optimizing each stage independently against incompatible metrics.

---

# 25. Representation Learning + Bandits

This combination is particularly important.

## Linear contextual bandit

LinUCB assumes reward is approximately linear in supplied features:

\[
\mathbb{E}[r\mid x,a]\approx x_{t,a}^T\theta.
\]

If raw features are nonlinear, one approach is to learn a representation \(\phi(x,a)\), then run a linear bandit on top:

\[
\mathbb{E}[r]\approx \phi(x,a)^T\theta.
\]

This is conceptually the bridge toward deep contextual bandits.

## Research caution

If representation parameters change continually, the historical linear-bandit sufficient statistics were accumulated in an older feature space. Updating the representation without handling this mismatch can invalidate uncertainty estimates.

Possible strategies:

- freeze representation during online bandit learning;
- update representation slowly and periodically reset/recompute statistics;
- maintain replay data and rebuild features;
- use algorithms whose uncertainty machinery explicitly accounts for learned neural features.

---

# 26. Representation + Graphs

Objects can be represented both as vectors and graph nodes.

Hybrid systems can combine:

- embedding similarity for semantic closeness;
- graph edges for explicit relations/dependencies;
- graph search for structural constraints;
- vector search for fuzzy retrieval.

Example for software intelligence:

```text
query/task embedding
   ↓ vector retrieval
candidate files/functions
   ↓ dependency graph expansion
structurally related code
   ↓ rank / reason / act
```

This often outperforms using either vector similarity or graph traversal alone.

---

# 27. Compression + Search

Compression is not only storage optimization. It can change search architecture.

Examples:

- compressed posting lists reduce search I/O;
- vector quantization makes larger ANN indexes fit in memory;
- sketches permit fast approximate prefilters;
- compact signatures enable candidate generation.

A common multi-stage strategy:

```text
cheap compressed signature
      ↓ prefilter
compressed ANN score
      ↓ shortlist
full-precision rerank
```

---

# 28. Testing and Evaluation

For representation systems measure at least two layers.

## Intrinsic quality

- reconstruction error;
- neighbor coherence;
- retrieval recall;
- clustering/separation;
- compression distortion.

## Downstream quality

- task accuracy;
- reward/regret;
- decision latency;
- calibration;
- robustness.

A representation can look good intrinsically and still hurt the final objective.

For ANN systems benchmark:

- exact brute-force ground truth on a representative subset;
- recall@K;
- p50/p95/p99 latency;
- index memory;
- construction time;
- insertion/update performance;
- effect of deleted/stale vectors.

---

# 29. Implementation Checklist

Document:

- raw input schema;
- normalization;
- feature/embedding version;
- vector dimension and dtype;
- similarity metric;
- index algorithm and parameters;
- recall target;
- compression format;
- retraining cadence;
- rebuild strategy;
- parser/grammar version;
- intermediate schemas;
- compatibility rules;
- downstream objective.

Never silently mix embeddings produced by incompatible model versions unless explicitly designed for it.

---

# 30. References

- Bengio, Courville, Vincent, “Representation Learning: A Review and New Perspectives”: https://arxiv.org/abs/1206.5538
- Mikolov et al., “Efficient Estimation of Word Representations in Vector Space”: https://arxiv.org/abs/1301.3781
- Malkov and Yashunin, “Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs”: https://arxiv.org/abs/1603.09320
- Shannon, “A Mathematical Theory of Communication,” 1948: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
- Cormen et al., *Introduction to Algorithms*, 4th ed.: https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/
