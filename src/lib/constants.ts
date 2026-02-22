export const APP_NAME = 'LegalAI';
export const APP_DESCRIPTION = 'AI-powered legal assistant for document generation, contract review, and legal research.';

export const NAV_ITEMS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
] as const;

export const FEATURES = [
    {
        icon: 'FileText',
        title: 'Document Generation',
        description: 'Generate NDAs, leases, contracts, and more with AI-powered templates. Customize every detail.',
        href: '/dashboard/documents',
    },
    {
        icon: 'ShieldCheck',
        title: 'Contract Review',
        description: 'Upload contracts for instant AI analysis with risk scoring and clause-by-clause breakdown.',
        href: '/dashboard/reviews',
    },
    {
        icon: 'MessageSquare',
        title: 'Legal AI Chat',
        description: 'Ask legal questions in plain English. Get instant, accurate answers backed by legal knowledge.',
        href: '/dashboard/chat',
    },
    {
        icon: 'UserCheck',
        title: 'Lawyer Escalation',
        description: 'Seamlessly escalate complex cases to verified human lawyers when AI reaches its limits.',
        href: '/dashboard/escalate',
    },
    {
        icon: 'Building2',
        title: 'B2B Templates',
        description: 'Enterprise-grade document automation for law firms and legal departments.',
        href: '/dashboard/templates',
    },
    {
        icon: 'Search',
        title: 'Legal Research',
        description: 'AI-powered legal research with vector search across statutes, case law, and regulations.',
        href: '/dashboard/research',
    },
] as const;

export const PRICING_PLANS = [
    {
        name: 'Starter',
        price: '$0',
        period: '/month',
        description: 'Perfect for individuals needing basic legal assistance.',
        features: [
            '5 documents per month',
            'Basic AI chat',
            '1 contract review',
            'Email support',
        ],
        cta: 'Get Started Free',
        popular: false,
    },
    {
        name: 'Professional',
        price: '$49',
        period: '/month',
        description: 'For professionals who need powerful legal tools daily.',
        features: [
            'Unlimited documents',
            'Advanced AI chat with memory',
            '25 contract reviews',
            'Risk scoring & analysis',
            'Lawyer escalation',
            'Priority support',
        ],
        cta: 'Start Pro Trial',
        popular: true,
    },
    {
        name: 'Enterprise',
        price: '$199',
        period: '/month',
        description: 'For law firms and legal departments at scale.',
        features: [
            'Everything in Pro',
            'Custom templates',
            'Team management',
            'API access',
            'SSO & SAML',
            'Dedicated success manager',
            'Custom AI training',
        ],
        cta: 'Contact Sales',
        popular: false,
    },
] as const;

export const HOW_IT_WORKS_STEPS = [
    {
        step: '01',
        title: 'Describe Your Need',
        description: 'Tell our AI what legal document you need or upload a contract for review. No legal jargon required.',
    },
    {
        step: '02',
        title: 'AI Generates & Analyzes',
        description: 'Our AI processes your request using advanced language models trained on legal knowledge bases.',
    },
    {
        step: '03',
        title: 'Review & Finalize',
        description: 'Review the AI output, make edits, and finalize. Escalate to a human lawyer if needed.',
    },
] as const;
