# 11 — Neural Architectures: Attention, Transformers, State-Space Models, Mixture of Experts, and Graph Neural Networks

This chapter studies architecture-level algorithms that define how information moves through modern learned systems. The emphasis is on reusable computational ideas rather than model brands.

## 1. Architectural viewpoint

A neural architecture specifies:

- what representation is stored at each layer or time step;
- which elements can communicate;
- how communication weights are computed;
- whether computation is dense, sparse, recurrent, convolutional, graph-structured, or conditional;
- how information is normalized and residualized;
- and how cost scales with sequence length, feature size, graph degree, or number of experts.

The key research question is often not “which model is best?” but:

> What communication pattern is appropriate for the dependency structure of the problem?

## 2. Multilayer Perceptrons

An MLP applies repeated affine transformations and nonlinearities:

\[
h_{l+1}=\sigma(W_l h_l+b_l).
\]

### Motivation

Approximate nonlinear functions from vector inputs.

### Contribution

With sufficient width/depth and suitable nonlinearities, MLPs are powerful universal approximators.

### Implementation concerns

- initialization;
- activation choice;
- normalization;
- residual connections;
- width/depth trade-offs;
- conditioning.

MLPs remain important even inside Transformers and GNNs because many architectures alternate communication layers with per-token/node feed-forward computation.

## 3. Convolution

A discrete convolution applies a shared local kernel:

\[
y[i]=\sum_k w[k]x[i-k].
\]

### Motivation

Exploit locality and translation structure.

### Contribution

Weight sharing reduces parameters while encoding a strong inductive bias.

### Extensions

- 1D/2D/3D convolution;
- dilated convolution;
- depthwise separable convolution;
- grouped convolution;
- transposed convolution;
- dynamic convolution.

Convolution remains relevant in vision, audio, sequence modeling, and hybrid architectures.

## 4. Recurrent Neural Networks

RNNs update a hidden state:

\[
h_t = f_\theta(h_{t-1},x_t).
\]

### Motivation

Represent variable-length sequential context using a fixed-size recurrent state.

### Contribution

The same transition function is reused across time.

### Limitations

- sequential computation limits parallelism;
- long-range gradients can vanish or explode;
- finite hidden state can become an information bottleneck.

LSTM and GRU architectures introduce gates to improve memory retention.

## 5. Attention

### Motivation

A sequence element should be able to selectively retrieve information from other elements rather than compressing all history into one recurrent state.

### Scaled dot-product attention

Given queries \(Q\), keys \(K\), and values \(V\):

\[
\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V.
\]

### Contribution

Attention makes communication content-addressable. A query determines which keys are relevant, then aggregates their values.

### Interpretation

Attention can be viewed as:

- differentiable retrieval;
- learned kernel smoothing;
- message passing on a dense graph;
- associative memory;
- a dynamic weighted sum.

## 6. Multi-Head Attention

Instead of one attention map, multiple heads operate in learned subspaces:

\[
\mathrm{MHA}(Q,K,V)=\mathrm{Concat}(head_1,\ldots,head_h)W^O.
\]

Different heads can specialize in different relations, although head interpretability should not be assumed automatically.

## 7. Causal Attention

For autoregressive prediction, position \(t\) must not attend to future positions. A triangular mask enforces:

\[
A_{t,j}=0 \quad \text{for } j>t.
\]

This simple masking rule is the algorithmic bridge from bidirectional representation learning to next-token generation.

## 8. Cross-Attention

Queries come from one stream while keys/values come from another. This supports:

- encoder-decoder models;
- image-text models;
- retrieval-augmented generation;
- multimodal fusion;
- tool/state conditioning.

## 9. Transformer Block

A common block is:

```text
input
  -> normalization
  -> attention
  -> residual
  -> normalization
  -> MLP
  -> residual
```

Exact ordering differs across architectures.

### Contribution

Transformers remove mandatory recurrent dependence and allow broad parallel computation over sequence positions during training.

### Complexity

Dense self-attention over sequence length \(n\) generally requires \(O(n^2)\) pairwise attention scores, motivating sparse, local, kernelized, compressed, and state-space alternatives.

