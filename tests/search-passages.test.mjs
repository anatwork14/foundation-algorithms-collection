import test from "node:test";
import assert from "node:assert/strict";
import { findPassageMatch } from "../lib/search-passages.ts";

const passages = [
  {
    heading: "Motivation",
    anchor: "motivation",
    text: "Contextual bandits choose actions using side information available before each decision.",
    searchText: "contextual bandits choose actions using side information available before each decision.",
  },
  {
    heading: "LinUCB",
    anchor: "linucb",
    text: "LinUCB models expected reward as a linear function of context and adds an upper-confidence exploration bonus.",
    searchText: "linucb models expected reward as a linear function of context and adds an upper-confidence exploration bonus.",
  },
];

test("blank queries do not manufacture passage matches", () => {
  assert.equal(findPassageMatch(passages, "   "), null);
});

test("literal matching is case-insensitive and returns the matching section", () => {
  assert.deepEqual(findPassageMatch(passages, "LINEAR FUNCTION"), {
    heading: "LinUCB",
    anchor: "linucb",
    text: passages[1].text,
  });
});

test("the first matching passage wins deterministically", () => {
  const repeated = [
    ...passages,
    {
      heading: "Later discussion",
      anchor: "later-discussion",
      text: "A later contextual bandits discussion should not displace the earlier passage.",
      searchText: "a later contextual bandits discussion should not displace the earlier passage.",
    },
  ];
  assert.equal(findPassageMatch(repeated, "contextual bandits")?.anchor, "motivation");
});

test("long passages are cropped around the matching phrase", () => {
  const longText = `${"prefix ".repeat(40)}rare target phrase ${"suffix ".repeat(50)}`.trim();
  const match = findPassageMatch([
    {
      heading: "Long section",
      anchor: "long-section",
      text: longText,
      searchText: longText.toLowerCase(),
    },
  ], "rare target phrase");

  assert.ok(match);
  assert.match(match.text, /rare target phrase/i);
  assert.ok(match.text.length < longText.length);
  assert.ok(match.text.startsWith("…"));
  assert.ok(match.text.endsWith("…"));
});
