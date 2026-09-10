
import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { HSV } from '../../types/color';
import { hsvToCss, hexToHsv, rgbToHex } from '../../utils/colorUtils';
import CustomColorPicker from '../common/CustomColorPicker';
import { useLocale } from '../../i18n/LocaleProvider';

interface ImageColorModalProps {
  imageSrc: string;
  initialPalette: HSV[];
  onClose: () => void;
  onSave: (palette: HSV[]) => void;
}

const ImageColorModal: React.FC<ImageColorModalProps> = ({ imageSrc, initialPalette, onClose, onSave }) => {
  const { messages } = useLocale();
  const [palette, setPalette] = useState<HSV[]>(initialPalette);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copy = messages.practice.imageTools;
  
  // Ref for the dot container to position the picker
  const dotsContainerRef = useRef<HTMLDivElement>(null);

  // Initialize canvas
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                // Determine aspect ratio fit
                const containerW = canvasRef.current.parentElement?.clientWidth || 600;
                const containerH = 400; // max height
                const scale = Math.min(containerW / img.width, containerH / img.height);
                
                canvasRef.current.width = img.width * scale;
                canvasRef.current.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            }
        }
    };
  }, [imageSrc]);

  // Click on dots logic
  const handleDotClick = (index: number) => {
      if (activeIndex === index) {
          // Check if we are on mobile (less than 768px typically)
          const isMobile = window.innerWidth < 768;
          if (!isMobile) {
            setShowPicker(!showPicker);
          }
      } else {
          setActiveIndex(index);
          setShowPicker(false);
      }
  };

  const handleColorUpdate = (color: HSV) => {
      const newPalette = [...palette];
      newPalette[activeIndex] = color;
      setPalette(newPalette);
  };

  const handleReset = () => {
      setPalette(initialPalette);
      setShowPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100 rounded-t-2xl bg-white">
                <h3 className="font-bold text-slate-800">{copy.extractColors}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
            </div>

            {/* Image Preview Area */}
            <div className="flex-grow bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden min-h-[300px]">
                <canvas 
                    ref={canvasRef}
                    className="shadow-sm rounded-lg max-w-full"
                />
            </div>

            {/* Palette Control */}
            <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl" ref={dotsContainerRef}>
                <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                        {palette.map((color, i) => (
                            <div key={i} className="relative group">
                                <button 
                                    onClick={() => handleDotClick(i)}
                                    className={`w-10 h-10 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center ${
                                        activeIndex === i 
                                        ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110' 
                                        : 'ring-1 ring-slate-200 hover:scale-105 opacity-80 hover:opacity-100'
                                    }`}
                                    style={{ backgroundColor: hsvToCss(color) }}
                                >
                                    {activeIndex === i && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>}
                                </button>
                                
                                {/* Custom Picker Popover - Only on Desktop */}
                                {showPicker && activeIndex === i && (
                                    <div className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 mr-4 z-50">
                                        <div className="w-3 h-3 bg-white border-t border-r border-slate-200 transform rotate-45 absolute top-1/2 -translate-y-1/2 -right-1.5 z-10"></div>
                                        <CustomColorPicker 
                                            color={color} 
                                            onChange={handleColorUpdate}
                                            onClose={() => setShowPicker(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Buttons: Hidden on mobile */}
                    <div className="hidden md:flex gap-2">
                        <button 
                            onClick={handleReset}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                            <RotateCcw size={14} /> {copy.reset}
                        </button>
                        <button 
                            onClick={() => { onSave(palette); onClose(); }}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
                        >
                            {copy.usePalette}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ImageColorModal;
