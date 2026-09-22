import React, { useId, useRef, useState } from "react";
import {
  Layout,
  Layers,
  Pencil,
  RefreshCw,
  RotateCcw,
  Info,
} from "lucide-react";
import { HSV, ColorMode } from "../../types/color";
import { channelsForMode, type Channel } from "../../utils/practiceColor";
import { hsvToCss, generateRandomColor } from "../../utils/colorUtils";
import CustomColorPicker from "../common/CustomColorPicker";
import { useLocale } from "../../i18n/LocaleProvider";

const EditColorIcon = ({ color, shape }: { color: HSV; shape: "circle" | "square" }) => (
  <span aria-hidden="true" className="relative block h-5 w-5">
    <span
      className={`absolute left-0 top-0 h-4 w-4 border border-slate-400 ${shape === "circle" ? "rounded-full" : "rounded-[2px]"}`}
      style={{ backgroundColor: hsvToCss(color) }}
    />
    <span className="absolute -bottom-0.5 -right-0.5 p-0.5 text-slate-600">
      <Pencil size={11} strokeWidth={6} className="absolute left-0.5 top-0.5 fill-white text-white" />
      <Pencil size={11} strokeWidth={2} className="relative fill-white" />
    </span>
  </span>
);

interface ColorDisplayProps {
  targetColor: HSV;
  userColor: HSV;
  activeTab: "split" | "overlay";
  onTabChange: (tab: "split" | "overlay") => void;
  onTargetChange: (color: HSV) => void;
  onReset: () => void;
  mode: ColorMode;
  lockedChannels: Channel[];
  onLockToggle: (channel: Channel) => void;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({
  targetColor,
  userColor,
  activeTab,
  onTabChange,
  onTargetChange,
  onReset,
  mode,
  lockedChannels,
  onLockToggle,
}) => {
  const { messages, locale } = useLocale();
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false);
  const [bgColor, setBgColor] = useState<HSV>({ h: 220, s: 15, v: 97 });
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  const lockHelpId = useId();

  const targetRef = useRef<HTMLDivElement>(null);
  const targetBeforeEdit = useRef<HSV>(targetColor);
  const copy = messages.practice.display;

  const openTargetPicker = () => {
    targetBeforeEdit.current = { ...targetColor };
    setIsBgPickerOpen(false);
    setIsCustomPickerOpen(true);
  };

