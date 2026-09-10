import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import ColorDisplay from "../components/practice/ColorDisplay";
import PaletteControls from "../components/practice/PaletteControls";
import ResultAnalysis from "../components/practice/ResultAnalysis";
import ImageTools from "../components/practice/ImageTools";
import ImageColorModal from "../components/practice/ImageColorModal";
import { HSV, ColorFeedback, ColorMode } from "../types/color";
import {
  generateRandomColor,
  calculateScore,
  rgbToHex,
  hexToHsv,
} from "../utils/colorUtils";
import { saveRecord } from "../storage/practiceStorage";
import { useLocale } from "../i18n/LocaleProvider";
import { createPageSeo } from "../utils/seo";
import { usePageSeo } from "../hooks/usePageSeo";

const Practice: React.FC = () => {
  const { locale } = useLocale();
  usePageSeo(createPageSeo(locale, "practice"));

  const [targetColor, setTargetColor] = useState<HSV>({ h: 0, s: 0, v: 0 });
  const [userColor, setUserColor] = useState<HSV>({ h: 0, s: 0, v: 0 });
  const [feedback, setFeedback] = useState<ColorFeedback | null>(null);
  const [showFeedbackMarkers, setShowFeedbackMarkers] = useState(false);
  const [activeTab, setActiveTab] = useState<"split" | "overlay">("split");
  const [colorMode, setColorMode] = useState<ColorMode>("HSV");
  const [saveStatus, setSaveStatus] = useState<"saved" | "failed" | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<HSV[]>([]);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const copy =
    locale === "zh"
      ? {
          title: "色彩匹配练习",
          subtitle:
            "通过滑杆练习颜色匹配、色相、饱和度与明度判断，更适合绘画初学者反复训练色感。",
        }
      : {
          title: "Color Matching Practice",
          subtitle:
            "Practice color matching, hue, saturation, and value with repeatable exercises for beginner painters and visual learners.",
        };

  useEffect(() => {
    resetRound();
  }, []);


  const resetRound = () => {
    setTargetColor(generateRandomColor());
    setUserColor({ h: 0, s: 0, v: 0 });
    setFeedback(null);
    setSaveStatus(null);
    setShowFeedbackMarkers(false);
  };

  const handleTargetChange = (newColor: HSV) => {
    setTargetColor(newColor);
    setFeedback(null);
    setSaveStatus(null);
    setShowFeedbackMarkers(false);
  };

  const handleSubmit = () => {
    const result = calculateScore(targetColor, userColor, locale);
    setFeedback(result);
    setShowFeedbackMarkers(true);

    try {
      saveRecord({ mode: colorMode, target: targetColor, guess: userColor });
      setSaveStatus("saved");
    } catch {
      setSaveStatus("failed");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setUploadedImageSrc(src);
      extractColorsFromImage(src);
    };
    reader.readAsDataURL(file);
  };

  const extractColorsFromImage = (src: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        const { default: ColorThief } = await import("colorthief/dist/color-thief.mjs");
        const thief = new ColorThief();
        const palette = thief.getPalette(img, 5) || [];
        const newPalette: HSV[] = palette.map(([r, g, b]) =>
          hexToHsv(rgbToHex(r, g, b))
        );

        setExtractedPalette(newPalette);
        if (newPalette.length > 0) {
          handleTargetChange(newPalette[0]);
        }
      } catch (err) {
        console.error("ColorThief extract failed", err);
      }
    };
    img.onerror = (err) => {
      console.error("Image load failed for ColorThief", err);
    };
    img.src = src;
  };

  const handlePaletteSave = (newPalette: HSV[]) => {
    setExtractedPalette(newPalette);
    if (newPalette.length > 0) {
      handleTargetChange(newPalette[0]);
    }
  };

  const sharedImageTools = (
    <ImageTools
      extractedPalette={extractedPalette}
      onTargetChange={handleTargetChange}
      onImageUpload={handleImageUpload}
      onEditClick={() => setIsEditModalOpen(true)}
      hasImage={!!uploadedImageSrc}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            {copy.title}
          </h1>
          <p className="text-slate-500">{copy.subtitle}</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
          <div className="w-full lg:hidden">{sharedImageTools}</div>

          <ColorDisplay
            targetColor={targetColor}
            userColor={userColor}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTargetChange={handleTargetChange}
            onReset={resetRound}
          />

          <PaletteControls
            userColor={userColor}
            targetColor={targetColor}
            onChange={setUserColor}
            onSubmit={handleSubmit}
            onNext={resetRound}
            showFeedbackMarkers={showFeedbackMarkers}
            mode={colorMode}
            setMode={setColorMode}
          />
        </div>

        <div className="hidden lg:block">{sharedImageTools}</div>

        {feedback && (
          <ResultAnalysis
            feedback={feedback}
            targetColor={targetColor}
            userColor={userColor}
            mode={colorMode}
            saveStatus={saveStatus}
          />
        )}

        {isEditModalOpen && uploadedImageSrc && (
          <ImageColorModal
            imageSrc={uploadedImageSrc}
            initialPalette={
              extractedPalette.length
                ? extractedPalette
                : Array(5).fill({ h: 0, s: 0, v: 100 })
            }
            onClose={() => setIsEditModalOpen(false)}
            onSave={handlePaletteSave}
          />
        )}
      </main>
    </div>
  );
};

export default Practice;
