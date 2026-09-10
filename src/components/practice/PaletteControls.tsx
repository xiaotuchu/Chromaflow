import React, { useEffect, useRef, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { HSV, RGB, HSL, ColorMode } from "../../types/color";
import { hsvToRgb, rgbToHsv, hsvToHsl, hslToHsv } from "../../utils/colorUtils";
import { useLocale } from "../../i18n/LocaleProvider";
import MobileDimensionWheel from "./MobileDimensionWheel";
import SlidersList from "./SlidersList";
import SvBox from "./SvBox";

interface PaletteControlsProps {
  userColor: HSV;
  targetColor: HSV;
  onChange: (color: HSV) => void;
  onSubmit: () => void;
  onNext: () => void;
  showFeedbackMarkers: boolean;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
}

const PaletteControls: React.FC<PaletteControlsProps> = ({
  userColor,
  targetColor,
  onChange,
  onSubmit,
  onNext,
  showFeedbackMarkers,
  mode,
  setMode,
}) => {
  const { locale } = useLocale();
  const [activeDimIndex, setActiveDimIndex] = useState(0);

  const svBoxRefDesktop = useRef<HTMLDivElement>(null);
  const svBoxRefMobile = useRef<HTMLDivElement>(null);
  const activeSvRef = useRef<HTMLDivElement | null>(null);
  const isDraggingSv = useRef(false);

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

  const updateSvFromEvent = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
    targetRef?: React.RefObject<HTMLDivElement>,
  ) => {
    const box = targetRef?.current ?? activeSvRef.current;
    if (!box) {
      return;
    }

    const rect = box.getBoundingClientRect();

    let clientX: number | undefined;
    let clientY: number | undefined;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("changedTouches" in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (clientX === undefined || clientY === undefined) {
      return;
    }

    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    const newS = Math.round((x / rect.width) * 100);
    const newV = Math.round(100 - (y / rect.height) * 100);

    onChange({ ...userColor, s: newS, v: newV });
  };

  const handleSvInteractionStart = (
    e: React.MouseEvent | React.TouchEvent,
    targetRef: React.RefObject<HTMLDivElement>,
  ) => {
    isDraggingSv.current = true;
    activeSvRef.current = targetRef.current;
    updateSvFromEvent(e, targetRef);
  };

  useEffect(() => {
    const handleGlobalInteractionEnd = () => {
      isDraggingSv.current = false;
    };

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (isDraggingSv.current) {
        if (e.type === "touchmove") {
          e.preventDefault();
        }
        updateSvFromEvent(e);
      }
    };

    window.addEventListener("mouseup", handleGlobalInteractionEnd);
    window.addEventListener("touchend", handleGlobalInteractionEnd);
    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("touchmove", handleGlobalMove, { passive: false });

    return () => {
      window.removeEventListener("mouseup", handleGlobalInteractionEnd);
      window.removeEventListener("touchend", handleGlobalInteractionEnd);
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("touchmove", handleGlobalMove);
    };
  }, [userColor]); // eslint-disable-line react-hooks/exhaustive-deps

  const getDimensions = () => {
    const rgb = hsvToRgb(userColor.h, userColor.s, userColor.v);
    const hsl = hsvToHsl(userColor.h, userColor.s, userColor.v);

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
      const hsl = hsvToHsl(userColor.h, userColor.s, userColor.v);
      const channels = ["h", "s", "l"] as const;
      const newHsl = { ...hsl, [channels[activeDimIndex]]: newVal };
      onChange(hslToHsv(newHsl.h, newHsl.s, newHsl.l));
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
    const hsl = hsvToHsl(userColor.h, userColor.s, userColor.v);
    const newHsl = { ...hsl, [channel]: val };
    onChange(hslToHsv(newHsl.h, newHsl.s, newHsl.l));
  };

  const rgb = hsvToRgb(userColor.h, userColor.s, userColor.v);
  const hsl = hsvToHsl(userColor.h, userColor.s, userColor.v);
  const targetRgb = hsvToRgb(targetColor.h, targetColor.s, targetColor.v);
  const targetHsl = hsvToHsl(targetColor.h, targetColor.s, targetColor.v);

  return (
    <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 w-full p-4 md:p-6 flex flex-col justify-between h-full relative">
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

      <div className="flex flex-col gap-6">
        <div className="md:hidden flex flex-col gap-4">
          <div className="flex items-center gap-2 sm:gap-4 h-36 sm:h-40 min-w-0">
            <SvBox
              ref={svBoxRefMobile}
              onMouseDown={(e) => handleSvInteractionStart(e, svBoxRefMobile)}
              onTouchStart={(e) => handleSvInteractionStart(e, svBoxRefMobile)}
              className="flex-shrink min-w-0 aspect-square h-full max-w-[9rem] sm:max-w-none relative rounded-xl overflow-hidden shadow-inner cursor-crosshair touch-none"
              indicatorClassName="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 box-content"
              userColor={userColor}
            />

            <div className="flex-grow min-w-0 flex flex-col items-center justify-center h-full">
              <div className="w-full min-w-0 flex items-center justify-between gap-1">
                <button
                  onClick={() => handleAdjustValue(-1)}
                  className="w-8 h-10 sm:w-9 sm:h-11 flex items-center justify-center rounded-lg bg-white border border-slate-100 text-slate-500 active:bg-slate-50 shadow-md shadow-slate-200/70 transition-all flex-shrink-0"
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
                  onClick={() => handleAdjustValue(1)}
                  className="w-8 h-10 sm:w-9 sm:h-11 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 active:bg-slate-50 shadow-md shadow-slate-200/70 transition-all flex-shrink-0"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col md:flex-row gap-8">
          <SvBox
            ref={svBoxRefDesktop}
            onMouseDown={(e) => handleSvInteractionStart(e, svBoxRefDesktop)}
            onTouchStart={(e) => handleSvInteractionStart(e, svBoxRefDesktop)}
            className="flex-shrink-0 w-full md:w-64 aspect-square relative rounded-lg overflow-hidden cursor-crosshair shadow-sm ring-4 ring-slate-50 touch-none"
            indicatorClassName="absolute w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75 z-10 box-content"
            userColor={userColor}
          />

          <div className="hidden md:flex flex-grow flex-col space-y-10 py-2">
            <SlidersList
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

      <div className="flex gap-3 md:gap-4 mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={onSubmit}
          className="flex-1 py-3 md:py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base"
        >
          <Check size={18} strokeWidth={3} /> {copy.submit}
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 md:py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
        >
          {copy.next}
        </button>
      </div>
    </div>
  );
};

export default PaletteControls;
