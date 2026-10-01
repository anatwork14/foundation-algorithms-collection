import test from "node:test";
import assert from "node:assert/strict";
import {
  implementationFreshnessState,
  parseGitHubRepository,
} from "../lib/implementation-freshness.ts";

test("GitHub repository parser accepts canonical repository URLs", () => {
  assert.deepEqual(parseGitHubRepository("https://github.com/facebookresearch/faiss"), {
    owner: "facebookresearch",
    repo: "faiss",
  });
  assert.deepEqual(parseGitHubRepository("https://github.com/nmslib/hnswlib.git"), {
    owner: "nmslib",
    repo: "hnswlib",
  });
});

test("GitHub repository parser rejects non-repository and non-GitHub URLs", () => {
  assert.equal(parseGitHubRepository("https://example.com/project"), null);
  assert.equal(parseGitHubRepository("https://github.com/facebookresearch/faiss/tree/main"), null);
  assert.equal(parseGitHubRepository("not-a-url"), null);
});

test("freshness state distinguishes unchanged, moved, and unavailable refs", () => {
  const pinned = "a".repeat(40);
  assert.equal(implementationFreshnessState(pinned, pinned.toUpperCase()), "Current");
  assert.equal(implementationFreshnessState(pinned, "b".repeat(40)), "Upstream moved");
  assert.equal(implementationFreshnessState(pinned, null), "Unavailable");
});