## 10. Positional Information

Attention alone is permutation-equivariant. Sequence order must be encoded.

Methods include:

- sinusoidal positional encodings;
- learned absolute positions;
- relative position biases;
- rotary positional embeddings;
- ALiBi-style biases.

The research issue is not only order representation but extrapolation to longer contexts.

## 11. KV Caching

During autoregressive inference, previous key/value projections can be cached rather than recomputed.

### Motivation

Without caching, generation repeatedly recomputes representations of the same prefix.

### Contribution

KV caching turns much prefix computation into reusable state.

### Trade-offs

- memory grows with context length;
- cache quantization can reduce footprint;
- grouped/multi-query attention can reduce duplicated key/value state;
- eviction/compression strategies become important in very long contexts.

## 12. Sparse and Local Attention

Restrict the attention graph rather than connecting every pair.

Patterns:

- sliding windows;
- block sparse attention;
- strided/global tokens;
- routing-based sparsity;
- retrieval-selected attention.

### Research question

Can the sparse connectivity preserve all dependencies needed by the task while reducing memory and compute?

## 13. Linear Attention

Some attention approximations rewrite the operation using kernel features:

\[
\mathrm{softmax}(QK^T)V \approx \phi(Q)(\phi(K)^T V).
\]

Associativity can reduce sequence scaling under certain formulations.

The key caveat is that changing the attention kernel changes model behavior, not only implementation cost.

## 14. FlashAttention as an algorithmic systems contribution

FlashAttention preserves exact attention semantics while reorganizing computation to reduce expensive memory traffic through tiling and online softmax techniques.

### Foundation idea

The asymptotic arithmetic may be similar, but IO complexity matters. A mathematically identical algorithm can become dramatically faster when it minimizes reads/writes between memory hierarchy levels.

This is an important cross-cutting lesson for the entire collection.

## 15. State-Space Models

A continuous linear state-space system can be written:

\[
\dot h(t)=Ah(t)+Bx(t),
\qquad
y(t)=Ch(t)+Dx(t).
\]

After discretization:

\[
h_t=\bar A h_{t-1}+\bar Bx_t,
\qquad y_t=Ch_t+Dx_t.
\]

### Motivation

Represent long sequences using recurrent state with structured linear dynamics.

### Contribution

Structured state-space models connect control theory, recurrence, convolution, and modern sequence learning.

### Computational duality

Many linear state-space models can be evaluated either:

- recurrently, useful for streaming inference;
- or as a convolution, useful for parallel training.

## 16. Structured SSMs

S4-type methods parameterize the state matrix to make long-range sequence modeling computationally tractable.

Core research ideas:

- stable continuous-time dynamics;
- special structured matrices;
- efficient convolution kernels;
- long-memory inductive bias.

## 17. Selective State-Space Models

Selective SSMs make parts of the state update input-dependent rather than fixed.

### Motivation

Purely linear time-invariant state updates cannot selectively retain/discard content in the same way attention can.

### Contribution

Content-dependent gating/selectivity gives recurrent state models adaptive memory behavior while retaining favorable sequence scaling.

### Combination ideas

- SSM + attention layers;
- SSM + retrieval;
- SSM + recurrent tool state;
- SSM + streaming sensor models.

## 18. Mixture of Experts

A mixture-of-experts model contains multiple expert networks and a router.

For token representation \(x\):

\[
p(e|x)=\mathrm{router}(x),
\]

then a subset of experts is selected.

### Motivation

Increase parameter capacity without executing every parameter for every input.

### Contribution

Conditional computation separates total model capacity from active computation per token.

## 19. Top-k Routing

The router chooses the highest-scoring \(k\) experts.

### Challenges

- expert imbalance;
- dropped tokens due to capacity limits;
- unstable routing;
- communication overhead across accelerators;
- expert collapse;
- router feedback loops.

### Load balancing

Auxiliary losses or routing constraints encourage tokens to distribute across experts.

## 20. Graph Neural Networks

Graph data consist of nodes \(V\), edges \(E\), and optional features.

A generic message-passing layer:

