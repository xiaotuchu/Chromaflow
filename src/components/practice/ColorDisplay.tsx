import React, { useRef, useState } from "react";
import {
  Layout,
  Layers,
  PaintBucket,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { HSV } from "../../types/color";
import { hsvToCss, generateRandomColor } from "../../utils/colorUtils";
import CustomColorPicker from "../common/CustomColorPicker";
import { useLocale } from "../../i18n/LocaleProvider";

interface ColorDisplayProps {
  targetColor: HSV;
  userColor: HSV;
  activeTab: "split" | "overlay";
  onTabChange: (tab: "split" | "overlay") => void;
  onTargetChange: (color: HSV) => void;
  onReset: () => void;
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({
  targetColor,
  userColor,
  activeTab,
  onTabChange,
  onTargetChange,
  onReset,
}) => {
  const { messages } = useLocale();
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false);
  const [bgColor, setBgColor] = useState<HSV>({ h: 220, s: 15, v: 97 });
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);

  const targetRef = useRef<HTMLDivElement>(null);
  const copy = messages.practice.display;

  const handleTargetDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCustomPickerOpen(true);
  };

  const handleRandomBg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBgColor(generateRandomColor());
  };

  const handleResetBg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBgColor({ h: 220, s: 15, v: 97 });
  };

  const circleSizeClass = "w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40";
  const labelClass =
    "text-xs font-bold text-slate-600 uppercase tracking-wider bg-white/60 backdrop-blur-md px-3 py-1 rounded-full shadow-sm";

  return (
    <div className="lg:col-span-5 w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full relative">
      <div className="bg-slate-100 p-1 rounded-lg flex mb-6 self-start">
        <button
          onClick={() => onTabChange("split")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "split"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layout size={16} /> {copy.split}
        </button>
        <button
          onClick={() => onTabChange("overlay")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "overlay"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Layers size={16} /> {copy.overlay}
        </button>
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

          <div className="absolute bottom-3 right-3 z-30">
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
              onClick={() => setIsBgPickerOpen(!isBgPickerOpen)}
              className={`p-2 rounded-full transition-all shadow-sm ${
                isBgPickerOpen
                  ? "bg-indigo-600 text-white"
                  : "bg-white/80 hover:bg-white text-slate-500 hover:text-indigo-600"
              }`}
              title={copy.changeBackground}
            >
              <PaintBucket size={18} />
            </button>
          </div>

          {activeTab === "split" ? (
            <div className="flex gap-4 sm:gap-8 md:gap-12 items-center justify-center w-full px-3 sm:px-0">
              <div className="flex flex-col items-center gap-4 relative">
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

                {isCustomPickerOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50">
                    <CustomColorPicker
                      color={targetColor}
                      onChange={onTargetChange}
                      onClose={() => setIsCustomPickerOpen(false)}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-4">
                <div
                  className={`${circleSizeClass} rounded-full shadow-lg transition-colors duration-75`}
                  style={{ backgroundColor: hsvToCss(userColor) }}
                />
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="flex items-center">
                <div className="relative z-10">
                  <div
                    ref={targetRef}
                    className={`${circleSizeClass} rounded-full shadow-lg cursor-pointer transition-transform hover:scale-[1.01]`}
                    style={{ backgroundColor: hsvToCss(targetColor) }}
                    onClick={onReset}
                    onDoubleClick={handleTargetDoubleClick}
                    title={copy.targetOnlyTitle}
                  />

                  {isCustomPickerOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50">
                      <CustomColorPicker
                        color={targetColor}
                        onChange={onTargetChange}
                        onClose={() => setIsCustomPickerOpen(false)}
                      />
                    </div>
                  )}
                </div>

                <div className="relative z-20 -ml-12 md:-ml-20">
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

      <div className="mt-8 space-y-2 text-sm text-slate-500 border-t border-slate-100 pt-6">
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
