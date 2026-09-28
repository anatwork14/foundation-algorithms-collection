# 12 — Generative Models: Autoregressive, Variational, Adversarial, Diffusion, Score, and Flow Methods

Generative modeling asks a fundamental question: given data sampled from an unknown distribution, how can a system learn to represent, sample from, transform, or assign likelihood to that distribution?

This chapter organizes major generative algorithms by the mathematical object they learn and the computational process they use to generate new samples.

## 1. Core problem

Given samples:

\[
x_1,\ldots,x_n \sim p_{data}(x),
\]

learn a model \(p_\theta(x)\), an implicit sampler, a latent-variable model, or a transport process that approximates the data distribution.

Different families optimize different surrogates:

- exact or approximate likelihood;
- adversarial divergence;
- score matching;
- denoising objectives;
- velocity/vector fields;
- reconstruction plus regularization;
- autoregressive conditional likelihood.

## 2. Autoregressive Modeling

Factorize a joint distribution using the chain rule:

\[
p(x_1,\ldots,x_T)=\prod_{t=1}^{T}p(x_t|x_{<t}).
\]

### Motivation

A high-dimensional joint distribution is difficult to model directly. Conditional decomposition turns it into repeated next-element prediction.

### Contribution

Autoregressive modeling gives a normalized likelihood and a direct sequential sampler.

### Training

Teacher forcing exposes the true prefix during training:

\[
L(\theta)=-\sum_t\log p_\theta(x_t|x_{<t}).
\]

### Sampling

At inference:

1. compute distribution for next token/value;
2. choose/sample a next element;
3. append it to context;
4. repeat.

### Decoding algorithms

#### Greedy decoding

Choose:

\[
x_t=\arg\max_x p(x|x_{<t}).
\]

Fast but can make irreversible local mistakes.

#### Beam search

Maintain the top \(B\) partial sequences according to cumulative score.

Contribution: search over sequences rather than committing to one local maximum.

Failure modes:

- length bias;
- low diversity;
- beam width can increase generic outputs;
- score function may not match task utility.

#### Temperature

Modify logits \(z\):

\[
p_i \propto \exp(z_i/T).
\]

Lower \(T\) sharpens; higher \(T\) increases randomness.

#### Top-k sampling

Restrict sampling to the \(k\) most probable candidates.

#### Nucleus/top-p sampling

Choose the smallest set whose cumulative probability exceeds \(p\).

### Modern combination ideas

- autoregressive model + verifier;
- autoregressive model + retrieval;
- autoregressive model + constrained decoding;
- autoregressive model + MCTS;
- autoregressive model + speculative decoding;
- autoregressive model + external recurrent state.

## 3. Exposure Bias

Training conditions on gold prefixes while inference conditions on model-generated prefixes. Errors can therefore compound.

Mitigations:

- scheduled sampling variants;
- sequence-level objectives;
- preference/reward optimization;
- verifier-guided search;
- data generated from model rollouts.

## 4. Latent Variable Models

Introduce a latent variable \(z\):

\[
p_\theta(x)=\int p_\theta(x|z)p(z)dz.
\]

The latent variable can represent compressed factors of variation.

## 5. Variational Autoencoders

Exact posterior inference \(p(z|x)\) is often intractable. Introduce approximate posterior \(q_\phi(z|x)\).

The evidence lower bound:

\[
\log p_\theta(x)\ge
\mathbb E_{q_\phi(z|x)}[\log p_\theta(x|z)]
-D_{KL}(q_\phi(z|x)\|p(z)).
\]

### Motivation

Learn both a probabilistic latent representation and a generator.

### Contribution

Variational inference turns difficult marginal likelihood optimization into a tractable lower-bound objective.

### Reparameterization trick

For Gaussian latent variables:

\[
z=\mu_\phi(x)+\sigma_\phi(x)\odot\epsilon,
\quad \epsilon\sim\mathcal N(0,I).
\]

This moves stochasticity outside the differentiable parameter path.

### Failure modes

- posterior collapse;
- blurry reconstructions for some likelihood choices;
- mismatch between latent prior and aggregate posterior;
- ELBO trade-off can suppress useful information.

### Variants

- beta-VAE;
- conditional VAE;
- hierarchical VAE;
- vector-quantized VAE;
- importance-weighted autoencoder.

## 6. Generative Adversarial Networks

GANs train a generator \(G\) and discriminator \(D\) in a minimax game:

