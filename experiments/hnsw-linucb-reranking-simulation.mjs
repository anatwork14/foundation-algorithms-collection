const BASE_SEED = 20260930;
const RUNS = 30;
const HISTORY = 800;
const HORIZON = 4000;
const DRIFT_AT = HORIZON / 2;
const ALPHA = 0.7;
const ACTIONS = 4;
const DIMENSIONS = 3;

const THETA_PRE = [
  [0.55, 0.25, -0.05],
  [0.50, -0.15, 0.25],
  [0.47, 0.15, 0.12],
  [0.42, -0.05, -0.12],
];

const THETA_POST = [
  [0.42, -0.20, 0.05],
  [0.45, 0.20, -0.18],
  [0.58, -0.10, 0.25],
  [0.52, 0.18, 0.05],
];

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function uniform(rng, min = -1, max = 1) {
  return min + (max - min) * rng();
}

function clamp(value, min = 0.05, max = 0.95) {
  return Math.max(min, Math.min(max, value));
}

function dot(left, right) {
  let total = 0;
  for (let index = 0; index < left.length; index += 1) total += left[index] * right[index];
  return total;
}

function identity(size) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => (row === column ? 1 : 0)),
  );
}

function zeroVector(size) {
  return Array(size).fill(0);
}

function cloneMatrix(matrix) {
  return matrix.map((row) => row.slice());
}

function addOuterProduct(matrix, vector) {
  for (let row = 0; row < DIMENSIONS; row += 1) {
    for (let column = 0; column < DIMENSIONS; column += 1) {
      matrix[row][column] += vector[row] * vector[column];
    }
  }
}

function addScaled(vector, feature, scale) {
  for (let index = 0; index < DIMENSIONS; index += 1) vector[index] += scale * feature[index];
}

function inverse3(matrix) {
  const [a, b, c] = matrix[0];
  const [d, e, f] = matrix[1];
  const [g, h, i] = matrix[2];

  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const D = -(b * i - c * h);
  const E = a * i - c * g;
  const F = -(a * h - b * g);
  const G = b * f - c * e;
  const H = -(a * f - c * d);
  const I = a * e - b * d;
  const determinant = a * A + b * B + c * C;

  if (Math.abs(determinant) < 1e-12) throw new Error("Simulation matrix became singular");

  return [
    [A, D, G],
    [B, E, H],
    [C, F, I],
  ].map((row) => row.map((value) => value / determinant));
}

function matrixVector(matrix, vector) {
  return matrix.map((row) => dot(row, vector));
}

function solve(matrix, vector) {
  return matrixVector(inverse3(matrix), vector);
}

function quadraticForm(inverse, vector) {
  return dot(vector, matrixVector(inverse, vector));
}

function argmax(values) {
  let bestIndex = 0;
  let bestValue = values[0];
  for (let index = 1; index < values.length; index += 1) {
    if (values[index] > bestValue) {
      bestIndex = index;
      bestValue = values[index];
    }
  }
  return bestIndex;
}

function entropy(counts) {
  const total = counts.reduce((sum, value) => sum + value, 0);
  return counts.reduce((sum, count) => {
    if (!count) return sum;
    const probability = count / total;
    return sum - probability * Math.log2(probability);
  }, 0);
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values) {
  const average = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1));
}

