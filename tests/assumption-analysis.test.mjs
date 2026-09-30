import test from "node:test";
import assert from "node:assert/strict";
import { analyzeAssumptionCompatibility } from "../lib/assumption-analysis.ts";

test("finds shared controlled assumption concepts", () => {
  const result = analyzeAssumptionCompatibility(
    ["Reward uncertainty is represented with a confidence bound", "Observed feedback arrives after each action"],
    ["Posterior uncertainty remains calibrated", "Outcome feedback is available online"],
  );

  assert.ok(result.sharedConcepts.includes("uncertainty"));
  assert.ok(result.sharedConcepts.includes("feedback"));
});

test("flags only explicit rule-based assumption tensions", () => {
  const result = analyzeAssumptionCompatibility(
    ["The reward model is approximately linear in the context", "The environment is stationary"],
    ["The reward structure is strongly nonlinear", "Distribution drift is expected over time"],
  );

  assert.deepEqual(result.tensions.map((tension) => tension.id).sort(), ["linear-vs-nonlinear", "stationary-vs-drift"]);
  assert.match(result.tensions[0].leftEvidence + result.tensions[1].leftEvidence, /linear|stationary/i);
});

test("does not invent a conflict when no opposing rule matches", () => {
  const result = analyzeAssumptionCompatibility(
    ["Training data is informative about future search states"],
    ["The graph remains sparse enough for efficient traversal"],
  );

  assert.deepEqual(result.tensions, []);
});

test("negative-polarity terms do not also satisfy the positive side", () => {
  const result = analyzeAssumptionCompatibility(
    ["The process is non-stationary and the objective is non-convex"],
    ["Distribution drift is expected under a nonconvex objective"],
  );

  assert.deepEqual(result.tensions, []);
});

test("detects reversed-direction tensions symmetrically", () => {
  const result = analyzeAssumptionCompatibility(
    ["The system may contain malicious participants"],
    ["All participants are trusted"],
  );

  assert.equal(result.tensions.length, 1);
  assert.equal(result.tensions[0].id, "trusted-vs-adversarial");
  assert.match(result.tensions[0].leftEvidence, /malicious/i);
  assert.match(result.tensions[0].rightEvidence, /trusted/i);
});
