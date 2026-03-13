# API Documentation

## Base URL

```
https://legalai.app/api
```

All API endpoints require authentication via NextAuth session cookies unless otherwise noted.

## Endpoints

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | System health check with database, memory, and service status |

### Documents

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/documents` | Yes | List user's documents (supports `limit`, `sort` query params) |
| POST | `/api/documents` | Yes | Create/generate a new document |
| GET | `/api/documents/[id]` | Yes | Get a specific document |
| PATCH | `/api/documents/[id]` | Yes | Update a document |
| DELETE | `/api/documents/[id]` | Yes | Soft-delete a document |

### Chat

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/chat` | Yes | List user's chat sessions |
| POST | `/api/chat` | Yes | Send a message (creates session if needed) |
| DELETE | `/api/chat/[id]` | Yes | Delete a chat session |

### Contract Review

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/review` | Yes | Submit a contract for AI review |
| GET | `/api/review` | Yes | List user's contract reviews |

### Legal Research

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/research` | Yes | Conduct AI-powered legal research |

### Escalations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/escalations` | Yes | List user's lawyer escalations |
| POST | `/api/escalations` | Yes | Create a new escalation |
| PATCH | `/api/escalations/[id]` | Yes | Update escalation status |

### Statistics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stats` | Yes | Dashboard statistics (`range`: 7d, 30d, 90d) |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | Yes | Get user profile and usage counts |
| PATCH | `/api/profile` | Yes | Update user profile (name) |

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/notifications` | Yes | List notifications (`unread=true` filter) |
| PATCH | `/api/notifications` | Yes | Mark all notifications as read |

### Data Export

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/export` | Yes | Export data (`format`: json/csv, `type`: documents/reviews) |

### Activity & Search

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/activity` | Yes | User activity log |
| GET | `/api/search` | Yes | Global search across documents, chats, reviews |

## Response Format

All API responses follow this structure:

```json
{
  "data": {},
  "error": "Error message (only on failure)",
  "count": 10
}
```

## Error Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Not authenticated |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

## Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| General API | 60 requests/minute |
| Authentication | 10 requests/minute |
| AI Operations | 20 requests/minute |
