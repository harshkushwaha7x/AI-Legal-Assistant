import Link from 'next/link';
import {
    FileText,
    ShieldCheck,
    MessageSquare,
    UserCheck,
    Building2,
    Search,
    ArrowRight,
    Sparkles,
    Check,
    Zap,
    Globe,
    Lock,
} from 'lucide-react';
import { FEATURES, PRICING_PLANS, HOW_IT_WORKS_STEPS } from '@/lib/constants';

/* ── Icon map for dynamic rendering ──────────────────────── */
const iconMap: Record<string, React.ElementType> = {
    FileText,
    ShieldCheck,
    MessageSquare,
    UserCheck,
    Building2,
    Search,
};

export default function HomePage() {
    return (
        <div className="relative overflow-hidden">
            {/* ─── Ambient background glow ─────────────────────── */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-primary-600/10 blur-[128px]" />
                <div className="absolute -right-40 top-40 h-[500px] w-[500px] rounded-full bg-accent-500/8 blur-[128px]" />
                <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary-800/10 blur-[128px]" />
            </div>

            {/* ═══════════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════════ */}
            <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pt-40">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Badge */}
                    <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-300">
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered Legal Technology</span>
                    </div>

                    {/* Headline */}
                    <h1 className="animate-fade-in text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl"
                        style={{ animationDelay: '100ms' }}>
                        Legal Work,{' '}
                        <span className="text-gradient">Simplified</span>{' '}
                        by AI
                    </h1>

                    {/* Sub-headline */}
                    <p className="animate-fade-in mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-surface-400 sm:text-xl"
                        style={{ animationDelay: '200ms' }}>
                        Generate contracts, review documents with AI risk scoring, and get instant
                        legal answers — all in plain English. Built for individuals and law firms.
                    </p>

                    {/* CTA buttons */}
                    <div className="animate-fade-in mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                        style={{ animationDelay: '300ms' }}>
                        <Link
                            href="/signup"
                            className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5"
                        >
                            Start Free Trial
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/20"
                        >
                            See How It Works
                        </Link>
                    </div>

                    {/* Trust bar */}
                    <div className="animate-fade-in mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-surface-500"
                        style={{ animationDelay: '400ms' }}>
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-accent-500" />
                            SOC 2 Compliant
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-accent-500" />
                            50-State Coverage
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-accent-500" />
                            10x Faster Than Manual
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
          FEATURES SECTION
         ═══════════════════════════════════════════════════ */}
            <section id="features" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything You Need for{' '}
                        <span className="text-gradient">Legal Work</span>
                    </h2>
                    <p className="mt-4 text-surface-400">
                        From document generation to AI-powered contract analysis — one platform for all your legal needs.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature, i) => {
                        const Icon = iconMap[feature.icon] || FileText;
                        return (
                            <div
                                key={feature.title}
                                className="glass-card group rounded-2xl p-6 animate-slide-up"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/15 text-primary-400 transition-colors group-hover:bg-primary-600/25">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                                <p className="text-sm leading-relaxed text-surface-400">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
          HOW IT WORKS SECTION
         ═══════════════════════════════════════════════════ */}
            <section id="how-it-works" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        How <span className="text-gradient">LegalAI</span> Works
                    </h2>
                    <p className="mt-4 text-surface-400">
                        Three simple steps to handle any legal task with AI assistance.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={step.step} className="relative text-center animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                            {/* Connector line */}
                            {i < HOW_IT_WORKS_STEPS.length - 1 && (
                                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-primary-600/40 to-transparent md:block" />
                            )}
                            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                                <div className="absolute inset-0 rounded-full bg-primary-600/10 animate-pulse-glow" />
                                <span className="relative text-3xl font-extrabold text-gradient">{step.step}</span>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">{step.title}</h3>
                            <p className="mx-auto max-w-xs text-sm leading-relaxed text-surface-400">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
          PRICING SECTION
         ═══════════════════════════════════════════════════ */}
            <section id="pricing" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Simple, Transparent{' '}
                        <span className="text-gradient">Pricing</span>
                    </h2>
                    <p className="mt-4 text-surface-400">
                        Start free. Upgrade when you need more power.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {PRICING_PLANS.map((plan, i) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-8 animate-slide-up ${plan.popular
                                ? 'border-2 border-primary-500 bg-primary-950/40 shadow-xl shadow-primary-600/10'
                                : 'glass-card'
                                }`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                            <p className="mt-1 text-sm text-surface-400">{plan.description}</p>

                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                                <span className="text-surface-500">{plan.period}</span>
                            </div>

                            <ul className="mt-8 space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-surface-300">
                                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/signup"
                                className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition-all ${plan.popular
                                    ? 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-600/25'
                                    : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════
          BOTTOM CTA SECTION
         ═══════════════════════════════════════════════════ */}
            <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="glass-card rounded-3xl p-12 text-center sm:p-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Ready to Transform Your{' '}
                        <span className="text-gradient">Legal Workflow</span>?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-surface-400">
                        Join thousands of professionals using AI to handle legal work faster, cheaper, and more accurately.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/signup"
                            className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Get Started Free
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                        >
                            Talk to Sales
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