\[
\min_G\max_D
\mathbb E_{x\sim p_{data}}[\log D(x)]
+
\mathbb E_{z\sim p(z)}[\log(1-D(G(z)))].
\]

### Motivation

Avoid explicit likelihood modeling by learning through discrimination between real and generated samples.

### Contribution

Adversarial learning turns distribution matching into a game.

### Failure modes

- mode collapse;
- training instability;
- discriminator overpowering generator;
- difficult evaluation;
- non-convex/non-stationary optimization.

### Wasserstein GAN

Uses an Earth-Mover/Wasserstein objective under Lipschitz constraints to improve optimization behavior.

### Combination research

GAN ideas generalize beyond generation to adversarial domain adaptation, representation learning, and robust training.

## 7. Energy-Based Models

Define an unnormalized energy:

\[
p_\theta(x)=\frac{\exp(-E_\theta(x))}{Z_\theta}.
\]

### Contribution

The model can score configurations without requiring a direct normalized output layer.

### Difficulty

The partition function \(Z_\theta\) and sampling may be intractable.

Connections:

- contrastive divergence;
- score matching;
- diffusion models;
- structured prediction;
- Hopfield-like associative memory.

## 8. Score Matching

The score of a distribution is:

\[
s(x)=\nabla_x\log p(x).
\]

Instead of learning density values, learn the direction in input space that increases log-density.

### Contribution

The score does not depend on the unknown normalization constant.

## 9. Denoising Score Matching

Corrupt clean data with noise and train a network to recover the score of the noisy distribution.

The denoising task provides a practical way to learn gradients of log density across different noise scales.

## 10. Diffusion Models

### Forward process

Gradually add noise:

\[
q(x_t|x_{t-1})=\mathcal N(\sqrt{1-\beta_t}x_{t-1},\beta_t I).
\]

With suitable schedule:

\[
x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\epsilon.
\]

### Reverse process

Learn to reverse the noising process:

\[
p_\theta(x_{t-1}|x_t).
\]

### Noise-prediction objective

A common objective predicts \(\epsilon\):

\[
L=\mathbb E\|\epsilon-\epsilon_\theta(x_t,t)\|^2.
\]

### Contribution

Generation becomes iterative denoising from a simple noise distribution toward the data distribution.

### Strengths

- stable training relative to adversarial objectives;
- flexible conditional generation;
- strong sample quality;
- clear probabilistic connections to score matching/SDEs.

### Costs

Naive sampling requires many denoising evaluations.

## 11. DDIM and Accelerated Sampling

Deterministic or partially stochastic trajectories can reuse a trained diffusion model while reducing sampling steps.

This illustrates an important principle:

> training process and sampling process can be decoupled.

## 12. Classifier Guidance and Classifier-Free Guidance

### Classifier guidance

Use gradients from an external classifier to bias samples toward a condition.

### Classifier-free guidance

Train conditional and unconditional predictions and combine them during sampling.

This gives a controllable fidelity/diversity trade-off.

## 13. Score-Based SDE View

Diffusion can be formulated through stochastic differential equations. A forward SDE transforms data to noise; a reverse-time SDE uses the score to transform noise back into data.

### Contribution

This unifies discrete diffusion schedules and continuous stochastic dynamics.

## 14. Probability Flow ODE

A corresponding deterministic ODE can share marginal distributions with the stochastic diffusion process under suitable conditions.

This connects diffusion models with continuous normalizing flows and numerical ODE solvers.

## 15. Normalizing Flows

Learn an invertible mapping:

\[
x=f_\theta(z),\qquad z\sim p(z).
\]

By change of variables:

\[
\log p(x)=\log p(z)-\log\left|\det\frac{\partial f}{\partial z}\right|.
\]

### Motivation

Obtain exact likelihood and exact invertible sampling.

### Constraint

Architecture must make Jacobian determinant tractable.

Families:

- coupling flows;
- autoregressive flows;
- residual flows;
- continuous normalizing flows.

## 16. Continuous Normalizing Flows

Define dynamics:

\[
\frac{dx}{dt}=v_\theta(x,t).
\]

Density evolves according to the divergence of the vector field.

### Contribution

Transforms can be defined continuously through an ODE instead of finite invertible layers.

## 17. Flow Matching

### Motivation

Instead of simulating stochastic diffusion during training, directly learn a vector field that transports samples along a chosen probability path.

Train:

