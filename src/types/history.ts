import type { ColorMode, HSV } from './color';

export type ColorSpace = 'hsv' | 'rgb' | 'hsl';

export interface ColorValues {
  v1: number;
  v2: number;
  v3: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  submittedMode: ColorSpace;
  target: ColorValues;
  match: ColorValues;
  accuracy: number;
  targetHex: string;
  guessHex: string;
}

export interface PracticeRecord {
  id: string;
  createdAt: string;
  mode: ColorMode;
  target: HSV;
  guess: HSV;
}
