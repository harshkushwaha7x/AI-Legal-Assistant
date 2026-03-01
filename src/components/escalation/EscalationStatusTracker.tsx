'use client';

import { Check } from 'lucide-react';

interface StatusTrackerProps {
    currentStatus: string;
}

const STEPS = [
    { key: 'PENDING', label: 'Pending' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' },
];

const statusIndex: Record<string, number> = {
    PENDING: 0,
    ASSIGNED: 1,
    IN_PROGRESS: 2,
    RESOLVED: 3,
    CLOSED: 4,
};

export default function EscalationStatusTracker({ currentStatus }: StatusTrackerProps) {
    const currentIdx = statusIndex[currentStatus] ?? 0;

    return (
        <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
                const isCompleted = i < currentIdx;
                const isCurrent = i === currentIdx;

                return (
                    <div key={step.key} className="flex items-center gap-1">
                        {/* Step circle */}
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${isCompleted
                                        ? 'bg-emerald-500 text-white'
                                        : isCurrent
                                            ? 'bg-primary-600 text-white ring-2 ring-primary-400/30'
                                            : 'bg-white/5 text-surface-600'
                                    }`}
                            >
                                {isCompleted ? <Check className="h-3.5 w-3.5" /> : i + 1}
                            </div>
                            <span
                                className={`text-[10px] whitespace-nowrap ${isCurrent
                                        ? 'font-medium text-primary-400'
                                        : isCompleted
                                            ? 'text-emerald-400'
                                            : 'text-surface-600'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {i < STEPS.length - 1 && (
                            <div
                                className={`h-0.5 w-6 sm:w-10 rounded ${i < currentIdx ? 'bg-emerald-500' : 'bg-white/5'
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
