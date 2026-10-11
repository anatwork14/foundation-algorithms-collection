/**
 * Returns the lowest index whose value equals `target` in an array sorted in
 * ascending order, or -1 when `target` is absent. Runs in O(log n) time and
 * does not mutate `sorted`.
 */
export function binarySearch(sorted: readonly number[], target: number): number {
  let low = 0;
  let high = sorted.length;

  // Find the first index whose value is >= target (lower bound).
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (sorted[mid] < target) low = mid + 1;
    else high = mid;
  }

  return low < sorted.length && sorted[low] === target ? low : -1;
}
