import test from 'node:test';
import assert from 'node:assert/strict';
import { lowerBound, upperBound } from '../lib/bounds.ts';

test('bounds return zero for an empty array', () => {
  assert.equal(lowerBound([], 4), 0);
  assert.equal(upperBound([], 4), 0);
});

test('bounds handle all-equal arrays', () => {
  const sorted = [5, 5, 5, 5];

  assert.equal(lowerBound(sorted, 5), 0);
  assert.equal(upperBound(sorted, 5), sorted.length);
  assert.equal(lowerBound(sorted, 4), 0);
  assert.equal(upperBound(sorted, 4), 0);
  assert.equal(lowerBound(sorted, 6), sorted.length);
  assert.equal(upperBound(sorted, 6), sorted.length);
});

test('bounds handle targets below, within, and above the range', () => {
  const sorted = [-8, -3, 0, 4, 9];

  assert.equal(lowerBound(sorted, -10), 0);
  assert.equal(upperBound(sorted, -10), 0);
  assert.equal(lowerBound(sorted, 0), 2);
  assert.equal(upperBound(sorted, 0), 3);
  assert.equal(lowerBound(sorted, 7), 4);
  assert.equal(upperBound(sorted, 7), 4);
  assert.equal(lowerBound(sorted, 12), sorted.length);
  assert.equal(upperBound(sorted, 12), sorted.length);
});

test('bounds include all duplicates and support negative targets', () => {
  const sorted = [-9, -4, -4, -4, -1, 2, 2, 7];

  assert.equal(lowerBound(sorted, -4), 1);
  assert.equal(upperBound(sorted, -4), 4);
  assert.equal(upperBound(sorted, -4) - lowerBound(sorted, -4), 3);
  assert.equal(lowerBound(sorted, 2), 5);
  assert.equal(upperBound(sorted, 2), 7);
  assert.equal(upperBound(sorted, 2) - lowerBound(sorted, 2), 2);
  assert.equal(lowerBound(sorted, -6), 1);
  assert.equal(upperBound(sorted, -6), 1);
});

test('bounds on a 100000-element array match a linear scan', () => {
  const sorted = Array.from({ length: 100_000 }, (_, index) => Math.floor(index / 4) - 12_500);
  const targets = [-13_000, -12_500, -1, 0, 12_499, 12_500, 13_000];

  for (const target of targets) {
    let lower = sorted.length;
    let upper = sorted.length;
    let equalCount = 0;

    for (let index = 0; index < sorted.length; index += 1) {
      if (lower === sorted.length && sorted[index] >= target) lower = index;
      if (upper === sorted.length && sorted[index] > target) upper = index;
      if (sorted[index] === target) equalCount += 1;
    }

    assert.equal(lowerBound(sorted, target), lower);
    assert.equal(upperBound(sorted, target), upper);
    assert.equal(upperBound(sorted, target) - lowerBound(sorted, target),
      equalCount);
  }
});
