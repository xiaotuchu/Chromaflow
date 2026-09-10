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
  expect(html).toContain('1/50');
  expect(html).not.toContain('登录');
});

it('places the practice summary above filters in the history sidebar', () => {
  vi.stubGlobal('localStorage', { getItem: () => '[]' });
  const html = render(<History/>);
  const summaryIndex = html.indexOf('data-history-summary');
  const filtersIndex = html.indexOf('data-history-filters');

  expect(summaryIndex).toBeGreaterThan(-1);
  expect(filtersIndex).toBeGreaterThan(summaryIndex);
  expect(html).toMatch(/class="space-y-4" data-history-summary/);
  expect(html).toMatch(/bg-white rounded-3xl p-6 border border-slate-100 shadow-sm/);
  expect(html).not.toContain('type="date"');
  expect(html).not.toContain('开始练习');
  expect(html).not.toContain('重置所有筛选');
});

it('keeps score feedback visible and reports saving failure honestly', () => {
  const html = render(<ResultAnalysis feedback={calculateScore(color, color, 'zh')} targetColor={color} userColor={color} mode="HSV" saveStatus="failed"/>);
  expect(html).toContain('无法保存');
  expect(html).toContain('几乎完全一致，眼力非常准。');
  expect(html).not.toContain('已保存到本机');
});

it('renders the saved-history link below the result heading without a saved badge', () => {
  const html = render(<ResultAnalysis feedback={calculateScore(color, color, 'zh')} targetColor={color} userColor={color} mode="HSV" saveStatus="saved"/>);
  expect(html).toContain('本次练习记录已保存，点击查看历史');
  expect(html).not.toContain('data-save-status');
  expect(html).not.toContain('bg-gradient-to-r from-sky-50');
});

it('prefers saved language and falls back to browser language', () => {
  expect(detectPreferredLocale('zh', 'en-US')).toBe('zh');
  expect(detectPreferredLocale(null, 'zh-CN')).toBe('zh');
  expect(detectPreferredLocale(null, 'fr')).toBe('en');
});
