// ─── Core Entity Types ──────────────────────────────────────────────

export type UserRole = 'USER' | 'LAWYER' | 'ADMIN';
export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';
export type DocumentType = 'NDA' | 'LEASE' | 'CONTRACT' | 'EMPLOYMENT' | 'PARTNERSHIP' | 'CUSTOM';
export type DocumentStatus = 'DRAFT' | 'REVIEW' | 'FINAL' | 'ARCHIVED';
export type ReviewStatus = 'PENDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EscalationStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

// ─── User ───────────────────────────────────────────────────────────

export interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: UserRole;
    subscription: SubscriptionTier;
    organizationId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Organization ───────────────────────────────────────────────────

export interface Organization {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    logo: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Document ───────────────────────────────────────────────────────

export interface Document {
    id: string;
    title: string;
    type: DocumentType;
    status: DocumentStatus;
    content: string;
    metadata: Record<string, unknown> | null;
    userId: string;
    organizationId: string | null;
    templateId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Template ───────────────────────────────────────────────────────

export interface Template {
    id: string;
    name: string;
    description: string | null;
    type: DocumentType;
    content: string;
    variables: TemplateVariable[];
    isPublic: boolean;
    organizationId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface TemplateVariable {
    key: string;
    label: string;
    type: 'text' | 'date' | 'number' | 'select';
    required: boolean;
    options?: string[];
    defaultValue?: string;
}

// ─── Contract Review ────────────────────────────────────────────────

export interface ContractReview {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    status: ReviewStatus;
    riskScore: number | null;
    riskLevel: RiskLevel | null;
    summary: string | null;
    findings: ReviewFinding[] | null;
    clauses: ReviewClause[] | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReviewFinding {
    id: string;
    title: string;
    description: string;
    severity: RiskLevel;
    clause: string;
    suggestion: string;
}

export interface ReviewClause {
    id: string;
    title: string;
    content: string;
    riskLevel: RiskLevel;
    analysis: string;
}

// ─── Chat ───────────────────────────────────────────────────────────

export interface ChatSession {
    id: string;
    title: string;
    userId: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    metadata: Record<string, unknown> | null;
    sessionId: string;
    createdAt: Date;
}

// ─── Lawyer Escalation ──────────────────────────────────────────────

export interface LawyerEscalation {
    id: string;
    subject: string;
    description: string;
    status: EscalationStatus;
    priority: number;
    assignedTo: string | null;
    notes: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Navigation & UI ────────────────────────────────────────────────

export interface NavItem {
    label: string;
    href: string;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
    href: string;
}

export interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
}

export interface SelectOption {
    label: string;
    value: string;
}

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

// ─── Activity Log ───────────────────────────────────────────────────

export interface ActivityLog {
    id: string;
    action: string;
    entity: string;
    entityId: string | null;
    description: string | null;
    userId: string;
    createdAt: Date;
}

// ─── API Response ───────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ─── Legal Knowledge ────────────────────────────────────────────────

export interface LegalKnowledge {
    id: string;
    title: string;
    category: string;
    content: string;
    source: string | null;
    jurisdiction: string | null;
    createdAt: Date;
    updatedAt: Date;
}
