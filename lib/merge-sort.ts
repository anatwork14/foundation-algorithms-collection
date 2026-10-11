// Stable top-down merge sort over numbers. Ascending order; NaN values sort last;
// -0 and 0 compare equal and keep their input order. The input is never mutated.
export function mergeSort(items: readonly number[]): number[] {
  if (items.length <= 1) return [...items];

  const middle = Math.floor(items.length / 2);
  return merge(mergeSort(items.slice(0, middle)), mergeSort(items.slice(middle)));
}

function merge(left: readonly number[], right: readonly number[]): number[] {
  const merged: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    // Take from the right only when it strictly precedes the left, so equal values keep their order.
    if (precedes(right[rightIndex], left[leftIndex])) {
      merged.push(right[rightIndex]);
      rightIndex += 1;
    } else {
      merged.push(left[leftIndex]);
      leftIndex += 1;
    }
  }

  while (leftIndex < left.length) {
    merged.push(left[leftIndex]);
    leftIndex += 1;
  }
  while (rightIndex < right.length) {
    merged.push(right[rightIndex]);
    rightIndex += 1;
  }

  return merged;
}

// True when `a` must come strictly before `b` in ascending NaN-last order.
function precedes(a: number, b: number): boolean {
  if (Number.isNaN(a)) return false;
  if (Number.isNaN(b)) return true;
  return a < b;
}
