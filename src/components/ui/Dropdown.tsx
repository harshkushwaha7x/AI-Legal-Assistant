'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

interface DropdownProps {
    items: DropdownItem[];
    value?: string;
    placeholder?: string;
    onSelect: (value: string) => void;
    align?: 'left' | 'right';
}

export default function Dropdown({
    items,
    value,
    placeholder = 'Select...',
    onSelect,
    align = 'left',
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedItem = items.find((item) => item.value === value);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition-all hover:border-white/20 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
            >
                <span className={selectedItem ? 'text-white' : 'text-surface-500'}>
                    {selectedItem?.label || placeholder}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-surface-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className={`absolute z-50 mt-1 min-w-[180px] rounded-xl border border-white/10 bg-surface-900 py-1 shadow-2xl ${
                    align === 'right' ? 'right-0' : 'left-0'
                }`}>
                    {items.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => {
                                if (!item.disabled) {
                                    onSelect(item.value);
                                    setOpen(false);
                                }
                            }}
                            disabled={item.disabled}
                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                                item.value === value
                                    ? 'bg-primary-500/10 text-primary-400'
                                    : item.disabled
                                    ? 'cursor-not-allowed text-surface-600'
                                    : 'text-surface-300 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            {item.icon && <span className="shrink-0">{item.icon}</span>}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
