# Agent Instructions

These guidelines summarize how AI agents should operate within this repository. They apply to the entire project.

## Required Reading
- `docs/AGENT_GUIDELINES.md` – comprehensive rules for commits, logbook usage, and security practices.
- `docs/project_files/AdCraft - Implementation Guide.md` – details on service setup and environment variables.

## Workflow
1. Ensure a corresponding task exists in `PROJECT_BOARD.md`.
2. Before starting work, move the task to **In Progress** and create a logbook entry under `logbook/` using the format `YYYY-MM-DD-TASKID-Description.md`.
3. Keep documentation in `docs/` synchronized with code changes.
4. After completing the task, update `PROJECT_BOARD.md` (move to **Done**) and reference the logbook entry.

## Coding
- Use NestJS for backend services and React for frontend as specified in the architecture.
- No hardcoded secrets or configuration. Use environment variables for items like database credentials or JWT keys.
- Strict TypeScript settings; avoid the `any` type.
- Follow the commit format `<type>(<scope>): <subject>` from Conventional Commits.

## Programmatic Checks
Run formatting, linting, and tests for any affected projects before committing:

```bash
npx nx format:write
npx nx lint <project> --fix
npx nx test <project>
```

Replace `<project>` with each package you modify (e.g., `auth-service`, `api-gateway`).

Failure to follow these guidelines may result in rejected contributions.
