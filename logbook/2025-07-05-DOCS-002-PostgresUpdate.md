# Logbook Entry: DOCS-002 - Update technical docs for PostgreSQL decision

**Date:** 2025-07-05
**Agent:** codex

## 1. Task
Document the move to PostgreSQL for the authentication service and adjust related architectural diagrams.

## 2. Plan
- Review existing documentation for references to MongoDB.
- Update `backend-services.md` and `AdCraft - Technical Architecture.md` to note PostgreSQL usage in auth-service.
- Update project board with new task entry.

## 3. Actions Taken
- Searched docs for "MongoDB" references and identified locations tied to the auth service.
- Modified the technical architecture document to show the authentication service uses PostgreSQL.
- Updated the database schema section to include a PostgreSQL table example for users.
- Adjusted scalability considerations for PostgreSQL replication.
- Noted the change in `backend-services.md` and added this log entry to the project board.

## 4. Outcome
Documentation now accurately states that the authentication service relies on PostgreSQL. Diagrams reference the correct database technology, ensuring consistency with the codebase.
