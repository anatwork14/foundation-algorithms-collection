import assert from "node:assert/strict";
import test from "node:test";

import {
  implementationUpstreamReviews,
  implementationUpstreamReviewState,
  upstreamReviewsForImplementation,
} from "../lib/implementation-upstream-reviews.ts";
import { getImplementation } from "../lib/implementations.ts";

test("Qiskit phase-estimation upstream review retains the immutable pin after unchanged source inspection", () => {
  const implementation = getImplementation("qiskit-phase-estimation");
  assert.ok(implementation);

  const reviews = upstreamReviewsForImplementation("qiskit-phase-estimation");
  assert.equal(reviews.length, 1);
  const review = reviews[0];

  assert.equal(review.pinnedCommit, implementation.verifiedCommit);
  assert.equal(review.observedCommit, "91895b850b9f8ba466c4d4868af389e249a7c087");
  assert.equal(review.decision, "Retain pin");
  assert.equal(review.materialChange, false);
  assert.deepEqual(
    review.inspectedPaths.map((item) => [item.path, item.changed, item.pinnedBlob === item.upstreamBlob]),
    [
      ["qiskit/circuit/library/phase_estimation.py", false, true],
      ["test/python/circuit/library/test_phase_estimation.py", false, true],
    ],
  );
  assert.equal(implementationUpstreamReviewState(review, review.observedCommit), "Reviewed — retain pin");
});

test("Qiskit review remains part of the canonical append-only review ledger", () => {
  assert.ok(implementationUpstreamReviews.some((review) => review.implementationId === "qiskit-phase-estimation"));
});
