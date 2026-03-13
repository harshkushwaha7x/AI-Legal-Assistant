'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';
import Switch from '@/components/ui/Switch';

interface SettingsSection {
    id: string;
    label: string;
    icon: typeof User;
}

const SECTIONS: SettingsSection[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
];

export default function SettingsLayout() {
    const [activeSection, setActiveSection] = useState('profile');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="flex gap-6">
            {/* Sidebar */}
            <nav className="w-48 shrink-0">
                <ul className="space-y-1">
                    {SECTIONS.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <li key={section.id}>
                                <button
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                                        isActive
                                            ? 'bg-primary-500/10 text-primary-400 font-medium'
                                            : 'text-surface-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {section.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Content */}
            <div className="flex-1 space-y-6">
                {activeSection === 'profile' && (
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white">Profile Settings</h3>
                        <p className="mt-1 text-sm text-surface-400">Manage your account information</p>
                        <div className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm text-surface-300">Full Name</label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-500"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-surface-300">Email</label>
                                <input
                                    type="email"
                                    className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-500"
                                    placeholder="you@example.com"
                                    disabled
                                />
                                <p className="mt-1 text-[11px] text-surface-600">Email is managed by your sign-in provider</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'notifications' && (
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                        <p className="mt-1 text-sm text-surface-400">Control how you receive notifications</p>
                        <div className="mt-6 space-y-4">
                            <Switch
                                checked={emailNotifications}
                                onChange={setEmailNotifications}
                                label="Email Notifications"
                                description="Receive updates about your documents via email"
                            />
                            <Switch
                                checked={pushNotifications}
                                onChange={setPushNotifications}
                                label="Push Notifications"
                                description="Get browser push notifications for important events"
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'security' && (
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white">Security</h3>
                        <p className="mt-1 text-sm text-surface-400">Manage your security settings</p>
                        <div className="mt-6 space-y-4">
                            <Switch
                                checked={twoFactor}
                                onChange={setTwoFactor}
                                label="Two-Factor Authentication"
                                description="Add an extra layer of security to your account"
                            />
                            <div className="rounded-lg border border-white/5 bg-white/[2%] p-4">
                                <p className="text-sm font-medium text-white">Active Sessions</p>
                                <p className="mt-1 text-xs text-surface-500">You are currently logged in from 1 device</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'appearance' && (
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white">Appearance</h3>
                        <p className="mt-1 text-sm text-surface-400">Customize the look and feel</p>
                        <div className="mt-6 space-y-4">
                            <Switch
                                checked={darkMode}
                                onChange={setDarkMode}
                                label="Dark Mode"
                                description="Use dark color scheme across the application"
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'language' && (
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white">Language & Region</h3>
                        <p className="mt-1 text-sm text-surface-400">Set your preferred language and region</p>
                        <div className="mt-6">
                            <label className="block text-sm text-surface-300">Language</label>
                            <select className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-primary-500">
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
