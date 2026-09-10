import { expect, it } from 'vitest';
import type { PracticeRecord } from '@/types/history';
import { historyToCsv } from './historyExport';

const records: PracticeRecord[] = [{
  id: 'round-1',
  createdAt: '2026-09-10T12:34:56.000Z',
  mode: 'HSV',
  target: { h: 120, s: 50, v: 60 },
  guess: { h: 110, s: 40, v: 55 },
}];

it('formats practice records as a UTF-8-friendly CSV with HSV values', () => {
  expect(historyToCsv(records)).toBe(
    '\uFEFFCreated at,Mode,Score,Target H,Target S,Target V,Guess H,Guess S,Guess V\r\n2026-09-10T12:34:56.000Z,HSV,87,120,50,60,110,40,55',
  );
});

it('returns a header-only CSV for an empty history', () => {
  expect(historyToCsv([])).toBe('\uFEFFCreated at,Mode,Score,Target H,Target S,Target V,Guess H,Guess S,Guess V');
});
