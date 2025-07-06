# AdCraft Backend Services

This directory outlines core backend microservices used by the AdCraft platform. Each service is implemented with NestJS and can be run individually. Currently only the authentication service has been created.

## Services

- **API Gateway** (`packages/api-gateway`)

  - Routes incoming requests to underlying services.
  - Validates JWT tokens for protected routes.
  - Handles errors and proxies traffic using `http-proxy-middleware`.
  - *Planned: this service has not yet been implemented.*

- **Authentication Service** (`packages/auth-service`)

  - Provides `/register`, `/login`, `/refresh` and `/users` endpoints.
  - Issues JWT access and refresh tokens.

- **Asset Service** (`packages/asset-service`)

  - Handles file uploads via `/upload` and downloads via `/download/:key`.
  - Integrates with S3-compatible storage such as LocalStack.
  - *Planned: not yet implemented.*

- **Ad Service** (`packages/ad-service`)

  - Basic CRUD endpoints for ads.
  - *Planned: not yet implemented.*

- **Template Service** (`packages/template-service`)
  - CRUD endpoints for ad templates.
  - *Planned: not yet implemented.*

Each service exposes a NestJS application and has accompanying Jest tests.

## MCP Servers

Configuration files for Context7 and Sequential Thinking reside in the `docs` folder as `context7-config.json` and `sequential-thinking-config.json`. These files are used to coordinate persistent context between collaborative agents.

## Extending `docker-compose.yml`

The root `docker-compose.yml` currently contains only the `frontend` and `auth-service` containers along with supporting databases. When implementing additional services listed above, copy the configuration style used for `auth-service` and uncomment the relevant sections. Each new service should:

1. Build using `Dockerfile.backend`.
2. Expose its port under the `ports` section.
3. Mount its source directory under `./src/backend/services/<service-name>`.
4. Join the `adcraft-network` network.

Remember to update any environment variables in `frontend` that reference API endpoints.
