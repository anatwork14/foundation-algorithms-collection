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
  test(`${item.id} preserves append-only retain-pin reviews across unchanged tracked-source inspections`, () => {
    const implementation = getImplementation(item.id);
    assert.ok(implementation);

    const reviews = upstreamReviewsForImplementation(item.id);
    assert.equal(reviews.length, 5);
    assert.deepEqual(reviews.map((review) => review.revision), [1, 2, 3, 4, 5]);
    assert.deepEqual(
      reviews.map((review) => review.observedCommit),
      [
        "fc695b3ea18cb62d839658fd919217227a919855",
        "b8ef86910433c789ad8d22111e51c941283d05d7",
        "cf2cd3d06f8381f5503ccba4afbae7386f6d4e70",
        "6b3607efa40bd0093e58fb887c87cf724a057491",
        "086c61b685c0b264267f33b2642fb20c2ea794d7",
      ],
    );

    for (const review of reviews) {
      assert.equal(review.pinnedCommit, implementation.verifiedCommit);
      assert.equal(review.decision, "Retain pin");
      assert.equal(review.materialChange, false);
      assert.deepEqual(
        review.inspectedPaths.map((path) => [path.path, path.pinnedBlob, path.upstreamBlob, path.changed]),
        [[item.path, item.blob, item.blob, false]],
      );
    }

    const latest = reviews.at(-1);
    assert.ok(latest);
    assert.equal(implementationUpstreamReviewState(latest, latest.observedCommit), "Reviewed — retain pin");
    assert.equal(
      implementationUpstreamReviewState(latest, reviews[1].observedCommit),
      "Review available",
    );
  });
}
