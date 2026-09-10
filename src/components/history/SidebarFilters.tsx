import React from "react";
import { Filter } from "lucide-react";
import type { ColorSpace } from "@/types/history";
import { useLocale } from "../../i18n/LocaleProvider";

interface SidebarFiltersProps {
  selectedMode: ColorSpace | "all";
  onModeChange: (mode: ColorSpace | "all") => void;
}

const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  selectedMode,
  onModeChange,
}) => {
  const { locale } = useLocale();
  const copy =
    locale === "zh"
      ? {
          title: "筛选",
          submissionMode: "提交模式",
          all: "全部",
        }
      : {
          title: "Filters",
          submissionMode: "Submission Mode",
          all: "ALL",
        };
  return (
    <section className="space-y-4" data-history-filters>
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

      </div>
    </section>
  );
};

export default SidebarFilters;
