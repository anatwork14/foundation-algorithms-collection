import test from "node:test";
import assert from "node:assert/strict";
import { findPassageMatch, findPassageMatches } from "../lib/search-passages.ts";

const passages = [
  {
    id: "p-aaaaaaaaaaaa",
    heading: "Motivation",
    anchor: "motivation",
    text: "Contextual bandits choose actions using side information available before each decision.",
    startLine: 10,
    endLine: 11,
  },
  {
    id: "p-bbbbbbbbbbbb",
    heading: "LinUCB",
    anchor: "linucb",
    text: "LinUCB models expected reward as a linear function of context and adds an upper-confidence exploration bonus.",
    startLine: 20,
    endLine: 22,
  },
];

test("blank queries do not manufacture passage matches", () => {
  assert.equal(findPassageMatch(passages, "   "), null);
  assert.deepEqual(findPassageMatches(passages, "   "), []);
});

test("literal matching is case-insensitive and returns the matching section", () => {
  const match = findPassageMatch(passages, "LINEAR FUNCTION");
  assert.ok(match);
  assert.equal(match.id, "p-bbbbbbbbbbbb");
  assert.equal(match.heading, "LinUCB");
  assert.equal(match.anchor, "linucb");
  assert.equal(match.startLine, 20);
  assert.equal(match.endLine, 22);
  assert.equal(match.snippet, passages[1].text);
  assert.equal(match.occurrences, 1);
  assert.ok(match.score > 0);
});

test("heading overlap outranks an earlier body-only match", () => {
  const ranked = [
    {
      id: "p-first",
      heading: "Background",
      anchor: "background",
      text: "Contextual bandits appear here first in ordinary prose.",
      startLine: 5,
      endLine: 5,
    },
    {
      id: "p-heading",
      heading: "Contextual bandits",
      anchor: "contextual-bandits",
      text: "This contextual bandits section defines the model in detail.",
      startLine: 30,
      endLine: 30,
    },
  ];

  assert.equal(findPassageMatch(ranked, "contextual bandits")?.id, "p-heading");
});

test("repeated literal occurrences improve ranking and all matches remain inspectable", () => {
  const repeated = [
    {
      id: "p-one",
      heading: "First",
      anchor: "first",
      text: "bandit routing appears once here.",
      startLine: 10,
      endLine: 10,
    },
    {
      id: "p-two",
      heading: "Second",
      anchor: "second",
      text: "bandit routing appears here; later bandit routing appears again.",
      startLine: 20,
      endLine: 20,
    },
  ];

  const matches = findPassageMatches(repeated, "bandit routing");
  assert.equal(matches.length, 2);
  assert.equal(matches[0].id, "p-two");
  assert.equal(matches[0].occurrences, 2);
  assert.equal(matches[1].occurrences, 1);
});

test("equal lexical scores preserve source order deterministically", () => {
  const repeated = [
    ...passages,
    {
      id: "p-cccccccccccc",
      heading: "Later discussion",
      anchor: "later-discussion",
      text: "Contextual bandits choose actions using side information available before each decision.",
      startLine: 30,
      endLine: 30,
    },
  ];
  const matches = findPassageMatches(repeated, "contextual bandits");
  assert.equal(matches[0].anchor, "motivation");
  assert.equal(matches[1].anchor, "later-discussion");
});

test("limit caps the number of ranked matches", () => {
  const repeated = [
    ...passages,
    {
      id: "p-cccccccccccc",
      heading: "Contextual bandits",
      anchor: "later-discussion",
      text: "Contextual bandits appear in another section.",
      startLine: 30,
      endLine: 30,
    },
  ];
  assert.equal(findPassageMatches(repeated, "contextual bandits", 1).length, 1);
  assert.deepEqual(findPassageMatches(repeated, "contextual bandits", 0), []);
});

test("long passages are cropped around the matching phrase", () => {
  const longText = `${"prefix ".repeat(40)}rare target phrase ${"suffix ".repeat(50)}`.trim();
  const match = findPassageMatch([
    {
      id: "p-dddddddddddd",
      heading: "Long section",
      anchor: "long-section",
      text: longText,
      startLine: 40,
      endLine: 48,
    },
  ], "rare target phrase");

  assert.ok(match);
  assert.match(match.snippet, /rare target phrase/i);
  assert.ok(match.snippet.length < longText.length);
  assert.ok(match.snippet.startsWith("…"));
  assert.ok(match.snippet.endsWith("…"));
});
