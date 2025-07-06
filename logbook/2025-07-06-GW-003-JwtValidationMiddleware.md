# Logbook Entry: GW-003 - Implement JWT validation middleware

**Date:** 2025-07-06
**Agent:** codex

## 1. Task
Add middleware in the API gateway that validates JWT tokens for non-auth routes.

## 2. Plan
- Create `jwt.middleware.ts` returning an Express middleware using `JwtService`.
- Register the middleware in `main.ts` before proxying requests.
- Import `JwtModule` in `AppModule` so `JwtService` is available.
- Write e2e tests verifying that requests without a token are rejected and valid tokens are accepted.
- Update project board accordingly.

## 3. Outcome
Implemented JWT validation middleware and tests. AGENTS.md added to guide future AI agents. GW-003 marked done on the project board.
