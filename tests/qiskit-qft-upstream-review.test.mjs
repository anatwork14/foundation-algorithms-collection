import assert from "node:assert/strict";
import test from "node:test";

import {
  implementationUpstreamReviewState,
  upstreamReviewsForImplementation,
} from "../lib/implementation-upstream-reviews.ts";
import { getImplementation } from "../lib/implementations.ts";

test("Qiskit QFT upstream review retains the immutable pin after unchanged source inspection", () => {
  const implementation = getImplementation("qiskit-qft");
  assert.ok(implementation);

  const reviews = upstreamReviewsForImplementation("qiskit-qft");
  assert.equal(reviews.length, 2);
  assert.deepEqual(reviews.map((review) => review.revision), [1, 2]);
  const review = reviews.at(-1);
  assert.ok(review);

  assert.equal(review.pinnedCommit, implementation.verifiedCommit);
  assert.equal(review.observedCommit, "abe422d0ad6eb0e3acbb2f4160a0d336ed4d26cb");
  assert.equal(review.decision, "Retain pin");
  assert.equal(review.materialChange, false);
  assert.deepEqual(
    review.inspectedPaths.map((item) => [item.path, item.changed, item.pinnedBlob === item.upstreamBlob]),
    [["qiskit/circuit/library/basis_change/qft.py", false, true]],
  );
  assert.equal(implementationUpstreamReviewState(review, review.observedCommit), "Reviewed — retain pin");
});
