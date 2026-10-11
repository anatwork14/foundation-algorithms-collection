import test from "node:test";
import assert from "node:assert/strict";
import { mergeSort } from "../lib/merge-sort.ts";

test("empty input returns an empty array", () => {
  assert.deepEqual(mergeSort([]), []);
});

test("single element is returned unchanged", () => {
  assert.deepEqual(mergeSort([42]), [42]);
});

test("duplicates are grouped in ascending order", () => {
  assert.deepEqual(mergeSort([3, 1, 3, 2, 1, 2, 3]), [1, 1, 2, 2, 3, 3, 3]);
});

test("already sorted input is preserved", () => {
  assert.deepEqual(mergeSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
});

test("reverse sorted input is sorted ascending", () => {
  assert.deepEqual(mergeSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
});

test("negative and fractional values sort numerically", () => {
  assert.deepEqual(mergeSort([10, -3, 0.5, -10, 2, -0.25, 1]), [-10, -3, -0.25, 0.5, 1, 2, 10]);
});

test("NaN values are placed last", () => {
  const sorted = mergeSort([NaN, 3, Number.NaN, -1, 2]);

  assert.deepEqual(sorted.slice(0, 3), [-1, 2, 3]);
  assert.equal(sorted.length, 5);
  assert.ok(Number.isNaN(sorted[3]));
  assert.ok(Number.isNaN(sorted[4]));
});

test("-0 and 0 compare equal and keep their input order", () => {
  const sorted = mergeSort([0, -0, 0, -0, -1, 1]);

  assert.deepEqual(sorted.slice(0, 1), [-1]);
  assert.deepEqual(sorted.slice(5), [1]);
  assert.deepEqual(sorted.slice(1, 5).map((value) => Object.is(value, -0)), [false, true, false, true]);
});

test("input array is not mutated and the result is a new array", () => {
  const input = [4, 2, NaN, 1, 3];
  const snapshot = [...input];

  const sorted = mergeSort(input);

  assert.notEqual(sorted, input);
  assert.deepEqual(input, snapshot);
});

test("20000-element pseudo-random input matches Array.prototype.sort numeric order", () => {
  let seed = 12345;
  const input = Array.from({ length: 20000 }, () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return (seed % 2001) - 1000;
  });
  const snapshot = [...input];

  assert.deepEqual(mergeSort(input), [...input].sort((a, b) => a - b));
  assert.deepEqual(input, snapshot);
});
