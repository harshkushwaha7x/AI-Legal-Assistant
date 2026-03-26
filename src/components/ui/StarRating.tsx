'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    value: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
    onChange?: (rating: number) => void;
    readOnly?: boolean;
    label?: string;
}

const SIZES = {
    sm: { star: 'h-3.5 w-3.5', gap: 'gap-0.5' },
    md: { star: 'h-4.5 w-4.5', gap: 'gap-1' },
    lg: { star: 'h-6 w-6', gap: 'gap-1.5' },
};

export default function StarRating({
    value,
    max = 5,
    size = 'md',
    onChange,
    readOnly = false,
    label,
}: StarRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const sizeConfig = SIZES[size];
    const displayValue = hovered ?? value;

    return (
        <div className="flex items-center gap-2">
            {label && (
                <span className="text-[10px] font-medium text-surface-500">{label}</span>
            )}
            <div className={`flex ${sizeConfig.gap}`}>
                {Array.from({ length: max }, (_, i) => {
                    const starValue = i + 1;
                    const filled = starValue <= displayValue;

                    return (
                        <button
                            key={i}
                            disabled={readOnly}
                            onClick={() => onChange?.(starValue)}
                            onMouseEnter={() => !readOnly && setHovered(starValue)}
                            onMouseLeave={() => setHovered(null)}
                            className={`transition-all ${
                                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            }`}
                            aria-label={`Rate ${starValue} of ${max}`}
                        >
                            <Star
                                className={`${sizeConfig.star} transition-colors ${
                                    filled
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-transparent text-surface-700'
                                }`}
                            />
                        </button>
                    );
                })}
            </div>
            <span className="text-[10px] text-surface-600">
                {value}/{max}
            </span>
        </div>
    );
}
