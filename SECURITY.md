# Security Policy

This document outlines security policies and best practices for the AdCraft platform.

## Reporting a Vulnerability

If you discover a security vulnerability within AdCraft, please report it immediately by contacting [security@adcraft.com](mailto:security@adcraft.com). We kindly request that you do not disclose the vulnerability publicly until we have had a chance to address it.

## Best Practices

### Secret Management

All sensitive information, such as API keys, database credentials, and JWT secrets, **must not be hardcoded** directly into the codebase. Instead, they should be managed through environment variables or dedicated secret management solutions.

*   **Development:** Use `.env` files (e.g., `packages/auth-service/.env`) for local development. These files are `.gitignore`d to prevent accidental commitment to version control.
*   **Production:** For production deployments, leverage secure environment variables provided by your hosting platform (e.g., Kubernetes Secrets, AWS Secrets Manager, Azure Key Vault, Google Secret Manager).

### Input Validation

All incoming API requests are subject to strict input validation using `class-validator` and NestJS `ValidationPipe`. This helps prevent common vulnerabilities such as injection attacks and ensures data integrity.

### Authentication and Authorization

*   **Password Hashing:** User passwords are never stored in plain text. They are securely hashed using `bcrypt` before being stored in the database.
*   **JWTs:** JSON Web Tokens (JWTs) are used for authentication. Access tokens are short-lived, and refresh tokens are used to obtain new access tokens.
*   **Refresh Token Rotation:** Refresh tokens are rotated upon use to enhance security and mitigate the risk of token compromise.
*   **Protected Routes:** All sensitive API endpoints are protected using JWT authentication guards.

### Dependency Management

Dependencies are regularly updated to mitigate known vulnerabilities. We use `npm audit` to identify and address security issues in third-party packages.

### Data Protection

Sensitive user data is handled with care and stored securely in the database. Access to production databases is restricted to authorized personnel only.

## Future Improvements

*   Implement comprehensive logging and monitoring for security events.
*   Regular security audits and penetration testing.
*   Introduce rate limiting on authentication endpoints to prevent brute-force attacks.
*   Implement a robust refresh token revocation mechanism (e.g., blacklisting compromised tokens).
