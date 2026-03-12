'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItem {
    id: string;
    title: string;
    content: string | React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggle = (id: string) => {
        setOpenItems((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                if (!allowMultiple) next.clear();
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="divide-y divide-white/5 rounded-xl border border-white/5">
            {items.map((item) => {
                const isOpen = openItems.has(item.id);
                return (
                    <div key={item.id}>
                        <button
                            onClick={() => toggle(item.id)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white transition-colors hover:bg-white/[3%]"
                            aria-expanded={isOpen}
                        >
                            <span>{item.title}</span>
                            {isOpen ? (
                                <ChevronUp className="h-4 w-4 text-surface-500" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-surface-500" />
                            )}
                        </button>
                        {isOpen && (
                            <div className="px-4 pb-4 text-sm leading-relaxed text-surface-400">
                                {item.content}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
