import test from "node:test";
import assert from "node:assert/strict";
import { isEven } from "../lib/is-even.ts";

test("isEven returns true for even integers", () => {
  for (const n of [0, 2, 4, 100, Number.MAX_SAFE_INTEGER - 1]) {
    assert.equal(isEven(n), true, `expected isEven(${n}) to be true`);
  }
});

test("isEven returns true for negative even integers", () => {
  for (const n of [-2, -4, -100]) {
    assert.equal(isEven(n), true, `expected isEven(${n}) to be true`);
  }
});

test("isEven returns false for odd integers", () => {
  for (const n of [1, 3, 99, -1, -3, Number.MAX_SAFE_INTEGER]) {
    assert.equal(isEven(n), false, `expected isEven(${n}) to be false`);
  }
});

test("isEven returns false for non-integers", () => {
  for (const n of [2.5, -0.5, 0.1, 4.000001, NaN, Infinity, -Infinity]) {
    assert.equal(isEven(n), false, `expected isEven(${n}) to be false`);
  }
});
