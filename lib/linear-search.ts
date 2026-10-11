export function linearSearch(items: readonly number[], target: number): number {
  for (let index = 0; index < items.length; index += 1) {
    if (items[index] === target) {
      return index;
    }
  }

  return -1;
}
