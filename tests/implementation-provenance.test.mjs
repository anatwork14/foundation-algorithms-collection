import test from "node:test";
import assert from "node:assert/strict";
import { implementationCommitUrl, implementations } from "../lib/implementations.ts";

test("every implementation record pins a full Git commit", () => {
  for (const implementation of implementations) {
    assert.match(implementation.verifiedCommit, /^[0-9a-f]{40}$/);
    assert.ok(implementation.verifiedRef.trim());
  }
});

test("every implementation source path is immutable at the verified commit", () => {
  for (const implementation of implementations) {
    assert.ok(implementation.sourcePaths.length > 0);
    for (const source of implementation.sourcePaths) {
      assert.ok(
        source.url.includes(`/${implementation.verifiedCommit}/`),
        `${implementation.id} has a floating or mismatched source URL: ${source.url}`,
      );
    }
  }
});

test("commit links resolve to the pinned repository revision URL shape", () => {
  for (const implementation of implementations) {
    assert.equal(
      implementationCommitUrl(implementation),
      `${implementation.repository}/commit/${implementation.verifiedCommit}`,
    );
  }
});
