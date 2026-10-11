export function lowerBound(sorted: readonly number[], target: number): number {
  let left = 0;
  let right = sorted.length;

  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (sorted[middle] < target) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  return left;
}

export function upperBound(sorted: readonly number[], target: number): number {
  let left = 0;
  let right = sorted.length;

  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (sorted[middle] <= target) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  return left;
}
