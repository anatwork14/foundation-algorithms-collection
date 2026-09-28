import test from "node:test";
import assert from "node:assert/strict";
import { claimPassageMatches, resolveClaimPassage } from "../lib/claim-provenance.ts";

const claim = {
  id: "test-claim",
  kind: "Mechanism",
  statement: "A test mechanism claim.",
  algorithmIds: ["test-algorithm"],
  chapterSlug: "test-chapter",
  passageContains: "unique mechanism phrase",
  referenceIds: ["test-reference"],
  note: "Test only.",
};

const document = {
  slug: "test-chapter",
  title: "Test chapter",
  number: "99",
  field: "Foundations",
  words: 100,
  minutes: 1,
  headings: [],
  searchText: "",
  passages: [
    {
      id: "p-aaaaaaaaaaaa",
      heading: "Mechanism",
      anchor: "mechanism",
      text: "This paragraph contains the unique mechanism phrase and enough context to inspect it.",
      startLine: 20,
      endLine: 22,
    },
    {
      id: "p-bbbbbbbbbbbb",
      heading: "Other",
      anchor: "other",
      text: "A different passage has unrelated content.",
      startLine: 30,
      endLine: 30,
    },
  ],
};

test("a curated claim resolves only when its selector identifies one passage", () => {
  const resolved = resolveClaimPassage(claim, document);
  assert.ok(resolved);
  assert.equal(resolved.passage.id, "p-aaaaaaaaaaaa");
  assert.equal(resolved.chapter.slug, "test-chapter");
});

test("passage selectors are case-insensitive", () => {
  const matches = claimPassageMatches({ ...claim, passageContains: "UNIQUE MECHANISM PHRASE" }, document);
  assert.equal(matches.length, 1);
});

test("ambiguous selectors do not resolve", () => {
  const ambiguousDocument = {
    ...document,
    passages: [
      ...document.passages,
      {
        id: "p-cccccccccccc",
        heading: "Repeated",
        anchor: "repeated",
        text: "Another paragraph also contains the unique mechanism phrase.",
        startLine: 40,
        endLine: 40,
      },
    ],
  };
  assert.equal(claimPassageMatches(claim, ambiguousDocument).length, 2);
  assert.equal(resolveClaimPassage(claim, ambiguousDocument), null);
});

test("missing selectors do not resolve", () => {
  assert.equal(resolveClaimPassage({ ...claim, passageContains: "not in chapter" }, document), null);
});
