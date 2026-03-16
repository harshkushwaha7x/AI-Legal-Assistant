'use client';

import { useState, useRef } from 'react';
import { Star, StarOff } from 'lucide-react';

interface RatingProps {
    value?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    readOnly?: boolean;
    onChange?: (value: number) => void;
    label?: string;
}

const SIZE_MAP = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
};

export default function Rating({
    value = 0,
    max = 5,
    size = 'md',
    readOnly = false,
    onChange,
    label,
}: RatingProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const displayValue = hoverValue !== null ? hoverValue : value;
    const iconSize = SIZE_MAP[size];

    const handleClick = (starIndex: number) => {
        if (readOnly) return;
        onChange?.(starIndex);
    };

    return (
        <div className="inline-flex items-center gap-2">
            {label && (
                <span className="text-xs text-surface-400">{label}</span>
            )}
            <div
                className="inline-flex gap-0.5"
                role="radiogroup"
                aria-label={label || 'Rating'}
            >
                {Array.from({ length: max }, (_, i) => {
                    const starIndex = i + 1;
                    const isFilled = starIndex <= displayValue;

                    return (
                        <button
                            key={i}
                            type="button"
                            role="radio"
                            aria-checked={starIndex === value}
                            aria-label={`${starIndex} of ${max} stars`}
                            disabled={readOnly}
                            onClick={() => handleClick(starIndex)}
                            onMouseEnter={() => !readOnly && setHoverValue(starIndex)}
                            onMouseLeave={() => setHoverValue(null)}
                            className={`transition-colors ${
                                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            } ${isFilled ? 'text-amber-400' : 'text-surface-700'}`}
                        >
                            {isFilled ? (
                                <Star className={`${iconSize} fill-current`} />
                            ) : (
                                <Star className={iconSize} />
                            )}
                        </button>
                    );
                })}
            </div>
            {value > 0 && (
                <span className="text-[10px] text-surface-500 tabular-nums">
                    {value}/{max}
                </span>
            )}
        </div>
    );
}
