
export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export type ColorMode = 'HSV' | 'RGB' | 'HSL';

export interface ColorFeedback {
  score: number;
  message: string;
  hDiff: number;
  sDiff: number;
  vDiff: number;
}

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}