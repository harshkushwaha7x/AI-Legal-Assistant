'use client';

interface DataTableColumn<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    width?: string;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
    keyExtractor: (item: T) => string;
}

export default function DataTable<T>({
    columns,
    data,
    onRowClick,
    emptyMessage = 'No data available',
    keyExtractor,
}: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="rounded-xl border border-white/5 py-12 text-center">
                <p className="text-sm text-surface-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/5 bg-white/[2%]">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-surface-500"
                                style={col.width ? { width: col.width } : undefined}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[3%]">
                    {data.map((item) => (
                        <tr
                            key={keyExtractor(item)}
                            onClick={() => onRowClick?.(item)}
                            className={`transition-colors ${onRowClick
                                    ? 'cursor-pointer hover:bg-white/[3%]'
                                    : ''
                                }`}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-sm text-surface-300">
                                    {col.render
                                        ? col.render(item)
                                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
