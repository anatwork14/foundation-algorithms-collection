import assert from "node:assert/strict";
import test from "node:test";

import {
  implementationUpstreamReviewState,
  upstreamReviewsForImplementation,
} from "../lib/implementation-upstream-reviews.ts";
import { getImplementation } from "../lib/implementations.ts";

const cases = [
  {
    id: "botorch-bayesian-optimization",
    observedCommit: "0b6dc20ed81b5767767036a50c997059d103bf34",
    paths: [
      ["botorch/acquisition/analytic.py", "dcdbe605ef5bf140c7cb31df30ed26e7b9e19a99"],
      ["LICENSE", "b93be90515ccd0b9daedaa589e42bf5929693f1f"],
    ],
  },
  {
    id: "scip-branch-and-bound",
    observedCommit: "e61d097a1bbe7051f2d75dcc5f0dc8cd740c9731",
    paths: [
      ["README.md", "0764bab0f2af1b8de8c0249cb22387cfbaa6e86c"],
      ["src/scip/scip_branch.c", "528a9948daf34b1cfa7fa9d43115bc5168dbdd82"],
      ["src/scip/tree.c", "3c3fc6cfd05119bda244f8d014ea72d5fea9c1ff"],
      ["src/scip/primal.c", "287a661472b7d118a3ee0b24970e2fe65d9457e9"],
      ["LICENSE", "d645695673349e3947e8e5ae42332d0ac3164cd7"],
    ],
  },
  {
    id: "dao-flash-attention-2",
    observedCommit: "47e91f1f7dd8a22649cee0dd9a182b69ffe782ef",
    paths: [
      ["flash_attn/__init__.py", "ebf8176e25fc7c17f14c7b94de4013677fb836a9"],
      ["flash_attn/flash_attn_interface.py", "1edab572c1f81ae6fd13bf1c43cf9e022c531adc"],
      ["tests/test_flash_attn.py", "a728e1192bd4aafcee21ec06d2d4bb4004d2e7b5"],
      ["README.md", "2c9b7ac83a7d22edfd7ff97c55ae0185b894b6c5"],
      ["LICENSE", "5860e4b33f3d9d85fc636137c559331d51783a5b"],
    ],
  },
  {
    id: "pennylane-qsvt",
    observedCommit: "395906614c129028685274683326e33eac32bf73",
    paths: [
      ["pennylane/templates/subroutines/qsvt.py", "8a23f7ae3d2f40869222db1ef7e77dd3c4227d02"],
      ["tests/templates/subroutines/test_qsvt.py", "9f4d1e7d445b9d0ba48e837ff0dc7473e9dc5288"],
      ["LICENSE", "261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64"],
    ],
  },
];

for (const item of cases) {
  test(`${item.id} gains a first retain-pin review after unchanged tracked-source inspection`, () => {
    const implementation = getImplementation(item.id);
    assert.ok(implementation);

    const reviews = upstreamReviewsForImplementation(item.id);
    assert.equal(reviews.length, 1);
    const review = reviews[0];

    assert.equal(review.revision, 1);
    assert.equal(review.reviewedAt, "2026-10-06");
    assert.equal(review.observedCommit, item.observedCommit);
    assert.equal(review.pinnedCommit, implementation.verifiedCommit);
    assert.equal(review.decision, "Retain pin");
    assert.equal(review.materialChange, false);
    assert.deepEqual(
      review.inspectedPaths.map((path) => [path.path, path.pinnedBlob, path.upstreamBlob, path.changed]),
      item.paths.map(([path, blob]) => [path, blob, blob, false]),
    );
    assert.equal(implementationUpstreamReviewState(review, review.observedCommit), "Reviewed — retain pin");
  });
}
