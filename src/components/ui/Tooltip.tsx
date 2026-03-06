'use client';

import { useState, useRef, ReactNode } from 'react';

interface TooltipProps {
    children: ReactNode;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const POSITIONS = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export default function Tooltip({
    children,
    content,
    position = 'top',
}: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => setVisible(true), 400);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {visible && (
                <div
                    className={`absolute z-50 whitespace-nowrap rounded-lg border border-white/10 bg-surface-800 px-2.5 py-1.5 text-xs text-surface-200 shadow-xl animate-fade-in pointer-events-none ${POSITIONS[position]}`}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
