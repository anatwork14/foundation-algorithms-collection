import test from "node:test";
import assert from "node:assert/strict";
import { claims } from "../lib/claims.ts";
import { getDocument } from "../lib/content.ts";

test("every curated Claim resolves to exactly one live passage", () => {
  for (const claim of claims) {
    const document = getDocument(claim.chapterSlug);
    assert.ok(document, `${claim.id}: chapter ${claim.chapterSlug} must exist`);

    const needle = claim.passageContains.trim().toLowerCase();
    const matches = document.passages.filter((passage) => passage.text.toLowerCase().includes(needle));

    assert.equal(
      matches.length,
      1,
      `${claim.id}: selector must resolve to exactly one passage; found ${matches.length}`,
    );
  }
});

test("long chapters retain provenance units beyond the former 100-passage boundary", () => {
  const document = getDocument("08-bandits-contextual-bandits-linucb");
  assert.ok(document);
  assert.ok(document.passages.length > 100, "Bandits chapter should expose all indexed prose passages");

  const latePassage = document.passages.find((passage) =>
    passage.text.includes("NeuralUCB uses a neural network for reward representation/prediction"),
  );
  assert.ok(latePassage, "late NeuralUCB provenance passage should remain indexed");
});
