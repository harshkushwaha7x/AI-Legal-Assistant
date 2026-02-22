'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Scale,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    AlertCircle,
    Loader2,
    User,
    CheckCircle2,
} from 'lucide-react';
import { signupSchema, type SignupFormData } from '@/lib/validations/auth';

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const password = watch('password', '');

    const passwordChecks = [
        { label: 'At least 8 characters', valid: password.length >= 8 },
        { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
        { label: 'One lowercase letter', valid: /[a-z]/.test(password) },
        { label: 'One number', valid: /\d/.test(password) },
    ];

    const onSubmit = async (data: SignupFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error || 'Something went wrong');
                return;
            }

            // Auto sign-in after registration
            const signInResult = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signInResult?.error) {
                // Registration succeeded but auto-signin failed, redirect to login
                router.push('/login?registered=true');
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = (provider: string) => {
        signIn(provider, { callbackUrl: '/dashboard' });
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 py-20 pt-24">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-primary-600/8 blur-[128px]" />
                <div className="absolute -left-40 bottom-20 h-[400px] w-[400px] rounded-full bg-accent-500/6 blur-[128px]" />
            </div>

            <div className="relative w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">LegalAI</span>
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold text-white">Create your account</h1>
                    <p className="mt-2 text-surface-400">Start using AI-powered legal assistance today</p>
                </div>

                {/* Form card */}
                <div className="glass-card rounded-2xl p-8">
                    {/* Error message */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-surface-300">
                                Full name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                                <input
                                    {...register('name')}
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="John Doe"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-surface-300">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                                <input
                                    {...register('email')}
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-surface-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                                <input
                                    {...register('password')}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
                            )}

                            {/* Password strength indicators */}
                            {password.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 gap-1.5">
                                    {passwordChecks.map((check) => (
                                        <div
                                            key={check.label}
                                            className={`flex items-center gap-1.5 text-xs ${check.valid ? 'text-accent-500' : 'text-surface-500'
                                                }`}
                                        >
                                            <CheckCircle2 className="h-3 w-3" />
                                            {check.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-surface-300">
                                Confirm password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
                                <input
                                    {...register('confirmPassword')}
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-surface-500 outline-none transition-all focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50"
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <p className="text-xs leading-relaxed text-surface-500">
                            By creating an account, you agree to our{' '}
                            <Link href="/terms" className="text-primary-400 hover:text-primary-300">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary-400 hover:text-primary-300">
                                Privacy Policy
                            </Link>
                            .
                        </p>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs text-surface-500">or continue with</span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {/* OAuth buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleOAuthSignIn('google')}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button
                            onClick={() => handleOAuthSignIn('github')}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>
                </div>

                {/* Sign in link */}
                <p className="mt-6 text-center text-sm text-surface-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-primary-400 transition-colors hover:text-primary-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
