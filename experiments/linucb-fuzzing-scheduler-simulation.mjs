const BASE_SEED = 20261002;
const RUNS = 40;
const HORIZON = 4000;
const DRIFT_AT = 2000;
const ACTIONS = 4;
const DIMENSIONS = 3;
const ALPHA = 0.65;
const RIDGE = 1;

const THETA_PRE = [
  [0.10, 1.05, -0.35],
  [-0.05, -0.55, 1.10],
  [0.00, 0.55, 0.60],
  [-0.15, -0.15, -0.70],
];

const THETA_POST = [
  [-0.10, -0.70, 0.95],
  [0.10, 0.95, -0.45],
  [-0.05, -0.30, -0.75],
  [0.00, 0.45, 0.75],
];

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(rng) {
  const u1 = Math.max(rng(), 1e-12);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function gamma(shape, rng) {
  if (shape < 1) {
    return gamma(shape + 1, rng) * Math.pow(Math.max(rng(), 1e-12), 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    const x = normal(rng);
    const v0 = 1 + c * x;
    if (v0 <= 0) continue;
    const v = v0 * v0 * v0;
    const u = rng();
    if (u < 1 - 0.0331 * x ** 4) return d * v;
    if (Math.log(Math.max(u, 1e-12)) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function beta(alpha, betaParam, rng) {
  const x = gamma(alpha, rng);
  const y = gamma(betaParam, rng);
  return x / (x + y);
}

function logistic(value) {
  return 1 / (1 + Math.exp(-value));
}

function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += a[i] * b[i];
  return sum;
}

function matVec(matrix, vector) {
  return matrix.map((row) => dot(row, vector));
}

function identity(size, scale = 1) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => (row === col ? scale : 0)),
  );
}

function shermanMorrisonUpdate(inverse, x) {
  const ax = matVec(inverse, x);
  const denom = 1 + dot(x, ax);
  return inverse.map((row, i) => row.map((value, j) => value - (ax[i] * ax[j]) / denom));
}

function argmax(values) {
  let best = 0;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i] > values[best]) best = i;
  }
  return best;
}

function entropy(counts) {
  const total = counts.reduce((sum, value) => sum + value, 0);
  if (!total) return 0;
  let result = 0;
  for (const count of counts) {
    if (!count) continue;
    const p = count / total;
    result -= p * Math.log(p);
  }
  return result;
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sampleSd(values) {
  if (values.length <= 1) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - m) ** 2, 0) / (values.length - 1));
}

function makeLinearPolicy(alpha = 0) {
  const inverse = Array.from({ length: ACTIONS }, () => identity(DIMENSIONS, 1 / RIDGE));
  const b = Array.from({ length: ACTIONS }, () => Array(DIMENSIONS).fill(0));
  return {
    choose(context) {
      const scores = inverse.map((aInv, action) => {
        const theta = matVec(aInv, b[action]);
        const prediction = dot(theta, context);
        if (!alpha) return prediction;
        const ax = matVec(aInv, context);
        return prediction + alpha * Math.sqrt(Math.max(dot(context, ax), 0));
      });
      return argmax(scores);
    },
    update(action, context, reward) {
      inverse[action] = shermanMorrisonUpdate(inverse[action], context);
      for (let i = 0; i < DIMENSIONS; i += 1) b[action][i] += reward * context[i];
    },
  };
}

function makeUcbPolicy() {
  const counts = Array(ACTIONS).fill(0);
  const means = Array(ACTIONS).fill(0);
  let t = 0;
  return {
    choose() {
      t += 1;
      const unseen = counts.findIndex((count) => count === 0);
      if (unseen !== -1) return unseen;
      return argmax(means.map((value, action) => value + Math.sqrt((2 * Math.log(t)) / counts[action])));
    },
    update(action, _context, reward) {
      counts[action] += 1;
      means[action] += (reward - means[action]) / counts[action];
    },
  };
}

function makeThompsonPolicy(rng) {
  const alpha = Array(ACTIONS).fill(1);
  const betaParam = Array(ACTIONS).fill(1);
  return {
    choose() {
      return argmax(alpha.map((a, action) => beta(a, betaParam[action], rng)));
    },
    update(action, _context, reward) {
      alpha[action] += reward;
      betaParam[action] += 1 - reward;
    },
  };
}

function contextAt(envRng, step) {
  const progress = step / (HORIZON - 1);
  const x1 = 2 * envRng() - 1;
  const x2 = Math.max(-1, Math.min(1, 0.65 * (2 * progress - 1) + 0.35 * (2 * envRng() - 1)));
  return [1, x1, x2];
}

function probabilities(context, step) {
  const theta = step < DRIFT_AT ? THETA_PRE : THETA_POST;
  return theta.map((weights) => logistic(dot(weights, context)));
}

