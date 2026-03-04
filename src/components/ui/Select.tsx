'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function Select({
    options,
    value,
    onChange,
    placeholder = 'Select...',
}: SelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
            >
                <span className={selected ? 'text-white' : 'text-surface-500'}>
                    {selected?.label || placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 text-surface-500 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="absolute z-10 mt-1 w-full animate-fade-in rounded-xl border border-white/5 bg-surface-900 p-1 shadow-xl">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors ${option.value === value
                                    ? 'bg-primary-600/10 text-primary-300'
                                    : 'text-surface-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
