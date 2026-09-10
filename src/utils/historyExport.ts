import type { PracticeRecord } from '@/types/history';
import { calculateScore } from './colorUtils';

const columns = ['Created at', 'Mode', 'Score', 'Target H', 'Target S', 'Target V', 'Guess H', 'Guess S', 'Guess V'];

export function historyToCsv(records: PracticeRecord[]): string {
  const rows = records.map(record => [
    record.createdAt,
    record.mode,
    calculateScore(record.target, record.guess).score,
    record.target.h,
    record.target.s,
    record.target.v,
    record.guess.h,
    record.guess.s,
    record.guess.v,
  ].join(','));
  return `\uFEFF${[columns.join(','), ...rows].join('\r\n')}`;
}

export function downloadHistory(records: PracticeRecord[]): void {
  const blob = new Blob([historyToCsv(records)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'chromaflow-practice-history.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
