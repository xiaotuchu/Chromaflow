import React from "react";
import { HSV, RGB, HSL, ColorMode } from "../../types/color";
import { hsvToCss } from "../../utils/colorUtils";
import { useLocale } from "../../i18n/LocaleProvider";
import type { Channel } from "../../utils/practiceColor";
import Slider from "./Slider";

interface SlidersListProps {
  mode: ColorMode;
  lockedChannels: Channel[];
  hideHue: boolean;
  userColor: HSV;
  targetColor: HSV;
  rgb: RGB;
  hsl: HSL;
  targetRgb: RGB;
  targetHsl: HSL;
  showFeedbackMarkers: boolean;
  handleHsvChange: (key: keyof HSV, value: number) => void;
  handleRgbChange: (channel: keyof RGB, val: number) => void;
  handleHslChange: (channel: keyof HSL, val: number) => void;
}

const SlidersList: React.FC<SlidersListProps> = ({
  mode,
  lockedChannels,
  hideHue,
  userColor,
  targetColor,
  rgb,
  hsl,
  targetRgb,
  targetHsl,
  showFeedbackMarkers,
  handleHsvChange,
  handleRgbChange,
  handleHslChange,
}) => {
  const { locale } = useLocale();
  const copy =
    locale === "zh"
      ? {
          hue: "色相",
          saturation: "饱和度",
          value: "明度",
          lightness: "亮度",
          red: "红",
          green: "绿",
          blue: "蓝",
          degreeUnit: "\u00B0",
        }
      : {
          hue: "Hue",
          saturation: "Saturation",
          value: "Value",
          lightness: "Lightness",
          red: "Red",
          green: "Green",
          blue: "Blue",
          degreeUnit: "\u00B0",
        };

  if (mode === "HSV") {
    return (
      <>
        {!hideHue && (<Slider
          label={copy.hue}
          disabled={lockedChannels.includes("h")}
          value={userColor.h}
          max={360}
          unit={copy.degreeUnit}
          onChange={(v: number) => handleHsvChange("h", v)}
          trackStyle={{
            background:
              "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          }}
          feedbackMark={showFeedbackMarkers ? targetColor.h : undefined}
        />)}
        <Slider
          label={copy.saturation}
          disabled={lockedChannels.includes("s")}
          value={userColor.s}
          max={100}
          unit="%"
          onChange={(v: number) => handleHsvChange("s", v)}
          trackStyle={{
            backgroundImage: `linear-gradient(to right, #888, ${hsvToCss({
              h: userColor.h,
              s: 100,
              v: userColor.v,
            })})`,
          }}
          feedbackMark={showFeedbackMarkers ? targetColor.s : undefined}
        />
        <Slider
          label={copy.value}
          disabled={lockedChannels.includes("v")}
          value={userColor.v}
          max={100}
          unit="%"
          onChange={(v: number) => handleHsvChange("v", v)}
          trackStyle={{
            backgroundImage: `linear-gradient(to right, #000, ${hsvToCss({
              h: userColor.h,
              s: userColor.s,
              v: 100,
            })})`,
          }}
          feedbackMark={showFeedbackMarkers ? targetColor.v : undefined}
        />
      </>
    );
  }

  if (mode === "RGB") {
    return (
      <>
        <Slider
          label={copy.red}
          disabled={lockedChannels.includes("r")}
          value={rgb.r}
          max={255}
          onChange={(v: number) => handleRgbChange("r", v)}
          trackStyle={{
            background: `linear-gradient(to right, rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`,
          }}
          feedbackMark={showFeedbackMarkers ? targetRgb.r : undefined}
        />
        <Slider
          label={copy.green}
          disabled={lockedChannels.includes("g")}
          value={rgb.g}
          max={255}
          onChange={(v: number) => handleRgbChange("g", v)}
          trackStyle={{
            background: `linear-gradient(to right, rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`,
          }}
          feedbackMark={showFeedbackMarkers ? targetRgb.g : undefined}
        />
        <Slider
          label={copy.blue}
          disabled={lockedChannels.includes("b")}
          value={rgb.b}
          max={255}
          onChange={(v: number) => handleRgbChange("b", v)}
          trackStyle={{
            background: `linear-gradient(to right, rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`,
          }}
          feedbackMark={showFeedbackMarkers ? targetRgb.b : undefined}
        />
      </>
    );
  }

  if (mode === "HSL") {
    return (
      <>
        {!hideHue && (<Slider
          label={copy.hue}
          disabled={lockedChannels.includes("h")}
          value={hsl.h}
          max={360}
          unit={copy.degreeUnit}
          onChange={(v: number) => handleHslChange("h", v)}
          trackStyle={{
            background:
              "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
          }}
          feedbackMark={showFeedbackMarkers ? targetHsl.h : undefined}
        />)}
        <Slider
          label={copy.saturation}
          disabled={lockedChannels.includes("s")}
          value={hsl.s}
          max={100}
          unit="%"
          onChange={(v: number) => handleHslChange("s", v)}
          trackStyle={{
            backgroundImage: `linear-gradient(to right, #888, hsl(${hsl.h}, 100%, ${hsl.l}%))`,
          }}
          feedbackMark={showFeedbackMarkers ? targetHsl.s : undefined}
        />
        <Slider
          label={copy.lightness}
          disabled={lockedChannels.includes("l")}
          value={hsl.l}
          max={100}
          unit="%"
          onChange={(v: number) => handleHslChange("l", v)}
          trackStyle={{ backgroundImage: "linear-gradient(to right, #000, #fff)" }}
          feedbackMark={showFeedbackMarkers ? targetHsl.l : undefined}
        />
      </>
    );
  }

  return null;
};

export default SlidersList;
