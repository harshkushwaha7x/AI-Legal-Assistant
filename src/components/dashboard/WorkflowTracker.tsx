'use client';

import { useMemo } from 'react';
import {
    CheckCircle2,
    Circle,
    Loader2,
    SkipForward,
    XCircle,
    ChevronRight,
} from 'lucide-react';
import type { Workflow, WorkflowStep, StepStatus } from '@/lib/workflow-engine';
import { getWorkflowProgress, isWorkflowComplete } from '@/lib/workflow-engine';

interface WorkflowTrackerProps {
    workflow: Workflow;
    onCompleteStep?: (stepId: string) => void;
    onSkipStep?: (stepId: string) => void;
}

const STATUS_CONFIG: Record<StepStatus, { icon: React.ElementType; color: string; bg: string }> = {
    pending: { icon: Circle, color: 'text-surface-600', bg: 'bg-surface-800' },
    in_progress: { icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    skipped: { icon: SkipForward, color: 'text-surface-500', bg: 'bg-surface-800' },
    failed: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function WorkflowTracker({ workflow, onCompleteStep, onSkipStep }: WorkflowTrackerProps) {
    const progress = useMemo(() => getWorkflowProgress(workflow), [workflow]);
    const complete = useMemo(() => isWorkflowComplete(workflow), [workflow]);

    return (
        <div className="glass-card rounded-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">{workflow.name}</h3>
                <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                    complete ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                    {complete ? 'Complete' : `${progress}%`}
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        complete ? 'bg-emerald-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step list */}
            <div className="space-y-1">
                {workflow.steps.map((step, i) => {
                    const config = STATUS_CONFIG[step.status];
                    const Icon = config.icon;
                    const isActive = i === workflow.currentStepIndex && step.status === 'pending';

                    return (
                        <div
                            key={step.id}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                                isActive ? 'bg-white/5 ring-1 ring-primary-500/20' : ''
                            }`}
                        >
                            <div className={`shrink-0 ${config.color}`}>
                                <Icon className={`h-4 w-4 ${
                                    step.status === 'in_progress' ? 'animate-spin' : ''
                                }`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-medium ${
                                        step.status === 'completed' ? 'text-surface-400' :
                                        step.status === 'skipped' ? 'text-surface-600 line-through' :
                                        'text-white'
                                    }`}>
                                        {step.name}
                                    </span>
                                    {!step.required && (
                                        <span className="text-[8px] uppercase tracking-wider text-surface-700">
                                            Optional
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-surface-600 truncate">
                                    {step.notes || step.description}
                                </p>
                            </div>

                            {/* Actions for active step */}
                            {isActive && (
                                <div className="flex items-center gap-1">
                                    {onCompleteStep && (
                                        <button
                                            onClick={() => onCompleteStep(step.id)}
                                            className="rounded-md bg-primary-600 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-primary-500 transition-colors"
                                        >
                                            Done
                                        </button>
                                    )}
                                    {onSkipStep && !step.required && (
                                        <button
                                            onClick={() => onSkipStep(step.id)}
                                            className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-surface-500 hover:text-surface-300 transition-colors"
                                        >
                                            Skip
                                        </button>
                                    )}
                                </div>
                            )}

                            {step.status === 'completed' && step.completedAt && (
                                <span className="text-[9px] text-surface-700 shrink-0">
                                    {new Date(step.completedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
