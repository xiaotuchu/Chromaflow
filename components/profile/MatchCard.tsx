import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLocale } from "../../i18n/LocaleProvider";

export type ColorSpace = "hsv" | "rgb" | "hsl";

export interface ColorValues {
  v1: number;
  v2: number;
  v3: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  submittedMode: ColorSpace;
  target: ColorValues;
  match: ColorValues;
  accuracy: number;
  targetHex: string;
  guessHex: string;
}

interface MatchCardProps {
  item: HistoryItem;
}

const MatchCard: React.FC<MatchCardProps> = ({ item }) => {
  const { locale } = useLocale();
  const renderColorLabel = (mode: ColorSpace, values: ColorValues) => {
    const labels = {
      hsv: ["H", "S", "V"],
      rgb: ["R", "G", "B"],
      hsl: ["H", "S", "L"],
    }[mode];
    const units = {
      hsv: ["°", "%", "%"],
      rgb: ["", "", ""],
      hsl: ["°", "%", "%"],
    }[mode];
    return `${labels[0]}:${Math.round(values.v1)}${units[0]} ${
      labels[1]
    }:${Math.round(values.v2)}${units[1]} ${labels[2]}:${Math.round(
      values.v3
    )}${units[2]}`;
  };
  const copy =
    locale === "zh"
      ? { target: "目标色", match: "匹配色", yours: "你的结果" }
      : { target: "Target", match: "Match", yours: "Yours" };

  return (
    <div
      className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row items-center gap-6 group hover:bg-white hover:shadow-md transition-all"
      data-match-card
    >
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] uppercase font-bold text-slate-300">
            {copy.target}
          </span>
          <div
            className="w-12 h-12 rounded-xl border border-white"
            style={{ backgroundColor: item.targetHex }}
          ></div>
        </div>
        <div className="text-slate-200">
          <ArrowLeft size={16} className="rotate-180" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] uppercase font-bold text-slate-300">
            {copy.match}
          </span>
          <div
            className="w-12 h-12 rounded-xl border border-white opacity-80"
            style={{ backgroundColor: item.guessHex }}
          ></div>
        </div>
      </div>
      <div className="flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 w-full">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400">
              {item.date}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white text-[9px] font-bold text-slate-400 uppercase border border-slate-200">
              {item.submittedMode}
            </span>
          </div>
          <span
            className={`text-xs font-bold ${
              item.accuracy > 95 ? "text-emerald-500" : "text-orange-500"
            }`}
          >
            {item.accuracy}%
          </span>
        </div>
        <div className="grid grid-cols-1 gap-1 text-[10px] font-mono text-slate-500 uppercase">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-300 font-sans normal-case">
              {copy.target}:
            </span>
            <span>{renderColorLabel(item.submittedMode, item.target)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-300 font-sans normal-case">
              {copy.yours}:
            </span>
            <span className="text-slate-900 font-bold">
              {renderColorLabel(item.submittedMode, item.match)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
