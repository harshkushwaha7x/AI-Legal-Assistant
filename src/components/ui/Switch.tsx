'use client';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: 'sm' | 'md';
}

export default function Switch({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    size = 'md',
}: SwitchProps) {
    const trackSize = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
    const thumbSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
    const thumbTranslate = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

    return (
        <label className={`flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`relative inline-flex shrink-0 rounded-full transition-colors duration-200 ${trackSize} ${
                    checked ? 'bg-primary-500' : 'bg-surface-700'
                }`}
            >
                <span
                    className={`inline-block rounded-full bg-white shadow-sm transition-transform duration-200 ${thumbSize} ${
                        checked ? thumbTranslate : 'translate-x-1'
                    } mt-[3px]`}
                />
            </button>
            {(label || description) && (
                <div>
                    {label && <span className="text-sm font-medium text-white">{label}</span>}
                    {description && (
                        <p className="text-[11px] text-surface-500">{description}</p>
                    )}
                </div>
            )}
        </label>
    );
}
