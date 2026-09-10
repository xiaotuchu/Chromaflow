
import type { Locale } from "../i18n/config";
import { HSV, RGB, HSL, ColorFeedback } from "../types/color";

/**
 * Converts HSV to RGB object
 */
export const hsvToRgb = (h: number, s: number, v: number): RGB => {
  s /= 100;
  v /= 100;
  let r = 0, g = 0, b = 0;

  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    v: v * 100
  };
};

/**
 * Converts HSV to HSL
 */
export const hsvToHsl = (h: number, s: number, v: number): HSL => {
    s /= 100;
    v /= 100;
    
    const l = v * (1 - s / 2);
    let sl = 0;
    
    if (l !== 0 && l !== 1) {
        sl = (v - l) / Math.min(l, 1 - l);
    }
    
    return {
        h: Math.round(h),
        s: Math.round(sl * 100),
        l: Math.round(l * 100)
    };
};

/**
 * Converts HSL to HSV
 */
export const hslToHsv = (h: number, s: number, l: number): HSV => {
    s /= 100;
    l /= 100;
    
    const v = l + s * Math.min(l, 1 - l);
    let sv = 0;
    if (v !== 0) {
        sv = 2 * (1 - l / v);
    }
    
    return {
        h: Math.round(h),
        s: Math.round(sv * 100),
        v: Math.round(v * 100)
    };
};

/**
 * Converts HSV object to CSS RGB string
 */
export const hsvToCss = (hsv: HSV): string => {
  const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

/**
 * Generates a random HSV color
 */
export const generateRandomColor = (): HSV => {
  return {
    h: Math.floor(Math.random() * 361),
    s: Math.floor(Math.random() * 81) + 20, // Avoid too grey (20-100)
    v: Math.floor(Math.random() * 81) + 20  // Avoid too black (20-100)
  };
};

/**
 * Converts Hex string to HSV
 */
export const hexToHsv = (hex: string): HSV => {
  let r = 0, g = 0, b = 0;
  if (hex.startsWith('#')) hex = hex.slice(1);
  
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return { h: 0, s: 0, v: 0 };
  }
  
  return rgbToHsv(r, g, b);
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const hsvToHex = (hsv: HSV): string => {
  const { r, g, b } = hsvToRgb(hsv.h, hsv.s, hsv.v);
  return rgbToHex(r, g, b);
};

/**
 * Calculates score based on distance in HSV cylinder
 */
export const getScoreMessage = (
  score: number,
  locale: Locale = "en"
): string => {
  const zh = locale === "zh";

  if (score >= 98) {
    return zh ? "几乎完全一致，眼力非常准。" : "Perfect match! Amazing eye.";
  }

  if (score >= 90) {
    return zh ? "非常接近，判断相当稳定。" : "Outstanding! Very close.";
  }

  if (score >= 80) {
    return zh ? "表现很好，已经很接近了。" : "Great job! You're getting there.";
  }

  if (score >= 60) {
    return zh ? "这轮不错，再练几次会更稳。" : "Good effort. Keep practicing.";
  }

  return zh ? "继续练习，你会越来越准。" : "Keep trying!";
};

export const calculateScore = (
  target: HSV,
  user: HSV,
  locale: Locale = "en"
): ColorFeedback => {
  // Hue distance (circular)
  let hDiff = Math.abs(target.h - user.h);
  if (hDiff > 180) hDiff = 360 - hDiff;

  // Actual signed difference for direction (shortest path)
  let rawHDiff = user.h - target.h;
  if (rawHDiff > 180) rawHDiff -= 360;
  if (rawHDiff < -180) rawHDiff += 360;

  const sDiff = user.s - target.s; 
  const vDiff = user.v - target.v; 

  const hDist = hDiff / 180;
  const sDist = Math.abs(sDiff) / 100;
  const vDist = Math.abs(vDiff) / 100;

  const totalError = (hDist + sDist + vDist) / 3;
  const score = Math.max(0, Math.round((1 - totalError) * 100));

  return {
    score,
    message: getScoreMessage(score, locale),
    hDiff: rawHDiff, 
    sDiff,
    vDiff
  };
};

export const getFeedbackText = (
  diff: number,
  type: "h" | "s" | "v",
  locale: Locale = "en"
): string => {
  const zh = locale === "zh";

  if (Math.abs(diff) < 2) {
    return zh ? "几乎一致" : "Perfect match";
  }

  if (type === "h") {
    return zh
      ? diff > 0
        ? "色相稍微偏顺时针"
        : "色相稍微偏逆时针"
      : diff > 0
        ? "Shifted slightly CW"
        : "Shifted slightly CCW";
  }

  if (type === "s") {
    if (Math.abs(diff) < 5) {
      return zh ? "饱和度非常接近" : "Saturation is very close";
    }

    return zh
      ? diff > 0
        ? "饱和度偏高"
        : "饱和度偏低"
      : diff > 0
        ? "Too saturated"
        : "Too desaturated";
  }

  if (type === "v") {
    if (Math.abs(diff) < 5) {
      return zh ? "明度非常接近" : "Brightness is very close";
    }

    return zh
      ? diff > 0
        ? "明度偏高"
        : "明度偏低"
      : diff > 0
        ? "Too bright"
        : "Too dark";
  }

  return "";
};
