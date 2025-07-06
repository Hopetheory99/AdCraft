# Logbook Entry: GW-002 - Implement dynamic service discovery

**Date:** 2025-07-06
**Agent:** codex

## 1. Task
Implement dynamic service discovery in the `api-gateway` so that it can proxy requests to services defined via environment variables.

## 2. Plan
- Add `http-proxy-middleware` dependency.
- Implement a helper to read `SERVICE_ROUTES` (e.g., `auth=http://localhost:3001`) and register proxy middleware for each route.
- Update `main.ts` to invoke this helper during bootstrap.
- Document the new environment variable in the Implementation Guide.
- Write an e2e test spinning up a fake service to verify proxying works.
- Mark GW-002 as done on the project board.

## 3. Outcome
Added proxy helper reading `SERVICE_ROUTES` env var and created integration test verifying that requests are forwarded to a stub service. Updated docs and project board accordingly.
