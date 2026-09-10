import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

interface SliderProps {
    label: string;
    value: number;
    max: number;
    unit?: string;
    onChange: (val: number) => void;
    trackStyle: React.CSSProperties;
    feedbackMark?: number; // raw value on the same scale as the slider (0..max)
}

const Slider: React.FC<SliderProps> = ({
    label,
    value,
    max,
    unit = "",
    onChange,
    trackStyle,
    feedbackMark,
}) => {
    const normalizedMark = feedbackMark !== undefined ? (Math.min(Math.max(feedbackMark, 0), max) / max) * 100 : undefined;
    const trackRef = useRef<HTMLDivElement>(null);
    const [markLeft, setMarkLeft] = useState<number | null>(null);

    useEffect(() => {
        if (normalizedMark === undefined || !trackRef.current) {
            setMarkLeft(null);
            return;
        }

        const computePosition = () => {
            if (!trackRef.current) return;
            const width = trackRef.current.clientWidth;
            const thumbWidth = 16; // approximate thumb width to align marker center with slider handle
            const usable = Math.max(width - thumbWidth, 0);
            const px = (usable * normalizedMark) / 100 + thumbWidth / 2;
            setMarkLeft(px);
        };

        const ro = new ResizeObserver(computePosition);
        ro.observe(trackRef.current);
        computePosition();

        return () => ro.disconnect();
    }, [normalizedMark]);

    return (
        <div className="space-y-2 md:space-y-4 relative transition-all duration-300">
            <div className="flex justify-between items-center">
                <label className="text-xs md:text-sm font-bold transition-colors text-slate-700">{label}</label>
                <span className="text-[10px] md:text-xs font-mono px-2 py-0.5 md:py-1 rounded border transition-all bg-slate-100 text-slate-600 border-slate-200">
                    {Math.round(value)}{unit}
                </span>
            </div>
            <div className="relative h-4 flex items-center" ref={trackRef}>
                <input 
                    type="range" 
                    min="0" 
                    max={max} 
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-3 md:h-4 rounded-full appearance-none cursor-pointer z-10 relative"
                    style={trackStyle}
                />
                {markLeft !== null && (
                    <div 
                        className="absolute top-full mt-1 flex flex-col items-center transition-all duration-500 z-0"
                        style={{ left: markLeft, transform: 'translateX(-50%)' }}
                    >
                        <ChevronUp size={14} className="text-slate-800" fill="currentColor" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Slider;