function round(value, digits = 6) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function runSeed(seed) {
  const rng = mulberry32(seed);
  const historicalMatrices = Array.from({ length: ACTIONS }, () => identity(DIMENSIONS));
  const historicalRewards = Array.from({ length: ACTIONS }, () => zeroVector(DIMENSIONS));

  // Historical randomized interactions are generated only from the pre-drift regime.
  for (let index = 0; index < HISTORY; index += 1) {
    const context = [1, uniform(rng), uniform(rng)];
    const action = Math.floor(rng() * ACTIONS);
    const probability = clamp(dot(context, THETA_PRE[action]));
    const reward = rng() < probability ? 1 : 0;
    addOuterProduct(historicalMatrices[action], context);
    addScaled(historicalRewards[action], context, reward);
  }

  const staticParameters = historicalMatrices.map((matrix, action) => solve(matrix, historicalRewards[action]));
  const greedyMatrices = historicalMatrices.map(cloneMatrix);
  const greedyRewards = historicalRewards.map((vector) => vector.slice());
  const linucbMatrices = historicalMatrices.map(cloneMatrix);
  const linucbRewards = historicalRewards.map((vector) => vector.slice());

  const policies = ["similarity", "staticLinear", "greedyOnline", "linucb"];
  const totals = Object.fromEntries(policies.map((policy) => [policy, 0]));
  const preDrift = Object.fromEntries(policies.map((policy) => [policy, 0]));
  const postDrift = Object.fromEntries(policies.map((policy) => [policy, 0]));
  const first500PostDrift = Object.fromEntries(policies.map((policy) => [policy, 0]));
  const last500PostDrift = Object.fromEntries(policies.map((policy) => [policy, 0]));
  const regret = Object.fromEntries(policies.map((policy) => [policy, 0]));
  const actionCounts = Object.fromEntries(policies.map((policy) => [policy, Array(ACTIONS).fill(0)]));
  let linucbVsGreedyActionDifference = 0;

  for (let step = 0; step < HORIZON; step += 1) {
    const context = [1, uniform(rng), uniform(rng)];
    const truth = step < DRIFT_AT ? THETA_PRE : THETA_POST;
    const probabilities = truth.map((parameters) => clamp(dot(context, parameters)));
    // Common random numbers make each policy face the same potential reward vector at this step.
    const rewards = probabilities.map((probability) => (rng() < probability ? 1 : 0));
    const oracleReward = Math.max(...probabilities);

    const similarity = 0; // fixed similarity order: candidate 0 always ranks first
    const staticLinear = argmax(staticParameters.map((parameters) => dot(context, parameters)));
    const greedyParameters = greedyMatrices.map((matrix, action) => solve(matrix, greedyRewards[action]));
    const greedyOnline = argmax(greedyParameters.map((parameters) => dot(context, parameters)));
    const linucb = argmax(
      linucbMatrices.map((matrix, action) => {
        const inverse = inverse3(matrix);
        const parameters = matrixVector(inverse, linucbRewards[action]);
        const uncertainty = Math.sqrt(Math.max(0, quadraticForm(inverse, context)));
        return dot(context, parameters) + ALPHA * uncertainty;
      }),
    );

    if (linucb !== greedyOnline) linucbVsGreedyActionDifference += 1;

    const selections = { similarity, staticLinear, greedyOnline, linucb };
    for (const policy of policies) {
      const action = selections[policy];
      const reward = rewards[action];
      totals[policy] += reward;
      actionCounts[policy][action] += 1;
      regret[policy] += oracleReward - probabilities[action];

      if (step < DRIFT_AT) preDrift[policy] += reward;
      else postDrift[policy] += reward;
      if (step >= DRIFT_AT && step < DRIFT_AT + 500) first500PostDrift[policy] += reward;
      if (step >= HORIZON - 500) last500PostDrift[policy] += reward;
    }

    addOuterProduct(greedyMatrices[greedyOnline], context);
    addScaled(greedyRewards[greedyOnline], context, rewards[greedyOnline]);
    addOuterProduct(linucbMatrices[linucb], context);
    addScaled(linucbRewards[linucb], context, rewards[linucb]);
  }

  const normalized = (source, denominator) =>
    Object.fromEntries(policies.map((policy) => [policy, source[policy] / denominator]));

  return {
    overallReward: normalized(totals, HORIZON),
    preDriftReward: normalized(preDrift, DRIFT_AT),
    postDriftReward: normalized(postDrift, HORIZON - DRIFT_AT),
    first500PostDriftReward: normalized(first500PostDrift, 500),
    last500PostDriftReward: normalized(last500PostDrift, 500),
    expectedRegretPerStep: normalized(regret, HORIZON),
    selectionEntropy: Object.fromEntries(policies.map((policy) => [policy, entropy(actionCounts[policy])])),
    linucbVsGreedyActionDifference: linucbVsGreedyActionDifference / HORIZON,
  };
}

export function runExperiment() {
  const runs = Array.from({ length: RUNS }, (_, index) => runSeed(BASE_SEED + index));
  const policies = ["similarity", "staticLinear", "greedyOnline", "linucb"];
  const metricNames = [
    "overallReward",
    "preDriftReward",
    "postDriftReward",
    "first500PostDriftReward",
    "last500PostDriftReward",
    "expectedRegretPerStep",
    "selectionEntropy",
  ];
  const aggregate = {};

  for (const metric of metricNames) {
    aggregate[metric] = {};
    for (const policy of policies) {
      const values = runs.map((run) => run[metric][policy]);
      aggregate[metric][policy] = {
        mean: round(mean(values)),
        sd: round(standardDeviation(values)),
      };
    }
  }

  const actionDifference = runs.map((run) => run.linucbVsGreedyActionDifference);
  aggregate.linucbVsGreedyActionDifference = {
    mean: round(mean(actionDifference)),
    sd: round(standardDeviation(actionDifference)),
  };

  return {
    experimentId: "hnsw-linucb-reranking-drift-pilot",
    pilot: "controlled sequential reranking simulator",
    generatedAt: "2026-09-30",
    configuration: {
      baseSeed: BASE_SEED,
      runs: RUNS,
      historicalInteractions: HISTORY,
      horizon: HORIZON,
      driftAt: DRIFT_AT,
      actions: ACTIONS,
      contextDimensions: 2,
      linucbAlpha: ALPHA,
      ridgeLambda: 1,
    },
    aggregate,
    interpretation: {
      linucbRewardLiftVsGreedy: round(aggregate.overallReward.linucb.mean - aggregate.overallReward.greedyOnline.mean),
      linucbPostDriftLiftVsGreedy: round(aggregate.postDriftReward.linucb.mean - aggregate.postDriftReward.greedyOnline.mean),
      linucbLatePostDriftLiftVsGreedy: round(aggregate.last500PostDriftReward.linucb.mean - aggregate.last500PostDriftReward.greedyOnline.mean),
      linucbRegretReductionVsGreedy: round(aggregate.expectedRegretPerStep.greedyOnline.mean - aggregate.expectedRegretPerStep.linucb.mean),
    },
  };
}

if (process.argv[1] && new URL(`file://${process.argv[1]}`).href === import.meta.url) {
  process.stdout.write(`${JSON.stringify(runExperiment(), null, 2)}\n`);
}
