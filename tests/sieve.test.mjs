import test from "node:test";
import assert from "node:assert/strict";
import { primesUpTo } from "../lib/sieve.ts";

function isPrimeByTrialDivision(n) {
  if (n < 2) return false;
  for (let divisor = 2; divisor * divisor <= n; divisor++) {
    if (n % divisor === 0) return false;
  }
  return true;
}

test("small limits return the expected primes", () => {
  assert.deepEqual(primesUpTo(0), []);
  assert.deepEqual(primesUpTo(1), []);
  assert.deepEqual(primesUpTo(2), [2]);
  assert.deepEqual(primesUpTo(30), [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});

test("prime counts match known values", () => {
  assert.equal(primesUpTo(100).length, 25);
  assert.equal(primesUpTo(10000).length, 1229);
  assert.equal(primesUpTo(1000000).length, 78498);
});

test("every returned number is prime by trial division and no prime is missing for limit 5000", () => {
  const primes = primesUpTo(5000);
  for (const prime of primes) {
    assert.equal(isPrimeByTrialDivision(prime), true, `${prime} should be prime`);
  }
  const expected = [];
  for (let n = 2; n <= 5000; n++) {
    if (isPrimeByTrialDivision(n)) expected.push(n);
  }
  assert.deepEqual(primes, expected);
});

test("results are strictly ascending", () => {
  const primes = primesUpTo(10000);
  for (let i = 1; i < primes.length; i++) {
    assert.ok(primes[i - 1] < primes[i]);
  }
});

test("invalid limits throw RangeError", () => {
  for (const limit of [1.5, -1, NaN, Infinity, 1000001]) {
    assert.throws(() => primesUpTo(limit), RangeError, `limit ${limit} should be rejected`);
  }
});
