# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes        |

## Reporting a Vulnerability

If you discover a security vulnerability in LegalAI, please report it responsibly:

1. **Do NOT** open a public issue
2. Email: security@legalai.app
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and aim to resolve critical issues within 7 days.

## Security Measures

LegalAI implements the following security practices:

- **Authentication**: NextAuth.js with JWT token validation
- **Authorization**: Middleware-based route protection
- **Input Sanitization**: XSS prevention on all user inputs
- **Rate Limiting**: API endpoint protection against abuse
- **CSRF Protection**: Built-in Next.js CSRF handling
- **SQL Injection**: Prisma ORM with parameterized queries
- **Environment Validation**: Startup checks for required secrets
- **Data Privacy**: User data isolation and GDPR-aware design
