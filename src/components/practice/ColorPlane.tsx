import React, { useEffect, useRef } from 'react';
import type { HSV } from '../../types/color';
import { hsvToCss, hsvToRgb } from '../../utils/colorUtils';
import { HUE_RING_INNER_RADIUS, getRingPlaneBounds, planeToSv, svToPlane, type HueView, type PlaneShape } from '../../utils/practiceColor';
import { useLocale } from '../../i18n/LocaleProvider';

interface Props {
  color: HSV;
  onChange: (color: HSV) => void;
  shape: PlaneShape;
  hueView: HueView;
  hueDisabled: boolean;
  planeDisabled: boolean;
  targetHue?: number;
  className?: string;
}

export default function ColorPlane({ color, onChange, shape, hueView, hueDisabled, planeDisabled, targetHue, className = '' }: Props) {
  const { locale } = useLocale();
  const canvas = useRef<HTMLCanvasElement>(null);
  const ring = hueView === 'ring';
  const point = svToPlane(color.s, color.v, shape);
  const ringBounds = getRingPlaneBounds(shape);
  const indicatorRadius = (0.5 + HUE_RING_INNER_RADIUS) / 2 * 100;
  const huePoint = (hue: number) => ({ left: `${50 + indicatorRadius * Math.sin(hue * Math.PI / 180)}%`, top: `${50 - indicatorRadius * Math.cos(hue * Math.PI / 180)}%` });

  useEffect(() => {
    if (shape !== 'triangle') return;
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    const size = 256;
    const pixels = context.createImageData(size, size);
    const hue = hsvToRgb(color.h, 100, 100);
    for (let y = 0; y < size; y++) {
      const py = y / (size - 1);
      for (let x = 0; x < size; x++) {
        const px = x / (size - 1);
        const pure = 1 - py;
        // Fill the edge pixels too; CSS clips the exact triangle, avoiding a
        // transparent pixel row between its top vertex and the ring.
        const white = Math.max(0, Math.min(py, (1 + py) / 2 - px));
        const offset = (y * size + x) * 4;
        pixels.data[offset] = pure * hue.r + white * 255;
        pixels.data[offset + 1] = pure * hue.g + white * 255;
        pixels.data[offset + 2] = pure * hue.b + white * 255;
        pixels.data[offset + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
  }, [color.h, shape]);

  const movePlane = (event: React.PointerEvent<HTMLDivElement>) => {
    if (planeDisabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onChange({ ...color, ...planeToSv((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height, shape) });
  };
  const moveHue = (event: React.PointerEvent<HTMLDivElement>) => {
    if (hueDisabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    onChange({ ...color, h: (Math.atan2(x, -y) * 180 / Math.PI + 360) % 360 });
  };

  return (
    <div className={`relative aspect-square shrink-0 self-center ${className}`}>
      <div aria-hidden="true" className={`absolute inset-0 bg-neutral-300 pointer-events-none ${ring ? 'rounded-full' : ''}`} />
      {ring && (
        <div role="slider" aria-label={locale === 'zh' ? '色相环' : 'Hue ring'} aria-valuemin={0} aria-valuemax={360}
          aria-valuenow={Math.round(color.h)} aria-disabled={hueDisabled} tabIndex={hueDisabled ? -1 : 0}
          className={`absolute -inset-3 rounded-full touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${hueDisabled ? 'grayscale opacity-45 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{ clipPath: 'circle(50%)' }}
          onPointerDown={(event) => {
            if (hueDisabled) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            moveHue(event);
          }}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) moveHue(event); }}
          onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onKeyDown={(event) => {
            if (hueDisabled || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const delta = ['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : -1;
            onChange({ ...color, h: event.key === 'Home' ? 0 : event.key === 'End' ? 359 : (color.h + delta + 360) % 360 });
          }}>
          {/* Keep the visible ring unchanged; its hit area includes the inner
              whitespace and a 12px outer margin. The color plane sits above it. */}
          <div className="absolute inset-3 pointer-events-none">
            <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)', maskImage: `radial-gradient(circle closest-side, transparent calc(${HUE_RING_INNER_RADIUS * 200}% - 0.5px), black ${HUE_RING_INNER_RADIUS * 200}%)` }} />
            <div className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2" style={{ ...huePoint(color.h), background: `hsl(${color.h} 100% 50%)` }} />
            {targetHue !== undefined && <div className="absolute w-2 h-2 rounded-full bg-slate-900 ring-2 ring-white -translate-x-1/2 -translate-y-1/2" style={huePoint(targetHue)} />}
          </div>
        </div>
      )}
      <div role="group" aria-label={locale === 'zh' ? '饱和度与明度调色板' : 'Saturation and value palette'} aria-disabled={planeDisabled}
        tabIndex={planeDisabled ? -1 : 0}
        className={`absolute pointer-events-none touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${planeDisabled ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
        style={ring ? { left: `${ringBounds.left * 100}%`, top: `${ringBounds.top * 100}%`, width: `${ringBounds.width * 100}%`, height: `${ringBounds.height * 100}%` } : { inset: shape === 'triangle' ? '4%' : '2%' }}
        onPointerDown={(event) => {
          if (planeDisabled) return;
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          movePlane(event);
        }}
        onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) movePlane(event); }}
        onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
        onKeyDown={(event) => {
          if (planeDisabled || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
          event.preventDefault();
          onChange({ ...color, s: Math.max(0, Math.min(100, color.s + (event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0))), v: Math.max(0, Math.min(100, color.v + (event.key === 'ArrowUp' ? 1 : event.key === 'ArrowDown' ? -1 : 0))) });
        }}>
        {shape === 'triangle'
          ? <canvas ref={canvas} width={256} height={256} className="absolute inset-0 w-full h-full pointer-events-auto" style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
          : <div className="absolute inset-0 shadow-inner pointer-events-auto" style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${color.h} 100% 50%)` }} />}
        <div className="absolute w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border-2 border-white shadow-md ring-1 ring-black/20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%`, backgroundColor: hsvToCss(color) }} />
      </div>
    </div>
  );
}
