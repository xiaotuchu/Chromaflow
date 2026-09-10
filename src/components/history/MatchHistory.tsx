import React, { useEffect, useState } from "react";
import { History, Palette, ChevronLeft, ChevronRight } from "lucide-react";
import MatchCard from "./MatchCard";
import type { HistoryItem } from "@/types/history";
import { useLocale } from "../../i18n/LocaleProvider";

interface MatchHistoryProps {
  groupedHistory: Record<string, HistoryItem[]>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sidebarHeight: number | null;
  sessionsCount: number;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({
  groupedHistory,
  currentPage,
  totalPages,
  onPageChange,
  sidebarHeight,
  sessionsCount,
}) => {
  const { locale } = useLocale();
  const [pageInput, setPageInput] = useState<string>("");
  const copy =
    locale === "zh"
      ? {
          title: "最近匹配记录",
          totalSessions: "总场次",
          empty: "暂无结果",
          goTo: "跳转到",
          go: "前往",
        }
      : {
          title: "Recent Matches",
          totalSessions: "Sessions Total",
          empty: "Empty results",
          goTo: "Go to",
          go: "Go",
        };

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const buildPageItems = (): Array<number | "..."> => {
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    pages.add(currentPage);
    pages.add(currentPage - 1);
    pages.add(currentPage + 1);
    pages.add(2);
    pages.add(totalPages - 1);

    const sorted = Array.from(pages)
      .filter((p) => p >= 1 && p <= totalPages)
      .sort((a, b) => a - b);

    const result: Array<number | "..."> = [];
    sorted.forEach((page, idx) => {
      if (idx === 0) {
        result.push(page);
        return;
      }
      const prev = sorted[idx - 1];
      if (page - prev === 1) {
        result.push(page);
      } else {
        result.push("...");
        result.push(page);
      }
    });

    return result;
  };

  const pageItems = buildPageItems();

  const handleJump = () => {
    const val = parseInt(pageInput, 10);
    if (Number.isNaN(val) || val < 1 || val > totalPages) return;
    onPageChange(val);
  };

  return (
    <div className="flex-1 flex flex-col w-full min-w-0">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <History size={20} className="text-sky-500" />
          {copy.title}
        </h2>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {sessionsCount} {copy.totalSessions}
        </div>
      </div>

      <div
        style={
          sidebarHeight
            ? { height: `${Math.max(0, sidebarHeight - 48)}px` }
            : undefined
        }
        className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col transition-[height] duration-200"
      >
        <div className="flex-grow space-y-8 overflow-hidden">
          {sessionsCount > 0 ? (
            (Object.entries(groupedHistory) as [string, HistoryItem[]][]).map(
              ([label, items]) => (
                <div key={label} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3
                      data-group-header
                      className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                        label === "Today" ? "text-sky-500" : "text-slate-400"
                      }`}
                    >
                      {label}
                    </h3>
                    <div className="h-px flex-1 bg-slate-50"></div>
                  </div>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <MatchCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-30">
              <Palette size={48} className="mb-4" />
              <p className="font-medium">{copy.empty}</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 pt-6 mt-auto border-t border-slate-50 flex-wrap">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          <div className="flex items-center gap-1.5">
            {pageItems.map((item, idx) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-300 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => onPageChange(item)}
                  className={`w-8 h-8 rounded-lg font-bold text-[10px] transition-all ${
                    currentPage === item
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-slate-400"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-500">{copy.goTo}</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJump();
                }}
                className="w-16 h-9 rounded-lg border border-slate-200 px-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <button
                onClick={handleJump}
                className="px-3 h-9 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                {copy.go}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;
