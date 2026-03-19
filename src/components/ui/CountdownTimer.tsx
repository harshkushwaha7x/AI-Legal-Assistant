'use client';

import { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface CountdownTimerProps {
    /** Duration in seconds */
    duration: number;
    /** Called when countdown reaches zero */
    onComplete?: () => void;
    /** Auto-start the timer */
    autoStart?: boolean;
    /** Label text */
    label?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function CountdownTimer({
    duration,
    onComplete,
    autoStart = false,
    label,
    size = 'md',
}: CountdownTimerProps) {
    const [remaining, setRemaining] = useState(duration);
    const [isRunning, setIsRunning] = useState(autoStart);

    const progress = ((duration - remaining) / duration) * 100;
    const isComplete = remaining <= 0;

    useEffect(() => {
        if (!isRunning || isComplete) return;

        const interval = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    setIsRunning(false);
                    onComplete?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, isComplete, onComplete]);

    const handleReset = () => {
        setRemaining(duration);
        setIsRunning(false);
    };

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-3xl',
    };

    const progressColor =
        remaining > duration * 0.5
            ? 'bg-primary-500'
            : remaining > duration * 0.2
            ? 'bg-amber-500'
            : 'bg-red-500';

    return (
        <div className="inline-flex flex-col items-center gap-2">
            {label && (
                <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <Clock className="h-3 w-3" />
                    {label}
                </div>
            )}

            <div className={`font-mono font-semibold tabular-nums ${sizeClasses[size]} ${
                isComplete ? 'text-red-400' : 'text-white'
            }`}>
                {formatTime(remaining)}
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full max-w-[120px] overflow-hidden rounded-full bg-white/10">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${progressColor}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    disabled={isComplete}
                    className="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
                    aria-label={isRunning ? 'Pause' : 'Start'}
                >
                    {isRunning ? (
                        <Pause className="h-3.5 w-3.5" />
                    ) : (
                        <Play className="h-3.5 w-3.5" />
                    )}
                </button>
                <button
                    onClick={handleReset}
                    className="rounded-md p-1.5 text-surface-500 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label="Reset"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}
