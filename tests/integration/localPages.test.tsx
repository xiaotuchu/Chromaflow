import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { detectPreferredLocale } from '@/i18n/config';
import Navbar from '@/components/common/Navbar';
import History from '@/pages/History';
import ResultAnalysis from '@/components/practice/ResultAnalysis';
import { calculateScore } from '@/utils/colorUtils';

afterEach(() => vi.unstubAllGlobals());
const color = { h: 120, s: 100, v: 100 };
const render = (element: React.ReactNode) => renderToStaticMarkup(<MemoryRouter><LocaleProvider locale="zh">{element}</LocaleProvider></MemoryRouter>);

it('offers history without login or signup navigation', () => {
  const html = render(<Navbar/>);
  expect(html).toContain('练习历史');
  expect(html).not.toMatch(/\/login|\/signup/);
});

it('shows persisted history without an account and converts HSV data for RGB labels', () => {
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify([{ id: 'record', mode: 'RGB', target: color, guess: color, createdAt: '2026-09-10T12:00:00Z' }]) });
  const html = render(<History/>);
  expect(html).toContain('R:0 G:255 B:0');
  expect(html).toContain('data-match-card');
  expect(html).not.toContain('登录');
});

it('keeps score feedback visible and reports saving failure honestly', () => {
  const html = render(<ResultAnalysis feedback={calculateScore(color, color, 'zh')} targetColor={color} userColor={color} mode="HSV" saveStatus="failed"/>);
  expect(html).toContain('无法保存');
  expect(html).toContain('结果分析');
  expect(html).not.toContain('已保存到本机');
});

it('prefers saved language and falls back to browser language', () => {
  expect(detectPreferredLocale('zh', 'en-US')).toBe('zh');
  expect(detectPreferredLocale(null, 'zh-CN')).toBe('zh');
  expect(detectPreferredLocale(null, 'fr')).toBe('en');
});
