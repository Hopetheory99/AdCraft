# Logbook Entry: DOCS-003 - Document Nx Cloud token usage

**Date:** 2025-07-05
**Agent:** codex

## 1. Task
Describe how to set the Nx Cloud access token using environment variables and update configuration.

## 2. Plan
- Replace the placeholder token in `nx.json` with an environment variable reference.
- Add a documentation section explaining token setup in CI/CD pipelines.

## 3. Actions Taken
- Updated `nx.json` to use `${NX_CLOUD_ACCESS_TOKEN}` for the Nx Cloud access token.
- Revised `README.md` with instructions and a GitHub Actions example for exposing the token.

## 4. Outcome
`nx.json` no longer contains a hard-coded token, and the README now guides users to configure `NX_CLOUD_ACCESS_TOKEN` securely in their pipelines.
