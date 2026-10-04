import test from "node:test";
import assert from "node:assert/strict";
import { implementations } from "../lib/implementations.ts";
import {
  implementationUpstreamReviews,
  implementationUpstreamReviewState,
  latestUpstreamReviewForImplementation,
  validateImplementationUpstreamReviews,
} from "../lib/implementation-upstream-reviews.ts";

test("curated upstream-review ledger validates against the live implementation catalog", () => {
  assert.deepEqual(validateImplementationUpstreamReviews(implementationUpstreamReviews, implementations), []);
});

test("Faiss HNSW upstream review retains the immutable pin after byte-identical source inspection", () => {
  const implementation = implementations.find((record) => record.id === "faiss-hnsw");
  const review = latestUpstreamReviewForImplementation("faiss-hnsw");

  assert.ok(implementation);
  assert.ok(review);
  assert.equal(review.revision, 1);
  assert.equal(review.reviewedAt, "2026-10-05");
  assert.equal(review.observedRef, "main");
  assert.equal(review.observedCommit, "b0074a3fa426027d9ff8575b44386d5922859ac9");
  assert.equal(review.pinnedCommit, implementation.verifiedCommit);
  assert.equal(review.pinnedCommit, "e7c44eb000bebb16f84be38a115caa5d333a8229");
  assert.equal(review.decision, "Retain pin");
  assert.equal(review.materialChange, false);
  assert.deepEqual(review.inspectedPaths.map((item) => item.path), ["faiss/IndexHNSW.h", "faiss/IndexHNSW.cpp"]);
  assert.ok(review.inspectedPaths.every((item) => item.changed === false));
  assert.ok(review.inspectedPaths.every((item) => item.pinnedBlob === item.upstreamBlob));
});

test("upstream-review status distinguishes an exact reviewed head from later branch movement", () => {
  const review = latestUpstreamReviewForImplementation("faiss-hnsw");
  assert.ok(review);
  assert.equal(
    implementationUpstreamReviewState(review, "b0074a3fa426027d9ff8575b44386d5922859ac9"),
    "Reviewed — retain pin",
  );
  assert.equal(
    implementationUpstreamReviewState(review, "f".repeat(40)),
    "Review available",
  );
  assert.equal(implementationUpstreamReviewState(review, null), null);
});
