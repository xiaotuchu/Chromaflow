import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { clearHistory, readHistory, readLatestRecord, saveRecord, HISTORY_KEY, HISTORY_LIMIT } from './practiceStorage';

const payload = { mode: 'HSV' as const, target: { h: 120, s: 50, v: 60 }, guess: { h: 110, s: 40, v: 55 } };
let data: Map<string, string>;
afterEach(() => vi.unstubAllGlobals());
beforeEach(() => {
  data = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  });
});

it('persists the latest 50 submissions in newest-first order, with unique ids', () => {
  for (let h = 0; h < 55; h++) saveRecord({ ...payload, target: { ...payload.target, h } });
  const records = readHistory();
  expect(HISTORY_LIMIT).toBe(50);
  expect(records).toHaveLength(50);
  expect(records.map(r => r.target.h)).toEqual(Array.from({ length: 50 }, (_, i) => 54 - i));
  expect(new Set(records.map(r => r.id)).size).toBe(50);
  expect(JSON.parse(data.get(HISTORY_KEY)!)).toEqual(records);
});

it('recovers from corrupt JSON and rejects malformed records', () => {
  data.set(HISTORY_KEY, '{broken');
  expect(readHistory()).toEqual([]);
  const valid = saveRecord(payload);
  data.set(HISTORY_KEY, JSON.stringify([null, {}, { ...valid, target: { h: 999, s: 0, v: 0 } }, valid]));
  expect(readHistory()).toEqual([valid]);
});

it('does not claim persistence when storage is unavailable', () => {
  vi.stubGlobal('localStorage', { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); } });
  expect(readHistory()).toEqual([]);
  expect(() => saveRecord(payload)).toThrow();
});

it('clears only its own history, preserving language and unrelated data', () => {
  data.set('other', 'keep');
  saveRecord(payload);
  clearHistory();
  expect(readHistory()).toEqual([]);
  expect(data.get('other')).toBe('keep');
});

it('reads newly persisted data instead of a stale in-memory cache', () => {
  const record = saveRecord(payload);
  data.set(HISTORY_KEY, JSON.stringify([{ ...record, id: 'another-tab', mode: 'RGB' }]));
  expect(readHistory()[0].mode).toBe('RGB');
});

it('returns the newest saved record for restoring the most recent practice result', () => {
  saveRecord({ ...payload, target: { ...payload.target, h: 20 } });
  const latest = saveRecord({ ...payload, target: { ...payload.target, h: 30 } });
  expect(readLatestRecord()).toEqual(latest);
});

it('rejects invalid submissions without damaging existing history', () => {
  saveRecord(payload);
  expect(() => saveRecord({ ...payload, guess: { h: NaN, s: 10, v: 10 } })).toThrow();
  expect(readHistory()).toHaveLength(1);
});

it('can save on HTTP static hosts where randomUUID is not available', () => {
  vi.stubGlobal('crypto', { getRandomValues: (array: Uint32Array) => array.fill(123456) });
  expect(saveRecord(payload).id).toBeTruthy();
  expect(readHistory()).toHaveLength(1);
});

it('persists when the Web Crypto global is unavailable', () => {
  vi.stubGlobal('crypto', undefined);
  expect(saveRecord(payload).id).toBeTruthy();
  expect(readHistory()).toHaveLength(1);
});
