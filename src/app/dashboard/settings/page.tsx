'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Key,
    Save,
    Loader2,
    Check,
} from 'lucide-react';

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Profile state
    const [name, setName] = useState(session?.user?.name || '');
    const [email] = useState(session?.user?.email || '');

    // Notification state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [documentAlerts, setDocumentAlerts] = useState(true);
    const [reviewNotifications, setReviewNotifications] = useState(true);
    const [escalationUpdates, setEscalationUpdates] = useState(true);

    const handleSave = async () => {
        setSaving(true);
        // Simulate save
        await new Promise((r) => setTimeout(r, 1000));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'api', label: 'API Keys', icon: Key },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="mt-1 text-sm text-surface-400">Manage your account preferences and configuration.</p>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Sidebar tabs */}
                <div className="w-full shrink-0 lg:w-52">
                    <div className="glass-card rounded-xl p-1.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all ${activeTab === tab.id
                                        ? 'bg-primary-600/10 font-medium text-primary-300'
                                        : 'text-surface-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'profile' && (
                        <div className="glass-card space-y-6 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white">Profile Information</h2>

                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/10 text-2xl font-bold text-primary-400">
                                    {name.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-medium text-white">{name || 'User'}</p>
                                    <p className="text-sm text-surface-400">{email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-surface-300">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-surface-300">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-surface-500 outline-none cursor-not-allowed"
                                    />
                                    <p className="mt-1 text-[11px] text-surface-600">Email cannot be changed. Managed by your authentication provider.</p>
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-white/5 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="glass-card space-y-6 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
                            <div className="space-y-4">
                                {[
                                    { label: 'Email Notifications', desc: 'Receive updates via email', state: emailNotifications, setter: setEmailNotifications },
                                    { label: 'Document Alerts', desc: 'Get notified when documents are generated', state: documentAlerts, setter: setDocumentAlerts },
                                    { label: 'Review Notifications', desc: 'Alerts when contract reviews complete', state: reviewNotifications, setter: setReviewNotifications },
                                    { label: 'Escalation Updates', desc: 'Status changes on lawyer escalations', state: escalationUpdates, setter: setEscalationUpdates },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/5 p-4">
                                        <div>
                                            <p className="text-sm font-medium text-white">{item.label}</p>
                                            <p className="text-xs text-surface-500">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => item.setter(!item.state)}
                                            className={`relative h-6 w-11 rounded-full transition-colors ${item.state ? 'bg-primary-600' : 'bg-surface-700'}`}
                                        >
                                            <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${item.state ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="glass-card space-y-6 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white">Appearance</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-surface-300">Theme</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Dark', 'Light', 'System'].map((theme) => (
                                            <button
                                                key={theme}
                                                className={`rounded-xl border p-4 text-center text-sm transition-all ${theme === 'Dark' ? 'border-primary-500 bg-primary-500/5 text-primary-300' : 'border-white/5 bg-white/[0.02] text-surface-400 hover:border-white/10'
                                                    }`}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="glass-card space-y-6 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white">Security</h2>
                            <div className="space-y-4">
                                <div className="rounded-xl border border-white/5 p-4">
                                    <p className="text-sm font-medium text-white">Authentication Provider</p>
                                    <p className="mt-1 text-xs text-surface-500">Your account is secured through your OAuth provider (Google, GitHub, etc.).</p>
                                </div>
                                <div className="rounded-xl border border-white/5 p-4">
                                    <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                                    <p className="mt-1 text-xs text-surface-500">2FA is managed by your authentication provider. Enable it in your provider&apos;s settings.</p>
                                </div>
                                <div className="rounded-xl border border-white/5 p-4">
                                    <p className="text-sm font-medium text-white">Active Sessions</p>
                                    <p className="mt-1 text-xs text-surface-500">Currently logged in from 1 device.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'api' && (
                        <div className="glass-card space-y-6 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white">API Configuration</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-surface-300">OpenAI API Key</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            defaultValue="sk-•••••••••••••••••••••••"
                                            disabled
                                            className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-surface-500 outline-none cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="mt-1 text-[11px] text-surface-600">API keys are configured via environment variables on the server.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
