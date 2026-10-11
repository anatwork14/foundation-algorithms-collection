export function fibonacci(n: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 78) {
    throw new RangeError("n must be an integer from 0 through 78");
  }

  if (n < 2) {
    return n;
  }

  let previous = 0;
  let current = 1;

  for (let index = 2; index <= n; index += 1) {
    const next = previous + current;
    previous = current;
    current = next;
  }

  return current;
}
