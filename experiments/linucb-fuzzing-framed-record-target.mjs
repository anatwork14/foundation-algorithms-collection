import { traceFramedRecord } from "./targets/framed-record-parser.mjs";

const BASE_SEED = 20261004;
const RUNS = 30;
const HORIZON = 1500;
const ACTIONS = 4;
const DIMENSIONS = 4;
const ALPHA = 0.8;
const RIDGE = 1;
const MAX_CORPUS = 128;

const ACTION_NAMES = ["bit-flip", "random-byte-overwrite", "dictionary-insert", "delete-range"];
const DICTIONARY = [
  [0x46, 0x41], [0x01], [0x02], [0x03],
  [0x50, 0x49, 0x4e, 0x47], [0x44, 0x41, 0x54, 0x41],
  [0x41, 0x55, 0x54, 0x48], [0x5a, 0x4b],
  [0x46, 0x55, 0x5a, 0x5a], [0x7b, 0x7d],
];

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function dot(a, b) {
  let sum = 0;
  for (let index = 0; index < a.length; index += 1) sum += a[index] * b[index];
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
  const denominator = 1 + dot(x, ax);
  return inverse.map((row, i) => row.map((value, j) => value - (ax[i] * ax[j]) / denominator));
}

function argmax(values) {
  let best = 0;
  for (let index = 1; index < values.length; index += 1) {
    if (values[index] > values[best]) best = index;
  }
  return best;
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sampleSd(values) {
  if (values.length <= 1) return 0;
  const average = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1));
}

function entropy(counts) {
  const total = counts.reduce((sum, value) => sum + value, 0);
  let result = 0;
  for (const count of counts) {
    if (!count) continue;
    const probability = count / total;
    result -= probability * Math.log(probability);
  }
  return result;
}

function makeLinUcbPolicy() {
  const inverse = Array.from({ length: ACTIONS }, () => identity(DIMENSIONS, 1 / RIDGE));
  const b = Array.from({ length: ACTIONS }, () => Array(DIMENSIONS).fill(0));
  return {
    choose(context) {
      const scores = inverse.map((aInverse, action) => {
        const theta = matVec(aInverse, b[action]);
        const ax = matVec(aInverse, context);
        return dot(theta, context) + ALPHA * Math.sqrt(Math.max(dot(context, ax), 0));
      });
      return argmax(scores);
    },
    update(action, context, reward) {
      inverse[action] = shermanMorrisonUpdate(inverse[action], context);
      for (let index = 0; index < DIMENSIONS; index += 1) b[action][index] += reward * context[index];
    },
  };
}

function makeUcb1Policy() {
  const counts = Array(ACTIONS).fill(0);
  const rewards = Array(ACTIONS).fill(0);
  let step = 0;
  return {
    choose() {
      step += 1;
      const unseen = counts.findIndex((count) => count === 0);
      if (unseen !== -1) return unseen;
      return argmax(rewards.map((value, action) => value + Math.sqrt((2 * Math.log(step)) / counts[action])));
    },
    update(action, _context, reward) {
      counts[action] += 1;
      rewards[action] += (reward - rewards[action]) / counts[action];
    },
  };
}

function mutate(parent, action, rng) {
  const bytes = Array.from(parent);
  if (action === 0) {
    if (bytes.length === 0) bytes.push(0);
    const index = Math.floor(rng() * bytes.length);
    bytes[index] ^= 1 << Math.floor(rng() * 8);
  } else if (action === 1) {
    if (bytes.length === 0) bytes.push(0);
    bytes[Math.floor(rng() * bytes.length)] = Math.floor(rng() * 256);
  } else if (action === 2) {
    const token = DICTIONARY[Math.floor(rng() * DICTIONARY.length)];
    const position = Math.floor(rng() * (bytes.length + 1));
    bytes.splice(position, 0, ...token);
    if (bytes.length > 48) bytes.splice(48);
  } else if (bytes.length <= 1) {
    bytes.push(Math.floor(rng() * 256));
  } else {
    const start = Math.floor(rng() * bytes.length);
    const available = Math.max(1, bytes.length - start);
    const count = 1 + Math.floor(rng() * Math.min(4, available));
    bytes.splice(start, count);
  }
  return Uint8Array.from(bytes);
}

function contextFor(parent, recentNoveltyRate) {
  const length = Math.min(parent.length, 48) / 48;
  const asciiRatio = Array.from(parent).filter((value) => value >= 32 && value <= 126).length / Math.max(1, parent.length);
  const magicDepth = (parent[0] === 0x46 ? 0.5 : 0) + (parent[1] === 0x41 ? 0.5 : 0);
  return [1, length, asciiRatio, 0.5 * magicDepth + 0.5 * recentNoveltyRate];
}

