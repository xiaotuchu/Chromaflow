import React from "react";
import { Filter, CalendarDays } from "lucide-react";
import { ColorSpace } from "./MatchCard";
import { useLocale } from "../../i18n/LocaleProvider";

interface SidebarFiltersProps {
  selectedMode: ColorSpace | "all";
  onModeChange: (mode: ColorSpace | "all") => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onReset: () => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedMode,
  onModeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) => {
  const { locale } = useLocale();
  const copy =
    locale === "zh"
      ? {
          title: "筛选",
          submissionMode: "提交模式",
          dateRange: "日期范围",
          reset: "重置所有筛选",
          all: "全部",
        }
      : {
          title: "Filters",
          submissionMode: "Submission Mode",
          dateRange: "Date Range",
          reset: "Reset all filters",
          all: "ALL",
        };
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 px-1">
        <Filter size={20} className="text-sky-500" />
        {copy.title}
      </h2>
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
            {copy.submissionMode}
          </label>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {(["all", "hsv", "rgb", "hsl"] as (ColorSpace | "all")[]).map(
              (mode) => (
                <button
                  key={mode}
                  onClick={() => onModeChange(mode)}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                    selectedMode === mode
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {mode === "all" ? copy.all : mode.toUpperCase()}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <CalendarDays size={12} /> {copy.dateRange}
          </label>
          <div className="grid grid-cols-1 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-700"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-slate-700"
            />
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-2 text-[10px] font-bold text-slate-400 hover:text-sky-500 border-t border-slate-50 mt-2 transition-colors uppercase tracking-widest"
        >
          {copy.reset}
        </button>
      </div>
    </section>
  );
};

export default SidebarFilters;
