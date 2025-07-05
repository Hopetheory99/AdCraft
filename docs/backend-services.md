# AdCraft Backend Services

This directory outlines core backend microservices used by the AdCraft platform. Each service is implemented with NestJS and can be run individually.

## Services

- **API Gateway** (`packages/api-gateway`)

  - Routes incoming requests to underlying services.
  - Validates JWT tokens for protected routes.
  - Handles errors and proxies traffic using `http-proxy-middleware`.

- **Authentication Service** (`packages/auth-service`)

  - Provides `/register`, `/login`, `/refresh` and `/users` endpoints.
  - Issues JWT access and refresh tokens.
  - Persists users via a database using TypeORM.
  - Set `DB_SYNC` to `true` for local development if you want TypeORM to
    synchronize entities with the database schema. **Never enable this in
    production.**

- **Asset Service** (`packages/asset-service`)

  - Handles file uploads via `/upload` and downloads via `/download/:key`.
  - Integrates with S3-compatible storage such as LocalStack.

- **Ad Service** (`packages/ad-service`)

  - Basic CRUD endpoints for ads.

- **Template Service** (`packages/template-service`)
  - CRUD endpoints for ad templates.

Each service exposes a NestJS application and has accompanying Jest tests.

## MCP Servers

Configuration files for Context7 and Sequential Thinking reside in the `docs` folder as `context7-config.json` and `sequential-thinking-config.json`. These files are used to coordinate persistent context between collaborative agents.
