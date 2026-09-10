import React from 'react';
import { HSV } from '../../types';
import { hsvToCss } from '../../utils/colorUtils';

interface SvBoxProps {
    userColor: HSV;
    className: string;
    indicatorClassName: string;
    onMouseDown: React.MouseEventHandler<HTMLDivElement>;
    onTouchStart: React.TouchEventHandler<HTMLDivElement>;
}

const SvBox = React.forwardRef<HTMLDivElement, SvBoxProps>(
    ({ userColor, className, indicatorClassName, onMouseDown, onTouchStart }, ref) => (
        <div 
            ref={ref}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className={className}
            style={{ backgroundColor: `hsl(${userColor.h}, 100%, 50%)` }}
        >
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #fff, transparent)' }}></div>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000, transparent)' }}></div>
            <div 
                className={indicatorClassName}
                style={{ 
                    left: `${userColor.s}%`, 
                    top: `${100 - userColor.v}%`,
                    backgroundColor: hsvToCss(userColor)
                }}
            ></div>
        </div>
    )
);

SvBox.displayName = 'SvBox';

export default SvBox;
