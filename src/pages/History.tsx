import React, { useEffect, useState } from 'react';
import { ChartNoAxesCombined, Download, Trash2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import MatchHistory from '../components/history/MatchHistory';
import SidebarFilters from '../components/history/SidebarFilters';
import type { ColorSpace, ColorValues, HistoryItem } from '../types/history';
import { clearHistory, readHistory, HISTORY_EVENT } from '../storage/practiceStorage';
import { calculateScore, hsvToHex, hsvToRgb, hsvToHsl } from '../utils/colorUtils';
import type { HSV } from '../types/color';
import { useLocale } from '../i18n/LocaleProvider';
import { downloadHistory } from '../utils/historyExport';

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
  const [page, setPage] = useState(1);
  const [error, setError] = useState<'clear' | 'download' | null>(null);
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
  const filtered = history.filter(item => mode === 'all' || item.submittedMode === mode);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const currentPage = Math.min(page, totalPages);
  const grouped: Record<string, HistoryItem[]> = {};
  filtered.slice((currentPage - 1) * 5, currentPage * 5).forEach(item => (grouped[item.date] ??= []).push(item));
  const average = history.length ? Math.round(history.reduce((sum, item) => sum + item.accuracy, 0) / history.length) : 0;
  return <div className="min-h-screen bg-slate-50 pb-16"><Navbar/>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-80 space-y-6 lg:order-2">
          <section className="space-y-4" data-history-summary>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-1">
              <ChartNoAxesCombined size={20} className="text-sky-500" />
              {zh ? '练习历史' : 'Practice history'}
            </h1>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 leading-6">{zh ? '自动保存最近 50 次练习，仅保存在当前浏览器。清除浏览器数据会删除记录，不支持跨设备同步。' : 'Your latest 50 rounds are saved in this browser. Clearing browser data deletes them. History does not sync across devices.'}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <p className="rounded-xl bg-slate-50 px-3 py-3 font-semibold text-slate-700">{zh ? '已保存' : 'Saved'}<span className="mt-1 block text-lg text-slate-900">{history.length}/50</span></p>
                <p className="rounded-xl bg-slate-50 px-3 py-3 font-semibold text-slate-700">{zh ? '平均分' : 'Average'}<span className="mt-1 block text-lg text-slate-900">{average}</span></p>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <button disabled={!records.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e293b] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => {
                  try { downloadHistory(records); setError(null); } catch { setError('download'); }
                }}><Download size={16} />{zh ? '下载记录' : 'Download records'}</button>
                <button disabled={!records.length} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => {
                  if (!window.confirm(zh ? '清空本机的所有练习记录？此操作无法撤销。' : 'Clear all practice history on this device? This cannot be undone.')) return;
                  try { clearHistory(); setRecords([]); setPage(1); setError(null); } catch { setError('clear'); }
                }}><Trash2 size={16} />{zh ? '清空历史' : 'Clear history'}</button>
              </div>
              {error && <p role="alert" className="mt-4 text-sm text-red-600">{error === 'download' ? (zh ? '无法下载记录，请检查浏览器下载权限。' : 'Could not download records. Check browser download permissions.') : (zh ? '无法清空，请检查浏览器存储权限。' : 'Could not clear history. Check browser storage permissions.')}</p>}
            </div>
          </section>
          <SidebarFilters selectedMode={mode} onModeChange={value => { setMode(value); setPage(1); }}/>
        </aside>
        <div className="flex-1 w-full lg:order-1"><MatchHistory groupedHistory={grouped} currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} sidebarHeight={null} sessionsCount={filtered.length}/></div>
      </div>
    </main>
  </div>;
}
