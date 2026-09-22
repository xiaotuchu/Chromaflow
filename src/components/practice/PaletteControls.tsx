import React, { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { HSV, RGB, HSL, ColorMode } from "../../types/color";
import { hsvToRgb, rgbToHsv } from "../../utils/colorUtils";
import { useLocale } from "../../i18n/LocaleProvider";
import MobileDimensionWheel from "./MobileDimensionWheel";
import SlidersList from "./SlidersList";
import ColorPlane from "./ColorPlane";
import { toChannels, type Channel, type HueView, type PlaneShape } from "../../utils/practiceColor";

interface PaletteControlsProps {
  userColor: HSV;
  userHsl: HSL;
  targetColor: HSV;
  onChange: (color: HSV) => void;
  onHslChange: (color: HSL) => void;
  onSubmit: () => void;
  onNext: () => void;
  showFeedbackMarkers: boolean;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  lockedChannels: Channel[];
}

const PaletteControls: React.FC<PaletteControlsProps> = ({
  userColor,
  userHsl,
  targetColor,
  onChange,
  onHslChange,
  onSubmit,
  onNext,
  showFeedbackMarkers,
  mode,
  setMode,
  lockedChannels,
}) => {
  const { locale } = useLocale();
  const [activeDimIndex, setActiveDimIndex] = useState(0);

  const [hueView, setHueView] = useState<HueView>('bar');
  const [shape, setShape] = useState<PlaneShape>('square');
  const hueDisabled = lockedChannels.length === 3 || (mode !== 'RGB' && lockedChannels.includes('h'));
  const planeDisabled = lockedChannels.length === 3 || (
    mode !== 'RGB' && lockedChannels.includes('s') && lockedChannels.includes(mode === 'HSV' ? 'v' : 'l')
  );

  const copy =
    locale === "zh"
      ? {
          title: "调色控制",
          mobileTitle: "控制",
          submit: "提交",
          next: "下一题",
          hue: "色相",
          saturation: "饱和度",
          value: "明度",
          lightness: "亮度",
          red: "红",
          green: "绿",
          blue: "蓝",
          saturationShort: "饱和",
          valueShort: "明度",
          lightnessShort: "亮度",
          degreeUnit: "\u00B0",
        }
      : {
          title: "Palette Controls",
          mobileTitle: "Controls",
          submit: "Submit",
          next: "Next",
          hue: "Hue",
          saturation: "Saturation",
          value: "Value",
          lightness: "Lightness",
          red: "Red",
          green: "Green",
          blue: "Blue",
          saturationShort: "Sat.",
          valueShort: "Value",
          lightnessShort: "Light.",
          degreeUnit: "\u00B0",
        };

  const getDimensions = () => {
    const rgb = hsvToRgb(userColor.h, userColor.s, userColor.v);
    const hsl = userHsl;

    switch (mode) {
      case "RGB":
        return [
          {
            name: copy.red,
            short: copy.red,
            val: rgb.r,
            max: 255,
            unit: "",
            key: "r",
          },
          {
            name: copy.green,
            short: copy.green,
            val: rgb.g,
            max: 255,
            unit: "",
            key: "g",
          },
          {
            name: copy.blue,
            short: copy.blue,
            val: rgb.b,
            max: 255,
            unit: "",
            key: "b",
          },
        ];
      case "HSL":
        return [
          {
            name: copy.hue,
            short: copy.hue,
            val: hsl.h,
            max: 360,
            unit: copy.degreeUnit,
            key: "h",
          },
          {
            name: copy.saturation,
            short: copy.saturationShort,
            val: hsl.s,
            max: 100,
            unit: "%",
            key: "s",
          },
          {
            name: copy.lightness,
            short: copy.lightnessShort,
            val: hsl.l,
            max: 100,
            unit: "%",
            key: "l",
          },
        ];
      default:
        return [
          {
            name: copy.hue,
            short: copy.hue,
            val: userColor.h,
            max: 360,
            unit: copy.degreeUnit,
            key: "h",
          },
          {
            name: copy.saturation,
            short: copy.saturationShort,
            val: userColor.s,
            max: 100,
            unit: "%",
            key: "s",
          },
          {
            name: copy.value,
            short: copy.valueShort,
            val: userColor.v,
            max: 100,
            unit: "%",
            key: "v",
          },
        ];
    }
  };

  const dimensions = getDimensions();

  const handleAdjustValue = (delta: number) => {
    const dim = dimensions[activeDimIndex];
    if (lockedChannels.includes(dim.key as Channel)) return;
    let newVal = dim.val + delta;

    if (dim.key === "h") {
      if (newVal < 0) {
        newVal = 359;
      }
      if (newVal > 359) {
        newVal = 0;
      }
    } else {
      newVal = Math.max(0, Math.min(dim.max, newVal));
    }

    if (mode === "RGB") {
      const rgb = hsvToRgb(userColor.h, userColor.s, userColor.v);
      const channels = ["r", "g", "b"] as const;
      const newRgb = { ...rgb, [channels[activeDimIndex]]: newVal };
      onChange(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
    } else if (mode === "HSL") {
      const hsl = userHsl;
      const channels = ["h", "s", "l"] as const;
      const newHsl = { ...hsl, [channels[activeDimIndex]]: newVal };
      onHslChange(newHsl);
    } else {
      const channels = ["h", "s", "v"] as const;
      onChange({ ...userColor, [channels[activeDimIndex]]: newVal });
    }
  };

  const handleHsvChange = (key: keyof HSV, value: number) =>
    onChange({ ...userColor, [key]: value });

  const handleRgbChange = (channel: keyof RGB, val: number) => {
    const rgb = hsvToRgb(userColor.h, userColor.s, userColor.v);
    const newRgb = { ...rgb, [channel]: val };
    onChange(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (channel: keyof HSL, val: number) => {
    const hsl = userHsl;
    const newHsl = { ...hsl, [channel]: val };
    onHslChange(newHsl);
  };

  const rgb = hsvToRgb(userColor.h, userColor.s, userColor.v);
  const hsl = userHsl;
  const targetRgb = hsvToRgb(targetColor.h, targetColor.s, targetColor.v);
  const targetValues = toChannels(targetColor, 'HSL');
  const targetHsl: HSL = { h: targetValues.h!, s: targetValues.s!, l: targetValues.l! };

  return (
    <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 w-full p-4 md:p-6 flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 hidden md:block">
          {copy.title}
        </h2>
        <h2 className="text-lg font-bold text-slate-900 md:hidden">
          {copy.mobileTitle}
        </h2>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          {(["HSV", "RGB", "HSL"] as ColorMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all ${
                mode === m
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-6 text-xs">
        <div className="flex items-center gap-2" role="group" aria-label={locale === 'zh' ? '色相视图' : 'Hue view'}>
          <span className="text-slate-500">{locale === 'zh' ? '色相' : 'Hue'}</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['bar', 'ring'] as const).map((view) => <button key={view} aria-pressed={hueView === view} onClick={() => setHueView(view)}
              className={`px-3 py-1.5 rounded-md font-medium ${hueView === view ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {locale === 'zh' ? view === 'bar' ? '色相条' : '色相环' : view === 'bar' ? 'Bar' : 'Ring'}
            </button>)}
          </div>
        </div>
        <div className="flex items-center gap-2" role="group" aria-label={locale === 'zh' ? '调色板形状' : 'Palette shape'}>
          <span className="text-slate-500">{locale === 'zh' ? '调色板' : 'Palette'}</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['square', 'triangle'] as const).map((value) => <button key={value} aria-pressed={shape === value} onClick={() => setShape(value)}
              className={`px-3 py-1.5 rounded-md font-medium ${shape === value ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {locale === 'zh' ? value === 'square' ? '正方形' : '三角形' : value === 'square' ? 'Square' : 'Triangle'}
            </button>)}
          </div>
        </div>
        {hueView === 'ring' && <span className={`font-mono ml-auto ${hueDisabled ? 'text-slate-400' : 'text-slate-600'}`}>H {Math.round(userColor.h)}°</span>}
      </div>

      <div className="flex flex-col gap-6">
        <div className="md:hidden flex flex-col gap-4">
          <div className="flex items-center gap-2 sm:gap-4 h-36 sm:h-40 min-w-0">
            <ColorPlane color={userColor} onChange={onChange} shape={shape} hueView={hueView}
              hueDisabled={hueDisabled} planeDisabled={planeDisabled}
              targetHue={showFeedbackMarkers ? targetColor.h : undefined}
              className="w-24 min-[375px]:w-32 sm:w-40" />

            <div className="flex-grow min-w-0 flex flex-col items-center justify-center h-full">
              <div className="w-full min-w-0 flex items-center justify-between gap-1">
                <button
                  disabled={lockedChannels.includes(dimensions[activeDimIndex].key as Channel)}
                  aria-label={locale === 'zh' ? '减少当前分量' : 'Decrease current channel'}
                  onClick={() => handleAdjustValue(-1)}
                  className="w-8 h-10 sm:w-9 sm:h-11 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-500 active:bg-slate-50 shadow-md shadow-slate-200/70 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>

                <MobileDimensionWheel
                  activeDimIndex={activeDimIndex}
                  dimensions={dimensions}
                  onPrev={() => setActiveDimIndex((activeDimIndex + 2) % 3)}
                  onNext={() => setActiveDimIndex((activeDimIndex + 1) % 3)}
                />

                <button
                  disabled={lockedChannels.includes(dimensions[activeDimIndex].key as Channel)}
                  aria-label={locale === 'zh' ? '增加当前分量' : 'Increase current channel'}
                  onClick={() => handleAdjustValue(1)}
                  className="w-8 h-10 sm:w-9 sm:h-11 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 active:bg-slate-50 shadow-md shadow-slate-200/70 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col md:flex-row gap-8">
          <ColorPlane color={userColor} onChange={onChange} shape={shape} hueView={hueView}
            hueDisabled={hueDisabled} planeDisabled={planeDisabled}
            targetHue={showFeedbackMarkers ? targetColor.h : undefined}
            className="w-56 xl:w-64" />

          <div className="hidden md:flex flex-grow flex-col space-y-10 py-2">
            <SlidersList
              lockedChannels={lockedChannels}
              hideHue={hueView === "ring"}
              mode={mode}
              userColor={userColor}
              targetColor={targetColor}
              rgb={rgb}
              hsl={hsl}
              targetRgb={targetRgb}
              targetHsl={targetHsl}
              showFeedbackMarkers={showFeedbackMarkers}
              handleHsvChange={handleHsvChange}
              handleRgbChange={handleRgbChange}
              handleHslChange={handleHslChange}
            />
          </div>
        </div>

        <div className="md:hidden flex-grow space-y-6 py-2">
          <SlidersList
            lockedChannels={lockedChannels}
            hideHue={hueView === "ring"}
            mode={mode}
            userColor={userColor}
            targetColor={targetColor}
            rgb={rgb}
            hsl={hsl}
            targetRgb={targetRgb}
            targetHsl={targetHsl}
            showFeedbackMarkers={showFeedbackMarkers}
            handleHsvChange={handleHsvChange}
            handleRgbChange={handleRgbChange}
            handleHslChange={handleHslChange}
          />
        </div>
      </div>

      <div className="flex-grow min-h-6" />
      <div className="flex gap-3 md:gap-4 pt-4 border-t border-slate-100">
        <button
          onClick={onSubmit}
          className="flex-1 py-3 md:py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base"
        >
          <Check size={18} strokeWidth={3} /> {copy.submit}
        </button>
        <button
          disabled={lockedChannels.length === 3}
          onClick={onNext}
          className="flex-1 py-3 md:py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
        >
          {copy.next}
        </button>
      </div>
    </div>
  );
};

export default PaletteControls;
