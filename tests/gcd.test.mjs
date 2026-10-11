import assert from "node:assert/strict";
import test from "node:test";
import { gcd } from "../lib/gcd.ts";

test("gcd computes the greatest common divisor", () => {
  assert.equal(gcd(54, 24), 6);
  assert.equal(gcd(17, 13), 1);
});

test("gcd accepts negative integers and returns a non-negative result", () => {
  assert.equal(gcd(-54, 24), 6);
  assert.equal(gcd(54, -24), 6);
  assert.equal(gcd(-54, -24), 6);
});

test("gcd handles zero arguments", () => {
  assert.equal(gcd(0, 0), 0);
  assert.equal(gcd(0, 12), 12);
  assert.equal(gcd(-12, 0), 12);
});

test("gcd throws RangeError when either argument is not an integer", () => {
  assert.throws(() => gcd(1.5, 3), RangeError);
  assert.throws(() => gcd(3, 1.5), RangeError);
  assert.throws(() => gcd(Number.NaN, 1), RangeError);
  assert.throws(() => gcd(1, Number.POSITIVE_INFINITY), RangeError);
});
