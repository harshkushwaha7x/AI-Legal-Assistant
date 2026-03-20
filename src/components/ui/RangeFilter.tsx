'use client';

import { useState } from 'react';
import { Sliders, RotateCcw } from 'lucide-react';

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step = 1, unit, onChange }: SliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-surface-400">{label}</span>
                <span className="text-[10px] font-medium text-white">
                    {value}{unit && <span className="text-surface-500 ml-0.5">{unit}</span>}
                </span>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div
                    className="absolute top-[11px] left-0 h-1 rounded-full bg-primary-500/50 pointer-events-none"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export interface RangeFilterValues {
    minRisk: number;
    maxPages: number;
    minConfidence: number;
    recentDays: number;
}

interface RangeFilterProps {
    values: RangeFilterValues;
    onChange: (values: RangeFilterValues) => void;
    onReset?: () => void;
}

const DEFAULTS: RangeFilterValues = {
    minRisk: 0,
    maxPages: 100,
    minConfidence: 50,
    recentDays: 30,
};

export default function RangeFilter({ values, onChange, onReset }: RangeFilterProps) {
    const handleChange = (key: keyof RangeFilterValues, value: number) => {
        onChange({ ...values, [key]: value });
    };

    const isDefault =
        values.minRisk === DEFAULTS.minRisk &&
        values.maxPages === DEFAULTS.maxPages &&
        values.minConfidence === DEFAULTS.minConfidence &&
        values.recentDays === DEFAULTS.recentDays;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sliders className="h-3.5 w-3.5 text-surface-500" />
                    <span className="text-xs font-medium text-surface-400">Range Filters</span>
                </div>
                {!isDefault && (
                    <button
                        onClick={() => {
                            onChange(DEFAULTS);
                            onReset?.();
                        }}
                        className="flex items-center gap-1 text-[10px] text-surface-600 hover:text-surface-300 transition-colors"
                    >
                        <RotateCcw className="h-2.5 w-2.5" />
                        Reset
                    </button>
                )}
            </div>

            <Slider
                label="Minimum Risk Score"
                value={values.minRisk}
                min={0}
                max={10}
                onChange={(v) => handleChange('minRisk', v)}
            />

            <Slider
                label="Max Document Pages"
                value={values.maxPages}
                min={1}
                max={500}
                step={5}
                unit=" pages"
                onChange={(v) => handleChange('maxPages', v)}
            />

            <Slider
                label="Min Confidence"
                value={values.minConfidence}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={(v) => handleChange('minConfidence', v)}
            />

            <Slider
                label="Recent Activity"
                value={values.recentDays}
                min={1}
                max={365}
                unit=" days"
                onChange={(v) => handleChange('recentDays', v)}
            />
        </div>
    );
}
