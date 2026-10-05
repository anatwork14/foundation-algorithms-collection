import assert from "node:assert/strict";
import test from "node:test";

import {
  implementationUpstreamReviewState,
  upstreamReviewsForImplementation,
} from "../lib/implementation-upstream-reviews.ts";
import { getImplementation } from "../lib/implementations.ts";

const cases = [
  {
    id: "z3-sat-smt",
    observedCommit: "0f985010a6dd3d263a4c0fc82afeaf5ef12adbc7",
    paths: [["src/solver/solver.cpp", "8dd352579fad471522c7aa383b3aa55e6311b9dd"]],
  },
  {
    id: "statsmodels-kalman-filter",
    observedCommit: "15d85ecd4e9daa67820f7c8318e7c8d578b21d5f",
    paths: [
      ["statsmodels/tsa/statespace/kalman_filter.py", "5b195f874c8344378bbbad74d0203b33480b5d83"],
      ["LICENSE.txt", "47cd54eec489af242da0e1a9fe00f1ed15cf2e69"],
    ],
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
    assert.equal(review.observedCommit, item.observedCommit);
    assert.equal(review.decision, "Retain pin");
    assert.equal(review.materialChange, false);
    assert.deepEqual(
      review.inspectedPaths.map((path) => [path.path, path.pinnedBlob, path.upstreamBlob, path.changed]),
      item.paths.map(([path, blob]) => [path, blob, blob, false]),
    );
    assert.equal(implementationUpstreamReviewState(review, review.observedCommit), "Reviewed — retain pin");
  });
}
