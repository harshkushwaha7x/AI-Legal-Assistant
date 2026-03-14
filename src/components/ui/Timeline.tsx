'use client';

interface TimelineItem {
    id: string;
    title: string;
    description?: string;
    timestamp: string;
    status?: 'completed' | 'active' | 'pending';
    icon?: React.ReactNode;
}

interface TimelineProps {
    items: TimelineItem[];
}

const DOT_STYLES = {
    completed: 'bg-green-400 ring-green-400/20',
    active: 'bg-primary-400 ring-primary-400/20 animate-pulse',
    pending: 'bg-surface-600 ring-surface-600/20',
};

export default function Timeline({ items }: TimelineProps) {
    return (
        <div className="relative space-y-0">
            {items.map((item, index) => {
                const status = item.status || 'completed';
                const isLast = index === items.length - 1;

                return (
                    <div key={item.id} className="relative flex gap-4 pb-6">
                        {/* Connector line */}
                        {!isLast && (
                            <div className="absolute left-[7px] top-4 h-full w-px bg-white/5" />
                        )}

                        {/* Dot */}
                        <div className="relative z-10 mt-1 flex shrink-0">
                            {item.icon ? (
                                <div className="flex h-4 w-4 items-center justify-center">
                                    {item.icon}
                                </div>
                            ) : (
                                <div
                                    className={`h-[14px] w-[14px] rounded-full ring-4 ${DOT_STYLES[status]}`}
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-white">{item.title}</p>
                                <time className="shrink-0 text-[10px] text-surface-600">
                                    {new Date(item.timestamp).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </time>
                            </div>
                            {item.description && (
                                <p className="mt-0.5 text-xs text-surface-500">{item.description}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