function runPolicy(name, policy, contexts, probabilitiesByStep, potentialRewards, actionRng) {
  const rewards = [];
  const expectedRegrets = [];
  const counts = Array(ACTIONS).fill(0);

  for (let step = 0; step < HORIZON; step += 1) {
    const context = contexts[step];
    const probs = probabilitiesByStep[step];
    const action = name === "uniform" ? Math.floor(actionRng() * ACTIONS) : policy.choose(context);
    const reward = potentialRewards[step][action];
    policy?.update?.(action, context, reward);
    rewards.push(reward);
    counts[action] += 1;
    expectedRegrets.push(Math.max(...probs) - probs[action]);
  }

  const after = rewards.slice(DRIFT_AT);
  return {
    meanReward: mean(rewards),
    preDriftReward: mean(rewards.slice(0, DRIFT_AT)),
    postDriftReward: mean(after),
    first500PostDriftReward: mean(after.slice(0, 500)),
    last500PostDriftReward: mean(after.slice(-500)),
    expectedRegretPerStep: mean(expectedRegrets),
    actionEntropy: entropy(counts),
  };
}

function runSeed(seed) {
  const envRng = mulberry32(seed);
  const contexts = [];
  const probabilitiesByStep = [];
  const potentialRewards = [];

  for (let step = 0; step < HORIZON; step += 1) {
    const context = contextAt(envRng, step);
    const probs = probabilities(context, step);
    contexts.push(context);
    probabilitiesByStep.push(probs);
    potentialRewards.push(probs.map((p) => (envRng() < p ? 1 : 0)));
  }

  const policies = {
    uniform: { policy: null, rng: mulberry32(seed ^ 0x11111111) },
    ucb1: { policy: makeUcbPolicy(), rng: null },
    thompson: { policy: makeThompsonPolicy(mulberry32(seed ^ 0x22222222)), rng: null },
    greedyLinear: { policy: makeLinearPolicy(0), rng: null },
    linucb: { policy: makeLinearPolicy(ALPHA), rng: null },
  };

  return Object.fromEntries(
    Object.entries(policies).map(([name, entry]) => [
      name,
      runPolicy(name, entry.policy, contexts, probabilitiesByStep, potentialRewards, entry.rng),
    ]),
  );
}

function summarize(seedResults) {
  const policyNames = Object.keys(seedResults[0]);
  const metrics = [
    "meanReward",
    "preDriftReward",
    "postDriftReward",
    "first500PostDriftReward",
    "last500PostDriftReward",
    "expectedRegretPerStep",
    "actionEntropy",
  ];
  return Object.fromEntries(
    policyNames.map((name) => [
      name,
      Object.fromEntries(
        metrics.map((metric) => {
          const values = seedResults.map((result) => result[name][metric]);
          return [metric, { mean: mean(values), sd: sampleSd(values) }];
        }),
      ),
    ]),
  );
}

function round(value) {
  return Number(value.toFixed(6));
}

function roundSummary(summary) {
  return Object.fromEntries(
    Object.entries(summary).map(([policy, metrics]) => [
      policy,
      Object.fromEntries(
        Object.entries(metrics).map(([metric, value]) => [metric, { mean: round(value.mean), sd: round(value.sd) }]),
      ),
    ]),
  );
}

export function runExperiment() {
  const seedResults = Array.from({ length: RUNS }, (_, index) => runSeed(BASE_SEED + index));
  const summary = roundSummary(summarize(seedResults));
  return {
    experimentId: "linucb-fuzzing-scheduler-drift-pilot",
    configuration: {
      baseSeed: BASE_SEED,
      runs: RUNS,
      horizon: HORIZON,
      driftAt: DRIFT_AT,
      actions: ACTIONS,
      contextDimensions: DIMENSIONS,
      linucbAlpha: ALPHA,
      ridgeLambda: RIDGE,
    },
    summary,
    interpretation: {
      linucbRewardLiftVsUcb1: round(summary.linucb.meanReward.mean - summary.ucb1.meanReward.mean),
      linucbRewardLiftVsThompson: round(summary.linucb.meanReward.mean - summary.thompson.meanReward.mean),
      linucbPostDriftLiftVsUcb1: round(summary.linucb.postDriftReward.mean - summary.ucb1.postDriftReward.mean),
      linucbPostDriftLiftVsThompson: round(summary.linucb.postDriftReward.mean - summary.thompson.postDriftReward.mean),
      linucbRegretReductionVsUcb1: round(summary.ucb1.expectedRegretPerStep.mean - summary.linucb.expectedRegretPerStep.mean),
      linucbRegretReductionVsThompson: round(summary.thompson.expectedRegretPerStep.mean - summary.linucb.expectedRegretPerStep.mean),
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(runExperiment(), null, 2));
}