  const handleTargetDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openTargetPicker();
  };

  const handleRandomBg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBgColor(generateRandomColor());
  };

  const handleResetBg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBgColor({ h: 220, s: 15, v: 97 });
  };

  const circleSizeClass = "w-full aspect-square";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider bg-white/60 backdrop-blur-md px-3 py-1 rounded-full shadow-sm";

  return (
    <div className="lg:col-span-5 w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col h-full relative">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        <div className="bg-slate-100 p-1 rounded-lg flex shrink-0">
          <button
            onClick={() => onTabChange("split")}
            className={`flex items-center gap-1.5 px-1.5 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === "split"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Layout size={16} className="hidden sm:block" /> {copy.split}
          </button>
          <button
            onClick={() => onTabChange("overlay")}
            className={`flex items-center gap-1.5 px-1.5 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeTab === "overlay"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Layers size={16} className="hidden sm:block" /> {copy.overlay}
          </button>
        </div>
        <div className="relative flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0" role="group" aria-label={locale === 'zh' ? '锁定随机分量' : 'Lock random channels'}>
          <span className="text-xs text-slate-500">{locale === 'zh' ? '锁定' : 'Lock'}</span>
          <span className="group/lock-help flex items-center">
            <button type="button" aria-label={locale === 'zh' ? '锁定说明' : 'About channel locks'} aria-describedby={lockHelpId}
              className="flex h-6 w-5 items-center justify-center rounded text-slate-400 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
              onKeyDown={(event) => { if (event.key === 'Escape') event.currentTarget.blur(); }}>
              <Info size={14} />
            </button>
            <span id={lockHelpId} role="tooltip"
              className="invisible absolute right-0 top-full z-50 w-60 max-w-[calc(100vw-5rem)] pt-2 opacity-0 transition-opacity group-hover/lock-help:visible group-hover/lock-help:opacity-100 group-focus-within/lock-help:visible group-focus-within/lock-help:opacity-100">
              <span className="block rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-white shadow-lg">
                {locale === 'zh'
                  ? '可多选。点击分量时，锁定右侧对应滑杆的当前值，目标色也同步为该值。随机时仅改变未锁定分量，锁定项不可调节。再次点击可解锁；切换颜色模式会清空锁定。'
                  : 'Select one or more channels to freeze their current slider values and apply them to the target. Randomizing changes only unlocked channels. Locked channels cannot be adjusted. Click again to unlock; switching color mode clears locks.'}
              </span>
            </span>
          </span>
          {channelsForMode(mode).map((key) => (
            <button key={key} type="button" aria-pressed={lockedChannels.includes(key)}
              aria-label={`${locale === 'zh' ? '锁定' : 'Lock'} ${key.toUpperCase()}`}
              onClick={() => onLockToggle(key)}
              className={`w-7 sm:w-8 h-8 rounded-md border text-xs font-bold transition-colors ${lockedChannels.includes(key) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        <div
          className="relative w-full h-60 md:h-72 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center overflow-visible transition-colors duration-300"
          style={{ backgroundColor: hsvToCss(bgColor) }}
        >
          <span className={`absolute top-4 left-5 ${labelClass} select-none z-10`}>
            {copy.target}
          </span>
          <span className={`absolute top-4 right-5 ${labelClass} select-none z-10`}>
            {copy.preview}
          </span>

          <div className="absolute bottom-3 left-3 z-30 custom-color-picker-container">
            {isCustomPickerOpen && (
              <div className="absolute bottom-full left-0 mb-3 z-50 animate-fade-in">
                <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 w-64 custom-color-picker-container">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase">{copy.target}</span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => onTargetChange(generateRandomColor())}
                        disabled={lockedChannels.length === 3}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title={copy.randomizeTarget}>
                        <RefreshCw size={14} />
                      </button>
                      <button type="button" onClick={() => onTargetChange(targetBeforeEdit.current)}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-md transition-colors"
                        title={copy.resetTarget}>
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>
                  <CustomColorPicker color={targetColor} onChange={onTargetChange}
                    onClose={() => setIsCustomPickerOpen(false)}
                    className="!shadow-none !border-none !p-0 !w-full" />
                </div>
              </div>
            )}
            <button type="button"
              onClick={() => isCustomPickerOpen ? setIsCustomPickerOpen(false) : openTargetPicker()}
              aria-expanded={isCustomPickerOpen}
              className={`p-2 rounded-full transition-all shadow-sm ${isCustomPickerOpen ? 'bg-indigo-600 text-white' : 'bg-white/80 hover:bg-white text-slate-500 hover:text-indigo-600'}`}
              title={copy.changeTarget}>
              <EditColorIcon color={targetColor} shape="circle" />
            </button>
          </div>

          <div className="absolute bottom-3 right-3 z-30 custom-color-picker-container">
            {isBgPickerOpen && (
              <div className="absolute bottom-full right-0 mb-3 z-50 animate-fade-in">
                <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 w-64 custom-color-picker-container">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {copy.background}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={handleRandomBg}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-md transition-colors"
                        title={copy.randomizeBackground}
                      >
                        <RefreshCw size={14} />
                      </button>
                      <button
                        onClick={handleResetBg}
                        className="p-1.5 hover:bg-slate-100 text-slate-500 rounded-md transition-colors"
                        title={copy.resetBackground}
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>
                  <CustomColorPicker
                    color={bgColor}
                    onChange={setBgColor}
                    onClose={() => setIsBgPickerOpen(false)}
                    className="!shadow-none !border-none !p-0 !w-full"
                  />
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setIsCustomPickerOpen(false);
                setIsBgPickerOpen(!isBgPickerOpen);
              }}
              aria-expanded={isBgPickerOpen}
              className={`p-2 rounded-full transition-all shadow-sm ${
                isBgPickerOpen
                  ? "bg-indigo-600 text-white"
                  : "bg-white/80 hover:bg-white text-slate-500 hover:text-indigo-600"
              }`}
              title={copy.changeBackground}
            >
              <EditColorIcon color={bgColor} shape="square" />
            </button>
          </div>

          {activeTab === "split" ? (
            <div className="grid grid-cols-2 gap-4 items-center justify-items-center w-full max-w-[24rem] px-4">
              <div className="w-full max-w-40 min-w-0 relative">
                <div
                  ref={targetRef}
                  className={`${circleSizeClass} rounded-full shadow-lg cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] relative group`}
                  style={{ backgroundColor: hsvToCss(targetColor) }}
                  onClick={onReset}
                  onDoubleClick={handleTargetDoubleClick}
                  title={copy.targetTitle}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full shadow-sm pointer-events-none">
                      {copy.random}
                    </span>
                  </div>
                </div>

              </div>

              <div className="w-full max-w-40 min-w-0">
                <div
                  className={`${circleSizeClass} rounded-full shadow-lg transition-colors duration-75`}
                  style={{ backgroundColor: hsvToCss(userColor) }}
                />
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center px-4">
              <div className="flex items-center justify-center w-full">
                <div className="relative z-10 w-[min(60%,10rem)] shrink-0">
                  <div
                    ref={targetRef}
                    className={`${circleSizeClass} rounded-full shadow-lg cursor-pointer transition-transform hover:scale-[1.01]`}
                    style={{ backgroundColor: hsvToCss(targetColor) }}
                    onClick={onReset}
                    onDoubleClick={handleTargetDoubleClick}
                    title={copy.targetOnlyTitle}
                  />

                </div>

                <div className="relative z-20 w-[min(60%,10rem)] shrink-0 -ml-[min(25%,5rem)]">
                  <div
                    className={`${circleSizeClass} rounded-full shadow-xl transition-colors duration-75`}
                    style={{ backgroundColor: hsvToCss(userColor) }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-500 border-t border-slate-100 pt-5">
        <p className="flex items-start gap-2">
          <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
            1
          </span>
          {copy.step1}
        </p>
        <p className="flex items-start gap-2">
          <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
            2
          </span>
          {copy.step2}
        </p>
        <p className="flex items-start gap-2">
          <span className="bg-indigo-100 text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mt-0.5 flex-shrink-0">
            3
          </span>
          {copy.step3}
        </p>
      </div>
    </div>
  );
};

export default ColorDisplay;
