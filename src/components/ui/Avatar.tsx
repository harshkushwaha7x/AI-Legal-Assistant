'use client';

interface AvatarProps {
    name?: string | null;
    src?: string | null;
    size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
};

const COLORS = [
    'bg-primary-600/20 text-primary-400',
    'bg-emerald-600/20 text-emerald-400',
    'bg-violet-600/20 text-violet-400',
    'bg-amber-600/20 text-amber-400',
    'bg-rose-600/20 text-rose-400',
    'bg-cyan-600/20 text-cyan-400',
];

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function getColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ name, src, size = 'md' }: AvatarProps) {
    if (src) {
        return (
            <img
                src={src}
                alt={name || 'Avatar'}
                className={`${SIZES[size]} rounded-full object-cover ring-1 ring-white/10`}
            />
        );
    }

    const displayName = name || 'User';
    const initials = getInitials(displayName);
    const color = getColor(displayName);

    return (
        <div className={`${SIZES[size]} ${color} flex items-center justify-center rounded-full font-bold ring-1 ring-white/10`}>
            {initials}
        </div>
    );
}
