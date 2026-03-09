'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    User,
    Mail,
    Calendar,
    FileText,
    ShieldCheck,
    MessageSquare,
    UserCheck,
    Shield,
    Loader2,
} from 'lucide-react';

interface ProfileData {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
    subscriptionTier: string;
    createdAt: string;
    _count: {
        documents: number;
        contractReviews: number;
        chatSessions: number;
        escalations: number;
    };
}

export default function UserProfile() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data.user);
                }
            } catch {
                console.error('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-primary-400" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="py-12 text-center text-sm text-surface-400">
                Unable to load profile
            </div>
        );
    }

    const stats = [
        { label: 'Documents', value: profile._count.documents, icon: FileText, color: 'text-primary-400' },
        { label: 'Reviews', value: profile._count.contractReviews, icon: ShieldCheck, color: 'text-emerald-400' },
        { label: 'Chat Sessions', value: profile._count.chatSessions, icon: MessageSquare, color: 'text-violet-400' },
        { label: 'Escalations', value: profile._count.escalations, icon: UserCheck, color: 'text-amber-400' },
    ];

    const initials = profile.name
        ? profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
        : 'U';

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <div className="glass-card flex items-center gap-5 rounded-2xl p-6">
                {profile.image ? (
                    <img
                        src={profile.image}
                        alt={profile.name || 'User'}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/20 text-lg font-bold text-primary-400 ring-2 ring-white/10">
                        {initials}
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-bold text-white">{profile.name || 'User'}</h2>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-md bg-primary-500/15 px-2 py-0.5 text-[10px] font-semibold text-primary-400">
                            {profile.subscriptionTier}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-surface-500">
                            <Shield className="h-3 w-3" />
                            {profile.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="mb-4 text-sm font-semibold text-white">Account Details</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-surface-500" />
                        <span className="text-sm text-surface-300">{profile.name || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-surface-500" />
                        <span className="text-sm text-surface-300">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-surface-500" />
                        <span className="text-sm text-surface-300">
                            Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card flex items-center gap-3 rounded-xl p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{stat.value}</p>
                            <p className="text-[11px] text-surface-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