\[
m_v^{(l)}=\mathrm{AGG}\{\phi(h_v^{(l)},h_u^{(l)},e_{uv}):u\in N(v)\},
\]

\[
h_v^{(l+1)}=\psi(h_v^{(l)},m_v^{(l)}).
\]

### Motivation

Many systems are relational rather than grid- or sequence-structured.

### Contribution

GNNs generalize local aggregation to arbitrary graphs.

## 21. GCN

Graph convolutional networks aggregate normalized neighboring features. In matrix form, a common layer resembles:

\[
H^{(l+1)}=\sigma(\tilde D^{-1/2}\tilde A\tilde D^{-1/2}H^{(l)}W^{(l)}).
\]

This connects graph smoothing and representation learning.

## 22. GraphSAGE

GraphSAGE learns aggregation functions and can sample neighborhoods, enabling inductive inference on unseen nodes and scaling to larger graphs.

## 23. Graph Attention Networks

GAT learns neighbor weights using attention rather than fixed normalized adjacency weights.

This links the graph and Transformer families directly.

## 24. Graph Transformers

Graph Transformers generalize attention to graph-structured inputs using structural encodings such as:

- shortest-path distance;
- Laplacian eigenvectors;
- edge features;
- graph positional encodings;
- sparse neighborhood constraints.

## 25. Oversmoothing and Oversquashing

### Oversmoothing

Repeated aggregation can make node representations increasingly similar.

### Oversquashing

Information from exponentially growing neighborhoods may be compressed through small graph bottlenecks.

These are architectural, not merely optimization, limitations.

## 26. Architecture comparison

| Architecture | State/communication | Strength | Main cost/failure |
|---|---|---|---|
| MLP | dense vector transform | simple universal function approximation | ignores explicit structure |
| CNN | local shared kernels | locality/translation bias | fixed receptive geometry |
| RNN | recurrent state | streaming and compact memory | sequential bottleneck |
| Transformer | content-addressed global communication | flexible dependencies | quadratic dense attention cost |
| SSM | recurrent dynamical state | long sequences, streaming | state bottleneck/selectivity challenges |
| MoE | conditional expert routing | high capacity per active FLOP | routing and distributed communication |
| GNN | graph-local message passing | relational structure | oversmoothing/oversquashing/scaling |

## 27. Hybrid architectures

Promising combinations:

```text
Attention + convolution
  -> local inductive bias + global retrieval

Attention + SSM
  -> selective global access + efficient recurrent memory

MoE + Transformer
  -> conditional capacity

GNN + Transformer
  -> graph structure + flexible long-range communication

GNN + contextual bandit
  -> relational context for adaptive decisions

Retrieval + cross-attention
  -> external memory

SSM + event stream
  -> continuously updated compact state
```

## 28. Implementation checklist

For architecture research, measure:

- parameter count;
- active parameter count;
- FLOPs/token;
- memory traffic;
- activation memory;
- KV/state memory;
- training throughput;
- inference latency;
- communication volume across devices;
- scaling with sequence length or graph size;
- quality at equal compute budget;
- degradation under longer-than-training contexts.

## 29. Primary references

- Hochreiter & Schmidhuber, *Long Short-Term Memory* (1997).
- Vaswani et al., *Attention Is All You Need* (2017).
- Dao et al., *FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness* (2022).
- Gu et al., *Efficiently Modeling Long Sequences with Structured State Spaces* (S4, 2021).
- Gu & Dao, *Mamba: Linear-Time Sequence Modeling with Selective State Spaces* (2023).
- Shazeer et al., *Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer* (2017).
- Kipf & Welling, *Semi-Supervised Classification with Graph Convolutional Networks* (2016).
- Hamilton et al., *Inductive Representation Learning on Large Graphs* (2017).
- Veličković et al., *Graph Attention Networks* (2017).

## 30. Research questions

- When should a system use explicit retrieval instead of larger attention context?
- Can recurrent state and attention be dynamically selected per token?
- How should MoE routers account for uncertainty, cost, latency, and expert reliability?
- Can graph topology be learned jointly with message passing without introducing unstable shortcuts?
- What architecture best supports persistent agent memory under bounded compute?
- Can contextual bandits route between architecture modules online?