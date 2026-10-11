import assert from "node:assert/strict";
import test from "node:test";
import { fibonacci } from "../lib/fibonacci.ts";

test("fibonacci returns the expected values", () => {
  assert.equal(fibonacci(0), 0);
  assert.equal(fibonacci(1), 1);
  assert.equal(fibonacci(10), 55);
  assert.equal(fibonacci(50), 12586269025);
  assert.equal(fibonacci(78), 8944394323791464);
});

test("fibonacci follows the recurrence through n = 78", () => {
  for (let n = 2; n <= 78; n += 1) {
    assert.equal(fibonacci(n), fibonacci(n - 1) + fibonacci(n - 2));
  }
});

test("fibonacci rejects invalid inputs with RangeError", () => {
  for (const n of [-1, 1.5, NaN, 79]) {
    assert.throws(() => fibonacci(n), RangeError);
  }
});
