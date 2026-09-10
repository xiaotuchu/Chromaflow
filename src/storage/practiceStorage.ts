import type { PracticeRecord } from '@/types/history';
import type { ColorMode, HSV } from '@/types/color';

export const HISTORY_KEY = 'chromaflow2.history.v1';
export const HISTORY_EVENT = 'chromaflow2:history';
export const HISTORY_LIMIT = 50;
function isColor(value: unknown): value is HSV {
  if (!value || typeof value !== 'object') return false;
  const color = value as HSV;
  return [color.h, color.s, color.v].every(Number.isFinite)
    && color.h >= 0 && color.h <= 360
    && color.s >= 0 && color.s <= 100 && color.v >= 0 && color.v <= 100;
}

function isRecord(value: unknown): value is PracticeRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as PracticeRecord;
  return typeof record.id === 'string' && record.id.length > 0
    && typeof record.createdAt === 'string' && Number.isFinite(Date.parse(record.createdAt))
    && ['HSV', 'RGB', 'HSL'].includes(record.mode)
    && isColor(record.target) && isColor(record.guess);
}

export function readHistory(): PracticeRecord[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter(isRecord).slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

export function readLatestRecord(): PracticeRecord | null {
  return readHistory()[0] ?? null;
}

function notifyHistory() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(HISTORY_EVENT));
}

function createRecordId(): string {
  const browserCrypto = globalThis.crypto;
  if (typeof browserCrypto?.randomUUID === 'function') return browserCrypto.randomUUID();
  if (typeof browserCrypto?.getRandomValues === 'function') {
    return Array.from(browserCrypto.getRandomValues(new Uint32Array(4)), value => value.toString(16).padStart(8, '0')).join('');
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function saveRecord(payload: Pick<PracticeRecord, 'mode' | 'target' | 'guess'>): PracticeRecord {
  const record: PracticeRecord = {
    ...payload,
    id: createRecordId(),
    createdAt: new Date().toISOString(),
  };
  if (!isRecord(record)) throw new Error('Invalid practice record');
  localStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...readHistory()].slice(0, HISTORY_LIMIT)));
  notifyHistory();
  return record;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  notifyHistory();
}
