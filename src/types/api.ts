/**
 * API request and response type definitions
 * Shared types for client-server communication
 */

// ---- Generic ----

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

// ---- Documents ----

export interface CreateDocumentRequest {
    title: string;
    type: string;
    description?: string;
    parties?: {
        partyA: string;
        partyB: string;
    };
    jurisdiction?: string;
}

export interface DocumentResponse {
    id: string;
    title: string;
    content: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

// ---- Chat ----

export interface SendMessageRequest {
    message: string;
    sessionId?: string;
}

export interface ChatMessageResponse {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

export interface ChatSessionResponse {
    id: string;
    title: string;
    messages: ChatMessageResponse[];
    createdAt: string;
    updatedAt: string;
}

// ---- Contract Review ----

export interface ReviewRequest {
    contractName: string;
    contractText: string;
    reviewType?: string;
}

export interface ReviewIssue {
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    suggestion: string;
    clauseText?: string;
}

export interface ReviewResponse {
    id: string;
    contractName: string;
    overallRisk: string;
    riskScore: number;
    summary: string;
    issues: ReviewIssue[];
    recommendations: string[];
    createdAt: string;
}

// ---- Research ----

export interface ResearchRequest {
    query: string;
    category?: string;
    jurisdiction?: string;
}

export interface ResearchResponse {
    id: string;
    query: string;
    answer: string;
    sources: string[];
    relatedTopics: string[];
    confidence: number;
    createdAt: string;
}

// ---- Escalation ----

export interface EscalationRequest {
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    documentId?: string;
}

export interface EscalationResponse {
    id: string;
    subject: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

// ---- Profile ----

export interface ProfileResponse {
    profile: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        memberSince: string;
    };
    usage: {
        documents: number;
        chatSessions: number;
        contractReviews: number;
        escalations: number;
    };
}

export interface UpdateProfileRequest {
    name: string;
}

// ---- Stats ----

export interface StatsResponse {
    overview: {
        totalDocuments: number;
        totalReviews: number;
        totalChats: number;
        totalEscalations: number;
    };
    period: {
        documentsCreated: number;
        reviewsCompleted: number;
        chatsStarted: number;
        escalationsOpened: number;
    };
}

// ---- Notifications ----

export interface NotificationResponse {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

// ---- Health ----

export interface HealthResponse {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    version: string;
    environment: string;
    responseTime: number;
    services: Record<string, { status: string; latency?: string }>;
    memory: {
        heapUsedMB: number;
        heapTotalMB: number;
        rssMB: number;
    };
    uptime: number;
}
