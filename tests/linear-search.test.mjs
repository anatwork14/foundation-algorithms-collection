import test from "node:test";
import assert from "node:assert/strict";
import { linearSearch } from "../lib/linear-search.ts";

test("returns -1 for an empty array", () => {
  assert.equal(linearSearch([], 3), -1);
});

test("finds or misses the only element in a single-element array", () => {
  assert.equal(linearSearch([7], 7), 0);
  assert.equal(linearSearch([7], 3), -1);
});

test("finds the first and last elements", () => {
  const items = [4, 8, 12];
  assert.equal(linearSearch(items, 4), 0);
  assert.equal(linearSearch(items, 12), 2);
});

test("returns the lowest index when values are duplicated", () => {
  assert.equal(linearSearch([5, 2, 5, 5], 5), 0);
});

test("works on unsorted input", () => {
  assert.equal(linearSearch([9, 1, 7, 3], 7), 2);
  assert.equal(linearSearch([9, 1, 7, 3], 4), -1);
});

test("finds negative numbers", () => {
  assert.equal(linearSearch([2, -6, 0, -6], -6), 1);
});

test("never finds NaN and treats 0 and -0 as equal", () => {
  assert.equal(linearSearch([NaN], NaN), -1);
  assert.equal(linearSearch([NaN, 0], -0), 1);
  assert.equal(linearSearch([-0], 0), 0);
});

test("matches indexOf over many targets in a 100000-element array", () => {
  const items = Array.from({ length: 100_000 }, (_, index) => (index * 37) % 10_007 - 5_003);

  for (let target = -5_100; target <= 5_100; target += 17) {
    assert.equal(linearSearch(items, target), Array.prototype.indexOf.call(items, target));
  }
});

test("does not mutate the input array", () => {
  const items = [3, -1, 8, 3];
  const before = [...items];

  assert.equal(linearSearch(items, 8), 2);
  assert.deepEqual(items, before);
});
