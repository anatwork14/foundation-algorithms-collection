const MAX_LIMIT = 1000000;

// Sieve of Eratosthenes: returns every prime <= limit in ascending order.
export function primesUpTo(limit: number): number[] {
  if (!Number.isInteger(limit) || limit < 0 || limit > MAX_LIMIT) {
    throw new RangeError(`primesUpTo expects an integer limit from 0 to ${MAX_LIMIT}, received ${limit}`);
  }

  const composite = new Uint8Array(limit + 1);
  const primes: number[] = [];

  for (let n = 2; n <= limit; n++) {
    if (composite[n]) continue;
    primes.push(n);
    for (let multiple = n * n; multiple <= limit; multiple += n) composite[multiple] = 1;
  }

  return primes;
}
