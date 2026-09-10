import { expect, it } from 'vitest';
import { calculateScore } from './colorUtils';

const target = { h: 0, s: 100, v: 100 };

it('awards a perfect score for an exact HSV match', () => {
  expect(calculateScore(target, target).score).toBe(100);
});

it('penalizes a visible single-channel mismatch more than the previous average formula', () => {
  expect(calculateScore(target, { ...target, s: 50 }).score).toBe(56);
  expect(calculateScore(target, { ...target, h: 90 }).score).toBe(42);
});

it('gives a very low score to an opposite hue', () => {
  expect(calculateScore(target, { ...target, h: 180 }).score).toBe(9);
});