function initialCorpus() {
  return [
    Uint8Array.from([0x46]),
    Uint8Array.from([0x46, 0x41, 0x01, 0x00, 0x00, 0x06]),
    Uint8Array.from(Buffer.from("hello")),
  ];
}

function runPolicy(name, seed) {
  const salt = name === "linucb" ? 0x11111111 : name === "ucb1" ? 0x22222222 : 0x33333333;
  const rng = mulberry32(seed ^ salt);
  const policy = name === "linucb" ? makeLinUcbPolicy() : name === "ucb1" ? makeUcb1Policy() : null;
  const corpus = initialCorpus();
  const discoveredFeatures = new Set();
  const actionCounts = Array(ACTIONS).fill(0);
  const recentRewards = [];
  let acceptedInputs = 0;

  for (const seedInput of corpus) {
    for (const feature of traceFramedRecord(seedInput)) discoveredFeatures.add(feature);
  }

  for (let step = 0; step < HORIZON; step += 1) {
    const parent = corpus[Math.floor(rng() * corpus.length)];
    const recentNoveltyRate = recentRewards.length ? mean(recentRewards) : 0;
    const context = contextFor(parent, recentNoveltyRate);
    const action = name === "uniform" ? Math.floor(rng() * ACTIONS) : policy.choose(context);
    actionCounts[action] += 1;

    const child = mutate(parent, action, rng);
    const childFeatures = traceFramedRecord(child);
    const newFeatures = Array.from(childFeatures).filter((feature) => !discoveredFeatures.has(feature));
    const reward = newFeatures.length > 0 ? 1 : 0;
    policy?.update(action, context, reward);

    recentRewards.push(reward);
    if (recentRewards.length > 50) recentRewards.shift();

    if (reward) {
      acceptedInputs += 1;
      corpus.push(child);
      for (const feature of newFeatures) discoveredFeatures.add(feature);
      if (corpus.length > MAX_CORPUS) corpus.splice(3, 1);
    }
  }

  return {
    uniqueTraceFeatures: discoveredFeatures.size,
    acceptedInputs,
    noveltyRate: acceptedInputs / HORIZON,
    finalCorpusSize: corpus.length,
    actionEntropy: entropy(actionCounts),
  };
}

function summarize(seedResults) {
  const metrics = ["uniqueTraceFeatures", "acceptedInputs", "noveltyRate", "finalCorpusSize", "actionEntropy"];
  return Object.fromEntries(
    ["uniform", "ucb1", "linucb"].map((policy) => [
      policy,
      Object.fromEntries(metrics.map((metric) => {
        const values = seedResults.map((result) => result[policy][metric]);
        return [metric, { mean: mean(values), sd: sampleSd(values) }];
      })),
    ]),
  );
}

function round(value) {
  return Number(value.toFixed(6));
}

function roundSummary(summary) {
  return Object.fromEntries(Object.entries(summary).map(([policy, metrics]) => [
    policy,
    Object.fromEntries(Object.entries(metrics).map(([metric, value]) => [metric, { mean: round(value.mean), sd: round(value.sd) }])),
  ]));
}

export function runExperiment() {
  const seedResults = Array.from({ length: RUNS }, (_, index) => {
    const seed = BASE_SEED + index;
    return {
      uniform: runPolicy("uniform", seed),
      ucb1: runPolicy("ucb1", seed),
      linucb: runPolicy("linucb", seed),
    };
  });
  const summary = roundSummary(summarize(seedResults));
  return {
    experimentId: "linucb-fuzzing-framed-record-target-pilot",
    configuration: {
      baseSeed: BASE_SEED,
      runs: RUNS,
      horizon: HORIZON,
      actions: ACTIONS,
      contextDimensions: DIMENSIONS,
      linucbAlpha: ALPHA,
      ridgeLambda: RIDGE,
      maxCorpusSize: MAX_CORPUS,
      actionNames: ACTION_NAMES,
    },
    summary,
    interpretation: {
      linucbUniqueFeatureDeltaVsUniform: round(summary.linucb.uniqueTraceFeatures.mean - summary.uniform.uniqueTraceFeatures.mean),
      linucbUniqueFeatureDeltaVsUcb1: round(summary.linucb.uniqueTraceFeatures.mean - summary.ucb1.uniqueTraceFeatures.mean),
      linucbAcceptedInputDeltaVsUniform: round(summary.linucb.acceptedInputs.mean - summary.uniform.acceptedInputs.mean),
      linucbAcceptedInputDeltaVsUcb1: round(summary.linucb.acceptedInputs.mean - summary.ucb1.acceptedInputs.mean),
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(JSON.stringify(runExperiment(), null, 2));
