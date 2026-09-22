import type { ColorMode, HSL, HSV } from '../types/color';
import { hsvToRgb, rgbToHsv } from './colorUtils';

export type Channel = 'h' | 's' | 'v' | 'r' | 'g' | 'b' | 'l';
export type PlaneShape = 'square' | 'triangle';
export type HueView = 'bar' | 'ring';
// Radii and bounds are fractions of the outer ring's diameter.
export const HUE_RING_INNER_RADIUS = 0.44;

export function getRingPlaneBounds(shape: PlaneShape) {
  const radius = HUE_RING_INNER_RADIUS;
  if (shape === 'square') {
    const side = Math.SQRT2 * radius;
    return { left: (1 - side) / 2, top: (1 - side) / 2, width: side, height: side };
  }
  const width = Math.sqrt(3) * radius;
  return { left: (1 - width) / 2, top: 0.5 - radius, width, height: 1.5 * radius };
}
export type ChannelValues = Partial<Record<Channel, number>>;
type Channels = ChannelValues;
export const channelsForMode = (mode: ColorMode): Channel[] =>
  mode === 'RGB' ? ['r', 'g', 'b'] : mode === 'HSL' ? ['h', 's', 'l'] : ['h', 's', 'v'];

// Keep precision until presentation: rounding intermediate HSL values drifts locked channels.
export function toChannels(color: HSV, mode: ColorMode): Channels {
  if (mode === 'RGB') return hsvToRgb(color.h, color.s, color.v);
  if (mode === 'HSV') return { ...color };
  const v = color.v / 100;
  const l = v * (1 - color.s / 200);
  const s = l <= 0 || l >= 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h: color.h, s: s * 100, l: l * 100 };
}

export function fromChannels(color: Channels, mode: ColorMode): HSV {
  if (mode === 'RGB') return rgbToHsv(color.r!, color.g!, color.b!);
  if (mode === 'HSV') return { h: color.h!, s: color.s!, v: color.v! };
  const l = color.l! / 100;
  const v = l + color.s! / 100 * Math.min(l, 1 - l);
  return { h: color.h!, s: v === 0 ? 0 : 200 * (1 - l / v), v: v * 100 };
}

export function toggleChannelLock(locks: ChannelValues, current: HSV, mode: ColorMode, channel: Channel, currentHsl?: HSL): ChannelValues {
  const next = { ...locks };
  if (next[channel] !== undefined) delete next[channel];
  else {
    const values: ChannelValues = mode === 'HSL' && currentHsl ? currentHsl : toChannels(current, mode);
    next[channel] = Math.round(values[channel]!);
  }
  return next;
}

export function applyChannelLocks(color: HSV, mode: ColorMode, locks: ChannelValues): HSV {
  if (!Object.keys(locks).length) return color;
  return fromChannels({ ...toChannels(color, mode), ...locks }, mode);
}

export interface ColorSelection {
  hsv: HSV;
  hsl: HSL;
}

export function selectionFromHsv(hsv: HSV, previousHsl?: HSL): ColorSelection {
  const values = toChannels(hsv, 'HSL');
  // Black and white cannot encode HSL saturation in HSV. Retain the user's
  // coordinate until lightness returns to a value where saturation is visible.
  const s = (values.l === 0 || values.l === 100) && previousHsl ? previousHsl.s : values.s!;
  return { hsv, hsl: { h: values.h!, s, l: values.l! } };
}

export function selectionFromHsl(hsl: HSL): ColorSelection {
  return { hsl, hsv: fromChannels(hsl, 'HSL') };
}

export function constrainSelection(selection: ColorSelection, mode: ColorMode, locks: ChannelValues): ColorSelection {
  if (mode === 'HSL') return selectionFromHsl({ ...selection.hsl, ...locks });
  return selectionFromHsv(applyChannelLocks(selection.hsv, mode, locks), selection.hsl);
}

export function applyLocks(color: HSV, target: HSV, mode: ColorMode, locks: Channel[]): HSV {
  if (!locks.length) return color;
  if (locks.length === 3) return { ...target };
  const result = toChannels(color, mode);
  const fixed = toChannels(target, mode);
  for (const key of locks) result[key] = fixed[key];
  return fromChannels(result, mode);
}

export function randomizeUnlocked(target: HSV, mode: ColorMode, locks: Channel[], random = Math.random): HSV {
  if (locks.length === 3) return { ...target };
  const result = toChannels(target, mode);
  for (const key of channelsForMode(mode)) {
    if (locks.includes(key)) continue;
    result[key] = mode === 'RGB' ? Math.floor(random() * 256)
      : key === 'h' ? Math.floor(random() * 360)
      : mode === 'HSL' && key === 'l' ? 10 + Math.floor(random() * 81)
      : 20 + Math.floor(random() * 81);
  }
  return fromChannels(result, mode);
}

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

export function planeToSv(x: number, y: number, shape: PlaneShape): Pick<HSV, 's' | 'v'> {
  y = clamp(y);
  if (shape === 'square') return { s: clamp(x) * 100, v: (1 - y) * 100 };
  x = clamp(x, (1 - y) / 2, (1 + y) / 2);
  const hue = 1 - y;
  const white = (1 + y) / 2 - x;
  const value = hue + white;
  return { s: value <= 0 ? 0 : clamp(hue / value) * 100, v: clamp(value) * 100 };
}

export function svToPlane(s: number, v: number, shape: PlaneShape) {
  if (shape === 'square') return { x: s / 100, y: 1 - v / 100 };
  const hue = s * v / 10000;
  return { x: hue / 2 + 1 - v / 100, y: 1 - hue };
}
