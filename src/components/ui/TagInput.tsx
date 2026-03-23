'use client';

import { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
    suggestions?: string[];
}

export default function TagInput({
    tags,
    onChange,
    placeholder = 'Add a tag...',
    maxTags = 20,
    suggestions = [],
}: TagInputProps) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = suggestions.filter(
        (s) =>
            s.toLowerCase().includes(input.toLowerCase()) &&
            !tags.includes(s) &&
            input.length > 0
    );

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed || tags.includes(trimmed) || tags.length >= maxTags) return;
        onChange([...tags, trimmed]);
        setInput('');
        setShowSuggestions(false);
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5">
                <Tag className="h-3 w-3 text-surface-600" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-surface-500">
                    Tags
                </span>
                {maxTags && (
                    <span className="text-[9px] text-surface-700">
                        {tags.length}/{maxTags}
                    </span>
                )}
            </div>

            {/* Tag display */}
            <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-primary-500/10 px-2 py-0.5 text-[10px] text-primary-400"
                    >
                        {tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="rounded-full hover:bg-primary-500/20 transition-colors"
                        >
                            <X className="h-2.5 w-2.5" />
                        </button>
                    </span>
                ))}
            </div>

            {/* Input */}
            {tags.length < maxTags && (
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        placeholder={placeholder}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-surface-600 outline-none focus:border-primary-500"
                    />

                    {/* Suggestions dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-white/10 bg-surface-900 py-1 shadow-xl">
                            {filteredSuggestions.slice(0, 5).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => addTag(s)}
                                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-surface-300 hover:bg-white/5"
                                >
                                    <Plus className="h-3 w-3 text-surface-600" />
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
