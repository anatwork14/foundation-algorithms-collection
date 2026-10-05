import assert from "node:assert/strict";
import test from "node:test";

import {
  implementationUpstreamReviewState,
  upstreamReviewsForImplementation,
} from "../lib/implementation-upstream-reviews.ts";
import { getImplementation } from "../lib/implementations.ts";

const cases = [
  {
    id: "pytorch-adamw",
    path: "torch/optim/adamw.py",
    blob: "031f8540357d2c62c82b7111cd8b0924e6041510",
  },
  {
    id: "pytorch-multihead-attention",
    path: "torch/nn/modules/activation.py",
    blob: "533de4fa590109fe189f05747ee8f8f744819192",
  },
];

for (const item of cases) {
  test(`${item.id} retains its immutable pin after unchanged tracked-source inspection`, () => {
    const implementation = getImplementation(item.id);
    assert.ok(implementation);

    const reviews = upstreamReviewsForImplementation(item.id);
    assert.equal(reviews.length, 1);
    const review = reviews[0];

    assert.equal(review.pinnedCommit, implementation.verifiedCommit);
    assert.equal(review.observedCommit, "fc695b3ea18cb62d839658fd919217227a919855");
    assert.equal(review.decision, "Retain pin");
    assert.equal(review.materialChange, false);
    assert.deepEqual(
      review.inspectedPaths.map((path) => [path.path, path.pinnedBlob, path.upstreamBlob, path.changed]),
      [[item.path, item.blob, item.blob, false]],
    );
    assert.equal(implementationUpstreamReviewState(review, review.observedCommit), "Reviewed — retain pin");
  });
}
