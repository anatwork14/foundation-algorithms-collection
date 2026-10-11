import test from "node:test";
import assert from "node:assert/strict";
import { isPrime } from "../lib/is-prime.ts";

function naiveIsPrime(n) {
  if (n < 2) return false;
  for (let divisor = 2; divisor < n; divisor += 1) {
    if (n % divisor === 0) return false;
  }
  return true;
}

test("non-integers, NaN, infinities, negatives, 0 and 1 are not prime", () => {
  for (const value of [0, 1, -1, -2, -7, -7919, 0.5, 2.5, 7919.000001, NaN, Infinity, -Infinity]) {
    assert.equal(isPrime(value), false, `expected isPrime(${value}) to be false`);
  }
});

test("known primes are reported as prime", () => {
  for (const value of [2, 3, 5, 7919, 2147483647]) {
    assert.equal(isPrime(value), true, `expected isPrime(${value}) to be true`);
  }
});

test("known composites are reported as not prime", () => {
  for (const value of [4, 9, 7917, 1000000]) {
    assert.equal(isPrime(value), false, `expected isPrime(${value}) to be false`);
  }
});

test("matches a naive implementation for every integer from 0 to 2000", () => {
  for (let n = 0; n <= 2000; n += 1) {
    assert.equal(isPrime(n), naiveIsPrime(n), `mismatch for n=${n}`);
  }
});
