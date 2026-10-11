/**
 * Returns true when `n` is an even integer (zero and negative even integers included).
 * Returns false for odd integers and for non-integers such as 2.5, NaN, or Infinity.
 */
export function isEven(n: number): boolean {
  return Number.isInteger(n) && n % 2 === 0;
}
