# AdCraft Backend Services

This directory outlines core backend microservices used by the AdCraft platform. Each service is implemented with Express and can be run individually.

## Services

- **API Gateway** (`packages/api-gateway`)

  - Routes incoming requests to underlying services.
  - Validates JWT tokens for protected routes.
  - Handles errors and proxies traffic using `http-proxy-middleware`.

- **Authentication Service** (`packages/auth-service`)

  - Provides `/register`, `/login`, `/refresh` and `/users` endpoints.
  - Issues JWT access and refresh tokens.
  - Stores users in memory (for demo purposes).

- **Asset Service** (`packages/asset-service`)

  - Handles file uploads via `/upload` and downloads via `/download/:key`.
  - Integrates with S3-compatible storage such as LocalStack.

- **Ad Service** (`packages/ad-service`)

  - Basic CRUD endpoints for ads.

- **Template Service** (`packages/template-service`)
  - CRUD endpoints for ad templates.

Each service exposes a simple Express application and has accompanying Jest tests.

## MCP Servers

Configuration files for Context7 and Sequential Thinking reside in the `docs` folder as `context7-config.json` and `sequential-thinking-config.json`. These files are used to coordinate persistent context between collaborative agents.
