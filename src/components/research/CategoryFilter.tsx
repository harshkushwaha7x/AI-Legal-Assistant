'use client';

import { LEGAL_CATEGORIES } from '@/lib/validations/research';

interface CategoryFilterProps {
    selected: string;
    onChange: (category: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-1.5">
            <button
                onClick={() => onChange('')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${selected === ''
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                        : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white'
                    }`}
            >
                All Topics
            </button>
            {LEGAL_CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onChange(selected === cat ? '' : cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${selected === cat
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                            : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
