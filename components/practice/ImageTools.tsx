import React, { useRef } from "react";
import { ImageIcon, Settings2 } from "lucide-react";
import { HSV } from "../../types";
import { hsvToCss } from "../../utils/colorUtils";
import { useLocale } from "../../i18n/LocaleProvider";

interface ImageToolsProps {
  extractedPalette: HSV[];
  onTargetChange: (color: HSV) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEditClick: () => void;
  hasImage: boolean;
}

const ImageTools: React.FC<ImageToolsProps> = ({
  extractedPalette,
  onTargetChange,
  onImageUpload,
  onEditClick,
  hasImage,
}) => {
  const { messages } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const copy = messages.practice.imageTools;

  return (
    <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-h-[4.5rem]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors shadow-sm"
        >
          <ImageIcon size={14} className="text-indigo-500" />
          {copy.uploadImage}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={onImageUpload}
        />

        {extractedPalette.length > 0 && (
          <>
            <div className="h-8 w-px bg-slate-200 mx-1 flex-shrink-0"></div>
            <div className="flex gap-2 items-center">
              {extractedPalette.map((color, index) => (
                <button
                  key={index}
                  onClick={() => onTargetChange(color)}
                  className="w-6 h-6 flex-shrink-0 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ backgroundColor: hsvToCss(color) }}
                  title={`${copy.useExtractedColor} ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>

      {(hasImage || extractedPalette.length > 0) && (
        <button
          onClick={onEditClick}
          className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
          title={copy.editExtractedColors}
        >
          <Settings2 size={16} />
        </button>
      )}
    </div>
  );
};

export default ImageTools;
