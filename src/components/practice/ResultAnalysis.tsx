import React from "react";
import { Link } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { ColorFeedback, HSV, ColorMode } from "../../types/color";
import { hsvToCss, hsvToRgb, hsvToHsl } from "../../utils/colorUtils";
import { getRoutePath } from "../../routes";
import { useLocale } from "../../i18n/LocaleProvider";

interface ResultAnalysisProps {
  feedback: ColorFeedback;
  targetColor: HSV;
  userColor: HSV;
  mode: ColorMode;
  saveStatus: "saved" | "failed" | null;
}

const ResultAnalysis: React.FC<ResultAnalysisProps> = ({
  feedback,
  targetColor,
  userColor,
  mode,
  saveStatus,
}) => {
  const { locale } = useLocale();
  const copy =
    locale === "zh"
      ? {
          targetLabel: "目标值",
          targetSwatch: "目标色",
          yourMatch: "你的匹配",
          red: "红",
          green: "绿",
          blue: "蓝",
          hue: "色相",
          saturation: "饱和度",
          value: "明度",
          lightness: "亮度",
          degreeUnit: "\u00B0",
        }
      : {
          targetLabel: "Target",
          targetSwatch: "Target",
          yourMatch: "Your Match",
          red: "Red",
          green: "Green",
          blue: "Blue",
          hue: "Hue",
          saturation: "Saturation",
          value: "Value",
          lightness: "Lightness",
          degreeUnit: "\u00B0",
        };

  const fmt = (val: number) =>
    Number.isFinite(val) ? Number(val.toFixed(2)) : val;

  const renderRow = (
    label: string,
    userVal: number,
    targetVal: number,
    unit = ""
  ) => {
    const diff = userVal - targetVal;
    const diffDisplay = `${diff > 0 ? "+" : ""}${fmt(diff)}${unit}`;
    const isClose = Math.abs(diff) < 5;

    return (
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700">{label}</span>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-2.5 py-1 rounded-md text-sm font-bold ${
              isClose ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {diffDisplay}
          </span>
          <span className="text-sm text-slate-400 font-mono">
            ({copy.targetLabel}: {fmt(targetVal)})
          </span>
        </div>
      </div>
    );
  };

  const userRgb = hsvToRgb(userColor.h, userColor.s, userColor.v);
  const targetRgb = hsvToRgb(targetColor.h, targetColor.s, targetColor.v);
  const userHsl = hsvToHsl(userColor.h, userColor.s, userColor.v);
  const targetHsl = hsvToHsl(targetColor.h, targetColor.s, targetColor.v);
  const formatColorSummary = (
    currentMode: ColorMode,
    color: HSV,
    rgb: ReturnType<typeof hsvToRgb>,
    hsl: ReturnType<typeof hsvToHsl>
  ) => {
    if (currentMode === "HSV") {
      return `hsv(${fmt(color.h)}, ${fmt(color.s)}, ${fmt(color.v)})`;
    }

    if (currentMode === "RGB") {
      return `rgb(${fmt(rgb.r)}, ${fmt(rgb.g)}, ${fmt(rgb.b)})`;
    }

    return `hsl(${fmt(hsl.h)}, ${fmt(hsl.s)}, ${fmt(hsl.l)})`;
  };

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in ring-4 ring-slate-50">
      <div className="mb-6 flex justify-between items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="text-xl font-bold text-slate-900">{feedback.message}</h2>
            {saveStatus === "failed" && (
              <div data-save-status className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                <CircleAlert size={14} strokeWidth={2.5} />
                {locale === "zh" ? "无法保存" : "Could not save"}
              </div>
            )}
          </div>
          {saveStatus === "saved" && <Link
            to={getRoutePath(locale, "profile")}
            className="mt-2 inline-flex text-xs font-normal text-slate-500 transition hover:font-semibold hover:text-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca] focus:ring-offset-2"
          >
            {locale === "zh" ? "本次练习记录已保存，点击查看历史" : "This practice round was saved. View history"}
          </Link>}
        </div>
        <div className="ml-4 shrink-0">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600">
            {feedback.score}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-4">
          {mode === "HSV" && (
            <>
              {renderRow(
                copy.hue,
                feedback.hDiff + targetColor.h,
                targetColor.h,
                copy.degreeUnit
              )}
              {renderRow(
                copy.saturation,
                feedback.sDiff + targetColor.s,
                targetColor.s,
                "%"
              )}
              {renderRow(
                copy.value,
                feedback.vDiff + targetColor.v,
                targetColor.v,
                "%"
              )}
            </>
          )}

          {mode === "RGB" && (
            <>
              {renderRow(copy.red, userRgb.r, targetRgb.r)}
              {renderRow(copy.green, userRgb.g, targetRgb.g)}
              {renderRow(copy.blue, userRgb.b, targetRgb.b)}
            </>
          )}

          {mode === "HSL" && (
            <>
              {renderRow(copy.hue, userHsl.h, targetHsl.h, copy.degreeUnit)}
              {renderRow(copy.saturation, userHsl.s, targetHsl.s, "%")}
              {renderRow(copy.lightness, userHsl.l, targetHsl.l, "%")}
            </>
          )}
        </div>

        <div className="md:w-1/3 flex flex-col justify-center space-y-6 pl-0 md:pl-8 md:border-l border-slate-100">
          <div className="flex items-center justify-between group">
            <div className="text-right flex-1 pr-4">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                {copy.targetSwatch}
              </div>
              <div className="font-mono text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block">
                {formatColorSummary(mode, targetColor, targetRgb, targetHsl)}
              </div>
            </div>
            <div
              className="w-14 h-14 rounded-full shadow-sm border-2 border-white ring-1 ring-slate-200"
              style={{ backgroundColor: hsvToCss(targetColor) }}
            />
          </div>

          <div className="flex items-center justify-between group">
            <div className="text-right flex-1 pr-4">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                {copy.yourMatch}
              </div>
              <div className="font-mono text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded inline-block">
                {formatColorSummary(mode, userColor, userRgb, userHsl)}
              </div>
            </div>
            <div
              className="w-14 h-14 rounded-full shadow-sm border-2 border-white ring-1 ring-slate-200"
              style={{ backgroundColor: hsvToCss(userColor) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalysis;
