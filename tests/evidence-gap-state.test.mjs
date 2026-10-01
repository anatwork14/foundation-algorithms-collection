import assert from "node:assert/strict";
import test from "node:test";
import {
  deriveEvidenceGapKeys,
  suggestedEvidenceGapTask,
} from "../lib/evidence-gap-state.ts";

test("a completely unrecorded algorithm exposes the expected archive gaps", () => {
  assert.deepEqual(
    deriveEvidenceGapKeys({
      primarySources: 0,
      claims: 0,
      implementations: 0,
      experiments: 0,
      resultExperiments: 0,
      independentEvaluations: 0,
    }),
    ["primary-source", "curated-claim", "implementation", "experiment", "independent-evaluation"],
  );
});

test("an experiment protocol without a result exposes result rather than experiment as the gap", () => {
  const gaps = deriveEvidenceGapKeys({
    primarySources: 1,
    claims: 1,
    implementations: 1,
    experiments: 1,
    resultExperiments: 0,
    independentEvaluations: 0,
  });

  assert.equal(gaps.includes("experiment"), false);
  assert.equal(gaps.includes("result"), true);
  assert.equal(gaps.includes("independent-evaluation"), true);
});

test("a result-bearing experiment clears both protocol and result gaps", () => {
  assert.deepEqual(
    deriveEvidenceGapKeys({
      primarySources: 2,
      claims: 1,
      implementations: 1,
      experiments: 2,
      resultExperiments: 1,
      independentEvaluations: 1,
    }),
    [],
  );
});

test("suggested task follows the archive's provenance-first curation order", () => {
  assert.match(suggestedEvidenceGapTask(["primary-source", "experiment"]), /primary paper|normative standard/i);
  assert.match(suggestedEvidenceGapTask(["curated-claim", "implementation"]), /Markdown passage/i);
  assert.match(suggestedEvidenceGapTask(["implementation", "independent-evaluation"]), /immutable upstream revision/i);
  assert.equal(suggestedEvidenceGapTask([]), null);
});
