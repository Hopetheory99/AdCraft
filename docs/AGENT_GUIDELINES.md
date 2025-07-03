# AdCraft Agent Operational Guidelines

This document provides the mandatory operational guidelines for all AI agents contributing to the AdCraft v2 project. Adherence to these guidelines is critical for maintaining code quality, project velocity, and seamless collaboration.

## 1. Core Principles

1.  **Truthful Documentation:** The `docs` directory is the source of truth. Before taking any action, consult the `AdCraft - Technical Architecture.md` and other relevant documents. If the documentation is outdated, your first priority is to update it.
2.  **Incremental & Verifiable Changes:** Make small, atomic commits. Each commit should represent a single logical change. All new code must be accompanied by corresponding tests.
3.  **Security First:** All code must be written with security as the primary consideration. Follow the security best practices outlined in the technical architecture.
4.  **Log Everything:** Every significant action, decision, or observation must be recorded in the project logbook.

## 2. Logbook Protocol

- Before starting any task, create a new logbook entry in the `/logbook` directory.
- Use the format `YYYY-MM-DD-TASK-ID-Short-Description.md`.
- The log entry must detail the task, the plan, the actions taken, and the outcome.
- Reference the relevant task from the `PROJECT_BOARD.md`.

## 3. Task Management Protocol

- All work must correspond to a task on the `PROJECT_BOARD.md`.
- Before starting work, move the relevant task from the "To Do" column to the "In Progress" column and assign yourself to it.
- Upon completion, move the task to the "Done" column and link to the corresponding logbook entry.

## 4. Coding Standards

- **Frameworks:** Strictly adhere to the frameworks specified in the technical architecture (NestJS for backend, React for frontend).
- **Typing:** The `any` type is strictly forbidden. Use specific types for all variables, functions, and data structures.
- **Error Handling:** Implement robust and centralized error handling. Do not use generic `try/catch` blocks without specific error types.
- **Configuration:** No hardcoded secrets, URLs, or other configuration values. Use environment variables for all configuration.

## 5. Commit Message Format

All commit messages must follow the Conventional Commits specification. This is not optional.

- **Format:** `<type>(<scope>): <subject>`
- **Example:** `feat(auth-service): implement JWT refresh token rotation`
- **Types:** `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `perf`, `refactor`, `revert`, `style`, `test`.

By following these guidelines, we ensure that the AdCraft v2 project is built on a foundation of discipline, clarity, and quality.
