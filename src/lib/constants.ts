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

// -- Operational Constants -----------------------------------------------

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
];
export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];

export const RATE_LIMIT_API = { maxRequests: 60, windowMs: 60 * 1000 };
export const RATE_LIMIT_AUTH = { maxRequests: 10, windowMs: 60 * 1000 };
export const RATE_LIMIT_AI = { maxRequests: 20, windowMs: 60 * 1000 };

export const DOCUMENT_STATUSES = [
    { value: 'DRAFT', label: 'Draft', color: 'text-surface-400' },
    { value: 'REVIEW', label: 'In Review', color: 'text-amber-400' },
    { value: 'FINAL', label: 'Final', color: 'text-green-400' },
    { value: 'ARCHIVED', label: 'Archived', color: 'text-surface-600' },
] as const;

export const RISK_LEVELS = [
    { value: 'LOW', label: 'Low Risk', color: 'text-green-400', bg: 'bg-green-500/10' },
    { value: 'MEDIUM', label: 'Medium Risk', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { value: 'HIGH', label: 'High Risk', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { value: 'CRITICAL', label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10' },
] as const;

export const SUBSCRIPTION_LIMITS = [
    { value: 'FREE', label: 'Free', documentsPerMonth: 5, aiQueriesPerDay: 10 },
    { value: 'PRO', label: 'Pro', documentsPerMonth: 50, aiQueriesPerDay: 100 },
    { value: 'ENTERPRISE', label: 'Enterprise', documentsPerMonth: -1, aiQueriesPerDay: -1 },
] as const;

export const DASHBOARD_NAV_ITEMS = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Documents', href: '/dashboard/documents' },
    { label: 'AI Chat', href: '/dashboard/chat' },
    { label: 'Contract Review', href: '/dashboard/review' },
    { label: 'Research', href: '/dashboard/research' },
    { label: 'Templates', href: '/dashboard/templates' },
    { label: 'Escalations', href: '/dashboard/escalations' },
    { label: 'Settings', href: '/dashboard/settings' },
] as const;

export const API_TIMEOUT = 30000;
export const AI_MODEL = 'gpt-4o-mini';
export const AI_MAX_TOKENS = 2000;
export const AI_TEMPERATURE = 0.4;
