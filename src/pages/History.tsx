import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import MatchHistory from '../components/history/MatchHistory';
import SidebarFilters from '../components/history/SidebarFilters';
import type { ColorSpace, ColorValues, HistoryItem } from '../types/history';
import { clearHistory, readHistory, HISTORY_EVENT } from '../storage/practiceStorage';
import { calculateScore, hsvToHex, hsvToRgb, hsvToHsl } from '../utils/colorUtils';
import type { HSV } from '../types/color';
import { useLocale } from '../i18n/LocaleProvider';
import { getRoutePath } from '../routes';

function displayValues(color: HSV, mode: ColorSpace): ColorValues {
  if (mode === 'rgb') {
    const { r, g, b } = hsvToRgb(color.h, color.s, color.v);
    return { v1: r, v2: g, v3: b };
  }
  if (mode === 'hsl') {
    const { h, s, l } = hsvToHsl(color.h, color.s, color.v);
    return { v1: h, v2: s, v3: l };
  }
  return { v1: color.h, v2: color.s, v3: color.v };
}

export default function History() {
  const { locale } = useLocale();
  const zh = locale === 'zh';
  const [records, setRecords] = useState(readHistory);
  const [mode, setMode] = useState<ColorSpace | 'all'>('all');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  useEffect(() => {
    document.title = zh ? '练习历史 | Chromaflow' : 'Practice History | Chromaflow';
  }, [zh]);
  useEffect(() => {
    const sync = () => setRecords(readHistory());
    window.addEventListener('storage', sync);
    window.addEventListener(HISTORY_EVENT, sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener(HISTORY_EVENT, sync); };
  }, []);
  const history: HistoryItem[] = records.map(record => {
    const submittedMode = record.mode.toLowerCase() as ColorSpace;
    const time = new Date(record.createdAt);
    const date = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')}`;
    return { id: record.id, date, submittedMode,
      target: displayValues(record.target, submittedMode), match: displayValues(record.guess, submittedMode),
      accuracy: calculateScore(record.target, record.guess).score,
      targetHex: hsvToHex(record.target), guessHex: hsvToHex(record.guess),
    };
  });
  const filtered = history.filter(item => (mode === 'all' || item.submittedMode === mode) && (!start || item.date >= start) && (!end || item.date <= end));
  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const currentPage = Math.min(page, totalPages);
  const grouped: Record<string, HistoryItem[]> = {};
  filtered.slice((currentPage - 1) * 5, currentPage * 5).forEach(item => (grouped[item.date] ??= []).push(item));
  const average = history.length ? Math.round(history.reduce((sum, item) => sum + item.accuracy, 0) / history.length) : 0;
  return <div className="min-h-screen bg-slate-50 pb-16"><Navbar/>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{zh ? '练习历史' : 'Practice history'}</h1>
        <p className="mt-3 text-slate-500 leading-7">{zh ? '自动保存最近 20 次练习，仅保存在当前浏览器。清除浏览器数据会删除记录，不支持跨设备同步。' : 'Your latest 20 rounds are saved in this browser. Clearing browser data deletes them. History does not sync across devices.'}</p>
        <div className="flex flex-wrap items-center gap-6 mt-6">
          <p className="font-semibold text-slate-700">{zh ? '已保存' : 'Saved'}: {history.length}/20</p>
          <p className="font-semibold text-slate-700">{zh ? '最近记录平均分' : 'Average of saved rounds'}: {average}</p>
          <Link className="rounded-xl bg-slate-900 text-white px-5 py-3" to={getRoutePath(locale, 'practice')}>{zh ? '开始练习' : 'Start practice'}</Link>
          <button disabled={!records.length} className="text-sm text-red-600 disabled:opacity-40" onClick={() => {
            if (!window.confirm(zh ? '清空本机的所有练习记录？此操作无法撤销。' : 'Clear all practice history on this device? This cannot be undone.')) return;
            try { clearHistory(); setRecords([]); setPage(1); setError(false); } catch { setError(true); }
          }}>{zh ? '清空历史' : 'Clear history'}</button>
        </div>
        {error && <p role="alert" className="mt-4 text-red-600">{zh ? '无法清空，请检查浏览器存储权限。' : 'Could not clear history. Check browser storage permissions.'}</p>}
      </section>
      <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full"><MatchHistory groupedHistory={grouped} currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} sidebarHeight={null} sessionsCount={filtered.length}/></div>
        <aside className="w-full lg:w-80"><SidebarFilters selectedMode={mode} onModeChange={value => { setMode(value); setPage(1); }} startDate={start} endDate={end} onStartDateChange={value => { setStart(value); setPage(1); }} onEndDateChange={value => { setEnd(value); setPage(1); }} onReset={() => { setMode('all'); setStart(''); setEnd(''); setPage(1); }}/></aside>
      </div>
    </main>
  </div>;
}
