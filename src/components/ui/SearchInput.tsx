'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    debounceMs?: number;
}

export default function SearchInput({
    placeholder = 'Search...',
    onSearch,
    debounceMs = 300,
}: SearchInputProps) {
    const [value, setValue] = useState('');
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => onSearch(newValue.trim()), debounceMs);
        setTimer(newTimer);
    };

    const clear = () => {
        setValue('');
        onSearch('');
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-sm text-white outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 placeholder-surface-500"
            />
            {value && (
                <button
                    onClick={clear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-surface-500 hover:text-white transition-colors"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}
