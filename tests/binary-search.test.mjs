import test from "node:test";
import assert from "node:assert/strict";
import { binarySearch } from "../lib/binary-search.ts";

test("returns -1 for an empty array", () => {
  assert.equal(binarySearch([], 1), -1);
  assert.equal(binarySearch([], 0), -1);
});

test("finds a single element and misses otherwise", () => {
  assert.equal(binarySearch([5], 5), 0);
  assert.equal(binarySearch([5], 4), -1);
  assert.equal(binarySearch([5], 6), -1);
});

test("finds the first element", () => {
  const values = [1, 3, 5, 7, 9];
  assert.equal(binarySearch(values, 1), 0);
});

test("finds the last element", () => {
  const values = [1, 3, 5, 7, 9];
  assert.equal(binarySearch(values, 9), 4);
});

test("returns the leftmost index for duplicates", () => {
  const values = [1, 2, 2, 2, 3, 4];
  assert.equal(binarySearch(values, 2), 1);

  const allSame = [7, 7, 7, 7];
  assert.equal(binarySearch(allSame, 7), 0);
});

test("returns -1 for a target below the range", () => {
  assert.equal(binarySearch([10, 20, 30], 5), -1);
});

test("returns -1 for a target above the range", () => {
  assert.equal(binarySearch([10, 20, 30], 35), -1);
});

test("returns -1 for a target between elements", () => {
  assert.equal(binarySearch([10, 20, 30], 25), -1);
});

test("handles negative numbers", () => {
  const values = [-50, -20, -20, -3, 0, 4];
  assert.equal(binarySearch(values, -50), 0);
  assert.equal(binarySearch(values, -20), 1);
  assert.equal(binarySearch(values, -3), 3);
  assert.equal(binarySearch(values, -4), -1);
});

test("matches Array.prototype.indexOf on a 100000-element array", () => {
  // Each value from -5000 to 28333 appears three times, so duplicates are covered.
  const values = Array.from({ length: 100000 }, (_, index) => Math.floor(index / 3) - 5000);

  const targets = [-5002, -5001, -5000, 28333, 28334];
  for (let target = -4999; target < 28333; target += 37) targets.push(target);

  for (const target of targets) {
    assert.equal(binarySearch(values, target), values.indexOf(target), `target ${target}`);
  }
});

test("uses a logarithmic number of reads", () => {
  const values = Array.from({ length: 100000 }, (_, index) => index * 2);
  let reads = 0;
  const counted = new Proxy(values, {
    get(target, property, receiver) {
      if (typeof property === "string" && /^\d+$/.test(property)) reads += 1;
      return Reflect.get(target, property, receiver);
    },
  });

  assert.equal(binarySearch(counted, 123456), 61728);
  assert.ok(reads <= Math.ceil(Math.log2(values.length)) + 2, `read ${reads} elements`);
});

test("does not mutate the input array", () => {
  const values = [1, 2, 2, 2, 3, 5, 8, 13];
  const snapshot = [...values];

  binarySearch(values, 2);
  binarySearch(values, 4);
  binarySearch(values, 13);

  assert.deepEqual(values, snapshot);
});
