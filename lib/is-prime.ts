/**
 * Return true when n is a prime integer. Uses trial division by 2 and then by
 * odd divisors up to the square root of n. Non-integers, NaN, infinities,
 * negatives, 0 and 1 are not prime.
 */
export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let divisor = 3; divisor * divisor <= n; divisor += 2) {
    if (n % divisor === 0) return false;
  }
  return true;
}
