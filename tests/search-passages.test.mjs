import test from "node:test";
import assert from "node:assert/strict";
import { findPassageMatch } from "../lib/search-passages.ts";

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
});

test("the first matching passage wins deterministically", () => {
  const repeated = [
    ...passages,
    {
      id: "p-cccccccccccc",
      heading: "Later discussion",
      anchor: "later-discussion",
      text: "A later contextual bandits discussion should not displace the earlier passage.",
      startLine: 30,
      endLine: 30,
    },
  ];
  assert.equal(findPassageMatch(repeated, "contextual bandits")?.anchor, "motivation");
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
