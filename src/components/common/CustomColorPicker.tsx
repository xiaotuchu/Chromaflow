
import React, { useRef, useEffect, useState } from 'react';
import { Pipette, ChevronDown, GripHorizontal, Check, X } from 'lucide-react';
import { HSV, RGB, HSL } from '../../types/color';
import { hsvToCss, hsvToHex, hexToHsv, hsvToRgb, rgbToHsv, hsvToHsl, hslToHsv } from '../../utils/colorUtils';
import { useLocale } from '../../i18n/LocaleProvider';

interface CustomColorPickerProps {
  color: HSV;
  onChange: (color: HSV) => void;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
}

type InputMode = 'HEX' | 'RGB' | 'HSL';

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ color, onChange, onClose, className = "", style }) => {
  const { messages } = useLocale();
  const isEyeDropperSupported = typeof window !== "undefined" && "EyeDropper" in window;
  const [inputMode, setInputMode] = useState<InputMode>('HEX');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialColor] = useState<HSV>(color); // Capture initial color on mount
  const copy = messages.common.colorPicker;
  
  const svBoxRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isDraggingSv = useRef(false);
  const isDraggingHue = useRef(false);
  const isDraggingContainer = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.custom-color-picker-container')) {
            onClose(); // In a real app, maybe confirm or cancel logic here too
        }
    };
    // Delay slightly to prevent immediate close on trigger
    const timeout = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    return () => {
        clearTimeout(timeout);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Logic for SV Box Interaction
  const handleSvChange = (e: MouseEvent | React.MouseEvent) => {
    if (!svBoxRef.current) return;
    const rect = svBoxRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const newS = Math.round((x / rect.width) * 100);
    const newV = Math.round(100 - (y / rect.height) * 100);
    onChange({ ...color, s: newS, v: newV });
  };

  const onSvMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent container drag
    isDraggingSv.current = true;
    handleSvChange(e);
  };

  // Logic for Hue Slider Interaction
  const handleHueChange = (e: MouseEvent | React.MouseEvent) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newH = Math.round((x / rect.width) * 360);
    onChange({ ...color, h: newH });
  };

  const onHueMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent container drag
    isDraggingHue.current = true;
    handleHueChange(e);
  };

  // Logic for Container Drag
  const onContainerMouseDown = (e: React.MouseEvent) => {
      // Allow drag only if clicking background or handle, not inputs/buttons
      const target = e.target as HTMLElement;
      if (['INPUT', 'BUTTON', 'SVG', 'PATH'].includes(target.tagName)) return;
      
      isDraggingContainer.current = true;
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  // Global Mouse Up/Move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSv.current) {
          handleSvChange(e);
      } else if (isDraggingHue.current) {
          handleHueChange(e);
      } else if (isDraggingContainer.current) {
          e.preventDefault();
          setPosition({
              x: e.clientX - dragStart.current.x,
              y: e.clientY - dragStart.current.y
          });
      }
    };

    const handleMouseUp = () => {
      isDraggingSv.current = false;
      isDraggingHue.current = false;
      isDraggingContainer.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position]); 

  // Handle Eyedropper
  const handleEyedropper = async () => {
    if (!isEyeDropperSupported || !window.EyeDropper) {
      alert('Eyedropper is not supported in this browser.');
      return;
    }
    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      onChange(hexToHsv(result.sRGBHex));
    } catch (e) {
      console.error(e);
    }
  };

  // Input Handlers
  const handleHexChange = (val: string) => {
      if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
         if (val.length >= 6 || (val.length === 4 && val.startsWith('#')) || (val.length === 3 && !val.startsWith('#'))) {
             if (/^#?([0-9A-Fa-f]{3}){1,2}$/.test(val)) {
                 onChange(hexToHsv(val));
             }
         }
      }
  };

  const handleRgbChange = (key: keyof RGB, val: string) => {
      const num = parseInt(val);
      if (isNaN(num)) return;
      const rgb = hsvToRgb(color.h, color.s, color.v);
      const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, num)) };
      onChange(rgbToHsv(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHslChange = (key: keyof HSL, val: string) => {
      const num = parseInt(val);
      if (isNaN(num)) return;
      const hsl = hsvToHsl(color.h, color.s, color.v);
      const max = key === 'h' ? 360 : 100;
      const newHsl = { ...hsl, [key]: Math.min(max, Math.max(0, num)) };
      onChange(hslToHsv(newHsl.h, newHsl.s, newHsl.l));
  };

  // Action Buttons
  const handleCancel = () => {
      onChange(initialColor);
      onClose();
  };

  const handleConfirm = () => {
      onClose();
  };

  // Values for display
  const rgb = hsvToRgb(color.h, color.s, color.v);
  const hsl = hsvToHsl(color.h, color.s, color.v);

  const toggleMode = () => {
      if (inputMode === 'HEX') setInputMode('RGB');
      else if (inputMode === 'RGB') setInputMode('HSL');
      else setInputMode('HEX');
  };

  return (
    <div 
        ref={containerRef}
        className={`custom-color-picker-container bg-white rounded-xl shadow-2xl border border-slate-200 p-3 w-64 flex flex-col gap-3 cursor-move select-none ${className}`}
        style={{
            ...style,
            transform: `translate(${position.x}px, ${position.y}px)`,
            touchAction: 'none'
        }}
        onMouseDown={onContainerMouseDown}
    >
        {/* Drag Indicator (Optional visual cue) */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-slate-200">
            <GripHorizontal size={12} />
        </div>

        {/* SV Box */}
        <div 
            ref={svBoxRef}
            className="w-full h-36 rounded-lg relative cursor-crosshair overflow-hidden ring-1 ring-slate-200 shadow-sm mt-2"
            onMouseDown={onSvMouseDown}
            style={{ backgroundColor: `hsl(${color.h}, 100%, 50%)` }}
        >
             <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #fff, transparent)' }}></div>
             <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000, transparent)' }}></div>
             <div 
                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-sm -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ 
                    left: `${color.s}%`, 
                    top: `${100 - color.v}%` 
                }}
             ></div>
        </div>

        {/* Hue Slider */}
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full border border-slate-200 shadow-sm flex-shrink-0" style={{ backgroundColor: hsvToCss(color) }}></div>
             <div className="flex-grow">
                <div 
                    ref={hueSliderRef}
                    className="w-full h-3 rounded-full relative cursor-pointer"
                    onMouseDown={onHueMouseDown}
                    style={{
                        background: `linear-gradient(to right, 
                            #ff0000 0%, #ffff00 17%, #00ff00 33%, 
                            #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`
                    }}
                >
                    <div 
                        className="absolute w-4 h-4 bg-white border border-slate-300 rounded-full shadow-sm top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                        style={{ left: `${(color.h / 360) * 100}%` }}
                    ></div>
                </div>
             </div>
        </div>

        {/* Inputs & Tools */}
        <div className="flex items-center justify-between gap-2" onMouseDown={(e) => e.stopPropagation()}>
            
            {/* Mode Toggle & Inputs */}
            <div className="flex-grow flex items-center gap-2 bg-slate-50 rounded-md p-1 border border-slate-100">
                <button 
                    onClick={toggleMode}
                    className="flex items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600 px-1 py-1 rounded hover:bg-white transition-colors w-10 justify-center flex-shrink-0 cursor-pointer"
                >
                    {inputMode} <ChevronDown size={10} />
                </button>
                
                <div className="flex gap-1 flex-grow">
                    {inputMode === 'HEX' && (
                        <input 
                            type="text" 
                            className="w-full text-xs font-mono bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700 uppercase text-center cursor-text"
                            defaultValue={hsvToHex(color)}
                            onBlur={(e) => handleHexChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleHexChange(e.currentTarget.value)}
                        />
                    )}

                    {inputMode === 'RGB' && (
                        <>
                            <input className="w-full text-xs text-center bg-transparent border-none p-0 focus:ring-0 cursor-text" placeholder="R" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} />
                            <input className="w-full text-xs text-center bg-transparent border-none p-0 focus:ring-0 cursor-text" placeholder="G" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} />
                            <input className="w-full text-xs text-center bg-transparent border-none p-0 focus:ring-0 cursor-text" placeholder="B" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} />
                        </>
                    )}

                    {inputMode === 'HSL' && (
                        <>
                            <input className="w-full text-xs text-center bg-transparent border-none p-0 focus:ring-0 cursor-text" placeholder="H" value={hsl.h} onChange={(e) => handleHslChange('h', e.target.value)} />
                            <input className="w-full text-xs text-center bg-transparent border-none p-0 focus:ring-0 cursor-text" placeholder="S" value={hsl.s} onChange={(e) => handleHslChange('s', e.target.value)} />
                            <input className="w-full text-xs text-center bg-transparent border-none p-0 focus:ring-0 cursor-text" placeholder="L" value={hsl.l} onChange={(e) => handleHslChange('l', e.target.value)} />
                        </>
                    )}
                </div>
            </div>

            {/* Eyedropper */}
            <button 
                onClick={handleEyedropper}
                className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                  isEyeDropperSupported
                    ? "text-slate-500 hover:text-indigo-600 hover:bg-slate-50 hover:border-slate-200"
                    : "text-slate-300 cursor-not-allowed border-transparent bg-slate-50"
                }`}
                title={isEyeDropperSupported ? "Pick color from screen" : "Eyedropper not supported in this browser"}
                disabled={!isEyeDropperSupported}
            >
                <Pipette size={14} />
            </button>
        </div>

        {/* Cancel/Confirm Buttons */}
        <div className="flex gap-2 mt-1" onMouseDown={(e) => e.stopPropagation()}>
            <button 
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
                <X size={12} /> {copy.cancel}
            </button>
            <button 
                onClick={handleConfirm}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <Check size={12} /> {copy.confirm}
            </button>
        </div>
    </div>
  );
};

// Add EyeDropper type to window
declare global {
    interface Window {
        EyeDropper?: any;
    }
}

export default CustomColorPicker;
