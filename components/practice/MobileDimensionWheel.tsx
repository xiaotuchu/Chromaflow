import React, { useRef } from "react";

export const MOBILE_WHEEL_SWIPE_THRESHOLD = 24;

type WheelSwipeInput = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

export function getWheelSwipeDirection({
  startX,
  startY,
  currentX,
  currentY,
}: WheelSwipeInput): "prev" | "next" | null {
  const deltaX = currentX - startX;
  const deltaY = currentY - startY;

  if (Math.abs(deltaY) < MOBILE_WHEEL_SWIPE_THRESHOLD) {
    return null;
  }

  if (Math.abs(deltaY) <= Math.abs(deltaX)) {
    return null;
  }

  return deltaY > 0 ? "prev" : "next";
}

interface DimensionItem {
  short: string;
}

interface MobileDimensionWheelProps {
  activeDimIndex: number;
  dimensions: DimensionItem[];
  onPrev: () => void;
  onNext: () => void;
}

const MobileDimensionWheel: React.FC<MobileDimensionWheelProps> = ({
  activeDimIndex,
  dimensions,
  onPrev,
  onNext,
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const start = touchStartRef.current;

    if (!touch || !start) {
      return;
    }

    const direction = getWheelSwipeDirection({
      startX: start.x,
      startY: start.y,
      currentX: touch.clientX,
      currentY: touch.clientY,
    });

    if (!direction) {
      return;
    }

    event.preventDefault();

    if (direction === "prev") {
      onPrev();
    } else {
      onNext();
    }

    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <div
      className="w-20 sm:w-24 h-full flex flex-col items-center justify-center relative overflow-hidden bg-white/80 rounded-xl border border-slate-200 touch-pan-x"
      style={{ perspective: "800px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      data-wheel-swipe="enabled"
    >
      <div className="flex flex-col items-center w-full text-center relative z-10">
        <button
          onClick={onPrev}
          className="relative z-30 h-7 flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase tracking-tight opacity-60 transition-all duration-300 pointer-events-auto"
          style={{ transform: "rotateX(35deg) scale(0.9)" }}
        >
          {dimensions[(activeDimIndex + 2) % 3].short}
        </button>

        <div
          className="h-12 w-full flex flex-col items-center justify-center transition-all duration-300 relative"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="w-full h-px bg-slate-100 absolute top-0"></div>
          <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">
            {dimensions[activeDimIndex].short}
          </span>
          <div className="w-full h-px bg-slate-100 absolute bottom-0"></div>
        </div>

        <button
          onClick={onNext}
          className="relative z-30 h-7 flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase tracking-tight opacity-60 transition-all duration-300 pointer-events-auto"
          style={{ transform: "rotateX(-35deg) scale(0.9)" }}
        >
          {dimensions[(activeDimIndex + 1) % 3].short}
        </button>
      </div>
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none z-20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-20"></div>
    </div>
  );
};

export default MobileDimensionWheel;
