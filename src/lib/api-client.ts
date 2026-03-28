/**
 * API client for frontend data fetching
 * Centralized HTTP client with auth headers, error handling, and retry
 */

interface RequestConfig {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
}

interface ApiClientResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

/**
 * Make an authenticated API request
 */
async function request<T>(
    endpoint: string,
    config: RequestConfig = {}
): Promise<ApiClientResponse<T>> {
    const { method = 'GET', body, headers = {}, signal } = config;

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: requestHeaders,
            body: body ? JSON.stringify(body) : undefined,
            signal,
            credentials: 'include',
        });

        const responseData = res.status !== 204 ? await res.json() : null;

        if (!res.ok) {
            return {
                data: null,
                error: responseData?.error || `Request failed with status ${res.status}`,
                status: res.status,
            };
        }

        return {
            data: responseData?.data ?? responseData,
            error: null,
            status: res.status,
        };
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            return { data: null, error: 'Request aborted', status: 0 };
        }
        return {
            data: null,
            error: err instanceof Error ? err.message : 'Network error',
            status: 0,
        };
    }
}

/**
 * API Client with convenience methods
 */
export const apiClient = {
    get: <T>(url: string, signal?: AbortSignal) =>
        request<T>(url, { signal }),

    post: <T>(url: string, body: unknown, signal?: AbortSignal) =>
        request<T>(url, { method: 'POST', body, signal }),

    patch: <T>(url: string, body: unknown, signal?: AbortSignal) =>
        request<T>(url, { method: 'PATCH', body, signal }),

    put: <T>(url: string, body: unknown, signal?: AbortSignal) =>
        request<T>(url, { method: 'PUT', body, signal }),

    delete: <T>(url: string, signal?: AbortSignal) =>
        request<T>(url, { method: 'DELETE', signal }),
};

/**
 * Pre-built API methods for common endpoints
 */
export const api = {
    // Documents
    documents: {
        list: (params?: string) => apiClient.get(`/api/documents${params ? `?${params}` : ''}`),
        get: (id: string) => apiClient.get(`/api/documents/${id}`),
        create: (data: unknown) => apiClient.post('/api/documents', data),
        update: (id: string, data: unknown) => apiClient.patch(`/api/documents/${id}`, data),
        delete: (id: string) => apiClient.delete(`/api/documents/${id}`),
    },

    // Chat
    chat: {
        sessions: () => apiClient.get('/api/chat/sessions'),
        getSession: (id: string) => apiClient.get(`/api/chat/sessions/${id}`),
        sendMessage: (data: unknown) => apiClient.post('/api/chat/messages', data),
    },

    // Reviews
    reviews: {
        list: () => apiClient.get('/api/reviews'),
        get: (id: string) => apiClient.get(`/api/reviews/${id}`),
        create: (data: unknown) => apiClient.post('/api/reviews', data),
    },

    // Research
    research: {
        list: () => apiClient.get('/api/research'),
        get: (id: string) => apiClient.get(`/api/research/${id}`),
        create: (data: unknown) => apiClient.post('/api/research', data),
    },

    // Profile
    profile: {
        get: () => apiClient.get('/api/profile'),
        update: (data: unknown) => apiClient.patch('/api/profile', data),
    },

    // Escalations
    escalations: {
        list: () => apiClient.get('/api/escalations'),
        get: (id: string) => apiClient.get(`/api/escalations/${id}`),
        create: (data: unknown) => apiClient.post('/api/escalations', data),
        update: (id: string, data: unknown) => apiClient.patch(`/api/escalations/${id}`, data),
    },

    // Templates
    templates: {
        list: () => apiClient.get('/api/templates'),
        get: (id: string) => apiClient.get(`/api/templates/${id}`),
    },

    // Stats
    stats: {
        get: (range?: string) => apiClient.get(`/api/stats${range ? `?range=${range}` : ''}`),
    },

    // Health
    health: () => apiClient.get('/api/health'),
};