\[
v_\theta(x_t,t)\approx u_t(x_t),
\]

where \(u_t\) is a target conditional velocity field.

### Contribution

Generative learning becomes supervised regression onto transport velocities.

### Why foundational

Flow matching creates a bridge among:

- optimal transport;
- continuous normalizing flows;
- diffusion/score models;
- ODE solvers;
- deterministic generation.

## 18. Rectified Flow

A rectified-flow approach chooses simple approximately straight paths between source and target distributions and learns the corresponding velocity field.

Research objective: reduce path curvature so numerical integration can use fewer steps.

## 19. Optimal Transport Connection

The Wasserstein distance between distributions can be framed as minimizing transportation cost.

Generative transport methods increasingly exploit the geometry of moving probability mass rather than only matching pointwise reconstruction or adversarial discrimination.

## 20. Discrete Generative Models

Not all data are continuous.

Approaches include:

- autoregressive categorical models;
- masked-token models;
- discrete diffusion;
- absorbing-state diffusion;
- edit-based models;
- latent discrete code models.

The transition operator must respect discrete state structure.

## 21. Multimodal Generative Modeling

A multimodal generator must align or jointly model multiple domains:

\[
p(text,image,audio,video,action,\ldots).
\]

Architectural patterns:

- modality-specific encoders + shared latent space;
- cross-attention;
- unified tokenization;
- diffusion conditioned on language embeddings;
- autoregressive multimodal token streams.

## 22. Evaluation

Generative models should not be evaluated by one metric.

Dimensions:

- likelihood where meaningful;
- sample fidelity;
- diversity/coverage;
- calibration;
- mode dropping;
- conditional alignment;
- semantic consistency;
- safety;
- memorization/privacy leakage;
- sampling latency;
- energy and compute cost.

## 23. Research comparison matrix

| Family | Likelihood | Sampling | Main advantage | Main challenge |
|---|---|---|---|---|
| Autoregressive | exact conditional factorization | sequential | strong discrete modeling | slow sequential generation |
| VAE | variational bound | fast latent decode | structured latent representation | posterior/decoder trade-offs |
| GAN | implicit | fast | sharp generation | unstable game, mode collapse |
| Normalizing flow | exact | direct/invertible | exact density | architectural constraints |
| Diffusion | variational/score-based | iterative | stable high-quality generation | many sampling steps |
| Flow matching | transport/vector field | ODE integration | direct velocity learning | path/solver design |

## 24. Combination research

```text
Autoregressive + diffusion
  -> discrete planning with continuous refinement

VAE + diffusion
  -> latent diffusion; cheaper generation in compressed space

Flow matching + optimal transport
  -> geometry-aware probability transport

Generative model + verifier
  -> propose-and-check generation

Generative model + retrieval
  -> external factual memory

Diffusion + control
  -> trajectory/policy generation

World model + generative latent dynamics
  -> imagined planning
```

## 25. Implementation checklist

For each generative model record:

- data representation;
- exact training objective;
- noise/path schedule;
- network parameterization;
- conditioning mechanism;
- sampler/solver;
- number of function evaluations;
- quality vs. diversity metrics;
- memory/compute costs;
- mode coverage;
- out-of-distribution behavior;
- reproducibility under random seeds.

## 26. Primary references

- Kingma & Welling, *Auto-Encoding Variational Bayes* (2013).
- Goodfellow et al., *Generative Adversarial Nets* (2014).
- Arjovsky et al., *Wasserstein GAN* (2017).
- Rezende & Mohamed, *Variational Inference with Normalizing Flows* (2015).
- Dinh et al., *Density Estimation using Real NVP* (2016).
- Ho et al., *Denoising Diffusion Probabilistic Models* (2020).
- Song et al., *Score-Based Generative Modeling through Stochastic Differential Equations* (2020).
- Song et al., *Denoising Diffusion Implicit Models* (2020).
- Lipman et al., *Flow Matching for Generative Modeling* (2022).
- Liu et al., *Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow*.

## 27. Research questions

- Can one unified transport formulation efficiently handle continuous, discrete, and multimodal data?
- How should samplers dynamically allocate computation based on sample difficulty?
- Can bandit algorithms choose decoding/sampling strategies online?
- Can uncertainty estimates distinguish creative diversity from model ignorance?
- Can verifier-guided generative search outperform pure scaling at equal compute?
- What is the best interface between world models and explicit planning algorithms?